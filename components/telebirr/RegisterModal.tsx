'use client';

import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Translation } from '@/lib/telebirr-translations';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translation;
  onSuccessRegister: (phoneNumber: string) => void;
}

export function RegisterModal({
  isOpen,
  onClose,
  t,
  onSuccessRegister,
}: RegisterModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [idType, setIdType] = useState('national_id');
  const [idNumber, setIdNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length !== 9) {
      setError('Please enter a valid 9-digit Ethiopian mobile number (e.g. 911026439)');
      return;
    }
    if (!fullName.trim()) {
      setError('Please enter your full legal name');
      return;
    }
    if (pin.length !== 4) {
      setError('Please create a 4-digit security PIN');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match. Please re-enter your PIN.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      onSuccessRegister(cleanNumber);
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      id="register-modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col"
        id="register-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-lime-50/50 to-sky-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#6aa828] text-white flex items-center justify-center shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{t.createNewAccount}</h3>
              <p className="text-xs text-slate-500">Register for telebirr digital mobile money</p>
            </div>
          </div>
          <button
            id="close-register-modal-button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Account Created Successfully!</h4>
            <p className="text-sm text-slate-600">
              Welcome to telebirr! We are redirecting you to log in with your new account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.mobileNumber}
              </label>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#0077c8] focus-within:border-transparent bg-white">
                <div className="px-3.5 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-800 font-semibold text-sm flex items-center gap-1.5">
                  <span className="text-base">🇪🇹</span>
                  <span>+251</span>
                </div>
                <input
                  type="tel"
                  maxLength={9}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="911026439"
                  className="flex-1 px-3.5 py-2.5 text-slate-900 font-medium text-sm focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Abebe Bikila"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-[#0077c8] focus:border-transparent focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  ID Type
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-[#0077c8] focus:border-transparent focus:outline-none bg-white"
                >
                  <option value="national_id">Fayda / National ID</option>
                  <option value="kebele_id">Kebele Resident ID</option>
                  <option value="passport">Ethiopian Passport</option>
                  <option value="driver_license">Driver License</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  ID Number
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="ID / FIN Number"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-[#0077c8] focus:border-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Create 4-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-center text-slate-900 font-mono text-base tracking-widest focus:ring-2 focus:ring-[#0077c8] focus:border-transparent focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-center text-slate-900 font-mono text-base tracking-widest focus:ring-2 focus:ring-[#0077c8] focus:border-transparent focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6aa828] flex-shrink-0" />
              <span>Registered under National Bank of Ethiopia mobile money regulations.</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#6aa828] hover:bg-[#588d22] rounded-xl shadow-xs transition-colors"
              >
                <span>Register Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
