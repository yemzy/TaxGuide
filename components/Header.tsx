
import React from 'react';
import { Language } from '../types';

interface HeaderProps {
  currentView: string;
  setView: (view: any) => void;
  language: Language;
  onLanguageToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, language, onLanguageToggle }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'journey', label: 'Journey' },
    { id: 'profile', label: 'Profile' },
    { id: 'calculator', label: 'Calculator' },
    { id: 'assistant', label: 'AI' },
    { id: 'knowledge', label: 'Knowledge' },
    { id: 'forum', label: 'Forum' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-2 cursor-pointer group shrink-0"
          onClick={() => setView('dashboard')}
        >
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:bg-emerald-700 transition-all shadow-md">
            NG
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-slate-900 leading-tight">TaxGuide NG</h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Tax Act 2025</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                currentView === item.id
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onLanguageToggle}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white transition-all group"
          >
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-emerald-500 transition-colors">Lang:</span>
             <span className="text-xs font-bold text-slate-900 uppercase">{language}</span>
          </button>
          
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
              <p className="text-xs font-bold text-emerald-600">Secure</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
