'use client';

import React, { useState, useEffect } from 'react';
import { X, Camera, CheckCircle2 } from 'lucide-react';
import { Portfolio } from '@/lib/types';
import { savePortfolioAction } from '@/lib/store';

interface PortfolioModalProps {
  portfolio: Portfolio | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function PortfolioModal({
  portfolio,
  isOpen,
  onClose,
  onSaved,
}: PortfolioModalProps) {
  if (!isOpen) return null;

  const [title, setTitle] = useState(portfolio?.title || '');
  const [category, setCategory] = useState<'rumah' | 'toko' | 'kantor' | 'gudang'>(
    portfolio?.category || 'toko'
  );
  const [location, setLocation] = useState(portfolio?.location || 'Tarogong Kidul, Garut');
  const [cameraCount, setCameraCount] = useState(portfolio?.camera_count || 4);
  const [cameraType, setCameraType] = useState(
    portfolio?.camera_type || 'IP Camera 4MP ColorVu + Audio 24 Jam'
  );
  const [completionDate, setCompletionDate] = useState(
    portfolio?.completion_date || new Date().toISOString().split('T')[0]
  );
  const [imageUrl, setImageUrl] = useState(
    portfolio?.images?.[0] ||
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80'
  );
  const [description, setDescription] = useState(portfolio?.description || '');
  const [clientName, setClientName] = useState(portfolio?.testimonial?.client_name || '');
  const [review, setReview] = useState(portfolio?.testimonial?.review || '');

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !cameraCount) {
      alert('Mohon lengkapi judul proyek, lokasi di Garut, dan jumlah kamera');
      return;
    }

    setIsSaving(true);
    const data: Partial<Portfolio> = {
      ...(portfolio?.id ? { id: portfolio.id } : {}),
      title,
      category,
      location,
      camera_count: Number(cameraCount),
      camera_type: cameraType,
      completion_date: completionDate,
      images: [imageUrl],
      description,
      testimonial: clientName
        ? {
            client_name: clientName,
            review: review || 'Pemasangan rapi dan hasil kamera memuaskan.',
            rating: 5,
          }
        : undefined,
    };

    const res = await savePortfolioAction(data);
    setIsSaving(false);

    if (res.success) {
      onSaved();
      onClose();
    } else {
      alert('Gagal menyimpan portofolio: ' + res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black">
                {portfolio ? 'Edit Dokumentasi CCTV' : 'Tambah Portofolio CCTV Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Akan langsung tampil di halaman Portofolio Web Publik `landing-it`
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nama Proyek / Tempat <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Pemasangan Paket 8 Kamera di Toko Berkah"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Lokasi</label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as 'rumah' | 'toko' | 'kantor' | 'gudang')
                }
                className="w-full rounded-xl border border-slate-300 p-2.5 bg-white font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="toko">Toko, Kafe & Ruko</option>
                <option value="rumah">Rumah & Perumahan</option>
                <option value="kantor">Kantor & Fasilitas Kesehatan</option>
                <option value="gudang">Gudang & Industri</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Lokasi di Garut <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Tarogong Kidul, Garut"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jumlah Titik Kamera <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={cameraCount}
                onChange={(e) => setCameraCount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-teal-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Selesai</label>
              <input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Spesifikasi Kamera</label>
            <input
              type="text"
              placeholder="Contoh: IP Camera 4MP ColorVu + Audio 24 Jam"
              value={cameraType}
              onChange={(e) => setCameraType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">URL Foto Hasil Pasang</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deskripsi Pengerjaan</label>
            <textarea
              rows={3}
              placeholder="Jelaskan kerapihan kabel, jalur pipa conduit, area yang diawasi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
            />
          </div>

          {/* Testimonial */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="font-bold text-slate-800 block">Ulasan / Testimoni Klien (Opsional)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nama Klien (cth: Bpk. Rahmat)"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Isi Ulasan Singkat"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Portofolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
