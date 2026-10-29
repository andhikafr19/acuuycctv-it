import { Order, Laptop, StoreSettings } from './types';

export function formatWaPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function createBookingWaLink(order: Order, settings: StoreSettings): string {
  const storePhone = formatWaPhone(settings.whatsapp_number);
  const serviceName =
    order.service_type === 'cctv'
      ? 'Instalasi / Survei CCTV'
      : order.service_type === 'servis_komputer'
      ? 'Servis Komputer / Laptop'
      : 'Konsultasi IT';

  const text = `*Halo Admin ${settings.store_name}*,

Saya baru saja membuat pengajuan jasa via website:
- *No. Order:* ${order.order_number}
- *Layanan:* ${serviceName}
- *Nama Pelanggan:* ${order.customer_name}
- *No. HP:* ${order.customer_phone}
- *Alamat:* ${order.address} (${order.city})
- *Keterangan / Kendala:* ${order.description}

Mohon bantuan konfirmasi dan tindak lanjutnya. Terima kasih!`;

  return `https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`;
}

export function createLaptopInquiryWaLink(laptop: Laptop, settings: StoreSettings): string {
  const storePhone = formatWaPhone(settings.whatsapp_number);
  const priceFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(laptop.discount_price || laptop.price);

  const text = `*Halo ${settings.store_name}*,

Saya tertarik dengan unit laptop bekas ini yang ada di website:
- *Unit:* ${laptop.title}
- *Spesifikasi:* ${laptop.processor}, RAM ${laptop.ram}, ${laptop.storage}
- *Kondisi:* ${laptop.condition_grade}
- *Harga:* ${priceFormatted}

Apakah unit ini masih tersedia? Bisa minta info foto detail / kelengkapannya? Terima kasih.`;

  return `https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`;
}

export function createDirectConsultationWaLink(settings: StoreSettings, topic?: string): string {
  const storePhone = formatWaPhone(settings.whatsapp_number);
  const text = `*Halo ${settings.store_name}*,

Saya ingin konsultasi seputar kebutuhan ${topic || 'CCTV & IT'} di Garut. Mohon info ketersediaan jadwal survei atau konsultasi. Terima kasih!`;

  return `https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`;
}

export function createStatusUpdateWaLink(order: Order, notes?: string): string {
  const customerPhone = formatWaPhone(order.customer_phone);
  const statusLabels: Record<string, string> = {
    baru: 'Diterima di Antrean',
    dikonfirmasi: 'Dikonfirmasi oleh Admin',
    dijadwalkan: 'Dijadwalkan untuk Kunjungan / Pengerjaan',
    dikerjakan: 'Sedang Dikerjakan oleh Teknisi',
    selesai: 'Selesai & Siap Diambil / Digunakan',
    dibatalkan: 'Dibatalkan',
  };

  const statusText = statusLabels[order.status] || order.status;

  const text = `*Update Pesanan - Acuuy CCTV & Komputer Garut*
Halo Sdr/i *${order.customer_name}*,

Pesanan Anda dengan nomor *${order.order_number}* saat ini berstatus:
📌 *${statusText.toUpperCase()}*

${order.technician_name ? `👨‍🔧 Teknisi Bertugas: ${order.technician_name}\n` : ''}${
    order.estimated_cost > 0
      ? `💰 Estimasi Biaya: Rp ${order.estimated_cost.toLocaleString('id-ID')}\n`
      : ''
  }${notes ? `📝 Catatan: ${notes}\n` : ''}
Terima kasih atas kepercayaan Anda!`;

  return `https://wa.me/${customerPhone}?text=${encodeURIComponent(text)}`;
}

export function createTradeInNegotiationWaLink(submission: any, offeredPrice: number, messageNotes?: string): string {
  const customerPhone = formatWaPhone(submission.customer_phone);
  const text = `*Halo Sdr/i ${submission.customer_name}*,

Mengenai pengajuan jual/trade-in laptop Anda di *Acuuy CCTV Garut* (${submission.submission_number}):
- *Unit:* ${submission.brand} ${submission.model}
- *Spesifikasi:* ${submission.specifications}
- *Harga Ekspektasi:* Rp ${Number(submission.expected_price).toLocaleString('id-ID')}
- *Penawaran Estimasi Toko:* Rp ${Number(offeredPrice).toLocaleString('id-ID')}

${messageNotes ? `Catatan Toko: ${messageNotes}\n\n` : ''}Jika Anda berkenan, unit dapat dibawa ke workshop toko kami di Jl. Dayeuhandap No.35, Garut Kota untuk pengecekan fisik dan test fungsi langsung. Terima kasih!`;

  return `https://wa.me/${customerPhone}?text=${encodeURIComponent(text)}`;
}
