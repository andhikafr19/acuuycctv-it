'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Camera,
  MapPin,
  Calendar,
  CheckCircle2,
  Star,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  Eye,
  X,
  PhoneCall,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { Portfolio, StoreSettings } from '@/lib/types';
import { getStoreAll } from '@/lib/store';
import BookingModal from '@/components/booking/BookingModal';
import { formatWaPhone } from '@/lib/whatsapp';

export default function PortofolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<Portfolio | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    getStoreAll().then((d) => {
      setPortfolios(d.portfolios || []);
      setSettings(d.settings);
    });
  }, []);

  const categories = [
    { id: 'all', label: 'Semua Proyek' },
    { id: 'toko', label: 'Toko, Kafe & Ruko' },
    { id: 'rumah', label: 'Rumah & Perumahan' },
    { id: 'kantor', label: 'Kantor & Fasilitas Kesehatan' },
    { id: 'gudang', label: 'Gudang & Industri' },
  ];

  const filtered = portfolios.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  const waNumber = settings ? formatWaPhone(settings.whatsapp_number) : '6285223344556';

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Header */}
      <section className="relative py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <Camera className="w-3.5 h-3.5" /> Bukti Pengerjaan Lapangan di Garut
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Portofolio Instalasi & Kerapihan CCTV
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Lihat langsung hasil dokumentasi pemasangan kamera pengawas kami di berbagai titik rumah,
              toko, kafe, klinik, dan pergudangan di seluruh wilayah Kabupaten Garut. Tarikan kabel
              rapi, presisi, dan gambar tajam 24 jam.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setBookingModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Jadwalkan Survei Lokasi Gratis
              </button>
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                  'Halo Acuuy CCTV, saya melihat portofolio pemasangan CCTV dan ingin konsultasi untuk tempat saya di Garut'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 active:scale-95 transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-teal-400" /> Tanya Rekomendasi Kamera
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-700/20 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Photo Container */}
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badge Category */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-slate-900/90 text-white shadow-md backdrop-blur-sm uppercase">
                      {item.category}
                    </span>
                  </div>

                  {/* Badge Camera Count */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-teal-500 text-slate-950 shadow-md">
                      {item.camera_count} Titik Kamera
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.location}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-medium">
                    <span className="text-slate-400 block mb-0.5 font-bold uppercase text-[9px]">
                      Tipe Perangkat:
                    </span>
                    {item.camera_type}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Testimonial Quote */}
                  {item.testimonial && (
                    <div className="pt-3 border-t border-slate-100 space-y-1.5">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(item.testimonial.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-[11px] italic text-slate-500 line-clamp-2">
                        "{item.testimonial.review}"
                      </p>
                      <span className="text-[10px] font-bold text-slate-700 block">
                        — {item.testimonial.client_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Lihat Detail Dokumentasi</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] bg-slate-100 relative">
              <img
                src={selectedItem.images[0]}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white uppercase">
                  {selectedItem.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500 text-slate-950">
                  {selectedItem.camera_count} Titik Kamera
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs text-teal-700 font-bold">
                <MapPin className="w-4 h-4" />
                <span>{selectedItem.location}</span>
                <span className="text-slate-300">•</span>
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">{selectedItem.completion_date}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {selectedItem.title}
              </h2>

              <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100 text-xs space-y-1">
                <span className="font-bold text-teal-900 block">Spesifikasi Instalasi:</span>
                <p className="text-teal-800">{selectedItem.camera_type}</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedItem.description}
              </p>

              {selectedItem.testimonial && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(selectedItem.testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs italic text-slate-700">
                    "{selectedItem.testimonial.review}"
                  </p>
                  <span className="text-xs font-bold text-slate-900 block">
                    — {selectedItem.testimonial.client_name} (Klien Acuuy CCTV)
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setBookingModalOpen(true);
                  }}
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ajukan Pemasangan Mirip Proyek Ini</span>
                </button>

                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                    `Halo Acuuy CCTV, saya tertarik dengan instalasi ${selectedItem.title} di ${selectedItem.location}. Mohon info biaya untuk tempat saya.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Tanya Admin WA</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Conversion Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center max-w-4xl mx-auto space-y-5 shadow-2xl">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 bg-teal-500/15 px-3.5 py-1.5 rounded-full border border-teal-500/30">
            Jaminan Kualitas & Kerapihan
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ingin Rumah atau Tempat Usaha Anda Terlindungi dengan Rapi?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Konsultasikan titik rawan properti Anda bersama teknisi berpengalaman Acuuy CCTV Garut.
            Survei lokasi gratis untuk wilayah Garut Kota dan sekitarnya!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => setBookingModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-xl active:scale-95 transition-all"
            >
              Ajukan Jadwal Survei Lokasi
            </button>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                'Halo Acuuy CCTV, saya mau tanya paket pasang CCTV di Garut'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 active:scale-95 transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-teal-400" />
              Chat WhatsApp CS Garut
            </a>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        defaultService="cctv"
      />
    </div>
  );
}
