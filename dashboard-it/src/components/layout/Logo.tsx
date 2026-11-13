import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
}

export default function Logo({ className = '', variant = 'auto', showTagline = false }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Official Acuuy CCTV emblem */}
      <Image
        src="/images/acuuy_cctv_mark.png"
        alt="Logo Acuuy CCTV"
        width={256}
        height={185}
        priority
        className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
      />

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-black italic tracking-tight font-sans text-white group-hover:text-teal-400 transition-colors">
            ACUUY
          </span>
          <span className="text-xl font-black italic tracking-tight text-[#2ec4b6]">
            ADMIN
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase -mt-0.5">
            Operations & Control
          </span>
        )}
      </div>
    </Link>
  );
}
