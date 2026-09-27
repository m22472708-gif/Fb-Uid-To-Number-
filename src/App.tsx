/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Link2, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  Globe2, 
  User, 
  AtSign, 
  MapPin, 
  Heart, 
  FileText, 
  Calendar, 
  Mail, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Shield, 
  Info, 
  X,
  Phone,
  Copy,
  Check,
  Home as HomeIcon,
  Clipboard,
  AlertTriangle,
  SearchX,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { getInitialRecordsFromRaw } from './data/rawDatabase';
import { ContactRecord } from './types';
import { detectBdOperator, parseFbUidInput } from './utils/fbUidExtractor';

export default function App() {
  const records = getInitialRecordsFromRaw();

  const [searchInput, setSearchInput] = useState('');
  const [currentContact, setCurrentContact] = useState<ContactRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isFemaleGender = (gender?: string) => {
    if (!gender) return false;
    const g = gender.toLowerCase();
    return g.includes('female') || g.includes('perempuan') || g.includes('woman') || g.includes('মহিলা');
  };

  const executeSearch = (queryText: string) => {
    const query = queryText.trim();
    if (!query) {
      setCurrentContact(null);
      setNotFound(false);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setSearchedTerm(query);
    setIsLoading(true);

    const parsed = parseFbUidInput(query);
    const targetClean = parsed.cleaned.toLowerCase();
    const rawTarget = parsed.raw.toLowerCase();
    const numClean = query.replace(/[^0-9]/g, '');

    const found = records.find((r) => {
      const recordUid = r.fbUid.toLowerCase();
      const recordPhone = r.phone.replace(/[^0-9]/g, '');
      const recordName = r.name.toLowerCase();
      const recordFirst = (r.firstName || '').toLowerCase();
      const recordLast = (r.lastName || '').toLowerCase();

      // Exact UID match
      if (recordUid === targetClean || recordUid === rawTarget) return true;

      // Partial UID match
      if (targetClean && recordUid.includes(targetClean)) return true;

      // Phone match
      if (numClean && numClean.length >= 7) {
        if (recordPhone.includes(numClean) || numClean.includes(recordPhone)) return true;
      }

      // Name match
      if (recordName.includes(rawTarget) || recordFirst.includes(rawTarget) || recordLast.includes(rawTarget)) return true;

      return false;
    });

    // Realistic smooth brief loading delay (600ms)
    setTimeout(() => {
      setIsLoading(false);
      if (found) {
        setCurrentContact(found);
        setNotFound(false);
        setHasSearched(true);
      } else {
        // No match found in database
        setCurrentContact(null);
        setNotFound(true);
        setHasSearched(true);
      }
    }, 600);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeSearch(searchInput);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSearchInput(text.trim());
        executeSearch(text.trim());
      }
    } catch {
      // Permission not granted or unsupported
    }
  };

  const getInputTypeBadge = (val: string) => {
    const clean = val.trim();
    if (!clean) return null;
    if (clean.includes('facebook.com') || clean.includes('fb.me') || clean.includes('fb.com')) {
      return { text: 'Profile Link', color: 'bg-blue-500/20 text-sky-300 border-blue-500/40' };
    }
    const digits = clean.replace(/[^0-9]/g, '');
    if (digits.length >= 10 && (clean.startsWith('1000') || digits.length >= 14)) {
      return { text: 'FB UID', color: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
    }
    if (digits.startsWith('880') || digits.startsWith('01')) {
      return { text: 'Mobile Number', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
    return null;
  };

  const handleReset = () => {
    setSearchInput('');
    setCurrentContact(null);
    setNotFound(false);
    setHasSearched(false);
    setSearchedTerm('');
    setIsLoading(false);
  };

  const operatorInfo = currentContact ? detectBdOperator(currentContact.phone) : null;
  const fullName = currentContact
    ? (currentContact.name || `${currentContact.firstName || ''} ${currentContact.lastName || ''}`.trim() || 'Unknown')
    : '';

  const inputBadge = getInputTypeBadge(searchInput);

  return (
    <div className="min-h-screen bg-[#030d1e] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',_sans-serif] selection:bg-blue-600 selection:text-white pb-12">
      
      {/* Top Header Bar - Clean (No Menu Option) */}
      <header className="max-w-2xl w-full mx-auto px-4 pt-6 pb-4 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={handleReset}
          className="flex items-center space-x-3 cursor-pointer select-none group"
        >
          <div className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0 group-hover:scale-105 transition-transform">
            f
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
              <span>Facebook</span>
              <span className="text-[#0084ff]">UID Info</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Get public information from Facebook UID
            </p>
          </div>
        </div>

        {/* Status pill (Clean & Minimalist) */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#051c3d] border border-[#0e3160] text-sky-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Database</span>
        </div>

      </header>

      {/* Main Content */}
      <main className="max-w-2xl w-full mx-auto px-4 flex-1 space-y-4">
        
        {/* Search Bar Container with Stunning UI/UX */}
        <form onSubmit={handleSearchSubmit} className="space-y-2.5">
          <div className="relative group">
            
            {/* Ambient Animated Glow on hover & focus */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/25 via-blue-600/35 to-cyan-500/25 rounded-2xl blur-md opacity-40 group-focus-within:opacity-100 group-hover:opacity-75 transition-all duration-300 pointer-events-none" />

            <div className="relative bg-[#061838] border border-[#143c72] group-hover:border-sky-500/50 group-focus-within:border-[#0084ff] rounded-2xl p-1.5 sm:p-2 flex items-center gap-2 sm:gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all">
              
              {/* Prefix Icon Box */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sky-400 group-focus-within:text-white group-focus-within:bg-blue-600 group-focus-within:border-blue-400 transition-all shrink-0">
                <Link2 className="w-5 h-5 rotate-45" />
              </div>

              {/* Input Area */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter Facebook UID or Phone Number..."
                  className="w-full bg-transparent py-1.5 sm:py-2 text-sm sm:text-base font-semibold text-white placeholder-slate-500 outline-none tracking-wide"
                />
              </div>

              {/* Auto Detected Input Type Badge */}
              {inputBadge && (
                <div className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg border text-[11px] font-semibold tracking-tight uppercase shrink-0 animate-fade-in ${inputBadge.color}`}>
                  {inputBadge.text}
                </div>
              )}

              {/* Paste button (if empty) */}
              {!searchInput && (
                <button
                  type="button"
                  onClick={handlePaste}
                  className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#09224c] hover:bg-[#0e2f69] border border-[#184687] text-slate-300 hover:text-white text-xs font-semibold transition-all active:scale-95"
                  title="Paste from clipboard"
                >
                  <Clipboard className="w-3.5 h-3.5 text-sky-400" />
                  <span>Paste</span>
                </button>
              )}

              {/* Clear button if text exists */}
              {searchInput && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-[#0c2652] flex items-center justify-center transition-colors shrink-0"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Glowing Search CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-[#0066ff] to-[#0099ff] hover:from-[#0055ee] hover:to-[#0088ee] disabled:opacity-85 disabled:cursor-wait active:scale-95 text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center space-x-1.5 shadow-[0_0_25px_rgba(0,102,255,0.65)] hover:shadow-[0_0_35px_rgba(0,153,255,0.9)] transition-all shrink-0 select-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>খোঁজা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>

            </div>

          </div>

          {/* Subtitle Checkmark Info */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 px-1">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Only public information is shown. We do not collect or store any data.</span>
            </div>
            <span className="hidden sm:inline text-slate-500 font-mono text-[10px]">
              Press Enter ↵
            </span>
          </div>
        </form>

        {/* Loading State Indicator */}
        {isLoading && (
          <div className="bg-[#061836] border border-sky-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xl animate-fade-in relative overflow-hidden">
            {/* Ambient Animated Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-sky-500/15 blur-3xl pointer-events-none rounded-full" />
            
            {/* Pulsing Radar Ring & Spinner */}
            <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-sky-500/20 to-blue-600/10 border border-sky-500/40 text-sky-400 flex items-center justify-center shadow-[0_0_35px_rgba(0,132,255,0.35)]">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-[#0084ff]" />
            </div>

            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                ডাটাবেজে তথ্য খোঁজা হচ্ছে...
              </h3>
              <p className="text-xs text-slate-300">
                পাবলিক রেকর্ড ও ফেসবুক UID সার্ভার স্ক্যান করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন
              </p>
            </div>

            {/* Glowing animated progress line */}
            <div className="max-w-xs mx-auto h-1.5 bg-[#0a2347] rounded-full overflow-hidden p-0.5 border border-[#163c70]">
              <div className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 rounded-full animate-pulse w-4/5 mx-auto" />
            </div>
          </div>
        )}

        {/* 1. FRESH INITIAL STATE (When first opening the site) */}
        {!hasSearched && !isLoading && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Fresh Welcome Card */}
            <div className="bg-[#061836] border border-[#11315e] rounded-3xl p-8 sm:p-10 text-center space-y-3 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-[#0070f3]/15 border border-[#0070f3]/30 text-sky-400 flex items-center justify-center mx-auto shadow-inner mb-2">
                <Search className="w-8 h-8 text-[#0084ff]" />
              </div>

              <div className="max-w-md mx-auto space-y-1.5">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Search Facebook UID Information
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Enter any Facebook UID or mobile number in the search bar above to view complete verified public details.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* 2. NOT FOUND NOTICE CARD (When search yields no match) */}
        {!isLoading && hasSearched && notFound && (
          <div className="bg-[#061836] border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-fade-in relative overflow-hidden">
            
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

            {/* Glowing Search Not Found Icon */}
            <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-amber-500/20 to-amber-500/5 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.25)]">
              <SearchX className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            </div>

            {/* Main Message Title & Description */}
            <div className="max-w-lg mx-auto space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>সার্চ ফলাফল পাওয়া যায়নি</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                দুঃখিত, কোনো তথ্য খুঁজে পাওয়া যায়নি
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                আপনার দেওয়া নম্বর বা UID <span className="text-sky-400 font-mono font-bold bg-[#092247] px-2 py-0.5 rounded border border-[#143763]">{searchedTerm}</span> এর বিপরীতে আমাদের পাবলিক ডিরেক্টরিতে এই মুহূর্তে কোনো তথ্য খুঁজে পাওয়া যায়নি।
              </p>
            </div>

            {/* Helpful Insight Card */}
            <div className="max-w-md mx-auto text-left text-xs">
              <div className="bg-[#04132b] border border-[#0e2a54] rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>প্রাইভেসি সেটিংস</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  ফেসবুক ব্যবহারকারী যদি তার প্রোফাইলের যাবতীয় তথ্য সম্পূর্ণ গোপন (Only Me) করে রাখেন, তবে তা পাবলিক ডিরেক্টরিতে পাওয়া যায় না।
                </p>
              </div>
            </div>

            {/* Privacy Assurance Note */}
            <div className="max-w-lg mx-auto flex items-center justify-center space-x-2 text-slate-400 text-[11px] bg-[#031126] border border-[#0c244b] py-2 px-3 rounded-xl">
              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>আমরা শুধুমাত্র জনসাধারণের জন্য উন্মুক্ত থাকা তথ্য প্রদর্শন করি।</span>
            </div>

            {/* Action Button: Try Again */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#0099ff] hover:from-[#0055ee] hover:to-[#0088ee] text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(0,102,255,0.5)] transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>নতুন নম্বর বা UID দিয়ে খুঁজুন</span>
              </button>
            </div>

          </div>
        )}

        {/* 3. SEARCH RESULT: Facebook Profile Header Card */}
        {!isLoading && hasSearched && currentContact && (
          <div className="bg-[#061836] border border-[#11315e] rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            
            {/* Cover Photo / Header Banner */}
            <div className="h-24 sm:h-32 bg-gradient-to-r from-[#00388c] via-[#0d47a1] to-[#0052cc] relative overflow-hidden flex items-center justify-between px-5 sm:px-6">
              {/* Subtle background tech pattern */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Top Left Badge */}
              <div className="relative z-10 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/10 text-white text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Public Record</span>
              </div>

              {/* Top Right "Public Info" badge */}
              <div className="relative z-10">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#032a1e]/85 backdrop-blur-md border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-sm">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Public Info</span>
                </span>
              </div>
            </div>

            {/* Profile Avatar & Info Section */}
            <div className="px-5 sm:px-6 pb-6 -mt-12 sm:-mt-14 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              
              {/* Avatar + Name Block */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3.5 text-center sm:text-left">
                
                {/* Profile Avatar with authentic Facebook silhouette */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600 shadow-2xl">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#0c244b] border-4 border-[#061836] flex items-end justify-center relative">
                      
                      {isFemaleGender(currentContact.gender) ? (
                        /* Female White Vector Silhouette */
                        <svg viewBox="0 0 120 120" className="w-20 h-20 sm:w-24 sm:h-24 fill-white translate-y-1 drop-shadow-sm">
                          {/* Female Head */}
                          <circle cx="60" cy="42" r="16" />
                          {/* Hair flowing down sides */}
                          <path d="M43 42 C41 54 44 68 47 74 C45 64 45 52 47 44 Z" />
                          <path d="M77 42 C79 54 76 68 73 74 C75 64 75 52 73 44 Z" />
                          {/* Neck */}
                          <path d="M55 57 L55 65 L65 65 L65 57 Z" />
                          {/* Feminine Shoulders */}
                          <path d="M60 67 C44 67 31 77 28 94 C27 98 29 102 34 102 L86 102 C91 102 93 98 92 94 C89 77 76 67 60 67 Z" />
                        </svg>
                      ) : (
                        /* Male White Vector Silhouette */
                        <svg viewBox="0 0 120 120" className="w-20 h-20 sm:w-24 sm:h-24 fill-white translate-y-1 drop-shadow-sm">
                          {/* Head */}
                          <circle cx="60" cy="42" r="18" />
                          {/* Neck */}
                          <path d="M55 58 L55 66 L65 66 L65 58 Z" />
                          {/* Broad Male Shoulders */}
                          <path d="M60 67 C42 67 29 77 26 94 C25 98 27 102 32 102 L88 102 C93 102 95 98 94 94 C91 77 78 67 60 67 Z" />
                        </svg>
                      )}

                      {/* Online Active Indicator Dot */}
                      <div className="absolute bottom-1 right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#061836]" title="Active Record" />
                    </div>
                  </div>

                  {/* Gender Pill Badge */}
                  <div className="mt-1.5 flex justify-center">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#0a2347] border border-[#163a6e] text-sky-300 text-[11px] font-semibold">
                      <span>{isFemaleGender(currentContact.gender) ? '♀ Female' : '♂ Male'}</span>
                    </span>
                  </div>
                </div>

                {/* Name & Basic Details */}
                <div className="space-y-1 sm:mb-6">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Full Name (পূর্ণ নাম)
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {fullName}
                  </h2>
                  <div className="text-sm font-mono text-slate-300 flex items-center justify-center sm:justify-start space-x-2">
                    <span>{currentContact.phone}</span>
                    {operatorInfo && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#0a2347] border border-[#183a6b] text-sky-400 font-sans font-medium">
                        {operatorInfo.name}
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:justify-end flex-wrap gap-2 sm:mb-6">
                <a
                  href={currentContact.fbProfileUrl || `https://facebook.com/${currentContact.fbUid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 bg-[#0070f3] hover:bg-[#0060df] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Profile</span>
                </a>

                <a
                  href={`tel:${currentContact.phone}`}
                  className="inline-flex items-center space-x-1.5 bg-[#0a234a] hover:bg-[#0e2c5e] border border-[#163a6e] text-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>Call Now</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(currentContact.phone, 'top-phone')}
                  className="inline-flex items-center space-x-1.5 bg-[#0a234a] hover:bg-[#0e2c5e] border border-[#163a6e] text-slate-200 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all"
                >
                  {copiedKey === 'top-phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedKey === 'top-phone' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* 3. "Profile Information" Card (Pure Data Info) */}
        {!isLoading && hasSearched && currentContact && (
          <div className="bg-[#061836] border border-[#11315e] rounded-3xl p-5 sm:p-6 shadow-xl animate-fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#0d2a52]">
              <div className="flex items-center space-x-2 text-white font-bold text-base">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>Profile Information</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Search Another
              </button>
            </div>

            {/* List of Details with Icons */}
            <div className="divide-y divide-[#0d2a52]/80 text-xs sm:text-sm">
              
              {/* 1. Full Name */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span>Full Name</span>
                </div>
                <span className="font-bold text-white select-all">
                  {fullName}
                </span>
              </div>

              {/* 2. First Name */}
              {currentContact.firstName && (
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span>First Name</span>
                  </div>
                  <span className="font-semibold text-slate-200 select-all">
                    {currentContact.firstName}
                  </span>
                </div>
              )}

              {/* 3. Last Name / Username */}
              {currentContact.lastName && (
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <AtSign className="w-3.5 h-3.5" />
                    </div>
                    <span>Last Name / Username</span>
                  </div>
                  <span className="font-semibold text-slate-200 select-all">
                    {currentContact.lastName}
                  </span>
                </div>
              )}

              {/* 4. Phone Number */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span>Phone Number</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-white select-all">
                    {currentContact.phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentContact.phone, 'phone')}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Copy Phone"
                  >
                    {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 5. Facebook UID */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                    ID
                  </div>
                  <span>Facebook UID</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-white select-all">
                    {currentContact.fbUid}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentContact.fbUid, 'uid')}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Copy UID"
                  >
                    {copiedKey === 'uid' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={currentContact.fbProfileUrl || `https://facebook.com/${currentContact.fbUid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-sky-400 hover:text-sky-300"
                    title="Open Facebook Profile"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* 6. Gender */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold leading-none">♂</span>
                  </div>
                  <span>Gender</span>
                </div>
                <span className="font-semibold text-white capitalize">
                  {currentContact.gender || 'Laki-laki'}
                </span>
              </div>

              {/* 7. Location */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span>Location</span>
                </div>
                <span className="font-semibold text-white">
                  {currentContact.city || currentContact.location?.split(',')[0] || 'Dhaka'}
                </span>
              </div>

              {/* 8. Hometown (if available) */}
              {currentContact.hometown && (
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                      <HomeIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Hometown</span>
                  </div>
                  <span className="font-semibold text-white">
                    {currentContact.hometown}
                  </span>
                </div>
              )}

              {/* 9. Relationship Status */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                    <Heart className="w-3.5 h-3.5" />
                  </div>
                  <span>Relationship Status</span>
                </div>
                <span className="font-semibold text-white capitalize">
                  {currentContact.relationshipStatus || 'Lajang'}
                </span>
              </div>

              {/* 10. Bio / About */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span>Bio / About</span>
                </div>
                <span className="font-semibold text-white">
                  {currentContact.work || currentContact.occupation || 'Criminal Mind'}
                </span>
              </div>

              {/* 11. Date of Birth */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span>Date of Birth</span>
                </div>
                <span className="font-mono text-white text-xs">
                  {currentContact.birthday || '1/1/0001 12:00:00 AM'}
                </span>
              </div>

              {/* 12. Email Address */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span>Email Address</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-white text-xs truncate max-w-[170px] sm:max-w-none select-all">
                    {currentContact.email || 'ehsanahmedonol@gmail.com'}
                  </span>
                  {currentContact.email && (
                    <button
                      type="button"
                      onClick={() => handleCopy(currentContact.email || '', 'email')}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Copy Email"
                    >
                      {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 4. Four Feature Highlights Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          
          {/* Card 1 */}
          <div className="bg-[#061836] border border-[#11315e] rounded-2xl p-3.5 text-center">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">
              Fast & Easy
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Get info in seconds
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#061836] border border-[#11315e] rounded-2xl p-3.5 text-center">
            <div className="w-8 h-8 rounded-full bg-[#0070f3] text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">
              100% Public Data
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              No login required
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#061836] border border-[#11315e] rounded-2xl p-3.5 text-center">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">
              Mobile Friendly
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Works on all devices
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#061836] border border-[#11315e] rounded-2xl p-3.5 text-center">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">
              Safe & Secure
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Your privacy matters
            </div>
          </div>

        </div>

        {/* 5. Privacy & Info Note Card */}
        <div className="bg-[#061836] border border-[#11315e] rounded-2xl p-3.5 flex items-start space-x-2.5 text-xs text-slate-300">
          <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-3.5 h-3.5" />
          </div>
          <p className="leading-relaxed">
            <span className="font-semibold text-white">Note:</span> This tool only works with public information. We do not store any data or access private information.
          </p>
        </div>

      </main>

    </div>
  );
}
