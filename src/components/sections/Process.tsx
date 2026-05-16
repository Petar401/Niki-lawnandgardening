import { Container, SectionHeading } from '@/components/primitives';
import { processSteps } from '@/content/process';
import { Reveal } from '@/components/util/Reveal';

export function Process() {
  return (
    <section id="process" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="A simple, honest process"
            lede="No high-pressure sales, no surprise charges. From the first walk-through to ongoing care, here is exactly what to expect."
            align="center"
          />
        </Reveal>
        <ol className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {processSteps.map((step, i) => (
            <Reveal key={step.number} as="li" delay={(i % 4) * 80}>
              <div className="relative flex h-full flex-col">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest text-cream font-display text-lg">
                    {step.number}
                  </span>
                  <span className="hidden h-px flex-1 bg-stone/70 lg:block" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl text-forest">{step.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/75">
                  {step.description}
                </p>
                <p className="mt-4 text-xs uppercase tracking-wide text-forest">
                  {step.duration}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
