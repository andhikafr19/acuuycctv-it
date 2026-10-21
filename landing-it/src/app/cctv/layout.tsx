import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jasa Pasang CCTV Garut Bergaransi - Paket Rumah & Toko Murah',
  description:
    'Layanan instalasi CCTV Garut resmi & bergaransi 1 tahun. Paket 2/4/8/16 kamera Full HD & IP Camera online HP Android/iPhone. Gratis survei wilayah Garut.',
  keywords: [
    'Pasang CCTV Garut',
    'CCTV Garut',
    'Jasa Pasang CCTV Garut',
    'Paket CCTV Murah Garut',
    'IP Camera Garut',
    'Teknisi CCTV Garut',
    'Harga Pasang CCTV Garut',
  ],
  alternates: {
    canonical: '/cctv',
  },
  openGraph: {
    title: 'Jasa Pasang CCTV Garut Bergaransi | Acuuy CCTV',
    description:
      'Solusi keamanan rumah, kantor & tempat usaha di Garut. Kamera tajam malam hari, setting HP online, pengerjaan rapi dan bergaransi resmi.',
    url: '/cctv',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Berapa biaya jasa pasang CCTV di Garut?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Acuuy CCTV menyediakan paket pasang CCTV lengkap di Garut mulai dari Rp 1.850.000 untuk 2 kamera HD termasuk DVR, harddisk, kabel, konektor, setting online HP, dan jasa pemasangan bergaransi 1 tahun.',
      },
    },
    {
      '@type': 'Question',
      name: 'Apakah CCTV bisa dipantau langsung dari HP secara online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ya, seluruh paket instalasi CCTV kami sudah termasuk konfigurasi cloud P2P online ke smartphone Android atau iPhone secara gratis tanpa biaya langganan bulanan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Apakah ada survei lokasi gratis sebelum pasang CCTV di Garut?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tentu saja. Kami menyediakan layanan survei titik lokasi gratis untuk area Garut Kota, Tarogong, dan sekitarnya guna menentukan jumlah dan posisi kamera paling optimal.',
      },
    },
  ],
};

export default function CctvLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
