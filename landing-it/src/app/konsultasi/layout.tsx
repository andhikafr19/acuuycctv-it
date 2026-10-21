import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Konsultasi IT & Solusi Keamanan CCTV Garut Gratis',
  description:
    'Konsultasikan kebutuhan infrastruktur IT, instalasi jaringan WiFi/LAN kantor, dan sistem kamera CCTV Anda bersama tim ahli Acuuy CCTV Garut.',
  keywords: [
    'Konsultasi IT Garut',
    'Jasa Jaringan WiFi Garut',
    'Konsultan CCTV Garut',
    'Solusi IT Bisnis Garut',
  ],
  alternates: {
    canonical: '/konsultasi',
  },
  openGraph: {
    title: 'Konsultasi IT & Perencanaan CCTV Garut | Acuuy CCTV',
    description:
      'Perencanaan sistem CCTV dan infrastruktur IT yang hemat biaya, handal, dan bergaransi di Garut.',
    url: '/konsultasi',
  },
};

export default function KonsultasiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
