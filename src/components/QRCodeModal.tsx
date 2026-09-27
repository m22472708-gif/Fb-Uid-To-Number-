import React, { useEffect, useState } from 'react';
import { X, Download, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { ContactRecord, Language } from '../types';
import { translations } from '../utils/translations';
import { generateVCard, downloadVCard } from '../utils/vcard';

interface QRCodeModalProps {
  contact: ContactRecord | null;
  onClose: () => void;
  language: Language;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  contact,
  onClose,
  language,
}) => {
  const t = translations[language];
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

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
      .catch((err) => console.error('Error generating QR code', err));
  }, [contact]);

  if (!contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-xl text-center">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-center space-x-2 text-blue-600 mb-1">
          <QrCode className="w-5 h-5" />
          <h3 className="text-lg font-bold text-slate-900">{t.qrCode}</h3>
        </div>

        <p className="text-xs text-slate-500 mb-5">
          {t.scanToSave}
        </p>

        {/* QR Code Container */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl inline-block shadow-2xs mx-auto mb-4">
          {qrDataUrl ? (
            <img 
              src={qrDataUrl} 
              alt={`QR Code for ${contact.name}`} 
              className="w-52 h-52 mx-auto rounded-lg"
            />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
              Generating QR...
            </div>
          )}
        </div>

        <div className="text-sm font-bold text-slate-900">
          {contact.name}
        </div>
        <div className="text-xs font-mono font-semibold text-blue-600 mt-0.5">
          {contact.phone}
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
          UID: {contact.fbUid}
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-center space-x-2">
          <button
            onClick={() => downloadVCard(contact)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{t.saveContact}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
