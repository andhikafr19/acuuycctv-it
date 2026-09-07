'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  FileSpreadsheet,
  TrendingUp,
  Camera,
  Wrench,
  HelpCircle,
  Laptop,
} from 'lucide-react';
import { Order, Laptop as LaptopType, StoreSettings } from '@/lib/types';
import { getDashboardData } from '@/lib/store';

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [laptops, setLaptops] = useState<LaptopType[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    getDashboardData().then((d) => {
      setOrders(d.orders);
      setLaptops(d.laptops);
      setSettings(d.settings);
    });
  }, []);

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'selesai').length;
  const cctvOrders = orders.filter((o) => o.service_type === 'cctv').length;
  const serviceOrders = orders.filter((o) => o.service_type === 'servis_komputer').length;
  const consultOrders = orders.filter((o) => o.service_type === 'konsultasi_it').length;

  const totalEstimatedRevenue = orders.reduce((sum, o) => sum + (o.estimated_cost || 0), 0);

  const exportToCSV = () => {
    const headers = [
      'No. Order',
      'Tanggal',
      'Layanan',
      'Nama Pelanggan',
      'No. WhatsApp',
      'Alamat',
      'Kota',
      'Status',
      'Teknisi',
      'Estimasi Biaya (IDR)',
      'Deskripsi',
    ];

    const rows = orders.map((o) => [
      `"${o.order_number}"`,
      `"${new Date(o.created_at).toISOString().split('T')[0]}"`,
      `"${o.service_type}"`,
      `"${o.customer_name.replace(/"/g, '""')}"`,
      `"${o.customer_phone}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      `"${o.city}"`,
      `"${o.status}"`,
      `"${o.technician_name || '-'}"`,
      o.estimated_cost || 0,
      `"${o.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `laporan_order_acuuy_cctv_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Laporan Bisnis & Statistik
          </h2>
          <p className="text-xs text-slate-500">
            Ringkasan performa order pengerjaan CCTV, servis, dan penjualan unit laptop di Garut.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Laporan (CSV)</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Seluruh Pesanan
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">{totalOrders}</div>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">
            {completedOrders} pesanan telah selesai
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Akumulasi Nilai Estimasi
          </span>
          <div className="text-2xl font-black text-teal-700 mt-1">
            Rp {totalEstimatedRevenue.toLocaleString('id-ID')}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Total estimasi proyek jasa</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Unit Laptop Katalog
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">{laptops.length}</div>
          <span className="text-xs text-teal-600 font-bold mt-1 block">
            {laptops.filter((l) => l.status === 'tersedia').length} unit ready display Garut
          </span>
        </div>
      </div>

      {/* Breakdown per Layanan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Instalasi & Survei CCTV</h4>
          <div className="text-2xl font-black text-slate-900">{cctvOrders} Pesanan</div>
          <p className="text-xs text-slate-500">
            {totalOrders > 0 ? Math.round((cctvOrders / totalOrders) * 100) : 0}% dari seluruh total
            order
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Servis Laptop & PC</h4>
          <div className="text-2xl font-black text-slate-900">{serviceOrders} Pesanan</div>
          <p className="text-xs text-slate-500">
            {totalOrders > 0 ? Math.round((serviceOrders / totalOrders) * 100) : 0}% dari seluruh
            total order
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Konsultasi IT & LAN</h4>
          <div className="text-2xl font-black text-slate-900">{consultOrders} Pesanan</div>
          <p className="text-xs text-slate-500">
            {totalOrders > 0 ? Math.round((consultOrders / totalOrders) * 100) : 0}% dari seluruh
            total order
          </p>
        </div>
      </div>
    </div>
  );
}
