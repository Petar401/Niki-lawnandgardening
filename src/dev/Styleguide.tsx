import { ArrowRight, Leaf, Sparkles, Phone, Mail } from 'lucide-react';
import { Button, Card, Container, Icon, SectionHeading, Tag } from '@/components/primitives';

const tokenSwatches: Array<{ name: string; varName: string; foreground: 'ink' | 'cream' }> = [
  { name: 'forest', varName: '--forest', foreground: 'cream' },
  { name: 'leaf', varName: '--leaf', foreground: 'cream' },
  { name: 'moss', varName: '--moss', foreground: 'ink' },
  { name: 'bark', varName: '--bark', foreground: 'cream' },
  { name: 'soil', varName: '--soil', foreground: 'cream' },
  { name: 'cream', varName: '--cream', foreground: 'ink' },
  { name: 'stone', varName: '--stone', foreground: 'ink' },
  { name: 'mist', varName: '--mist', foreground: 'ink' },
  { name: 'bloom', varName: '--bloom', foreground: 'cream' },
  { name: 'ink', varName: '--ink', foreground: 'cream' },
];

export default function Styleguide() {
  return (
    <main className="min-h-screen bg-cream py-16">
      <Container size="lg" className="space-y-16">
        <header className="space-y-3">
          <Tag tone="bloom">Internal · Phase 3</Tag>
          <h1 className="font-display text-display-md text-forest">Design System Styleguide</h1>
          <p className="max-w-prose text-ink/70">
            Visual reference for the brand tokens and primitives. Not linked publicly. Use it to
            sanity-check colors, contrast, type, and component states before composing sections.
          </p>
        </header>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="01"
            title="Color tokens"
            lede="RGB triplets exposed as CSS variables and consumed by Tailwind via &lt;alpha-value&gt;."
            size="md"
            as="h2"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {tokenSwatches.map((s) => (
              <div
                key={s.name}
                className="overflow-hidden rounded-md border border-stone/60"
              >
                <div
                  className="flex h-24 items-end p-3"
                  style={{
                    backgroundColor: `rgb(var(${s.varName}))`,
                    color: s.foreground === 'cream' ? 'rgb(var(--cream))' : 'rgb(var(--ink))',
                  }}
                >
                  <div className="text-sm font-medium">{s.name}</div>
                </div>
                <div className="px-3 py-2 font-mono text-xs text-ink/70">{s.varName}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="02"
            title="Typography"
            lede="Fraunces for display, Inter for UI/body. Fluid sizes via clamp()."
            size="md"
            as="h2"
          />
          <div className="space-y-5">
            <p className="text-eyebrow font-medium uppercase text-forest">eyebrow · 13px</p>
            <h1 className="font-display text-display-xl text-forest">Display XL — a calmer garden</h1>
            <h2 className="font-display text-display-lg text-forest">Display LG — design &amp; care</h2>
            <h3 className="font-display text-display-md text-forest">Display MD — seasonal planting</h3>
            <p className="text-xl text-ink/80">
              Body XL — the gentle, larger paragraph used for hero subheadlines and quotes.
            </p>
            <p className="text-base text-ink/80">
              Body base — used for body copy, FAQ answers, descriptions. Set in Inter at 1.6
              line-height for comfortable reading. Lorem-free zone.
            </p>
            <p className="text-sm text-ink/70">
              Caption — used sparingly for image credits, fine print, footer.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading eyebrow="03" title="Buttons" size="md" as="h2" />
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button trailingIcon={<Icon icon={ArrowRight} size="sm" />}>
                Request a quote
              </Button>
              <Button variant="secondary" leadingIcon={<Icon icon={Phone} size="sm" />}>
                Call us
              </Button>
              <Button variant="ghost" leadingIcon={<Icon icon={Mail} size="sm" />}>
                Email
              </Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="max-w-sm">
              <Button fullWidth>Full width primary</Button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading eyebrow="04" title="Cards" size="md" as="h2" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Card>
              <h3 className="font-display text-xl text-forest">Default card</h3>
              <p className="mt-2 text-sm text-ink/70">
                A calm surface for content. Soft shadow, hairline border, generous padding.
              </p>
            </Card>
            <Card variant="interactive" as="a" href="#interactive">
              <h3 className="font-display text-xl text-forest">Interactive card</h3>
              <p className="mt-2 text-sm text-ink/70">
                Hover-lifts and accents on focus. Use for clickable service cards.
              </p>
            </Card>
            <Card variant="subtle">
              <h3 className="font-display text-xl text-forest">Subtle card</h3>
              <p className="mt-2 text-sm text-ink/70">
                Pale mist surface for quotes, callouts, or grouped meta.
              </p>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading eyebrow="05" title="Tags &amp; icons" size="md" as="h2" />
          <div className="flex flex-wrap items-center gap-3">
            <Tag tone="leaf">Lawn care</Tag>
            <Tag tone="leaf" size="md">Garden design</Tag>
            <Tag tone="bloom">Seasonal</Tag>
            <Tag tone="neutral">Maintenance</Tag>
            <div className="ml-2 flex items-center gap-3 text-forest">
              <Icon icon={Leaf} />
              <Icon icon={Sparkles} size="lg" />
              <Icon icon={ArrowRight} label="Continue" />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="06"
            title="Section heading"
            lede="Three-part heading composition — eyebrow, balanced title, optional lede. Supports left and centered alignment."
            size="md"
            as="h2"
          />
          <Card variant="subtle" padding="lg">
            <SectionHeading
              eyebrow="Sample"
              title="A tidy, planted garden — without the stress"
              lede="From overgrown corners to designed beds and ongoing care, we look after the outdoor spaces you actually want to spend time in."
              align="center"
            />
          </Card>
        </section>
      </Container>
    </main>
  );
}
