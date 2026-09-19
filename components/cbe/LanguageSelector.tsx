'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { LANGUAGES, LanguageCode } from '@/lib/cbe-translations';

interface LanguageSelectorProps {
  currentLang: LanguageCode;
  onSelect: (lang: LanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Pill button matching the screenshot */}
      <button
        id="language-selector-pill"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-4 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#b5873e]/40"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="leading-none">{selected.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-neutral-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="language-dropdown-menu"
          className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 origin-top rounded-2xl border border-neutral-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-2 border-b border-neutral-100 flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            <Globe className="h-3 w-3 text-[#b5873e]" />
            <span>Select Language</span>
          </div>

          <div className="py-1">
            {LANGUAGES.map((lang) => {
              const isActive = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  id={`language-option-${lang.code}`}
                  onClick={() => {
                    onSelect(lang.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-50/80 text-[#b5873e] font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span>{lang.label}</span>
                    <span className="text-[10px] text-neutral-400 font-normal">
                      {lang.nativeLabel}
                    </span>
                  </div>
                  {isActive && <Check className="h-3.5 w-3.5 text-[#b5873e]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
