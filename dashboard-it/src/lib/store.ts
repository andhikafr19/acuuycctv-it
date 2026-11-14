import { Order, Laptop, StoreSettings, SellSubmission, Technician, Portfolio, CctvPackage, Certificate } from './types';
import { BUSINESS } from './business';

export async function getDashboardData(): Promise<{
  settings: StoreSettings;
  technicians: Technician[];
  laptops: Laptop[];
  orders: Order[];
  submissions: SellSubmission[];
  portfolios: Portfolio[];
  cctv_packages: CctvPackage[];
  certificates: Certificate[];
}> {
  try {
    const res = await fetch('/api/store?resource=all', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    const json = await res.json();
    return {
      settings: json.data?.settings || {},
      technicians: json.data?.technicians || [],
      laptops: json.data?.laptops || [],
      orders: json.data?.orders || [],
      submissions: json.data?.submissions || [],
      portfolios: json.data?.portfolios || [],
      cctv_packages: json.data?.cctv_packages || [],
      certificates: json.data?.certificates || [],
    };
  } catch (err) {
    console.error(err);
    return {
      settings: {
        id: 'default',
        store_name: 'Acuuy CCTV & Komputer Garut',
        tagline: 'Pusat Instalasi CCTV, Servis Komputer & Jual Beli Laptop Bekas Bergaransi di Garut',
        whatsapp_number: BUSINESS.phone,
        email: 'admin@acuuycctv.com',
        address_street: BUSINESS.streetAddress + ', Kec. ' + BUSINESS.district,
        city: BUSINESS.city,
        province: BUSINESS.province,
        postal_code: BUSINESS.postalCode,
        google_maps_url: BUSINESS.mapsUrl,
        opening_hours: BUSINESS.openingHours,
      },
      technicians: [],
      laptops: [],
      orders: [],
      submissions: [],
      portfolios: [],
      cctv_packages: [],
      certificates: [],
    };
  }
}

export async function saveCctvPackageAction(data: Partial<CctvPackage>): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_cctv_package', data }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteCctvPackageAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_cctv_package', data: { id } }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
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

export async function saveCertificateAction(data: Partial<Certificate>): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_certificate', data }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteCertificateAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_certificate', data: { id } }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function uploadCertificateImageAction(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
