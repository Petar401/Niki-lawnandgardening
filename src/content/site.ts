/**
 * Brand- and site-level content. All values that need to be filled in by
 * the business owner before launch are marked with PLACEHOLDER and listed
 * in the README launch checklist.
 */

export const PLACEHOLDER = '__PLACEHOLDER__';
export const isPlaceholder = (value: string) => value.startsWith('__PLACEHOLDER');

export const site = {
  /** Display brand name. */
  brand: 'Niki Lawn & Gardening',
  /** Short alias for navigation / footer. */
  brandShort: 'Niki Gardens',
  /** Owner / lead gardener name used in the about copy. */
  ownerName: 'Niki',

  /** One-line positioning. */
  tagline: 'Garden design, lawn care &amp; seasonal maintenance.',
  /** Two-sentence promise used in metadata and footer. */
  promise:
    'Friendly, expert care for your outdoor space — from full garden makeovers to ongoing seasonal maintenance. Tidy, planted, cared-for, year after year.',

  contact: {
    phone: PLACEHOLDER,
    phoneHref: PLACEHOLDER,
    email: PLACEHOLDER,
    serviceArea: PLACEHOLDER,
    addressLine: PLACEHOLDER,
    hours: 'Mon–Sat, 8am–6pm',
  },

  social: {
    instagram: PLACEHOLDER,
    facebook: PLACEHOLDER,
  },

  /** Numbers for the hero trust strip. Replace the labels and values together. */
  trust: [
    { value: '12+', label: 'years caring for local gardens' },
    { value: '180+', label: 'gardens looked after' },
    { value: '5★', label: 'average customer rating' },
  ],

  /** Feature flags for content sections that are placeholder-only. */
  flags: {
    /** When false, the testimonials section is hidden entirely. */
    showTestimonials: true,
    /** When true, a small banner labels testimonials as illustrative. */
    testimonialsAreIllustrative: true,
  },

  /** Primary calls-to-action used across sections. */
  cta: {
    primary: { label: 'Request a quote', href: '#contact' },
    secondary: { label: 'See our work', href: '#projects' },
    contactPrimary: { label: 'Send my enquiry', href: '#contact' },
  },
} as const;

export type SiteConfig = typeof site;
