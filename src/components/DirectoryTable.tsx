import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Phone, 
  ExternalLink, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  ChevronLeft,
  ChevronRight,
  User,
  Radio
} from 'lucide-react';
import { ContactRecord, Language } from '../types';
import { translations } from '../utils/translations';
import { detectBdOperator } from '../utils/fbUidExtractor';

interface DirectoryTableProps {
  records: ContactRecord[];
  onSelectRecord: (record: ContactRecord) => void;
  onEditRecord: (record: ContactRecord) => void;
  onDeleteRecord: (id: string) => void;
  onAddNew: () => void;
  onResetDefaults: () => void;
  onExportJson: () => void;
  language: Language;
}

export const DirectoryTable: React.FC<DirectoryTableProps> = ({
  records,
  onSelectRecord,
  onEditRecord,
  onDeleteRecord,
  onAddNew,
  onResetDefaults,
  onExportJson,
  language,
}) => {
  const t = translations[language];
  const [filterQuery, setFilterQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filtered = records.filter((r) => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      (r.banglaName && r.banglaName.toLowerCase().includes(q)) ||
      r.phone.includes(q) ||
      r.fbUid.includes(q) ||
      (r.location && r.location.toLowerCase().includes(q)) ||
      (r.city && r.city.toLowerCase().includes(q)) ||
      (r.work && r.work.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 sm:mt-6 pb-20 sm:pb-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <span>{t.directoryTab}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-mono">
              {filtered.length} {language === 'bn' ? 'টি' : 'records'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'bn' ? 'সংরক্ষিত সকল ফেসবুক UID ও ফোন নম্বরের তালিকা' : 'List of all stored Facebook UIDs and phone numbers'}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={onAddNew}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.addNewContact}</span>
          </button>

          <button
            onClick={onExportJson}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{t.exportJson}</span>
            <span className="sm:hidden">JSON</span>
          </button>

          <button
            onClick={onResetDefaults}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
            title={t.resetDefault}
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.resetDefault}</span>
          </button>
        </div>
      </div>

      {/* Filter search box */}
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => {
            setFilterQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder={language === 'bn' ? 'নাম, UID, শহর বা নম্বর দিয়ে খুঁজুন...' : 'Search by name, UID, city or phone...'}
          className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors shadow-inner"
        />
      </div>

      {/* Mobile Card List View (Phones) */}
      <div className="block md:hidden space-y-2.5">
        {paginatedRecords.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            {t.noResultTitle}
          </div>
        ) : (
          paginatedRecords.map((record) => {
            const operator = detectBdOperator(record.phone);
            return (
              <div 
                key={record.id}
                className="bg-slate-900 border border-slate-800/90 rounded-2xl p-3.5 space-y-2.5 shadow-lg active:scale-[0.99] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div 
                    onClick={() => onSelectRecord(record)}
                    className="flex items-center space-x-2.5 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                      {record.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-white text-xs truncate">
                          {record.name}
                        </span>
                        {record.isVerified && (
                          <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400 truncate">
                        UID: {record.fbUid}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium flex-shrink-0 ${operator.badgeClass}`}>
                    {operator.name}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="font-mono font-bold text-emerald-400 select-all">
                    {record.phone}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onSelectRecord(record)}
                      className="px-2 py-1 rounded-lg bg-blue-600/20 text-blue-300 text-[11px] font-semibold"
                    >
                      ভিউ
                    </button>
                    <button
                      onClick={() => onEditRecord(record)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-300"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteRecord(record.id)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">{t.fullName}</th>
                <th className="py-3 px-4">{t.fbUidLabel}</th>
                <th className="py-3 px-4">{t.phoneNumber}</th>
                <th className="py-3 px-4">{t.operator}</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    {t.noResultTitle}
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => {
                  const operator = detectBdOperator(record.phone);

                  return (
                    <tr 
                      key={record.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div 
                          onClick={() => onSelectRecord(record)}
                          className="flex items-center space-x-3 cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {record.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                {record.name}
                              </span>
                              {record.isVerified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                            </div>
                            {record.location && (
                              <p className="text-slate-400 text-[11px]">
                                {record.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* FB UID */}
                      <td className="py-3 px-4 font-mono text-slate-300">
                        <div className="flex items-center space-x-1.5">
                          <span className="select-all font-semibold text-xs">{record.fbUid}</span>
                          <a
                            href={record.fbProfileUrl || `https://facebook.com/${record.fbUid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-cyan-400 p-0.5"
                            title="Open Facebook Profile"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400 select-all text-xs sm:text-sm">
                        {record.phone}
                      </td>

                      {/* Operator */}
                      <td className="py-3 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${operator.badgeClass}`}>
                          {operator.name}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => onSelectRecord(record)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 transition-colors"
                            title="View"
                          >
                            <Search className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditRecord(record)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteRecord(record.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between px-2 text-xs text-slate-400">
          <div>
            {language === 'bn' ? `পৃষ্ঠা ${currentPage} / ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white">
              {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
