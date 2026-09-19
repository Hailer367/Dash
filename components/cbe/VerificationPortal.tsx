'use client';

import React from 'react';
import {
  ShieldCheck,
  BadgeCheck,
} from 'lucide-react';

export function VerificationPortal() {
  return (
    <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs">
      {/* Verification Portal Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-[#b5873e] border border-amber-200/60">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-neutral-800">
                Verification Portal
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                <BadgeCheck className="h-3 w-3" />
                Official CBE Engine
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Verify your account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
