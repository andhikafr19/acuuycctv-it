'use client';

import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Cpu,
  Monitor,
  Flame,
  Zap,
  PhoneCall,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import BookingModal from '@/components/booking/BookingModal';

export default function ServisPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState('');

  const services = [
    {
      icon: Zap,
      title: 'Mati Total & Short Motherboard',
      desc: 'Perbaikan sirkuit power, IC charging, laptop tidak mau hidup sama sekali, atau tersiram cairan.',
      estimate: '1-3 Hari Pengerjaan',
      warranty: 'Garansi 1 Bulan',
    },
    {
      icon: Flame,
      title: 'Overheat & Cleaning Fan',
      desc: 'Pembersihan debu kipas, penggantian thermal paste Arctic MX premium, mengatasi laptop cepat panas dan mati sendiri.',
      estimate: 'Bisa Ditunggu (1-2 Jam)',
      warranty: 'Garansi Suhu Stabil',
    },
    {
      icon: HardDrive,
      title: 'Upgrade SSD & Tambah RAM',
      desc: 'Tingkatkan kecepatan laptop lemot hingga 10x lipat dengan SSD NVMe/SATA dan RAM Dual-Channel.',
      estimate: 'Bisa Ditunggu (1 Jam)',
      warranty: 'Garansi SSD 3 Tahun',
    },
    {
      icon: Monitor,
      title: 'Ganti Layar LCD Laptop',
      desc: 'Penggantian panel layar pecah, bergaris vertikal, layar blank putih, atau flickering.',
      estimate: '1 Hari Kerja',
      warranty: 'Garansi Panel Baru 1 Bulan',
    },
    {
      icon: Cpu,
      title: 'Keyboard & Touchpad Error',
      desc: 'Tombol mengetik sendiri, huruf mati, atau trackpad tidak merespons pada berbagai merk laptop.',
      estimate: '1 Hari Kerja',
      warranty: 'Garansi Keyboard Baru',
    },
    {
      icon: ShieldCheck,
      title: 'Instal Ulang OS & Hapus Virus',
      desc: 'Instalasi Windows 10/11 Pro, aktivasi resmi, driver hardware terbaru, dan paket software siap kerja.',
      estimate: 'Bisa Ditunggu (2-3 Jam)',
      warranty: 'Garansi Software & Data Aman',
    },
  ];

  const handleBookService = (title: string) => {
    setSelectedServiceTitle(title);
    setModalOpen(true);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Header */}
      <section className="relative py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <Wrench className="w-3.5 h-3.5" /> Servis Laptop & Komputer Garut
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Servis Cepat, Diagnosa Jujur, & Bergaransi Toko.
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Komputer atau laptop Anda bermasalah? Tim teknisi hardware Acuuy CCTV siap membantu
              perbaikan motherboard, ganti sparepart original, hingga upgrade performa komputer
              kantor di Garut.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Ajukan Servis Sekarang
              </button>
              <a
                href="https://wa.me/6285223344556?text=Halo%20Acuuy%20CCTV,%20laptop%20saya%20rusak%20mau%20konsultasi%20biaya%20servis"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 active:scale-95 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-teal-400" /> Konsultasi Kerusakan Gratis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Penanganan Masalah Komputer & Laptop
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Daftar penanganan kerusakan yang biasa kami tangani di workshop Garut.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => {
            const IconComp = srv.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{srv.desc}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1 text-xs">
                    <span className="font-semibold text-slate-700">⏱ {srv.estimate}</span>
                    <span className="text-teal-700 font-bold">🛡 {srv.warranty}</span>
                  </div>
                </div>

                <div className="pt-5 mt-4">
                  <button
                    onClick={() => handleBookService(srv.title)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Ajukan Servis Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultService="servis_komputer"
        presetDetails={{ requested_service: selectedServiceTitle }}
      />
    </div>
  );
}
