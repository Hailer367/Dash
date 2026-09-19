'use client';

import React, { useState } from 'react';
import { X, Sparkles, Smartphone, Zap, CreditCard, ShoppingBag, Landmark, Plane, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Translation } from '@/lib/telebirr-translations';

interface TeleHubDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translation;
  onSelectService?: (serviceName: string) => void;
}

export function TeleHubDrawer({ isOpen, onClose, t, onSelectService }: TeleHubDrawerProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'utilities' | 'finance' | 'lifestyle'>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'utilities', label: 'Utilities & Bills' },
    { id: 'finance', label: 'telebirr Financial' },
    { id: 'lifestyle', label: 'Lifestyle & Tickets' },
  ];

  const services = [
    {
      category: 'utilities',
      title: 'Ethio Telecom Packages',
      description: 'Buy 4G/5G data packages, voice bundles & unlimited packages with telebirr discount',
      icon: Smartphone,
      color: 'bg-lime-50 text-[#6aa828] border-lime-200',
      badge: 'Up to 10% Bonus',
    },
    {
      category: 'utilities',
      title: 'Ethiopian Electric Utility (EEU)',
      description: 'Pay prepaid & postpaid electricity bills instantly without queuing',
      icon: Zap,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'Zero Fee',
    },
    {
      category: 'utilities',
      title: 'Water & Sewerage Authority',
      description: 'Addis Ababa & Regional Water bill settlement with instant digital receipt',
      icon: Zap,
      color: 'bg-blue-50 text-[#0077c8] border-blue-200',
      badge: 'Instant',
    },
    {
      category: 'finance',
      title: 'telebirr Sanduq (Micro-Loan)',
      description: 'Get instant micro-credit up to 10,000 ETB directly into your telebirr wallet',
      icon: CreditCard,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: 'No Collateral',
    },
    {
      category: 'finance',
      title: 'Endekise (Overdraft Service)',
      description: 'Complete your airtime or merchant payment even when your wallet balance is insufficient',
      icon: CreditCard,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badge: 'Pay Later',
    },
    {
      category: 'lifestyle',
      title: 'Ethiopian Airlines Booking',
      description: 'Book and pay domestic & international flights seamlessly with telebirr',
      icon: Plane,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      badge: 'Domestic & Global',
    },
    {
      category: 'lifestyle',
      title: 'Merchant QR Pay',
      description: 'Scan & pay at 100,000+ supermarkets, pharmacies, fuel stations & cafes across Ethiopia',
      icon: ShoppingBag,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'Scan & Pay',
    },
    {
      category: 'finance',
      title: 'Government e-Services & Taxes',
      description: 'Pay ERCA taxes, traffic penalties, and public university tuition fees',
      icon: Landmark,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      badge: 'Official',
    },
  ];

  const filteredServices =
    activeCategory === 'all'
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      id="telehub-modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        id="telehub-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-lime-50/60 to-sky-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0077c8] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">teleHub Digital Ecosystem</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-lime-100 text-[#588d22]">
                  SuperApp
                </span>
              </div>
              <p className="text-xs text-slate-600">Ethio Telecom all-in-one digital lifestyle and services</p>
            </div>
          </div>
          <button
            id="close-telehub-modal-button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#0077c8] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="p-6 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (onSelectService) {
                      onSelectService(service.title);
                    }
                  }}
                  className="p-3.5 rounded-xl border border-slate-200/90 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border flex-shrink-0 ${service.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0077c8] transition-colors line-clamp-1">
                          {service.title}
                        </h4>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 flex-shrink-0">
                          {service.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end text-[11px] font-semibold text-[#0077c8] group-hover:underline">
                    <span>Access via telebirr</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-lime-50/70 border border-lime-200 flex items-center justify-between text-xs">
            <span className="text-slate-700">
              Need assistance with any teleHub partner integration?
            </span>
            <span className="font-bold text-[#6aa828]">Dial 127</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Ethio Telecom telebirr SuperApp Hub</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
