'use client';

import React, { useState } from 'react';
import {
  Camera,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Eye,
  HardDrive,
  Cpu,
  ArrowRight,
  PhoneCall,
  Sparkles,
  MapPin,
  ChevronDown,
  ClipboardCheck,
  Wrench,
} from 'lucide-react';
import BookingModal from '@/components/booking/BookingModal';
import { BUSINESS, waLink } from '@/lib/business';
import { cctvFaqs } from './faqs';

const serviceAreas = [
  'Garut Kota',
  'Tarogong Kidul',
  'Tarogong Kaler',
  'Karangpawitan',
  'Banyuresmi',
  'Samarang',
  'Wanaraja',
  'Cilawu',
  'Bayongbong',
  'Leles',
  'Kadungora',
  'Limbangan',
];

const steps = [
  { icon: PhoneCall, title: 'Konsultasi WhatsApp', desc: 'Ceritakan kebutuhan & lokasi Anda, gratis tanya rekomendasi.' },
  { icon: MapPin, title: 'Survei Lokasi Gratis', desc: 'Teknisi datang menentukan titik & jumlah kamera paling optimal.' },
  { icon: ClipboardCheck, title: 'Penawaran Transparan', desc: 'Rincian harga unit, kabel & jasa jelas sebelum pengerjaan.' },
  { icon: Wrench, title: 'Instalasi Rapi', desc: 'Pemasangan kamera, tarik kabel rapi, setting DVR/NVR.' },
  { icon: Smartphone, title: 'Setting Online di HP', desc: 'CCTV langsung bisa dipantau dari Android / iPhone.' },
  { icon: ShieldCheck, title: 'Garansi 1 Tahun', desc: 'Layanan purnajual & perbaikan cepat area Garut.' },
];

export default function CctvPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('4 Kamera');

  const packages = [
    {
      name: 'Paket 2 Kamera HD',
      tag: 'Hemat Rumah',
      price: 'Rp 1.850.000',
      description: 'Ideal untuk pengawasan teras rumah, garasi mobil, atau pintu gerbang utama.',
      features: [
        '2 Unit Kamera Indoor / Outdoor HD 2MP',
        'DVR 4 Channel (Bisa Upgrade Kamera)',
        'Harddisk 500GB Khusus CCTV',
        'Kabel Coaxial + Power 30 Meter',
        'Power Supply & Konektor Lengkap',
        'Setting Online ke HP Android / iPhone',
        'Gratis Jasa Pasang Area Garut Kota',
        'Garansi Unit & Pemasangan 1 Tahun',
      ],
    },
    {
      name: 'Paket 4 Kamera Full HD',
      tag: 'Paling Populer',
      price: 'Rp 2.950.000',
      popular: true,
      description:
        'Pilihan terfavorit pemilik ruko, toko kelontong, kafe, dan rumah tinggal bertingkat.',
      features: [
        '4 Unit Kamera 2MP / 3MP ColorVu (Berwarna 24 Jam)',
        'DVR 4 Channel Hybrid Audio Built-in',
        'Harddisk 1TB Surveillance (Rekam 2-3 Minggu)',
        'Kabel Coaxial + Power 60 Meter',
        'Power Supply Jaring & Konektor Berkualitas',
        'Setting Pantau di HP / Tablet / PC',
        'Gratis Instalasi Rapi oleh Teknisi Garut',
        'Garansi Toko & Unit 1 Tahun',
      ],
    },
    {
      name: 'Paket 8 Kamera IP Smart',
      tag: 'Bisnis & Toko Besar',
      price: 'Rp 5.750.000',
      description:
        'Sistem pengawasan menyeluruh untuk minimarket, gudang, kantor, dan pabrik di Garut.',
      features: [
        '8 Unit Kamera HD/IP Crystal Clear',
        'NVR / DVR 8 Channel High Performance',
        'Harddisk 2TB Surveillance Rekam Panjang',
        'Kabel Instalasi 120 Meter + Conduit Rapi',
        'Fitur Smart Motion Alert ke Smartphone',
        'Setting Multi-User Monitoring',
        'Garansi Resmi 1 Tahun + Free Kunjungan Maintenance 1x',
      ],
    },
    {
      name: 'Paket 16 Kamera Enterprise',
      tag: 'Gudang & Instansi',
      price: 'Konsultasi / Custom',
      description:
        'Infrastruktur kamera terintegrasi untuk sekolah, instansi dinas, pesantren, atau area pergudangan.',
      features: [
        'Hingga 16 Titik Kamera IP 4MP / 5MP Ultra HD',
        'NVR 16 Channel + PoE Switch Jaringan',
        'Harddisk 4TB Surveillance Grade',
        'Instalasi Kabel UTP Cat6 Berstandar Rapi',
        'Central Monitoring Console Setup',
        'Pelatihan Pengoperasian Operator Toko/Admin',
        'SLA Servis Prioritas & Garansi 1 Tahun',
      ],
    },
  ];

  const handleOrderPackage = (pkgName: string) => {
    setSelectedPackage(pkgName);
    setModalOpen(true);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Header */}
      <section className="relative py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <Camera className="w-3.5 h-3.5" /> Jasa Pemasangan CCTV Resmi Garut
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Jasa Pasang & Instalasi CCTV Garut, Rapi & Bisa Dipantau dari HP.
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Tingkatkan proteksi aset rumah dan tempat usaha Anda di Garut. Dikerjakan oleh teknisi
              berpengalaman dengan tarikan kabel rapi, rekaman tajam siang & malam, serta setting
              online cepat ke smartphone Anda.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Form Pengajuan Survei CCTV
              </button>
              <a
                href={waLink('Halo Acuuy CCTV, saya mau konsultasi paket pasang CCTV di Garut')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 active:scale-95 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-teal-400" /> Tanya Rekomendasi Titik
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Live View di HP</h4>
              <p className="text-[11px] text-slate-500">Android & iPhone 24/7</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">ColorVu Malam Hari</h4>
              <p className="text-[11px] text-slate-500">Tetap berwarna saat gelap</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Rekam Otomatis</h4>
              <p className="text-[11px] text-slate-500">Harddisk khusus CCTV awet</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Garansi Pemasangan</h4>
              <p className="text-[11px] text-slate-500">Layanan purnajual Garut</p>
            </div>
          </div>
        </div>
      </section>

      {/* Package Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pilihan Paket Pasang CCTV Lengkap
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Harga sudah termasuk unit kamera, DVR/NVR, kabel, konektor, harddisk, dan jasa instalasi.
            Tinggal terima beres!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                pkg.popular
                  ? 'bg-gradient-to-b from-slate-900 to-teal-950 text-white shadow-xl scale-[1.02] border-2 border-teal-500'
                  : 'bg-white border border-slate-200/80 shadow-sm hover:shadow-lg text-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      pkg.popular
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-teal-50 text-teal-800 border border-teal-200'
                    }`}
                  >
                    {pkg.tag}
                  </span>
                </div>

                <h3 className="text-lg font-black">{pkg.name}</h3>
                <p
                  className={`text-xs mt-1 line-clamp-2 ${
                    pkg.popular ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {pkg.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200/20">
                  <span className="text-xl font-black text-teal-400">{pkg.price}</span>
                </div>

                <ul className="mt-5 space-y-2 text-xs">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          pkg.popular ? 'text-teal-400' : 'text-teal-600'
                        }`}
                      />
                      <span className={pkg.popular ? 'text-slate-200' : 'text-slate-700'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/20">
                <button
                  onClick={() => handleOrderPackage(pkg.name)}
                  className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-md transition-all ${
                    pkg.popular
                      ? 'bg-teal-400 hover:bg-teal-300 text-slate-950'
                      : 'bg-slate-900 hover:bg-teal-600 text-white'
                  }`}
                >
                  Pilih Paket Ini
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Installation Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Proses Instalasi CCTV di Garut
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Alur kerja jelas dari konsultasi hingga CCTV aktif dan bisa dipantau dari HP Anda.
          </p>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <span className="absolute top-4 right-5 text-3xl font-black text-slate-100 group-hover:text-teal-100 transition-colors">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">{s.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Service Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Area Layanan Pasang CCTV di Kabupaten Garut
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Teknisi kami berangkat dari workshop di <strong>{BUSINESS.shortAddress}</strong> dan
              melayani pemasangan CCTV rumah, toko, kantor, sekolah, hingga gudang di seluruh
              kecamatan berikut:
            </p>
            <a
              href={BUSINESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-teal-300 hover:text-teal-200"
            >
              <MapPin className="w-4 h-4" /> Lihat lokasi toko di Google Maps
            </a>
          </div>
          <ul className="flex flex-wrap gap-2">
            {serviceAreas.map((area) => (
              <li
                key={area}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 hover:border-teal-400/60 hover:text-teal-200 transition-colors"
              >
                Pasang CCTV {area}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ (visible, mirrors FAQPage schema) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-center mb-8">
          Pertanyaan Seputar Jasa Pasang CCTV Garut
        </h2>
        <div className="space-y-3">
          {cctvFaqs.map((f) => (
            <details
              key={f.q}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm open:shadow-md open:border-teal-300 transition-all"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 text-sm font-bold text-slate-900">
                <h3>{f.q}</h3>
                <ChevronDown className="w-4 h-4 shrink-0 text-teal-600 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 -mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* NAP CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <address className="not-italic space-y-1">
            <p className="text-lg font-black text-slate-900">{BUSINESS.name}</p>
            <p className="text-xs sm:text-sm text-slate-600">{BUSINESS.fullAddress}</p>
            <p className="text-xs sm:text-sm text-slate-600">
              WhatsApp / Telp:{' '}
              <a href={`tel:+${BUSINESS.phone}`} className="font-bold text-teal-700 hover:underline">
                {BUSINESS.phoneDisplay}
              </a>
            </p>
          </address>
          <a
            href={waLink('Halo Acuuy CCTV, saya mau jadwalkan survei pasang CCTV di Garut')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <PhoneCall className="w-4 h-4" /> Jadwalkan Survei Gratis <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultService="cctv"
        presetDetails={{ selected_package: selectedPackage }}
      />
    </div>
  );
}
