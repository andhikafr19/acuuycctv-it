'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Camera,
  Wrench,
  Laptop as LaptopIcon,
  ShieldCheck,
  ArrowRight,
  Star,
  Clock,
  MapPin,
  Sparkles,
  PhoneCall,
  Activity,
  HardDrive,
  Users,
  Wifi,
  Cpu,
  Layers,
  Zap,
  Info,
  Scale,
  SlidersHorizontal,
  Cable,
  Check,
} from 'lucide-react';
import { StoreSettings, ServiceType, Portfolio } from '@/lib/types';
import { getStoreAll } from '@/lib/store';
import { formatWaPhone } from '@/lib/whatsapp';
import { BUSINESS } from '@/lib/business';
import BookingModal from '@/components/booking/BookingModal';
import CertificateSection from '@/components/certificate/CertificateSection';
import PopularPackagesSection from '@/components/cctv/PopularPackagesSection';

export default function HomePage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>('cctv');

  useEffect(() => {
    getStoreAll().then((data) => {
      setSettings(data.settings);
      setPortfolios(data.portfolios?.slice(0, 3) || []);
    });
  }, []);

  const openBooking = (service: ServiceType) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  const waNumber = settings ? formatWaPhone(settings.whatsapp_number) : BUSINESS.phone;

  return (
    <div className="space-y-20 pb-20">
      {/* =========================================================================
          1. HERO SECTION
         ========================================================================= */}
      <section className="relative pt-8 sm:pt-14 pb-16 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
        {/* Background Glowing Mesh Accents */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" /> Solusi IT & CCTV Terlengkap di Garut
              </div>

              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.15]">
                Jasa Pasang CCTV Garut,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400">
                  Rapi & Bergaransi.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Pusat layanan resmi <strong>Acuuy CCTV</strong> di Garut Kota. Melayani jasa
                instalasi kamera CCTV untuk rumah, toko & kantor, servis komputer & laptop
                bergaransi, jual-beli laptop bekas mulus, dan konsultasi jaringan IT kantor Anda.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => openBooking('cctv')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-extrabold text-sm shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Pasang CCTV Sekarang</span>
                </button>

                <Link
                  href="/katalog"
                  className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 hover:border-teal-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <LaptopIcon className="w-4 h-4 text-teal-400" />
                  <span>Katalog Laptop Bekas</span>
                </Link>
              </div>
            </div>

            {/* Right Card / Visual Grid */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-6 rounded-3xl border border-slate-700/80 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                      Layanan Siap Panggil Garut
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">Garut Kota</span>
                </div>

                {/* 4 Feature Rows */}
                <div className="space-y-4 my-5">
                  <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Instalasi CCTV HD & IP</h4>
                      <p className="text-xs text-slate-400">
                        Bisa dipantau via smartphone 24/7, gratis survei lokasi Garut Kota.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Servis Laptop & PC Express</h4>
                      <p className="text-xs text-slate-400">
                        Pengecekan awal transparan, ganti SSD/RAM, perbaikan motherboard bergaransi.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                      <LaptopIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Jual Beli Laptop Second</h4>
                      <p className="text-xs text-slate-400">
                        Siap pakai, lolos QC ketat, baterai sehat, plus garansi toko 1 bulan.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Local Stats */}
                <div className="pt-4 border-t border-slate-700/60 grid grid-cols-3 text-center">
                  <div>
                    <span className="text-xl font-black text-teal-400">500+</span>
                    <p className="text-[10px] text-slate-400 font-medium">Titik CCTV Terpasang</p>
                  </div>
                  <div>
                    <span className="text-xl font-black text-teal-400">100%</span>
                    <p className="text-[10px] text-slate-400 font-medium">Unit Bergaransi</p>
                  </div>
                  <div>
                    <span className="text-xl font-black text-teal-400">30 Menit</span>
                    <p className="text-[10px] text-slate-400 font-medium">Respon Cepat CS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. EDUKASI: PERBEDAAN CCTV ANALOG VS IP CAMERA (PANDUAN MEMILIH)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200">
            <Scale className="w-3.5 h-3.5" /> Panduan Memilih CCTV
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            CCTV Analog vs IP Camera: Mana yang Tepat untuk Anda?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Pahami perbedaan mendasar cara kerja, fitur cerdas, dan efisiensi biaya agar Anda mendapatkan sistem keamanan yang paling pas dengan kebutuhan dan budget.
          </p>
        </div>

        {/* 2 Kartu Perbandingan Visual Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Kartu CCTV Analog */}
          <div className="relative overflow-hidden bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            <div>
              <div className="relative -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 h-48 sm:h-56 overflow-hidden bg-amber-50">
                <Image
                  src="/images/cctv-analog.jpg"
                  alt="Kamera CCTV Analog dengan kabel koaksial dan perekam DVR"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
                <span className="absolute top-4 left-4 text-[11px] font-black uppercase tracking-widest bg-white/90 backdrop-blur text-amber-800 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
                  Analog
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Cable className="w-3.5 h-3.5" /> Perekam DVR & Kabel Koaksial
                </span>
                <span className="text-xs font-semibold text-slate-400">Paling Ekonomis</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                CCTV Analog <span className="text-xs font-normal text-slate-500">(HD-TVI / AHD / CVI)</span>
              </h3>
              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                Kamera mengirim sinyal video murni melalui kabel koaksial (RG59) menuju perekam <strong>DVR</strong> yang memproses dan menyimpan data rekaman.
              </p>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Biaya Awal Ramah di Kantong:</strong> Solusi keamanan terbaik untuk budget hemat dengan reliabilitas tinggi.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Instalasi Mudah & Pakai Kabel Lama:</strong> Sangat ideal menggantikan sistem CCTV lama tanpa tarik kabel ulang.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Resolusi Tajam 2 MP - 5 MP:</strong> Sudah sangat cukup untuk pengawasan harian rumah dan toko kelontong.
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Cocok Terbaik Untuk:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 text-xs font-medium bg-amber-50/80 text-amber-900 rounded-lg border border-amber-200/60">Rumah Tinggal</span>
                  <span className="px-2.5 py-1 text-xs font-medium bg-amber-50/80 text-amber-900 rounded-lg border border-amber-200/60">Warung & Toko Kelontong</span>
                  <span className="px-2.5 py-1 text-xs font-medium bg-amber-50/80 text-amber-900 rounded-lg border border-amber-200/60">Kost-kostan</span>
                  <span className="px-2.5 py-1 text-xs font-medium bg-amber-50/80 text-amber-900 rounded-lg border border-amber-200/60">Upgrade CCTV Lama</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Estimasi Paket Hemat</span>
              <button
                onClick={() => openBooking('cctv')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                Pilih CCTV Analog <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Kartu IP Camera */}
          <div className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-teal-500/30 shadow-xl flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-bl-full pointer-events-none" />
            <div>
              <div className="relative -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 h-48 sm:h-56 overflow-hidden bg-teal-950">
                <Image
                  src="/images/ip-camera.jpg"
                  alt="IP Camera dengan kabel LAN PoE dan perekam NVR"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/10 to-transparent" />
                <span className="absolute top-4 left-4 text-[11px] font-black uppercase tracking-widest bg-teal-950/80 backdrop-blur text-teal-200 px-3 py-1 rounded-full border border-teal-400/40 shadow-sm">
                  IP / Digital
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-300 bg-teal-900/60 px-3 py-1 rounded-full border border-teal-400/30">
                  <Wifi className="w-3.5 h-3.5" /> Perekam NVR & Kabel LAN / PoE
                </span>
                <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">Modern & Detail Ultra</span>
              </div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                IP Camera <span className="text-xs font-normal text-teal-200">(Network Camera)</span>
              </h3>
              <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
                Kamera cerdas yang memproses data digital langsung di kamera, mengirim gambar via kabel LAN (UTP) atau Wi-Fi ke perekam <strong>NVR</strong>.
              </p>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-teal-900/40 p-2.5 rounded-xl border border-teal-700/40">
                  <Check className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Kualitas 4K & Zoom Sangat Tajam:</strong> Resolusi 2 MP hingga 8 MP (Ultra HD) untuk tangkap wajah & plat nomor detail.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-teal-900/40 p-2.5 rounded-xl border border-teal-700/40">
                  <Check className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Fitur AI Pintar & 2-Way Audio:</strong> Deteksi manusia/kendaraan akurat, pembatasan garis maya, dan bicara dua arah.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-teal-900/40 p-2.5 rounded-xl border border-teal-700/40">
                  <Check className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Kabel Rapi dengan PoE:</strong> Cukup 1 kabel LAN untuk sinyal data sekaligus daya listrik tanpa adaptor tambahan.
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-teal-800/60">
                <div className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-2">
                  Cocok Terbaik Untuk:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 text-xs font-medium bg-teal-800/50 text-teal-100 rounded-lg border border-teal-600/40">Ruko & Kantor Bisnis</span>
                  <span className="px-2.5 py-1 text-xs font-medium bg-teal-800/50 text-teal-100 rounded-lg border border-teal-600/40">Gudang & Pabrik</span>
                  <span className="px-2.5 py-1 text-xs font-medium bg-teal-800/50 text-teal-100 rounded-lg border border-teal-600/40">Sekolah & Kampus</span>
                  <span className="px-2.5 py-1 text-xs font-medium bg-teal-800/50 text-teal-100 rounded-lg border border-teal-600/40">Monitoring Jarak Jauh Fleksibel</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-teal-800/60 flex items-center justify-between">
              <span className="text-xs text-teal-300">Solusi Berteknologi Tinggi</span>
              <button
                onClick={() => openBooking('cctv')}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-teal-500/20"
              >
                Pilih IP Camera <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabel Komparasi Detail */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-8">
          <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-teal-600" /> Tabel Perbandingan Teknis Lengkap
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Gunakan perbandingan parameter berikut sebagai referensi penentuan spesifikasi proyek Anda.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-100/70 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
              Informasi Umum Spesifikasi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/80 text-slate-700 uppercase font-black tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-3.5 px-4 sm:px-6 w-1/4">Parameter</th>
                  <th scope="col" className="py-3.5 px-4 sm:px-6 w-[37.5%] text-slate-900 bg-amber-50/40">CCTV Analog (HD)</th>
                  <th scope="col" className="py-3.5 px-4 sm:px-6 w-[37.5%] text-teal-900 bg-teal-50/50">IP Camera (Digital Network)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-slate-500" /> Perangkat Perekam
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700 bg-amber-50/20">
                    <strong>DVR (Digital Video Recorder)</strong>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-900 bg-teal-50/30">
                    <strong>NVR (Network Video Recorder)</strong> / Cloud / MicroSD
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 flex items-center gap-2">
                    <Cable className="w-4 h-4 text-slate-500" /> Media Kabel
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700 bg-amber-50/20">
                    Kabel Koaksial (RG59) + kabel daya DC terpisah (kabel siamese)
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-900 bg-teal-50/30">
                    Kabel UTP LAN (Cat5e / Cat6) atau nirkabel (Wi-Fi). <em>PoE support</em>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-slate-500" /> Resolusi & Ketajaman
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700 bg-amber-50/20">
                    Standar 2 MP (1080p) hingga 5 MP
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-900 bg-teal-50/30">
                    Lebih luas: 2 MP hingga 8 MP (4K Ultra HD) atau lebih
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-slate-500" /> Fitur Pintar & AI
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700 bg-amber-50/20">
                    Terbatas (deteksi gerakan umum/motion detection dasar)
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-900 bg-teal-50/30">
                    Kaya fitur: deteksi manusia/kendaraan, line crossing, face capture, 2-way audio
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-500" /> Kemudahan Penambahan Titik
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700 bg-amber-50/20">
                    Dibatasi oleh slot port fisik DVR (4, 8, 16, 32 channel)
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-900 bg-teal-50/30">
                    Sangat fleksibel via switch jaringan lokal (LAN)
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-500" /> Pemantauan Lewat HP
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700 bg-amber-50/20">
                    Bisa dipantau lewat aplikasi HP jika DVR terhubung kabel internet
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-900 bg-teal-50/30">
                    Bisa dipantau via aplikasi HP / PC langsung per kamera atau via NVR
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-slate-500" /> Biaya Investasi
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700 bg-amber-50/20">
                    <span className="font-extrabold text-emerald-700">Ekonomis & Ramah Anggaran</span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-900 bg-teal-50/30">
                    <span className="font-bold text-slate-800">Menengah ke Atas</span> (sebanding kualitas & fitur)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Banner Edukasi & Call to Action Konsultasi */}
        <div className="bg-gradient-to-r from-teal-50 via-white to-teal-50 rounded-3xl p-6 sm:p-8 border border-teal-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-black text-teal-800 uppercase tracking-wider">
              <Info className="w-4 h-4 text-teal-600" /> Masih Ragu Menentukan Pilihan?
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900">
              Konsultasikan Denah & Kebutuhan Titik Anda Secara Gratis!
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tim teknisi Acuuy CCTV siap membantu survei lokasi langsung di wilayah Garut, menghitung kebutuhan kabel, serta memberikan rekomendasi paket kamera analog atau IP Camera paling optimal.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/cctv"
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm text-center shadow-sm transition-colors"
            >
              Lihat Paket CCTV
            </Link>
            <button
              onClick={() => openBooking('cctv')}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm text-center shadow-md shadow-teal-600/20 transition-all hover:-translate-y-0.5"
            >
              Jadwalkan Survei Gratis
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2A. PAKET POPULER CCTV (3 PAKET + TOMBOL PILIH PAKET LAINNYA)
         ========================================================================= */}
      <PopularPackagesSection />

      {/* =========================================================================
          2B. BUKTI PORTOFOLIO CCTV GARUT
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Dokumentasi Hasil Pasang
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Portofolio Pengerjaan CCTV di Garut
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Kerapihan tarikan kabel, penataan kamera presisi, dan kepuasan pemilik rumah serta usaha di Garut.
            </p>
          </div>

          <Link
            href="/portofolio"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-700/20 transition-all flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>Lihat Semua Portofolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {portfolios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolios.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/90 text-white uppercase">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500 text-slate-950">
                        {item.camera_count} Kamera
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 line-clamp-1 group-hover:text-teal-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href="/portofolio"
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Buka Detail Proyek</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          3. CERTIFICATE SHOWCASE (SLIDING & ZOOM IN / OUT)
         ========================================================================= */}
      <CertificateSection />

      {/* =========================================================================
          4. KENAPA PILIH ACUUY CCTV GARUT
         ========================================================================= */}
      <section className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-full border border-teal-500/30">
                Nilai & Kepercayaan
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                Kenapa Warga & Pengusaha Garut Memilih Acuuy CCTV?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Kami berkomitmen memberikan kenyamanan dan rasa aman melalui transparansi biaya,
                ketepatan pengerjaan, dan pelayanan purnajual yang selalu siap siaga.
              </p>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 transition-all"
                >
                  <PhoneCall className="w-4 h-4" /> Hubungi CS Toko di Garut
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Garansi Jelas & Tertulis</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Semua unit laptop bekas dan pengerjaan servis kami lindungi dengan garansi toko 1
                  bulan penuh demi kepuasan Anda.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Respon Cepat via WhatsApp</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Konsultasi, konfirmasi jadwal survei CCTV, hingga update pengerjaan servis langsung
                  dibantu admin kami melalui WhatsApp.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Workshop Fisik di Garut</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Memiliki toko fisik resmi di Jl. Dayeuhandap No.35, Garut Kota. Mudah dikunjungi untuk cek unit
                  laptop langsung atau serah-terima perbaikan.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Teknisi Ramah & Solutif</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Dikerjakan oleh teknisi berpengalaman yang memberikan opsi solusi paling efisien
                  tanpa biaya tersembunyi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. HOW IT WORKS (ALUR MUDAH)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Alur Pemesanan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Hanya 3 Langkah Mudah
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Proses pemesanan jasa maupun jual-beli laptop dibuat ringkas dan nyaman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-3 relative">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white text-lg font-black flex items-center justify-center mx-auto shadow-md shadow-teal-600/30">
              1
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Pilih Layanan & Isi Formulir</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tentukan layanan CCTV, Servis, Konsultasi, atau pilih unit laptop bekas yang Anda incar.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-3 relative">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white text-lg font-black flex items-center justify-center mx-auto shadow-md shadow-teal-600/30">
              2
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Konfirmasi & Penjadwalan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dapatkan Nomor Order unik dan konfirmasi cepat via WhatsApp untuk penentuan jadwal
              survei atau estimasi biaya.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-3 relative">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white text-lg font-black flex items-center justify-center mx-auto shadow-md shadow-teal-600/30">
              3
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Pengerjaan & Garansi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Teknisi mengerjakan sesuai standar terbaik, rapi, transparan, dan
              nikmati garansi toko.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        defaultService={selectedService}
      />
    </div>
  );
}
