import React, { useState } from 'react';
import { HelpCircle, ExternalLink, Copy, Check, ArrowRight, ShieldAlert, Sparkles, Hash } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { parseFbUidInput } from '../utils/fbUidExtractor';

interface UidHelperModalProps {
  language: Language;
  onSearchWithExtracted: (uid: string) => void;
}

export const UidHelperModal: React.FC<UidHelperModalProps> = ({
  language,
  onSearchWithExtracted,
}) => {
  const t = translations[language];
  const [testUrl, setTestUrl] = useState('');
  const [extracted, setExtracted] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExtract = () => {
    if (!testUrl.trim()) return;
    const parsed = parseFbUidInput(testUrl);
    setExtracted(parsed.cleaned || testUrl);
  };

  const handleCopy = () => {
    if (extracted) {
      navigator.clipboard.writeText(extracted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {t.howToFindUidTitle}
          </h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {language === 'bn'
            ? 'ফেসবুক ইউআইডি (Facebook UID) হলো প্রতিটি ফেসবুক অ্যাকাউন্টের জন্য নির্ধারিত ইউনিক সনাক্তকরণ নম্বর (যেমন: 10008925723245)। নিচে কীভাবে সহজেই যেকারো UID বের করবেন তার উপায় দেওয়া হলো:'
            : 'Facebook UID is a unique numerical ID assigned to every Facebook profile (e.g. 10008925723245). Here is how you can find and extract it:'}
        </p>

        {/* Step by Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-sm mb-3">
              1
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">
              {language === 'bn' ? 'প্রোফাইল লিংক কপি করুন' : 'Copy Profile URL'}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'ফেসবুক অ্যাপ বা ব্রাউজার থেকে প্রোফাইল মেনু ওপেন করে "Copy Link to Profile" এ চাপ দিন।'
                : 'Open the profile and click "Copy link to profile" from the menu options.'}
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm mb-3">
              2
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">
              {language === 'bn' ? 'স্বয়ংক্রিয় এক্সট্রাক্ট' : 'Auto Extractor'}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'আমাদের এই টুলের সার্চ বারে লিংকটি পেস্ট করলেই তা স্বয়ংক্রিয়ভাবে UID শনাক্ত করে নেবে।'
                : 'Paste the link into our search bar and the numeric UID will be extracted automatically.'}
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm mb-3">
              3
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">
              {language === 'bn' ? 'সরাসরি তথ্য দেখুন' : 'View Contact Info'}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'সার্চ বাটনে চাপ দিলেই সাকিব মিয়ার নাম (Sakib Mia) এবং ফোন নম্বর (8801925723245) দেখতে পাবেন।'
                : 'Click search to instantly view Sakib Mia name and mobile number 8801925723245.'}
            </p>
          </div>
        </div>
      </div>

      {/* Live URL to UID Extractor Playground */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <Hash className="w-5 h-5 text-emerald-400" />
          <span>{language === 'bn' ? 'লাইভ ফেসবুক লিংক থেকে UID এক্সট্রাক্ট করুন' : 'Live Facebook URL to UID Extractor'}</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          {language === 'bn'
            ? 'যেকোনো ফেসবুক লিংক (যেমন https://facebook.com/profile.php?id=10008925723245) পেস্ট করে পরীক্ষা করুন:'
            : 'Paste any Facebook profile URL to test and extract its UID:'}
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="https://facebook.com/profile.php?id=10008925723245"
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 font-mono outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleExtract}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
          >
            <span>{language === 'bn' ? 'UID বের করুন' : 'Extract UID'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Extracted Output Result */}
        {extracted && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-xs text-slate-400 block">
                {language === 'bn' ? 'শনাক্তকৃত UID / ইউজারনেম:' : 'Extracted UID / Username:'}
              </span>
              <span className="text-lg font-mono font-bold text-emerald-400 select-all">
                {extracted}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.copied : t.copyNumber}</span>
              </button>
              <button
                onClick={() => onSearchWithExtracted(extracted)}
                className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
              >
                <span>{language === 'bn' ? 'ডিরেক্টরিতে সার্চ করুন' : 'Search in Directory'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
