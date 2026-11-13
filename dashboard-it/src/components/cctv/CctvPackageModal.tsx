'use client';

import React, { useState, useEffect } from 'react';
import { X, Camera, Sparkles, Plus, Trash2 } from 'lucide-react';
import { CctvPackage } from '@/lib/types';
import { saveCctvPackageAction } from '@/lib/store';

interface CctvPackageModalProps {
  pkg: CctvPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function CctvPackageModal({
  pkg,
  isOpen,
  onClose,
  onSaved,
}: CctvPackageModalProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Hikvision');
  const [brandTagline, setBrandTagline] = useState('');
  const [type, setType] = useState('CCTV Analog');
  const [series, setSeries] = useState('Standard');
  const [seriesLabel, setSeriesLabel] = useState('');
  const [resolution, setResolution] = useState('2MP Full HD');
  const [cameraCount, setCameraCount] = useState<number>(4);
  const [indoorCount, setIndoorCount] = useState<number>(2);
  const [outdoorCount, setOutdoorCount] = useState<number>(2);
  const [hddSize, setHddSize] = useState('1TB');
  const [cableLength, setCableLength] = useState('60 Meter');
  const [recorderSpec, setRecorderSpec] = useState('DVR 4Ch Turbo HD');
  const [price, setPrice] = useState('Rp 2.950.000');
  const [estimatedCost, setEstimatedCost] = useState<number>(2950000);
  const [originalPrice, setOriginalPrice] = useState('');
  const [tag, setTag] = useState('');
  const [popular, setPopular] = useState(false);
  const [bestFor, setBestFor] = useState('');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(100);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (pkg) {
      setName(pkg.name || '');
      setBrand(pkg.brand || 'Hikvision');
      setBrandTagline(pkg.brand_tagline || '');
      setType(pkg.type || 'CCTV Analog');
      setSeries(pkg.series || 'Standard');
      setSeriesLabel(pkg.series_label || '');
      setResolution(pkg.resolution || '2MP Full HD');
      setCameraCount(Number(pkg.camera_count) || 4);
      setIndoorCount(Number(pkg.indoor_count) || 2);
      setOutdoorCount(Number(pkg.outdoor_count) || 2);
      setHddSize(pkg.hdd_size || '1TB');
      setCableLength(pkg.cable_length || '60 Meter');
      setRecorderSpec(pkg.recorder_spec || 'DVR 4Ch Turbo HD');
      setPrice(pkg.price || '');
      setEstimatedCost(Number(pkg.estimated_cost) || 0);
      setOriginalPrice(pkg.original_price || '');
      setTag(pkg.tag || '');
      setPopular(Boolean(pkg.popular));
      setBestFor(pkg.best_for || '');
      setDescription(pkg.description || '');
      setFeaturesText((pkg.features || []).join('\n'));
      setSortOrder(Number(pkg.sort_order) || 100);
      setIsActive(pkg.is_active !== false);
    } else {
      setName('');
      setBrand('Hikvision');
      setBrandTagline('World #1 Security Brand');
      setType('CCTV Analog');
      setSeries('Standard');
      setSeriesLabel('Standard 2MP');
      setResolution('2MP Full HD');
      setCameraCount(4);
      setIndoorCount(2);
      setOutdoorCount(2);
      setHddSize('1TB');
      setCableLength('60 Meter');
      setRecorderSpec('DVR 4Ch Turbo HD');
      setPrice('Rp 2.950.000');
      setEstimatedCost(2950000);
      setOriginalPrice('Rp 3.350.000');
      setTag('');
      setPopular(false);
      setBestFor('Rumah Tinggal & Toko');
      setDescription('');
      setFeaturesText(
        '2 Kamera Indoor + 2 Kamera Outdoor 2MP\nDVR 4 Channel H.265+\nHarddisk 1TB Surveillance Khusus CCTV\nKabel Coaxial + Power 60 Meter\nGratis Jasa Instalasi Rapi & Setting HP\nGaransi Resmi & Pasang 1 Tahun'
      );
      setSortOrder(100);
      setIsActive(true);
    }
  }, [pkg, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand || !price) {
      alert('Mohon lengkapi Nama Paket, Brand, dan Harga.');
      return;
    }

    setIsSaving(true);
    const parsedFeatures = featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<CctvPackage> = {
      ...(pkg?.id ? { id: pkg.id } : {}),
      name,
      brand,
      brand_tagline: brandTagline,
      type,
      series,
      series_label: seriesLabel,
      resolution,
      camera_count: Number(cameraCount),
      indoor_count: Number(indoorCount),
      outdoor_count: Number(outdoorCount),
      hdd_size: hddSize,
      cable_length: cableLength,
      recorder_spec: recorderSpec,
      price,
      estimated_cost: Number(estimatedCost) || 0,
      original_price: originalPrice || null,
      tag: tag || null,
      popular,
      best_for: bestFor,
      description,
      features: parsedFeatures,
      sort_order: Number(sortOrder) || 100,
      is_active: isActive,
    };

    const res = await saveCctvPackageAction(payload);
    setIsSaving(false);

    if (res.success) {
      onSaved();
      onClose();
    } else {
      alert('Gagal menyimpan paket: ' + res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {pkg ? 'Edit Paket CCTV' : 'Tambah Paket CCTV Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Data akan sinkron dengan katalog & formulir booking di landing page
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Nama Paket <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Paket Hikvision ColorVu 4 Kamera"
                className="w-full rounded-xl border border-slate-300 p-2.5 font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 font-bold bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Hikvision">Hikvision</option>
                <option value="HiLook">HiLook</option>
                <option value="Dahua">Dahua</option>
                <option value="EZVIZ / IMOU">EZVIZ / IMOU</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tipe Kamera</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 font-bold bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="CCTV Analog">CCTV Analog</option>
                <option value="CCTV IP Camera">CCTV IP Camera</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Seri Fitur</label>
              <select
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 font-bold bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Standard">Standard</option>
                <option value="Audio">Audio</option>
                <option value="ColorVu Audio">ColorVu Audio</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Resolusi</label>
              <input
                type="text"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="2MP Full HD"
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Jumlah Kamera</label>
              <select
                value={cameraCount}
                onChange={(e) => setCameraCount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2 font-bold bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value={2}>2 Kamera</option>
                <option value={4}>4 Kamera</option>
                <option value={6}>6 Kamera</option>
                <option value={8}>8 Kamera</option>
                <option value={16}>16 Kamera</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kamera Indoor</label>
              <input
                type="number"
                value={indoorCount}
                onChange={(e) => setIndoorCount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kamera Outdoor</label>
              <input
                type="number"
                value={outdoorCount}
                onChange={(e) => setOutdoorCount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ukuran Harddisk</label>
              <input
                type="text"
                value={hddSize}
                onChange={(e) => setHddSize(e.target.value)}
                placeholder="1TB"
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Panjang Kabel</label>
              <input
                type="text"
                value={cableLength}
                onChange={(e) => setCableLength(e.target.value)}
                placeholder="60 Meter"
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tampilan Harga (Teks) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Rp 2.950.000"
                className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-teal-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Estimasi Angka (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                placeholder="2950000"
                className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Harga Coret (Opsional)</label>
              <input
                type="text"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Rp 3.350.000"
                className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Badge / Tag Promo</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Favorit Rumah / Paling Hemat"
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Rekomendasi Terbaik Untuk</label>
              <input
                type="text"
                value={bestFor}
                onChange={(e) => setBestFor(e.target.value)}
                placeholder="Rumah Tinggal, Toko, & Ruko"
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Urutan Tampil (Sort Order)</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span>Tandai sebagai Paket Terpopuler (Muncul di Beranda)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span>Aktif (Tampil di Publik)</span>
            </label>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Spesifikasi Recorder (DVR / NVR)</label>
            <input
              type="text"
              value={recorderSpec}
              onChange={(e) => setRecorderSpec(e.target.value)}
              placeholder="DVR 4Ch Turbo HD AcuSense"
              className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Rincian Fitur / Kelengkapan (Satu baris per poin)
            </label>
            <textarea
              rows={4}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="2 Kamera Indoor + 2 Kamera Outdoor 2MP&#10;DVR 4 Channel H.265+&#10;Harddisk 1TB Surveillance Khusus CCTV"
              className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-[11px] focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat Paket</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Pengawasan 4 sudut rumah atau toko dengan kualitas gambar 1080p yang stabil..."
              className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Paket CCTV'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

