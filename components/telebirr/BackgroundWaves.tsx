'use client';

import React from 'react';

interface BackgroundWavesProps {
  className?: string;
}

export function BackgroundWaves({ className = '' }: BackgroundWavesProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Top Left Organic Contour Waves */}
      <svg
        className="absolute top-0 left-0 w-[550px] h-[750px] max-w-none text-[#84cc16]/15"
        viewBox="0 0 600 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="currentColor" strokeWidth="1.2">
          <path d="M -50 0 C 120 180, 80 420, 320 620 C 440 720, 520 780, 600 850" />
          <path d="M -70 20 C 100 200, 60 440, 300 640 C 420 740, 500 800, 580 870" />
          <path d="M -90 40 C 80 220, 40 460, 280 660 C 400 760, 480 820, 560 890" />
          <path d="M -110 60 C 60 240, 20 480, 260 680 C 380 780, 460 840, 540 910" />
          <path d="M -130 80 C 40 260, 0 500, 240 700 C 360 800, 440 860, 520 930" />
          <path d="M -150 100 C 20 280, -20 520, 220 720 C 340 820, 420 880, 500 950" />
          <path d="M -170 120 C 0 300, -40 540, 200 740 C 320 840, 400 900, 480 970" />
          <path d="M -190 140 C -20 320, -60 560, 180 760 C 300 860, 380 920, 460 990" />
          <path d="M -210 160 C -40 340, -80 580, 160 780 C 280 880, 360 940, 440 1010" />
          <path d="M -230 180 C -60 360, -100 600, 140 800 C 260 900, 340 960, 420 1030" />
          <path d="M -250 200 C -80 380, -120 620, 120 820 C 240 920, 320 980, 400 1050" />
          <path d="M -270 220 C -100 400, -140 640, 100 840 C 220 940, 300 1000, 380 1070" />
        </g>
      </svg>

      {/* Subtle Cyan Accent Contour Wave */}
      <svg
        className="absolute top-10 -left-10 w-[480px] h-[650px] max-w-none text-[#00a3e0]/12"
        viewBox="0 0 500 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="currentColor" strokeWidth="1">
          <path d="M -40 50 C 140 240, 90 460, 330 660" />
          <path d="M -60 70 C 120 260, 70 480, 310 680" />
          <path d="M -80 90 C 100 280, 50 500, 290 700" />
          <path d="M -100 110 C 80 300, 30 520, 270 720" />
        </g>
      </svg>

      {/* Bottom Right Concentric Wave Contour (Visible in original screenshot) */}
      <svg
        className="absolute -bottom-20 -right-20 w-[520px] h-[520px] max-w-none text-[#84cc16]/18"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="currentColor" strokeWidth="1.2">
          <circle cx="450" cy="450" r="100" />
          <circle cx="450" cy="450" r="130" />
          <circle cx="450" cy="450" r="160" />
          <circle cx="450" cy="450" r="190" />
          <circle cx="450" cy="450" r="220" />
          <circle cx="450" cy="450" r="250" />
          <circle cx="450" cy="450" r="280" />
          <circle cx="450" cy="450" r="310" />
          <circle cx="450" cy="450" r="340" />
          <circle cx="450" cy="450" r="370" />
          <circle cx="450" cy="450" r="400" />
        </g>
      </svg>

      {/* Soft atmospheric gradient glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-lime-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-sky-100/25 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
