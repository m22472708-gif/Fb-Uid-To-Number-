import React, { useState } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (overrideQuery?: string) => void;
  onClear: () => void;
  language: Language;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onClear,
  language,
}) => {
  const t = translations[language];
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  const handleSampleClick = (uid: string) => {
    setSearchQuery(uid);
    onSearch(uid);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      
      {/* Search Input Box */}
      <div 
        className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm ${
          isFocused 
            ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-md' 
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center p-1.5 sm:p-2">
          
          <div className="pl-3.5 pr-2 text-slate-400">
            <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-blue-600' : 'text-slate-400'}`} />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={language === 'bn' ? 'ফেসবুক UID অথবা লিংক লিখুন...' : 'Enter Facebook UID or link...'}
            className="w-full py-3 pr-2 text-slate-800 placeholder-slate-400 text-sm sm:text-base outline-none bg-transparent font-medium"
            autoComplete="off"
            spellCheck="false"
          />

          {searchQuery && (
            <button
              onClick={onClear}
              className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onSearch()}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <span>{t.searchBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Neat test pills */}
      <div className="mt-3.5 flex items-center flex-wrap gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1 text-slate-400 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          {language === 'bn' ? 'টেস্ট করতে ক্লিক করুন:' : 'Quick test:'}
        </span>

        <button
          onClick={() => handleSampleClick('100006738752653')}
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-mono text-[11px] transition-all shadow-2xs"
        >
          100006738752653 <span className="text-slate-400">(Ehsan)</span>
        </button>

        <button
          onClick={() => handleSampleClick('100006432297121')}
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-mono text-[11px] transition-all shadow-2xs"
        >
          100006432297121 <span className="text-slate-400">(Md Uddin)</span>
        </button>

        <button
          onClick={() => handleSampleClick('100003803134511')}
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-mono text-[11px] transition-all shadow-2xs"
        >
          100003803134511 <span className="text-slate-400">(Nur)</span>
        </button>
      </div>

    </div>
  );
};
