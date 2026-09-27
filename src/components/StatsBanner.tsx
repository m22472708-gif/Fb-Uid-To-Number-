import React from 'react';
import { ShieldCheck, PhoneCall, Zap, Database, Smartphone } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface StatsBannerProps {
  totalRecords: number;
  totalSearches: number;
  language: Language;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  totalRecords,
  totalSearches,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 px-1">
      
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center shadow-md">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-1.5">
          <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="text-lg sm:text-2xl font-black font-mono text-white">
          {totalRecords}+
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
          {t.totalRecords}
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center shadow-md">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-1.5">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="text-sm sm:text-base font-bold text-emerald-400">
          {language === 'bn' ? 'ভেরিফায়েড' : 'Verified'}
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
          {t.verifiedBadge}
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center shadow-md">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-1.5">
          <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="text-sm sm:text-base font-bold text-blue-400">
          BD Numbers
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
          {language === 'bn' ? 'সকল অপারেটর' : 'All Operators'}
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center shadow-md">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-1.5">
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="text-lg sm:text-2xl font-black font-mono text-white">
          {totalSearches}
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
          {t.statsSearches}
        </div>
      </div>

    </div>
  );
};
