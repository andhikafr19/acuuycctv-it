'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Laptop as LaptopIcon,
  Search,
  Filter,
  ShieldCheck,
  Tag,
  ArrowUpDown,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { Laptop, StoreSettings } from '@/lib/types';
import { getStoreAll } from '@/lib/store';
import LaptopCard from '@/components/laptop/LaptopCard';
import LaptopDetailModal from '@/components/laptop/LaptopDetailModal';

export default function KatalogPage() {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    getStoreAll().then((data) => {
      setLaptops(data.laptops);
      setSettings(data.settings);
    });
  }, []);

  const brands = ['All', ...Array.from(new Set(laptops.map((l) => l.brand)))];

  const filteredLaptops = laptops.filter((lap) => {
    const matchesSearch =
      lap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lap.processor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lap.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand = selectedBrand === 'All' || lap.brand === selectedBrand;
    const matchesGrade = selectedGrade === 'All' || lap.condition_grade.includes(selectedGrade);
    const effectivePrice = lap.discount_price || lap.price;
    const matchesPrice = effectivePrice <= maxPrice;
    const matchesStatus = !onlyAvailable || lap.status === 'tersedia';

    return matchesSearch && matchesBrand && matchesGrade && matchesPrice && matchesStatus;
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="relative py-14 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <LaptopIcon className="w-3.5 h-3.5" /> Bursa Laptop Second Bergaransi Garut
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Katalog Laptop Bekas Berkualitas
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Setiap unit telah diuji fungsional 100% oleh teknisi kami. Siap pakai untuk kerja,
              sekolah, coding, atau gaming. Garansi toko 1 bulan!
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog with Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-teal-600" /> Filter Pencarian
                </span>
                {(selectedBrand !== 'All' ||
                  searchQuery ||
                  selectedGrade !== 'All' ||
                  onlyAvailable) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBrand('All');
                      setSelectedGrade('All');
                      setOnlyAvailable(false);
                      setMaxPrice(10000000);
                    }}
                    className="text-[11px] text-rose-600 font-bold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Cari Nama / Spek
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Contoh: ThinkPad / Core i5"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Brand Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Merk / Brand
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {brands.map((b, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedBrand(b)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedBrand === b
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Grade */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Kondisi Fisik
                </label>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {['All', 'Grade A', 'Grade B'].map((grade, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="grade"
                        checked={selectedGrade === grade}
                        onChange={() => setSelectedGrade(grade)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>{grade === 'All' ? 'Semua Kondisi' : grade}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Budget Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-bold text-slate-700 uppercase tracking-wider">
                    Budget Maksimal
                  </span>
                  <span className="font-extrabold text-teal-700">
                    Rp {maxPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000000"
                  max="12000000"
                  step="500000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Checkbox Ready Stock Only */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Hanya Unit Ready di Garut</span>
                </label>
              </div>

              {/* Trade-in Promo Callout */}
              <div className="bg-teal-50 rounded-2xl p-4 border border-teal-200/60 text-xs text-teal-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-teal-800">
                  <Tag className="w-3.5 h-3.5" /> Mau Tukar Tambah?
                </div>
                <p className="text-teal-800/80">
                  Bawa laptop lama Anda ke toko kami di Garut untuk dinilai dan dipotong ke unit baru!
                </p>
                <Link
                  href="/jual-laptop"
                  className="inline-block font-black text-teal-700 underline hover:text-teal-900"
                >
                  Ajukan Taksiran Laptop →
                </Link>
              </div>
            </div>
          </div>

          {/* Grid Unit Laptop */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Menampilkan <strong>{filteredLaptops.length}</strong> unit laptop bekas berkualitas
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> Siap COD / Ambil di Toko Garut
              </span>
            </div>

            {filteredLaptops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {settings &&
                  filteredLaptops.map((lap) => (
                    <LaptopCard
                      key={lap.id}
                      laptop={lap}
                      settings={settings}
                      onOpenDetail={(item) => setSelectedLaptop(item)}
                    />
                  ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <LaptopIcon className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">
                  Tidak Ada Unit yang Sesuai Filter
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Coba ubah kata kunci pencarian, merk, atau geser batas harga maksimal untuk melihat
                  pilihan laptop lainnya.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBrand('All');
                    setSelectedGrade('All');
                    setMaxPrice(10000000);
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
                >
                  Tampilkan Semua Unit
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Laptop Detail Modal */}
      {settings && (
        <LaptopDetailModal
          laptop={selectedLaptop}
          settings={settings}
          onClose={() => setSelectedLaptop(null)}
        />
      )}
    </div>
  );
}
