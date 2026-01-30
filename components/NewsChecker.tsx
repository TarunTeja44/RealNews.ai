
import React, { useState } from 'react';

interface NewsCheckerProps {
  onAnalyze: (text: string, language: string) => void;
  isLoading: boolean;
}

const NewsChecker: React.FC<NewsCheckerProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('Auto-Detect');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onAnalyze(text, lang);
    }
  };

  return (
    <div className={`
      relative w-full rounded-3xl bg-white border-2 transition-all duration-500 ease-out
      ${isFocused ? 'border-slate-900 shadow-2xl shadow-slate-200/50 scale-[1.01]' : 'border-transparent shadow-xl shadow-slate-100'}
    `}>
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="p-2">
          <textarea
            rows={4}
            className="w-full bg-transparent border-none p-6 text-xl sm:text-2xl font-display font-medium text-slate-900 placeholder:text-slate-300 focus:ring-0 resize-none outline-none leading-relaxed selection:bg-yellow-100"
            placeholder="Enter a claim to verify..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
          />
        </div>

        <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-50 mt-2">
          
          <div className="flex items-center gap-3">
             <div className="relative group">
                <select 
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wider py-2 pl-4 pr-8 rounded-lg cursor-pointer transition-colors outline-none focus:ring-2 focus:ring-slate-200"
                  disabled={isLoading}
                >
                  <option value="Auto-Detect">Auto-Detect</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Tamil">Tamil</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
             </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className={`
              group relative overflow-hidden rounded-full px-8 py-3.5 transition-all duration-300
              ${isLoading || !text.trim() 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30'}
            `}
          >
            <span className={`relative z-10 flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              Verify Claim
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsChecker;
