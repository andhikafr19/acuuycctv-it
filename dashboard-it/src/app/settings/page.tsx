'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Mail,
  Store,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { StoreSettings } from '@/lib/types';
import { getDashboardData, updateSettingsAction } from '@/lib/store';

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [storeName, setStoreName] = useState('');
  const [tagline, setTagline] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [hours, setHours] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getDashboardData().then((d) => {
      const s = d.settings;
      setSettings(s);
      setStoreName(s.store_name);
      setTagline(s.tagline);
      setWhatsapp(s.whatsapp_number);
      setEmail(s.email);
      setAddress(s.address_street);
      setCity(s.city);
      setProvince(s.province);
      setHours(s.opening_hours);
      setMapsUrl(s.google_maps_url);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const res = await updateSettingsAction({
      store_name: storeName,
      tagline,
      whatsapp_number: whatsapp,
      email,
      address_street: address,
      city,
      province,
      opening_hours: hours,
      google_maps_url: mapsUrl,
    });

    setIsSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } else {
      alert('Gagal menyimpan pengaturan: ' + res.error);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Pengaturan Toko & Informasi Kontak
        </h2>
        <p className="text-xs text-slate-500">
          Ubah nama toko, nomor WhatsApp CS resmi, dan alamat fisik di Garut. Perubahan langsung
          tampil pada web publik <strong>landing-it</strong>.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Pengaturan toko berhasil disimpan dan disinkronkan ke seluruh sistem!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Store className="w-4 h-4 text-teal-600" /> Profil Usaha
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Toko / Usaha</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor WhatsApp Toko (Format: 628...)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Digunakan untuk tombol chat WhatsApp, link booking, dan notifikasi ke pelanggan.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tagline Singkat</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Toko</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location & Hours */}
        <div className="space-y-4 pt-2">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-teal-600" /> Lokasi Fisik & Jam Buka (Garut)
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alamat Lengkap Workshop Garut
            </label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kota / Kabupaten</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Provinsi</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Jam Operasional</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Link Google Maps Lokasi Toko
            </label>
            <input
              type="text"
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  );
}
