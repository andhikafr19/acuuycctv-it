import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
}

export default function Logo({ className = '', variant = 'auto', showTagline = false }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-teal-600 to-slate-900 shadow-md shadow-teal-900/20 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
          <path
            d="M20 7L29 15H23.5L20 11.5L16.5 15H11L20 7Z"
            fill="#2dd4bf"
            className="transition-colors group-hover:fill-teal-300"
          />
          <path
            d="M20 14.5L29 22.5H23.5L20 19L16.5 22.5H11L20 14.5Z"
            fill="#0f766e"
          />
          <circle cx="20" cy="28" r="4.5" fill="#f8fafc" stroke="#0d9488" strokeWidth="2" />
          <circle cx="20" cy="28" r="2" fill="#0f172a" />
          <circle cx="21" cy="27" r="0.8" fill="#5eead4" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-extrabold tracking-tight font-sans text-slate-900 group-hover:text-teal-700 transition-colors">
            ACUUY
          </span>
          <span className="text-xl font-black tracking-tight text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60">
            ADMIN
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-medium tracking-wider text-slate-500 uppercase -mt-0.5">
            Operations & Control
          </span>
        )}
      </div>
    </Link>
  );
}
