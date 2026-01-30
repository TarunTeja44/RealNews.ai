
import React from 'react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full animate-blur-in delay-200">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1 h-4 bg-slate-200"></span>
          Verification History
        </h3>
        <button 
          onClick={onClear}
          className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-wider"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="group relative flex flex-col gap-3 text-left p-1 rounded-xl transition-all"
          >
            <div className="absolute inset-0 bg-white border border-slate-100 shadow-sm rounded-xl opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-300 -z-10"></div>
            
            <div className="flex items-center justify-between px-2 pt-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                item.result.prediction === 'real' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {item.result.prediction}
              </span>
              <span className="text-[10px] font-medium text-slate-400 font-display">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-sm font-semibold text-slate-700 leading-snug px-2 pb-2 group-hover:text-slate-900">
              {item.claim}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistorySidebar;
