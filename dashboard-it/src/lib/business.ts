/**
 * Single source of truth for business NAP (Name, Address, Phone).
 * MUST stay identical to the Google Business Profile listing for local SEO consistency.
 */
export const BUSINESS = {
  name: 'Acuuy CCTV Garut',
  legalName: 'Acuuy CCTV & Servis Komputer Garut',
  /** WhatsApp / phone in international format without "+" */
  phone: '6285158722545',
  phoneDisplay: '0851-5872-2545',
  phoneIntl: '+62 851-5872-2545',
  streetAddress: 'Jl. Dayeuhandap No.35, Kota Kulon',
  district: 'Garut Kota',
  city: 'Kabupaten Garut',
  province: 'Jawa Barat',
  postalCode: '44112',
  fullAddress:
    'Jl. Dayeuhandap No.35, Kota Kulon, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44112',
  shortAddress: 'Jl. Dayeuhandap No.35, Garut Kota',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Acuuy+CCTV+Jl.+Dayeuhandap+No.35+Kota+Kulon+Garut',
  mapsEmbedUrl:
    'https://maps.google.com/maps?q=Jl.%20Dayeuhandap%20No.35%2C%20Kota%20Kulon%2C%20Garut%20Kota%2C%20Garut%2044112&z=16&output=embed',
  openingHours: 'Senin - Sabtu: 08:30 - 18:00 WIB',
} as const;

export const waLink = (text?: string) =>
  `https://wa.me/${BUSINESS.phone}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
