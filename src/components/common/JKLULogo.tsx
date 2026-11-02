import React, { useState } from 'react';

interface JKLULogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const JKLULogo: React.FC<JKLULogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeDimensions = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`${sizeDimensions} rounded-xl bg-white border border-slate-200/90 shadow-2xs p-0.5 flex items-center justify-center shrink-0 overflow-hidden group-hover:border-blue-400 transition-colors`}
      >
        {!imageError ? (
          <img
            src="/jklu_logo.svg"
            alt="JK Lakshmipat University Logo"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full object-contain"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="fallbackFlame" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fde047" />
              </linearGradient>
              <linearGradient id="fallbackLotus" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <path id="fallbackArc" d="M 52,248 A 198,198 0 0,1 448,248" fill="none" />
            </defs>
            <rect width="500" height="500" fill="#ffffff" />
            <text fill="#0f172a" fontFamily="'Times New Roman', serif" fontSize="25" fontWeight="bold" letterSpacing="4.2">
              <textPath href="#fallbackArc" startOffset="50%" textAnchor="middle">
                JK LAKSHMIPAT UNIVERSITY
              </textPath>
            </text>
            <path
              d="M 250,112 C 256,138 266,162 278,182 C 292,204 296,222 289,240 C 282,256 268,266 250,266 C 232,266 218,256 211,240 C 204,222 208,204 222,182 C 234,162 244,138 250,112 Z"
              fill="url(#fallbackFlame)"
            />
            <path
              d="M 118,256 C 146,248 178,252 206,266 C 180,277 150,283 128,278 C 112,274 110,261 118,256 Z"
              fill="url(#fallbackLotus)"
            />
            <path
              d="M 382,256 C 354,248 322,252 294,266 C 320,277 350,283 372,278 C 388,274 390,261 382,256 Z"
              fill="url(#fallbackLotus)"
            />
            <path
              d="M 154,208 C 176,225 202,243 234,250 C 202,253 170,248 142,233 C 136,224 142,214 154,208 Z"
              fill="#0ea5e9"
            />
            <path
              d="M 346,208 C 324,225 298,243 266,250 C 298,253 330,248 358,233 C 364,224 358,214 346,208 Z"
              fill="#0ea5e9"
            />
            <text x="250" y="344" fill="#0f172a" fontFamily="'Noto Serif Devanagari', 'FreeSerif', serif" fontSize="28" fontWeight="bold" textAnchor="middle">
              ज्ञानम् अमृतम्
            </text>
            <text x="250" y="448" fill="#0f172a" fontFamily="'Times New Roman', serif" fontSize="96" fontWeight="bold" letterSpacing="4" textAnchor="middle">
              JKLU
            </text>
          </svg>
        )}
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
              JKLU
            </span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 uppercase tracking-wider">
              Accessibility
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            JK Lakshmipat University
          </p>
        </div>
      )}
    </div>
  );
};
