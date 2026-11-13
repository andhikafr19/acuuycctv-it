import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client (dipakai HANYA di API Route / server).
 * Menggunakan SERVICE ROLE KEY sehingga bypass RLS — jangan pernah diimpor di komponen client.
 */
let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase belum dikonfigurasi. Set NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.local / Vercel.'
    );
  }
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

const ORDER_SELECT = '*, technicians(name), order_status_logs(new_status, notes, created_at)';

const ORDER_COLUMNS = [
  'service_type', 'customer_name', 'customer_phone', 'customer_email', 'address', 'city',
  'description', 'specific_details', 'photo_urls', 'status', 'estimated_cost', 'final_cost',
  'technician_id', 'admin_notes', 'scheduled_date',
];
const LAPTOP_COLUMNS = [
  'slug', 'title', 'brand', 'model', 'processor', 'ram', 'storage', 'graphics', 'display',
  'battery_health', 'condition_grade', 'price', 'discount_price', 'warranty_info', 'status',
  'images', 'description', 'features',
];
const SUBMISSION_COLUMNS = ['offered_price', 'status', 'admin_notes', 'photos'];
const PORTFOLIO_COLUMNS = [
  'title', 'category', 'location', 'camera_count', 'camera_type', 'completion_date', 'images',
  'description', 'testimonial',
];
const SETTINGS_COLUMNS = [
  'store_name', 'tagline', 'whatsapp_number', 'email', 'address_street', 'city', 'province',
  'postal_code', 'google_maps_url', 'opening_hours',
];
const CCTV_PACKAGE_COLUMNS = [
  'id', 'name', 'brand', 'brand_tagline', 'type', 'series', 'series_label', 'resolution',
  'camera_count', 'indoor_count', 'outdoor_count', 'hdd_size', 'cable_length', 'recorder_spec',
  'price', 'estimated_cost', 'original_price', 'tag', 'popular', 'best_for', 'description',
  'features', 'sort_order', 'is_active',
];

export function pick(data: Record<string, any>, cols: string[]) {
  const out: Record<string, any> = {};
  for (const c of cols) if (data[c] !== undefined) out[c] = data[c];
  return out;
}

/** Ubah baris DB orders menjadi bentuk `Order` yang dipakai UI (technician_name + status_logs). */
export function mapOrder(row: any) {
  if (!row) return row;
  const { technicians, order_status_logs, ...rest } = row;
  const logs = (order_status_logs || [])
    .map((l: any) => ({ status: l.new_status, time: l.created_at, notes: l.notes || '' }))
    .sort((a: any, b: any) => a.time.localeCompare(b.time));
  return {
    ...rest,
    estimated_cost: Number(rest.estimated_cost) || 0,
    final_cost: Number(rest.final_cost) || 0,
    technician_id: rest.technician_id || '',
    technician_name: technicians?.name || '',
    status_logs: logs,
  };
}

const num = (rows: any[], fields: string[]) =>
  rows.map((r) => {
    const o = { ...r };
    for (const f of fields) if (o[f] !== null && o[f] !== undefined) o[f] = Number(o[f]);
    return o;
  });

export async function fetchSettings() {
  const { data, error } = await getSupabaseAdmin().from('store_settings').select('*').eq('id', 'default').maybeSingle();
  if (error) throw error;
  return data || {};
}
export async function fetchTechnicians() {
  const { data, error } = await getSupabaseAdmin().from('technicians').select('*').order('name');
  if (error) throw error;
  return data || [];
}
export async function fetchLaptops() {
  const { data, error } = await getSupabaseAdmin().from('laptops').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return num(data || [], ['price', 'discount_price']);
}
export async function fetchPortfolios() {
  const { data, error } = await getSupabaseAdmin().from('portfolios').select('*').order('completion_date', { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function fetchCctvPackages() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('cctv_packages')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      console.warn('cctv_packages table not yet migrated, fallback will be used:', error.message);
      return [];
    }
    return num(data || [], ['estimated_cost', 'camera_count', 'indoor_count', 'outdoor_count', 'sort_order']);
  } catch (err) {
    console.warn('Error fetching cctv_packages:', err);
    return [];
  }
}
export async function fetchOrders() {
  const { data, error } = await getSupabaseAdmin().from('orders').select(ORDER_SELECT).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapOrder);
}
export async function fetchSubmissions() {
  const { data, error } = await getSupabaseAdmin().from('sell_submissions').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return num(data || [], ['expected_price', 'offered_price']);
}
export async function fetchOrderByNumber(orderNumber: string) {
  const { data, error } = await getSupabaseAdmin()
    .from('orders').select(ORDER_SELECT).ilike('order_number', orderNumber.trim()).maybeSingle();
  if (error) throw error;
  return data ? mapOrder(data) : null;
}
export async function fetchOrderById(id: string) {
  const { data, error } = await getSupabaseAdmin().from('orders').select(ORDER_SELECT).eq('id', id).single();
  if (error) throw error;
  return mapOrder(data);
}

export async function createOrder(data: any) {
  const sb = getSupabaseAdmin();
  const payload = {
    ...pick(data, ORDER_COLUMNS),
    order_number: data.order_number,
    status: 'baru',
    final_cost: 0,
    estimated_cost: Number(data.estimated_cost) || 0,
    technician_id: null,
    city: data.city || 'Garut',
    specific_details: data.specific_details || {},
    photo_urls: data.photo_urls || [],
  };
  const { data: row, error } = await sb.from('orders').insert(payload).select('id').single();
  if (error) throw error;
  await sb.from('order_status_logs').insert({
    order_id: row.id, new_status: 'baru', notes: 'Pemesanan jasa berhasil dibuat melalui website publik', updated_by: 'Customer',
  });
  return fetchOrderById(row.id);
}

export async function createSubmission(data: any) {
  const { data: row, error } = await getSupabaseAdmin().from('sell_submissions').insert({
    submission_number: data.submission_number,
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    brand: data.brand,
    model: data.model,
    specifications: data.specifications,
    condition_description: data.condition_description,
    expected_price: Number(data.expected_price) || 0,
    photos: data.photos || [],
    status: 'menunggu_review',
  }).select('*').single();
  if (error) throw error;
  return row;
}

export const columns = {
  ORDER_COLUMNS,
  LAPTOP_COLUMNS,
  SUBMISSION_COLUMNS,
  PORTFOLIO_COLUMNS,
  SETTINGS_COLUMNS,
  CCTV_PACKAGE_COLUMNS,
};
