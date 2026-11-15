'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, CheckCircle2, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { Portfolio } from '@/lib/types';
import { savePortfolioAction, uploadPortfolioImageAction } from '@/lib/store';

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
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'rumah' | 'toko' | 'kantor' | 'gudang'>('toko');
  const [location, setLocation] = useState('Tarogong Kidul, Garut');
  const [cameraCount, setCameraCount] = useState(4);
  const [cameraType, setCameraType] = useState('IP Camera 4MP ColorVu + Audio 24 Jam');
  const [completionDate, setCompletionDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [review, setReview] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setUploadError('');
    if (portfolio) {
      setTitle(portfolio.title || '');
      setCategory(portfolio.category || 'toko');
      setLocation(portfolio.location || 'Tarogong Kidul, Garut');
      setCameraCount(portfolio.camera_count || 4);
      setCameraType(portfolio.camera_type || 'IP Camera 4MP ColorVu + Audio 24 Jam');
      setCompletionDate(portfolio.completion_date || new Date().toISOString().split('T')[0]);
      setImageUrl(portfolio.images?.[0] || '');
      setDescription(portfolio.description || '');
      setClientName(portfolio.testimonial?.client_name || '');
      setReview(portfolio.testimonial?.review || '');
    } else {
      setTitle('');
      setCategory('toko');
      setLocation('Tarogong Kidul, Garut');
      setCameraCount(4);
      setCameraType('IP Camera 4MP ColorVu + Audio 24 Jam');
      setCompletionDate(new Date().toISOString().split('T')[0]);
      setImageUrl('');
      setDescription('');
      setClientName('');
      setReview('');
    }
  }, [portfolio, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsUploading(true);
    const res = await uploadPortfolioImageAction(file);
    setIsUploading(false);

    if (res.success && res.url) {
      setImageUrl(res.url);
    } else {
      setUploadError(res.error || 'Gagal mengunggah file foto.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !cameraCount) {
      alert('Mohon lengkapi judul proyek, lokasi di Garut, dan jumlah kamera');
      return;
    }
    if (!imageUrl.trim()) {
      alert('Mohon upload foto hasil pemasangan terlebih dahulu.');
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
      images: [imageUrl.trim()],
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

          {/* Upload Foto Hasil Pasang */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              Foto Hasil Pemasangan <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              {/* Preview Box */}
              <div className="sm:col-span-5 aspect-[16/10] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title || 'Preview Foto Portofolio'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1.5 opacity-60" />
                    <p className="font-semibold text-[11px]">Belum ada foto</p>
                    <p className="text-[10px] mt-0.5">Rasio ideal landscape 16:10</p>
                  </div>
                )}

                {isUploading && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
                    <span className="text-[11px] font-bold">Mengunggah...</span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="sm:col-span-7 space-y-2.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                  id="portfolio-image-upload"
                />
                <label
                  htmlFor="portfolio-image-upload"
                  className={`flex flex-col items-center justify-center w-full p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                    isUploading
                      ? 'border-slate-200 bg-slate-50 pointer-events-none opacity-60'
                      : 'border-teal-300 bg-teal-50/50 hover:bg-teal-50 hover:border-teal-500'
                  }`}
                >
                  <Upload className="w-5 h-5 text-teal-600 mb-1.5" />
                  <span className="font-extrabold text-slate-800 text-xs">
                    {imageUrl ? 'Ganti Foto Pemasangan' : 'Pilih File Foto Pemasangan'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 text-center">
                    Format: JPG, PNG, WEBP, GIF (Maks. 5 MB)
                  </span>
                </label>

                {uploadError && (
                  <p className="text-rose-600 font-semibold text-[11px] bg-rose-50 border border-rose-200 rounded-xl p-2.5">
                    {uploadError}
                  </p>
                )}

                {imageUrl && (
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate font-medium">Foto siap disimpan</span>
                  </div>
                )}
              </div>
            </div>
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
              disabled={isSaving || isUploading}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold shadow-md active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Portofolio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
