/**
 * Niki's contact details. Edit here to wire the contact form, navbar
 * CTAs, schema.org JSON-LD, and the privacy/footer text from a single
 * source of truth — no hunting through components.
 *
 * The form submits via `mailto:` (no backend, no API key, no CORS), so
 * any address you put here will receive submissions through the
 * visitor's email client.
 *
 * TODO before launch:
 *   - Confirm `CONTACT_EMAIL` is monitored daily.
 *   - Fill in `CONTACT_PHONE` (E.164, e.g. '+447123456789'). Setting it
 *     instantly reveals the tap-to-call CTA across the site.
 */
export const CONTACT_EMAIL: string = 'info@nikislawngardens.co.uk';
export const CONTACT_PHONE: string = ''; // TODO: e.g. '+447123456789'
export const CONTACT_AREA = 'Norwich & Norfolk';
/** Used in body copy / meta description ("…across Norwich and Norfolk."). */
export const CONTACT_AREA_LONG = 'Norwich and the surrounding Norfolk countryside';
/** Postcode / county region label for schema.org areaServed. */
export const CONTACT_REGION = 'Norfolk, England';
