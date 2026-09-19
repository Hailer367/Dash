'use client';

import React from 'react';
import Image from 'next/image';

interface EthioTelecomLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function EthioTelecomLogo({
  className = '',
  size = 'md',
}: EthioTelecomLogoProps) {
  const heightClass = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-11 sm:h-12',
    xl: 'h-16 sm:h-18',
  }[size];

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      id="ethio-telecom-logo-container"
      title="Ethio Telecom"
    >
      <Image
        src="/logos/ethio-telecom-logo.png"
        alt="Ethio Telecom"
        width={400}
        height={110}
        priority
        referrerPolicy="no-referrer"
        className={`${heightClass} w-auto max-w-none object-contain block`}
        draggable={false}
      />
    </div>
  );
}



