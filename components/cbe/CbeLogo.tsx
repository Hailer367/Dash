'use client';

import React from 'react';
import Image from 'next/image';

interface CbeLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
}

export const CbeLogo: React.FC<CbeLogoProps> = ({
  className = '',
  size = 'md',
  showText,
  showSubtitle = true,
}) => {
  // Determine if text should be displayed (hidden on small avatar sizes by default)
  const shouldShowText = showText !== undefined ? showText : (size !== 'xs' && size !== 'sm');

  // Dimension scaling for the official CBE logo
  const dimensions = {
    xs: { w: 28, h: 28 },
    sm: { w: 40, h: 40 },
    md: { w: 154, h: 154 },
    lg: { w: 190, h: 190 },
    xl: { w: 240, h: 240 },
  }[size];

  return (
    <div
      id={`cbe-brand-logo-${size}`}
      className={`flex flex-col items-center justify-center text-center select-none ${className}`}
    >
      {/* Official 3D Golden CBE Emblem Image */}
      <div className="relative flex items-center justify-center transition-transform duration-300 hover:scale-105">
        <Image
          src="/cbe-logo.png"
          alt="Commercial Bank of Ethiopia Official Logo"
          width={dimensions.w}
          height={dimensions.h}
          priority
          referrerPolicy="no-referrer"
          className="object-contain drop-shadow-[0_4px_16px_rgba(181,135,62,0.22)]"
        />
      </div>

      {/* Typography: Amharic Name & English Name */}
      {shouldShowText && (
        <div className="mt-2.5 flex flex-col items-center">
          <h1
            id="cbe-amharic-title"
            className="font-ethiopic text-2xl font-bold tracking-tight text-[#b5873e] antialiased drop-shadow-sm md:text-3xl"
          >
            የኢትዮጵያ ንግድ ባንክ
          </h1>
          {showSubtitle && (
            <h2
              id="cbe-english-title"
              className="mt-1 text-xs font-bold tracking-[0.14em] text-neutral-600 uppercase antialiased sm:text-[13px]"
            >
              COMMERCIAL BANK OF ETHIOPIA
            </h2>
          )}

          {/* Delicate Gold Taper Divider */}
          <div className="mt-3 flex w-36 items-center justify-center">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c69a4d]/50 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
};

