'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  Camera,
  HelpCircle,
  Phone,
  User,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { getOrderByNumber } from '@/lib/store';

function LacakContent() {
  const searchParams = useSearchParams();
  const initialOrderParam = searchParams.get('order') || '';

  const [inputOrderNumber, setInputOrderNumber] = useState(initialOrderParam);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialOrderParam) {
      handleSearch(initialOrderParam);
    }
  }, [initialOrderParam]);

  const handleSearch = async (orderNum: string) => {
    const trimmed = orderNum.trim();
    if (!trimmed) return;

    setLoading(true);
    setErrorMsg('');
    setSearched(true);

    const order = await getOrderByNumber(trimmed);
    setLoading(false);

    if (order) {
      setCurrentOrder(order);
    } else {
      setCurrentOrder(null);
      setErrorMsg(
        'Nomor pesanan tidak ditemukan. Pastikan format nomor order sudah benar (contoh: ACY-CCTV-260907-001).'
      );
    }
  };

  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    {
      status: 'baru',
      label: 'Order Diterima',
      desc: 'Pesanan masuk ke sistem dan menunggu validasi admin',
    },
    {
      status: 'dikonfirmasi',
      label: 'Dikonfirmasi',
      desc: 'Admin telah mengonfirmasi kebutuhan via WhatsApp / Telepon',
    },
    {
      status: 'dijadwalkan',
      label: 'Dijadwalkan',
      desc: 'Teknisi telah ditugaskan dan jadwal pengerjaan telah disepakati',
    },
    {
      status: 'dikerjakan',
      label: 'Sedang Dikerjakan',
      desc: 'Pemasangan kabel/kamera atau reparasi fisik sedang berlangsung',
    },
    {
      status: 'selesai',
      label: 'Selesai',
      desc: 'Pekerjaan selesai, unit siap digunakan atau diambil di toko',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'dibatalkan') return -1;
    const idx = steps.findIndex((s) => s.status === status);
    return idx === -1 ? 0 : idx;
  };

  const activeIndex = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="relative py-14 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" /> Pelacakan Real-Time
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Lacak Status Pengerjaan Pesanan
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ketahui tahapan pengerjaan instalasi CCTV atau servis komputer Anda secara transparan.
              Cukup masukkan nomor order yang Anda terima saat memesan.
            </p>
          </div>
        </div>
      </section>

      {/* Main Search Input */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-md">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Masukkan Nomor Pesanan Anda
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Contoh: ACY-CCTV-260907-001 atau ACY-SRV-..."
                value={inputOrderNumber}
                onChange={(e) => setInputOrderNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch(inputOrderNumber);
                }}
                className="w-full text-sm font-semibold rounded-2xl border border-slate-200 pl-11 pr-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => handleSearch(inputOrderNumber)}
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Mencari...' : 'Lacak Sekarang'}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span>Contoh cepat demo:</span>
            <button
              onClick={() => {
                setInputOrderNumber('ACY-CCTV-260907-001');
                handleSearch('ACY-CCTV-260907-001');
              }}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-700 font-mono"
            >
              ACY-CCTV-260907-001
            </button>
            <button
              onClick={() => {
                setInputOrderNumber('ACY-SRV-260907-002');
                handleSearch('ACY-SRV-260907-002');
              }}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-700 font-mono"
            >
              ACY-SRV-260907-002
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Result Card */}
        {currentOrder && (
          <div className="mt-8 bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header Result */}
            <div className="bg-slate-900 p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-teal-400">
                  Detail Pesanan
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-mono mt-0.5">
                  {currentOrder.order_number}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Dibuat pada: {new Date(currentOrder.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Status Terkini
                </span>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                    currentOrder.status === 'selesai'
                      ? 'bg-emerald-500 text-white'
                      : currentOrder.status === 'dibatalkan'
                      ? 'bg-rose-500 text-white'
                      : 'bg-teal-500 text-slate-950'
                  }`}
                >
                  {currentOrder.status}
                </span>
              </div>
            </div>

            {/* Stepper Progress */}
            {currentOrder.status !== 'dibatalkan' ? (
              <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-6">
                  Tahapan Pengerjaan
                </h4>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-4 right-4 h-1 bg-slate-200 -z-0 hidden md:block" />

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                    {steps.map((step, idx) => {
                      const isCompleted = idx <= activeIndex;
                      const isCurrent = idx === activeIndex;

                      return (
                        <div key={idx} className="flex md:flex-col items-center md:text-center gap-3 md:gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors shadow-sm ${
                              isCompleted
                                ? 'bg-teal-600 text-white shadow-teal-600/30'
                                : 'bg-slate-200 text-slate-500'
                            } ${isCurrent ? 'ring-4 ring-teal-200' : ''}`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <div>
                            <div
                              className={`text-xs font-extrabold ${
                                isCurrent ? 'text-teal-700' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </div>
                            <div className="text-[10px] text-slate-500 hidden md:block mt-0.5 leading-snug">
                              {step.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-rose-50 border-b border-rose-100 text-rose-800 text-xs">
                Pesanan ini berstatus <strong>Dibatalkan</strong>. Silakan hubungi admin via WhatsApp
                jika Anda memerlukan klarifikasi.
              </div>
            )}

            {/* Order Details Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100">
                  Informasi Pemesan
                </h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-900">{currentOrder.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentOrder.customer_phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                    <span>
                      {currentOrder.address} ({currentOrder.city})
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="font-bold text-slate-900 block mb-1">Deskripsi Kebutuhan:</span>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-600 leading-relaxed">
                    {currentOrder.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100">
                  Petugas & Estimasi
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">Teknisi Bertugas:</span>
                    <span className="font-bold text-teal-800">
                      {currentOrder.technician_name || 'Menunggu Penugasan'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">Estimasi Biaya:</span>
                    <span className="font-bold text-slate-900">
                      {currentOrder.estimated_cost > 0
                        ? `Rp ${currentOrder.estimated_cost.toLocaleString('id-ID')}`
                        : 'Menunggu Diagnosa Awal'}
                    </span>
                  </div>

                  {currentOrder.admin_notes && (
                    <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100">
                      <span className="font-bold text-teal-900 block mb-0.5">Catatan Teknisi:</span>
                      <p className="text-teal-800">{currentOrder.admin_notes}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3">
                  <a
                    href={`https://wa.me/6285158722545?text=${encodeURIComponent(
                      `Halo Admin Acuuy CCTV, saya ingin menanyakan perkembangan order ${currentOrder.order_number} (${currentOrder.customer_name})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Tanya Admin via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function LacakPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Memuat halaman pelacakan...</div>}>
      <LacakContent />
    </Suspense>
  );
}
