'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Flame,
  HardDrive,
  Package,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import BookingModal from '@/components/booking/BookingModal';
import { getCctvPackages } from '@/lib/store';
import { CctvPackage } from '@/lib/types';

interface PopularPackage {
  id: string;
  brand: string;
  brandTagline: string;
  name: string;
  tag: string;
  type: 'Analog' | 'IP Camera';
  price: string;
  priceNote: string;
  description: string;
  highlights: { icon: React.ElementType; label: string }[];
  features: string[];
  popular?: boolean;
  accent: string;
}

const DEFAULT_POPULAR_PACKAGES: PopularPackage[] = [
  {
    id: 'hilook-4-analog',
    brand: 'HiLook',
    brandTagline: 'by Hikvision',
    name: 'Paket HiLook 4 Kamera 2MP',
    tag: 'Paling Hemat',
    type: 'Analog',
    price: 'Rp 2.650.000',
    priceNote: 'Sudah termasuk jasa pasang',
    description: 'Pilihan ekonomis untuk rumah tinggal, warung, dan kost-kostan dengan gambar Full HD yang jernih.',
    highlights: [
      { icon: Camera, label: '4 Kamera 2MP' },
      { icon: HardDrive, label: 'HDD 500GB' },
      { icon: Smartphone, label: 'Pantau di HP' },
    ],
    features: [
      '4 Unit Kamera HiLook Turbo HD 1080p',
      'DVR HiLook 4 Channel',
      'Harddisk 500GB Khusus CCTV',
      'Kabel Coaxial + Power 60 Meter',
      'Setting Online ke HP Android / iPhone',
      'Garansi Unit & Pemasangan 1 Tahun',
    ],
    accent: 'from-red-500 to-rose-600',
  },
  {
    id: 'hikvision-4-colorvu',
    brand: 'Hikvision',
    brandTagline: 'ColorVu Series',
    name: 'Paket Hikvision ColorVu 4 Kamera',
    tag: 'Paling Populer',
    type: 'Analog',
    price: 'Rp 3.650.000',
    priceNote: 'Sudah termasuk jasa pasang',
    description: 'Gambar tetap berwarna 24 jam bahkan saat malam hari. Favorit pemilik ruko, toko, dan kafe di Garut.',
    highlights: [
      { icon: Camera, label: '4 Kamera ColorVu' },
      { icon: HardDrive, label: 'HDD 1TB' },
      { icon: Smartphone, label: 'Audio Built-in' },
    ],
    features: [
      '4 Unit Kamera Hikvision ColorVu 2MP (Berwarna 24 Jam)',
      'DVR Hikvision 4 Channel AcuSense',
      'Harddisk 1TB Surveillance (Rekam 2-3 Minggu)',
      'Kabel Coaxial + Power 80 Meter',
      'Setting Pantau di HP / Tablet / PC',
      'Garansi Resmi & Pemasangan 1 Tahun',
    ],
    popular: true,
    accent: 'from-teal-400 to-emerald-500',
  },
  {
    id: 'dahua-4-ip',
    brand: 'Dahua',
    brandTagline: 'IP Camera PoE',
    name: 'Paket Dahua IP Camera 4MP',
    tag: 'Smart & Detail',
    type: 'IP Camera',
    price: 'Rp 5.250.000',
    priceNote: 'Sudah termasuk jasa pasang',
    description: 'Resolusi 4MP super tajam dengan deteksi manusia & kendaraan. Cocok untuk kantor, gudang, dan sekolah.',
    highlights: [
      { icon: Camera, label: '4 IP Cam 4MP' },
      { icon: HardDrive, label: 'HDD 2TB' },
      { icon: ShieldCheck, label: 'Smart Detect' },
    ],
    features: [
      '4 Unit IP Camera Dahua 4MP PoE',
      'NVR Dahua 4 Channel PoE',
      'Harddisk 2TB Surveillance Rekam Panjang',
      'Kabel UTP Cat6 80 Meter',
      'Notifikasi Deteksi Manusia/Kendaraan ke HP',
      'Garansi Resmi & Pemasangan 1 Tahun',
    ],
    accent: 'from-sky-500 to-blue-600',
  },
];

function getBrandAccent(brand: string): string {
  const normalized = brand.toLowerCase();
  if (normalized.includes('hilook')) return 'from-red-500 to-rose-600';
  if (normalized.includes('dahua')) return 'from-sky-500 to-blue-600';
  if (normalized.includes('ezviz') || normalized.includes('imou')) return 'from-emerald-500 to-teal-600';
  return 'from-teal-400 to-emerald-500';
}

function mapDbPackagesToPopular(data: CctvPackage[]): PopularPackage[] {
  const active = data.filter((p) => p.is_active !== false);
  if (active.length === 0) return DEFAULT_POPULAR_PACKAGES;

  const popularOnes = active.filter((p) => p.popular);
  const selected = (popularOnes.length > 0 ? popularOnes : active).slice(0, 3);
  const highlightedIndex = selected.length === 3 ? 1 : 0;
  const multipleMarkedPopular = selected.filter((p) => p.popular).length > 1;

  return selected.map((p, idx) => {
    const isIp = p.type?.toLowerCase().includes('ip');
    const resolutionShort = p.resolution ? p.resolution.split(' ')[0] : '';
    const thirdHighlight =
      p.series === 'ColorVu Audio'
        ? { icon: Smartphone, label: 'ColorVu + Audio' }
        : p.series === 'Audio'
          ? { icon: Smartphone, label: 'Audio Built-in' }
          : isIp
            ? { icon: ShieldCheck, label: 'Smart Detect' }
            : { icon: Smartphone, label: 'Pantau di HP' };

    return {
      id: p.id,
      brand: p.brand || 'Hikvision',
      brandTagline: p.brand_tagline || p.series_label || '',
      name: p.name,
      tag: p.tag || (p.popular ? 'Paling Populer' : p.series || 'Paket Lengkap'),
      type: isIp ? 'IP Camera' : 'Analog',
      price: p.price,
      priceNote: 'Sudah termasuk jasa pasang',
      description: p.description || p.best_for || '',
      highlights: [
        {
          icon: Camera,
          label: `${p.camera_count || 4} ${isIp ? 'IP Cam' : 'Kamera'}${resolutionShort ? ` ${resolutionShort}` : ''}`,
        },
        { icon: HardDrive, label: `HDD ${p.hdd_size || '1TB'}` },
        thirdHighlight,
      ],
      features: Array.isArray(p.features) ? p.features : [],
      popular:
        popularOnes.length === 0 || multipleMarkedPopular
          ? idx === highlightedIndex
          : Boolean(p.popular),
      accent: getBrandAccent(p.brand || ''),
    };
  });
}

export default function PopularPackagesSection() {
  const [packages, setPackages] = useState<PopularPackage[]>(DEFAULT_POPULAR_PACKAGES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<PopularPackage | null>(null);

  useEffect(() => {
    getCctvPackages()
      .then((data) => {
        if (data && data.length > 0) {
          setPackages(mapDbPackagesToPopular(data));
        }
      })
      .catch((err) => {
        console.warn('Gagal memuat paket populer dari Supabase, menggunakan data default:', err);
      });
  }, []);

  const handleChoose = (pkg: PopularPackage) => {
    setSelectedPkg(pkg);
    setModalOpen(true);
  };

  return (
    <section id="paket-populer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200">
          <Flame className="w-3.5 h-3.5" /> Paket Populer CCTV
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
          Paket CCTV Terlaris Pilihan Pelanggan Garut
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Paket lengkap dari brand resmi HiLook, Hikvision, dan Dahua. Harga sudah termasuk unit kamera,
          perekam, harddisk, kabel, dan jasa instalasi rapi. Tinggal terima beres!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative rounded-3xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
              pkg.popular
                ? 'bg-gradient-to-b from-slate-900 to-teal-950 text-white shadow-2xl border-2 border-teal-500 md:scale-[1.03]'
                : 'bg-white text-slate-900 border border-slate-200/80 shadow-sm hover:shadow-xl'
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 inset-x-0 text-center py-1.5 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-widest">
                ⭐ Rekomendasi Teknisi
              </div>
            )}

            <div className={`p-6 ${pkg.popular ? 'pt-10' : ''}`}>
              {/* Brand header */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${pkg.accent} text-white flex items-center justify-center shadow-md`}
                  >
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-black tracking-tight leading-none uppercase">{pkg.brand}</div>
                    <div className={`text-[11px] font-semibold mt-0.5 ${pkg.popular ? 'text-teal-300' : 'text-slate-500'}`}>
                      {pkg.brandTagline}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    pkg.popular ? 'bg-teal-500 text-slate-950' : 'bg-teal-50 text-teal-800 border border-teal-200'
                  }`}
                >
                  {pkg.tag}
                </span>
              </div>

              <h3 className="text-base font-black">{pkg.name}</h3>
              <p className={`text-xs mt-1 leading-relaxed ${pkg.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                {pkg.description}
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {pkg.highlights.map((h) => (
                  <div
                    key={h.label}
                    className={`rounded-xl p-2 text-center ${
                      pkg.popular ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-100'
                    }`}
                  >
                    <h.icon className={`w-4 h-4 mx-auto ${pkg.popular ? 'text-teal-300' : 'text-teal-600'}`} />
                    <div className={`text-[10px] font-bold mt-1 leading-tight ${pkg.popular ? 'text-slate-200' : 'text-slate-700'}`}>
                      {h.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className={`mt-5 pt-4 border-t ${pkg.popular ? 'border-white/10' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      pkg.type === 'IP Camera'
                        ? 'bg-sky-100 text-sky-800'
                        : pkg.popular
                          ? 'bg-amber-400/15 text-amber-300'
                          : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {pkg.type}
                  </span>
                  <span className={`text-[11px] ${pkg.popular ? 'text-slate-400' : 'text-slate-500'}`}>Mulai dari</span>
                </div>
                <div className={`text-2xl font-black mt-1 ${pkg.popular ? 'text-teal-300' : 'text-teal-700'}`}>
                  {pkg.price}
                </div>
                <div className={`text-[11px] ${pkg.popular ? 'text-slate-400' : 'text-slate-500'}`}>{pkg.priceNote}</div>
              </div>

              {/* Features */}
              <ul className="mt-5 space-y-2 text-xs">
                {pkg.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.popular ? 'text-teal-400' : 'text-teal-600'}`}
                    />
                    <span className={pkg.popular ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => handleChoose(pkg)}
                className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                  pkg.popular
                    ? 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-teal-500/20'
                    : 'bg-slate-900 hover:bg-teal-600 text-white'
                }`}
              >
                Pilih Paket Ini <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA: Paket lainnya */}
      <div className="mt-10 flex flex-col items-center gap-2 text-center">
        <Link
          href="/cctv#paket"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-teal-50 text-teal-700 border-2 border-teal-500 font-extrabold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <Package className="w-4 h-4" />
          Pilih Paket Lainnya
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-xs text-slate-500">
          Tersedia paket 2, 8, hingga 16 kamera serta paket custom sesuai kebutuhan lokasi Anda.
        </p>
      </div>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultService="cctv"
        presetDetails={{
          selected_package: selectedPkg?.name,
          package_price: selectedPkg?.price,
        }}
      />
    </section>
  );
}

