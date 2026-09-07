import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloating from '@/components/layout/WhatsAppFloating';

export const metadata: Metadata = {
  title: 'Acuuy CCTV & Servis Komputer Garut | Solusi CCTV, Laptop & IT',
  description:
    'Jasa instalasi CCTV bergaransi, servis komputer & laptop express, jual-beli laptop bekas berkualitas, dan konsultasi IT terpercaya di Garut, Jawa Barat.',
  keywords: [
    'Acuuy CCTV',
    'CCTV Garut',
    'Pasang CCTV Garut',
    'Servis Laptop Garut',
    'Servis Komputer Garut',
    'Jual Beli Laptop Bekas Garut',
    'Laptop Second Garut',
    'Konsultasi IT Garut',
  ],
  authors: [{ name: 'Acuuy CCTV Garut' }],
  icons: {
    icon: '/favicon.ico',
  },
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
