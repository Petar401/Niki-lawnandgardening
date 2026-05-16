import { ChevronDown } from 'lucide-react';
import { Container, SectionHeading } from '@/components/primitives';
import { faqs } from '@/content/faqs';
import { Reveal } from '@/components/util/Reveal';

export function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32">
      <Container size="md">
        <Reveal>
          <SectionHeading
            eyebrow="Good to know"
            title="Frequently asked"
            lede="Quick answers to the things customers ask before getting in touch."
            align="center"
          />
        </Reveal>
        <ul className="mt-12 divide-y divide-stone/70 border-y border-stone/70">
          {faqs.map((faq, i) => (
            <Reveal key={faq.question} as="li" delay={(i % 4) * 50}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bloom focus-visible:ring-offset-4 focus-visible:ring-offset-cream">
                  <span className="font-display text-lg text-forest">{faq.question}</span>
                  <ChevronDown
                    className="mt-1 h-5 w-5 shrink-0 text-leaf transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 max-w-prose text-base leading-relaxed text-ink/75">
                  {faq.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
