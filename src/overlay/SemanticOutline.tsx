import { BUSINESS_NAME, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, SERVICE_AREAS } from '@/config/contact';

/**
 * Visually-hidden semantic outline rendered into the document for
 * crawlers and screen readers. The 3D canvas is decorative
 * (`aria-hidden`), so without this block the page would have no real
 * content for SEO or assistive tech. Style: `sr-only` (visible to
 * screen readers, invisible on screen).
 */
export function SemanticOutline() {
  return (
    <div className="sr-only" aria-label="Site content outline">
      <h1>{BUSINESS_NAME} — Lawn care, landscaping & hedging in Norwich, Norfolk</h1>
      <p>
        {BUSINESS_NAME} is a small, hands-on gardening business based in Norwich and
        serving every town and village across Norfolk. Niki handles mowing,
        landscaping, hedge trimming and seasonal cleanups personally — no big
        crews, no upsell, just tidy gardens.
      </p>

      <h2>Services</h2>
      <ul>
        <li>
          <strong>Lawn mowing in Norwich</strong> — weekly or fortnightly visits,
          edged borders, crisp stripes, clippings cleared.
        </li>
        <li>
          <strong>Garden landscaping in Norfolk</strong> — bed and border design,
          paths, planting plans, soil and mulch.
        </li>
        <li>
          <strong>Hedge trimming</strong> — box, beech, privet, leylandii.
          Annual or twice-yearly trims up to about four metres.
        </li>
        <li>
          <strong>Seasonal cleanups</strong> — spring wake-up, autumn leaf
          blowouts, deadheading, cutbacks, winter prep.
        </li>
      </ul>

      <h2>Areas covered</h2>
      <p>
        Niki covers the whole of Norfolk from Norwich outwards, including:
      </p>
      <ul>
        {SERVICE_AREAS.map((a) => (
          <li key={a.name}>{a.name}</li>
        ))}
      </ul>

      <h2>Contact Niki</h2>
      <p>
        Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or call{' '}
        <a href="tel:+447843818290">{CONTACT_PHONE_DISPLAY}</a>. Replies within one
        business day, free quotes, no obligation.
      </p>
      <address>
        Niki Lawn &amp; Gardening, Norwich, Norfolk, United Kingdom
      </address>
    </div>
  );
}
