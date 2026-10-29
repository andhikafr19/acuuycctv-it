'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import {
  Menu,
  X,
  PhoneCall,
  Search,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  Wrench,
  Camera,
  Laptop as LaptopIcon,
  HelpCircle,
} from 'lucide-react';
import { StoreSettings } from '@/lib/types';
import { getStoreSettings } from '@/lib/store';
import { formatWaPhone } from '@/lib/whatsapp';
import { BUSINESS } from '@/lib/business';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    {
      name: 'Layanan',
      dropdown: true,
      items: [
        {
          name: 'Instalasi & Survei CCTV',
          desc: 'Kamera HD/IP Night Vision Garut',
          href: '/cctv',
          icon: Camera,
        },
        {
          name: 'Servis Komputer & Laptop',
          desc: 'Perbaikan hardware, mati total, overheat',
          href: '/servis',
          icon: Wrench,
        },
        {
          name: 'Konsultasi IT & Jaringan',
          desc: 'Setup Wi-Fi, Mikrotik, Server Kantor',
          href: '/konsultasi',
          icon: HelpCircle,
        },
      ],
    },
    { name: 'Katalog Laptop Bekas', href: '/katalog' },
    { name: 'Portofolio CCTV', href: '/portofolio' },
    { name: 'Lacak Pesanan', href: '/lacak', highlight: true },
    { name: 'Kontak & Lokasi', href: '/kontak' },
  ];

  const waNumber = settings ? formatWaPhone(settings.whatsapp_number) : BUSINESS.phone;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      {/* Top Banner (Garut Local Touch) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-teal-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Garansi Resmi Toko & Teknisi Berpengalaman
            </span>
            <span className="text-slate-500">|</span>
            <span>📍 Workshop: {BUSINESS.shortAddress}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>🕒 {settings?.opening_hours || 'Senin - Sabtu: 08:30 - 18:00 WIB'}</span>
            <span className="text-slate-500">|</span>
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
            >
              CS Garut: +{waNumber}
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo showTagline />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link, idx) => {
              if (link.dropdown) {
                return (
                  <div
                    key={idx}
                    className="relative"
                    onMouseEnter={() => setServicesDropdown(true)}
                    onMouseLeave={() => setServicesDropdown(false)}
                  >
                    <button
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        pathname.startsWith('/cctv') ||
                        pathname.startsWith('/servis') ||
                        pathname.startsWith('/konsultasi')
                          ? 'text-teal-700 bg-teal-50'
                          : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          servicesDropdown ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {servicesDropdown && (
                      <div className="absolute left-0 top-full mt-1 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        {link.items?.map((item, itemIdx) => {
                          const IconComp = item.icon;
                          return (
                            <Link
                              key={itemIdx}
                              href={item.href}
                              onClick={() => setServicesDropdown(false)}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/60 transition-colors group"
                            >
                              <div className="p-2 rounded-lg bg-teal-100/60 text-teal-800 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                <IconComp className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-800 group-hover:text-teal-900">
                                  {item.name}
                                </div>
                                <div className="text-xs text-slate-500 line-clamp-1">
                                  {item.desc}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === link.href;

              return (
                <Link
                  key={idx}
                  href={link.href || '/'}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    link.highlight
                      ? 'text-teal-700 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 flex items-center gap-1.5'
                      : isActive
                      ? 'text-teal-700 bg-teal-50'
                      : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  {link.highlight && <Search className="w-3.5 h-3.5 text-teal-600" />}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                'Halo Acuuy CCTV, saya ingin bertanya seputar layanan di Garut'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-sm shadow-md shadow-teal-700/20 hover:from-teal-700 hover:to-emerald-700 hover:shadow-lg transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-white/20" />
              <span>Chat WhatsApp</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/lacak"
              className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              Lacak
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-semibold ${
              pathname === '/' ? 'text-teal-700 bg-teal-50' : 'text-slate-800'
            }`}
          >
            Beranda
          </Link>

          <div className="py-2 border-y border-slate-100 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3">
              Layanan Utama
            </span>
            <Link
              href="/cctv"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-teal-50"
            >
              <Camera className="w-4 h-4 text-teal-600" />
              Instalasi & Survei CCTV
            </Link>
            <Link
              href="/servis"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-teal-50"
            >
              <Wrench className="w-4 h-4 text-teal-600" />
              Servis Komputer & Laptop
            </Link>
            <Link
              href="/konsultasi"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-teal-50"
            >
              <HelpCircle className="w-4 h-4 text-teal-600" />
              Konsultasi IT & Jaringan
            </Link>
          </div>

          <Link
            href="/katalog"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-semibold ${
              pathname === '/katalog' ? 'text-teal-700 bg-teal-50' : 'text-slate-800'
            }`}
          >
            Katalog Laptop Bekas
          </Link>

          <Link
            href="/portofolio"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-semibold ${
              pathname === '/portofolio' ? 'text-teal-700 bg-teal-50' : 'text-slate-800'
            }`}
          >
            Portofolio CCTV Garut
          </Link>

          <Link
            href="/lacak"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-bold text-teal-800 bg-teal-50 border border-teal-200"
          >
            <span>Lacak Status Pesanan</span>
            <Search className="w-4 h-4 text-teal-600" />
          </Link>

          <Link
            href="/kontak"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800"
          >
            Kontak & Lokasi Toko
          </Link>

          <div className="pt-3">
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-center flex items-center justify-center gap-2 shadow-md shadow-teal-800/20"
            >
              <MessageSquare className="w-5 h-5" />
              Hubungi WhatsApp Toko
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
