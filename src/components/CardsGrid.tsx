import React, { useState } from 'react';
import { LayoutGrid, List, UserX, ChevronDown, Sparkles } from 'lucide-react';
import { ContactRecord, Language } from '../types';
import { translations } from '../utils/translations';
import { ContactCard } from './ContactCard';

interface CardsGridProps {
  contacts: ContactRecord[];
  exactMatch: ContactRecord | null;
  language: Language;
  onViewDetails: (contact: ContactRecord) => void;
  onResetFilters: () => void;
}

export const CardsGrid: React.FC<CardsGridProps> = ({
  contacts,
  exactMatch,
  language,
  onViewDetails,
  onResetFilters,
}) => {
  const t = translations[language];
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState<number>(24);

  const displayedContacts = contacts.slice(0, visibleCount);
  const hasMore = visibleCount < contacts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 24);
  };

  if (contacts.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto my-12 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
          <UserX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          {t.noResultTitle}
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          {t.noResultDesc}
        </p>
        <button
          onClick={onResetFilters}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/30 active:scale-95"
        >
          {t.clearFilters}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      
      {/* Top Controls: View Mode & Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-white">
            {language === 'bn' ? 'সকল পরিচিতি কার্ড' : 'Contact Profile Cards'}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
            {contacts.length}
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title={t.gridView}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title={t.listView}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Spotlight Card if Exact Match found during search */}
      {exactMatch && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{language === 'bn' ? 'সার্চের ফলাফল (সেরা মিল):' : 'Best Search Match:'}</span>
          </div>
          <ContactCard
            contact={exactMatch}
            language={language}
            onViewDetails={onViewDetails}
            isSpotlight={true}
          />
        </div>
      )}

      {/* Cards Display Grid / List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
            : 'flex flex-col space-y-3.5'
        }
      >
        {displayedContacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            language={language}
            onViewDetails={onViewDetails}
            isSpotlight={exactMatch?.id === contact.id}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-6 text-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-slate-950/40 transition-all active:scale-95"
          >
            <span>{t.loadMore} ({contacts.length - visibleCount} {language === 'bn' ? 'টি বাকি' : 'remaining'})</span>
            <ChevronDown className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      )}

    </div>
  );
};
