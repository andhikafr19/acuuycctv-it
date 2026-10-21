import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontak & Lokasi Toko Acuuy CCTV Garut | Survei Gratis',
  description:
    'Hubungi Acuuy CCTV Garut via WhatsApp dan Telepon. Dapatkan layanan konsultasi gratis, survei pemasangan CCTV ke rumah/kantor, atau kunjungi toko kami di Garut.',
  keywords: [
    'Kontak Acuuy CCTV',
    'Alamat Acuuy CCTV Garut',
    'Nomor Telepon Teknisi CCTV Garut',
    'Toko CCTV Terdekat Garut',
  ],
  alternates: {
    canonical: '/kontak',
  },
  openGraph: {
    title: 'Kontak & Lokasi Acuuy CCTV Garut | Survei Gratis',
    description:
      'Layanan respon cepat untuk kebutuhan CCTV dan servis laptop di Garut. Hubungi kami sekarang!',
    url: '/kontak',
  },
};

export default function KontakLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
