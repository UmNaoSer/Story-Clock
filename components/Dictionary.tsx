
import React, { useState, useCallback, useMemo } from 'react';
import { analyzeYouTubeVideo } from '../services/geminiService';
import Loader from './Loader';

const VideoAnalyzer: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=tvwPKBXEOKE');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const videoId = useMemo(() => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, [videoUrl]);

  const handleAnalyze = useCallback(async () => {
    if (!videoId) {
      setError('Por favor, insira uma URL válida do YouTube.');
      return;
    }
    if (!prompt) {
      setError('Por favor, insira um prompt para a IA.');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const analysis = await analyzeYouTubeVideo(prompt, videoUrl);
      setResult(analysis);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Erro na análise: ${e.message}`);
      } else {
        setError('Um erro desconhecido ocorreu.');
      }
    } finally {
      setLoading(false);
    }
  }, [videoId, prompt, videoUrl]);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in space-y-8">
      <div className="bg-cosmic-purple/30 border border-indigo-500/20 rounded-lg p-6">
        <h2 className="font-orbitron text-2xl text-center text-stellar-gold mb-6">Cine-Lounge & IA</h2>
        
        <div className="space-y-6">
          {/* URL Input */}
          <div>
            <label htmlFor="video-url" className="font-orbitron text-lg text-dark-nebula mb-2 block">1. URL do Vídeo (YouTube)</label>
            <div className="relative">
                <input
                id="video-url"
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Cole o link do YouTube aqui..."
                className="w-full bg-cosmic-purple/50 border border-indigo-500/30 text-white placeholder-light-nebula/30 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-stellar-gold font-sans transition-all"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stellar-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                </div>
            </div>
             {videoId && (
                <div className="mt-2 text-right">
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-stellar-gold hover:text-light-nebula text-sm font-orbitron inline-flex items-center gap-1">
                        Assistir no YouTube
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                         </svg>
                    </a>
                </div>
             )}
          </div>

          {/* Prompt Section */}
          <div className="pt-6 border-t border-indigo-500/20">
            <label htmlFor="prompt" className="font-orbitron text-lg text-dark-nebula mb-2 block">2. Consultar o Oráculo (IA)</label>
            <div className="relative">
                <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: 'Qual é o tema central deste vídeo?', 'Explique a cinematografia', 'Resuma os pontos principais'"
                className="w-full bg-cosmic-purple/50 border border-indigo-500/30 text-white placeholder-light-nebula/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stellar-gold font-sans min-h-[100px]"
                />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={loading || !videoId || !prompt}
              className="bg-dark-nebula hover:bg-purple-600 text-white font-orbitron font-bold py-3 px-8 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/50 hover:shadow-purple-600/50 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? 'Consultando...' : 'Analisar Contexto'}
            </button>
            <p className="text-xs text-light-nebula/50 mt-2 font-sans">A IA analisará o contexto com base no seu conhecimento prévio sobre o vídeo.</p>
          </div>
        </div>
      </div>
      
      {(loading || error || result) && (
        <div className="min-h-[200px] bg-cosmic-purple/30 border border-indigo-500/20 rounded-lg p-6 animate-fade-in">
          <h3 className="font-orbitron text-xl text-center text-stellar-gold mb-4">Resposta do Oráculo</h3>
          {loading && <Loader />}
          {error && <p className="text-red-400 text-center font-sans">{error}</p>}
          {result && (
              <div
                  className="prose prose-invert max-w-none text-light-nebula prose-headings:text-stellar-gold prose-headings:font-cinzel prose-strong:text-white prose-a:text-stellar-gold"
                  dangerouslySetInnerHTML={{ __html: window.marked.parse(result) }}
              />
          )}
        </div>
      )}
    </div>
  );
};

export default VideoAnalyzer;
