'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import {
  LayoutDashboard,
  ClipboardList,
  Laptop,
  Inbox,
  BarChart3,
  Settings,
  ExternalLink,
  Camera,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/login') return null;

  const menuItems = [
    { name: 'Ringkasan', href: '/', icon: LayoutDashboard },
    { name: 'Manajemen Order', href: '/orders', icon: ClipboardList },
    { name: 'Portofolio CCTV', href: '/portfolios', icon: Camera },
    { name: 'Inventaris Laptop', href: '/laptops', icon: Laptop },
    { name: 'Pengajuan Jual', href: '/submissions', icon: Inbox },
    { name: 'Laporan & Ekspor', href: '/reports', icon: BarChart3 },
    { name: 'Pengaturan Toko & WA', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('acuuy_admin_session');
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Logo Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <Logo showTagline />
          <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1 text-xs font-bold">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-700/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Bottom Controls */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
        >
          <span>Buka Web Publik</span>
          <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
