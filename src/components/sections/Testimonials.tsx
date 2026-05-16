import { Star } from 'lucide-react';
import { Card, Container, Icon, SectionHeading } from '@/components/primitives';
import { testimonials } from '@/content/testimonials';
import { site } from '@/content/site';
import { Reveal } from '@/components/util/Reveal';

export function Testimonials() {
  if (!site.flags.showTestimonials) return null;

  return (
    <section id="testimonials" className="bg-mist py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="What customers say"
            title="Looking after gardens, year after year"
            lede="What our regulars tend to say about working with us."
            align="center"
          />
          {site.flags.testimonialsAreIllustrative ? (
            <p className="mx-auto mt-4 max-w-xl text-balance text-center text-xs uppercase tracking-wider text-ink/70">
              Illustrative quotes — replaced with real, attributable
              testimonials before launch.
            </p>
          ) : null}
        </Reveal>
        <ul className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} as="li" delay={(i % 3) * 80}>
              <Card className="flex h-full flex-col">
                <div
                  className="flex items-center gap-1 text-bloom"
                  role="img"
                  aria-label={`${t.rating} out of 5 stars`}
                >
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Icon key={idx} icon={Star} size="sm" className="fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink/85">
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <footer className="mt-5 border-t border-stone/60 pt-4">
                  <p className="font-display text-sm text-forest">{t.author}</p>
                  <p className="text-xs uppercase tracking-wide text-ink/70">{t.detail}</p>
                </footer>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
