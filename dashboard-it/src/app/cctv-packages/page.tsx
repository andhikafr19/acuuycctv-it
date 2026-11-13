'use client';

import React, { useState, useEffect } from 'react';
import {
  Camera,
  Plus,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  CheckCircle2,
  Flame,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CctvPackage } from '@/lib/types';
import { getDashboardData, deleteCctvPackageAction } from '@/lib/store';
import CctvPackageModal from '@/components/cctv/CctvPackageModal';

export default function CctvPackagesPage() {
  const [packages, setPackages] = useState<CctvPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedPkg, setSelectedPkg] = useState<CctvPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    setLoading(true);
    getDashboardData().then((d) => {
      setPackages(d.cctv_packages || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (pkg: CctvPackage) => {
    setSelectedPkg(pkg);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPkg(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus paket "${name}"?`)) return;
    const res = await deleteCctvPackageAction(id);
    if (res.success) {
      loadData();
    } else {
      alert('Gagal menghapus paket: ' + res.error);
    }
  };

  const filtered = packages.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.tag && p.tag.toLowerCase().includes(search.toLowerCase())) ||
      (p.resolution && p.resolution.toLowerCase().includes(search.toLowerCase()));

    const matchesBrand = brandFilter === 'All' || p.brand === brandFilter;
    const matchesType = typeFilter === 'All' || p.type === typeFilter;

    return matchesSearch && matchesBrand && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Katalog Paket Pasang CCTV</h2>
          <p className="text-xs text-slate-500">
            Kelola paket resmi CCTV (Hikvision, HiLook, Dahua, EZVIZ) yang tampil di landing page publik Garut.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-700/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Paket Baru</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari nama paket, resolusi, atau tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="All">Semua Brand</option>
            <option value="Hikvision">Hikvision</option>
            <option value="HiLook">HiLook</option>
            <option value="Dahua">Dahua</option>
            <option value="EZVIZ / IMOU">EZVIZ / IMOU</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="All">Semua Tipe</option>
            <option value="CCTV Analog">CCTV Analog</option>
            <option value="CCTV IP Camera">CCTV IP Camera</option>
          </select>

          {(search || brandFilter !== 'All' || typeFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setBrandFilter('All');
                setTypeFilter('All');
              }}
              className="text-xs text-rose-600 font-bold px-2 py-1 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Packages Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200/60">
              <tr>
                <th className="p-4">Paket & Brand</th>
                <th className="p-4">Kamera & Tipe</th>
                <th className="p-4">Resolusi & Fitur</th>
                <th className="p-4">Harga Tertera</th>
                <th className="p-4">Estimasi Angka</th>
                <th className="p-4">Status & Tag</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-teal-50/20 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                        {pkg.popular && <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        <span>{pkg.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Brand: <strong className="text-teal-700">{pkg.brand}</strong> • {pkg.recorder_spec}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900">{pkg.camera_count} Kamera</div>
                      <div className="text-[10px] text-slate-400">
                        {pkg.type} ({pkg.indoor_count} in / {pkg.outdoor_count} out)
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-800">{pkg.resolution}</div>
                      <div className="text-[10px] text-slate-500">{pkg.series}</div>
                    </td>

                    <td className="p-4 font-black text-teal-800 text-xs">
                      {pkg.price}
                      {pkg.original_price && (
                        <div className="text-[10px] text-slate-400 line-through font-normal">
                          {pkg.original_price}
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-bold text-slate-900">
                      Rp {Number(pkg.estimated_cost).toLocaleString('id-ID')}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        {pkg.tag && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                            {pkg.tag}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold ${
                            pkg.is_active !== false ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          {pkg.is_active !== false ? '● Aktif' : '○ Nonaktif'}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Edit Paket"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(pkg.id, pkg.name)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600"
                          title="Hapus Paket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                    {loading
                      ? 'Memuat katalog paket...'
                      : 'Belum ada data paket CCTV (atau tabel cctv_packages belum dimigrasi di Supabase).'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CctvPackageModal
        pkg={selectedPkg}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadData}
      />
    </div>
  );
}

