'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Network,
  Server,
  ShieldAlert,
  Building2,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Sparkles,
  Camera,
  Wrench,
  Laptop,
  MapPin,
} from 'lucide-react';
import BookingModal from '@/components/booking/BookingModal';

export default function KonsultasiPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');

  const topics = [
    {
      icon: Network,
      title: 'Infrastruktur Jaringan Wi-Fi & LAN',
      desc: 'Penarikan kabel LAN antarlantai, setup router Mikrotik, manajemen bandwidth karyawan/tamu, dan penguat sinyal Access Point.',
      suitableFor: 'Kafe, Restoran, Kantor, Sekolah',
    },
    {
      icon: Server,
      title: 'Local File Server & Backup Data',
      desc: 'Perancangan penyimpanan terpusat (NAS / File Server) agar dokumen penting dapat diakses bersama dengan izin hak akses aman.',
      suitableFor: 'Klinik Kesehatan, Lembaga Notaris, Perusahaan',
    },
    {
      icon: Building2,
      title: 'Pengadaan Hardware Komputer Kantor',
      desc: 'Konsultasi pemilihan spesifikasi PC kasir, laptop administrasi, hingga workstation desain/editing sesuai anggaran efisien.',
      suitableFor: 'UMKM Baru, Toko Ritel, Kantor Cabang',
    },
    {
      icon: ShieldAlert,
      title: 'Kontrak Maintenance IT Berkala',
      desc: 'Layanan kunjungan teknisi rutin bulanan untuk cek kesehatan PC, keamanan jaringan, pembersihan fisik, dan troubleshooting cepat.',
      suitableFor: 'Instansi & Bisnis yang Ingin Bebas Masalah IT',
    },
  ];

  const handleBookTopic = (title: string) => {
    setSelectedTopic(title);
    setModalOpen(true);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Header */}
      <section className="relative py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" /> Konsultan Teknologi Informasi Garut
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Infrastruktur IT Rapi & Andal untuk Kelancaran Bisnis Anda.
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Fokus kembangkan bisnis Anda di Garut tanpa pusing dengan masalah internet putus-nyambung,
              data kantor hilang, atau sistem komputer bermasalah. Kami hadir sebagai partner IT
              terpercaya Anda.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Jadwalkan Sesi Konsultasi
              </button>
              <a
                href="https://wa.me/6285158722545?text=Halo%20Acuuy%20CCTV,%20saya%20ingin%20konsultasi%20jaringan%20IT%20kantor%20di%20Garut"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 active:scale-95 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-teal-400" /> Diskusi Cepat via WA
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bidang Konsultasi & Implementasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Solusi tepat guna yang disesuaikan dengan skala usaha dan anggaran Anda di Garut.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                    <span className="font-semibold text-slate-500">Cocok untuk: </span>
                    <span className="font-bold text-teal-800">{item.suitableFor}</span>
                  </div>
                </div>

                <div className="pt-6 mt-4">
                  <button
                    onClick={() => handleBookTopic(item.title)}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Ajukan Konsultasi Bidang Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Internal Links to Core Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 space-y-6">
          <div className="max-w-2xl space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Layanan Lainnya dari Acuuy CCTV Garut
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Selain konsultasi jaringan & infrastruktur IT, kami juga melayani pemasangan CCTV,
              servis perangkat, hingga jual beli laptop bergaransi di Garut.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/cctv"
              className="group rounded-2xl bg-white/5 hover:bg-teal-500/15 border border-white/10 hover:border-teal-400/50 p-4 transition-all flex items-start gap-3"
            >
              <Camera className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-white group-hover:text-teal-300 flex items-center gap-1">
                  Jasa Pasang & Instalasi CCTV Garut <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paket 2–16 kamera HD/IP bergaransi & online di HP.
                </p>
              </div>
            </Link>

            <Link
              href="/servis"
              className="group rounded-2xl bg-white/5 hover:bg-teal-500/15 border border-white/10 hover:border-teal-400/50 p-4 transition-all flex items-start gap-3"
            >
              <Wrench className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-white group-hover:text-teal-300 flex items-center gap-1">
                  Servis Laptop & Komputer Garut <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Perbaikan cepat, upgrade SSD/RAM, dan garansi jelas.
                </p>
              </div>
            </Link>

            <Link
              href="/portofolio"
              className="group rounded-2xl bg-white/5 hover:bg-teal-500/15 border border-white/10 hover:border-teal-400/50 p-4 transition-all flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-white group-hover:text-teal-300 flex items-center gap-1">
                  Portofolio Pemasangan CCTV <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dokumentasi proyek rumah, ruko, dan kantor di Garut.
                </p>
              </div>
            </Link>

            <Link
              href="/katalog"
              className="group rounded-2xl bg-white/5 hover:bg-teal-500/15 border border-white/10 hover:border-teal-400/50 p-4 transition-all flex items-start gap-3"
            >
              <Laptop className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-white group-hover:text-teal-300 flex items-center gap-1">
                  Katalog Laptop Bekas Garut <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Unit siap pakai, lolos QC ketat, bergaransi toko.
                </p>
              </div>
            </Link>

            <Link
              href="/jual-laptop"
              className="group rounded-2xl bg-white/5 hover:bg-teal-500/15 border border-white/10 hover:border-teal-400/50 p-4 transition-all flex items-start gap-3"
            >
              <Building2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-white group-hover:text-teal-300 flex items-center gap-1">
                  Jual / Trade-In Laptop Bekas <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Taksiran harga transparan & cair cepat di workshop.
                </p>
              </div>
            </Link>

            <Link
              href="/kontak"
              className="group rounded-2xl bg-white/5 hover:bg-teal-500/15 border border-white/10 hover:border-teal-400/50 p-4 transition-all flex items-start gap-3"
            >
              <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-white group-hover:text-teal-300 flex items-center gap-1">
                  Kontak & Lokasi Toko Garut <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Jl. Dayeuhandap No.35, Kota Kulon, Garut Kota.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultService="konsultasi_it"
        presetDetails={{ consultation_topic: selectedTopic }}
      />
    </div>
  );
}
