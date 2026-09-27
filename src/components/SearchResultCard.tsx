import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  Download, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Briefcase, 
  Tag, 
  Share2,
  Calendar,
  Radio,
  FileCode,
  Heart,
  User,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ContactRecord, Language } from '../types';
import { translations } from '../utils/translations';
import { detectBdOperator, formatPhoneNumber } from '../utils/fbUidExtractor';
import { downloadVCard } from '../utils/vcard';
import { buildRawDbLine } from '../data/rawDatabase';

interface SearchResultCardProps {
  contact: ContactRecord;
  language: Language;
  onOpenQrCode: (contact: ContactRecord) => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  contact,
  language,
  onOpenQrCode,
}) => {
  const t = translations[language];
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  
  const operatorInfo = detectBdOperator(contact.phone);
  const formattedPhone = formatPhoneNumber(contact.phone);
  const rawLine = buildRawDbLine(contact);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(contact.phone);
    setCopiedPhone(true);
    triggerConfetti();
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyRawLine = () => {
    navigator.clipboard.writeText(rawLine);
    setCopiedRaw(true);
    triggerConfetti();
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.75 },
        colors: ['#3b82f6', '#06b6d4', '#10b981']
      });
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${contact.name} - FB UID Database`,
          text: `FB UID: ${contact.fbUid} | Phone: ${contact.phone} | Name: ${contact.name}`,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      handleCopyRawLine();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 bg-slate-900 border border-slate-700/80 rounded-3xl p-4 sm:p-7 shadow-2xl shadow-blue-950/40 relative overflow-hidden">
      
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

      {/* Header Profile Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 pb-4 sm:pb-5 border-b border-slate-800/80">
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-lg shadow-blue-600/30 border-2 border-slate-700 overflow-hidden">
              <span>{contact.name.charAt(0).toUpperCase()}</span>
            </div>

            {/* Active green indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Name & Identity */}
          <div className="min-w-0">
            <div className="flex items-center flex-wrap gap-1.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
                {contact.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                {t.verifiedProfile}
              </span>
            </div>

            {contact.banglaName && (
              <p className="text-sm text-slate-300 font-medium font-['Hind_Siliguri']">
                {contact.banglaName}
              </p>
            )}

            {(contact.work || contact.occupation) && (
              <div className="flex items-center text-xs text-slate-400 mt-0.5 gap-1 truncate">
                <Briefcase className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{contact.work || contact.occupation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center space-x-1.5 self-end sm:self-auto">
          <button
            onClick={() => onOpenQrCode(contact)}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
            title={t.qrCode}
          >
            <QrCode className="w-4 h-4 text-blue-400" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
            title="Share"
          >
            <Share2 className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={() => downloadVCard(contact)}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
            title={t.saveContact}
          >
            <Download className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* RAW DATABASE COLON FORMAT (কোলন ফরম্যাট বক্স) */}
      <div className="mt-4 bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4.5 relative">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center space-x-1.5">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              {language === 'bn' ? 'ডাটাবেজ র (Raw) ফরম্যাট' : 'Database Raw Colon Format'}
            </span>
          </div>

          <button
            onClick={handleCopyRawLine}
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
              copiedRaw 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
            }`}
          >
            {copiedRaw ? (
              <>
                <Check className="w-3 h-3 text-emerald-200" />
                <span>কপি হয়েছে</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>কপি</span>
              </>
            )}
          </button>
        </div>

        {/* The Exact Raw Colon Line */}
        <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm text-cyan-200 break-all select-all leading-relaxed">
          {rawLine}
        </div>
      </div>

      {/* Phone Number Box & Operator */}
      <div className="my-4 bg-slate-950/70 rounded-2xl p-4 sm:p-5 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t.phoneNumber}
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${operatorInfo.badgeClass}`}>
                <Radio className="w-2.5 h-2.5 inline mr-1 animate-pulse" />
                {operatorInfo.name}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-wide select-all">
                {contact.phone}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden md:inline">
                ({formattedPhone})
              </span>
            </div>
          </div>

          {/* Copy Number Button */}
          <button
            onClick={handleCopyPhone}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow-md ${
              copiedPhone 
                ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
          >
            {copiedPhone ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>{t.copyNumber}</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile-first Touch Call, WhatsApp, SMS bar */}
        <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3.5 border-t border-slate-800/80">
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-blue-100 text-xs font-bold transition-all active:scale-95"
          >
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.callNow}</span>
          </a>

          <a
            href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}?text=Assalamu%20Alaikum%20${encodeURIComponent(contact.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 hover:text-emerald-100 text-xs font-bold transition-all active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`sms:${contact.phone}`}
            className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 hover:text-purple-100 text-xs font-bold transition-all active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>SMS</span>
          </a>
        </div>
      </div>

      {/* Field Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        
        {/* FB UID */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
            {t.fbUidLabel}
          </span>
          <div className="flex items-center justify-between">
            <span className="font-mono text-white font-semibold text-xs sm:text-sm select-all">
              {contact.fbUid}
            </span>
            <a
              href={contact.fbProfileUrl || `https://facebook.com/${contact.fbUid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium hover:underline"
            >
              <span>{t.openFbProfile}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
            Email
          </span>
          <div className="flex items-center gap-1.5 text-white font-medium truncate">
            <Mail className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span className="truncate select-all">{contact.email || 'N/A'}</span>
          </div>
        </div>

        {/* First & Last Name */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
            First & Last Name
          </span>
          <div className="flex items-center gap-1.5 text-white font-medium">
            <User className="w-3 h-3 text-indigo-400" />
            <span>
              {contact.firstName || contact.name.split(' ')[0]} : {contact.lastName || contact.name.split(' ').slice(1).join(' ') || '-'}
            </span>
          </div>
        </div>

        {/* Gender */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
            Gender (লিঙ্গ)
          </span>
          <span className="text-white font-medium">
            {contact.gender || 'laki-laki'}
          </span>
        </div>

        {/* City / Location */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
            Location / City (শহর)
          </span>
          <div className="flex items-center gap-1.5 text-white font-medium">
            <MapPin className="w-3 h-3 text-rose-400" />
            <span>{contact.city || contact.location || 'Bangladesh'}</span>
          </div>
        </div>

        {/* Relationship Status */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
            Relationship (সম্পর্ক)
          </span>
          <div className="flex items-center gap-1.5 text-white font-medium">
            <Heart className="w-3 h-3 text-pink-400" />
            <span>{contact.relationshipStatus || 'Single / Lajang'}</span>
          </div>
        </div>

        {/* Work / Bio */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
            Work / Bio (পেশা বা বিবরণ)
          </span>
          <div className="flex items-center gap-1.5 text-white font-medium truncate">
            <Briefcase className="w-3 h-3 text-teal-400 flex-shrink-0" />
            <span className="truncate">{contact.work || contact.occupation || 'N/A'}</span>
          </div>
        </div>

        {/* Birthday / Timestamp */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
            Birthday / Timestamp
          </span>
          <div className="flex items-center gap-1.5 text-white font-mono text-[11px]">
            <Clock className="w-3 h-3 text-purple-400" />
            <span>{contact.birthday || '1/1/0001 12:00:00 AM'}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
