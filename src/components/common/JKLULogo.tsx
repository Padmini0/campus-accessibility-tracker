
import React from 'react';

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
        className={`${sizeDimensions} rounded-xl bg-white border border-slate-200/90 shadow-2xs p-0.5 flex items-center justify-center shrink-0 overflow-hidden`}
      >
        <img
          src="/jklu_logo.jpg"
          alt="JK Lakshmipat University Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
              JKLU SAATHI
            </span>

            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
              Accessibility
            </span>
          </div>

          <p className="text-[10px] text-slate-500 font-medium">
            Campus Accessibility Platform
          </p>
        </div>
      )}
    </div>
  );
};
