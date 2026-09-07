export type ServiceType = 'cctv' | 'servis_komputer' | 'konsultasi_it' | 'laptop_bekas';

export type OrderStatus =
  | 'baru'
  | 'dikonfirmasi'
  | 'dijadwalkan'
  | 'dikerjakan'
  | 'selesai'
  | 'dibatalkan';

export type LaptopStatus = 'tersedia' | 'booking' | 'terjual';

export type LaptopGrade =
  | 'Grade A (Mulus)'
  | 'Grade B (Lecet Pemakaian)'
  | 'Grade C (Fungsional Normal)';

export type SubmissionStatus =
  | 'menunggu_review'
  | 'dihubungi'
  | 'diterima'
  | 'ditolak';

export interface StoreSettings {
  id: string;
  store_name: string;
  tagline: string;
  whatsapp_number: string;
  email: string;
  address_street: string;
  city: string;
  province: string;
  postal_code: string;
  google_maps_url: string;
  opening_hours: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  status: 'active' | 'busy' | 'off';
  avatar_url?: string;
}

export interface OrderStatusLog {
  status: OrderStatus;
  time: string;
  notes: string;
}

export interface Order {
  id: string;
  order_number: string;
  service_type: ServiceType;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address: string;
  city: string;
  description: string;
  specific_details: Record<string, any>;
  photo_urls?: string[];
  status: OrderStatus;
  estimated_cost: number;
  final_cost: number;
  technician_id?: string;
  technician_name?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  status_logs: OrderStatusLog[];
}

export interface Laptop {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  graphics: string;
  display: string;
  battery_health: string;
  condition_grade: LaptopGrade;
  price: number;
  discount_price?: number | null;
  warranty_info: string;
  status: LaptopStatus;
  images: string[];
  description: string;
  features: string[];
}

export interface SellSubmission {
  id: string;
  submission_number: string;
  customer_name: string;
  customer_phone: string;
  brand: string;
  model: string;
  specifications: string;
  condition_description: string;
  expected_price: number;
  offered_price?: number;
  status: SubmissionStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  title: string;
  category: 'rumah' | 'toko' | 'kantor' | 'gudang';
  location: string;
  camera_count: number;
  camera_type: string;
  completion_date: string;
  images: string[];
  description: string;
  testimonial?: {
    client_name: string;
    review: string;
    rating: number;
  };
}

