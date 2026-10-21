import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Katalog Paket CCTV & Spesifikasi Laptop Siap Pakai Garut',
  description:
    'Daftar lengkap harga paket pemasangan CCTV Hikvision / Dahua dan stok laptop bekas berkualitas bergaransi di Acuuy CCTV Garut.',
  keywords: [
    'Katalog CCTV Garut',
    'Harga Paket CCTV Garut',
    'Daftar Laptop Garut',
    'Kamera Pengawas Garut',
  ],
  alternates: {
    canonical: '/katalog',
  },
  openGraph: {
    title: 'Katalog Paket CCTV & Laptop Bekas Garut | Acuuy CCTV',
    description:
      'Cek daftar paket CCTV dan stok laptop terupdate dengan harga terjangkau di Garut.',
    url: '/katalog',
  },
};

export default function KatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
