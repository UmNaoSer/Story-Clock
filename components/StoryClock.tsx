
import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, WheelEvent as ReactWheelEvent, TouchEvent as ReactTouchEvent } from 'react';
import { StoryBeat, StoryConnection, BeatStyle, BeatSize, TextDisplayMode } from '../types';

const PRESET_COLORS = [
  '#fcd34d', // Stellar Gold
  '#f87171', // Red
  '#60a5fa', // Blue
  '#4ade80', // Green
  '#c084fc', // Purple
  '#fb923c', // Orange
  '#f472b6', // Pink
  '#ffffff', // White
];

// Darker colors for light mode visibility
const LIGHT_MODE_COLORS = [
    '#d97706', // Amber 600
    '#dc2626', // Red 600
    '#2563eb', // Blue 600
    '#16a34a', // Green 600
    '#9333ea', // Purple 600
    '#ea580c', // Orange 600
    '#db2777', // Pink 600
    '#000000', // Black
];

interface ClockMarker {
  id: string;
  label: string;
  angle: number;
}

interface ViewState {
  x: number;
  y: number;
  scale: number;
}

type ViewMode = 'clock' | 'linear';
type InteractionMode = 'idle' | 'panning' | 'zooming' | 'dragging';

interface StoryClockProps {
    isDarkMode: boolean;
}

const StoryClock: React.FC<StoryClockProps> = ({ isDarkMode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('clock');
  const [beats, setBeats] = useState<StoryBeat[]>([]);
  const [connections, setConnections] = useState<StoryConnection[]>([]);
  
  // Clock Markers State
  const [markers, setMarkers] = useState<ClockMarker[]>(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: `marker-${i}`,
      label: i === 0 ? '12' : i.toString(),
      angle: i * 30
    }));
  });
  
  const [isClockLocked, setIsClockLocked] = useState(true);
  const [selectedBeatId, setSelectedBeatId] = useState<string | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [hoveredBeatId, setHoveredBeatId] = useState<string | null>(null);

  // Navigation State - increased default scale for bigger initial view
  const [viewState, setViewState] = useState<ViewState>({ x: 0, y: 0, scale: 1.3 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [touchMode, setTouchMode] = useState<InteractionMode>('idle');
  
  // Preset State
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customPresetValue, setCustomPresetValue] = useState('');

  // Dragging state for Items
  const [draggingTarget, setDraggingTarget] = useState<{ type: 'beat' | 'marker', id: string } | null>(null);
  
  const wasDraggingRef = useRef(false);
  const panStartRef = useRef<{ x: number, y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotation Slider Ref
  const rotationSliderRef = useRef<HTMLInputElement>(null);
  const lastRotationValueRef = useRef<number>(0);

  // Touch Gesture Refs
  const touchStartDistRef = useRef<number>(0);
  const startScaleRef = useRef<number>(1);

  // Constants for sizing
  const VIEWBOX_SIZE = 500;
  const VIEWBOX_HALF = VIEWBOX_SIZE / 2;
  const CLOCK_RADIUS = 100;
  const TEXT_DISTANCE = 40;
  
  // Linear constants
  const LINEAR_WIDTH = 400;
  const LINEAR_HEIGHT = 200;

  // Colors based on theme
  const activeColors = isDarkMode ? PRESET_COLORS : LIGHT_MODE_COLORS;
  const primaryTextColor = isDarkMode ? '#d8b4fe' : '#475569'; // light-nebula vs slate-600
  const accentTextColor = isDarkMode ? '#fcd34d' : '#ea580c'; // stellar-gold vs orange-600
  const strokeColor = isDarkMode ? '#d8b4fe' : '#94a3b8';
  const labelColor = isDarkMode ? '#ffffff' : '#000000';
  const beatFillColor = isDarkMode ? '#1e1b4b' : '#ffffff';

  // --- Keyboard Listeners (Spacebar) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        if ((e.target as HTMLElement).tagName !== 'TEXTAREA' && (e.target as HTMLElement).tagName !== 'INPUT') {
             e.preventDefault(); 
             setIsSpacePressed(true);
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // --- Helper: Coordinate Systems ---

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Convert Time (0-360) + Y (0-100) to Linear XY
  const linearMapping = (timeAngle: number, intensityY: number = 50) => {
    // Map 0-360 angle to -LINEAR_WIDTH/2 to +LINEAR_WIDTH/2
    const x = ((timeAngle / 360) * LINEAR_WIDTH) - (LINEAR_WIDTH / 2);
    
    // Map 0-100 Y to LINEAR_HEIGHT/2 to -LINEAR_HEIGHT/2 (SVG Y is down)
    // 100 intensity = Top (-height/2), 0 intensity = Bottom (+height/2)
    const y = ((LINEAR_HEIGHT / 2) - ((intensityY / 100) * LINEAR_HEIGHT));
    
    return { x, y };
  };

  const getLocalCoordinates = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const svg = svgRef.current;
    
    // Create an SVGPoint for math
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;

    // Get the global matrix for the SVG element
    const globalMatrix = svg.getScreenCTM();
    if (!globalMatrix) return { x: 0, y: 0 };

    // Transform screen coordinate to SVG ViewBox coordinate
    const svgPoint = pt.matrixTransform(globalMatrix.inverse());

    // Apply the internal Pan/Zoom (ViewState) transformation
    // Because the <g> is transformed by translate(x,y) scale(s), 
    // the inverse is: (p - translate) / scale
    const x = (svgPoint.x - viewState.x) / viewState.scale;
    const y = (svgPoint.y - viewState.y) / viewState.scale;
    
    return { x, y };
  };

  const getTouchDistance = (touches: React.TouchList) => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  };

  // --- Shared Drag Logic ---
  
  const updateDragPosition = (clientX: number, clientY: number) => {
      if (!draggingTarget) return;

      wasDraggingRef.current = true;
      const { x, y } = getLocalCoordinates(clientX, clientY);

      if (draggingTarget.type === 'beat') {
          let angle = 0;
          let newY = 50;

          if (viewMode === 'clock') {
              angle = Math.atan2(y, x) * (180 / Math.PI);
              angle += 90;
              if (angle < 0) angle += 360;
              
              // Only update angle in clock mode, preserve Y
              setBeats(prev => prev.map(b => b.id === draggingTarget.id ? { ...b, timeAngle: angle } : b));
          } else {
               // Linear Dragging
               const halfW = LINEAR_WIDTH / 2;
               // Clamp X to graph bounds
               const clampedX = Math.max(-halfW, Math.min(halfW, x));
               
               // Map visual X back to 0-360 Angle
               angle = ((clampedX + halfW) / LINEAR_WIDTH) * 360;

               const halfH = LINEAR_HEIGHT / 2;
               // Clamp Y to graph bounds
               const clampedY = Math.max(-halfH, Math.min(halfH, y));
               
               // Map visual Y back to 0-100 Intensity
               newY = ((halfH - clampedY) / LINEAR_HEIGHT) * 100;

               setBeats(prev => prev.map(b => b.id === draggingTarget.id ? { ...b, timeAngle: angle, y: newY } : b));
          }

      } else if (draggingTarget.type === 'marker') {
          let angle = 0;
          if (viewMode === 'clock') {
            angle = Math.atan2(y, x) * (180 / Math.PI);
            angle += 90;
            if (angle < 0) angle += 360;
          } else {
             const halfW = LINEAR_WIDTH / 2;
             const clampedX = Math.max(-halfW, Math.min(halfW, x));
             angle = ((clampedX + halfW) / LINEAR_WIDTH) * 360;
          }
          setMarkers(prev => prev.map(m => m.id === draggingTarget.id ? { ...m, angle } : m));
      }
  };

  // --- Interaction Handlers ---

  const handleWheel = (e: ReactWheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const zoomSensitivity = 0.001;
    const newScale = Math.min(Math.max(viewState.scale - (e.deltaY * zoomSensitivity * viewState.scale), 0.1), 5);
    setViewState(prev => ({ ...prev, scale: newScale }));
  };

  // --- Touch Logic (Mobile) ---

  const handleTouchStart = (e: ReactTouchEvent) => {
    // 2 Fingers = Zoom
    if (e.touches.length === 2) {
      setTouchMode('zooming');
      touchStartDistRef.current = getTouchDistance(e.touches);
      startScaleRef.current = viewState.scale;
      return;
    }
  };

  const handleTouchStartItem = (e: ReactTouchEvent, type: 'beat' | 'marker', id: string) => {
      e.stopPropagation(); // Stop bubbling to SVG
      
      // Select the item
      if (type === 'beat') handleSelectBeat(id);
      else handleSelectMarker(id);

      // Start Dragging
      setDraggingTarget({ type, id });
      setTouchMode('dragging');
      wasDraggingRef.current = false;
  };

  const handleTouchMove = (e: ReactTouchEvent) => {
    if (touchMode === 'zooming' && e.touches.length === 2) {
      e.preventDefault(); // Stop browser zoom
      const newDist = getTouchDistance(e.touches);
      const scaleFactor = newDist / touchStartDistRef.current;
      const newScale = Math.min(Math.max(startScaleRef.current * scaleFactor, 0.1), 5);
      setViewState(prev => ({ ...prev, scale: newScale }));
    } else if (touchMode === 'dragging' && draggingTarget) {
      e.preventDefault(); // Stop Scroll
      const touch = e.touches[0];
      updateDragPosition(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setTouchMode('idle');
    setDraggingTarget(null);
    setTimeout(() => { wasDraggingRef.current = false; }, 50);
  };

  // --- Mouse / Generic Input Logic ---

  const handleSvgMouseDown = (e: ReactMouseEvent) => {
      if (isSpacePressed) {
        setIsPanning(true);
        panStartRef.current = { x: e.clientX, y: e.clientY };
        return;
      }
      if ((e.target as Element).closest('.interactive-element')) return;
  };

  const handleSvgClick = (e: ReactMouseEvent<SVGSVGElement>) => {
    // Prevent adding beats if we were doing something else
    if (wasDraggingRef.current || isPanning || isSpacePressed || touchMode !== 'idle') {
        wasDraggingRef.current = false;
        return;
    }

    if ((e.target as Element).closest('.interactive-element')) return;
    
    // Create Beat logic
    const { x, y } = getLocalCoordinates(e.clientX, e.clientY);
      
    let angle = 0;
    let linearY = 50;

    if (viewMode === 'clock') {
        angle = Math.atan2(y, x) * (180 / Math.PI);
        angle += 90; 
        if (angle < 0) angle += 360;
    } else {
        // Linear mode calculation
        const constrainedX = Math.max(-LINEAR_WIDTH/2, Math.min(LINEAR_WIDTH/2, x));
        angle = ((constrainedX + (LINEAR_WIDTH/2)) / LINEAR_WIDTH) * 360;

        const constrainedY = Math.max(-LINEAR_HEIGHT/2, Math.min(LINEAR_HEIGHT/2, y));
        linearY = (((LINEAR_HEIGHT / 2) - constrainedY) / LINEAR_HEIGHT) * 100;
    }

    const newBeat: StoryBeat = {
        id: crypto.randomUUID(),
        title: 'Novo Beat',
        timeAngle: angle,
        y: linearY,
        color: activeColors[Math.floor(Math.random() * activeColors.length)],
        style: 'dot',
        size: 'medium',
        textMode: 'visible',
    };
    
    setBeats([...beats, newBeat]);
    handleSelectBeat(newBeat.id);
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
      // Only handle Mouse movements here. Touch moves are handled in handleTouchMove
      if (isPanning && panStartRef.current && touchMode === 'idle') {
          const dx = e.clientX - panStartRef.current.x;
          const dy = e.clientY - panStartRef.current.y;
          
          setViewState(prev => ({
              ...prev,
              x: prev.x + dx,
              y: prev.y + dy
          }));

          panStartRef.current = { x: e.clientX, y: e.clientY };
          return;
      }

      if (draggingTarget && !isSpacePressed && touchMode === 'idle') {
          updateDragPosition(e.clientX, e.clientY);
      }
  };

  const handleGlobalMouseUp = () => {
     if (touchMode === 'idle') {
        setIsPanning(false);
        setDraggingTarget(null);
        panStartRef.current = null;
        setTimeout(() => { wasDraggingRef.current = false; }, 50);
     }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isPanning, draggingTarget, isSpacePressed, viewState, touchMode, viewMode]);

  const handleMouseDownBeat = (e: ReactMouseEvent, beatId: string) => {
    e.stopPropagation();
    if (isSpacePressed || touchMode === 'panning') return; 

    wasDraggingRef.current = false;
    handleSelectBeat(beatId);
    setDraggingTarget({ type: 'beat', id: beatId });
  };

  const handleMouseDownMarker = (e: ReactMouseEvent, markerId: string) => {
    e.stopPropagation();
    if (isSpacePressed || touchMode === 'panning') return;

    wasDraggingRef.current = false;
    handleSelectMarker(markerId);
    if (!isClockLocked) {
        setDraggingTarget({ type: 'marker', id: markerId });
    }
  };

  const handleSelectBeat = (id: string) => {
      setSelectedBeatId(id);
      setSelectedMarkerId(null); 
  };

  const handleSelectMarker = (id: string) => {
      setSelectedMarkerId(id);
      setSelectedBeatId(null); 
  };

  // Actions
  const toggleConnection = (targetId: string) => {
    if (!selectedBeatId || selectedBeatId === targetId) return;

    const existingIndex = connections.findIndex(
      c => (c.fromBeatId === selectedBeatId && c.toBeatId === targetId) ||
           (c.fromBeatId === targetId && c.toBeatId === selectedBeatId)
    );

    if (existingIndex >= 0) {
      setConnections(prev => prev.filter((_, i) => i !== existingIndex));
    } else {
      setConnections(prev => [...prev, {
        id: crypto.randomUUID(),
        fromBeatId: selectedBeatId,
        toBeatId: targetId
      }]);
    }
  };

  const deleteSelectedBeat = () => {
    if (!selectedBeatId) return;
    setBeats(prev => prev.filter(b => b.id !== selectedBeatId));
    setConnections(prev => prev.filter(c => c.fromBeatId !== selectedBeatId && c.toBeatId !== selectedBeatId));
    setSelectedBeatId(null);
  };

  const deleteSelectedMarker = () => {
      if (!selectedMarkerId) return;
      setMarkers(prev => prev.filter(m => m.id !== selectedMarkerId));
      setSelectedMarkerId(null);
  }

  const addNewMarker = () => {
      const newMarker: ClockMarker = {
          id: crypto.randomUUID(),
          label: 'H',
          angle: 0 // Starts at 12 o'clock
      };
      setMarkers([...markers, newMarker]);
      handleSelectMarker(newMarker.id);
  }

  const applyPreset = (type: '2' | '3' | '4' | '12' | 'custom', customCount?: number) => {
    let newMarkers: ClockMarker[] = [];
    
    if (type === '2') {
        newMarkers = [
            { id: crypto.randomUUID(), label: '12', angle: 0 },
            { id: crypto.randomUUID(), label: '6', angle: 180 },
        ];
    } else if (type === '3') {
        newMarkers = [
            { id: crypto.randomUUID(), label: '12', angle: 0 },
            { id: crypto.randomUUID(), label: '4', angle: 120 },
            { id: crypto.randomUUID(), label: '8', angle: 240 },
        ];
    } else if (type === '4') {
        newMarkers = [
            { id: crypto.randomUUID(), label: '12', angle: 0 },
            { id: crypto.randomUUID(), label: '3', angle: 90 },
            { id: crypto.randomUUID(), label: '6', angle: 180 },
            { id: crypto.randomUUID(), label: '9', angle: 270 },
        ];
    } else if (type === '12') {
         newMarkers = Array.from({ length: 12 }).map((_, i) => ({
            id: `marker-${i}`,
            label: i === 0 ? '12' : i.toString(),
            angle: i * 30
        }));
    } else if (type === 'custom') {
        const count = customCount || 0;
        
        if (count > 0 && count <= 60) {
            newMarkers = Array.from({ length: count }).map((_, i) => ({
                id: `marker-c-${i}`,
                label: (i + 1).toString(),
                angle: i * (360 / count)
            }));
        } else {
             // If input is invalid, just close without changing
             setShowCustomInput(false);
             return;
        }
    }
    
    setMarkers(newMarkers);
    setPresetsOpen(false);
    setShowCustomInput(false);
    setCustomPresetValue('');
  };

  const handleStructureRotation = (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentValue = Number(e.target.value);
      const delta = currentValue - lastRotationValueRef.current;
      
      // Update all markers by the delta
      setMarkers(prev => prev.map(m => {
          let newAngle = m.angle + delta;
          if (newAngle >= 360) newAngle -= 360;
          if (newAngle < 0) newAngle += 360;
          return { ...m, angle: newAngle };
      }));

      lastRotationValueRef.current = currentValue;
  };

  // --- Export / Import Logic ---

  const handleExport = () => {
    const data = {
        beats,
        markers,
        connections
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `story-clock-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const result = event.target?.result as string;
              const data = JSON.parse(result);
              
              if (data.beats && Array.isArray(data.beats)) setBeats(data.beats);
              if (data.markers && Array.isArray(data.markers)) setMarkers(data.markers);
              if (data.connections && Array.isArray(data.connections)) setConnections(data.connections);
              
              setSelectedBeatId(null);
              setSelectedMarkerId(null);
              
              if (fileInputRef.current) fileInputRef.current.value = '';
              
          } catch (err) {
              console.error("Failed to import Story Clock data", err);
              alert("Erro ao importar arquivo. Verifique se é um arquivo JSON válido do Story Clock.");
          }
      };
      reader.readAsText(file);
  };

  // --- Styles & Rendering Helpers ---

  const getBeatSize = (size: BeatSize, style: BeatStyle) => {
      if (style === 'dot') {
          switch(size) {
              case 'small': return 4;
              case 'medium': return 7;
              case 'large': return 12;
              default: return 6;
          }
      } else {
          switch(size) {
              case 'small': return { length: 10, width: 2 };
              case 'medium': return { length: 20, width: 4 };
              case 'large': return { length: 30, width: 6 };
              default: return { length: 20, width: 4 };
          }
      }
  };

  const renderSvgText = (text: string, x: number, y: number, opacity: number) => {
    const lines = text.split('\n');
    return (
        <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={labelColor}
            fontSize="10"
            fontFamily="sans-serif"
            fontWeight="bold"
            opacity={opacity}
            className="transition-colors pointer-events-none drop-shadow-md select-none"
            style={{ textShadow: isDarkMode ? '0 0 4px #000000' : '0 0 2px #ffffff' }}
        >
            {lines.map((line, i) => (
                <tspan key={i} x={x} dy={i === 0 ? -(lines.length - 1) * 6 : "1.2em"}>
                    {line}
                </tspan>
            ))}
        </text>
    );
  };

  const sortedBeats = [...beats].sort((a, b) => {
      const aScore = (a.id === selectedBeatId ? 2 : 0) + (a.id === hoveredBeatId ? 1 : 0);
      const bScore = (b.id === selectedBeatId ? 2 : 0) + (b.id === hoveredBeatId ? 1 : 0);
      return aScore - bScore;
  });

  const selectedBeat = beats.find(b => b.id === selectedBeatId);
  const selectedMarker = markers.find(m => m.id === selectedMarkerId);
  
  let cursorStyle = 'cursor-default';
  if (isSpacePressed || touchMode === 'panning') cursorStyle = 'cursor-grabbing';
  else if (touchMode === 'dragging') cursorStyle = 'cursor-grabbing';
  else if (touchMode === 'idle' && !isSpacePressed) cursorStyle = 'cursor-default';

  // Dynamic Styles
  const containerClass = isDarkMode ? "bg-black/20 border-white/5" : "bg-white border-gray-200 shadow-xl";
  const sidebarItemClass = isDarkMode ? "bg-cosmic-purple/30 border-indigo-500/20" : "bg-white border-gray-200 shadow-sm";
  const inputClass = isDarkMode ? "bg-gray-900/50 border-indigo-500/30 text-white" : "bg-gray-50 border-gray-300 text-slate-800";
  const labelClass = isDarkMode ? "text-stellar-gold" : "text-indigo-600";
  const subLabelClass = isDarkMode ? "text-light-nebula" : "text-slate-500";

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-full w-full max-w-[1800px] mx-auto p-4 lg:p-6 animate-fade-in">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".json"
      />

      {/* Clock/Graph Visualization */}
      <div className={`flex-shrink-0 lg:flex-grow flex justify-center items-center h-[50vh] lg:h-full rounded-2xl border overflow-hidden relative transition-colors duration-500 ${containerClass} ${cursorStyle}`}>
        
        {/* View Mode Toggle Overlay */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
           <button 
             onClick={() => { setViewMode('clock'); setViewState({x:0, y:0, scale: 1.3}) }}
             className={`px-3 py-1.5 rounded-lg border font-orbitron text-xs backdrop-blur-sm transition-all ${viewMode === 'clock' 
                ? (isDarkMode ? 'bg-stellar-gold text-cosmic-purple border-stellar-gold' : 'bg-indigo-600 text-white border-indigo-600') 
                : (isDarkMode ? 'bg-black/40 text-light-nebula border-white/10' : 'bg-white/50 text-slate-600 border-gray-300')}`}
           >
             Clock
           </button>
           <button 
             onClick={() => { setViewMode('linear'); setViewState({x:0, y:0, scale: 1.3}) }}
             className={`px-3 py-1.5 rounded-lg border font-orbitron text-xs backdrop-blur-sm transition-all ${viewMode === 'linear' 
                 ? (isDarkMode ? 'bg-stellar-gold text-cosmic-purple border-stellar-gold' : 'bg-indigo-600 text-white border-indigo-600') 
                 : (isDarkMode ? 'bg-black/40 text-light-nebula border-white/10' : 'bg-white/50 text-slate-600 border-gray-300')}`}
           >
             Gráfico
           </button>
        </div>

        <div className="relative w-full h-full p-0 overflow-hidden">
          <svg 
            ref={svgRef}
            viewBox={`${-VIEWBOX_HALF} ${-VIEWBOX_HALF} ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
            className="w-full h-full drop-shadow-2xl touch-none"
            onClick={handleSvgClick}
            onWheel={handleWheel}
            onMouseDown={handleSvgMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <g transform={`translate(${viewState.x}, ${viewState.y}) scale(${viewState.scale})`}>
                
                {/* --- RENDER CLOCK BACKGROUND --- */}
                {viewMode === 'clock' && (
                  <>
                    <circle cx="0" cy="0" r={CLOCK_RADIUS} fill={isDarkMode ? "#1e1b4b" : "#f1f5f9"} fillOpacity={isDarkMode ? "0.3" : "1"} stroke={strokeColor} strokeWidth="2" />
                    <circle cx="0" cy="0" r={CLOCK_RADIUS} fill="transparent" stroke={accentTextColor} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                  </>
                )}

                {/* --- RENDER LINEAR GRAPH BACKGROUND --- */}
                {viewMode === 'linear' && (
                    <>
                       <rect 
                         x={-LINEAR_WIDTH/2} 
                         y={-LINEAR_HEIGHT/2} 
                         width={LINEAR_WIDTH} 
                         height={LINEAR_HEIGHT} 
                         fill={isDarkMode ? "#1e1b4b" : "#f1f5f9"} 
                         fillOpacity={isDarkMode ? "0.3" : "1"}
                         stroke={strokeColor} 
                         strokeWidth="1" 
                         strokeOpacity="0.5"
                       />
                       <line x1={-LINEAR_WIDTH/2} y1={0} x2={LINEAR_WIDTH/2} y2={0} stroke={strokeColor} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
                       <line x1={0} y1={-LINEAR_HEIGHT/2} x2={0} y2={LINEAR_HEIGHT/2} stroke={strokeColor} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
                    </>
                )}
                
                {/* --- RENDER MARKERS --- */}
                {markers.map((marker) => {
                    let pos1, pos2, labelPos;
                    const isSelected = selectedMarkerId === marker.id;

                    if (viewMode === 'clock') {
                        pos1 = polarToCartesian(0, 0, 90, marker.angle);
                        pos2 = polarToCartesian(0, 0, 100, marker.angle);
                        labelPos = polarToCartesian(0, 0, 115, marker.angle);
                    } else {
                        const xy = linearMapping(marker.angle, 0); 
                        const x = xy.x;
                        pos1 = { x, y: -LINEAR_HEIGHT/2 };
                        pos2 = { x, y: LINEAR_HEIGHT/2 };
                        labelPos = { x, y: (LINEAR_HEIGHT/2) + 15 };
                    }

                    return (
                        <g 
                            key={marker.id} 
                            className={`interactive-element group ${!isClockLocked && !isSpacePressed ? 'cursor-grab active:cursor-grabbing' : ''}`}
                            onMouseDown={(e) => handleMouseDownMarker(e, marker.id)}
                            onTouchStart={(e) => !isClockLocked && handleTouchStartItem(e, 'marker', marker.id)}
                        >
                        <line 
                            x1={pos1.x} y1={pos1.y} x2={pos2.x} y2={pos2.y} 
                            stroke={isSelected ? accentTextColor : strokeColor} 
                            strokeWidth={isSelected ? (viewMode === 'linear' ? 1 : 3) : (viewMode === 'linear' ? 1 : 2)} 
                            strokeOpacity={isSelected ? (viewMode === 'linear' ? 0.5 : 1) : (viewMode === 'linear' ? 0.2 : 0.5)} 
                            strokeDasharray={viewMode === 'linear' ? "2 2" : "0"}
                        />
                        <text 
                            x={labelPos.x} 
                            y={labelPos.y} 
                            textAnchor="middle" 
                            dominantBaseline="middle" 
                            fill={isSelected ? accentTextColor : strokeColor} 
                            fontSize={isSelected ? "12" : "10"} 
                            fontFamily="Orbitron"
                            fontWeight={isSelected ? "bold" : "normal"}
                            className="select-none"
                            style={{ textShadow: isSelected ? `0 0 5px ${accentTextColor}80` : 'none' }}
                        >
                            {marker.label}
                        </text>
                         {!isClockLocked && viewMode === 'linear' && (
                             <rect x={pos1.x - 10} y={-LINEAR_HEIGHT/2} width={20} height={LINEAR_HEIGHT} fill="transparent" />
                         )}
                         {viewMode === 'clock' && <circle cx={labelPos.x} cy={labelPos.y} r="15" fill="transparent" />}
                        </g>
                    );
                })}

                {/* --- RENDER CONNECTIONS --- */}
                {connections.map(conn => {
                    const from = beats.find(b => b.id === conn.fromBeatId);
                    const to = beats.find(b => b.id === conn.toBeatId);
                    if (!from || !to) return null;

                    let p1, p2, d;
                    
                    if (viewMode === 'clock') {
                        p1 = polarToCartesian(0, 0, CLOCK_RADIUS - 5, from.timeAngle);
                        p2 = polarToCartesian(0, 0, CLOCK_RADIUS - 5, to.timeAngle);
                        d = `M ${p1.x} ${p1.y} Q 0 0 ${p2.x} ${p2.y}`;
                    } else {
                        p1 = linearMapping(from.timeAngle, from.y || 50);
                        p2 = linearMapping(to.timeAngle, to.y || 50);
                        d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
                    }
                    
                    const gradId = `grad-${conn.id}`;
                    
                    return (
                        <React.Fragment key={conn.id}>
                            <defs>
                                <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}>
                                    <stop offset="50%" stopColor={from.color} />
                                    <stop offset="50%" stopColor={to.color} />
                                </linearGradient>
                            </defs>
                            <path 
                            d={d}
                            fill="none"
                            stroke={`url(#${gradId})`}
                            strokeWidth="2"
                            strokeOpacity="0.8"
                            />
                        </React.Fragment>
                    );
                })}

                {/* --- RENDER BEATS --- */}
                {sortedBeats.map(beat => {
                    let pos, textPos;

                    if (viewMode === 'clock') {
                        pos = polarToCartesian(0, 0, CLOCK_RADIUS, beat.timeAngle);
                        textPos = polarToCartesian(0, 0, CLOCK_RADIUS + TEXT_DISTANCE, beat.timeAngle);
                    } else {
                        pos = linearMapping(beat.timeAngle, beat.y || 50);
                        textPos = { x: pos.x, y: pos.y - 15 };
                    }

                    const isSelected = selectedBeatId === beat.id;
                    const isHovered = hoveredBeatId === beat.id;
                    const beatSize = beat.size || 'medium';
                    const beatStyle = beat.style || 'dot';
                    const textMode = beat.textMode || 'visible';
                    
                    return (
                        <g 
                        key={beat.id} 
                        className={`interactive-element transition-transform ${isSpacePressed ? '' : 'cursor-grab active:cursor-grabbing'}`}
                        onMouseDown={(e) => handleMouseDownBeat(e, beat.id)}
                        onTouchStart={(e) => handleTouchStartItem(e, 'beat', beat.id)}
                        onMouseEnter={() => setHoveredBeatId(beat.id)}
                        onMouseLeave={() => setHoveredBeatId(null)}
                        >
                        <circle cx={pos.x} cy={pos.y} r="25" fill="transparent" />

                        {beatStyle === 'dot' ? (
                            <>
                                {isSelected && (
                                <circle cx={pos.x} cy={pos.y} r={(getBeatSize(beatSize, 'dot') as number) + 8} fill={beat.color} opacity="0.3" className="animate-pulse" />
                                )}
                                <circle cx={pos.x} cy={pos.y} r={getBeatSize(beatSize, 'dot') as number} fill={beatFillColor} stroke={beat.color} strokeWidth="3" />
                            </>
                        ) : (
                            <>
                                {(() => {
                                    const dims = getBeatSize(beatSize, 'line') as {length: number, width: number};
                                    let x1, y1, x2, y2;
                                    
                                    if (viewMode === 'clock') {
                                        const start = polarToCartesian(0, 0, CLOCK_RADIUS - (dims.length/2), beat.timeAngle);
                                        const end = polarToCartesian(0, 0, CLOCK_RADIUS + (dims.length/2), beat.timeAngle);
                                        x1 = start.x; y1 = start.y; x2 = end.x; y2 = end.y;
                                    } else {
                                        x1 = pos.x; y1 = pos.y - (dims.length/2);
                                        x2 = pos.x; y2 = pos.y + (dims.length/2);
                                    }

                                    return (
                                        <>
                                        {isSelected && (
                                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={beat.color} strokeWidth={dims.width + 6} opacity="0.3" />
                                        )}
                                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={beat.color} strokeWidth={dims.width} strokeLinecap="round" />
                                        </>
                                    )
                                })()}
                            </>
                        )}
                        
                        {textMode !== 'tooltip' && (
                            renderSvgText(beat.title, textPos.x, textPos.y, textMode === 'visible' ? 1 : (isHovered || isSelected ? 1 : 0))
                        )}
                        </g>
                    );
                })}
                
                {viewMode === 'clock' && <circle cx="0" cy="0" r="5" fill={accentTextColor} />}
            
            </g>
          </svg>

          {hoveredBeatId && (
              (() => {
                  const beat = beats.find(b => b.id === hoveredBeatId);
                  if (!beat || beat.textMode !== 'tooltip') return null;
                  
                  let pos;
                  if (viewMode === 'clock') {
                      pos = polarToCartesian(0, 0, CLOCK_RADIUS, beat.timeAngle);
                  } else {
                      pos = linearMapping(beat.timeAngle, beat.y || 50);
                  }
                  
                  const transformedX = (pos.x * viewState.scale) + viewState.x;
                  const transformedY = (pos.y * viewState.scale) + viewState.y;

                  const leftPercent = 50 + ((transformedX / VIEWBOX_SIZE) * 100);
                  const topPercent = 50 + ((transformedY / VIEWBOX_SIZE) * 100);

                  return (
                      <div 
                        className="absolute z-50 transform -translate-x-1/2 -translate-y-full -mt-6 pointer-events-none animate-fade-in w-52"
                        style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                      >
                          <div className={`backdrop-blur-md px-3 py-2 rounded-lg border shadow-2xl text-center ${isDarkMode ? 'bg-black/90 text-white border-stellar-gold/50' : 'bg-white/90 text-slate-800 border-indigo-500/50'}`}>
                              <p className={`font-orbitron text-sm mb-1 whitespace-pre-wrap break-words ${isDarkMode ? 'text-stellar-gold' : 'text-indigo-600'}`}>{beat.title}</p>
                              <div className={`absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent ${isDarkMode ? 'border-t-black/90' : 'border-t-white/90'}`}></div>
                          </div>
                      </div>
                  )
              })()
          )}
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-4 overflow-visible lg:overflow-y-auto lg:h-full lg:pr-2 custom-scrollbar pb-10 lg:pb-0">

        <div className={`border rounded-xl p-4 flex gap-2 flex-shrink-0 transition-colors ${sidebarItemClass}`}>
            <button
                onClick={handleExport}
                className={`flex-1 border rounded py-2 font-orbitron text-xs flex items-center justify-center gap-2 transition-all ${isDarkMode ? 'bg-stellar-gold/10 hover:bg-stellar-gold/20 text-stellar-gold border-stellar-gold/50' : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportar
            </button>
            <button
                onClick={handleImportClick}
                className={`flex-1 border rounded py-2 font-orbitron text-xs flex items-center justify-center gap-2 transition-all ${isDarkMode ? 'bg-light-nebula/10 hover:bg-light-nebula/20 text-light-nebula border-light-nebula/50' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Importar
            </button>
        </div>
        
        <div className={`border rounded-xl p-4 flex-shrink-0 transition-colors ${sidebarItemClass}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className={`font-orbitron text-sm uppercase ${labelClass}`}>Estrutura</h3>
                
                <div className="flex gap-2">
                     <button 
                        onClick={() => setViewState({ x: 0, y: 0, scale: 1.3 })}
                        className={`text-[10px] underline ${isDarkMode ? 'text-light-nebula hover:text-white' : 'text-slate-500 hover:text-black'}`}
                        title="Resetar Zoom e Posição"
                    >
                        Resetar View
                    </button>
                    
                    <button 
                        onClick={() => setIsClockLocked(!isClockLocked)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${isClockLocked ? 'bg-green-500/20 border-green-500 text-green-700' : 'bg-red-500/20 border-red-500 text-red-700'}`}
                    >
                        {isClockLocked ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                Travado
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" clipRule="evenodd" /></svg>
                                Mover
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            <div className="flex flex-col gap-3">
                <div className="flex gap-2 relative">
                    <div className="relative w-full">
                        <button 
                            onClick={() => { setPresetsOpen(!presetsOpen); setShowCustomInput(false); }}
                            className={`w-full text-xs font-orbitron py-2 rounded border transition-colors flex justify-between items-center px-3 ${isDarkMode ? 'bg-dark-nebula/30 hover:bg-dark-nebula/50 text-white border-indigo-500/30' : 'bg-gray-100 hover:bg-gray-200 text-slate-700 border-gray-300'}`}
                        >
                            <span>Configurar Relógio</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        {presetsOpen && (
                            <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-xl z-20 overflow-hidden ${isDarkMode ? 'bg-gray-900 border-indigo-500/30' : 'bg-white border-gray-300'}`}>
                                <button onClick={() => applyPreset('2')} className={`w-full text-left px-4 py-2 text-xs transition-colors ${isDarkMode ? 'text-light-nebula hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}>2 Horas (12-6)</button>
                                <button onClick={() => applyPreset('3')} className={`w-full text-left px-4 py-2 text-xs transition-colors ${isDarkMode ? 'text-light-nebula hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}>3 Horas (Tríade)</button>
                                <button onClick={() => applyPreset('4')} className={`w-full text-left px-4 py-2 text-xs transition-colors ${isDarkMode ? 'text-light-nebula hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}>4 Horas (Quartos)</button>
                                <button onClick={() => applyPreset('12')} className={`w-full text-left px-4 py-2 text-xs transition-colors ${isDarkMode ? 'text-light-nebula hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}>12 Horas (Padrão)</button>
                                
                                {!showCustomInput ? (
                                    <button 
                                        onClick={() => { setShowCustomInput(true); setTimeout(() => document.getElementById('custom-input')?.focus(), 50); }}
                                        className={`w-full text-left px-4 py-2 text-xs transition-colors border-t ${isDarkMode ? 'text-stellar-gold hover:bg-white/10 border-white/10' : 'text-indigo-600 hover:bg-gray-100 border-gray-200'}`}
                                    >
                                        Quantidade Personalizada
                                    </button>
                                ) : (
                                    <div className={`p-2 border-t flex gap-2 items-center ${isDarkMode ? 'border-white/10 bg-black/50' : 'border-gray-200 bg-gray-50'}`}>
                                        <input 
                                            id="custom-input"
                                            type="number" 
                                            min="1" 
                                            max="60"
                                            placeholder="Qtd"
                                            value={customPresetValue}
                                            onChange={(e) => setCustomPresetValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter') {
                                                    applyPreset('custom', parseInt(customPresetValue));
                                                }
                                            }}
                                            className={`w-16 rounded px-2 py-1 text-xs focus:outline-none ${isDarkMode ? 'bg-gray-800 border-indigo-500/30 text-white focus:border-stellar-gold' : 'bg-white border-gray-300 text-slate-900 focus:border-indigo-500'}`}
                                        />
                                        <button 
                                            onClick={() => applyPreset('custom', parseInt(customPresetValue))}
                                            className={`text-xs px-2 py-1 rounded font-bold transition-colors ${isDarkMode ? 'bg-stellar-gold text-cosmic-purple hover:bg-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                        >
                                            OK
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={addNewMarker} 
                        className={`rounded border w-10 flex items-center justify-center transition-colors ${isDarkMode ? 'bg-stellar-gold/20 hover:bg-stellar-gold/40 text-stellar-gold border-stellar-gold/50' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-300'}`}
                        title="Adicionar Marcador Manual"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                <div>
                     <div className="flex justify-between mb-1">
                        <label className={`text-[10px] font-orbitron ${labelClass}`}>Rotação da Estrutura</label>
                    </div>
                    <input 
                        ref={rotationSliderRef}
                        type="range" 
                        min="-180" 
                        max="180" 
                        defaultValue="0"
                        onInput={handleStructureRotation}
                        onMouseUp={() => { 
                             if(rotationSliderRef.current) rotationSliderRef.current.value = "0"; 
                             lastRotationValueRef.current = 0; 
                        }}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDarkMode ? 'bg-gray-700 accent-stellar-gold' : 'bg-gray-300 accent-indigo-600'}`}
                        title="Arraste para rotacionar todas as horas conjuntamente"
                    />
                </div>
            </div>

             {selectedMarker && (
                <div className={`mt-4 pt-4 border-t animate-fade-in ${isDarkMode ? 'border-indigo-500/20' : 'border-gray-200'}`}>
                    <label className={`block text-xs font-orbitron mb-1 ${labelClass}`}>Rótulo</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={selectedMarker.label}
                            onChange={(e) => setMarkers(markers.map(m => m.id === selectedMarker.id ? { ...m, label: e.target.value } : m))}
                            className={`flex-1 rounded p-1 text-sm focus:outline-none border ${inputClass}`}
                        />
                        <button 
                            onClick={deleteSelectedMarker}
                            className={`p-1 rounded border ${isDarkMode ? 'bg-red-500/20 hover:bg-red-500/40 text-red-200 border-red-500/30' : 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300'}`}
                            title="Remover Marcador"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>


        <div className={`border rounded-xl p-6 flex flex-col gap-6 flex-shrink-0 lg:flex-grow lg:min-h-0 transition-colors ${sidebarItemClass}`}>
            <h2 className={`font-orbitron text-xl text-center border-b pb-4 ${labelClass} ${isDarkMode ? 'border-indigo-500/30' : 'border-gray-200'}`}>
            Editor
            </h2>

            {!selectedBeat ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-light-nebula/70' : 'text-slate-500'}`}>
                <p className="mb-4 text-sm">Clique no {viewMode === 'clock' ? 'círculo' : 'gráfico'} para adicionar um ponto.</p>
                <p className="text-xs opacity-50">Selecione uma hora para editar.</p>
            </div>
            ) : (
            <div className="space-y-4 animate-fade-in overflow-visible">
                {/* Manual Sliders for Precision / Mobile */}
                <div className={`grid grid-cols-1 gap-2 p-2 rounded border ${isDarkMode ? 'bg-gray-900/30 border-indigo-500/10' : 'bg-gray-100 border-gray-200'}`}>
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className={`text-[10px] font-orbitron ${labelClass}`}>Posição (Tempo)</label>
                            <span className={`text-[10px] ${subLabelClass}`}>{Math.round(selectedBeat.timeAngle)}°</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="360" 
                            value={selectedBeat.timeAngle}
                            onChange={(e) => setBeats(beats.map(b => b.id === selectedBeat.id ? { ...b, timeAngle: Number(e.target.value) } : b))}
                            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDarkMode ? 'bg-gray-700 accent-stellar-gold' : 'bg-gray-300 accent-indigo-600'}`}
                        />
                    </div>
                    {viewMode === 'linear' && (
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className={`text-[10px] font-orbitron ${labelClass}`}>Intensidade (Y)</label>
                                <span className={`text-[10px] ${subLabelClass}`}>{Math.round(selectedBeat.y || 0)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={selectedBeat.y || 50}
                                onChange={(e) => setBeats(beats.map(b => b.id === selectedBeat.id ? { ...b, y: Number(e.target.value) } : b))}
                                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDarkMode ? 'bg-gray-700 accent-stellar-gold' : 'bg-gray-300 accent-indigo-600'}`}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label className={`block text-xs font-orbitron mb-1 ${labelClass}`}>Título</label>
                    <textarea 
                        value={selectedBeat.title}
                        onChange={(e) => setBeats(beats.map(b => b.id === selectedBeat.id ? { ...b, title: e.target.value } : b))}
                        className={`w-full border rounded p-2 focus:outline-none resize-y min-h-[60px] font-sans text-sm ${inputClass}`}
                        placeholder="Escreva seu beat aqui..."
                    />
                </div>

                <div>
                    <label className={`block text-xs font-orbitron mb-2 ${labelClass}`}>Modo de Texto</label>
                    <div className={`flex rounded p-1 border ${isDarkMode ? 'bg-gray-900/50 border-indigo-500/30' : 'bg-gray-100 border-gray-200'}`}>
                        <button 
                            onClick={() => setBeats(beats.map(b => b.id === selectedBeat.id ? { ...b, textMode: 'visible' } : b))}
                            className={`flex-1 text-[10px] py-1 px-1 rounded transition-colors ${selectedBeat.textMode === 'visible' 
                                ? (isDarkMode ? 'bg-stellar-gold text-cosmic-purple font-bold' : 'bg-indigo-600 text-white font-bold') 
                                : (isDarkMode ? 'text-light-nebula hover:bg-white/10' : 'text-slate-500 hover:bg-gray-200')}`}
                        >
                            Visível
                        </button>
                        <button 
                            onClick={() => setBeats(beats.map(b => b.id === selectedBeat.id ? { ...b, textMode: 'hover' } : b))}
                            className={`flex-1 text-[10px] py-1 px-1 rounded transition-colors ${selectedBeat.textMode === 'hover' 
                                ? (isDarkMode ? 'bg-stellar-gold text-cosmic-purple font-bold' : 'bg-indigo-600 text-white font-bold') 
                                : (isDarkMode ? 'text-light-nebula hover:bg-white/10' : 'text-slate-500 hover:bg-gray-200')}`}
                        >
                            Hover
                        </button>
                        <button 
                            onClick={() => setBeats(beats.map(b => b.id === selectedBeat.id ? { ...b, textMode: 'tooltip' } : b))}
                            className={`flex-1 text-[10px] py-1 px-1 rounded transition-colors ${selectedBeat.textMode === 'tooltip' 
                                ? (isDarkMode ? 'bg-stellar-gold text-cosmic-purple font-bold' : 'bg-indigo-600 text-white font-bold') 
                                : (isDarkMode ? 'text-light-nebula hover:bg-white/10' : 'text-slate-500 hover:bg-gray-200')}`}
                        >
                            Pop-up
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className={`block text-xs font-orbitron mb-2 ${labelClass}`}>Estilo</label>
                        <div className={`flex rounded p-1 border ${isDarkMode ? 'bg-gray-900/50 border-indigo-500/30' : 'bg-gray-100 border-gray-200'}`}>
                            <button 
                                onClick={() => setBeats(beats.map(b => b.id === selectedBeat.id ? { ...b, style: 'dot' } : b))}
                                className={`flex-1 text-xs py-1 rounded transition-colors ${selectedBeat.style === 'dot' 
                                    ? (isDarkMode ? 'bg-stellar-gold text-cosmic-purple font-bold' : 'bg-indigo-600 text-white font-bold') 
                                    : (isDarkMode ? 'text-light-nebula hover:bg-white/10' : 'text-slate-500 hover:bg-gray-200')}`}
                            >
                                Dot
                            </button>
                            <button 
                                onClick={() => setBeats(beats.map(b => b.id === selectedBeat.id ? { ...b, style: 'line' } : b))}
                                className={`flex-1 text-xs py-1 rounded transition-colors ${selectedBeat.style === 'line' 
                                    ? (isDarkMode ? 'bg-stellar-gold text-cosmic-purple font-bold' : 'bg-indigo-600 text-white font-bold') 
                                    : (isDarkMode ? 'text-light-nebula hover:bg-white/10' : 'text-slate-500 hover:bg-gray-200')}`}
                            >
                                Line
                            </button>
                        </div>
                     </div>
                     <div>
                        <label className={`block text-xs font-orbitron mb-2 ${labelClass}`}>Tam.</label>
                        <div className={`flex rounded p-1 border ${isDarkMode ? 'bg-gray-900/50 border-indigo-500/30' : 'bg-gray-100 border-gray-200'}`}>
                             <button 
                                onClick={() => setBeats(beats.map(b => b.id === selectedBeat.id ? { ...b, size: 'small' } : b))}
                                className={`flex-1 text-xs py-1 rounded transition-colors ${selectedBeat.size === 'small' 
                                    ? (isDarkMode ? 'bg-stellar-gold text-cosmic-purple font-bold' : 'bg-indigo-600 text-white font-bold') 
                                    : (isDarkMode ? 'text-light-nebula hover:bg-white/10' : 'text-slate-500 hover:bg-gray-200')}`}
                            >
                                P
                            </button>
                            <button 
                                onClick={() => setBeats(beats.map(b => b.id === selectedBeat.id ? { ...b, size: 'medium' } : b))}
                                className={`flex-1 text-xs py-1 rounded transition-colors ${selectedBeat.size === 'medium' 
                                    ? (isDarkMode ? 'bg-stellar-gold text-cosmic-purple font-bold' : 'bg-indigo-600 text-white font-bold') 
                                    : (isDarkMode ? 'text-light-nebula hover:bg-white/10' : 'text-slate-500 hover:bg-gray-200')}`}
                            >
                                M
                            </button>
                            <button 
                                onClick={() => setBeats(beats.map(b => b.id === selectedBeat.id ? { ...b, size: 'large' } : b))}
                                className={`flex-1 text-xs py-1 rounded transition-colors ${selectedBeat.size === 'large' 
                                    ? (isDarkMode ? 'bg-stellar-gold text-cosmic-purple font-bold' : 'bg-indigo-600 text-white font-bold') 
                                    : (isDarkMode ? 'text-light-nebula hover:bg-white/10' : 'text-slate-500 hover:bg-gray-200')}`}
                            >
                                G
                            </button>
                        </div>
                     </div>
                </div>

                <div>
                <label className={`block text-xs font-orbitron mb-2 ${labelClass}`}>Cor</label>
                <div className="flex flex-wrap gap-2">
                    {activeColors.map(c => (
                    <button
                        key={c}
                        onClick={() => setBeats(beats.map(b => b.id === selectedBeat.id ? { ...b, color: c } : b))}
                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${selectedBeat.color === c ? `scale-110 shadow-lg ${isDarkMode ? 'border-white shadow-white/20' : 'border-gray-800 shadow-black/20'}` : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                    />
                    ))}
                </div>
                </div>

                <div>
                <label className={`block text-xs font-orbitron mb-2 ${labelClass}`}>Ligar</label>
                <div className={`rounded-lg p-2 max-h-32 overflow-y-auto space-y-1 border custom-scrollbar ${isDarkMode ? 'bg-gray-900/30 border-indigo-500/10' : 'bg-gray-100 border-gray-200'}`}>
                    {beats.filter(b => b.id !== selectedBeat.id).map(otherBeat => {
                    const isConnected = connections.some(c => 
                        (c.fromBeatId === selectedBeat.id && c.toBeatId === otherBeat.id) || 
                        (c.fromBeatId === otherBeat.id && c.toBeatId === selectedBeat.id)
                    );
                    
                    return (
                        <div key={otherBeat.id} className={`flex items-center justify-between p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-200'}`}>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: otherBeat.color }}></span>
                            <span className={`text-xs truncate max-w-[100px] ${primaryTextColor}`}>{otherBeat.title}</span>
                        </div>
                        <button
                            onClick={() => toggleConnection(otherBeat.id)}
                            className={`text-[10px] px-2 py-0.5 rounded border ${isConnected ? 'bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/40' : 'bg-green-500/20 border-green-500 text-green-500 hover:bg-green-500/40'}`}
                        >
                            {isConnected ? 'Off' : 'On'}
                        </button>
                        </div>
                    );
                    })}
                    {beats.length <= 1 && <p className={`text-[10px] text-center italic ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>Adicione mais pontos.</p>}
                </div>
                </div>

                <div className={`pt-4 border-t flex justify-between ${isDarkMode ? 'border-indigo-500/20' : 'border-gray-200'}`}>
                <button 
                    onClick={() => setSelectedBeatId(null)}
                    className={`text-xs ${isDarkMode ? 'text-light-nebula hover:text-white' : 'text-slate-500 hover:text-black'}`}
                >
                    Fechar
                </button>
                <button 
                    onClick={deleteSelectedBeat}
                    className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    Deletar
                </button>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StoryClock;