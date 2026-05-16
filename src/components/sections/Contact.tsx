import { Mail, MapPin, Phone } from 'lucide-react';
import { Card, Container, Icon, SectionHeading } from '@/components/primitives';
import { isPlaceholder, site } from '@/content/site';
import { QuoteForm } from '@/components/forms/QuoteForm';
import { Reveal } from '@/components/util/Reveal';

const placeholderText = (label: string) => (
  <span className="text-ink/70" title="Replace before launch">
    {label}
  </span>
);

export function Contact() {
  const phoneOk = !isPlaceholder(site.contact.phone);
  const emailOk = !isPlaceholder(site.contact.email);
  const areaOk = !isPlaceholder(site.contact.serviceArea);

  return (
    <section id="contact" className="bg-cream py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="Get in touch"
              title="Let&rsquo;s look at your garden together"
              lede="Tell us a little about the space and what you would like to change. We will reply within one working day with next steps."
            />
            <ul className="mt-10 space-y-4 text-sm text-ink/85">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/[0.08] text-forest">
                  <Icon icon={Phone} size="sm" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wide text-ink/70">Call us</div>
                  <div className="mt-0.5 font-medium text-forest">
                    {phoneOk ? (
                      <a href={site.contact.phoneHref} className="hover:underline">
                        {site.contact.phone}
                      </a>
                    ) : (
                      placeholderText('Phone — add before launch')
                    )}
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/[0.08] text-forest">
                  <Icon icon={Mail} size="sm" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wide text-ink/70">Email</div>
                  <div className="mt-0.5 font-medium text-forest">
                    {emailOk ? (
                      <a href={`mailto:${site.contact.email}`} className="hover:underline">
                        {site.contact.email}
                      </a>
                    ) : (
                      placeholderText('Email — add before launch')
                    )}
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/[0.08] text-forest">
                  <Icon icon={MapPin} size="sm" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wide text-ink/70">Service area</div>
                  <div className="mt-0.5 font-medium text-forest">
                    {areaOk ? site.contact.serviceArea : placeholderText('Service area — add before launch')}
                  </div>
                  <div className="text-xs text-ink/70">{site.contact.hours}</div>
                </div>
              </li>
            </ul>
          </Reveal>
          <Reveal className="lg:col-span-7">
            <Card padding="lg">
              <QuoteForm />
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
