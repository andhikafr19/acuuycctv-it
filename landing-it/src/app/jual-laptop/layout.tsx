import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jual Beli Laptop Bekas Garut Berkualitas & Bergaransi Toko',
  description:
    'Pusat laptop second berkualitas di Garut. Unit lulus uji kelayakan 25+ titik, siap pakai, garansi toko resmi. Melayani tukar tambah dan jual laptop bekas harga terbaik.',
  keywords: [
    'Jual Beli Laptop Bekas Garut',
    'Laptop Second Garut',
    'Beli Laptop Bekas Garut',
    'Tukar Tambah Laptop Garut',
    'Toko Laptop Garut',
    'Laptop Murah Garut',
  ],
  alternates: {
    canonical: '/jual-laptop',
  },
  openGraph: {
    title: 'Jual Beli Laptop Bekas Berkualitas Garut | Acuuy CCTV',
    description:
      'Cari laptop bekas bergaransi di Garut? Unit mulus, baterai sehat, lulus pengecekan ketat. Garansi toko resmi.',
    url: '/jual-laptop',
  },
};

export default function JualLaptopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
