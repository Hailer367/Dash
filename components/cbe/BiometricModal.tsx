'use client';

import React, { useState, useEffect } from 'react';
import { Fingerprint, CheckCircle2, ShieldCheck, X, Sparkles } from 'lucide-react';
import { TranslationData } from '@/lib/cbe-translations';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  t: TranslationData;
}

const BiometricModalContent: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
  t: TranslationData;
}> = ({ onClose, onSuccess, t }) => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle');

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setScanState('scanning');
      const verifyTimer = setTimeout(() => {
        setScanState('success');
        const finishTimer = setTimeout(() => {
          onSuccess();
        }, 800);
        return () => clearTimeout(finishTimer);
      }, 1600);
      return () => clearTimeout(verifyTimer);
    }, 400);

    return () => clearTimeout(startTimer);
  }, [onSuccess]);

  return (
    <div
      id="biometric-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="biometric-modal-content"
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-neutral-100 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="biometric-modal-close"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Security Badge */}
        <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-[#b5873e] border border-amber-200/60">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>FIDO2 / WebAuthn Biometric Enclave</span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-neutral-800">
          {t.biometricPrompt}
        </h3>
        <p className="mt-1 text-xs text-neutral-500 max-w-xs mx-auto">
          {t.biometricTouchDesc}
        </p>

        {/* Biometric Scanner Visual Container */}
        <div className="relative my-8 flex items-center justify-center">
          {/* Animated Glow Rings */}
          <div
            className={`absolute h-36 w-36 rounded-full transition-all duration-700 ${
              scanState === 'scanning'
                ? 'bg-purple-500/20 scale-110 animate-ping'
                : scanState === 'success'
                ? 'bg-emerald-500/20 scale-105'
                : 'bg-purple-100 scale-95'
            }`}
          />

          <div
            className={`relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-500 shadow-xl ${
              scanState === 'success'
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/30'
                : 'bg-gradient-to-tr from-[#7a229a] via-[#9333ea] to-[#b040e6] shadow-purple-600/35'
            }`}
          >
            {/* Laser scanning bar animation */}
            {scanState === 'scanning' && (
              <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                <div className="h-1.5 w-full bg-cyan-300 shadow-[0_0_12px_#67e8f9] animate-bounce" />
              </div>
            )}

            {scanState === 'success' ? (
              <CheckCircle2 className="h-14 w-14 text-white animate-in zoom-in-50 duration-300" />
            ) : (
              <Fingerprint className={`h-14 w-14 text-white ${scanState === 'scanning' ? 'animate-pulse' : ''}`} />
            )}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-semibold text-neutral-800 flex items-center justify-center gap-1.5">
            {scanState === 'scanning' && (
              <>
                <span className="inline-block h-2 w-2 rounded-full bg-purple-600 animate-ping" />
                {t.verifying}
              </>
            )}
            {scanState === 'success' && (
              <>
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">{t.verified}</span>
              </>
            )}
            {scanState === 'idle' && t.scanFingerprint}
          </p>
          <span className="text-[11px] text-neutral-400">
            Commercial Bank of Ethiopia Secure Mobile Enclave
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            id="biometric-cancel-button"
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-neutral-200 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  t,
}) => {
  if (!isOpen) return null;

  return (
    <BiometricModalContent
      onClose={onClose}
      onSuccess={onSuccess}
      t={t}
    />
  );
};
