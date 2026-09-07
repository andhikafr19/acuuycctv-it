'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Clock,
  Wrench,
  DollarSign,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus, Technician } from '@/lib/types';
import { updateOrderAction } from '@/lib/store';
import { createStatusUpdateWaLink } from '@/lib/whatsapp';

interface OrderDetailModalProps {
  order: Order | null;
  technicians: Technician[];
  onClose: () => void;
  onUpdated: () => void;
}

export default function OrderDetailModal({
  order,
  technicians,
  onClose,
  onUpdated,
}: OrderDetailModalProps) {
  if (!order) return null;

  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [techId, setTechId] = useState(order.technician_id || '');
  const [estimatedCost, setEstimatedCost] = useState(order.estimated_cost || 0);
  const [finalCost, setFinalCost] = useState(order.final_cost || 0);
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || '');
  const [logNotes, setLogNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const selectedTech = technicians.find((t) => t.id === techId);

    const res = await updateOrderAction(order.id, {
      status,
      technician_id: techId,
      technician_name: selectedTech?.name || '',
      estimated_cost: Number(estimatedCost),
      final_cost: Number(finalCost),
      admin_notes: adminNotes,
      log_notes: logNotes || `Status diperbarui menjadi ${status}`,
    });

    setIsSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      onUpdated();
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert('Gagal menyimpan perubahan: ' + res.error);
    }
  };

  const waUpdateLink = createStatusUpdateWaLink(
    {
      ...order,
      status,
      technician_name: technicians.find((t) => t.id === techId)?.name || order.technician_name,
      estimated_cost: Number(estimatedCost),
    },
    adminNotes
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-teal-400">Order Management</span>
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold uppercase">
                {order.service_type}
              </span>
            </div>
            <h3 className="text-2xl font-black font-mono mt-1">{order.order_number}</h3>
            <p className="text-xs text-slate-400">
              Masuk: {new Date(order.created_at).toLocaleString('id-ID')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Data pesanan berhasil diperbarui!</span>
            </div>
          )}

          {/* Customer Summary Bar */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs text-slate-700 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-900">{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{order.customer_phone}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
              <span>
                {order.address} ({order.city})
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200/60">
              <span className="font-bold text-slate-900">Keluhan / Kebutuhan:</span>
              <p className="text-slate-600 mt-0.5">{order.description}</p>
            </div>
          </div>

          {/* Update Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Pengerjaan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="baru">1. Baru Masuk</option>
                <option value="dikonfirmasi">2. Dikonfirmasi</option>
                <option value="dijadwalkan">3. Dijadwalkan</option>
                <option value="dikerjakan">4. Sedang Dikerjakan</option>
                <option value="selesai">5. Selesai</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tugaskan Teknisi
              </label>
              <select
                value={techId}
                onChange={(e) => setTechId(e.target.value)}
                className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="">-- Belum Ditugaskan --</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimasi Biaya (Rp)
              </label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Biaya Akhir / Realisasi (Rp)
              </label>
              <input
                type="number"
                value={finalCost}
                onChange={(e) => setFinalCost(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Diagnosa / Pengerjaan untuk Pelanggan
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Sudah survei lokasi, butuh 4 kamera outdoor dan kabel 50 meter"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Riwayat Log Status (Internal)
            </label>
            <input
              type="text"
              placeholder="Contoh: Teknisi berangkat ke lokasi jam 10.00"
              value={logNotes}
              onChange={(e) => setLogNotes(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Status'}
            </button>

            <a
              href={waUpdateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Kirim Notifikasi WhatsApp</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
