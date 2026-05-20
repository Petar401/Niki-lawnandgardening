import { useSceneStore } from '@/store/useSceneStore';

/**
 * Four stacked full-height sections. Each is the *scroll surface* for one
 * camera waypoint. Real content for each section lands in later steps:
 *   - Hero          (this step: title + scroll hint)
 *   - Services      (Step 6: orb scene labels + service copy)
 *   - Gallery       (Step 7: before/after explanation)
 *   - Contact       (Step 8: form + send confirmation)
 *
 * The sections live in normal document flow so the page actually scrolls;
 * the R3F canvas is `position: fixed` behind everything in App.tsx.
 */
export function Sections() {
  const phase = useSceneStore((s) => s.phase);

  return (
    <>
      {/* HERO */}
      <Section id="hero" active={phase === 'hero'}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-sun-200 drop-shadow-md">
            Niki Lawn &amp; Gardening
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-cream drop-shadow-[0_4px_18px_rgba(0,0,0,0.5)] sm:text-5xl md:text-7xl">
            A living garden,{' '}
            <span className="italic text-moss-200">in your browser.</span>
          </h1>
          <p className="mt-6 text-base text-cream/80 sm:text-lg">
            Mowing, landscaping, hedging, and seasonal care across the neighbourhood.
            Scroll to take the tour.
          </p>
          <ScrollHint />
        </div>
      </Section>

      {/* SERVICES (placeholder copy; orbs land in Step 6) */}
      <Section id="services" active={phase === 'services'} align="left">
        <div className="max-w-md">
          <SectionEyebrow>02 · Services</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold text-cream sm:text-4xl md:text-5xl">
            Four things, done with care.
          </h2>
          <p className="mt-4 text-cream/80">
            Mowing · Landscaping · Hedging · Seasonal cleanup. Interactive orbs
            land in Step 6.
          </p>
        </div>
      </Section>

      {/* GALLERY (placeholder; 3D before/after gate lands in Step 7) */}
      <Section id="gallery" active={phase === 'gallery'} align="right">
        <div className="ml-auto max-w-md text-right">
          <SectionEyebrow>03 · Before / After</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold text-cream sm:text-4xl md:text-5xl">
            Drag the gate.
          </h2>
          <p className="mt-4 text-cream/80">
            Real yards we've transformed. The 3D before/after slider lands in Step 7.
          </p>
        </div>
      </Section>

      {/* CONTACT (skeleton; form lands in Steps 5 + 8) */}
      <Section id="contact" active={phase === 'contact'}>
        <div className="mx-auto max-w-xl text-center">
          <SectionEyebrow>04 · Contact</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold text-cream sm:text-4xl md:text-5xl">
            Let's grow something.
          </h2>
          <p className="mt-4 text-cream/80">
            Mailbox, contact form, and firefly burst land in Step 8.
          </p>
        </div>
      </Section>
    </>
  );
}

interface SectionProps {
  id: string;
  active: boolean;
  align?: 'left' | 'right' | 'center';
  children: React.ReactNode;
}

function Section({ id, active, align = 'center', children }: SectionProps) {
  const justify =
    align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';

  return (
    <section
      id={id}
      aria-current={active ? 'true' : undefined}
      className={`relative flex h-screen w-full items-center px-6 sm:px-12 ${justify}`}
    >
      <div
        className={`relative z-10 transition-opacity duration-700 ${
          active ? 'opacity-100' : 'opacity-50'
        }`}
      >
        {children}
      </div>
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-[10px] uppercase tracking-[0.4em] text-sun-200 drop-shadow-md">
      {children}
    </p>
  );
}

function ScrollHint() {
  return (
    <div className="mt-12 inline-flex flex-col items-center gap-2 text-cream/70">
      <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
      <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-cream/80 to-transparent" />
    </div>
  );
}
