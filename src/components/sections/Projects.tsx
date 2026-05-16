import { Card, Container, SectionHeading, Tag } from '@/components/primitives';
import { projects } from '@/content/projects';
import { BeforeAfterSlider } from '@/components/projects/BeforeAfterSlider';
import { Reveal } from '@/components/util/Reveal';

export function Projects() {
  const real = projects.filter((p) => p.isRealPhotography);
  const illustrative = projects.filter((p) => !p.isRealPhotography);

  return (
    <section id="projects" className="bg-mist py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Recent projects"
            title="Real gardens, before &amp; after"
            lede="Drag the divider on each photo to see the change. Every project starts with an honest walk-through and a clear written quote."
            align="center"
          />
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {real.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <article className="flex h-full flex-col gap-5">
                <BeforeAfterSlider
                  before={p.before}
                  after={p.after}
                  beforeAlt={p.alt.before}
                  afterAlt={p.alt.after}
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {p.tags.map((tag) => (
                      <Tag key={tag} tone="leaf">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  <h3 className="mt-3 font-display text-xl text-forest">{p.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink/70">
                    {p.location} · {p.type} · {p.durationDays === 1 ? '1 day on site' : `${p.durationDays} days on site`}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">{p.brief}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/85">
                    <span className="font-medium text-forest">Outcome — </span>
                    {p.outcome}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {illustrative.length > 0 ? (
          <div className="mt-16">
            <Reveal>
              <h3 className="text-eyebrow font-medium uppercase text-forest">
                Other recent work
              </h3>
            </Reveal>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {illustrative.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <Card variant="default">
                    <div className="flex flex-wrap items-center gap-2">
                      {p.tags.map((tag) => (
                        <Tag key={tag} tone="neutral">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                    <h4 className="mt-3 font-display text-lg text-forest">{p.title}</h4>
                    <p className="mt-1 text-xs uppercase tracking-wide text-ink/70">
                      {p.location} · {p.type}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink/75">{p.brief}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/85">
                      <span className="font-medium text-forest">Outcome — </span>
                      {p.outcome}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
