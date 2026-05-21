/**
 * Client testimonials. Replace the placeholders below with real quotes
 * from Niki's customers — first name + area is enough for trust without
 * full doxxing. Three to five reads well in the strip layout.
 *
 * TODO: REPLACE EVERY ENTRY before launch. Real testimonials beat polished
 * copy every time.
 */
export interface Testimonial {
  quote: string;
  /** First name only. */
  name: string;
  /** Town / postcode area, e.g. "NR2". */
  location: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'TODO: real quote here. Keep it short — one or two sentences about the job, the result, and how it felt to work with Niki.',
    name: 'TODO Name',
    location: 'TODO Norwich · NR1',
  },
  {
    quote:
      'TODO: second real quote. A different angle — punctuality, tidiness, advice they gave, the seasonal plan.',
    name: 'TODO Name',
    location: 'TODO Norfolk · NR12',
  },
  {
    quote:
      'TODO: third real quote. Even better if it mentions one of the four core services (mowing, landscaping, hedging, seasonal).',
    name: 'TODO Name',
    location: 'TODO Wymondham · NR18',
  },
];
