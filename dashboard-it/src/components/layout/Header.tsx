'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, ShieldCheck, UserCheck, MapPin } from 'lucide-react';
import { StoreSettings } from '@/lib/types';
import { getDashboardData } from '@/lib/store';

export default function Header() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    getDashboardData().then((d) => setSettings(d.settings));
  }, []);

  if (pathname === '/login') return null;

  const getTitle = () => {
    switch (pathname) {
      case '/':
        return 'Ringkasan Eksekutif & Operasional';
      case '/orders':
        return 'Manajemen Pesanan & Pengerjaan';
      case '/portfolios':
        return 'Manajemen Portofolio CCTV Garut';
      case '/laptops':
        return 'Inventaris & Stok Laptop Bekas';
      case '/submissions':
        return 'Pengajuan Jual / Trade-In Pelanggan';
      case '/reports':
        return 'Laporan Bisnis & Ekspor Data';
      case '/settings':
        return 'Pengaturan Toko, Kontak & Pesan WhatsApp';
      default:
        return 'Admin Acuuy CCTV';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-extrabold text-slate-900 tracking-tight">{getTitle()}</h1>
        <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
          <MapPin className="w-3 h-3 text-teal-600" />
          {settings?.city || 'Garut'}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center border border-teal-200">
            A
          </div>
          <div className="hidden sm:block text-left">
            <span className="font-extrabold text-slate-900 block leading-tight">Admin Toko</span>
            <span className="text-[10px] text-slate-500">Acuuy CCTV Garut</span>
          </div>
        </div>
      </div>
    </header>
  );
}
