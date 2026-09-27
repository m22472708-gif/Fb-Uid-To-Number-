import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Plus, 
  Sparkles, 
  FileCode, 
  Info, 
  Upload, 
  CheckCircle2,
  Search,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ContactRecord, Language } from '../types';
import { translations } from '../utils/translations';
import { RAW_DATABASE_ENTRIES, buildRawDbLine, parseRawDbLine } from '../data/rawDatabase';

interface RawDatabaseViewerProps {
  records: ContactRecord[];
  onImportRawLines: (newRecords: ContactRecord[]) => void;
  onSelectRecord: (record: ContactRecord) => void;
  language: Language;
}

export const RawDatabaseViewer: React.FC<RawDatabaseViewerProps> = ({
  records,
  onImportRawLines,
  onSelectRecord,
  language,
}) => {
  const t = translations[language];
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [inputLines, setInputLines] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Generate all lines from current records
  const allLines = records.map((r) => buildRawDbLine(r));
  const fullText = allLines.join('\n');

  const handleCopyAll = () => {
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (line: string, idx: number) => {
    navigator.clipboard.writeText(line);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'raw_facebook_uid_database.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!inputLines.trim()) return;

    const lines = inputLines.split('\n');
    const parsedList: ContactRecord[] = [];

    lines.forEach((line, i) => {
      const parsed = parseRawDbLine(line, Date.now() + i);
      if (parsed) {
        parsedList.push(parsed);
      }
    });

    if (parsedList.length > 0) {
      onImportRawLines(parsedList);
      setImportStatus(
        language === 'bn' 
          ? `সফলভাবে ${parsedList.length} টি রেকর্ড ইম্পোর্ট হয়েছে!` 
          : `Successfully imported ${parsedList.length} records!`
      );
      setInputLines('');
      setTimeout(() => setImportStatus(null), 4000);
    } else {
      setImportStatus(
        language === 'bn' 
          ? 'কোনো সঠিক কোলন ফরম্যাট লাইন পাওয়া যায়নি।' 
          : 'No valid colon-formatted lines found.'
      );
      setTimeout(() => setImportStatus(null), 4000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>{language === 'bn' ? 'র ডাটাবেজ ফাইল ভিউয়ার (Raw DB File)' : 'Raw DB File Format Viewer'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  {records.length} lines
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'bn' 
                  ? 'নির্ধারিত ফরম্যাট: Phone:UID:FirstName:LastName:Gender:City:Hometown:Relationship:Work:Birthday:Email:' 
                  : 'Standard format: Phone:UID:FirstName:LastName:Gender:City:Hometown:Relationship:Work:Birthday:Email:'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all active:scale-95"
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAll ? t.copied : (language === 'bn' ? 'সম্পূর্ণ ফাইল কপি' : 'Copy Full File')}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? '.txt ডাউনলোড' : 'Download .txt'}</span>
            </button>
          </div>
        </div>

        {/* Highlighted File Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              src/data/rawDatabase.ts (Raw Lines)
            </span>
            <span>UTF-8 • {records.length} records</span>
          </div>

          <div className="p-4 space-y-2 max-h-96 overflow-y-auto font-mono text-xs text-cyan-200">
            {allLines.map((line, idx) => (
              <div 
                key={idx}
                className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-900/90 border border-transparent hover:border-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <span className="text-slate-600 select-none text-[11px] w-6 text-right">
                    {idx + 1}
                  </span>
                  <span className="break-all select-all text-slate-300 group-hover:text-cyan-200">
                    {line}
                  </span>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0 ml-2 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={() => handleCopySingle(line, idx)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy Line"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => onSelectRecord(records[idx])}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                    title="View / Search Card"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Raw Line Importer Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <Upload className="w-5 h-5 text-emerald-400" />
          <span>{language === 'bn' ? 'নতুন র (Raw) ডাটাবেজ লাইন ইম্পোর্ট করুন' : 'Import New Raw Format Lines'}</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          {language === 'bn'
            ? 'প্রতি লাইনে একটি করে কোলন ফরম্যাট ডাটা পেস্ট করুন (Phone:UID:FirstName:LastName:Gender:City:Hometown:Relationship:Work:Birthday:Email:):'
            : 'Paste colon-separated records line by line to add them to database:'}
        </p>

        <textarea
          value={inputLines}
          onChange={(e) => setInputLines(e.target.value)}
          placeholder={`8801515224058:100006738752653:Ehsan:Onol:laki-laki:Dhaka::Lajang:Criminal Mind:1/1/0001 12:00:00 AM:ehsanahmedonol@gmail.com:\n8801925723245:10008925723245:Sakib:Mia:laki-laki:Dhaka:Dhaka:Lajang:Entrepreneur:1/1/2000 12:00:00 AM:sakib.mia@gmail.com:`}
          rows={4}
          className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs sm:text-sm text-cyan-200 font-mono placeholder-slate-600 outline-none focus:border-cyan-500"
        />

        {importStatus && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-end space-x-3">
          <button
            onClick={() => setInputLines('')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            {t.clearHistory}
          </button>
          <button
            onClick={handleImport}
            className="flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'ডাটাবেজে যুক্ত করুন' : 'Import to Database'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
