'use client';

import React, { useState, useEffect } from 'react';
import {
  Camera,
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Portfolio } from '@/lib/types';
import { getDashboardData, deletePortfolioAction } from '@/lib/store';
import PortfolioModal from '@/components/portfolios/PortfolioModal';

export default function PortfoliosAdminPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const loadData = () => {
    getDashboardData().then((d) => setPortfolios(d.portfolios || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setSelectedPortfolio(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Portfolio) => {
    setSelectedPortfolio(p);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Hapus dokumentasi portofolio "${title}"?`)) {
      const res = await deletePortfolioAction(id);
      if (res.success) {
        loadData();
      } else {
        alert('Gagal menghapus portofolio: ' + res.error);
      }
    }
  };

  const filtered = portfolios.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Manajemen Portofolio CCTV Garut
          </h2>
          <p className="text-xs text-slate-500">
            Kelola foto hasil pemasangan kamera pengawas yang ditampilkan di halaman Portofolio web publik.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumentasi CCTV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari Proyek atau Lokasi Garut..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="All">Semua Kategori</option>
            <option value="toko">Toko, Kafe & Ruko</option>
            <option value="rumah">Rumah & Perumahan</option>
            <option value="kantor">Kantor & Fasilitas Kesehatan</option>
            <option value="gudang">Gudang & Industri</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200/60">
              <tr>
                <th className="p-4">Foto & Nama Proyek</th>
                <th className="p-4">Lokasi di Garut</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Jumlah Titik</th>
                <th className="p-4">Tanggal Selesai</th>
                <th className="p-4">Testimoni Klien</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-teal-50/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-11 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 line-clamp-1">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-500 block line-clamp-1">
                            {item.camera_type}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {item.category}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-teal-700">
                      {item.camera_count} Titik
                    </td>

                    <td className="p-4 text-slate-600">
                      {item.completion_date}
                    </td>

                    <td className="p-4 max-w-xs text-slate-600">
                      {item.testimonial ? (
                        <div>
                          <div className="font-bold text-slate-800 text-[11px]">
                            {item.testimonial.client_name}
                          </div>
                          <div className="text-[10px] italic text-slate-500 truncate">
                            "{item.testimonial.review}"
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Edit Portofolio"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700"
                          title="Hapus Portofolio"
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
                    Belum ada data portofolio CCTV.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <PortfolioModal
        portfolio={selectedPortfolio}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadData}
      />
    </div>
  );
}
