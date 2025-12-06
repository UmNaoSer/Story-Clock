
import React, { useState } from 'react';
import StoryClock from './components/StoryClock';

const HelpModal: React.FC<{ onClose: () => void; isDarkMode: boolean }> = ({ onClose, isDarkMode }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
    <div className={`border rounded-xl p-6 max-w-md w-full shadow-2xl relative ${isDarkMode ? 'bg-cosmic-purple/90 border-stellar-gold/30' : 'bg-white border-gray-300'}`} onClick={e => e.stopPropagation()}>
      <button onClick={onClose} className={`absolute top-4 right-4 ${isDarkMode ? 'text-light-nebula hover:text-white' : 'text-gray-500 hover:text-black'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <h2 className={`text-2xl font-cinzel mb-6 text-center ${isDarkMode ? 'text-stellar-gold' : 'text-indigo-700'}`}>Guia do Story Clock</h2>
      
      <div className={`space-y-6 font-sans ${isDarkMode ? 'text-light-nebula/90' : 'text-gray-700'}`}>
        <div>
          <h3 className={`font-orbitron text-lg mb-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className={isDarkMode ? 'text-stellar-gold' : 'text-indigo-600'}>🖱️</span> Navegação
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Zoom:</strong> Roda do mouse ou Pinça (Mobile).</li>
            <li><strong>Mover Tela (Pan):</strong> Segure <kbd className={`${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-gray-200 border-gray-300'} px-1 rounded border`}>ESPAÇO</kbd> + Clique e Arraste (Desktop).</li>
          </ul>
        </div>

        <div>
          <h3 className={`font-orbitron text-lg mb-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className={isDarkMode ? 'text-stellar-gold' : 'text-indigo-600'}>✨</span> Criação
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Adicionar Beat:</strong> Clique em qualquer lugar vazio do relógio.</li>
            <li><strong>Editar:</strong> Clique em um ponto (Beat) ou hora para selecioná-lo e editar na barra lateral.</li>
            <li><strong>Conectar:</strong> Selecione um ponto e use a lista "Ligar" na barra lateral para criar conexões.</li>
          </ul>
        </div>

        <div>
           <h3 className={`font-orbitron text-lg mb-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className={isDarkMode ? 'text-stellar-gold' : 'text-indigo-600'}>⚙️</span> Dicas
          </h3>
           <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Arraste os pontos para reposicioná-los no tempo.</li>
            <li>Use o botão <strong>Travado/Mover</strong> para ajustar a posição dos marcadores de hora.</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button onClick={onClose} className={`font-bold py-2 px-6 rounded transition-colors ${isDarkMode ? 'bg-stellar-gold text-cosmic-purple hover:bg-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
          Entendi
        </button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Background styles based on theme
  const bgClass = isDarkMode 
    ? "bg-gradient-to-br from-gray-900 via-cosmic-purple to-black text-white" 
    : "bg-gray-50 text-slate-800";

  const headerClass = isDarkMode
    ? "bg-black/10 border-white/5"
    : "bg-white/70 border-black/5 shadow-sm";

  return (
    <div className={`min-h-screen w-screen font-cinzel flex flex-col lg:h-screen lg:overflow-hidden transition-colors duration-500 ${bgClass}`}>
      <header className={`py-4 px-6 flex-shrink-0 backdrop-blur-sm border-b z-10 flex items-center justify-between relative ${headerClass}`}>
        
        {/* Left Side: Theme Toggle */}
        <div className="z-20">
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'text-stellar-gold hover:bg-white/10' : 'text-orange-500 hover:bg-black/5'}`}
                title={isDarkMode ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
            >
                {isDarkMode ? (
                    // Moon Icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                ) : (
                    // Sun Icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )}
            </button>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
             <h1 className={`text-3xl md:text-4xl font-cinzel cursor-default transition-colors ${isDarkMode ? 'text-stellar-gold' : 'text-indigo-700'}`} style={{ textShadow: isDarkMode ? '0 0 12px rgba(252, 211, 77, 0.8)' : 'none' }}>
                Story Clock
            </h1>
        </div>
        
        <div className="ml-auto z-20">
             <button 
                onClick={() => setShowHelp(true)}
                className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center font-orbitron font-bold ${isDarkMode ? 'border-stellar-gold/50 text-stellar-gold hover:bg-stellar-gold hover:text-cosmic-purple' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                title="Guia do Programa"
             >
                 ?
             </button>
        </div>
      </header>
      
      <main className="flex-grow w-full relative flex flex-col lg:h-full lg:overflow-hidden">
        <StoryClock isDarkMode={isDarkMode} />
      </main>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} isDarkMode={isDarkMode} />}
    </div>
  );
};

export default App;