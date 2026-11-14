import { NextResponse } from 'next/server';
import {
  fetchSettings, fetchTechnicians, fetchLaptops, fetchPortfolios, fetchCctvPackages, fetchCertificates, fetchOrderByNumber,
  createOrder, createSubmission,
} from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// Website publik: hanya resource yang aman dibaca publik.
// Data orders / submissions TIDAK diekspos (kecuali lacak order via nomor order).
const loaders: Record<string, () => Promise<any>> = {
  settings: fetchSettings,
  technicians: fetchTechnicians,
  laptops: fetchLaptops,
  portfolios: fetchPortfolios,
  cctv_packages: fetchCctvPackages,
  certificates: fetchCertificates,
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource') || 'all';
    const orderNumber = searchParams.get('order_number');

    if (orderNumber) {
      const order = await fetchOrderByNumber(orderNumber);
      if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
      return NextResponse.json({ data: order });
    }

    if (resource === 'all') {
      const keys = Object.keys(loaders);
      const values = await Promise.all(keys.map((k) => loaders[k]()));
      return NextResponse.json({
        data: {
          ...Object.fromEntries(keys.map((k, i) => [k, values[i]])),
          orders: [],
          submissions: [],
        },
      });
    }

    if (loaders[resource]) return NextResponse.json({ data: await loaders[resource]() });
    return NextResponse.json({ error: 'Resource tidak valid' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, data } = await request.json();
    if (action === 'create_order') {
      return NextResponse.json({ success: true, data: await createOrder(data) });
    }
    if (action === 'create_submission') {
      return NextResponse.json({ success: true, data: await createSubmission(data) });
    }
    return NextResponse.json({ error: 'Action not supported' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
