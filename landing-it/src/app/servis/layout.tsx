import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jasa Servis Laptop & Komputer Garut Express Bergaransi',
  description:
    'Tempat servis laptop & komputer terdekat di Garut. Mengatasi mati total, overheat, ganti keyboard/LCD, upgrade SSD/RAM, instal ulang Windows, bisa ditunggu & bergaransi.',
  keywords: [
    'Servis Laptop Garut',
    'Servis Komputer Garut',
    'Tempat Servis Laptop di Garut',
    'Perbaikan Laptop Garut',
    'Ganti LCD Laptop Garut',
    'Ganti Baterai Laptop Garut',
    'Upgrade SSD Garut',
  ],
  alternates: {
    canonical: '/servis',
  },
  openGraph: {
    title: 'Jasa Servis Komputer & Laptop Garut Express | Acuuy CCTV',
    description:
      'Teknisi spesialis servis laptop mati total, lemot, ganti sparepart original, pengerjaan cepat dan transparan di Garut.',
    url: '/servis',
  },
};

const servisFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Berapa lama waktu pengerjaan servis laptop di Acuuy Garut?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Untuk pembersihan kipas, ganti thermal paste, instal ulang Windows, dan upgrade RAM/SSD bisa ditunggu (1-2 jam). Untuk perbaikan motherboard atau mati total estimasi 1-3 hari kerja.',
      },
    },
    {
      '@type': 'Question',
      name: 'Apakah ada garansi setelah servis laptop?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ya, seluruh pengerjaan servis di Acuuy CCTV dilengkapi garansi toko resmi mulai dari 1 bulan hingga garansi sparepart distributor resmi.',
      },
    },
    {
      '@type': 'Question',
      name: 'Apakah bisa antar jemput laptop servis di area Garut?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bisa! Kami melayani layanan pickup & delivery laptop untuk area Garut Kota, Tarogong, dan sekitarnya.',
      },
    },
  ],
};

export default function ServisLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servisFaqSchema) }}
      />
      {children}
    </>
  );
}
