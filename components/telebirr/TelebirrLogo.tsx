'use client';

import React from 'react';
import Image from 'next/image';

interface TelebirrLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function TelebirrLogo({
  className = '',
  size = 'md',
}: TelebirrLogoProps) {
  const heightClass = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-11 sm:h-12',
    xl: 'h-16 sm:h-18',
  }[size];

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      id="telebirr-logo-container"
      title="telebirr"
    >
      <Image
        src="/logos/telebirr-logo.png"
        alt="telebirr"
        width={300}
        height={119}
        priority
        referrerPolicy="no-referrer"
        className={`${heightClass} w-auto max-w-none object-contain block`}
        draggable={false}
      />
    </div>
  );
}



