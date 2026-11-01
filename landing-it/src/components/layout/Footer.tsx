'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  Laptop,
  Camera,
  Wrench,
  HelpCircle,
} from 'lucide-react';
import { StoreSettings } from '@/lib/types';
import { getStoreSettings } from '@/lib/store';
import { formatWaPhone } from '@/lib/whatsapp';
import { BUSINESS } from '@/lib/business';

export default function Footer() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  const waNumber = settings ? formatWaPhone(settings.whatsapp_number) : BUSINESS.phone;
  const address = settings?.address_street || `${BUSINESS.streetAddress}, Kec. ${BUSINESS.district}`;
  const city = settings?.city || 'Kabupaten Garut';
  const hours = settings?.opening_hours || 'Senin - Sabtu: 08:30 - 18:00 WIB';

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Upper Features Strip */}
      <div className="border-b border-slate-800/80 py-8 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Garansi Unit & Servis</h4>
              <p className="text-xs text-slate-400">Garansi toko 1 bulan full part & pengerjaan</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Teknisi Berpengalaman</h4>
              <p className="text-xs text-slate-400">Pakar CCTV, jaringan, dan mesin motherboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Area Layanan Garut</h4>
              <p className="text-xs text-slate-400">Siap panggilan instalasi se-Kabupaten Garut</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Jam Operasional Jelas</h4>
              <p className="text-xs text-slate-400">Senin - Sabtu, siap melayani Anda di toko</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo showTagline />
            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              Pusat solusi teknologi terpadu di Garut. Melayani instalasi sistem kamera keamanan
              CCTV, servis komputer/laptop express bergaransi, jual-beli laptop second berkualitas,
              serta konsultasi infrastruktur IT untuk kantor dan usaha Anda.
            </p>
            <div className="pt-2 flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <span>
                  {address}, {city}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{hours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors"
                >
                  +{waNumber} (WhatsApp CS)
                </a>
              </div>
            </div>
          </div>

          {/* Layanan Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/cctv"
                  className="text-slate-400 hover:text-teal-400 flex items-center gap-1.5 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-teal-500" />
                  Instalasi CCTV Garut
                </Link>
              </li>
              <li>
                <Link
                  href="/servis"
                  className="text-slate-400 hover:text-teal-400 flex items-center gap-1.5 transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5 text-teal-500" />
                  Servis Komputer & Laptop
                </Link>
              </li>
              <li>
                <Link
                  href="/konsultasi"
                  className="text-slate-400 hover:text-teal-400 flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-teal-500" />
                  Konsultasi IT & LAN
                </Link>
              </li>
              <li>
                <Link
                  href="/katalog"
                  className="text-slate-400 hover:text-teal-400 flex items-center gap-1.5 transition-colors"
                >
                  <Laptop className="w-3.5 h-3.5 text-teal-500" />
                  Katalog Laptop Bekas
                </Link>
              </li>
              <li>
                <Link
                  href="/jual-laptop"
                  className="text-slate-400 hover:text-teal-400 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-teal-500" />
                  Trade-In / Jual Laptop
                </Link>
              </li>
            </ul>
          </div>

          {/* Bantuan & Akses Cepat */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white">
              Akses Cepat
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/kontak"
                  className="text-slate-400 hover:text-teal-400 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Lokasi Toko & Jam Buka
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                    'Halo Acuuy CCTV, saya butuh bantuan darurat untuk servis/CCTV'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-teal-400 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Panggilan Darurat / Survei
                </a>
              </li>
            </ul>
          </div>

          {/* Maps / Area Garut */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white">
              Lokasi Garut
            </h4>
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 p-2 text-xs space-y-2">
              <p className="text-slate-400">
                Pemasangan CCTV & antar-jemput servis melayani Garut Kota, Tarogong, Samarang,
                Wanaraja, Cilawu, Banyuresmi, hingga wilayah sekitarnya.
              </p>
              <a
                href={settings?.google_maps_url || 'https://maps.google.com/?q=Garut'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-teal-400 font-bold hover:underline"
              >
                <MapPin className="w-3 h-3" /> Buka di Google Maps →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Acuuy CCTV. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1.5">
            Dibuat untuk kebutuhan operasional resmi Acuuy CCTV Garut
          </p>
        </div>
      </div>
    </footer>
  );
}
