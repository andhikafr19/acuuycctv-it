'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Phone,
  User,
  Tag,
  DollarSign,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { SellSubmission, SubmissionStatus } from '@/lib/types';
import { getDashboardData, updateSubmissionAction } from '@/lib/store';
import { createTradeInNegotiationWaLink } from '@/lib/whatsapp';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<SellSubmission[]>([]);
  const [selectedSub, setSelectedSub] = useState<SellSubmission | null>(null);
  const [offeredPrice, setOfferedPrice] = useState<number>(0);
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>('menunggu_review');
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    getDashboardData().then((d) => setSubmissions(d.submissions));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetail = (sub: SellSubmission) => {
    setSelectedSub(sub);
    setOfferedPrice(sub.offered_price || sub.expected_price || 0);
    setAdminNotes(sub.admin_notes || '');
    setStatus(sub.status);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    setIsSaving(true);
    const res = await updateSubmissionAction(selectedSub.id, {
      offered_price: Number(offeredPrice),
      admin_notes: adminNotes,
      status,
    });
    setIsSaving(false);

    if (res.success) {
      loadData();
      setSelectedSub(null);
    } else {
      alert('Gagal menyimpan peninjauan: ' + res.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Pengajuan Jual / Trade-In Laptop Pelanggan
        </h2>
        <p className="text-xs text-slate-500">
          Tinjau penawaran laptop second dari customer, berikan taksiran harga, dan hubungi via WhatsApp.
        </p>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200/60">
              <tr>
                <th className="p-4">No. Pengajuan</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Unit Laptop & Spek</th>
                <th className="p-4">Kondisi</th>
                <th className="p-4">Ekspektasi Harga</th>
                <th className="p-4">Taksiran Toko</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.length > 0 ? (
                submissions.map((sub) => {
                  const waLink = createTradeInNegotiationWaLink(
                    sub,
                    sub.offered_price || sub.expected_price,
                    sub.admin_notes
                  );

                  return (
                    <tr
                      key={sub.id}
                      onClick={() => handleOpenDetail(sub)}
                      className="hover:bg-teal-50/20 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 font-mono font-bold text-teal-800">
                        {sub.submission_number}
                        <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                          {new Date(sub.created_at).toLocaleDateString('id-ID')}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900">{sub.customer_name}</div>
                        <div className="text-[10px] text-slate-400">{sub.customer_phone}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-extrabold text-slate-900">
                          {sub.brand} {sub.model}
                        </div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">
                          {sub.specifications}
                        </div>
                      </td>

                      <td className="p-4 max-w-xs truncate text-slate-600">
                        {sub.condition_description}
                      </td>

                      <td className="p-4 font-bold text-slate-900">
                        Rp {Number(sub.expected_price).toLocaleString('id-ID')}
                      </td>

                      <td className="p-4 font-extrabold text-teal-700">
                        {sub.offered_price
                          ? `Rp ${Number(sub.offered_price).toLocaleString('id-ID')}`
                          : '-'}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                            sub.status === 'diterima'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.status === 'dihubungi'
                              ? 'bg-blue-100 text-blue-800'
                              : sub.status === 'ditolak'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetail(sub)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                          >
                            Tinjau
                          </button>

                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                            title="Nego via WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 text-xs">
                    Belum ada pengajuan jual dari pelanggan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
              <div>
                <span className="text-xs uppercase font-bold text-teal-400">Review Pengajuan</span>
                <h3 className="text-xl font-black font-mono mt-0.5">
                  {selectedSub.submission_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pelanggan:</span>
                  <span className="font-bold text-slate-900">
                    {selectedSub.customer_name} ({selectedSub.customer_phone})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unit:</span>
                  <span className="font-bold text-slate-900">
                    {selectedSub.brand} {selectedSub.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Spek:</span>
                  <span className="font-bold text-slate-900">{selectedSub.specifications}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kondisi:</span>
                  <span className="font-bold text-slate-900 max-w-xs text-right truncate">
                    {selectedSub.condition_description}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Ekspektasi Pelanggan:</span>
                  <span className="font-extrabold text-slate-900">
                    Rp {Number(selectedSub.expected_price).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Harga Penawaran Toko (Taksiran Estimasi)
                </label>
                <input
                  type="number"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-teal-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Pengajuan</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SubmissionStatus)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-bold bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="menunggu_review">Menunggu Review</option>
                  <option value="dihubungi">Sedang Dihubungi / Negosiasi</option>
                  <option value="diterima">Disepakati / Diterima</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Admin</label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Contoh: Unit dicek fisik hari Selasa jam 11 di toko Garut"
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Penaksiran'}
                </button>

                <a
                  href={createTradeInNegotiationWaLink(selectedSub, offeredPrice, adminNotes)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Nego WA</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
