
import React, { useState, useEffect } from 'react';
import { analyzeNews } from './services/supabase';
import { AnalysisResult, HistoryItem } from './types';
import Header from './components/Header';
import NewsChecker from './components/NewsChecker';
import ResultCard from './components/ResultCard';
import HistorySidebar from './components/HistorySidebar';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('realnews_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const saveToHistory = (claim: string, res: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      claim,
      result: res
    };
    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('realnews_history', JSON.stringify(updated));
  };

  const handleAnalyze = async (text: string, lang: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await analyzeNews(text, lang);
      setResult(data);
      saveToHistory(text, data);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-32 sm:pt-40 pb-32">
        <div className="w-full max-w-3xl space-y-16">
          
          {/* Hero Section */}
          <section className="text-center space-y-6 animate-blur-in">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tighter text-slate-900 leading-[0.95]">
              Verify <br/><span className="text-slate-300">Everything.</span>
            </h1>
            <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-lg mx-auto leading-relaxed">
              Advanced cross-referencing and search grounding to detect misinformation in real-time.
            </p>
          </section>

          {/* Centered Input Box */}
          <div className="relative z-10 animate-blur-in delay-100">
            <NewsChecker onAnalyze={handleAnalyze} isLoading={loading} />
          </div>

          {/* Results Area */}
          <div className="space-y-16">
            {error && (
              <div className="p-6 bg-rose-50 text-rose-600 text-[11px] rounded-2xl font-bold uppercase tracking-widest border border-rose-100 text-center animate-blur-in">
                {error}
              </div>
            )}

            {result && (
              <div className="pt-4">
                <ResultCard result={result} />
              </div>
            )}
            
            {!result && !loading && (
              <div className="pt-12 text-center opacity-20 flex flex-col items-center gap-6 animate-blur-in delay-200">
                <div className="w-px h-16 bg-slate-900" />
                <p className="text-[10px] font-bold font-display uppercase tracking-[0.4em] text-slate-900">System Ready</p>
              </div>
            )}
          </div>
        </div>

        {/* Minimal History Section */}
        {history.length > 0 && (
          <div className="w-full max-w-5xl mt-32 border-t border-slate-200/50 pt-20">
            <HistorySidebar 
              history={history} 
              onSelect={(item) => {
                setResult(item.result);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              onClear={() => {
                setHistory([]);
                localStorage.removeItem('realnews_history');
              }}
            />
          </div>
        )}
      </main>
      
      <footer className="py-12 text-center border-t border-slate-100 px-4 bg-white/50 backdrop-blur-sm">
        <p className="text-[10px] font-bold font-display text-slate-400 uppercase tracking-[0.3em]">
          RealNews.ai • Distributed Verification
        </p>
      </footer>
    </div>
  );
};

export default App;
