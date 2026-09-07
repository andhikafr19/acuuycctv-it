'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Laptop as LaptopIcon,
  CheckCircle2,
  Phone,
  User,
  DollarSign,
  Tag,
  FileText,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { submitSellSubmission } from '@/lib/store';
import { SellSubmission } from '@/lib/types';

export default function JualLaptopPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [brand, setBrand] = useState('Lenovo');
  const [model, setModel] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [condition, setCondition] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<SellSubmission | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !model || !specifications || !expectedPrice) {
      alert('Mohon isi seluruh data pengajuan yang bertanda bintang (*)');
      return;
    }

    setIsSubmitting(true);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    const submissionNumber = `SELL-${dateStr}-${rand}`;

    const res = await submitSellSubmission({
      submission_number: submissionNumber,
      customer_name: name,
      customer_phone: phone,
      brand,
      model,
      specifications,
      condition_description: condition || 'Kondisi normal pemakaian wajar',
      expected_price: Number(expectedPrice),
    });

    setIsSubmitting(false);
    if (res.success && res.data) {
      setSubmittedData(res.data);
    } else {
      alert('Gagal mengirimkan pengajuan: ' + (res.error || 'Silakan coba lagi.'));
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="relative py-14 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <LaptopIcon className="w-3.5 h-3.5" /> Jual / Trade-In Laptop di Garut
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Punya Laptop Tak Terpakai? Jual ke Toko Kami!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kami menerima laptop bekas normal maupun minus ringan untuk berbagai brand (ThinkPad,
              Asus, Acer, HP, Dell, MacBook). Penaksiran harga jujur dan pembayaran tunai langsung di
              toko.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Pengajuan */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
            {submittedData ? (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                    Nomor Pengajuan Penjualan
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-teal-700 font-mono mt-1 bg-teal-50 py-2 rounded-xl border border-teal-200">
                    {submittedData.submission_number}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Data laptop Anda berhasil masuk ke antrean tim penilai Acuuy CCTV Garut.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unit:</span>
                    <span className="font-bold text-slate-800">
                      {submittedData.brand} {submittedData.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ekspektasi Harga:</span>
                    <span className="font-bold text-teal-700">
                      Rp {Number(submittedData.expected_price).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`https://wa.me/6285223344556?text=${encodeURIComponent(
                      `Halo Admin Acuuy CCTV, saya baru saja mengajukan jual laptop (${submittedData.submission_number}): ${submittedData.brand} ${submittedData.model} ekspektasi Rp ${Number(
                        submittedData.expected_price
                      ).toLocaleString('id-ID')}. Mohon info penaksirannya ya!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Kirim Info Foto & Chat Admin WhatsApp
                  </a>
                </div>

                <button
                  onClick={() => setSubmittedData(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline"
                >
                  Ajukan Unit Laptop Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-2">
                  <h3 className="text-lg font-black text-slate-900">Form Penaksiran Laptop</h3>
                  <p className="text-xs text-slate-500">
                    Isi spesifikasi unit laptop yang ingin Anda jual atau tukar tambah.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Merk Laptop <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full text-xs font-semibold rounded-xl border border-slate-200 px-3 py-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="Lenovo">Lenovo</option>
                      <option value="Asus">Asus</option>
                      <option value="HP">HP</option>
                      <option value="Dell">Dell</option>
                      <option value="Acer">Acer</option>
                      <option value="Apple">Apple / MacBook</option>
                      <option value="MSI">MSI</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Model / Tipe Laptop <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: ThinkPad X270 / TUF FX505"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Spesifikasi Utama (Processor, RAM, Penyimpanan){' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Core i5 Gen 7, RAM 8GB DDR4, SSD 256GB"
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kondisi Fisik & Kelengkapan
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Bodi 90% mulus, baterai tahan 2 jam, kelengkapan unit + charger ori (ada minus layar white spot tipis)"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ekspektasi Harga Jual (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 2500000"
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Anda <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      No. WhatsApp Anda <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="08xxxxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-slate-900 hover:from-teal-700 hover:to-black text-white font-extrabold text-sm shadow-lg shadow-teal-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Memproses Pengajuan...</span>
                    ) : (
                      <>
                        <span>Ajukan Penaksiran Laptop</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    Admin kami akan segera memeriksa kecocokan unit dan menghubungi Anda via WhatsApp.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
                Keuntungan Jual di Acuuy
              </span>
              <h3 className="text-xl font-black">Proses Cepat, Tanpa Ribet COD Jalanan</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Jual langsung ke toko fisik kami di Tarogong Kidul, Garut. Dites bersama, harga
                disepakati, dan uang langsung cair hari itu juga.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-200">
                    Menerima unit normal maupun ada minus (keyboard/baterai drop)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-200">
                    Bisa tukar tambah (Trade-In) langsung ke unit laptop display toko
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-200">
                    Data pribadi di laptop lama kami bantu hapus / wipe aman
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 text-xs text-slate-600 space-y-3">
              <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-600" /> Tips Agar Harga Taksiran Tinggi:
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                <li>Bawa charger original bawaan unit</li>
                <li>Bersihkan bodi dan layar laptop dari stiker berlebih</li>
                <li>Pastikan akun Google / Apple / Microsoft sudah logout</li>
                <li>Bawa dusbox / tas jika masih tersimpan</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
