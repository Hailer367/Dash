'use client';

import React, { useState } from 'react';
import { Delete, Shuffle, Check } from 'lucide-react';

interface VirtualKeypadProps {
  onKeyPress: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit: () => void;
}

export const VirtualKeypad: React.FC<VirtualKeypadProps> = ({
  onKeyPress,
  onBackspace,
  onClear,
  onSubmit,
}) => {
  const [digits, setDigits] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);

  const handleShuffle = () => {
    setDigits((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div
      id="virtual-keypad-container"
      className="mt-3 rounded-2xl border border-neutral-200/80 bg-neutral-50/90 p-3 shadow-inner animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
          Secure Anti-Keylogger Pad
        </span>
        <button
          type="button"
          onClick={handleShuffle}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-[#b5873e] hover:bg-amber-100/50 transition-colors"
          title="Scramble keypad numbers"
        >
          <Shuffle className="h-2.5 w-2.5" /> Scramble
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {digits.slice(0, 9).map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onKeyPress(num)}
            className="flex h-11 items-center justify-center rounded-xl bg-white text-base font-bold text-neutral-800 shadow-xs border border-neutral-200/60 active:bg-amber-50 active:border-[#b5873e] active:scale-95 transition-all"
          >
            {num}
          </button>
        ))}

        {/* Bottom row: Clear, Last digit, Backspace */}
        <button
          type="button"
          onClick={onClear}
          className="flex h-11 items-center justify-center rounded-xl bg-neutral-200/70 text-xs font-bold text-neutral-600 active:scale-95 transition-all"
        >
          C
        </button>

        <button
          type="button"
          onClick={() => onKeyPress(digits[9])}
          className="flex h-11 items-center justify-center rounded-xl bg-white text-base font-bold text-neutral-800 shadow-xs border border-neutral-200/60 active:bg-amber-50 active:border-[#b5873e] active:scale-95 transition-all"
        >
          {digits[9]}
        </button>

        <button
          type="button"
          onClick={onBackspace}
          className="flex h-11 items-center justify-center rounded-xl bg-neutral-200/70 text-neutral-600 active:scale-95 transition-all"
          aria-label="Backspace"
        >
          <Delete className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
