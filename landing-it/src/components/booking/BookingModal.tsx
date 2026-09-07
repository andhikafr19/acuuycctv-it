'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Camera,
  Wrench,
  HelpCircle,
  Phone,
  User,
  MapPin,
  FileText,
  Copy,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ServiceType, Order } from '@/lib/types';
import { submitOrder, getStoreSettings } from '@/lib/store';
import { createBookingWaLink } from '@/lib/whatsapp';
import Link from 'next/link';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: ServiceType;
  presetDetails?: Record<string, any>;
}

export default function BookingModal({
  isOpen,
  onClose,
  defaultService = 'cctv',
  presetDetails = {},
}: BookingModalProps) {
  const [serviceType, setServiceType] = useState<ServiceType>(defaultService);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Garut');
  const [description, setDescription] = useState('');

  // Specific service fields
  const [cameraCount, setCameraCount] = useState('4');
  const [propertyType, setPropertyType] = useState('Rumah Tinggal');
  const [deviceBrand, setDeviceBrand] = useState('');
  const [deviceIssue, setDeviceIssue] = useState('');
  const [consultationTopic, setConsultationTopic] = useState('Jaringan Wi-Fi & LAN Kantor');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateOrderNumber = (type: ServiceType) => {
    const prefix =
      type === 'cctv' ? 'ACY-CCTV' : type === 'servis_komputer' ? 'ACY-SRV' : 'ACY-CON';
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${dateStr}-${rand}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert('Mohon lengkapi Nama, Nomor HP (WhatsApp), dan Alamat Anda.');
      return;
    }

    setIsSubmitting(true);
    const orderNumber = generateOrderNumber(serviceType);

    let specificDetails: Record<string, any> = { ...presetDetails };
    if (serviceType === 'cctv') {
      specificDetails = {
        ...specificDetails,
        camera_count: Number(cameraCount),
        property_type: propertyType,
      };
    } else if (serviceType === 'servis_komputer') {
      specificDetails = {
        ...specificDetails,
        device_brand: deviceBrand || 'Tidak Disebutkan',
        symptoms: deviceIssue || description,
      };
    } else if (serviceType === 'konsultasi_it') {
      specificDetails = {
        ...specificDetails,
        topic: consultationTopic,
      };
    }

    const fullDescription =
      description ||
      (serviceType === 'cctv'
        ? `Pengajuan survei & pemasangan paket ${cameraCount} kamera untuk ${propertyType}`
        : serviceType === 'servis_komputer'
        ? `Keluhan servis: ${deviceBrand} - ${deviceIssue}`
        : `Permintaan konsultasi IT terkait ${consultationTopic}`);

    const res = await submitOrder({
      order_number: orderNumber,
      service_type: serviceType,
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      address,
      city: city || 'Garut',
      description: fullDescription,
      specific_details: specificDetails,
    });

    setIsSubmitting(false);
    if (res.success && res.data) {
      setSubmittedOrder(res.data);
    } else {
      alert('Terjadi kesalahan saat memproses order: ' + (res.error || 'Silakan coba lagi.'));
    }
  };

  const handleCopy = () => {
    if (submittedOrder) {
      navigator.clipboard.writeText(submittedOrder.order_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Acuuy CCTV & IT Garut
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            {submittedOrder ? 'Pemesanan Berhasil Terkirim!' : 'Formulir Pemesanan Layanan'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {submittedOrder
              ? 'Simpan nomor order Anda untuk melacak status pengerjaan secara berkala.'
              : 'Isi data kebutuhan Anda, tim kami akan segera menghubungi untuk konfirmasi & jadwal survei.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submittedOrder ? (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Nomor Order Pelacakan Anda
                </span>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-teal-700 font-mono tracking-tight bg-teal-50 px-4 py-1.5 rounded-xl border border-teal-200">
                    {submittedOrder.order_number}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Salin Nomor Order"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-teal-600 font-semibold mt-1.5 animate-in fade-in">
                    ✓ Berhasil disalin ke clipboard!
                  </p>
                )}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pemesan:</span>
                  <span className="font-bold text-slate-800">{submittedOrder.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">WhatsApp:</span>
                  <span className="font-bold text-slate-800">{submittedOrder.customer_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Alamat:</span>
                  <span className="font-bold text-slate-800 text-right max-w-[240px] truncate">
                    {submittedOrder.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status Saat Ini:</span>
                  <span className="inline-flex px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold uppercase">
                    Menunggu Konfirmasi Admin
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={`https://wa.me/6285223344556?text=${encodeURIComponent(
                    `Halo Admin Acuuy CCTV Garut, saya sudah submit pesanan dengan No. Order: ${submittedOrder.order_number}. Mohon konfirmasinya ya. Terima kasih!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 active:scale-95 transition-all text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Konfirmasi Cepat via WhatsApp Toko
                </a>

                <Link
                  href={`/lacak?order=${submittedOrder.order_number}`}
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-teal-600" />
                  Buka Halaman Lacak Status Pesanan
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pilih Layanan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceType('cctv')}
                    className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all ${
                      serviceType === 'cctv'
                        ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Pasang CCTV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('servis_komputer')}
                    className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all ${
                      serviceType === 'servis_komputer'
                        ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Servis Laptop/PC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('konsultasi_it')}
                    className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all ${
                      serviceType === 'konsultasi_it'
                        ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Konsultasi IT</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Service Specific Fields */}
              {serviceType === 'cctv' && (
                <div className="bg-teal-50/50 rounded-2xl p-3.5 border border-teal-100 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Jumlah Kamera
                      </label>
                      <select
                        value={cameraCount}
                        onChange={(e) => setCameraCount(e.target.value)}
                        className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-white px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      >
                        <option value="2">Paket 2 Kamera</option>
                        <option value="4">Paket 4 Kamera (Populer)</option>
                        <option value="8">Paket 8 Kamera</option>
                        <option value="16">Paket 16 Kamera</option>
                        <option value="0">Custom / Survei Lokasi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tipe Properti
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-white px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      >
                        <option value="Rumah Tinggal">Rumah Tinggal</option>
                        <option value="Toko / Ruko">Toko / Ruko</option>
                        <option value="Kantor / Sekolah">Kantor / Sekolah</option>
                        <option value="Gudang / Pabrik">Gudang / Pabrik</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {serviceType === 'servis_komputer' && (
                <div className="bg-teal-50/50 rounded-2xl p-3.5 border border-teal-100 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Merk & Tipe Perangkat
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Asus VivoBook / PC Rakitan"
                        value={deviceBrand}
                        onChange={(e) => setDeviceBrand(e.target.value)}
                        className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Gejala Masalah
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Mati total / Lemot / Overheat"
                        value={deviceIssue}
                        onChange={(e) => setDeviceIssue(e.target.value)}
                        className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {serviceType === 'konsultasi_it' && (
                <div className="bg-teal-50/50 rounded-2xl p-3.5 border border-teal-100 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Topik Konsultasi
                  </label>
                  <select
                    value={consultationTopic}
                    onChange={(e) => setConsultationTopic(e.target.value)}
                    className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-white px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Jaringan Wi-Fi & LAN Kantor">Jaringan Wi-Fi & LAN Kantor</option>
                    <option value="Setup Server / File Sharing">Setup Server / File Sharing</option>
                    <option value="Maintenance Berkala IT Usaha">Maintenance Berkala IT Usaha</option>
                    <option value="Pengadaan Komputer Kantor">Pengadaan Komputer Kantor</option>
                  </select>
                </div>
              )}

              {/* Customer Contact Information */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="Nama Anda"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        placeholder="08xxxxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Lengkap (Lokasi Pemasangan/Servis){' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <textarea
                      required
                      rows={2}
                      placeholder="Nama jalan, nomor rumah/toko, kelurahan, kecamatan di Garut"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan Tambahan / Kebutuhan Khusus
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Butuh survei hari Sabtu jam 10 pagi, atau butuh kabel outdoor"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-slate-900 hover:from-teal-700 hover:to-black text-white font-extrabold text-sm shadow-lg shadow-teal-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Memproses Order...</span>
                  ) : (
                    <>
                      <span>Kirim Pengajuan Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-2">
                  🔒 Data Anda aman. Kami tidak akan membagikan nomor telepon Anda ke pihak ketiga.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
