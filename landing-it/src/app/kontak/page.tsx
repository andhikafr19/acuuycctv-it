'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { StoreSettings } from '@/lib/types';
import { getStoreSettings } from '@/lib/store';
import { formatWaPhone } from '@/lib/whatsapp';
import { BUSINESS } from '@/lib/business';

export default function KontakPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  const waNumber = settings ? formatWaPhone(settings.whatsapp_number) : BUSINESS.phone;
  const address =
    settings?.address_street || `${BUSINESS.streetAddress}, Kec. ${BUSINESS.district}`;
  const city = settings?.city || 'Kabupaten Garut';
  const hours = settings?.opening_hours || 'Senin - Sabtu: 08:30 - 18:00 WIB (Minggu Libur)';

  return (
    <div className="space-y-14 pb-20">
      {/* Header Banner */}
      <section className="relative py-14 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" /> Toko & Workshop Resmi Garut
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Kontak & Lokasi Acuuy CCTV
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kunjungi toko kami untuk konsultasi langsung, cek stok unit laptop bekas, atau serahkan
              komputer yang ingin diservis.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
              <h3 className="text-xl font-black text-slate-900 pb-2 border-b border-slate-100">
                Informasi Toko
              </h3>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Alamat Toko</span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      {address}, {city}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Jam Operasional</span>
                    <p className="text-slate-600 mt-0.5">{hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">WhatsApp CS Garut</span>
                    <p className="text-slate-600 mt-0.5">+{waNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Email Resmi</span>
                    <p className="text-slate-600 mt-0.5">{settings?.email || 'admin@acuuycctv.com'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                    'Halo Acuuy CCTV, saya ingin menanyakan lokasi toko dan layanan'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-700/20 active:scale-95 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat WhatsApp Sekarang
                </a>
              </div>
            </div>

            {/* Service Area Info */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 text-xs space-y-2">
              <span className="font-bold text-teal-400 uppercase tracking-wider block">
                Jangkauan Panggilan Teknisi:
              </span>
              <p className="text-slate-300 leading-relaxed">
                Garut Kota, Tarogong Kidul, Tarogong Kaler, Samarang, Banyuresmi, Karangpawitan,
                Wanaraja, Cilawu, Leles, Kadungora, hingga wilayah Garut Selatan.
              </p>
            </div>
          </div>

          {/* Map Embed Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-md p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Peta Lokasi Workshop</h3>
                <p className="text-xs text-slate-500">
                  {BUSINESS.fullAddress}
                </p>
              </div>
              <a
                href={settings?.google_maps_url || BUSINESS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200"
              >
                <span>Buka Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="w-full h-96 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100">
              <iframe
                title="Peta Lokasi Acuuy CCTV Garut"
                src={BUSINESS.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
