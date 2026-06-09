import { motion } from 'framer-motion';
import { useSceneStore } from '@/store/useSceneStore';
import { ContactForm } from './ContactForm';

/**
 * Four stacked full-height sections. Each is the *scroll surface* for one
 * camera waypoint. Per-section content fades + slides in when its phase
 * is active, and back out when it isn't, using Framer Motion.
 */
export function Sections() {
  const phase = useSceneStore((s) => s.phase);

  return (
    <>
      <Section id="hero" active={phase === 'hero'}>
        <div className="relative mx-auto max-w-3xl text-center">
          {/* Soft radial darkness pool behind text — invisible on dark areas, lifts text from bright sky */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 scale-110"
            style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 50%, rgba(10,6,28,0.32) 0%, transparent 70%)' }}
          />
          <p className="font-display text-xs uppercase tracking-[0.4em] text-sun-200 drop-shadow-md text-readable">
            Niki Lawn &amp; Gardening
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-cream drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] sm:text-5xl md:text-7xl">
            A living garden,{' '}
            <span className="italic text-moss-200">in your browser.</span>
          </h1>
          <p className="mt-6 text-base text-cream/90 sm:text-lg text-readable">
            Mowing, landscaping, hedging, and seasonal care across the neighbourhood.
            Scroll to take the tour.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#contact"
              className="rounded-full bg-sun-500 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-dusk-900 shadow-[0_6px_18px_rgba(245,177,58,0.45)] transition-all hover:-translate-y-0.5 hover:bg-sun-400 hover:shadow-[0_8px_22px_rgba(245,177,58,0.55)] active:scale-95 active:shadow-none"
            >
              Get a quote
            </a>
            <a
              href="#services"
              className="rounded-full border border-cream/50 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cream/90 transition-colors hover:border-cream/70 hover:bg-cream/10"
            >
              See services
            </a>
          </div>
          <ScrollHint />
        </div>
      </Section>

      <Section id="services" active={phase === 'services'} align="left">
        <div className="relative max-w-md">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 scale-110"
            style={{ background: 'radial-gradient(ellipse 130% 90% at 30% 50%, rgba(10,6,28,0.30) 0%, transparent 70%)' }}
          />
          <SectionEyebrow>02 · Services</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold text-cream drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] sm:text-4xl md:text-5xl">
            Four things, done with care.
          </h2>
          <p className="mt-4 text-cream/90 text-readable">
            Hover an orb to read more — mowing, landscaping, hedging, and
            seasonal cleanup. Tap on touch devices.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-cream/75">
            <li className="rounded-full border border-cream/30 px-3 py-1">Mowing</li>
            <li className="rounded-full border border-cream/30 px-3 py-1">Landscaping</li>
            <li className="rounded-full border border-cream/30 px-3 py-1">Hedging</li>
            <li className="rounded-full border border-cream/30 px-3 py-1">Seasonal</li>
          </ul>
        </div>
      </Section>

      <Section id="gallery" active={phase === 'gallery'} align="right">
        <div className="relative ml-auto max-w-md text-right">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 scale-110"
            style={{ background: 'radial-gradient(ellipse 130% 90% at 70% 50%, rgba(10,6,28,0.30) 0%, transparent 70%)' }}
          />
          <SectionEyebrow>03 · Before / After</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold text-cream drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] sm:text-4xl md:text-5xl">
            Drag the seam.
          </h2>
          <p className="mt-4 text-cream/90 text-readable">
            Real yards. Press and slide left or right on either photo to compare.
            Step through the arch to find the next chapter.
          </p>
        </div>
      </Section>

      <Section id="contact" active={phase === 'contact'}>
        <div className="relative mx-auto w-full max-w-xl text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 scale-110"
            style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 50%, rgba(10,6,28,0.32) 0%, transparent 70%)' }}
          />
          <SectionEyebrow>04 · Contact</SectionEyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold text-cream drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] sm:text-4xl md:text-5xl">
            Let's grow something.
          </h2>
          <p className="mx-auto mt-2 hidden max-w-md text-cream/85 sm:block text-readable">
            Drop a few details — we'll come look and send a quote within a business day.
          </p>
          <div className="mt-4 sm:mt-8">
            <ContactForm />
          </div>
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
  const reduced = useSceneStore((s) => s.reducedMotion);

  return (
    <section
      id={id}
      aria-current={active ? 'true' : undefined}
      className={`relative flex h-screen w-full items-center px-6 sm:px-12 ${justify}`}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: active ? 1 : reduced ? 1 : 0.35,
          y: active || reduced ? 0 : 18,
          filter: active || reduced ? 'blur(0px)' : 'blur(3px)',
        }}
        transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full"
      >
        {children}
      </motion.div>
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-[10px] uppercase tracking-[0.4em] text-sun-200 drop-shadow-md text-readable">
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
