import { useEffect } from 'react';
import {
  BUSINESS_GEO,
  BUSINESS_LEGAL_NAME,
  BUSINESS_NAME,
  BUSINESS_TAGLINE,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  OPENING_HOURS,
  SERVICE_AREAS,
} from '@/config/contact';
import { BUSINESS_FAQ } from '@/chatbot/faq';

const SITE_URL = 'https://nikislawngardens.co.uk';

/**
 * Build all JSON-LD blocks and inject them into <head> on mount. Single
 * effect, no dependency on Helmet. Crawlers (and human view-source) see
 * LocalBusiness + Service catalogue + FAQ + BreadcrumbList.
 */
export function StructuredData() {
  useEffect(() => {
    const blocks = [localBusinessSchema(), servicesSchema(), faqSchema(), breadcrumbSchema()];

    const scripts: HTMLScriptElement[] = blocks.map((data) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-niki-seo', '1');
      s.textContent = JSON.stringify(data);
      document.head.appendChild(s);
      return s;
    });

    return () => {
      for (const s of scripts) s.remove();
    };
  }, []);

  return null;
}

function localBusinessSchema() {
  const openingHours = OPENING_HOURS.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'GardenStore'],
    '@id': `${SITE_URL}#business`,
    name: BUSINESS_NAME,
    legalName: BUSINESS_LEGAL_NAME,
    description: BUSINESS_TAGLINE,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    image: `${SITE_URL}/photos/after-1.webp`,
    logo: `${SITE_URL}/favicon.svg`,
    priceRange: '££',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Norwich',
      addressRegion: 'Norfolk',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_GEO.lat,
      longitude: BUSINESS_GEO.lng,
    },
    openingHoursSpecification: openingHours,
    areaServed: SERVICE_AREAS.map((a) => ({
      '@type': 'City',
      name: a.name,
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Norfolk' },
    })),
    knowsLanguage: 'en-GB',
    makesOffer: [
      'Lawn mowing & striping',
      'Garden landscaping & planting',
      'Hedge trimming & shaping',
      'Seasonal cleanups',
    ].map((name) => ({ '@type': 'Offer', name })),
  };
}

function servicesSchema() {
  const services = [
    {
      name: 'Lawn Mowing',
      description:
        'Weekly or fortnightly mowing with crisp striping and edged borders across Norwich and Norfolk.',
    },
    {
      name: 'Garden Landscaping',
      description:
        'Beds, borders, paths, planting plans, and soil and mulch work for Norfolk gardens.',
    },
    {
      name: 'Hedge Trimming',
      description:
        'Annual and twice-yearly hedge trimming and shaping — box, beech, privet, leylandii.',
    },
    {
      name: 'Seasonal Garden Cleanup',
      description:
        'Spring wake-ups and autumn leaf blowouts, deadheading, cutbacks and winter prep.',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${BUSINESS_NAME} services`,
    itemListElement: services.map((s, i) => ({
      '@type': 'Service',
      position: i + 1,
      name: s.name,
      description: s.description,
      provider: { '@id': `${SITE_URL}#business` },
      areaServed: 'Norfolk',
    })),
  };
}

function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: BUSINESS_FAQ.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  };
}

function breadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/#services` },
      { '@type': 'ListItem', position: 3, name: 'Before / After', item: `${SITE_URL}/#gallery` },
      { '@type': 'ListItem', position: 4, name: 'Contact', item: `${SITE_URL}/#contact` },
    ],
  };
}
