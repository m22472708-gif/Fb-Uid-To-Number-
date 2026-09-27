import React from 'react';
import { ShieldCheck, Globe } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  onReset,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex items-center space-x-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-blue-700 transition-colors">
            FB
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base text-slate-900 tracking-tight">
                UID Finder
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-600" />
                Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {language === 'bn' ? 'ফেসবুক ইউআইডি সার্চ পোর্টাল' : 'Facebook UID Search Portal'}
            </p>
          </div>
        </div>

        {/* Language switch */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all active:scale-95"
            title="Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
