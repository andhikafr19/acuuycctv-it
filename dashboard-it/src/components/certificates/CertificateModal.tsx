'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Award, Upload, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Certificate } from '@/lib/types';
import { saveCertificateAction, uploadCertificateImageAction } from '@/lib/store';

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function CertificateModal({
  certificate,
  isOpen,
  onClose,
  onSaved,
}: CertificateModalProps) {
  const [brand, setBrand] = useState('');
  const [title, setTitle] = useState('');
  const [tier, setTier] = useState('');
  const [issuer, setIssuer] = useState('');
  const [validPeriod, setValidPeriod] = useState('2025 – 2026');
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(10);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setUploadError('');
    if (certificate) {
      setBrand(certificate.brand || '');
      setTitle(certificate.title || '');
      setTier(certificate.tier || '');
      setIssuer(certificate.issuer || '');
      setValidPeriod(certificate.valid_period || '');
      setImageUrl(certificate.image_url || '');
      setSortOrder(certificate.sort_order ?? 10);
      setIsActive(certificate.is_active ?? true);
    } else {
      setBrand('');
      setTitle('');
      setTier('');
      setIssuer('');
      setValidPeriod('2025 – 2026');
      setImageUrl('');
      setSortOrder(10);
      setIsActive(true);
    }
  }, [certificate, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsUploading(true);
    const res = await uploadCertificateImageAction(file);
    setIsUploading(false);

    if (res.success && res.url) {
      setImageUrl(res.url);
    } else {
      setUploadError(res.error || 'Gagal mengunggah file gambar.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !title.trim()) {
      alert('Mohon lengkapi nama Brand dan Judul Sertifikat.');
      return;
    }
    if (!imageUrl.trim()) {
      alert('Mohon upload gambar sertifikat terlebih dahulu.');
      return;
    }

    setIsSaving(true);
    const payload: Partial<Certificate> = {
      ...(certificate?.id ? { id: certificate.id } : {}),
      brand: brand.trim().toUpperCase(),
      title: title.trim(),
      tier: tier.trim(),
      issuer: issuer.trim(),
      valid_period: validPeriod.trim(),
      image_url: imageUrl.trim(),
      sort_order: Number(sortOrder) || 10,
      is_active: isActive,
    };

    const res = await saveCertificateAction(payload);
    setIsSaving(false);

    if (res.success) {
      onSaved();
      onClose();
    } else {
      alert('Gagal menyimpan sertifikat: ' + (res.error || 'Terjadi kesalahan'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black">
                {certificate ? 'Edit Lisensi / Sertifikat' : 'Tambah Lisensi / Sertifikat'}
              </h3>
              <p className="text-xs text-slate-400">
                Upload gambar sertifikat resmi yang akan tampil di section Certificate landing page
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Upload Image Section */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              Gambar Sertifikat <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              {/* Preview Box */}
              <div className="sm:col-span-5 aspect-[5/7] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title || 'Preview Sertifikat'}
                    className="w-full h-full object-contain p-2 bg-white"
                  />
                ) : (
                  <div className="text-center p-4 text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-60" />
                    <p className="font-semibold text-[11px]">Belum ada gambar</p>
                    <p className="text-[10px] mt-0.5">Rasio ideal potret 5:7</p>
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
              <div className="sm:col-span-7 space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                  id="certificate-image-upload"
                />
                <label
                  htmlFor="certificate-image-upload"
                  className={`flex flex-col items-center justify-center w-full p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                    isUploading
                      ? 'border-slate-200 bg-slate-50 pointer-events-none opacity-60'
                      : 'border-teal-300 bg-teal-50/50 hover:bg-teal-50 hover:border-teal-500'
                  }`}
                >
                  <Upload className="w-6 h-6 text-teal-600 mb-2" />
                  <span className="font-extrabold text-slate-800 text-xs">
                    {imageUrl ? 'Ganti Gambar Sertifikat' : 'Pilih File Gambar Sertifikat'}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 text-center">
                    Format: JPG, PNG, WEBP, GIF (Maks. 5 MB)
                  </span>
                </label>

                {uploadError && (
                  <p className="text-rose-600 font-semibold text-[11px] bg-rose-50 border border-rose-200 rounded-xl p-2.5">
                    {uploadError}
                  </p>
                )}

                {imageUrl && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate font-medium">Gambar siap disimpan</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Brand <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: HIKVISION, DAHUA, EZVIZ"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 font-bold uppercase focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tier / Level Kemitraan
              </label>
              <input
                type="text"
                placeholder="Contoh: Platinum Partner / Master Dealer"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Judul Sertifikat <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Authorized Platinum Direct Partner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Penerbit / Issuer
              </label>
              <input
                type="text"
                placeholder="Contoh: Dahua Vision Technology"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Masa Berlaku
              </label>
              <input
                type="text"
                placeholder="Contoh: 2025 – 2026"
                value={validPeriod}
                onChange={(e) => setValidPeriod(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Urutan Tampil (Sort Order)
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2.5 font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-4 sm:pt-5">
              <input
                id="cert-is-active"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <label htmlFor="cert-is-active" className="font-bold text-slate-700 cursor-pointer">
                Tampilkan di Web Publik (Aktif)
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-extrabold shadow-md shadow-teal-700/20 transition-all flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Sertifikat'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

