
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full fixed top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-100/50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-6 h-6 bg-slate-900 rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-out"></div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900">
            RealNews<span className="text-slate-400">.ai</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-bold font-display uppercase tracking-widest text-slate-500">
            System Operational
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
