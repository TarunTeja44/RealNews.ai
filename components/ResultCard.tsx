
import React from 'react';
import { AnalysisResult } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const isReal = result.prediction === 'real';
  const confidencePercent = Math.round(result.confidence * 100);
  
  // Theme configuration
  const theme = isReal ? {
    color: 'text-emerald-600',
    bg: 'bg-emerald-500',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    gradient: 'from-emerald-500 to-teal-500'
  } : {
    color: 'text-rose-600',
    bg: 'bg-rose-500',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-700',
    gradient: 'from-rose-500 to-orange-500'
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* 1. Verdict Header */}
      <div className="animate-blur-in">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
           <div className="space-y-3">
             <div className="flex items-center gap-3">
               <span className={`px-3 py-1.5 rounded text-[11px] font-display font-bold uppercase tracking-widest ${theme.badge}`}>
                 AI Analysis
               </span>
               <span className="text-slate-400 text-xs font-medium">
                 {new Date(result.verified_at).toLocaleDateString()} • {new Date(result.verified_at).toLocaleTimeString()}
               </span>
             </div>
             <h2 className={`text-5xl sm:text-7xl font-display font-bold tracking-tighter text-slate-900 leading-[0.9]`}>
               {isReal ? 'Authentic' : 'Misleading'}
             </h2>
           </div>

           {/* Confidence Meter */}
           <div className="flex flex-col items-end gap-2">
             <div className="flex items-baseline gap-1">
               <span className={`text-6xl font-display font-bold tracking-tighter ${theme.color}`}>
                 {confidencePercent}
               </span>
               <span className={`text-2xl font-bold ${theme.color}`}>%</span>
             </div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence Score</span>
           </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-blur-in delay-100">
        
        {/* Left: Reasoning */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-4">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-4 h-px bg-slate-300"></span>
                Analysis Reasoning
             </h3>
             <p className="text-lg md:text-xl font-body text-slate-700 leading-relaxed">
               {result.reasoning}
             </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Key Verification Points</h4>
            <ul className="space-y-3">
              {result.detailed_breakdown.map((point, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600 font-medium">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${theme.bg}`}></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Sources Vertical Stack */}
        <div className="md:col-span-5 flex flex-col gap-4">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-4 h-px bg-slate-300"></span>
              Grounding Sources
           </h3>
           
           {result.news_verification.articles.length > 0 ? (
             result.news_verification.articles.map((article, idx) => (
               <a 
                 key={idx} 
                 href={article.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="group bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 transition-all duration-300"
               >
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[120px]">
                     {article.source}
                   </span>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-300 group-hover:text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                 </div>
                 <h4 className="font-display font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                   {article.title}
                 </h4>
               </a>
             ))
           ) : (
             <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-400 italic">No direct web links found.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
