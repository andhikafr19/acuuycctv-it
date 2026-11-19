import { NextResponse } from 'next/server';
import { verifyRequestAuth, verifyCsrfOrigin } from '@/lib/auth';
import {
  getSupabaseAdmin, pick, columns, fetchSettings, fetchTechnicians, fetchLaptops, fetchPortfolios,
  fetchCctvPackages, fetchCertificates, fetchAppNotifications, fetchOrders, fetchSubmissions, fetchOrderByNumber, fetchOrderById, createOrder, createSubmission,
} from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const loaders: Record<string, () => Promise<any>> = {
  settings: fetchSettings,
  technicians: fetchTechnicians,
  laptops: fetchLaptops,
  portfolios: fetchPortfolios,
  cctv_packages: fetchCctvPackages,
  certificates: fetchCertificates,
  app_notifications: fetchAppNotifications,
  orders: fetchOrders,
  submissions: fetchSubmissions,
};

const slugify = (s: string) =>
  (s || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export async function GET(request: Request) {
  try {
    const auth = await verifyRequestAuth(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }

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
    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Origin tidak valid.' },
        { status: 403 }
      );
    }

    const auth = await verifyRequestAuth(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }

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
          : sb.from('laptops').insert(payload).select('id').single();
        const { data: savedRow, error } = await q;
        if (error) throw error;
        const targetId = data.id || savedRow?.id || payload.slug;

        if (data.send_mobile_notification) {
          const finalPrice = Number(data.discount_price || data.price) || 0;
          const priceFormatted = `Rp ${finalPrice.toLocaleString('id-ID')}`;
          try {
            await sb.from('app_notifications').insert({
              title: `🔥 Stok Baru: ${data.title}`,
              body: `${data.processor || ''} • RAM ${data.ram || ''} • ${data.storage || ''} (${data.condition_grade || 'Grade A'}) — ${priceFormatted}`,
              category: 'stok_laptop_baru',
              promo_label: data.discount_price ? 'Promo Laptop' : 'Stok Baru Masuk',
              image_url: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : null,
              target_type: 'laptop',
              target_id: String(targetId),
              price_display: priceFormatted,
              is_active: true,
            });
          } catch (e: any) {
            console.warn('Skip app_notifications insert:', e.message);
          }
        }

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

        if (data.send_mobile_notification) {
          try {
            await sb.from('app_notifications').insert({
              title: `🎉 Promo CCTV: ${payload.name}`,
              body: `${payload.description || `Paket lengkap ${payload.camera_count || 4} kamera ${payload.brand} sudah termasuk instalasi rapi di Garut.`}`,
              category: 'promo_cctv',
              promo_label: payload.tag || 'Promo Paket CCTV',
              target_type: 'cctv_package',
              target_id: String(payload.id),
              price_display: payload.price,
              is_active: true,
            });
          } catch (e: any) {
            console.warn('Skip app_notifications insert:', e.message);
          }
        }

        return NextResponse.json({ success: true, id: payload.id });
      }

      case 'delete_cctv_package': {
        const { error } = await sb.from('cctv_packages').delete().eq('id', data.id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'save_certificate': {
        const payload: any = { ...pick(data, columns.CERTIFICATE_COLUMNS), updated_at: now };
        const q = data.id
          ? sb.from('certificates').update(payload).eq('id', data.id)
          : sb.from('certificates').insert(payload);
        const { error } = await q;
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'delete_certificate': {
        const { error } = await sb.from('certificates').delete().eq('id', data.id);
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
