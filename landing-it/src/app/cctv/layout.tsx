import type { Metadata } from 'next';
import { cctvFaqs } from './faqs';

export const metadata: Metadata = {
  title: { absolute: 'Jasa Pasang & Instalasi CCTV Garut Bergaransi | Acuuy CCTV' },
  description:
    'Jasa pasang & instalasi CCTV Garut bergaransi 1 tahun. Paket 2/4/8/16 kamera Full HD & IP Camera online di HP. Gratis survei. Toko di Jl. Dayeuhandap No.35, Garut Kota.',
  keywords: [
    'Pasang CCTV Garut',
    'Instalasi CCTV Garut',
    'Jasa Instalasi CCTV Garut',
    'Jasa Pasang CCTV Garut',
    'CCTV Garut',
    'Paket CCTV Murah Garut',
    'IP Camera Garut',
    'Teknisi CCTV Garut',
    'Harga Pasang CCTV Garut',
  ],
  alternates: {
    canonical: '/cctv',
  },
  openGraph: {
    title: 'Jasa Pasang & Instalasi CCTV Garut Bergaransi | Acuuy CCTV',
    description:
      'Solusi keamanan rumah, kantor & tempat usaha di Garut. Kamera tajam malam hari, setting HP online, pengerjaan rapi dan bergaransi resmi.',
    url: '/cctv',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: cctvFaqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Jasa Pasang & Instalasi CCTV Garut',
  serviceType: 'Instalasi CCTV',
  provider: { '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://acuuycctv-it.vercel.app'}/#business` },
  areaServed: { '@type': 'AdministrativeArea', name: 'Kabupaten Garut' },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'IDR',
    lowPrice: '1850000',
    highPrice: '5750000',
  },
};

export default function CctvLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {children}
    </>
  );
}
