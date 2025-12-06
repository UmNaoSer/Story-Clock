
import React, { useState, useEffect } from 'react';
import { CreatedWord } from '../types';

const Catalog: React.FC = () => {
  const [myWords, setMyWords] = useState<CreatedWord[]>([]);

  useEffect(() => {
    // This function will be called whenever the tab is focused
    const loadWords = () => {
      try {
        const storedWords = localStorage.getItem('luminar_my_words');
        if (storedWords) {
          setMyWords(JSON.parse(storedWords));
        }
      } catch (e) {
        console.error("Failed to load words from localStorage", e);
      }
    };
    
    loadWords();

    // Optional: Listen for storage changes from other tabs/windows
    window.addEventListener('storage', loadWords);
    
    // Also, use a custom event to reload when a word is created in the Creator tab
    window.addEventListener('wordAdded', loadWords);


    return () => {
      window.removeEventListener('storage', loadWords);
      window.removeEventListener('wordAdded', loadWords);
    };
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in">
       <div className="bg-cosmic-purple/30 border border-indigo-500/20 rounded-lg p-6">
          <h2 className="font-orbitron text-2xl text-center text-stellar-gold mb-6">Minhas Emissões Salvas</h2>
          {myWords.length > 0 ? (
            <div className="space-y-4">
              {myWords.map((w, index) => (
                <details key={index} className="bg-gray-900/50 rounded-lg p-4 cursor-pointer transition-all open:bg-dark-nebula/20">
                  <summary className="font-orbitron text-lg text-stellar-gold select-none">{w.word}</summary>
                  <div className="mt-4 border-t border-indigo-500/20 pt-4">
                    {w.svg && (
                      <div className="mb-4 bg-black/30 rounded-lg p-2 overflow-x-auto">
                        <div dangerouslySetInnerHTML={{ __html: w.svg }} />
                      </div>
                    )}
                    <div
                      className="prose prose-sm prose-invert max-w-none text-light-nebula prose-headings:text-stellar-gold prose-headings:font-cinzel prose-strong:text-white"
                      dangerouslySetInnerHTML={{ __html: w.meaning }}
                    />
                  </div>
                </details>
              ))}
            </div>
          ) : (
             <div className="text-center text-light-nebula/70 min-h-[200px] flex flex-col justify-center items-center">
                <p className="text-4xl mb-4">📜</p>
                <p>Seu catálogo está vazio.</p>
                <p>Vá para a aba 'Criador' para manifestar novas emissões e elas aparecerão aqui.</p>
            </div>
          )}
       </div>
    </div>
  );
};

export default Catalog;