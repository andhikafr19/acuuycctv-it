import { Order, Laptop, StoreSettings, SellSubmission, Technician, Portfolio } from './types';

export async function getStoreAll(): Promise<{
  settings: StoreSettings;
  technicians: Technician[];
  laptops: Laptop[];
  orders: Order[];
  submissions: SellSubmission[];
  portfolios: Portfolio[];
}> {
  try {
    const res = await fetch('/api/store?resource=all', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch store');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error(err);
    return {
      settings: {
        id: 'default',
        store_name: 'Acuuy CCTV & Komputer Garut',
        tagline: 'Pusat Instalasi CCTV, Servis Komputer & Jual Beli Laptop Bekas Bergaransi di Garut',
        whatsapp_number: '6285223344556',
        email: 'admin@acuuycctv.com',
        address_street: 'Jl. Cimanuk No. 88, Tarogong Kidul, Garut',
        city: 'Garut',
        province: 'Jawa Barat',
        postal_code: '44151',
        google_maps_url: 'https://maps.google.com/?q=Tarogong+Kidul+Garut',
        opening_hours: 'Senin - Sabtu: 08:30 - 18:00 WIB',
      },
      technicians: [],
      laptops: [],
      orders: [],
      submissions: [],
      portfolios: [],
    };
  }
}

export async function getPortfolios(): Promise<Portfolio[]> {
  try {
    const res = await fetch('/api/store?resource=portfolios', { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getLaptops(): Promise<Laptop[]> {
  try {
    const res = await fetch('/api/store?resource=laptops', { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const res = await fetch('/api/store?resource=settings', { cache: 'no-store' });
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error(err);
    return {
      id: 'default',
      store_name: 'Acuuy CCTV & Komputer Garut',
      tagline: 'Solusi Cepat CCTV & IT Garut',
      whatsapp_number: '6285223344556',
      email: 'admin@acuuycctv.com',
      address_street: 'Jl. Cimanuk No. 88, Garut',
      city: 'Garut',
      province: 'Jawa Barat',
      postal_code: '44151',
      google_maps_url: 'https://maps.google.com/?q=Garut',
      opening_hours: '08:30 - 18:00 WIB',
    };
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    const res = await fetch(`/api/store?order_number=${encodeURIComponent(orderNumber)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function submitOrder(orderData: Partial<Order>): Promise<{ success: boolean; data?: Order; error?: string }> {
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_order', data: orderData }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function submitSellSubmission(submissionData: Partial<SellSubmission>): Promise<{ success: boolean; data?: SellSubmission; error?: string }> {
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_submission', data: submissionData }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

