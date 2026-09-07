'use client';

import React, { useState, useEffect } from 'react';
import {
  Laptop as LaptopIcon,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Tag,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { Laptop, LaptopStatus } from '@/lib/types';
import { getDashboardData, deleteLaptopAction, saveLaptopAction } from '@/lib/store';
import LaptopFormModal from '@/components/laptops/LaptopFormModal';

export default function LaptopsInventoryPage() {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const loadData = () => {
    getDashboardData().then((d) => setLaptops(d.laptops));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setSelectedLaptop(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lap: Laptop) => {
    setSelectedLaptop(lap);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus unit laptop "${title}" dari inventaris?`)) {
      const res = await deleteLaptopAction(id);
      if (res.success) {
        loadData();
      } else {
        alert('Gagal menghapus laptop: ' + res.error);
      }
    }
  };

  const handleQuickStatusChange = async (lap: Laptop, newStatus: LaptopStatus) => {
    await saveLaptopAction({ id: lap.id, status: newStatus });
    loadData();
  };

  const filteredLaptops = laptops.filter((lap) => {
    const matchesSearch =
      lap.title.toLowerCase().includes(search.toLowerCase()) ||
      lap.brand.toLowerCase().includes(search.toLowerCase()) ||
      lap.processor.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || lap.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Inventaris & Stok Laptop Bekas
          </h2>
          <p className="text-xs text-slate-500">
            Kelola katalog laptop second yang ditampilkan di web publik <strong>landing-it</strong>.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Unit Laptop</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari Merk, Model, Processor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="All">Semua Status</option>
            <option value="tersedia">Tersedia (Ready)</option>
            <option value="booking">Sedang Booking</option>
            <option value="terjual">Sudah Terjual</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200/60">
              <tr>
                <th className="p-4">Foto & Unit Laptop</th>
                <th className="p-4">Spesifikasi Inti</th>
                <th className="p-4">Kondisi & Garansi</th>
                <th className="p-4">Harga Display</th>
                <th className="p-4">Status Stok</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLaptops.length > 0 ? (
                filteredLaptops.map((lap) => (
                  <tr key={lap.id} className="hover:bg-teal-50/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-11 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          <img
                            src={
                              lap.images?.[0] ||
                              'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
                            }
                            alt={lap.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-teal-700 block">
                            {lap.brand}
                          </span>
                          <span className="font-extrabold text-slate-900 line-clamp-1">
                            {lap.title}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-700">
                      <div className="font-semibold">{lap.processor}</div>
                      <div className="text-[10px] text-slate-500">
                        {lap.ram} / {lap.storage}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-block font-bold text-slate-800">
                        {lap.condition_grade}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">{lap.warranty_info}</div>
                    </td>

                    <td className="p-4">
                      {lap.discount_price ? (
                        <div>
                          <span className="text-[10px] text-slate-400 line-through block">
                            Rp {lap.price.toLocaleString('id-ID')}
                          </span>
                          <span className="font-extrabold text-teal-700 text-sm">
                            Rp {lap.discount_price.toLocaleString('id-ID')}
                          </span>
                        </div>
                      ) : (
                        <span className="font-extrabold text-slate-900 text-sm">
                          Rp {lap.price.toLocaleString('id-ID')}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <select
                        value={lap.status}
                        onChange={(e) =>
                          handleQuickStatusChange(lap, e.target.value as LaptopStatus)
                        }
                        className={`text-[11px] font-bold rounded-lg border px-2 py-1 focus:outline-none ${
                          lap.status === 'tersedia'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : lap.status === 'booking'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        <option value="tersedia">Tersedia (Ready)</option>
                        <option value="booking">Booking</option>
                        <option value="terjual">Terjual</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(lap)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Edit Unit Laptop"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(lap.id, lap.title)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                          title="Hapus Unit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                    Tidak ada unit laptop yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <LaptopFormModal
        laptop={selectedLaptop}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadData}
      />
    </div>
  );
}
