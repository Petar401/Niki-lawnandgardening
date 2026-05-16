import { Check } from 'lucide-react';
import { Card, Container, Icon, SectionHeading } from '@/components/primitives';
import { services } from '@/content/services';
import { Reveal } from '@/components/util/Reveal';

export function Services() {
  return (
    <section id="services" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="What we do"
            title="Care for every part of your garden"
            lede="Six core services that cover everything from the first design sketch to the monthly visits that keep the garden looking after itself."
            align="center"
          />
        </Reveal>
        <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.id} as="li" delay={(i % 3) * 80}>
              <Card variant="interactive" className="flex h-full flex-col">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-forest/[0.08] text-forest">
                  <Icon icon={service.icon} />
                </span>
                <h3 className="mt-5 font-display text-xl leading-snug text-forest">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-ink/70">{service.short}</p>
                <p className="mt-4 text-sm leading-relaxed text-ink/75">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-2 border-t border-stone/60 pt-5 text-sm text-ink/80">
                  {service.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5">
                      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-leaf">
                        <Icon icon={Check} size="sm" className="h-3 w-3" />
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
