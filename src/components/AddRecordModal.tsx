import React, { useState, useEffect } from 'react';
import { X, Save, UserCheck, ShieldCheck } from 'lucide-react';
import { ContactRecord, Language } from '../types';
import { translations } from '../utils/translations';
import { detectBdOperator, parseFbUidInput } from '../utils/fbUidExtractor';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: ContactRecord) => void;
  editingRecord?: ContactRecord | null;
  language: Language;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRecord,
  language,
}) => {
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: '',
    banglaName: '',
    phone: '',
    fbUid: '',
    fbUsername: '',
    email: '',
    location: 'Dhaka, Bangladesh',
    occupation: '',
    bio: '',
    isVerified: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        name: editingRecord.name || '',
        banglaName: editingRecord.banglaName || '',
        phone: editingRecord.phone || '',
        fbUid: editingRecord.fbUid || '',
        fbUsername: editingRecord.fbUsername || '',
        email: editingRecord.email || '',
        location: editingRecord.location || 'Dhaka, Bangladesh',
        occupation: editingRecord.occupation || '',
        bio: editingRecord.bio || '',
        isVerified: editingRecord.isVerified ?? true,
      });
    } else {
      setFormData({
        name: '',
        banglaName: '',
        phone: '',
        fbUid: '',
        fbUsername: '',
        email: '',
        location: 'Dhaka, Bangladesh',
        occupation: '',
        bio: '',
        isVerified: true,
      });
    }
    setErrors({});
  }, [editingRecord, isOpen]);

  if (!isOpen) return null;

  const handleUidChange = (val: string) => {
    const parsed = parseFbUidInput(val);
    setFormData((prev) => ({
      ...prev,
      fbUid: parsed.cleaned || val,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = language === 'bn' ? 'নাম প্রয়োজন' : 'Name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = language === 'bn' ? 'মোবাইল নম্বর প্রয়োজন' : 'Phone number is required';
    }
    if (!formData.fbUid.trim()) {
      newErrors.fbUid = language === 'bn' ? 'ফেসবুক UID প্রয়োজন' : 'Facebook UID is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    const operator = detectBdOperator(cleanPhone).name;

    const recordToSave: ContactRecord = {
      id: editingRecord ? editingRecord.id : `record-${Date.now()}`,
      name: formData.name.trim(),
      banglaName: formData.banglaName.trim() || undefined,
      phone: cleanPhone,
      fbUid: formData.fbUid.trim(),
      fbUsername: formData.fbUsername.trim() || undefined,
      fbProfileUrl: `https://facebook.com/${formData.fbUid.trim()}`,
      email: formData.email.trim() || undefined,
      location: formData.location.trim() || undefined,
      occupation: formData.occupation.trim() || undefined,
      bio: formData.bio.trim() || undefined,
      isVerified: formData.isVerified,
      operator: operator,
      createdAt: editingRecord ? editingRecord.createdAt : new Date().toISOString(),
    };

    onSave(recordToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center space-x-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {editingRecord ? t.editModalTitle : t.addModalTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'bn' ? 'ইউআইডি ও মোবাইল নম্বরের সংযোগ স্থাপন করুন' : 'Map Facebook UID to phone number and identity'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          {/* Name in English */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {t.nameInput} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sakib Mia"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 font-medium"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Name in Bangla */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {t.banglaNameInput}
            </label>
            <input
              type="text"
              value={formData.banglaName}
              onChange={(e) => setFormData({ ...formData, banglaName: e.target.value })}
              placeholder="যেমন: সাকিব মিয়া"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 font-['Hind_Siliguri']"
            />
          </div>

          {/* FB UID */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {t.uidInput} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.fbUid}
              onChange={(e) => handleUidChange(e.target.value)}
              placeholder="10008925723245 অথবা সম্পূর্ণ ফেসবুক প্রোফাইল লিংক"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-mono outline-none focus:border-blue-500"
            />
            {errors.fbUid && <p className="text-red-400 text-xs mt-1">{errors.fbUid}</p>}
            <p className="text-[11px] text-slate-400 mt-1">
              💡 আপনি প্রোফাইল লিংক পেস্ট করলে স্বয়ংক্রিয়ভাবে UID এক্সট্রাক্ট করা হবে।
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {t.phoneInput} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="8801925723245"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-mono outline-none focus:border-blue-500"
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Location & Occupation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {t.locationInput}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Dhaka, Bangladesh"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                পেশা / পদবী
              </label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="Business / Specialist"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          {/* Verified toggle */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isVerified"
              checked={formData.isVerified}
              onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-950"
            />
            <label htmlFor="isVerified" className="text-xs text-slate-300 flex items-center gap-1 cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              ভেরিফায়েড প্রোফাইল ব্যাজ হিসেবে চিহ্নিত করুন
            </label>
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end space-x-3 pt-5 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveBtn}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
