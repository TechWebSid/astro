import React from 'react';

interface BrandLogoProps {
  compact?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-2.5 shrink-0 select-none">
      {/* Custom Divyadarshi Sacred Mandala + Divine Eye Emblem */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-violet-200/90 border border-violet-300/80 flex items-center justify-center shadow-2xs shrink-0">
        <svg
          viewBox="0 0 40 40"
          className="w-7 h-7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Outer celestial ring */}
          <circle cx="20" cy="20" r="16.5" stroke="#6D28D9" strokeWidth="1.2" strokeDasharray="2 2" />
          {/* 8-point Vedic Nakshatra star */}
          <path
            d="M20 5L22.6 14.4L32 17L22.6 19.6L20 29L17.4 19.6L8 17L17.4 14.4L20 5Z"
            fill="#6D28D9"
            fillOpacity="0.16"
            stroke="#5B21B6"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          {/* Divya-Drishti (Divine Eye) */}
          <path
            d="M11.5 20C13.8 16.5 16.7 15 20 15C23.3 15 26.2 16.5 28.5 20C26.2 23.5 23.3 25 20 25C16.7 25 13.8 23.5 11.5 20Z"
            fill="#FFFFFF"
            stroke="#5B21B6"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Iris & Bindu */}
          <circle cx="20" cy="20" r="3" fill="#6D28D9" />
          <circle cx="21" cy="19" r="0.9" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col leading-none">
        <span className={`${compact ? 'text-sm' : 'text-[15px] sm:text-base'} font-extrabold tracking-tight text-gray-900`}>
          Astro Aashutosh
        </span>
        <span className="text-[10px] font-bold tracking-[0.18em] text-violet-700 uppercase mt-0.5">
          Divyadarshi
        </span>
      </div>
    </div>
  );
};
