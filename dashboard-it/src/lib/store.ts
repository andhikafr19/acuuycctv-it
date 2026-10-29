import { Order, Laptop, StoreSettings, SellSubmission, Technician, Portfolio } from './types';

export async function getDashboardData(): Promise<{
  settings: StoreSettings;
  technicians: Technician[];
  laptops: Laptop[];
  orders: Order[];
  submissions: SellSubmission[];
  portfolios: Portfolio[];
}> {
  try {
    const res = await fetch('/api/store?resource=all', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error(err);
    return {
      settings: {
        id: 'default',
        store_name: 'Acuuy CCTV & Komputer Garut',
        tagline: 'Pusat CCTV & Servis Laptop Garut',
        whatsapp_number: '6285158722545',
        email: 'admin@acuuycctv.com',
        address_street: 'Jl. Dayeuhandap No.35, Kota Kulon, Kec. Garut Kota',
        city: 'Garut',
        province: 'Jawa Barat',
        postal_code: '44112',
        google_maps_url: 'https://maps.google.com/?q=Garut',
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

export async function savePortfolioAction(data: Partial<Portfolio>): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_portfolio', data }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deletePortfolioAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_portfolio', data: { id } }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateOrderAction(
  id: string,
  updates: Partial<Order> & { log_notes?: string }
): Promise<{ success: boolean; data?: Order; error?: string }> {
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_order', data: { id, ...updates } }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveLaptopAction(laptopData: Partial<Laptop>): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_laptop', data: laptopData }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteLaptopAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_laptop', data: { id } }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateSettingsAction(settings: Partial<StoreSettings>): Promise<{ success: boolean; data?: StoreSettings; error?: string }> {
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_settings', data: settings }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateSubmissionAction(id: string, updates: Partial<SellSubmission>): Promise<{ success: boolean; data?: SellSubmission; error?: string }> {
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_submission', data: { id, ...updates } }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
