import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portofolio Pemasangan CCTV & Servis Komputer di Garut',
  description:
    'Dokumentasi proyek instalasi kamera CCTV rumah, ruko, pabrik, sekolah, dan hasil servis laptop di Garut oleh teknisi profesional Acuuy CCTV.',
  keywords: [
    'Portofolio CCTV Garut',
    'Proyek Pemasangan CCTV Garut',
    'Hasil Pasang CCTV Garut',
    'Galeri Servis Laptop Garut',
  ],
  alternates: {
    canonical: '/portofolio',
  },
  openGraph: {
    title: 'Portofolio Pemasangan CCTV & Servis Garut | Acuuy CCTV',
    description:
      'Lihat galeri proyek pemasangan CCTV dan perbaikan laptop terpercaya di Garut oleh tim Acuuy CCTV.',
    url: '/portofolio',
  },
};

export default function PortofolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
