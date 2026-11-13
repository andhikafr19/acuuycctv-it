'use client';

import React, { useState, useEffect } from 'react';
import { X, Laptop as LaptopIcon, Sparkles, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { Laptop, LaptopGrade, LaptopStatus } from '@/lib/types';
import { saveLaptopAction } from '@/lib/store';

interface LaptopFormModalProps {
  laptop: Laptop | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function LaptopFormModal({
  laptop,
  isOpen,
  onClose,
  onSaved,
}: LaptopFormModalProps) {
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Lenovo');
  const [model, setModel] = useState('');
  const [processor, setProcessor] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [graphics, setGraphics] = useState('');
  const [display, setDisplay] = useState('');
  const [batteryHealth, setBatteryHealth] = useState('Baterai Normal 3-4 Jam');
  const [conditionGrade, setConditionGrade] = useState<LaptopGrade>('Grade A (Mulus)');
  const [price, setPrice] = useState<number | string>('');
  const [discountPrice, setDiscountPrice] = useState<number | string>('');
  const [warrantyInfo, setWarrantyInfo] = useState('Garansi Toko 1 Bulan (Full Service & Part)');
  const [status, setStatus] = useState<LaptopStatus>('tersedia');
  const [description, setDescription] = useState('');
  const [imagesText, setImagesText] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (laptop) {
      setTitle(laptop.title || '');
      setBrand(laptop.brand || 'Lenovo');
      setModel(laptop.model || '');
      setProcessor(laptop.processor || '');
      setRam(laptop.ram || '');
      setStorage(laptop.storage || '');
      setGraphics(laptop.graphics || '');
      setDisplay(laptop.display || '');
      setBatteryHealth(laptop.battery_health || 'Baterai Normal 3-4 Jam');
      setConditionGrade(laptop.condition_grade || 'Grade A (Mulus)');
      setPrice(laptop.price || '');
      setDiscountPrice(laptop.discount_price || '');
      setWarrantyInfo(laptop.warranty_info || 'Garansi Toko 1 Bulan (Full Service & Part)');
      setStatus(laptop.status || 'tersedia');
      setDescription(laptop.description || '');
      setImagesText((laptop.images || []).join('\n'));
      setFeaturesText(
        (laptop.features && laptop.features.length > 0
          ? laptop.features
          : ['Lolos Uji Hardware 20 Titik', 'Keyboard & Port Berfungsi Normal', 'Siap Pakai']
        ).join('\n')
      );
    } else {
      setTitle('');
      setBrand('Lenovo');
      setModel('');
      setProcessor('');
      setRam('');
      setStorage('');
      setGraphics('');
      setDisplay('');
      setBatteryHealth('Baterai Normal 3-4 Jam');
      setConditionGrade('Grade A (Mulus)');
      setPrice('');
      setDiscountPrice('');
      setWarrantyInfo('Garansi Toko 1 Bulan (Full Service & Part)');
      setStatus('tersedia');
      setDescription('');
      setImagesText('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80');
      setFeaturesText('Lolos Uji Hardware 20 Titik\nKeyboard & Port Berfungsi Normal\nSiap Pakai');
    }
  }, [laptop, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !brand || !price) {
      alert('Mohon isi Judul, Brand, dan Harga Laptop.');
      return;
    }

    setIsSaving(true);

    const parsedImages = imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedFeatures = featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const data: Partial<Laptop> = {
      ...(laptop?.id ? { id: laptop.id } : {}),
      title,
      brand,
      model,
      processor,
      ram,
      storage,
      graphics,
      display,
      battery_health: batteryHealth,
      condition_grade: conditionGrade,
      price: Number(price),
      discount_price: discountPrice ? Number(discountPrice) : null,
      warranty_info: warrantyInfo,
      status,
      images: parsedImages.length > 0
        ? parsedImages
        : ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'],
      description,
      features: parsedFeatures.length > 0
        ? parsedFeatures
        : ['Lolos Uji Hardware 20 Titik', 'Keyboard & Port Berfungsi Normal', 'Siap Pakai'],
    };

    const res = await saveLaptopAction(data);
    setIsSaving(false);

    if (res.success) {
      onSaved();
      onClose();
    } else {
      alert('Gagal menyimpan laptop: ' + res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <LaptopIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {laptop ? 'Edit Unit Laptop Bekas' : 'Tambah Unit Laptop Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Data akan langsung tampil di halaman katalog web publik Garut
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
                Judul Produk <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Lenovo ThinkPad T480 Intel Core i5 Gen 8 RAM 16GB"
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
                <option value="Lenovo">Lenovo</option>
                <option value="Asus">Asus</option>
                <option value="HP">HP</option>
                <option value="Dell">Dell</option>
                <option value="Acer">Acer</option>
                <option value="Apple">Apple</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Model / Tipe</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="ThinkPad T480"
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Processor</label>
              <input
                type="text"
                value={processor}
                onChange={(e) => setProcessor(e.target.value)}
                placeholder="i5-8350U"
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">RAM</label>
              <input
                type="text"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                placeholder="16GB DDR4"
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Storage</label>
              <input
                type="text"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                placeholder="512GB NVMe SSD"
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kartu Grafis (GPU)</label>
              <input
                type="text"
                value={graphics}
                onChange={(e) => setGraphics(e.target.value)}
                placeholder="Intel UHD / NVIDIA"
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Layar (Display)</label>
              <input
                type="text"
                value={display}
                onChange={(e) => setDisplay(e.target.value)}
                placeholder="14 Inch FHD IPS"
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kondisi Baterai</label>
              <input
                type="text"
                value={batteryHealth}
                onChange={(e) => setBatteryHealth(e.target.value)}
                placeholder="Normal 3-4 Jam"
                className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Grade Fisik</label>
              <select
                value={conditionGrade}
                onChange={(e) => setConditionGrade(e.target.value as LaptopGrade)}
                className="w-full rounded-xl border border-slate-300 p-2 font-bold bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Grade A (Mulus)">Grade A (Mulus)</option>
                <option value="Grade B (Lecet Pemakaian)">Grade B (Lecet Pemakaian)</option>
                <option value="Grade C (Fungsional Normal)">Grade C (Fungsional Normal)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Harga Jual (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="3850000"
                className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Harga Coret Promo (Opsional)
              </label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Kosongkan jika tidak ada"
                className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status Ketersediaan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LaptopStatus)}
                className="w-full rounded-xl border border-slate-300 p-2.5 font-bold bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="tersedia">Tersedia (Ready Stock)</option>
                <option value="booking">Sedang Dibooking</option>
                <option value="terjual">Sudah Terjual (Sold Out)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Garansi Toko</label>
            <input
              type="text"
              value={warrantyInfo}
              onChange={(e) => setWarrantyInfo(e.target.value)}
              placeholder="Garansi Toko 1 Bulan (Full Service & Part)"
              className="w-full rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              URL Foto Laptop (Satu baris per foto)
            </label>
            <textarea
              rows={2}
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              placeholder="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed..."
              className="w-full rounded-xl border border-slate-300 p-2 font-mono text-[11px] focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Poin Fitur Unggulan (Satu baris per poin fitur)
            </label>
            <textarea
              rows={3}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="Dual Baterai Sehat 90%+\nPort Lengkap Type-C & Thunderbolt 3\nBody Kokoh Standar Militer (MIL-STD)"
              className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deskripsi Lengkap & Kondisi</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan kelengkapan (unit, charger, tas), kondisi fisik, dan keunggulan unit..."
              className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
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
              {isSaving ? 'Menyimpan...' : 'Simpan Data Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
