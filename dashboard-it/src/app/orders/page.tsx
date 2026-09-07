'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  MessageSquare,
  Wrench,
  Camera,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Phone,
  User,
} from 'lucide-react';
import { Order, OrderStatus, ServiceType, Technician } from '@/lib/types';
import { getDashboardData } from '@/lib/store';
import { createStatusUpdateWaLink } from '@/lib/whatsapp';
import OrderDetailModal from '@/components/orders/OrderDetailModal';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const loadData = () => {
    getDashboardData().then((d) => {
      setOrders(d.orders);
      setTechnicians(d.technicians);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.order_number.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer_phone.includes(search);

    const matchesService = serviceFilter === 'All' || ord.service_type === serviceFilter;
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;

    return matchesSearch && matchesService && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Manajemen Pesanan</h2>
          <p className="text-xs text-slate-500">
            Kelola order instalasi CCTV, servis komputer/laptop, dan konsultasi IT yang masuk dari web publik.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span>Total: <strong>{filteredOrders.length}</strong> pesanan</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari No. Order / Pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="All">Semua Layanan</option>
            <option value="cctv">Instalasi CCTV</option>
            <option value="servis_komputer">Servis Komputer</option>
            <option value="konsultasi_it">Konsultasi IT</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="All">Semua Status</option>
            <option value="baru">Baru</option>
            <option value="dikonfirmasi">Dikonfirmasi</option>
            <option value="dijadwalkan">Dijadwalkan</option>
            <option value="dikerjakan">Dikerjakan</option>
            <option value="selesai">Selesai</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>

          {(search || serviceFilter !== 'All' || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setServiceFilter('All');
                setStatusFilter('All');
              }}
              className="text-xs text-rose-600 font-bold px-2 py-1 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200/60">
              <tr>
                <th className="p-4">No. Order & Tanggal</th>
                <th className="p-4">Layanan</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Alamat Garut</th>
                <th className="p-4">Status</th>
                <th className="p-4">Teknisi</th>
                <th className="p-4">Estimasi Biaya</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => {
                  const waLink = createStatusUpdateWaLink(ord, ord.admin_notes);

                  return (
                    <tr
                      key={ord.id}
                      className="hover:bg-teal-50/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrder(ord)}
                    >
                      <td className="p-4">
                        <div className="font-mono font-bold text-teal-800 text-xs">
                          {ord.order_number}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(ord.created_at).toLocaleDateString('id-ID')}
                        </div>
                      </td>

                      <td className="p-4 uppercase font-extrabold text-[10px] text-slate-700">
                        {ord.service_type === 'cctv'
                          ? 'CCTV'
                          : ord.service_type === 'servis_komputer'
                          ? 'Servis'
                          : 'Konsultasi'}
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900">{ord.customer_name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {ord.customer_phone}
                        </div>
                      </td>

                      <td className="p-4 max-w-xs truncate text-slate-600">
                        {ord.address} ({ord.city})
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                            ord.status === 'selesai'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'dikerjakan'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'dijadwalkan'
                              ? 'bg-purple-100 text-purple-800'
                              : ord.status === 'dikonfirmasi'
                              ? 'bg-teal-100 text-teal-800'
                              : ord.status === 'dibatalkan'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>

                      <td className="p-4 text-slate-700 font-semibold">
                        {ord.technician_name || '-'}
                      </td>

                      <td className="p-4 font-bold text-slate-900">
                        {ord.estimated_cost > 0
                          ? `Rp ${ord.estimated_cost.toLocaleString('id-ID')}`
                          : '-'}
                      </td>

                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Detail & Update Status"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                            title="Kirim Update via WhatsApp"
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
                    Tidak ada data pesanan yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <OrderDetailModal
        order={selectedOrder}
        technicians={technicians}
        onClose={() => setSelectedOrder(null)}
        onUpdated={loadData}
      />
    </div>
  );
}
