import { Mail, MapPin, Phone } from 'lucide-react';
import { Container, Icon } from '@/components/primitives';
import { Wordmark } from './Wordmark';
import { navLinks } from '@/content/nav';
import { isPlaceholder, site } from '@/content/site';
import { services } from '@/content/services';

const placeholderText = (label: string) => (
  <span className="italic text-cream/85" title="Replace before launch">
    {label}
  </span>
);

export function Footer() {
  const phoneOk = !isPlaceholder(site.contact.phone);
  const emailOk = !isPlaceholder(site.contact.email);
  const areaOk = !isPlaceholder(site.contact.serviceArea);

  return (
    <footer className="bg-forest text-cream">
      <Container className="py-14 sm:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Wordmark tone="cream" />
            <p className="mt-5 max-w-sm text-sm text-cream/90">{site.promise}</p>
            <ul className="mt-6 space-y-2.5 text-sm text-cream/85">
              <li className="flex items-center gap-2.5">
                <Icon icon={Phone} size="sm" className="text-moss" />
                {phoneOk ? (
                  <a href={site.contact.phoneHref} className="hover:underline">
                    {site.contact.phone}
                  </a>
                ) : (
                  placeholderText('Phone — add before launch')
                )}
              </li>
              <li className="flex items-center gap-2.5">
                <Icon icon={Mail} size="sm" className="text-moss" />
                {emailOk ? (
                  <a href={`mailto:${site.contact.email}`} className="hover:underline">
                    {site.contact.email}
                  </a>
                ) : (
                  placeholderText('Email — add before launch')
                )}
              </li>
              <li className="flex items-center gap-2.5">
                <Icon icon={MapPin} size="sm" className="text-moss" />
                {areaOk ? site.contact.serviceArea : placeholderText('Service area — add before launch')}
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-eyebrow font-medium uppercase text-cream/80">Explore</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-cream/85 hover:text-cream hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-eyebrow font-medium uppercase text-cream/80">Services</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.id}>
                  <a href={`#services`} className="text-cream/85 hover:text-cream hover:underline">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-cream/15 pt-6 text-xs text-cream/80 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.brand}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li>
              <a href="/privacy" className="hover:text-cream hover:underline">
                Privacy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-cream hover:underline">
                Terms
              </a>
            </li>
            <li>{site.contact.hours}</li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
