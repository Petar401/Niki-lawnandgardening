/**
 * Niki's contact details. Edit here to wire the contact form, chatbot,
 * navbar, JSON-LD schema and tel:/mailto: links to real values without
 * hunting through components.
 *
 * The form submits via `mailto:` (no backend, no API key, no CORS), so
 * any address you put here will receive submissions through the
 * visitor's email client.
 */
export const CONTACT_EMAIL = 'info@nikislawngardens.co.uk';

/** UK mobile in international form. Empty string hides phone everywhere. */
export const CONTACT_PHONE = '+44 7843 818290';
export const CONTACT_PHONE_DISPLAY = '07843 818290';
export const CONTACT_PHONE_TEL = '+447843818290';

export const CONTACT_AREA = 'Norwich & Norfolk';
export const BUSINESS_NAME = 'Niki Lawn & Gardening';
export const BUSINESS_LEGAL_NAME = 'Niki Lawn & Gardening';
export const BUSINESS_TAGLINE =
  'Mowing, landscaping, hedging and seasonal care across Norwich and Norfolk.';

/** Geographic centre used by the JSON-LD `geo` block. Norwich city centre. */
export const BUSINESS_GEO = { lat: 52.6309, lng: 1.2974 } as const;

/** Hours follow OpeningHoursSpecification format. */
export const OPENING_HOURS: Array<{ days: string[]; opens: string; closes: string }> = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:30', closes: '18:30' },
  { days: ['Saturday'], opens: '08:00', closes: '16:00' },
];

/**
 * Norfolk service area. Used by the interactive map, JSON-LD `areaServed`,
 * and the chatbot's "areas covered" intent. Coordinates are approximate
 * (degrees, lat/lng) and only used for the offline SVG map and structured
 * data — no third-party tile service.
 */
export interface ServiceArea {
  name: string;
  lat: number;
  lng: number;
  /** Approx. drive time from Norwich (mins). */
  drive: number;
  /** Highlight in the map — Norwich is the hub. */
  hub?: boolean;
}

export const SERVICE_AREAS: ServiceArea[] = [
  { name: 'Norwich', lat: 52.6309, lng: 1.2974, drive: 0, hub: true },
  { name: 'Wymondham', lat: 52.5703, lng: 1.1158, drive: 18 },
  { name: 'Hethersett', lat: 52.5984, lng: 1.1789, drive: 12 },
  { name: 'Cringleford', lat: 52.6118, lng: 1.2378, drive: 9 },
  { name: 'Costessey', lat: 52.6485, lng: 1.2197, drive: 11 },
  { name: 'Hellesdon', lat: 52.6535, lng: 1.2526, drive: 8 },
  { name: 'Sprowston', lat: 52.6594, lng: 1.3273, drive: 9 },
  { name: 'Thorpe St Andrew', lat: 52.6358, lng: 1.3429, drive: 8 },
  { name: 'Aylsham', lat: 52.7993, lng: 1.2562, drive: 25 },
  { name: 'Wroxham', lat: 52.7050, lng: 1.4097, drive: 20 },
  { name: 'Acle', lat: 52.6386, lng: 1.5466, drive: 23 },
  { name: 'Loddon', lat: 52.5310, lng: 1.4731, drive: 25 },
  { name: 'Long Stratton', lat: 52.4854, lng: 1.2418, drive: 28 },
  { name: 'Diss', lat: 52.3766, lng: 1.1100, drive: 35 },
  { name: 'Thetford', lat: 52.4124, lng: 0.7464, drive: 45 },
  { name: 'Watton', lat: 52.5705, lng: 0.8294, drive: 40 },
  { name: 'Dereham', lat: 52.6810, lng: 0.9381, drive: 30 },
  { name: 'Swaffham', lat: 52.6500, lng: 0.6862, drive: 50 },
  { name: 'Fakenham', lat: 52.8275, lng: 0.8487, drive: 40 },
  { name: 'Holt', lat: 52.9047, lng: 1.0814, drive: 40 },
  { name: 'Cromer', lat: 52.9314, lng: 1.3024, drive: 35 },
  { name: 'Sheringham', lat: 52.9447, lng: 1.2117, drive: 38 },
  { name: 'North Walsham', lat: 52.8200, lng: 1.3856, drive: 30 },
  { name: 'Stalham', lat: 52.7733, lng: 1.5111, drive: 33 },
  { name: 'Great Yarmouth', lat: 52.6082, lng: 1.7297, drive: 35 },
  { name: 'Caister-on-Sea', lat: 52.6512, lng: 1.7263, drive: 38 },
  { name: 'Hunstanton', lat: 52.9398, lng: 0.4948, drive: 65 },
  { name: 'King’s Lynn', lat: 52.7531, lng: 0.3956, drive: 70 },
  { name: 'Downham Market', lat: 52.6053, lng: 0.3837, drive: 65 },
  { name: 'Reepham', lat: 52.7659, lng: 1.1149, drive: 30 },
];

/** Quick lookup for the chatbot — lower-cased names. */
export const SERVICE_AREA_NAMES = SERVICE_AREAS.map((a) => a.name);
