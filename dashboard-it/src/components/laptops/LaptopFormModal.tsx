'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Laptop as LaptopIcon } from 'lucide-react';
import { Laptop, LaptopGrade, LaptopStatus } from '@/lib/types';
import { saveLaptopAction } from '@/lib/store';

interface LaptopFormModalProps {
  laptop: Laptop | null; // if null, mode is Add New
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
  if (!isOpen) return null;

  const [title, setTitle] = useState(laptop?.title || '');
  const [brand, setBrand] = useState(laptop?.brand || 'Lenovo');
  const [model, setModel] = useState(laptop?.model || '');
  const [processor, setProcessor] = useState(laptop?.processor || '');
  const [ram, setRam] = useState(laptop?.ram || '8GB DDR4');
  const [storage, setStorage] = useState(laptop?.storage || '256GB SSD');
  const [graphics, setGraphics] = useState(laptop?.graphics || 'Intel UHD Graphics');
  const [display, setDisplay] = useState(laptop?.display || '14" FHD (1920x1080)');
  const [batteryHealth, setBatteryHealth] = useState(
    laptop?.battery_health || 'Baterai Normal 3-4 Jam'
  );
  const [conditionGrade, setConditionGrade] = useState<LaptopGrade>(
    laptop?.condition_grade || 'Grade A (Mulus)'
  );
  const [price, setPrice] = useState(laptop?.price || 3500000);
  const [discountPrice, setDiscountPrice] = useState(laptop?.discount_price || '');
  const [warrantyInfo, setWarrantyInfo] = useState(
    laptop?.warranty_info || 'Garansi Toko 1 Bulan Full Part'
  );
  const [status, setStatus] = useState<LaptopStatus>(laptop?.status || 'tersedia');
  const [imageUrl, setImageUrl] = useState(laptop?.images?.[0] || '');
  const [description, setDescription] = useState(laptop?.description || '');

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !model || !processor || !price) {
      alert('Mohon lengkapi judul, model, prosesor, dan harga');
      return;
    }

    setIsSaving(true);
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
      images: imageUrl
        ? [imageUrl]
        : ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'],
      description,
      features: ['Lolos Uji Hardware 20 Titik', 'Keyboard & Port Berfungsi Normal', 'Siap Pakai'],
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
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <LaptopIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black">
                {laptop ? 'Edit Unit Laptop Bekas' : 'Tambah Unit Laptop Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Data akan langsung tampil pada katalog web publik `landing-it`
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Produk Display <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Lenovo ThinkPad T480 Core i5 Gen 8 Mulus"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Merk / Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Lenovo">Lenovo</option>
                <option value="Asus">Asus</option>
                <option value="Dell">Dell</option>
                <option value="HP">HP</option>
                <option value="Acer">Acer</option>
                <option value="Apple">Apple</option>
                <option value="MSI">MSI</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Model / Seri Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: ThinkPad T480 / VivoBook A412"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Prosesor <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Intel Core i5-8350U (Quad-Core)"
                value={processor}
                onChange={(e) => setProcessor(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">RAM</label>
              <input
                type="text"
                placeholder="16GB DDR4"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Penyimpanan</label>
              <input
                type="text"
                placeholder="512GB NVMe SSD"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">VGA / GPU</label>
              <input
                type="text"
                placeholder="Intel UHD 620"
                value={graphics}
                onChange={(e) => setGraphics(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Layar</label>
              <input
                type="text"
                placeholder="14 Inch FHD IPS"
                value={display}
                onChange={(e) => setDisplay(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kondisi Fisik</label>
              <select
                value={conditionGrade}
                onChange={(e) => setConditionGrade(e.target.value as LaptopGrade)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Grade A (Mulus)">Grade A (Mulus 95%+)</option>
                <option value="Grade B (Lecet Pemakaian)">Grade B (Lecet Pemakaian)</option>
                <option value="Grade C (Fungsional Normal)">Grade C (Fungsional Normal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Unit</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LaptopStatus)}
                className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="tersedia">Tersedia (Ready Garut)</option>
                <option value="booking">Sedang Dibooking</option>
                <option value="terjual">Sudah Terjual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Garansi Toko</label>
              <input
                type="text"
                placeholder="Garansi Toko 1 Bulan"
                value={warrantyInfo}
                onChange={(e) => setWarrantyInfo(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Harga Normal (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full text-xs font-bold text-teal-800 rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Harga Diskon / Promo (Rp, Opsional)
              </label>
              <input
                type="number"
                placeholder="Kosongkan jika tidak ada diskon"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              URL Foto Produk Laptop
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Lengkap</label>
            <textarea
              rows={3}
              placeholder="Jelaskan kelebihan unit, kondisi baterai, kelengkapan charger..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Data Laptop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
