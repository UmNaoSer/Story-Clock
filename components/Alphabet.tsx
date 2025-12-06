
import React, { useState, useMemo } from 'react';
import { CATALOG_TOPICS } from '../constants';
import { CatalogTopic, StructuredContent, LensSection, ComicPageContent, ComicCommandment, ShotTypeContent, ShotType, VideoArticleContent } from '../types';
import { searchCatalog } from '../services/geminiService';

const TopicCard: React.FC<{ topic: CatalogTopic; onClick: () => void }> = ({ topic, onClick }) => (
  <div
    onClick={onClick}
    className="bg-cosmic-purple/50 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-4 cursor-pointer hover:bg-dark-nebula/30 hover:border-stellar-gold/50 transition-all duration-300 transform hover:scale-105 group h-full flex flex-col"
  >
    <div className="text-center flex-grow flex flex-col">
      <p className="font-cinzel text-xl text-white">{topic.name}</p>
      <div className="h-16 flex items-center justify-center my-2 flex-shrink-0">
         <svg viewBox="0 0 100 100" className="w-12 h-12 text-light-nebula/70 group-hover:text-stellar-gold transition-colors duration-300">
          <path
            d={topic.path}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-light-nebula text-sm mt-2 font-sans flex-grow flex items-center justify-center">{topic.meaning}</p>
    </div>
  </div>
);

const LensCard: React.FC<{ section: LensSection }> = ({ section }) => (
  <div className="bg-dark-nebula/20 border border-indigo-500/30 rounded-xl p-6 flex flex-col h-full transform transition-all duration-300 hover:border-stellar-gold/50 hover:shadow-2xl hover:shadow-dark-nebula/20">
    <div className="flex items-center gap-4 mb-4">
      <svg viewBox="0 0 100 100" className="w-12 h-12 text-stellar-gold flex-shrink-0">
        <path d={section.iconPath} fill="currentColor" opacity="0.3" />
        <path d={section.iconPath} stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      <div>
        <h3 className="font-orbitron text-2xl text-stellar-gold">{section.focalLength}</h3>
        <p className="font-cinzel text-xl text-white">{section.title}</p>
      </div>
    </div>
    <p className="text-light-nebula/90 mb-6 font-sans text-base flex-grow">{section.description}</p>
    <div className="space-y-4 border-t border-indigo-500/20 pt-4">
      {section.points.map((point, index) => (
        <div key={index}>
          <h4 className="font-orbitron text-md text-stellar-gold/90">{point.title}</h4>
          <p className="text-light-nebula/80 font-sans text-sm" dangerouslySetInnerHTML={{ __html: point.content }} />
        </div>
      ))}
    </div>
  </div>
);

const StructuredContentDisplay: React.FC<{ content: StructuredContent }> = ({ content }) => (
  <div>
    <div
      className="text-lg text-center text-light-nebula/90 mb-12 max-w-4xl mx-auto font-sans leading-relaxed prose prose-invert prose-strong:text-white"
      dangerouslySetInnerHTML={{ __html: content.introduction }}
    />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {content.sections.map((section) => <LensCard key={section.focalLength} section={section} />)}
    </div>
    {content.conclusion && (
      <div className="mt-16 bg-dark-nebula/10 border border-indigo-500/20 rounded-xl p-8">
        <h3 className="font-orbitron text-2xl text-center text-stellar-gold mb-4">{content.conclusion.title}</h3>
        <div 
            className="text-light-nebula/90 font-sans text-base max-w-4xl mx-auto leading-relaxed prose prose-invert prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: content.conclusion.content }} 
        />
      </div>
    )}
  </div>
);

const CommandmentCard: React.FC<{ commandment: ComicCommandment }> = ({ commandment }) => (
  <div className="bg-dark-nebula/20 border border-indigo-500/30 rounded-lg p-6 flex flex-col h-full transform transition-all duration-300 hover:border-stellar-gold/50 hover:-translate-y-1">
    <div className="flex items-baseline gap-4 mb-3">
      <span className="font-orbitron text-5xl text-stellar-gold opacity-70">{commandment.number.toString().padStart(2, '0')}</span>
      <h3 className="font-cinzel text-xl text-white -translate-y-1">{commandment.title}</h3>
    </div>
    <p className="text-light-nebula/90 font-sans text-base flex-grow">{commandment.description}</p>
  </div>
);

const ComicContentDisplay: React.FC<{ content: ComicPageContent }> = ({ content }) => (
  <div>
    <div
      className="text-lg text-center text-light-nebula/90 mb-12 max-w-4xl mx-auto font-sans leading-relaxed prose prose-invert"
      dangerouslySetInnerHTML={{ __html: content.introduction }}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.commandments.map((cmd) => <CommandmentCard key={cmd.number} commandment={cmd} />)}
    </div>
    {content.conclusion && (
      <div className="mt-16 bg-dark-nebula/10 border border-indigo-500/20 rounded-xl p-8">
        <h3 className="font-orbitron text-2xl text-center text-stellar-gold mb-4">{content.conclusion.title}</h3>
        <div 
            className="text-light-nebula/90 font-sans text-base max-w-4xl mx-auto leading-relaxed prose prose-invert prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: content.conclusion.content }} 
        />
      </div>
    )}
  </div>
);

const ShotCard: React.FC<{ shot: ShotType }> = ({ shot }) => (
  <div className="bg-dark-nebula/20 border border-indigo-500/30 rounded-xl p-6 flex flex-col h-full transform transition-all duration-300 hover:border-stellar-gold/50 hover:shadow-2xl hover:shadow-dark-nebula/20 hover:-translate-y-1">
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-cosmic-purple/50 rounded-full border-2 border-stellar-gold/50">
          <span className="font-orbitron text-3xl text-stellar-gold">{shot.number.toString().padStart(2, '0')}</span>
      </div>
      <div>
        <h3 className="font-cinzel text-xl text-white">{shot.title}</h3>
        {shot.subtitle && <p className="font-orbitron text-md text-light-nebula">{shot.subtitle}</p>}
      </div>
    </div>
    <div 
      className="text-light-nebula/90 font-sans text-base flex-grow prose prose-sm prose-invert prose-strong:text-white max-w-none"
      dangerouslySetInnerHTML={{ __html: shot.description }} 
    />
  </div>
);

const ShotTypeContentDisplay: React.FC<{ content: ShotTypeContent }> = ({ content }) => (
  <div>
    <div
      className="text-lg text-center text-light-nebula/90 mb-12 max-w-4xl mx-auto font-sans leading-relaxed prose prose-invert"
      dangerouslySetInnerHTML={{ __html: content.introduction }}
    />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {content.shots.map((shot) => <ShotCard key={shot.number} shot={shot} />)}
    </div>
    {content.bonus && (
      <div className="mt-16 bg-dark-nebula/10 border border-indigo-500/20 rounded-xl p-8">
        <h3 className="font-orbitron text-2xl text-center text-stellar-gold mb-4">{content.bonus.title}</h3>
        <p className="text-light-nebula/90 font-sans text-base max-w-4xl mx-auto leading-relaxed mb-8 text-center">{content.bonus.content}</p>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {content.bonus.topics.map((topic, index) => (
            <div key={index} className="bg-cosmic-purple/30 p-6 rounded-lg border border-indigo-500/30">
              <h4 className="font-cinzel text-xl text-stellar-gold/90 mb-2">{topic.title}</h4>
              <div 
                className="text-light-nebula/80 font-sans text-sm prose prose-sm prose-invert prose-strong:text-white max-w-none"
                dangerouslySetInnerHTML={{ __html: topic.content }} 
              />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const VideoArticleDisplay: React.FC<{ content: VideoArticleContent }> = ({ content }) => (
  <div>
    <div className="flex justify-center mb-8">
        <a 
          href={`https://www.youtube.com/watch?v=${content.videoId}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-dark-nebula/80 hover:bg-stellar-gold hover:text-cosmic-purple text-white px-4 py-2 rounded-full text-sm font-orbitron transition-all border border-indigo-500/30 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
          Assistir no YouTube (Link Externo)
        </a>
    </div>

    <h2 className="text-3xl text-stellar-gold font-cinzel mb-8 text-center">{content.title}</h2>

    <div
      className="text-lg text-center text-light-nebula/90 mb-12 max-w-4xl mx-auto font-sans leading-relaxed prose prose-invert prose-strong:text-white"
      dangerouslySetInnerHTML={{ __html: content.introduction }}
    />

    <div className="space-y-12">
        {content.sections.map((section, idx) => (
             <div key={idx} className="bg-dark-nebula/10 border border-indigo-500/10 rounded-xl p-8 hover:border-stellar-gold/20 transition-colors">
                <h3 className="text-2xl text-white font-orbitron mb-6 border-b border-indigo-500/30 pb-2">{section.title}</h3>
                <div
                    className="text-light-nebula/90 font-sans text-base leading-relaxed prose prose-invert prose-strong:text-white max-w-none"
                     dangerouslySetInnerHTML={{ __html: section.content }}
                />
             </div>
        ))}
    </div>

     {content.conclusion && (
      <div className="mt-16 bg-gradient-to-r from-dark-nebula/20 to-cosmic-purple/40 border border-indigo-500/20 rounded-xl p-8">
        <h3 className="font-orbitron text-2xl text-center text-stellar-gold mb-4">{content.conclusion.title}</h3>
        <div
            className="text-light-nebula/90 font-sans text-base max-w-4xl mx-auto leading-relaxed prose prose-invert prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: content.conclusion.content }}
        />
      </div>
    )}
  </div>
);


const TopicDetailView: React.FC<{ topic: CatalogTopic; onClose: () => void }> = ({ topic, onClose }) => {
  const isStructured = typeof topic.fullDescription === 'object' && 'sections' in topic.fullDescription && !('videoId' in topic.fullDescription);
  const isComicContent = typeof topic.fullDescription === 'object' && 'commandments' in topic.fullDescription;
  const isShotTypeContent = typeof topic.fullDescription === 'object' && 'shots' in topic.fullDescription;
  const isVideoArticle = typeof topic.fullDescription === 'object' && 'videoId' in topic.fullDescription;
  const isSimpleHtml = typeof topic.fullDescription === 'string';

  return (
    <div className={`animate-fade-in ${isStructured || isComicContent || isShotTypeContent || isVideoArticle ? 'max-w-7xl' : 'max-w-4xl'} mx-auto p-4 md:p-0`}>
      <button 
        onClick={onClose} 
        className="mb-8 flex items-center gap-2 text-light-nebula hover:text-stellar-gold transition-colors font-orbitron"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Voltar ao Catálogo
      </button>
      <div className="bg-gradient-to-br from-cosmic-purple/50 to-gray-900/70 border border-dark-nebula/30 rounded-xl shadow-2xl shadow-dark-nebula/20 w-full p-6 md:p-10">
        
        {/* Only show default header if it's NOT a video article (Video article has its own header logic) */}
        {!isVideoArticle && (
           <div className="text-center mb-10">
              <p className="font-cinzel text-4xl md:text-6xl text-stellar-gold" style={{ textShadow: '0 0 10px rgba(252, 211, 77, 0.7)' }}>{topic.name}</p>
              <p className="font-orbitron text-lg text-light-nebula mt-2">{topic.category}</p>
            </div>
        )}
        
        {isStructured && <StructuredContentDisplay content={topic.fullDescription as StructuredContent} />}
        {isComicContent && <ComicContentDisplay content={topic.fullDescription as ComicPageContent} />}
        {isShotTypeContent && <ShotTypeContentDisplay content={topic.fullDescription as ShotTypeContent} />}
        {isVideoArticle && <VideoArticleDisplay content={topic.fullDescription as VideoArticleContent} />}
        {isSimpleHtml && (
          <div 
            className="text-left space-y-4 prose prose-invert max-w-none text-light-nebula/90 prose-headings:text-stellar-gold prose-headings:font-cinzel prose-strong:text-white prose-ul:list-disc prose-ul:ml-5"
            dangerouslySetInnerHTML={{ __html: topic.fullDescription as string }}
          />
        )}
      </div>
    </div>
  );
};

// Helper function to extract searchable text from any content structure recursively
const extractSearchableText = (data: any): string => {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data.map(extractSearchableText).join(' ');
  if (typeof data === 'object') {
    return Object.values(data).map(extractSearchableText).join(' ');
  }
  return '';
};

const CatalogView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<CatalogTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiResults, setAiResults] = useState<string[] | null>(null);

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsAiSearching(true);
    try {
      const results = await searchCatalog(searchQuery);
      setAiResults(results);
    } catch (e) {
      console.error("AI Search failed", e);
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAiSearch();
    }
  };

  const handleClear = () => {
      setSearchQuery('');
      setAiResults(null);
  };

  const filteredTopics = useMemo(() => {
    // 1. If AI results exist (Semantic mode), use them exclusively but ordered.
    if (aiResults !== null) {
        return CATALOG_TOPICS.filter(t => aiResults.includes(t.name))
                             .sort((a, b) => aiResults.indexOf(a.name) - aiResults.indexOf(b.name));
    }

    // 2. Standard Client-side Filtering (Deep Text Search)
    if (!searchQuery.trim()) return CATALOG_TOPICS;
    const lowerQuery = searchQuery.toLowerCase();
    
    return CATALOG_TOPICS.filter(topic => {
        const corpus = `
            ${topic.name} 
            ${topic.meaning} 
            ${topic.category} 
            ${extractSearchableText(topic.fullDescription)}
        `.toLowerCase();
        
        return corpus.includes(lowerQuery);
    });
  }, [searchQuery, aiResults]);

  if (selectedTopic) {
    return <TopicDetailView topic={selectedTopic} onClose={() => setSelectedTopic(null)} />;
  }

  return (
    <div className="animate-fade-in">
      {/* Search Engine Interface */}
      <div className="max-w-2xl mx-auto px-4 mb-10">
        <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur transition duration-1000 group-hover:duration-200 ${isAiSearching ? 'opacity-75 animate-pulse' : 'opacity-25 group-hover:opacity-50'}`}></div>
            <div className="relative flex items-center bg-gray-900 border border-indigo-500/30 rounded-lg shadow-2xl">
                <div className="pl-4 text-stellar-gold">
                    {isAiSearching ? (
                        <div className="animate-spin h-6 w-6 border-2 border-stellar-gold border-t-transparent rounded-full"></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </div>
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value === '') setAiResults(null); // Reset AI results on clear
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Pesquisar (Pressione Enter para Busca Semântica IA)..."
                    className="w-full bg-transparent text-white placeholder-light-nebula/50 border-none focus:ring-0 py-4 pl-3 pr-4 font-orbitron text-lg focus:outline-none"
                />
                
                {/* Right side controls */}
                <div className="flex items-center pr-2">
                    {searchQuery && !isAiSearching && (
                         <button 
                            onClick={handleAiSearch}
                            className="mr-2 text-xs bg-dark-nebula/30 hover:bg-stellar-gold hover:text-cosmic-purple text-stellar-gold px-2 py-1 rounded border border-stellar-gold/30 transition-colors uppercase font-bold"
                            title="Ativar Busca Inteligente com IA"
                        >
                            IA
                        </button>
                    )}
                    {searchQuery && (
                        <button 
                            onClick={handleClear}
                            className="text-light-nebula/50 hover:text-white transition-colors p-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            {aiResults !== null && (
                 <div className="absolute top-full left-0 mt-2 text-xs text-stellar-gold flex items-center gap-1 animate-fade-in">
                     <span className="w-2 h-2 rounded-full bg-stellar-gold inline-block"></span>
                     Resultados contextualizados via IA
                 </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 p-4">
        {filteredTopics.map((topic) => (
          <TopicCard key={topic.name} topic={topic} onClick={() => setSelectedTopic(topic)} />
        ))}
      </div>

      {filteredTopics.length === 0 && (
         <div className="text-center py-12 animate-fade-in">
             <div className="text-4xl mb-4">🌌</div>
             <p className="text-2xl text-light-nebula/50 font-cinzel mb-2">O vazio cósmico...</p>
             <p className="text-light-nebula/70 font-sans">Nenhum conhecimento encontrado para "{searchQuery}".</p>
             {searchQuery && !isAiSearching && !aiResults && (
                 <button onClick={handleAiSearch} className="mt-4 text-stellar-gold hover:underline font-orbitron text-sm">
                     Tentar busca profunda com IA?
                 </button>
             )}
         </div>
      )}
    </div>
  );
};

export default CatalogView;
