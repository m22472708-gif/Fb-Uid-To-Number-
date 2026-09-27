import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  Download, 
  MapPin, 
  Mail, 
  Briefcase, 
  Heart, 
  User, 
  Clock, 
  Share2,
  CheckCircle2
} from 'lucide-react';
import { ContactRecord, Language } from '../types';
import { translations } from '../utils/translations';
import { detectBdOperator, formatPhoneNumber } from '../utils/fbUidExtractor';
import { downloadVCard } from '../utils/vcard';

interface SingleProfileResultProps {
  contact: ContactRecord;
  language: Language;
  onOpenQr: (contact: ContactRecord) => void;
}

export const SingleProfileResult: React.FC<SingleProfileResultProps> = ({
  contact,
  language,
  onOpenQr,
}) => {
  const t = translations[language];
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  const operatorInfo = detectBdOperator(contact.phone);
  const formattedPhone = formatPhoneNumber(contact.phone);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(contact.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyUid = () => {
    navigator.clipboard.writeText(contact.fbUid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: contact.name,
          text: `Contact Info: ${contact.name} - ${contact.phone} (FB UID: ${contact.fbUid})`,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      handleCopyPhone();
    }
  };

  // Avatar background colors
  const avatarColors = [
    'from-blue-600 to-indigo-600',
    'from-emerald-600 to-teal-600',
    'from-violet-600 to-purple-600',
    'from-cyan-600 to-blue-600',
  ];
  const colorIndex = (contact.name.charCodeAt(0) || 0) % avatarColors.length;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-fade-in">
      
      {/* Top Profile Header */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${avatarColors[colorIndex]} text-white flex items-center justify-center text-2xl font-bold shadow-sm shrink-0`}>
              {contact.name.charAt(0).toUpperCase()}
            </div>

            {/* Name & Status */}
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {contact.name}
                </h2>
                <span title="Verified record">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                </span>
              </div>

              {contact.banglaName && (
                <p className="text-sm text-slate-500 font-['Hind_Siliguri']">
                  {contact.banglaName}
                </p>
              )}

              {(contact.work || contact.occupation) && (
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{contact.work || contact.occupation}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick utility buttons */}
          <div className="flex items-center space-x-1.5 self-end sm:self-auto">
            <button
              onClick={() => onOpenQr(contact)}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all shadow-2xs"
              title={t.qrCode}
            >
              <QrCode className="w-4 h-4 text-slate-700" />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all shadow-2xs"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-slate-700" />
            </button>
            <button
              onClick={() => downloadVCard(contact)}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all shadow-2xs"
              title={t.saveContact}
            >
              <Download className="w-4 h-4 text-slate-700" />
            </button>
          </div>

        </div>
      </div>

      {/* Primary Phone Box */}
      <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t.phoneNumber}
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded-md border ${operatorInfo.badgeClass}`}>
                {operatorInfo.name}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 select-all tracking-tight">
              {contact.phone}
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              {formattedPhone}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center flex-wrap gap-2">
            <a
              href={`tel:${contact.phone}`}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>{t.callNow}</span>
            </a>

            <a
              href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(contact.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={handleCopyPhone}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center space-x-1 ${
                copiedPhone 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {copiedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPhone ? t.copied : t.copyNumber}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Complete Information Grid (Clean & Structured) */}
      <div className="p-6 sm:p-8 bg-white">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          {language === 'bn' ? 'সকল বিস্তারিত তথ্য' : 'Profile Details'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
          
          {/* Facebook UID */}
          <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium mb-1">
              {t.fbUidLabel}
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-800 select-all">
                {contact.fbUid}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleCopyUid}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                  title="Copy UID"
                >
                  {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={contact.fbProfileUrl || `https://facebook.com/${contact.fbUid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-blue-600 hover:text-blue-700 rounded transition-colors"
                  title="Open Facebook"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
            <span className="text-[11px] text-slate-400 font-medium mb-1 block">
              {t.location}
            </span>
            <div className="flex items-center space-x-1.5 font-medium text-slate-800">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="truncate">{contact.location || contact.city || 'N/A'}</span>
            </div>
          </div>

          {/* Gender */}
          <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
            <span className="text-[11px] text-slate-400 font-medium mb-1 block">
              {t.gender}
            </span>
            <div className="flex items-center space-x-1.5 font-medium text-slate-800">
              <User className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="capitalize">{contact.gender || 'Not specified'}</span>
            </div>
          </div>

          {/* Relationship Status */}
          <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
            <span className="text-[11px] text-slate-400 font-medium mb-1 block">
              {t.relationship}
            </span>
            <div className="flex items-center space-x-1.5 font-medium text-slate-800">
              <Heart className="w-4 h-4 text-pink-500 shrink-0" />
              <span className="capitalize">{contact.relationshipStatus || 'Single'}</span>
            </div>
          </div>

          {/* Work / Profession */}
          {(contact.work || contact.occupation) && (
            <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 sm:col-span-2">
              <span className="text-[11px] text-slate-400 font-medium mb-1 block">
                {t.work}
              </span>
              <div className="flex items-center space-x-1.5 font-medium text-slate-800">
                <Briefcase className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{contact.work || contact.occupation}</span>
              </div>
            </div>
          )}

          {/* Email */}
          {contact.email && (
            <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 sm:col-span-2">
              <span className="text-[11px] text-slate-400 font-medium mb-1 block">
                {t.email}
              </span>
              <div className="flex items-center space-x-1.5 font-medium text-slate-800 truncate">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline truncate">
                  {contact.email}
                </a>
              </div>
            </div>
          )}

          {/* Birthday / Date */}
          {contact.birthday && contact.birthday !== '1/1/0001 12:00:00 AM' && (
            <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 sm:col-span-2">
              <span className="text-[11px] text-slate-400 font-medium mb-1 block">
                {t.birthday}
              </span>
              <div className="flex items-center space-x-1.5 font-mono text-slate-700">
                <Clock className="w-4 h-4 text-purple-500 shrink-0" />
                <span>{contact.birthday}</span>
              </div>
            </div>
          )}

        </div>

        {/* View on Facebook Big Footer Button */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
          <a
            href={contact.fbProfileUrl || `https://facebook.com/${contact.fbUid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            <span>{t.openFbProfile}</span>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </a>
        </div>

      </div>

    </div>
  );
};
