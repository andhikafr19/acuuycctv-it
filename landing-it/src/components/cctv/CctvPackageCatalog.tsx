'use client';

import React, { useState, useMemo } from 'react';
import {
  Camera,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
  Mic,
  Sun,
  Cable,
  Sparkles,
  RotateCcw,
  ArrowRight,
  SlidersHorizontal,
  Building2,
  Cpu,
  MessageSquare,
} from 'lucide-react';
import {
  CCTV_CATALOG_PACKAGES,
  CctvCatalogPackage,
  BrandFilter,
  CameraTypeFilter,
  SeriesFilter,
  ChannelFilter,
} from '@/lib/cctv-packages';
import { waLink } from '@/lib/business';

interface CctvPackageCatalogProps {
  onSelectPackage: (pkg: CctvCatalogPackage) => void;
  onOpenCustomSurvey: () => void;
}

const BRAND_OPTIONS: { value: BrandFilter; label: string; subtitle: string; badgeColor: string }[] = [
  { value: 'Semua', label: 'Semua Brand', subtitle: '26 Pilihan Paket', badgeColor: 'bg-teal-500' },
  { value: 'Hikvision', label: 'HIKVISION', subtitle: 'No.1 Global Brand', badgeColor: 'bg-rose-600' },
  { value: 'HiLook', label: 'HiLook', subtitle: 'Hemat by Hikvision', badgeColor: 'bg-orange-500' },
  { value: 'Dahua', label: 'DAHUA', subtitle: 'WizSense & Cooper', badgeColor: 'bg-sky-600' },
  { value: 'EZVIZ / IMOU', label: 'EZVIZ & IMOU', subtitle: 'Smart Wi-Fi 360°', badgeColor: 'bg-emerald-600' },
];

const TYPE_OPTIONS: { value: CameraTypeFilter; label: string; desc: string }[] = [
  { value: 'Semua', label: 'SEMUA JENIS', desc: 'Analog & IP Camera' },
  { value: 'CCTV Analog', label: 'CCTV ANALOG', desc: 'DVR + Kabel Coaxial' },
  { value: 'CCTV IP Camera', label: 'CCTV IP CAMERA', desc: 'NVR + PoE / Digital' },
];

const SERIES_OPTIONS: {
  value: SeriesFilter;
  label: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  { value: 'Semua', label: 'SEMUA SERI', desc: 'Tampilkan semua fitur', icon: Sparkles },
  { value: 'Standard', label: 'STANDARD', desc: 'Infrared Malam Hitam-Putih', icon: Camera },
  { value: 'Audio', label: 'AUDIO', desc: 'Rekam Video + Suara Mic', icon: Mic },
  { value: 'ColorVu Audio', label: 'COLORVU AUDIO', desc: 'Berwarna 24 Jam + Suara', icon: Sun },
];

const CHANNEL_OPTIONS: { value: ChannelFilter; label: string }[] = [
  { value: 'Semua', label: 'Semua Titik' },
  { value: 2, label: '2 Kamera' },
  { value: 4, label: '4 Kamera' },
  { value: 6, label: '6 Kamera' },
  { value: 8, label: '8 Kamera' },
  { value: 16, label: '16 Kamera' },
];

export default function CctvPackageCatalog({
  onSelectPackage,
  onOpenCustomSurvey,
}: CctvPackageCatalogProps) {
  const [selectedBrand, setSelectedBrand] = useState<BrandFilter>('Semua');
  const [selectedType, setSelectedType] = useState<CameraTypeFilter>('Semua');
  const [selectedSeries, setSelectedSeries] = useState<SeriesFilter>('Semua');
  const [selectedChannel, setSelectedChannel] = useState<ChannelFilter>('Semua');

  const filteredPackages = useMemo(() => {
    return CCTV_CATALOG_PACKAGES.filter((pkg) => {
      if (selectedBrand !== 'Semua' && pkg.brand !== selectedBrand) return false;
      if (selectedType !== 'Semua' && pkg.type !== selectedType) return false;
      if (selectedSeries !== 'Semua' && pkg.series !== selectedSeries) return false;
      if (selectedChannel !== 'Semua' && pkg.cameraCount !== selectedChannel) return false;
      return true;
    });
  }, [selectedBrand, selectedType, selectedSeries, selectedChannel]);

  const activeSectionTitle = useMemo(() => {
    const brandPart = selectedBrand === 'Semua' ? 'SEMUA BRAND RESMI' : `CCTV ${selectedBrand.toUpperCase()}`;
    const typePart = selectedType === 'Semua' ? '' : ` • ${selectedType.toUpperCase()}`;
    const seriesPart =
      selectedSeries === 'Semua'
        ? 'PILIHAN LENGKAP'
        : selectedSeries === 'Standard'
        ? 'STANDARD 2MP / 4MP'
        : selectedSeries === 'Audio'
        ? 'SMART AUDIO (REKAM SUARA)'
        : 'COLORVU AUDIO (WARNA 24 JAM + SUARA)';
    return { top: `${brandPart}${typePart}`, main: seriesPart };
  }, [selectedBrand, selectedType, selectedSeries]);

  const hasActiveFilter =
    selectedBrand !== 'Semua' ||
    selectedType !== 'Semua' ||
    selectedSeries !== 'Semua' ||
    selectedChannel !== 'Semua';

  const handleResetFilters = () => {
    setSelectedBrand('Semua');
    setSelectedType('Semua');
    setSelectedSeries('Semua');
    setSelectedChannel('Semua');
  };

  const getBrandColors = (brand: CctvCatalogPackage['brand']) => {
    switch (brand) {
      case 'Hikvision':
        return {
          logoColor: 'text-rose-600',
          badgeBg: 'bg-rose-600 text-white',
          posterAccent: 'from-amber-50 via-stone-100 to-amber-100/70',
          pillBorder: 'border-rose-200 bg-rose-50 text-rose-700',
        };
      case 'HiLook':
        return {
          logoColor: 'text-orange-600',
          badgeBg: 'bg-orange-600 text-white',
          posterAccent: 'from-slate-50 via-orange-50/60 to-amber-50/70',
          pillBorder: 'border-orange-200 bg-orange-50 text-orange-700',
        };
      case 'Dahua':
        return {
          logoColor: 'text-sky-700',
          badgeBg: 'bg-sky-700 text-white',
          posterAccent: 'from-sky-50 via-slate-100 to-blue-50',
          pillBorder: 'border-sky-200 bg-sky-50 text-sky-700',
        };
      default:
        return {
          logoColor: 'text-teal-700',
          badgeBg: 'bg-teal-600 text-white',
          posterAccent: 'from-teal-50 via-emerald-50/60 to-slate-100',
          pillBorder: 'border-teal-200 bg-teal-50 text-teal-700',
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* FILTER CONTROL PANEL (Inspired by Image 2 + Enhanced Best Practice) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg shadow-slate-900/5 p-4 sm:p-6 space-y-5">
        {/* Row 1: Brand Filter Tabs */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" /> 1. Pilih Brand Resmi
            </span>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {BRAND_OPTIONS.map((b) => {
              const active = selectedBrand === b.value;
              const count =
                b.value === 'Semua'
                  ? CCTV_CATALOG_PACKAGES.length
                  : CCTV_CATALOG_PACKAGES.filter((p) => p.brand === b.value).length;
              return (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setSelectedBrand(b.value)}
                  className={`relative text-left px-3.5 py-2.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.01]'
                      : 'bg-slate-50/80 hover:bg-white text-slate-700 border-slate-200/80 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="text-xs sm:text-sm font-black tracking-tight">{b.label}</span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        active ? 'bg-teal-400 text-slate-950' : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] mt-0.5 truncate ${
                      active ? 'text-teal-300 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {b.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Dual Bar like Image 2 (Left: CCTV Analog vs IP Camera | Right: Standard / Audio / ColorVu Audio) */}
        <div className="pt-4 border-t border-slate-100 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          {/* Left Side: Jenis Kamera (CCTV Analog | CCTV IP Camera) */}
          <div className="space-y-2">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              2. Jenis Sistem Kamera
            </span>
            <div className="inline-flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
              {TYPE_OPTIONS.map((t) => {
                const active = selectedType === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setSelectedType(t.value)}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-left transition-all ${
                      active
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'bg-transparent text-slate-600 hover:bg-white/70 hover:text-slate-900'
                    }`}
                  >
                    <div className="text-xs font-black tracking-wide leading-none">{t.label}</div>
                    <div
                      className={`text-[10px] mt-1 leading-none ${
                        active ? 'text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      {t.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side: Seri Fitur (Standard | Audio | ColorVu Audio) */}
          <div className="space-y-2">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 lg:text-right">
              3. Pilih Seri & Fitur Kamera
            </span>
            <div className="inline-flex flex-wrap gap-1.5 bg-blue-50/80 border border-blue-100 p-1.5 rounded-2xl w-full sm:w-auto">
              {SERIES_OPTIONS.map((s) => {
                const active = selectedSeries === s.value;
                const Icon = s.icon;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSelectedSeries(s.value)}
                    className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl text-left transition-all flex items-center gap-2 ${
                      active
                        ? 'bg-blue-700 text-white shadow-sm'
                        : 'bg-transparent text-blue-900 hover:bg-white/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-amber-300' : 'text-blue-600'}`} />
                    <div>
                      <div className="text-xs font-black tracking-wide leading-none">{s.label}</div>
                      <div
                        className={`text-[10px] mt-1 leading-none hidden sm:block ${
                          active ? 'text-blue-100' : 'text-blue-600/70'
                        }`}
                      >
                        {s.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 3: Quick Channel / Jumlah Kamera Pills */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mr-1">
              Jumlah Titik:
            </span>
            {CHANNEL_OPTIONS.map((ch) => {
              const active = selectedChannel === ch.value;
              return (
                <button
                  key={String(ch.value)}
                  type="button"
                  onClick={() => setSelectedChannel(ch.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    active
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {ch.label}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Menampilkan <strong className="text-slate-900">{filteredPackages.length}</strong> paket
            siap pasang
          </div>
        </div>
      </div>

      {/* DYNAMIC CATEGORY HEADING (Like "STANDARD 2MP" in Image 2) */}
      <div className="text-center space-y-1 pt-2">
        <div className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
          {activeSectionTitle.top}
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide uppercase">
          {activeSectionTitle.main}
        </h3>
        <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-600 mx-auto rounded-full" />
      </div>

      {/* PACKAGE CARDS GRID */}
      {filteredPackages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Camera className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-black text-slate-900">
              Kombinasi Paket Tidak Ditemukan
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Belum ada paket prasetel untuk filter yang dipilih. Anda dapat mereset filter atau
              konsultasikan jumlah titik kamera custom bersama tim teknisi kami.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
            >
              Tampilkan Semua Paket
            </button>
            <button
              type="button"
              onClick={onOpenCustomSurvey}
              className="px-4 py-2.5 rounded-xl bg-teal-500 text-slate-950 text-xs font-extrabold hover:bg-teal-400 transition-all"
            >
              Ajukan Paket Custom
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {filteredPackages.map((pkg) => {
            const colors = getBrandColors(pkg.brand);
            return (
              <div
                key={pkg.id}
                className={`group rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
                  pkg.popular
                    ? 'bg-white ring-2 ring-teal-500 shadow-xl shadow-teal-900/10'
                    : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-xl'
                }`}
              >
                <div>
                  {/* VISUAL POSTER HEADER (Inspired by Image 2's Product Banner Card) */}
                  <div
                    className={`relative p-4 pb-3 bg-gradient-to-br ${colors.posterAccent} border-b border-slate-200/70 overflow-hidden`}
                  >
                    {/* Decorative background living room aura */}
                    <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/60 blur-xl pointer-events-none" />

                    {/* Top Row: Brand Logo & Acuuy Authorized Badge */}
                    <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-sm font-black italic tracking-tight uppercase ${colors.logoColor}`}
                      >
                        {pkg.brand}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {pkg.popular && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-sm">
                            ★ Terlaris
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-white/90 border border-slate-200 text-[9px] font-extrabold text-slate-700">
                          ACUUY RESMI
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Big Poster Headline + Red Spec Stamp (Like Image 2) */}
                    <div className="relative z-10 flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-wider text-slate-700 leading-none">
                          PAKET CCTV
                        </div>
                        <div className="text-xl font-black uppercase tracking-tight text-slate-950 leading-tight mt-0.5">
                          {pkg.cameraCount} CAMERA
                        </div>
                        <div className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-400/90 text-slate-950 text-[9px] font-extrabold">
                          Aman, Jelas & Terjangkau
                        </div>
                      </div>

                      {/* Red/Blue Stamp Box like "Analog 2MP Standar" in Image 2 */}
                      <div className="shrink-0 rounded-xl overflow-hidden border border-slate-300 shadow-sm text-center min-w-[74px] bg-white">
                        <div className="bg-slate-800 text-white text-[9px] font-bold py-0.5 px-2">
                          {pkg.type === 'CCTV IP Camera' ? 'IP Cam' : 'Analog'}
                        </div>
                        <div
                          className={`py-1 px-2 font-black leading-none ${
                            pkg.series === 'ColorVu Audio'
                              ? 'bg-gradient-to-b from-amber-500 to-red-600 text-white'
                              : pkg.series === 'Audio'
                              ? 'bg-blue-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          <div className="text-sm">
                            {pkg.resolution.includes('4MP') ? '4MP' : '2MP'}
                          </div>
                          <div className="text-[8px] font-bold uppercase tracking-wider mt-0.5">
                            {pkg.series === 'ColorVu Audio'
                              ? 'ColorVu'
                              : pkg.series === 'Audio'
                              ? '+ Audio'
                              : 'Standar'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Illustrated Hardware Showcase (Bullet + Dome + DVR/NVR Deck) */}
                    <div className="relative z-10 mt-3 pt-2 flex flex-col items-center">
                      {/* Cameras + Recorder SVG Graphic */}
                      <div className="w-full h-24 flex items-center justify-center relative">
                        <svg
                          viewBox="0 0 260 95"
                          className="w-full h-full drop-shadow-md"
                          aria-hidden="true"
                        >
                          {/* DVR / NVR Black Box Base */}
                          <rect
                            x="35"
                            y="56"
                            width="190"
                            height="30"
                            rx="5"
                            fill="#1e293b"
                            stroke="#475569"
                            strokeWidth="1.5"
                          />
                          <rect x="43" y="62" width="174" height="18" rx="3" fill="#0f172a" />
                          {/* Status LEDs on DVR */}
                          <circle cx="55" cy="71" r="2.2" fill="#14b8a6" />
                          <circle cx="64" cy="71" r="2.2" fill="#38bdf8" />
                          <circle cx="73" cy="71" r="2.2" fill="#f43f5e" />
                          <rect x="112" y="69" width="36" height="4" rx="2" fill="#334155" />
                          <text
                            x="195"
                            y="74"
                            fontSize="7"
                            fontWeight="bold"
                            fill="#94a3b8"
                            textAnchor="middle"
                          >
                            {pkg.type === 'CCTV IP Camera' ? 'NVR PoE' : 'DVR HD'}
                          </text>

                          {/* Outdoor Bullet Camera (Left) */}
                          <g transform="translate(52, 10)">
                            <rect
                              x="0"
                              y="18"
                              width="58"
                              height="26"
                              rx="6"
                              fill="#ffffff"
                              stroke="#cbd5e1"
                              strokeWidth="1.5"
                            />
                            <path d="M0 18 L64 18 L58 24 L0 24 Z" fill="#e2e8f0" />
                            <rect x="4" y="21" width="26" height="20" rx="4" fill="#0f172a" />
                            <circle cx="17" cy="31" r="7" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
                            <circle cx="17" cy="31" r="3" fill="#0284c7" />
                            {/* Warm light LED if ColorVu */}
                            {pkg.series === 'ColorVu Audio' && (
                              <circle cx="26" cy="36" r="2.2" fill="#f59e0b" />
                            )}
                            <text
                              x="43"
                              y="33"
                              fontSize="6"
                              fontWeight="800"
                              fill="#dc2626"
                              textAnchor="middle"
                            >
                              {pkg.brand.slice(0, 7).toUpperCase()}
                            </text>
                          </g>

                          {/* Indoor Dome Camera (Right) */}
                          <g transform="translate(138, 8)">
                            <ellipse
                              cx="30"
                              cy="36"
                              rx="26"
                              ry="10"
                              fill="#e2e8f0"
                              stroke="#cbd5e1"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M8 34 C8 12, 52 12, 52 34 Z"
                              fill="#ffffff"
                              stroke="#cbd5e1"
                              strokeWidth="1.5"
                            />
                            <circle cx="30" cy="27" r="10" fill="#0f172a" />
                            <circle cx="30" cy="27" r="5" fill="#1e293b" stroke="#14b8a6" strokeWidth="1.2" />
                            <circle cx="30" cy="27" r="2" fill="#14b8a6" />
                            {pkg.series !== 'Standard' && (
                              <circle cx="40" cy="22" r="2" fill="#38bdf8" />
                            )}
                          </g>
                        </svg>
                      </div>

                      {/* Bottom Split Info on Poster: Indoor & Outdoor Camera Count (Like Image 2 bottom-left) */}
                      <div className="w-full flex items-center justify-between text-[10px] font-bold text-slate-700 bg-white/85 backdrop-blur-sm px-2.5 py-1.5 rounded-xl border border-slate-200/80">
                        <span>• {pkg.outdoorCount} Camera Outdoor</span>
                        <span>• {pkg.indoorCount} Camera Indoor</span>
                      </div>
                    </div>
                  </div>

                  {/* CARD BODY DETAILS */}
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${colors.pillBorder}`}
                        >
                          {pkg.seriesLabel}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {pkg.recorderSpec}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                        {pkg.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Quick Hardware Spec Badges */}
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                        <HardDrive className="w-3.5 h-3.5 text-teal-600 mx-auto" />
                        <div className="text-[10px] font-extrabold text-slate-700 mt-0.5">
                          {pkg.hddSize}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                        <Cable className="w-3.5 h-3.5 text-teal-600 mx-auto" />
                        <div className="text-[10px] font-extrabold text-slate-700 mt-0.5 truncate">
                          {pkg.cableLength}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                        {pkg.series === 'ColorVu Audio' ? (
                          <Sun className="w-3.5 h-3.5 text-amber-500 mx-auto" />
                        ) : pkg.series === 'Audio' ? (
                          <Mic className="w-3.5 h-3.5 text-blue-600 mx-auto" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 mx-auto" />
                        )}
                        <div className="text-[10px] font-extrabold text-slate-700 mt-0.5 truncate">
                          {pkg.series === 'ColorVu Audio'
                            ? 'Warna 24J'
                            : pkg.series === 'Audio'
                            ? '+ Suara'
                            : 'IR Night'}
                        </div>
                      </div>
                    </div>

                    {/* Price Block */}
                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block">
                          Harga Terima Beres
                        </span>
                        <div className="text-xl font-black text-teal-700 leading-tight">
                          {pkg.price}
                        </div>
                      </div>
                      {pkg.originalPrice && (
                        <span className="text-xs text-slate-400 line-through font-semibold">
                          {pkg.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Feature Checklist */}
                    <ul className="space-y-1.5 text-[11px] text-slate-600">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CARD FOOTER CTA */}
                <div className="p-5 pt-0 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                    <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">Cocok: {pkg.bestFor}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectPackage(pkg)}
                    className={`w-full py-2.5 rounded-xl font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                      pkg.popular
                        ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/20'
                        : 'bg-slate-900 hover:bg-teal-600 text-white'
                    }`}
                  >
                    <span>Pilih Paket Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BOTTOM HELPER BANNER: BINGUNG PILIH PAKET? */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-teal-500/30">
        <div className="space-y-1.5 text-center md:text-left max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-teal-300">
            <Cpu className="w-3.5 h-3.5" /> Butuh Kombinasi Titik Kamera Berbeda?
          </span>
          <h4 className="text-lg sm:text-xl font-black">
            Bisa Request Jumlah Indoor / Outdoor Sesuai Lokasi Anda!
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Jumlah kamera indoor dan outdoor pada setiap paket di atas bebas ditukar (misal 3
            outdoor + 1 indoor) tanpa biaya tambahan. Teknisi kami siap survei gratis ke lokasi Anda
            di Garut.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCustomSurvey}
            className="px-5 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg transition-all"
          >
            Ajukan Survei Lokasi Gratis
          </button>
          <a
            href={waLink('Halo Acuuy CCTV, saya mau tanya rekomendasi paket CCTV yang cocok untuk lokasi saya')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-teal-300" /> Chat Teknisi
          </a>
        </div>
      </div>
    </div>
  );
}

