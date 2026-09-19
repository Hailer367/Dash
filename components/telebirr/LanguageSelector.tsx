'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { Language, translations } from '@/lib/telebirr-translations';

interface LanguageSelectorProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  variant?: 'minimal' | 'bordered';
}

export function LanguageSelector({
  currentLang,
  onSelectLang,
  variant = 'minimal',
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'am', name: 'Amharic', native: 'አማርኛ' },
    { code: 'om', name: 'Afaan Oromoo', native: 'Afaan Oromoo' },
    { code: 'ti', name: 'Tigrinya', native: 'ትግርኛ' },
    { code: 'so', name: 'Somali', native: 'Soomaali' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLang = languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} id="language-selector-wrapper">
      <button
        type="button"
        id="language-dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 focus:outline-none ${
          variant === 'bordered'
            ? 'px-3 py-1.5 rounded-full border border-slate-300 bg-white/80 hover:bg-white text-slate-800 shadow-xs'
            : 'text-slate-900 hover:text-slate-700 py-1 px-2'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{activeLang.native}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-700 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          id="language-dropdown-menu"
          className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-slate-200/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
          role="menu"
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Select Language</span>
          </div>

          <div className="py-1">
            {languages.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  id={`language-option-${lang.code}`}
                  onClick={() => {
                    onSelectLang(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-lime-50 text-slate-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  role="menuitem"
                >
                  <div className="flex flex-col">
                    <span className="font-medium leading-none">{lang.native}</span>
                    <span className="text-xs text-slate-400 leading-tight mt-0.5">{lang.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#84cc16]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
