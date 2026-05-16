import { isPlaceholder, site } from '@/content/site';
import { services } from '@/content/services';

/** Site URL for canonical / JSON-LD. Falls back to runtime origin when unset. */
function getSiteUrl(): string {
  const env = import.meta.env.VITE_SITE_URL;
  if (env && env.trim().length > 0) return env.replace(/\/+$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/**
 * LocalBusiness JSON-LD. Only includes optional fields (telephone, email,
 * address, areaServed) when they have been replaced from the placeholder
 * defaults — submitting `__PLACEHOLDER__` to a search engine would be worse
 * than omitting the field.
 */
export function StructuredData() {
  const siteUrl = getSiteUrl();
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.brand,
    description: site.promise,
    url: siteUrl || undefined,
    image: siteUrl ? `${siteUrl}/og-image.png` : '/og-image.png',
    priceRange: '££',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    makesOffer: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: s.name,
        description: s.short,
      },
    })),
  };

  if (!isPlaceholder(site.contact.phone)) data.telephone = site.contact.phone;
  if (!isPlaceholder(site.contact.email)) data.email = site.contact.email;
  if (!isPlaceholder(site.contact.serviceArea)) data.areaServed = site.contact.serviceArea;
  if (!isPlaceholder(site.contact.addressLine)) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: site.contact.addressLine,
    };
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD requires a raw script tag with serialized JSON.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
