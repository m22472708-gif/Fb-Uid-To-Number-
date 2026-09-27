import React, { useEffect, useState } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  User, 
  Heart, 
  Calendar, 
  Mail, 
  QrCode,
  Radio
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { ContactRecord, Language } from '../types';
import { translations } from '../utils/translations';
import { detectBdOperator, formatPhoneNumber } from '../utils/fbUidExtractor';
import { downloadVCard, generateVCard } from '../utils/vcard';

interface ContactDetailsModalProps {
  contact: ContactRecord | null;
  onClose: () => void;
  language: Language;
}

export const ContactDetailsModal: React.FC<ContactDetailsModalProps> = ({
  contact,
  onClose,
  language,
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    if (!contact) return;
    const vcard = generateVCard(contact);
    QRCode.toDataURL(vcard, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR', err));
  }, [contact]);

  if (!contact) return null;

  const operatorInfo = detectBdOperator(contact.phone);
  const formattedPhone = formatPhoneNumber(contact.phone);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(contact.phone);
    setCopied(true);
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#10b981', '#06b6d4']
      });
    } catch {
      // ignore
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center space-x-4 pb-5 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-600/30 flex-shrink-0">
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white truncate">
                {contact.name}
              </h2>
              {contact.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  {t.verifiedProfile}
                </span>
              )}
            </div>

            {contact.banglaName && (
              <p className="text-sm text-slate-300 font-['Hind_Siliguri'] mt-0.5">
                {contact.banglaName}
              </p>
            )}

            {(contact.work || contact.occupation) && (
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{contact.work || contact.occupation}</span>
              </p>
            )}
          </div>
        </div>

        {/* Big Phone Card */}
        <div className="my-5 p-4 sm:p-5 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              {t.phoneNumber}
            </span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${operatorInfo.badgeClass}`}>
              <Radio className="w-3 h-3 inline mr-1" />
              {operatorInfo.name}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-3 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-wide select-all">
              {contact.phone}
            </span>

            <button
              onClick={handleCopyPhone}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copied : t.copyNumber}</span>
            </button>
          </div>

          {/* Quick Contact Actions: Call, WhatsApp, SMS */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-800/80">
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-semibold text-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.callNow}</span>
            </a>

            <a
              href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`sms:${contact.phone}`}
              className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-semibold text-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>{t.sendSms}</span>
            </a>
          </div>
        </div>

        {/* Detailed Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          
          {/* FB UID */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-0.5">{t.fbUidLabel}</span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-semibold text-white select-all">
                {contact.fbUid}
              </span>
              <a
                href={contact.fbProfileUrl || `https://facebook.com/${contact.fbUid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 text-[11px] font-medium"
              >
                <span>{t.openFbProfile}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-0.5">{t.location}</span>
            <div className="flex items-center gap-1.5 text-white font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span className="truncate">{contact.city || contact.location || 'Dhaka, Bangladesh'}</span>
            </div>
          </div>

          {/* Gender */}
          {contact.gender && (
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-0.5">{t.gender}</span>
              <div className="flex items-center gap-1.5 text-white font-medium">
                <User className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>
                  {contact.gender === 'laki-laki' || contact.gender === 'male' ? 'পুরুষ (Male)' : 'মহিলা (Female)'}
                </span>
              </div>
            </div>
          )}

          {/* Relationship */}
          {contact.relationshipStatus && (
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-0.5">{t.relationship}</span>
              <div className="flex items-center gap-1.5 text-white font-medium">
                <Heart className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                <span>{contact.relationshipStatus}</span>
              </div>
            </div>
          )}

          {/* Email */}
          {contact.email && (
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 sm:col-span-2">
              <span className="text-slate-400 block mb-0.5">{t.email}</span>
              <div className="flex items-center gap-1.5 text-white font-medium truncate select-all">
                <Mail className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">{contact.email}</span>
              </div>
            </div>
          )}

          {/* Work / Profession */}
          {(contact.work || contact.occupation) && (
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 sm:col-span-2">
              <span className="text-slate-400 block mb-0.5">{t.work}</span>
              <div className="flex items-center gap-1.5 text-white font-medium">
                <Briefcase className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span>{contact.work || contact.occupation}</span>
              </div>
            </div>
          )}

        </div>

        {/* QR Code Collapsible View */}
        {showQr && (
          <div className="mt-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center animate-fade-in">
            <p className="text-xs text-slate-400 mb-3">{t.scanToSave}</p>
            {qrDataUrl && (
              <img 
                src={qrDataUrl} 
                alt="Contact QR Code" 
                className="w-48 h-48 mx-auto bg-white p-2 rounded-xl shadow-md"
              />
            )}
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowQr(!showQr)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>{showQr ? 'QR লুকান' : t.qrCode}</span>
            </button>

            <button
              onClick={() => downloadVCard(contact)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{t.saveContact}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
