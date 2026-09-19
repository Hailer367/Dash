'use client';

import React from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Translation } from '@/lib/telebirr-translations';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translation;
}

export function TermsModal({ isOpen, onClose, t }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      id="terms-modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]"
        id="terms-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#6aa828]" />
            <h3 className="font-bold text-slate-900 text-lg">{t.termsAndConditions}</h3>
          </div>
          <button
            id="close-terms-modal-button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          <div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">1. Acceptance of Service Terms</h4>
            <p>
              By accessing and logging into the telebirr digital platform and web portal, you agree to abide by the service terms, regulations, and operational directives established by Ethio Telecom and the National Bank of Ethiopia.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">2. Account Security & PIN Confidentiality</h4>
            <p>
              Your telebirr Personal Identification Number (PIN), password, and One-Time Password (OTP) are strictly confidential. You are solely responsible for maintaining the confidentiality of your credentials. Ethio Telecom agents will never ask for your PIN or OTP.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">3. Transaction Limits & Verification</h4>
            <p>
              Transaction volumes and wallet limits are determined according to your Customer Due Diligence (CDD) tier: Level 1 (self-registration), Level 2 (photo/ID uploaded), or Level 3 (biometric & full branch verification).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">4. Electronic Financial Transactions</h4>
            <p>
              All money transfers, airtime purchases, merchant settlements, and bill payments conducted via telebirr are irrevocable once authorized by your security PIN. Always verify recipient phone numbers and merchant codes before confirming.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>
              Report any unauthorized transactions or lost SIM cards immediately to Ethio Telecom Customer Care at <strong>994</strong> or telebirr helpline at <strong>127</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Version 1.3.2 • Ethio Telecom Regulatory Compliance</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#0077c8] hover:bg-sky-700 rounded-lg transition-colors shadow-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
