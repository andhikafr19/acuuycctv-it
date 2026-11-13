import { NextResponse } from 'next/server';
import {
  getSupabaseAdmin, pick, columns, fetchSettings, fetchTechnicians, fetchLaptops, fetchPortfolios,
  fetchCctvPackages, fetchOrders, fetchSubmissions, fetchOrderByNumber, fetchOrderById, createOrder, createSubmission,
} from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const loaders: Record<string, () => Promise<any>> = {
  settings: fetchSettings,
  technicians: fetchTechnicians,
  laptops: fetchLaptops,
  portfolios: fetchPortfolios,
  cctv_packages: fetchCctvPackages,
  orders: fetchOrders,
  submissions: fetchSubmissions,
};

const slugify = (s: string) =>
  (s || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

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
      return NextResponse.json({ data: Object.fromEntries(keys.map((k, i) => [k, values[i]])) });
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
    const sb = getSupabaseAdmin();
    const now = new Date().toISOString();

    switch (action) {
      case 'create_order':
        return NextResponse.json({ success: true, data: await createOrder(data) });

      case 'create_submission':
        return NextResponse.json({ success: true, data: await createSubmission(data) });

      case 'update_order': {
        const { data: prev, error: e1 } = await sb.from('orders').select('status').eq('id', data.id).maybeSingle();
        if (e1) throw e1;
        if (!prev) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

        const updates: any = { ...pick(data, columns.ORDER_COLUMNS), updated_at: now };
        if ('technician_id' in updates && !updates.technician_id) updates.technician_id = null;
        const { error } = await sb.from('orders').update(updates).eq('id', data.id);
        if (error) throw error;

        if (data.status && data.status !== prev.status) {
          await sb.from('order_status_logs').insert({
            order_id: data.id,
            previous_status: prev.status,
            new_status: data.status,
            notes: data.log_notes || `Status diubah menjadi ${data.status}`,
          });
        }
        return NextResponse.json({ success: true, data: await fetchOrderById(data.id) });
      }

      case 'save_laptop': {
        const payload: any = { ...pick(data, columns.LAPTOP_COLUMNS), updated_at: now };
        if (!payload.slug) payload.slug = `${slugify(data.title)}-${Date.now().toString(36)}`;
        const q = data.id
          ? sb.from('laptops').update(payload).eq('id', data.id)
          : sb.from('laptops').insert(payload);
        const { error } = await q;
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'delete_laptop': {
        const { error } = await sb.from('laptops').delete().eq('id', data.id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'update_settings': {
        const { data: row, error } = await sb
          .from('store_settings')
          .upsert({ id: 'default', ...pick(data, columns.SETTINGS_COLUMNS), updated_at: now })
          .select('*').single();
        if (error) throw error;
        return NextResponse.json({ success: true, data: row });
      }

      case 'update_submission': {
        const { data: row, error } = await sb
          .from('sell_submissions')
          .update({ ...pick(data, columns.SUBMISSION_COLUMNS), updated_at: now })
          .eq('id', data.id).select('*').maybeSingle();
        if (error) throw error;
        if (!row) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: row });
      }

      case 'save_portfolio': {
        const payload: any = { ...pick(data, columns.PORTFOLIO_COLUMNS), updated_at: now };
        const q = data.id
          ? sb.from('portfolios').update(payload).eq('id', data.id)
          : sb.from('portfolios').insert(payload);
        const { error } = await q;
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'delete_portfolio': {
        const { error } = await sb.from('portfolios').delete().eq('id', data.id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'save_cctv_package': {
        const payload: any = { ...pick(data, columns.CCTV_PACKAGE_COLUMNS), updated_at: now };
        if (!payload.id) {
          payload.id = `${slugify(payload.brand || 'cctv')}-${slugify(payload.name || 'paket')}-${Date.now().toString(36)}`;
        }
        const { data: existing } = await sb.from('cctv_packages').select('id').eq('id', payload.id).maybeSingle();
        const q = existing
          ? sb.from('cctv_packages').update(payload).eq('id', payload.id)
          : sb.from('cctv_packages').insert(payload);
        const { error } = await q;
        if (error) throw error;
        return NextResponse.json({ success: true, id: payload.id });
      }

      case 'delete_cctv_package': {
        const { error } = await sb.from('cctv_packages').delete().eq('id', data.id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Action not supported' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
