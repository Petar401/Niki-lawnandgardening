import { ArrowRight, Leaf } from 'lucide-react';
import { Button, Container, Icon } from '@/components/primitives';
import { HeroVisual } from '@/components/three/HeroVisual';
import { site } from '@/content/site';
import { Reveal } from '@/components/util/Reveal';

export function Hero() {
  return (
    <section id="top" className="relative pt-10 sm:pt-16 lg:pt-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-6 xl:col-span-7">
            <p className="text-eyebrow font-medium uppercase text-forest">
              Garden design · lawn care · seasonal maintenance
            </p>
            <h1 className="mt-5 font-display text-display-xl text-forest">
              A tidy, planted garden — <span className="text-leaf">cared for, year after year</span>.
            </h1>
            <p className="mt-6 max-w-prose text-lg text-ink/75 sm:text-xl">
              {site.promise}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button
                as="a"
                href={site.cta.primary.href}
                size="lg"
                trailingIcon={<Icon icon={ArrowRight} size="sm" />}
              >
                {site.cta.primary.label}
              </Button>
              <Button
                as="a"
                href={site.cta.secondary.href}
                variant="secondary"
                size="lg"
                leadingIcon={<Icon icon={Leaf} size="sm" />}
              >
                {site.cta.secondary.label}
              </Button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-stone/60 pt-6">
              {site.trust.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <div className="font-display text-2xl text-forest">{stat.value}</div>
                    <div className="mt-1 text-xs leading-snug text-ink/65">{stat.label}</div>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-6 xl:col-span-5">
            <HeroVisual />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
