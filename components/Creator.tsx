

import React, { useState, useCallback, useMemo } from 'react';
import { createWord } from '../services/geminiService';
import { LUMINAR_ALPHABET } from '../constants';
import { CreatedWord, LuminarLetter } from '../types';
import Loader from './Loader';

const LetterWaveButton: React.FC<{ letter: LuminarLetter; onClick: () => void; disabled: boolean }> = ({ letter, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-20 h-20 bg-cosmic-purple/70 border border-indigo-500/50 rounded-lg text-white font-cinzel text-2xl hover:bg-dark-nebula/50 hover:border-stellar-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center group"
  >
    <span className="text-stellar-gold text-2xl font-orbitron">{letter.name}</span>
    <svg viewBox="-5 -25 110 50" className="w-12 h-6 mt-1">
      <path d={letter.path} stroke="currentColor" strokeWidth="2" fill="none" className="text-light-nebula group-hover:text-stellar-gold transition-colors" />
    </svg>
  </button>
);


const Creator: React.FC = () => {
  const [selectedLetters, setSelectedLetters] = useState<LuminarLetter[]>([]);
  const [userIntent, setUserIntent] = useState('');
  const [rawCreationHTML, setRawCreationHTML] = useState('');
  const [creationResult, setCreationResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLetterClick = (letter: LuminarLetter) => {
    if (selectedLetters.length < 7) {
      setSelectedLetters([...selectedLetters, letter]);
    }
  };

  const handleClear = () => {
    setSelectedLetters([]);
    setCreationResult('');
    setRawCreationHTML('');
    setError('');
    setUserIntent('');
  };

  const handleCreate = useCallback(async () => {
    if (selectedLetters.length < 2) {
      setError('Selecione ao menos 2 Fases para criar uma emissão.');
      return;
    }

    setLoading(true);
    setCreationResult('');
    setRawCreationHTML('');
    setError('');

    try {
      const letters = selectedLetters.map(l => l.name).join('');
      const creation = await createWord(letters, userIntent);
      setRawCreationHTML(creation);
      setCreationResult(creation);
    } catch (e) {
      setError('As estrelas não se alinharam para esta criação. Tente novamente.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedLetters, userIntent]);

  const { combinedPath, waveColor, viewBoxWidth } = useMemo(() => {
    if (selectedLetters.length === 0) {
      return { combinedPath: '', waveColor: 'white', viewBoxWidth: 100 };
    }

    const pathData = selectedLetters.map((letter, index) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${index * 100}, 0)`);
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', letter.path);
      g.appendChild(p);
      // This is a bit of a trick to get the transformed path data
      const transformedPath = p.getBBox();
      return letter.path.replace(/M0 0/, `M${index*100} 0`);
    }).join(' ').replace(/M\d+ 0/g, (match, offset) => offset > 0 ? `L${match.split(' ')[1]} 0` : match);
    
    const combinedD = selectedLetters.reduce((acc, letter, index) => {
        const transformedPath = letter.path.replace(/([CcLl])([\d\s\.,-]+)/g, (match, command, coords) => {
            const points = coords.trim().split(/[\s,]+/);
            let transformedCoords = '';
            for (let i = 0; i < points.length; i += 2) {
                const x = parseFloat(points[i]) + index * 100;
                const y = parseFloat(points[i + 1]);
                transformedCoords += `${x},${y} `;
            }
            return command + transformedCoords;
        });
        return acc + ' ' + transformedPath.replace(/M[\d\s\.,-]+/, '');
    }, `M0,0`);


    const firstVowel = selectedLetters.find(l => 'AEIOU'.includes(l.name));
    const color = firstVowel?.color || '#d8b4fe'; // default to light-nebula

    return {
      combinedPath: combinedD.trim(),
      waveColor: color,
      viewBoxWidth: selectedLetters.length * 100,
    };
  }, [selectedLetters]);

  const generateSvgString = (isAnimated: boolean) => {
    const animationClass = isAnimated ? 'wave-path' : '';
    const staticPath = `<path d="${combinedPath}" stroke="${waveColor}" stroke-width="1" fill="none" style="opacity: 0.3;" />`;
    const animatedPath = `<path d="${combinedPath}" stroke="${waveColor}" stroke-width="2.5" fill="none" class="${animationClass}" />`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -25 ${viewBoxWidth} 50" width="${viewBoxWidth * 2}" height="100">
      ${staticPath}
      ${animatedPath}
    </svg>`;
  };

  const handleExport = () => {
    const svgString = generateSvgString(false);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedLetters.map(l=>l.name).join('')}_emission.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveWordToCollection = () => {
    if (!creationResult) return;
    
    const newWord: CreatedWord = {
      word: selectedLetters.map(l => l.name).join(''),
      meaning: rawCreationHTML,
      svg: generateSvgString(true),
      category: selectedLetters.find(l => 'AEIOU'.includes(l.name))?.category || 'Composta',
    };
    
    const storedWords = localStorage.getItem('luminar_my_words');
    const myWords = storedWords ? JSON.parse(storedWords) : [];
    const updatedWords = [...myWords, newWord];
    localStorage.setItem('luminar_my_words', JSON.stringify(updatedWords));

    window.dispatchEvent(new CustomEvent('wordAdded'));
    handleClear();
  }
  
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="bg-cosmic-purple/30 border border-indigo-500/20 rounded-lg p-6 mb-6">
        <h3 className="font-orbitron text-xl text-center text-stellar-gold mb-4">1. Componha o Fluxo da Emissão (2 a 7 Fases)</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {LUMINAR_ALPHABET.map(l => (
            <LetterWaveButton
              key={l.name}
              letter={l}
              onClick={() => handleLetterClick(l)}
              disabled={selectedLetters.length >= 7}
            />
          ))}
        </div>
      </div>
      
      <div className="bg-cosmic-purple/30 border border-indigo-500/20 rounded-lg p-6 mb-6">
        <h3 className="font-orbitron text-xl text-center text-stellar-gold mb-4">2. Visualize a Emissão</h3>
        <div className="bg-black/50 rounded-lg p-4 min-h-[150px] flex items-center justify-center overflow-x-auto">
          {selectedLetters.length > 0 ? (
            <svg viewBox={`0 -25 ${viewBoxWidth} 50`} className="h-24" style={{width: `${viewBoxWidth * 0.5}px`, minWidth: '100%'}}>
              <path d={combinedPath} stroke={waveColor} strokeWidth="1" fill="none" style={{ opacity: 0.3 }} />
              <path d={combinedPath} stroke={waveColor} strokeWidth="2.5" fill="none" className="wave-path" />
            </svg>
          ) : (
            <div className="text-center text-light-nebula/70">
              <p>Selecione as Fases para iniciar o fluxo.</p>
            </div>
          )}
        </div>
         <div className="text-center mt-4">
              <p className="font-orbitron text-3xl tracking-widest text-stellar-gold" style={{ textShadow: '0 0 8px rgba(252, 211, 77, 0.7)' }}>
                {selectedLetters.map(l => l.name).join('') || '...'}
              </p>
          </div>
      </div>

      <div className="bg-cosmic-purple/30 border border-indigo-500/20 rounded-lg p-6 mb-6">
          <h3 className="font-orbitron text-xl text-center text-stellar-gold mb-4">3. Intenção (Opcional)</h3>
           <textarea
              value={userIntent}
              onChange={(e) => setUserIntent(e.target.value)}
              placeholder="Ex: 'Canção divina', 'memória de uma estrela', 'ordem no caos'..."
              className="w-full bg-cosmic-purple/50 border border-indigo-500/30 text-white placeholder-light-nebula/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stellar-gold font-sans"
              rows={2}
            />
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 justify-center gap-4">
            <button onClick={handleCreate} disabled={loading || selectedLetters.length < 2} className="bg-dark-nebula hover:bg-purple-600 text-white font-orbitron font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed col-span-2 md:col-span-1">
              {loading ? 'Criando...' : 'Interpretar'}
            </button>
            <button onClick={handleClear} className="bg-gray-600 hover:bg-gray-500 text-white font-orbitron font-bold py-3 px-6 rounded-lg transition-all">
              Limpar
            </button>
            <button onClick={handleExport} disabled={selectedLetters.length === 0} className="bg-gray-600 hover:bg-gray-500 text-white font-orbitron font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50">
              Exportar SVG
            </button>
            <button onClick={saveWordToCollection} disabled={!creationResult} className="bg-stellar-gold/80 hover:bg-stellar-gold text-cosmic-purple font-orbitron font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50">
              Salvar
            </button>
        </div>
      </div>

      {(loading || error || creationResult) && (
        <div className="min-h-[300px] bg-cosmic-purple/30 border border-indigo-500/20 rounded-lg p-6">
          <h3 className="font-orbitron text-xl text-center text-stellar-gold mb-4">Resultado da Criação</h3>
          {loading && <Loader />}
          {error && <p className="text-red-400 text-center">{error}</p>}
          {creationResult && (
              <div
                  className="prose prose-invert max-w-none text-light-nebula prose-headings:text-stellar-gold prose-headings:font-cinzel prose-strong:text-white"
                  dangerouslySetInnerHTML={{ __html: creationResult }}
              />
          )}
        </div>
      )}
    </div>
  );
};

export default Creator;