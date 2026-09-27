import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  User, 
  Share2, 
  Info,
  Radio
} from 'lucide-react';
import { ContactRecord, Language } from '../types';
import { translations } from '../utils/translations';
import { detectBdOperator, formatPhoneNumber } from '../utils/fbUidExtractor';

interface ContactCardProps {
  contact: ContactRecord;
  language: Language;
  onViewDetails: (contact: ContactRecord) => void;
  isSpotlight?: boolean;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  language,
  onViewDetails,
  isSpotlight = false,
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const operatorInfo = detectBdOperator(contact.phone);
  const formattedPhone = formatPhoneNumber(contact.phone);

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(contact.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = () => {
    onViewDetails(contact);
  };

  // Avatar gradient styles based on ID
  const avatarGradients = [
    'from-blue-600 to-indigo-600',
    'from-indigo-600 to-purple-600',
    'from-cyan-600 to-blue-600',
    'from-emerald-600 to-teal-600',
    'from-violet-600 to-fuchsia-600',
  ];
  const gradientIndex = Math.abs(contact.fbUid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % avatarGradients.length;
  const gradientClass = avatarGradients[gradientIndex];

  return (
    <div 
      onClick={handleCardClick}
      className={`group cursor-pointer rounded-2xl transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
        isSpotlight
          ? 'bg-slate-900 border-2 border-blue-500/80 shadow-xl shadow-blue-500/15 p-5'
          : 'bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-blue-500/40 shadow-md hover:shadow-xl hover:shadow-slate-950/60 p-4 sm:p-5'
      }`}
    >
      {/* Top Accent line if spotlight */}
      {isSpotlight && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />
      )}

      {/* Main Card Content */}
      <div>
        {/* Top: Avatar, Name, Verified Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Avatar Circle */}
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white text-lg font-bold shadow-md shadow-slate-950/50 flex-shrink-0 group-hover:scale-105 transition-transform`}>
              {contact.name.charAt(0).toUpperCase()}
            </div>

            {/* Name & Occupation */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors truncate">
                  {contact.name}
                </h3>
                {contact.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                )}
              </div>

              {contact.banglaName && (
                <p className="text-xs text-slate-400 font-['Hind_Siliguri'] truncate">
                  {contact.banglaName}
                </p>
              )}

              {(contact.work || contact.occupation) && (
                <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{contact.work || contact.occupation}</span>
                </p>
              )}
            </div>
          </div>

          {/* Operator Badge */}
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold flex-shrink-0 ${operatorInfo.badgeClass}`}>
            {operatorInfo.name}
          </span>
        </div>

        {/* Middle Section: Phone Number Highlight */}
        <div className="mt-4 p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              {t.phoneNumber}
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-emerald-400 select-all">
              {contact.phone}
            </span>
          </div>

          {/* Copy Phone icon button */}
          <button
            onClick={handleCopyPhone}
            className={`p-2 rounded-lg transition-all active:scale-90 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
            }`}
            title={t.copyNumber}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* UID & Location Info Row */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {/* FB UID Box */}
          <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block font-medium">FB UID</span>
            <div className="flex items-center justify-between gap-1 mt-0.5">
              <span className="font-mono font-semibold text-slate-200 truncate select-all">
                {contact.fbUid}
              </span>
              <a
                href={contact.fbProfileUrl || `https://facebook.com/${contact.fbUid}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-slate-400 hover:text-blue-400 p-0.5 flex-shrink-0"
                title="Open Profile"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Location Box */}
          <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block font-medium">
              {language === 'bn' ? 'শহর / এলাকা' : 'Location'}
            </span>
            <div className="flex items-center gap-1 mt-0.5 text-slate-300 truncate">
              <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
              <span className="truncate">{contact.city || contact.location || 'Bangladesh'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons (Call, WhatsApp, Details) */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <a
          href={`tel:${contact.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/25 text-blue-300 hover:text-blue-200 text-xs font-semibold transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-blue-400" />
          <span>{t.callNow}</span>
        </a>

        <a
          href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/25 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(contact);
          }}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
          title={t.viewDetails}
        >
          <Info className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

    </div>
  );
};
