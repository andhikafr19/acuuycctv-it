import React from 'react';

interface CertificateIllustrationProps {
  brand: 'AVTECH' | 'DAHUA' | 'EZVIZ' | 'HIKVISION' | 'HILOOK' | 'IMOU';
  className?: string;
}

export default function CertificateIllustration({
  brand,
  className = 'w-full h-full',
}: CertificateIllustrationProps) {
  switch (brand) {
    case 'AVTECH':
      return (
        <svg
          viewBox="0 0 600 840"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Background */}
          <rect width="600" height="840" fill="#FCFAF5" />

          {/* Ornate Outer Border */}
          <rect
            x="24"
            y="24"
            width="552"
            height="792"
            stroke="#9C8665"
            strokeWidth="6"
          />
          <rect
            x="34"
            y="34"
            width="532"
            height="772"
            stroke="#C7B293"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <rect
            x="42"
            y="42"
            width="516"
            height="756"
            stroke="#9C8665"
            strokeWidth="1.5"
          />

          {/* Corner Ornaments */}
          <path d="M24 70 L70 24 M530 24 L576 70 M24 770 L70 816 M530 816 L576 770" stroke="#9C8665" strokeWidth="3" />
          <circle cx="48" cy="48" r="8" fill="#9C8665" />
          <circle cx="552" cy="48" r="8" fill="#9C8665" />
          <circle cx="48" cy="792" r="8" fill="#9C8665" />
          <circle cx="552" cy="792" r="8" fill="#9C8665" />

          {/* Watermark Logo in Center */}
          <g opacity="0.09">
            <text
              x="300"
              y="435"
              textAnchor="middle"
              fill="#1E3A8A"
              fontFamily="Arial Black, sans-serif"
              fontWeight="900"
              fontSize="92"
              letterSpacing="6"
            >
              AVTECH
            </text>
            <rect x="90" y="360" width="420" height="100" stroke="#1E3A8A" strokeWidth="4" />
          </g>

          {/* Header Title */}
          <text
            x="300"
            y="145"
            textAnchor="middle"
            fill="#1E293B"
            fontFamily="Georgia, serif"
            fontWeight="bold"
            fontSize="36"
            letterSpacing="1"
          >
            Certificate of Distributor
          </text>

          {/* 5 Gold Stars */}
          <g transform="translate(215, 175)" fill="#EAB308">
            {[0, 38, 76, 114, 152].map((offset, idx) => (
              <polygon
                key={idx}
                transform={`translate(${offset}, 0)`}
                points="12,0 15.5,7.5 24,8.5 17.5,14 19.5,22.5 12,18 4.5,22.5 6.5,14 0,8.5 8.5,7.5"
              />
            ))}
          </g>

          <text
            x="300"
            y="245"
            textAnchor="middle"
            fill="#475569"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fontSize="16"
          >
            This is to Certify that
          </text>

          {/* Recipient */}
          <text
            x="300"
            y="295"
            textAnchor="middle"
            fill="#0F172A"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="24"
            letterSpacing="1.5"
          >
            ACUUY CCTV &amp; IT SOLUTION GARUT
          </text>
          <line x1="120" y1="310" x2="480" y2="310" stroke="#CBD5E1" strokeWidth="1.5" />

          <text
            x="300"
            y="340"
            textAnchor="middle"
            fill="#64748B"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="12"
            letterSpacing="1"
          >
            JL. DAYEUHANDAP NO. 35, GARUT KOTA - WEST JAVA, INDONESIA
          </text>

          {/* Big Brand Banner */}
          <text
            x="300"
            y="415"
            textAnchor="middle"
            fill="#2563EB"
            opacity="0.22"
            fontFamily="Arial Black, sans-serif"
            fontWeight="900"
            fontSize="74"
            letterSpacing="8"
          >
            AVTECH
          </text>

          {/* Validity */}
          <text
            x="200"
            y="465"
            textAnchor="middle"
            fill="#334155"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="13"
          >
            January 1st, 2025
          </text>
          <text
            x="400"
            y="465"
            textAnchor="middle"
            fill="#334155"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="13"
          >
            December 31st, 2026
          </text>
          <line x1="130" y1="473" x2="270" y2="473" stroke="#94A3B8" strokeWidth="1" />
          <line x1="330" y1="473" x2="470" y2="473" stroke="#94A3B8" strokeWidth="1" />
          <text x="200" y="488" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="Arial">
            (Valid From Date)
          </text>
          <text x="400" y="488" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="Arial">
            (Valid Until Date)
          </text>

          <text
            x="300"
            y="535"
            textAnchor="middle"
            fill="#475569"
            fontFamily="Georgia, serif"
            fontSize="14"
          >
            is appointed as
          </text>

          <text
            x="300"
            y="565"
            textAnchor="middle"
            fill="#0F172A"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="15"
            letterSpacing="0.5"
          >
            AVTECH Authorized MASTER DEALER PARTNER DISTRIBUTION
          </text>
          <text
            x="300"
            y="588"
            textAnchor="middle"
            fill="#334155"
            fontFamily="Arial, sans-serif"
            fontSize="13"
          >
            for the sales and installation of all
          </text>
          <text
            x="300"
            y="608"
            textAnchor="middle"
            fill="#0F172A"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="13"
          >
            AVTECH Corporation products in Indonesia
          </text>

          {/* Signature & Seal */}
          <g transform="translate(95, 665)">
            <path
              d="M10 35 C25 10, 40 45, 55 20 C70 -5, 80 40, 105 15 C115 5, 130 30, 150 22"
              stroke="#1E293B"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <line x1="0" y1="48" x2="170" y2="48" stroke="#64748B" strokeWidth="1.5" />
            <text x="85" y="66" textAnchor="middle" fill="#0F172A" fontWeight="bold" fontSize="13" fontFamily="Arial">
              Andy Lee
            </text>
            <text x="85" y="82" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="Arial">
              Marketing Director
            </text>
            <text x="85" y="96" textAnchor="middle" fill="#1E3A8A" fontWeight="bold" fontSize="11" fontFamily="Arial">
              AVTECH CORPORATION
            </text>
          </g>

          {/* Gold Foil Seal */}
          <g transform="translate(430, 660)">
            <circle cx="45" cy="45" r="38" fill="#D97706" opacity="0.15" />
            <circle cx="45" cy="45" r="32" stroke="#B45309" strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="45" cy="45" r="26" stroke="#B45309" strokeWidth="1" />
            <text x="45" y="42" textAnchor="middle" fill="#92400E" fontWeight="bold" fontSize="9" fontFamily="Arial">
              OFFICIAL
            </text>
            <text x="45" y="53" textAnchor="middle" fill="#92400E" fontWeight="bold" fontSize="8" fontFamily="Arial">
              PARTNER
            </text>
          </g>
        </svg>
      );

    case 'DAHUA':
      return (
        <svg
          viewBox="0 0 600 840"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Outer Navy Frame */}
          <rect width="600" height="840" fill="#1E3A8A" />
          <path d="M0 0 L600 0 L600 180 L0 320 Z" fill="#172554" />
          <path d="M0 840 L600 840 L600 620 L0 740 Z" fill="#172554" />

          {/* Inner White Card with Gold Frame */}
          <rect
            x="36"
            y="36"
            width="528"
            height="768"
            rx="6"
            fill="#FFFFFF"
            stroke="#D97706"
            strokeWidth="6"
          />
          <rect
            x="46"
            y="46"
            width="508"
            height="748"
            rx="4"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />

          {/* Dahua Logo */}
          <g transform="translate(215, 95)">
            <text
              x="85"
              y="38"
              textAnchor="middle"
              fill="#DC2626"
              fontFamily="Arial Black, sans-serif"
              fontWeight="900"
              fontSize="40"
              letterSpacing="1"
            >
              a<tspan fill="#0F172A">lhua</tspan>
            </text>
            <path d="M22 24 A14 14 0 1 1 22 25" stroke="#DC2626" strokeWidth="4" />
            <text
              x="85"
              y="54"
              textAnchor="middle"
              fill="#475569"
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
              fontSize="9"
              letterSpacing="4"
            >
              TECHNOLOGY
            </text>
          </g>

          <text
            x="300"
            y="200"
            textAnchor="middle"
            fill="#475569"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="14"
            letterSpacing="5"
          >
            AUTHORIZED
          </text>
          <text
            x="300"
            y="232"
            textAnchor="middle"
            fill="#0F172A"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="26"
            letterSpacing="3"
          >
            PLATINUM
          </text>
          <text
            x="300"
            y="260"
            textAnchor="middle"
            fill="#1E293B"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="20"
            letterSpacing="2"
          >
            DIRECT PARTNER
          </text>

          {/* Golden V Ribbon */}
          <path
            d="M39 280 L300 365 L561 280 L561 325 L300 410 L39 325 Z"
            fill="url(#goldGrad)"
          />
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="280" x2="600" y2="410" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#92400E" />
              <stop offset="30%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FEF08A" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
          </defs>

          {/* Center Medallion */}
          <g transform="translate(250, 325)">
            <polygon points="35,75 20,120 42,108 55,125 65,75" fill="#1E3A8A" />
            <polygon points="65,75 80,120 58,108 45,125 35,75" fill="#172554" />
            <circle cx="50" cy="50" r="44" fill="#F59E0B" stroke="#FEF08A" strokeWidth="3" />
            <circle cx="50" cy="50" r="35" fill="#1E293B" stroke="#D97706" strokeWidth="2" />
            <text x="50" y="46" textAnchor="middle" fill="#FDE047" fontWeight="bold" fontSize="9" fontFamily="Arial">
              PLATINUM
            </text>
            <text x="50" y="59" textAnchor="middle" fill="#FFFFFF" fontWeight="bold" fontSize="8" fontFamily="Arial">
              PARTNER
            </text>
          </g>

          <text
            x="300"
            y="490"
            textAnchor="middle"
            fill="#64748B"
            fontFamily="Arial, sans-serif"
            fontSize="12"
            letterSpacing="2"
          >
            AWARDED TO
          </text>

          <text
            x="300"
            y="530"
            textAnchor="middle"
            fill="#0F172A"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="22"
            letterSpacing="1"
          >
            ACUUY CCTV &amp; IT SOLUTION GARUT
          </text>
          <line x1="120" y1="545" x2="480" y2="545" stroke="#E2E8F0" strokeWidth="2" />

          <text
            x="300"
            y="578"
            textAnchor="middle"
            fill="#475569"
            fontFamily="Arial, sans-serif"
            fontSize="13"
          >
            We are honored to have you as a Platinum Direct Partner of
          </text>
          <text
            x="300"
            y="598"
            textAnchor="middle"
            fill="#0F172A"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="14"
          >
            Dahua Technology in Indonesia
          </text>

          {/* Blue Wax Seal */}
          <g transform="translate(272, 625)">
            <circle cx="28" cy="28" r="26" fill="#1E40AF" />
            <circle cx="28" cy="28" r="20" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x="28" y="32" textAnchor="middle" fill="#DBEAFE" fontSize="8" fontWeight="bold" fontFamily="Arial">
              DAHUA
            </text>
          </g>

          {/* Signature */}
          <path
            d="M250 715 C270 695, 290 725, 315 700 C330 690, 340 715, 355 705"
            stroke="#0F172A"
            strokeWidth="2"
            fill="none"
          />
          <line x1="210" y1="725" x2="390" y2="725" stroke="#94A3B8" strokeWidth="1" />
          <text x="300" y="742" textAnchor="middle" fill="#0F172A" fontWeight="bold" fontSize="12" fontFamily="Arial">
            Sujianelsyah
          </text>
          <text x="300" y="758" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="Arial">
            Country Director - PT. Dahua Vision Technology Indonesia
          </text>
        </svg>
      );

    case 'EZVIZ':
      return (
        <svg
          viewBox="0 0 600 840"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Soft Sky Frame */}
          <rect width="600" height="840" fill="#60A5FA" />
          <path d="M0 0 L600 0 L600 260 L0 120 Z" fill="#3B82F6" />
          <path d="M0 840 L600 840 L600 660 L0 780 Z" fill="#2563EB" />

          {/* White Inner Sheet */}
          <rect
            x="40"
            y="40"
            width="520"
            height="760"
            rx="12"
            fill="#FFFFFF"
            stroke="#BFDBFE"
            strokeWidth="4"
          />

          {/* Decorative Corner Waves inside sheet */}
          <circle cx="520" cy="740" r="90" fill="#EFF6FF" />
          <circle cx="80" cy="750" r="65" fill="#FEF2F2" />

          {/* EZVIZ Colorful Flower Logo */}
          <g transform="translate(175, 115)">
            <circle cx="24" cy="18" r="11" fill="#EF4444" opacity="0.85" />
            <circle cx="42" cy="18" r="11" fill="#F59E0B" opacity="0.85" />
            <circle cx="18" cy="36" r="11" fill="#3B82F6" opacity="0.85" />
            <circle cx="48" cy="36" r="11" fill="#10B981" opacity="0.85" />
            <circle cx="33" cy="27" r="7" fill="#FFFFFF" />
            <text
              x="75"
              y="42"
              fill="#334155"
              fontFamily="Arial Black, sans-serif"
              fontWeight="900"
              fontSize="44"
              letterSpacing="4"
            >
              EZVIZ
            </text>
          </g>

          <text
            x="300"
            y="245"
            textAnchor="middle"
            fill="#334155"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="18"
          >
            Hereby appoints and presents
          </text>
          <text
            x="300"
            y="272"
            textAnchor="middle"
            fill="#334155"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="18"
          >
            this certificate to
          </text>

          {/* Recipient */}
          <text
            x="300"
            y="360"
            textAnchor="middle"
            fill="#0F172A"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="24"
            letterSpacing="0.5"
          >
            ACUUY CCTV &amp; IT SOLUTION GARUT
          </text>
          <line x1="95" y1="376" x2="505" y2="376" stroke="#93C5FD" strokeWidth="2" />

          <text
            x="300"
            y="430"
            textAnchor="middle"
            fill="#475569"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="18"
          >
            as an
          </text>

          <text
            x="300"
            y="475"
            textAnchor="middle"
            fill="#1E3A8A"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="24"
          >
            EZVIZ Authorized Master Dealer
          </text>
          <line x1="120" y1="492" x2="480" y2="492" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Validity Period */}
          <text
            x="300"
            y="560"
            textAnchor="middle"
            fill="#1E293B"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="16"
          >
            From <tspan textDecoration="underline">2025.01.01</tspan> to{' '}
            <tspan textDecoration="underline">2026.12.31</tspan>
          </text>

          {/* Signature Right */}
          <g transform="translate(320, 645)">
            <path
              d="M20 35 C40 10, 65 45, 90 15 C110 5, 135 40, 165 20"
              stroke="#1E293B"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <text x="175" y="65" textAnchor="end" fill="#0F172A" fontWeight="bold" fontSize="13" fontFamily="Arial">
              Jiang颐 (Ezviz CEO)
            </text>
            <text x="175" y="83" textAnchor="end" fill="#64748B" fontSize="11" fontFamily="Arial">
              CEO of EZVIZ International
            </text>
            <text x="175" y="99" textAnchor="end" fill="#64748B" fontSize="10" fontFamily="Arial">
              Hangzhou EZVIZ Network Co., Ltd.
            </text>
          </g>
        </svg>
      );

    case 'HIKVISION':
      return (
        <svg
          viewBox="0 0 600 840"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="600" height="840" fill="#FFFFFF" />

          {/* Guilloche / Security Pattern Border */}
          <rect
            x="24"
            y="24"
            width="552"
            height="792"
            stroke="#CBD5E1"
            strokeWidth="12"
          />
          <rect
            x="34"
            y="34"
            width="532"
            height="772"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          <rect
            x="44"
            y="44"
            width="512"
            height="752"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />

          {/* HIKVISION Logo */}
          <text
            x="300"
            y="135"
            textAnchor="middle"
            fill="#DC2626"
            fontFamily="Arial Black, sans-serif"
            fontWeight="900"
            fontSize="42"
            fontStyle="italic"
            letterSpacing="2"
          >
            HIKVISION
          </text>

          <text
            x="300"
            y="185"
            textAnchor="middle"
            fill="#334155"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="15"
          >
            Hereby appoints and presents
          </text>
          <text
            x="300"
            y="208"
            textAnchor="middle"
            fill="#334155"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="15"
          >
            this certificate to
          </text>

          {/* Company Name in Red */}
          <text
            x="300"
            y="265"
            textAnchor="middle"
            fill="#DC2626"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="22"
            letterSpacing="0.5"
          >
            ACUUY CCTV &amp; IT SOLUTION GARUT
          </text>

          <text
            x="300"
            y="305"
            textAnchor="middle"
            fill="#475569"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="15"
          >
            as
          </text>

          <text
            x="300"
            y="345"
            textAnchor="middle"
            fill="#D97706"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="18"
            letterSpacing="1"
          >
            HIKVISION AUTHORIZED
          </text>
          <text
            x="300"
            y="372"
            textAnchor="middle"
            fill="#D97706"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="18"
            letterSpacing="1"
          >
            PLATINUM DEALER PARTNER
          </text>

          <text
            x="300"
            y="412"
            textAnchor="middle"
            fill="#475569"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fontSize="16"
          >
            of
          </text>

          {/* Table Fields */}
          <g transform="translate(105, 445)">
            <text x="0" y="20" fill="#334155" fontWeight="bold" fontSize="15" fontFamily="Arial">
              Product
            </text>
            <text x="95" y="20" fill="#0F172A" fontWeight="bold" fontSize="15" fontFamily="Arial">
              Full Range Security System
            </text>
            <line x1="90" y1="28" x2="390" y2="28" stroke="#94A3B8" strokeWidth="1.2" />

            <text x="0" y="60" fill="#334155" fontWeight="bold" fontSize="15" fontFamily="Arial">
              Territory
            </text>
            <text x="95" y="60" fill="#0F172A" fontWeight="bold" fontSize="15" fontFamily="Arial">
              Garut &amp; West Java, Indonesia
            </text>
            <line x1="90" y1="68" x2="390" y2="68" stroke="#94A3B8" strokeWidth="1.2" />

            <text x="0" y="100" fill="#334155" fontWeight="bold" fontSize="15" fontFamily="Arial">
              Validity
            </text>
            <text x="95" y="100" fill="#0F172A" fontWeight="bold" fontSize="15" fontFamily="Arial">
              January 1st - December 31st 2026
            </text>
            <line x1="90" y1="108" x2="390" y2="108" stroke="#94A3B8" strokeWidth="1.2" />
          </g>

          {/* Dual Signatures */}
          <g transform="translate(115, 625)">
            <path
              d="M15 30 C35 5, 55 40, 80 12 C95 0, 110 35, 135 18"
              stroke="#1E293B"
              strokeWidth="2"
              fill="none"
            />
            <line x1="0" y1="45" x2="155" y2="45" stroke="#CBD5E1" strokeWidth="1" />
            <text x="77" y="64" textAnchor="middle" fill="#334155" fontWeight="bold" fontSize="11" fontFamily="Arial">
              Cynthia Ho
            </text>
            <text x="77" y="79" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="Arial">
              VP of Hikvision
            </text>
          </g>

          <g transform="translate(330, 625)">
            <path
              d="M20 28 C40 8, 60 35, 85 15 C105 5, 120 30, 140 20"
              stroke="#1E293B"
              strokeWidth="2"
              fill="none"
            />
            <line x1="0" y1="45" x2="155" y2="45" stroke="#CBD5E1" strokeWidth="1" />
            <text x="77" y="64" textAnchor="middle" fill="#334155" fontWeight="bold" fontSize="11" fontFamily="Arial">
              Wangqiang
            </text>
            <text x="77" y="79" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="Arial">
              Director of Asia BG
            </text>
          </g>

          <text
            x="300"
            y="755"
            textAnchor="middle"
            fill="#64748B"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="10"
          >
            International Business Center
          </text>
          <text
            x="300"
            y="770"
            textAnchor="middle"
            fill="#94A3B8"
            fontFamily="Arial, sans-serif"
            fontSize="9"
          >
            Hangzhou Hikvision Digital Technology Co., Ltd.
          </text>
        </svg>
      );

    case 'HILOOK':
      return (
        <svg
          viewBox="0 0 600 840"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="600" height="840" fill="#FFFFFF" />

          {/* Guilloche Border */}
          <rect
            x="24"
            y="24"
            width="552"
            height="792"
            stroke="#CBD5E1"
            strokeWidth="12"
          />
          <rect
            x="34"
            y="34"
            width="532"
            height="772"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          <rect
            x="44"
            y="44"
            width="512"
            height="752"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />

          {/* HiLook Logo */}
          <text
            x="300"
            y="135"
            textAnchor="middle"
            fill="#0284C7"
            fontFamily="Arial Black, sans-serif"
            fontWeight="900"
            fontSize="44"
            letterSpacing="1"
          >
            HiL<tspan fill="#38BDF8">oo</tspan>k
          </text>

          <text
            x="300"
            y="185"
            textAnchor="middle"
            fill="#334155"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="15"
          >
            Hereby appoints and presents
          </text>
          <text
            x="300"
            y="208"
            textAnchor="middle"
            fill="#334155"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="15"
          >
            this certificate to
          </text>

          {/* Company Name in Cyan/Blue */}
          <text
            x="300"
            y="265"
            textAnchor="middle"
            fill="#0284C7"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="22"
            letterSpacing="0.5"
          >
            ACUUY CCTV &amp; IT SOLUTION GARUT
          </text>

          <text
            x="300"
            y="305"
            textAnchor="middle"
            fill="#475569"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="15"
          >
            as
          </text>

          <text
            x="300"
            y="345"
            textAnchor="middle"
            fill="#D97706"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="18"
            letterSpacing="1"
          >
            HILOOK AUTHORIZED
          </text>
          <text
            x="300"
            y="372"
            textAnchor="middle"
            fill="#D97706"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="18"
            letterSpacing="1"
          >
            DEALER PARTNER
          </text>

          <text
            x="300"
            y="412"
            textAnchor="middle"
            fill="#475569"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fontSize="16"
          >
            of
          </text>

          {/* Table Fields */}
          <g transform="translate(105, 445)">
            <text x="0" y="20" fill="#334155" fontWeight="bold" fontSize="15" fontFamily="Arial">
              Product
            </text>
            <text x="95" y="20" fill="#0F172A" fontWeight="bold" fontSize="15" fontFamily="Arial">
              Full Range HiLook Series
            </text>
            <line x1="90" y1="28" x2="390" y2="28" stroke="#94A3B8" strokeWidth="1.2" />

            <text x="0" y="60" fill="#334155" fontWeight="bold" fontSize="15" fontFamily="Arial">
              Territory
            </text>
            <text x="95" y="60" fill="#0F172A" fontWeight="bold" fontSize="15" fontFamily="Arial">
              Garut &amp; West Java, Indonesia
            </text>
            <line x1="90" y1="68" x2="390" y2="68" stroke="#94A3B8" strokeWidth="1.2" />

            <text x="0" y="100" fill="#334155" fontWeight="bold" fontSize="15" fontFamily="Arial">
              Validity
            </text>
            <text x="95" y="100" fill="#0F172A" fontWeight="bold" fontSize="15" fontFamily="Arial">
              January 1st - December 31st 2026
            </text>
            <line x1="90" y1="108" x2="390" y2="108" stroke="#94A3B8" strokeWidth="1.2" />
          </g>

          {/* Dual Signatures */}
          <g transform="translate(115, 625)">
            <path
              d="M15 30 C35 5, 55 40, 80 12 C95 0, 110 35, 135 18"
              stroke="#1E293B"
              strokeWidth="2"
              fill="none"
            />
            <line x1="0" y1="45" x2="155" y2="45" stroke="#CBD5E1" strokeWidth="1" />
            <text x="77" y="64" textAnchor="middle" fill="#334155" fontWeight="bold" fontSize="11" fontFamily="Arial">
              Cynthia Ho
            </text>
            <text x="77" y="79" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="Arial">
              VP of Hikvision
            </text>
          </g>

          <g transform="translate(330, 625)">
            <path
              d="M20 28 C40 8, 60 35, 85 15 C105 5, 120 30, 140 20"
              stroke="#1E293B"
              strokeWidth="2"
              fill="none"
            />
            <line x1="0" y1="45" x2="155" y2="45" stroke="#CBD5E1" strokeWidth="1" />
            <text x="77" y="64" textAnchor="middle" fill="#334155" fontWeight="bold" fontSize="11" fontFamily="Arial">
              Wangqiang
            </text>
            <text x="77" y="79" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="Arial">
              Director of Asia BG
            </text>
          </g>

          <text
            x="300"
            y="755"
            textAnchor="middle"
            fill="#64748B"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="10"
          >
            International Business Center
          </text>
          <text
            x="300"
            y="770"
            textAnchor="middle"
            fill="#94A3B8"
            fontFamily="Arial, sans-serif"
            fontSize="9"
          >
            Hangzhou Hikvision Digital Technology Co., Ltd.
          </text>
        </svg>
      );

    case 'IMOU':
      return (
        <svg
          viewBox="0 0 600 840"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="600" height="840" fill="#FFFDF9" />

          {/* Classic Warm Copper Frame */}
          <rect
            x="28"
            y="28"
            width="544"
            height="784"
            stroke="#B45309"
            strokeWidth="5"
          />
          <rect
            x="38"
            y="38"
            width="524"
            height="764"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
          {/* Corner Filigree */}
          <rect x="24" y="24" width="22" height="22" stroke="#B45309" strokeWidth="3" fill="#FFFDF9" />
          <rect x="554" y="24" width="22" height="22" stroke="#B45309" strokeWidth="3" fill="#FFFDF9" />
          <rect x="24" y="794" width="22" height="22" stroke="#B45309" strokeWidth="3" fill="#FFFDF9" />
          <rect x="554" y="794" width="22" height="22" stroke="#B45309" strokeWidth="3" fill="#FFFDF9" />

          {/* IMOU Logo */}
          <text
            x="300"
            y="180"
            textAnchor="middle"
            fill="#F97316"
            fontFamily="Arial Rounded MT Bold, Arial Black, sans-serif"
            fontWeight="900"
            fontSize="58"
            letterSpacing="3"
          >
            Imou
          </text>

          <text
            x="300"
            y="245"
            textAnchor="middle"
            fill="#1E293B"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="24"
            letterSpacing="1.5"
          >
            AUTHORIZED RESELLER
          </text>

          <text
            x="300"
            y="325"
            textAnchor="middle"
            fill="#475569"
            fontFamily="Arial, sans-serif"
            fontSize="16"
          >
            It is hereby to authorize
          </text>

          <text
            x="300"
            y="375"
            textAnchor="middle"
            fill="#F97316"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="22"
            letterSpacing="0.5"
          >
            ACUUY CCTV &amp; IT SOLUTION GARUT
          </text>
          <line x1="120" y1="392" x2="480" y2="392" stroke="#FED7AA" strokeWidth="2" />

          <text
            x="300"
            y="445"
            textAnchor="middle"
            fill="#334155"
            fontFamily="Arial, sans-serif"
            fontSize="16"
          >
            as Imou Authorized
          </text>
          <text
            x="300"
            y="475"
            textAnchor="middle"
            fill="#334155"
            fontFamily="Arial, sans-serif"
            fontSize="16"
          >
            Reseller in <tspan fill="#F97316" fontWeight="bold" textDecoration="underline">Indonesia</tspan>
          </text>

          {/* Big Year */}
          <text
            x="300"
            y="585"
            textAnchor="middle"
            fill="#475569"
            fontFamily="Arial, sans-serif"
            fontWeight="300"
            fontSize="68"
            letterSpacing="4"
          >
            2026
          </text>

          <text
            x="300"
            y="640"
            textAnchor="middle"
            fill="#64748B"
            fontFamily="Arial, sans-serif"
            fontSize="11"
          >
            This authorization is valid from 01 Jan. 2026 to 31 Dec. 2026
          </text>

          {/* Red Official Stamp + Signature */}
          <g transform="translate(360, 650)">
            <path
              d="M-50 45 C-25 20, 0 55, 25 25 C45 10, 65 45, 90 30"
              stroke="#1E293B"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="65"
              cy="45"
              r="38"
              stroke="#DC2626"
              strokeWidth="3"
              opacity="0.75"
            />
            <circle
              cx="65"
              cy="45"
              r="32"
              stroke="#DC2626"
              strokeWidth="1"
              strokeDasharray="4 2"
              opacity="0.75"
            />
            <polygon
              points="65,30 69,40 80,40 71,46 74,57 65,50 56,57 59,46 50,40 61,40"
              fill="#DC2626"
              opacity="0.75"
            />
            <text
              x="65"
              y="70"
              textAnchor="middle"
              fill="#DC2626"
              fontSize="7"
              fontWeight="bold"
              opacity="0.8"
              fontFamily="Arial"
            >
              IMOU NETWORK TECH
            </text>
          </g>

          <text
            x="300"
            y="755"
            textAnchor="middle"
            fill="#64748B"
            fontFamily="Arial, sans-serif"
            fontSize="10"
          >
            Hangzhou Huacheng Network Technology Co., Ltd.
          </text>
        </svg>
      );
  }
}

