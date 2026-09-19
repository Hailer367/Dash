'use client';

import React, { useState } from 'react';
import { X, PhoneCall, Hash, HelpCircle, ChevronRight, Check, ShieldCheck, MapPin } from 'lucide-react';
import { Translation } from '@/lib/telebirr-translations';

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translation;
}

export function HelpDrawer({ isOpen, onClose, t }: HelpDrawerProps) {
  const [copiedUssd, setCopiedUssd] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedUssd(code);
    setTimeout(() => setCopiedUssd(null), 2000);
  };

  const ussdCodes = [
    { code: '*127#', name: 'telebirr Direct USSD', desc: 'Transfer, Pay, Airtime without data' },
    { code: '*806#', name: 'Ethio Telecom Self-Care', desc: 'Balance, services and subscriptions' },
    { code: '*999#', name: 'Data & Voice Packages', desc: 'Buy daily, weekly & monthly bundles' },
    { code: '*804#', name: 'Check Airtime Balance', desc: 'Quick telecom balance inquiry' },
  ];

  const faqs = [
    {
      q: 'How do I reset my forgotten telebirr PIN?',
      a: 'You can reset your telebirr PIN by dialing *127#, choosing Account Settings > Reset PIN, or by visiting any Ethio Telecom service center with a valid Kebele/National ID.',
    },
    {
      q: 'What is the daily transaction limit on telebirr?',
      a: 'Level 1 (Standard self-registered): up to 10,000 ETB daily. Level 2 & 3 (Verified with ID at service center): up to 75,000 ETB per transaction and 300,000 ETB daily.',
    },
    {
      q: 'Can I use telebirr without an active internet connection?',
      a: 'Yes! Simply dial *127# from your Ethio Telecom SIM card to access all core telebirr features via USSD offline.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      id="help-modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        id="help-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-lime-100 text-[#6aa828] flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{t.help} & Support</h3>
              <p className="text-xs text-slate-500">Ethio Telecom & telebirr Customer Care</p>
            </div>
          </div>
          <button
            id="close-help-modal-button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Helplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {t.customerCare}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {/* telebirr 127 */}
              <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/60 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-medium text-sky-700">{t.telebirrCare}</span>
                  <div className="text-2xl font-black text-[#0077c8] mt-1">127</div>
                  <p className="text-[11px] text-slate-600 mt-1">Free 24/7 telebirr helpline</p>
                </div>
                <a
                  href="tel:127"
                  className="mt-3 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#0077c8] text-white text-xs font-semibold rounded-lg hover:bg-sky-700 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 127</span>
                </a>
              </div>

              {/* Ethio Telecom 994 */}
              <div className="p-4 rounded-xl border border-lime-100 bg-lime-50/60 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-medium text-lime-800">{t.ethioTelecomCare}</span>
                  <div className="text-2xl font-black text-[#6aa828] mt-1">994</div>
                  <p className="text-[11px] text-slate-600 mt-1">Free Ethio Telecom support</p>
                </div>
                <a
                  href="tel:994"
                  className="mt-3 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#6aa828] text-white text-xs font-semibold rounded-lg hover:bg-[#588d22] transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 994</span>
                </a>
              </div>
            </div>
          </div>

          {/* USSD Codes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {t.ussdServices}
            </h4>
            <div className="space-y-2">
              {ussdCodes.map((item) => (
                <div
                  key={item.code}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-xs">
                      <Hash className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(item.code)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold text-[#0077c8] bg-sky-50 rounded-md hover:bg-sky-100 transition-colors"
                    title="Copy code"
                  >
                    {copiedUssd === item.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600">Copied</span>
                      </>
                    ) : (
                      <span>{item.code}</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick FAQ */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {t.faq}
            </h4>
            <div className="space-y-2.5">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-150">
                  <div className="text-xs font-semibold text-slate-900">{faq.q}</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Security reminder:</strong> Ethio Telecom and telebirr will never ask for your OTP or PIN over phone or SMS. Never share your security credentials with anyone.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
