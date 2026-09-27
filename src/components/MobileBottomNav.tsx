import React from 'react';
import { Search, Database, FileCode, HelpCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface MobileBottomNavProps {
  currentTab: 'search' | 'directory' | 'raw' | 'helper';
  setCurrentTab: (tab: 'search' | 'directory' | 'raw' | 'helper') => void;
  language: Language;
  recordCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  language,
  recordCount,
}) => {
  const t = translations[language];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-xl pb-safe">
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto px-1">
        
        {/* Search tab */}
        <button
          onClick={() => setCurrentTab('search')}
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
            currentTab === 'search' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentTab === 'search' ? 'bg-blue-600/20' : ''}`}>
            <Search className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">{t.searchTab}</span>
        </button>

        {/* Raw DB tab */}
        <button
          onClick={() => setCurrentTab('raw')}
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
            currentTab === 'raw' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentTab === 'raw' ? 'bg-cyan-600/20' : ''}`}>
            <FileCode className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">{t.rawDbTab}</span>
        </button>

        {/* Directory tab */}
        <button
          onClick={() => setCurrentTab('directory')}
          className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${
            currentTab === 'directory' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentTab === 'directory' ? 'bg-indigo-600/20' : ''}`}>
            <Database className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">{t.directoryTab}</span>
        </button>

        {/* Helper tab */}
        <button
          onClick={() => setCurrentTab('helper')}
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
            currentTab === 'helper' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentTab === 'helper' ? 'bg-blue-600/20' : ''}`}>
            <HelpCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">{t.helperTab}</span>
        </button>

      </div>
    </div>
  );
};
