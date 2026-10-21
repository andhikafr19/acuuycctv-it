import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lacak Status Servis Komputer & Pasang CCTV Online | Acuuy CCTV',
  description:
    'Lacak status pengerjaan servis laptop, PC, dan instalasi CCTV Anda di Acuuy CCTV Garut secara transparan dengan memasukkan kode nota servis.',
  keywords: [
    'Lacak Servis Laptop Garut',
    'Cek Status Servis Acuuy',
    'Tracking Pemasangan CCTV',
  ],
  alternates: {
    canonical: '/lacak',
  },
  openGraph: {
    title: 'Lacak Status Servis & Pemasangan CCTV | Acuuy CCTV',
    description:
      'Pantau progres perbaikan laptop atau instalasi kamera CCTV secara transparan dan realtime.',
    url: '/lacak',
  },
};

export default function LacakLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
