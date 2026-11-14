'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Search,
  Edit,
  Trash2,
  ShieldCheck,
  Eye,
  EyeOff,
  Calendar,
  Building2,
} from 'lucide-react';
import { Certificate } from '@/lib/types';
import { getDashboardData, deleteCertificateAction, saveCertificateAction } from '@/lib/store';
import CertificateModal from '@/components/certificates/CertificateModal';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    setLoading(true);
    getDashboardData().then((d) => {
      setCertificates(d.certificates || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddNew = () => {
    setSelectedCert(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cert: Certificate) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  const handleDelete = async (cert: Certificate) => {
    if (!confirm(`Yakin ingin menghapus sertifikat "${cert.brand} - ${cert.title}"?`)) return;
    const res = await deleteCertificateAction(cert.id);
    if (res.success) {
      loadData();
    } else {
      alert('Gagal menghapus sertifikat: ' + res.error);
    }
  };

  const handleToggleActive = async (cert: Certificate) => {
    const res = await saveCertificateAction({
      id: cert.id,
      is_active: !cert.is_active,
    });
    if (res.success) {
      loadData();
    } else {
      alert('Gagal mengubah status: ' + res.error);
    }
  };

  const filtered = certificates.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.brand.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      (c.tier && c.tier.toLowerCase().includes(q)) ||
      (c.issuer && c.issuer.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && c.is_active) ||
      (statusFilter === 'inactive' && !c.is_active);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Lisensi &amp; Sertifikat Kemitraan
          </h2>
          <p className="text-xs text-slate-500">
            Kelola gambar sertifikat distributor/dealer resmi yang tampil di section Certificate web publik.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-700/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sertifikat</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari brand, judul, atau penerbit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'Semua' : status === 'active' ? 'Aktif' : 'Nonaktif'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-4 animate-pulse space-y-3">
              <div className="aspect-[5/7] bg-slate-100 rounded-2xl" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-base font-black text-slate-900">
            {certificates.length === 0
              ? 'Belum Ada Lisensi / Sertifikat'
              : 'Tidak Ada Sertifikat yang Cocok'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 mb-5">
            {certificates.length === 0
              ? 'Upload gambar sertifikat kemitraan resmi brand CCTV agar tampil di section Lisensi & Kemitraan Resmi pada landing page.'
              : 'Coba ubah kata kunci pencarian atau filter status.'}
          </p>
          {certificates.length === 0 && (
            <button
              onClick={handleAddNew}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Sertifikat Pertama</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((cert) => (
            <div
              key={cert.id}
              className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between transition-all ${
                cert.is_active ? 'border-slate-200/90' : 'border-slate-200 opacity-70'
              }`}
            >
              <div>
                {/* Image Preview */}
                <div className="relative aspect-[5/7] bg-slate-50 border-b border-slate-100 p-3">
                  <img
                    src={cert.image_url}
                    alt={`${cert.brand} - ${cert.title}`}
                    className="w-full h-full object-contain rounded-xl bg-white border border-slate-100"
                  />

                  <div className="absolute top-4 left-4 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/85 text-white text-[10px] font-black tracking-wider uppercase backdrop-blur">
                      #{cert.sort_order}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(cert)}
                    title={cert.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    className={`absolute top-4 right-4 px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 shadow-sm transition-colors ${
                      cert.is_active
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-slate-600 text-white hover:bg-slate-700'
                    }`}
                  >
                    {cert.is_active ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Aktif</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Nonaktif</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      <ShieldCheck className="w-3 h-3" />
                      {cert.brand}
                    </span>
                    {cert.tier && (
                      <span className="text-[11px] font-semibold text-slate-500 truncate">
                        {cert.tier}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2">
                    {cert.title}
                  </h3>

                  <div className="space-y-1 pt-1 text-[11px] text-slate-500">
                    {cert.issuer && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{cert.issuer}</span>
                      </div>
                    )}
                    {cert.valid_period && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Berlaku: {cert.valid_period}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(cert)}
                  className="flex-1 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cert)}
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 text-slate-500 font-bold text-xs flex items-center justify-center transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CertificateModal
        certificate={selectedCert}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadData}
      />
    </div>
  );
}

