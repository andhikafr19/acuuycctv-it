'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Laptop,
  Inbox,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  MessageSquare,
  Wrench,
  Camera,
  HelpCircle,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Order, Laptop as LaptopType, SellSubmission, Technician, StoreSettings } from '@/lib/types';
import { getDashboardData } from '@/lib/store';
import OrderDetailModal from '@/components/orders/OrderDetailModal';
import LaptopFormModal from '@/components/laptops/LaptopFormModal';

export default function DashboardOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [laptops, setLaptops] = useState<LaptopType[]>([]);
  const [submissions, setSubmissions] = useState<SellSubmission[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [laptopModalOpen, setLaptopModalOpen] = useState(false);

  const loadData = () => {
    getDashboardData().then((d) => {
      setOrders(d.orders);
      setLaptops(d.laptops);
      setSubmissions(d.submissions);
      setTechnicians(d.technicians);
      setSettings(d.settings);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => o.status !== 'selesai' && o.status !== 'dibatalkan').length;
  const availableLaptops = laptops.filter((l) => l.status === 'tersedia').length;
  const pendingSubmissions = submissions.filter((s) => s.status === 'menunggu_review').length;
  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.estimated_cost || 0), 0);

  return (
    <div className="space-y-8">
      {/* Top Banner / Store Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Operasional Aktif • Garut
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Selamat Datang di Admin {settings?.store_name || 'Acuuy CCTV'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {settings?.address_street}, {settings?.city} • WA CS: +{settings?.whatsapp_number}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setLaptopModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Tambah Laptop
          </button>
          <Link
            href="/orders"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <ClipboardList className="w-4 h-4 text-teal-400" /> Lihat Semua Order
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Order Masuk
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalOrders}</div>
            <span className="text-[11px] text-teal-600 font-bold mt-1 block">
              {activeOrders} order sedang diproses
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stok Laptop Ready
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">{availableLaptops}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">dari {laptops.length} total unit</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Laptop className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pengajuan Jual Baru
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">{pendingSubmissions}</div>
            <span className="text-[11px] text-amber-600 font-bold mt-1 block">
              Perlu ditinjau & dinego
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Estimasi Nilai Order
            </span>
            <div className="text-xl font-black text-teal-700 mt-1">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Akumulasi estimasi berjalan</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2-Column Split: Recent Orders & Technicians Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Pesanan Terbaru Masuk</h3>
              <p className="text-xs text-slate-500">
                Klik baris pesanan untuk update status atau kirim notifikasi WA pelanggan
              </p>
            </div>
            <Link
              href="/orders"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">No. Order</th>
                  <th className="p-3">Pelanggan</th>
                  <th className="p-3">Layanan</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Teknisi</th>
                  <th className="p-3 rounded-r-xl text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="hover:bg-teal-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="p-3 font-mono font-bold text-teal-800">{ord.order_number}</td>
                    <td className="p-3 font-semibold text-slate-900">
                      <div>{ord.customer_name}</div>
                      <div className="text-[10px] text-slate-400">{ord.customer_phone}</div>
                    </td>
                    <td className="p-3 uppercase font-bold text-slate-600 text-[10px]">
                      {ord.service_type}
                    </td>
                    <td className="p-3">
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
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">
                      {ord.technician_name || '-'}
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-teal-600 font-bold group-hover:underline">Kelola →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technicians & Quick Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 pb-2 border-b border-slate-100">
              Tim Teknisi Garut
            </h3>
            <div className="space-y-3">
              {technicians.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{t.name}</span>
                    <span className="text-[11px] text-slate-500">{t.specialization}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-teal-50 rounded-3xl p-6 border border-teal-200/60 text-xs text-teal-950 space-y-2">
            <span className="font-black text-sm block">💡 Sinkronisasi Data Otomatis</span>
            <p className="text-teal-900/80 leading-relaxed">
              Order yang diajukan oleh customer di web publik <strong>landing-it</strong> langsung
              terbaca di dashboard ini. Perubahan status pengerjaan atau stok laptop juga langsung
              ter-update di web publik!
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <OrderDetailModal
        order={selectedOrder}
        technicians={technicians}
        onClose={() => setSelectedOrder(null)}
        onUpdated={loadData}
      />

      <LaptopFormModal
        laptop={null}
        isOpen={laptopModalOpen}
        onClose={() => setLaptopModalOpen(false)}
        onSaved={loadData}
      />
    </div>
  );
}
