import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloating from '@/components/layout/WhatsAppFloating';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://acuuycctv-it.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Acuuy CCTV & Servis Komputer Garut | Solusi CCTV, Laptop & IT',
    template: '%s | Acuuy CCTV Garut',
  },
  description:
    'Jasa instalasi CCTV bergaransi, servis komputer & laptop express, jual-beli laptop bekas berkualitas, dan konsultasi IT terpercaya di Garut, Jawa Barat.',
  keywords: [
    'Acuuy CCTV',
    'CCTV Garut',
    'Pasang CCTV Garut',
    'Jasa Pasang CCTV Garut',
    'Paket CCTV Garut Murah',
    'Servis Laptop Garut',
    'Servis Komputer Garut',
    'Tempat Servis Laptop Garut',
    'Jual Beli Laptop Bekas Garut',
    'Laptop Second Garut',
    'Konsultasi IT Garut',
    'Teknisi CCTV Garut',
  ],
  authors: [{ name: 'Acuuy CCTV Garut', url: siteUrl }],
  creator: 'Acuuy CCTV Garut',
  publisher: 'Acuuy CCTV Garut',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Acuuy CCTV & Servis Komputer Garut | Solusi CCTV, Laptop & IT',
    description:
      'Jasa instalasi CCTV bergaransi, servis komputer & laptop express, jual-beli laptop bekas berkualitas, dan konsultasi IT terpercaya di Garut, Jawa Barat.',
    url: siteUrl,
    siteName: 'Acuuy CCTV Garut',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Acuuy CCTV & Servis Komputer Garut',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acuuy CCTV & Servis Komputer Garut',
    description:
      'Jasa instalasi CCTV bergaransi, servis laptop express, jual laptop bekas & konsultasi IT di Garut.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  category: 'technology',
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'Acuuy CCTV & Servis Komputer Garut',
  alternateName: 'Acuuy CCTV',
  description:
    'Layanan spesialis pemasangan kamera CCTV bergaransi, servis laptop & komputer cepat, jual beli laptop bekas, dan konsultasi IT di Garut, Jawa Barat.',
  url: siteUrl,
  image: `${siteUrl}/og-image.jpg`,
  telephone: '+6285223344556',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Garut Kota',
    addressLocality: 'Garut',
    addressRegion: 'Jawa Barat',
    postalCode: '44111',
    addressCountry: 'ID',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -7.2278,
    longitude: 107.9087,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '17:00',
    },
  ],
  areaServed: [
    {
      '@type': 'City',
      name: 'Garut',
    },
    {
      '@type': 'City',
      name: 'Garut Kota',
    },
    {
      '@type': 'City',
      name: 'Tarogong Kidul',
    },
    {
      '@type': 'City',
      name: 'Tarogong Kaler',
    },
    {
      '@type': 'City',
      name: 'Wanaraja',
    },
    {
      '@type': 'City',
      name: 'Samarang',
    },
  ],
  sameAs: ['https://wa.me/6285223344556'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-teal-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
