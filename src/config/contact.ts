/**
 * Niki's contact details. Single source of truth for the contact form,
 * navbar / footer CTAs, schema.org JSON-LD, and the privacy notice.
 *
 * The form submits via `mailto:` (no backend, no API key, no CORS), so
 * whichever address sits here receives submissions through the visitor's
 * email client.
 */
export const CONTACT_EMAIL: string = 'info@nikislawngardens.co.uk';

/** E.164 — used in `tel:` links and schema.org. */
export const CONTACT_PHONE: string = '+447843818290';
/** UK-formatted display string — used for visible labels. */
export const CONTACT_PHONE_DISPLAY = '07843 818290';

export const CONTACT_AREA = 'Norwich & Norfolk';
/** Used in body copy / meta description ("…across Norwich and Norfolk."). */
export const CONTACT_AREA_LONG = 'Norwich and the surrounding Norfolk countryside';
/** Postcode / county region label for schema.org areaServed. */
export const CONTACT_REGION = 'Norfolk, England';

/** Public Facebook page. Drives the "Recommended on Facebook" trust line. */
export const CONTACT_FACEBOOK = 'https://www.facebook.com/share/1E5jUFGmrd/';

/** Short trust statement shown in the footer / about copy. */
export const TRUST_LINE = 'Fully insured · Tidy & respectful · 100% recommended on Facebook';
