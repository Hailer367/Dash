'use client';

import React from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Calendar,
  Hash,
  ArrowRight,
} from 'lucide-react';
import { CbeLogo } from './CbeLogo';

interface AuthenticatedDashboardProps {
  onLogout: () => void;
  userEmail?: string;
  phoneNumber?: string;
}

export const AuthenticatedDashboard: React.FC<AuthenticatedDashboardProps> = ({
  onLogout,
  phoneNumber,
}) => {
  const formattedPhone = phoneNumber && phoneNumber.length === 9
    ? `+251 ${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6)}`
    : phoneNumber
      ? `+251 ${phoneNumber}`
      : '+251 912 345 678';

  const verificationDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

  return (
    <div
      id="cbe-verification-complete-container"
      className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="rounded-[36px] border border-neutral-200/90 bg-white p-7 sm:p-10 shadow-xl transition-all">
        {/* CBE Logo and Security Badge */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
          <CbeLogo />
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Identity Verified</span>
          </div>
        </div>

        {/* Central Success Illustration & Header */}
        <div className="mt-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-4 border-emerald-100 text-emerald-600 shadow-sm">
            <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
          </div>

          <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Verification Complete
          </h1>

          <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
            Your mobile number and login credentials have been successfully authenticated with Commercial Bank of Ethiopia.
          </p>
        </div>

        {/* Verification Summary Card */}
        <div className="mt-7 rounded-2xl border border-neutral-200/70 bg-neutral-50/70 p-4 sm:p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
            Verification Details
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
              <div className="flex items-center gap-2 text-neutral-500 font-medium">
                <Smartphone className="h-4 w-4 text-[#b5873e]" />
                <span>Verified Mobile</span>
              </div>
              <span className="font-bold text-neutral-800">{formattedPhone}</span>
            </div>

            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
              <div className="flex items-center gap-2 text-neutral-500 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Authentication Status</span>
              </div>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Confirmed & Active
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
              <div className="flex items-center gap-2 text-neutral-500 font-medium">
                <Hash className="h-4 w-4 text-neutral-400" />
                <span>Reference ID</span>
              </div>
              <span className="font-mono font-semibold text-neutral-700">CBE-VRF-892410</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-500 font-medium">
                <Calendar className="h-4 w-4 text-neutral-400" />
                <span>Timestamp</span>
              </div>
              <span className="font-medium text-neutral-700">{verificationDate}</span>
            </div>
          </div>
        </div>

        {/* Security Highlight */}
        <div className="mt-5 flex justify-center text-xs text-neutral-600">
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50/60 border border-emerald-200/50 px-3.5 py-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium text-emerald-800">Two-Factor OTP Validated</span>
          </div>
        </div>

        {/* Action Button: Finish */}
        <div className="mt-8">
          <button
            id="verification-finish-btn"
            type="button"
            onClick={onLogout}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#b58742] hover:bg-[#a37633] active:bg-[#926829] text-base font-bold text-white shadow-[0_4px_16px_rgba(181,135,66,0.3)] transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Finish</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-neutral-400">
          Commercial Bank of Ethiopia • Always The Bank You Can Rely On!
        </div>
      </div>
    </div>
  );
};
