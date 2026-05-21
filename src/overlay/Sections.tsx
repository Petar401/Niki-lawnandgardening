import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSceneStore } from '@/store/useSceneStore';
import { ContactForm } from './ContactForm';
import { Testimonials } from './Testimonials';
import { Faq } from './Faq';
import { Footer } from './Footer';
import { Privacy } from './Privacy';
import { CONTACT_AREA_LONG } from '@/config/contact';
import { PRICING, priceLabel } from '@/config/pricing';

/**
 * Four stacked full-height sections. Each is the *scroll surface* for one
 * camera waypoint. Per-section content fades + slides in when its phase
 * is active, and back out when it isn't, using Framer Motion.
 */
export function Sections() {
  const phase = useSceneStore((s) => s.phase);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
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
            Mowing, landscaping, hedging, and seasonal care across {CONTACT_AREA_LONG}.
            Scroll to take the tour.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#contact"
              className="rounded-full bg-sun-500 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-dusk-900 shadow-[0_6px_18px_rgba(245,177,58,0.45)] transition-all hover:-translate-y-0.5 hover:bg-sun-400 hover:shadow-[0_8px_22px_rgba(245,177,58,0.55)]"
            >
              Free quote
            </a>
            <a
              href="#gallery"
              className="rounded-full border border-cream/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cream/85 transition-colors hover:border-cream/60 hover:bg-cream/10"
            >
              See our work
            </a>
          </div>
          <ScrollHint />
        </div>
      </Section>

      <Section id="services" active={phase === 'services'} align="left">
        <div className="max-w-md">
          <SectionEyebrow>02 · Services</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold text-cream sm:text-4xl md:text-5xl">
            Four things, done with care.
          </h2>
          <p className="mt-4 text-cream/80">
            Hover an orb to read more — mowing, landscaping, hedging, and
            seasonal cleanup. Tap on touch devices.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-cream/65">
            {PRICING.map((p) => (
              <li
                key={p.id}
                className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-3 py-1"
              >
                <span>{p.label}</span>
                <span className="text-cream/45">·</span>
                <span className="normal-case tracking-normal text-cream/55">{priceLabel(p)}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="gallery" active={phase === 'gallery'} align="right">
        <div className="ml-auto w-full max-w-2xl text-right">
          <SectionEyebrow>03 · Before / After</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold text-cream sm:text-4xl md:text-5xl">
            Drag the seam.
          </h2>
          <p className="mt-4 text-cream/80">
            Real yards. Press and slide left or right on either photo to compare.
            Step through the arch to find the next chapter.
          </p>
          <Testimonials />
        </div>
      </Section>

      <Section id="contact" active={phase === 'contact'} stretch>
        <div className="mx-auto w-full max-w-xl text-center">
          <SectionEyebrow>04 · Contact</SectionEyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold text-cream sm:text-4xl md:text-5xl">
            Let&apos;s grow something.
          </h2>
          <p className="mx-auto mt-2 hidden max-w-md text-cream/75 sm:block">
            Drop a few details — we&apos;ll come look and send a quote within a business day.
          </p>
          <div className="mt-4 sm:mt-8">
            <ContactForm />
          </div>
          <Faq />
          <Footer onOpenPrivacy={() => setPrivacyOpen(true)} />
        </div>
      </Section>

      <AnimatePresence>
        {privacyOpen && <Privacy onClose={() => setPrivacyOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

interface SectionProps {
  id: string;
  active: boolean;
  align?: 'left' | 'right' | 'center';
  /** Allow the section to grow past viewport height so trailing content
   *  (testimonials, FAQ, footer) is reachable on small screens. */
  stretch?: boolean;
  children: React.ReactNode;
}

function Section({ id, active, align = 'center', stretch = false, children }: SectionProps) {
  const justify =
    align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';
  const reduced = useSceneStore((s) => s.reducedMotion);
  const heightCls = stretch
    ? 'min-h-[100dvh] py-20 sm:py-28'
    : 'h-[100dvh] min-h-[100svh]';

  return (
    <section
      id={id}
      aria-current={active ? 'page' : undefined}
      className={`relative flex ${heightCls} w-full items-center px-6 sm:px-12 ${justify}`}
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
