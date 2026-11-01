'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Camera,
  Wrench,
  HelpCircle,
  Laptop as LaptopIcon,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  MapPin,
  Sparkles,
  PhoneCall,
  Activity,
  HardDrive,
  Users,
} from 'lucide-react';
import { StoreSettings, Laptop, ServiceType, Portfolio } from '@/lib/types';
import { getStoreAll } from '@/lib/store';
import { formatWaPhone } from '@/lib/whatsapp';
import { BUSINESS } from '@/lib/business';
import BookingModal from '@/components/booking/BookingModal';
import LaptopCard from '@/components/laptop/LaptopCard';
import LaptopDetailModal from '@/components/laptop/LaptopDetailModal';

export default function HomePage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>('cctv');
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(null);

  useEffect(() => {
    getStoreAll().then((data) => {
      setSettings(data.settings);
      setLaptops(data.laptops.slice(0, 4));
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
          2. 4 PILAR LAYANAN UTAMA
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200">
            Pilar Layanan
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Penuhi Semua Kebutuhan Teknologi Anda di Satu Tempat
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Dari instalasi kamera pengawas hingga upgrade hardware laptop, tim teknisi kami siap
            membantu kebutuhan personal maupun instansi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. CCTV */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                Jasa Pasang CCTV Garut
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pemasangan kamera CCTV indoor/outdoor untuk rumah, toko kelontong, ruko, gudang,
                sekolah di Garut. Pantau langsung dari HP Android / iPhone.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Kamera Night Vision & Audio
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Paket 2, 4, 8, 16 Kamera
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Kerapihan Kabel Berstandar
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/cctv"
                className="text-xs font-bold text-slate-700 hover:text-teal-700 flex items-center gap-1"
              >
                Detail Info <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => openBooking('cctv')}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
              >
                Pesan Jasa
              </button>
            </div>
          </div>

          {/* 2. Servis Komputer */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                Servis Komputer & Laptop
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Perbaikan laptop mati total, kena air, ganti layar LCD pecah, ganti keyboard, kipas
                panas berisik, instal ulang OS, dan upgrade performa SSD/RAM.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Diagnosa Awal Gratis & Jelas
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Estimasi Biaya Sebelum Kerja
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Garansi Servis 1 Bulan
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/servis"
                className="text-xs font-bold text-slate-700 hover:text-teal-700 flex items-center gap-1"
              >
                Detail Info <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => openBooking('servis_komputer')}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
              >
                Pesan Servis
              </button>
            </div>
          </div>

          {/* 3. Jual Beli Laptop Bekas */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <LaptopIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                Laptop Bekas Berkualitas
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Katalog laptop bekas siap pakai (ThinkPad, ASUS TUF, Dell, HP) dengan kondisi prima,
                sudah terinstal aplikasi lengkap, dan menerima tukar-tambah / jual laptop lama Anda.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Grade A / B Transparan
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Baterai Sehat & Charger Original
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Terima Jual / Trade-In
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/katalog"
                className="text-xs font-bold text-slate-700 hover:text-teal-700 flex items-center gap-1"
              >
                Buka Katalog <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/jual-laptop"
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
              >
                Jual Laptop
              </Link>
            </div>
          </div>

          {/* 4. Konsultasi IT */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                Konsultasi IT & Jaringan
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Jasa perancangan infrastruktur jaringan kantor, pembagian bandwidth Wi-Fi Mikrotik,
                setup file sharing lokal, dan pengadaan perangkat komputer instansi.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Solusi Jaringan Cepat & Stabil
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Perangkat Router & Switchboard
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Maintenance Rutin Bulanan
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/konsultasi"
                className="text-xs font-bold text-slate-700 hover:text-teal-700 flex items-center gap-1"
              >
                Detail Info <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => openBooking('konsultasi_it')}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
              >
                Konsultasi
              </button>
            </div>
          </div>
        </div>
      </section>

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
          3. FEATURED LAPTOP SHOWCASE
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Katalog Pilihan Garut
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Laptop Bekas Bergaransi Siap Pakai
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Unit telah lolos pengujian 20 titik fungsi hardware. Bebas pilih spek sesuai kebutuhan
              kantor, kuliah, atau gaming.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/jual-laptop"
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold transition-colors"
            >
              Mau Jual Laptop Anda?
            </Link>
            <Link
              href="/katalog"
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-700/20 transition-all flex items-center gap-1.5"
            >
              <span>Lihat Semua Unit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {settings && laptops.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {laptops.map((lap) => (
              <LaptopCard
                key={lap.id}
                laptop={lap}
                settings={settings}
                onOpenDetail={(item) => setSelectedLaptop(item)}
              />
            ))}
          </div>
        )}
      </section>

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

      {/* Laptop Detail Modal */}
      {settings && (
        <LaptopDetailModal
          laptop={selectedLaptop}
          settings={settings}
          onClose={() => setSelectedLaptop(null)}
        />
      )}
    </div>
  );
}
