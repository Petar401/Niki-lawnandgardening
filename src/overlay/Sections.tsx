import { motion } from 'framer-motion';
import { useSceneStore } from '@/store/useSceneStore';
import { ContactForm } from './ContactForm';
import { NorfolkMap } from './NorfolkMap';
import {
  CONTACT_AREA,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_EMAIL,
} from '@/config/contact';

/**
 * Four stacked full-height sections. Each is the *scroll surface* for one
 * camera waypoint. Per-section content fades + slides in when its phase
 * is active, and back out when it isn't, using Framer Motion.
 *
 * Each section now ships its own dark radial scrim under the content so
 * white/cream text stays legible against the bright noon sky.
 */
export function Sections() {
  const phase = useSceneStore((s) => s.phase);

  return (
    <>
      <Section id="hero" active={phase === 'hero'} scrim="hero">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.4em] text-sun-200 text-shadow-strong">
            Niki Lawn &amp; Gardening · Norwich
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-cream text-shadow-strong sm:text-5xl md:text-7xl">
            A living garden,{' '}
            <span className="italic text-moss-200">in your browser.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl rounded-2xl bg-black/30 px-5 py-3 text-base text-cream backdrop-blur-sm sm:text-lg">
            Mowing, landscaping, hedging and seasonal care across{' '}
            <strong className="text-sun-200">Norwich and Norfolk</strong>.
            Scroll to wander the garden — drag the photo seam, tap the orbs, and watch the seasons turn.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#contact"
              className="rounded-full bg-sun-500 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-dusk-900 shadow-[0_6px_18px_rgba(245,177,58,0.45)] transition-all hover:-translate-y-0.5 hover:bg-sun-400 hover:shadow-[0_8px_22px_rgba(245,177,58,0.55)]"
            >
              Get a free quote
            </a>
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="rounded-full bg-moss-500/90 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cream shadow-[0_6px_18px_rgba(63,138,60,0.45)] transition-all hover:-translate-y-0.5 hover:bg-moss-400"
            >
              Call {CONTACT_PHONE_DISPLAY}
            </a>
            <a
              href="#services"
              className="rounded-full border border-cream/40 bg-black/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cream backdrop-blur-sm transition-colors hover:border-cream/70 hover:bg-black/50"
            >
              See services
            </a>
          </div>
          <ScrollHint />
        </div>
      </Section>

      <Section id="services" active={phase === 'services'} align="left" scrim="left">
        <div className="max-w-md">
          <SectionEyebrow>02 · Services</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold text-cream text-shadow-strong sm:text-4xl md:text-5xl">
            Four things, done with care.
          </h2>
          <p className="mt-4 rounded-2xl bg-black/30 px-4 py-3 text-cream backdrop-blur-sm">
            Hover an orb to read more — mowing, landscaping, hedging, and
            seasonal cleanup. Tap on touch devices.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-cream">
            <li className="rounded-full border border-cream/30 bg-black/30 px-3 py-1 backdrop-blur-sm">Mowing</li>
            <li className="rounded-full border border-cream/30 bg-black/30 px-3 py-1 backdrop-blur-sm">Landscaping</li>
            <li className="rounded-full border border-cream/30 bg-black/30 px-3 py-1 backdrop-blur-sm">Hedging</li>
            <li className="rounded-full border border-cream/30 bg-black/30 px-3 py-1 backdrop-blur-sm">Seasonal</li>
          </ul>
        </div>
      </Section>

      <Section id="gallery" active={phase === 'gallery'} align="right" scrim="right">
        <div className="ml-auto max-w-md text-right">
          <SectionEyebrow>03 · Before / After</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold text-cream text-shadow-strong sm:text-4xl md:text-5xl">
            Drag the seam.
          </h2>
          <p className="mt-4 rounded-2xl bg-black/30 px-4 py-3 text-cream backdrop-blur-sm">
            Real Norwich gardens. Press and slide left or right on either photo to
            compare. Step through the arch to find the next chapter.
          </p>
        </div>
      </Section>

      <Section id="contact" active={phase === 'contact'} scrim="center">
        <div className="mx-auto w-full max-w-2xl text-center">
          <SectionEyebrow>04 · Contact</SectionEyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold text-cream text-shadow-strong sm:text-4xl md:text-5xl">
            Let's grow something.
          </h2>
          <p className="mx-auto mt-2 hidden max-w-md rounded-2xl bg-black/30 px-4 py-2 text-cream backdrop-blur-sm sm:block">
            Drop a few details — Niki replies within a business day. Or call{' '}
            <a className="font-semibold text-sun-200 hover:underline" href={`tel:${CONTACT_PHONE_TEL}`}>
              {CONTACT_PHONE_DISPLAY}
            </a>
            .
          </p>
          <div className="mt-4 sm:mt-8">
            <ContactForm />
          </div>
          <div className="mt-6">
            <NorfolkMap />
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-cream/70 text-shadow-soft">
            Covering {CONTACT_AREA} · {' '}
            <a className="text-sun-200 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
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
  scrim?: 'hero' | 'left' | 'right' | 'center';
  children: React.ReactNode;
}

function Section({ id, active, align = 'center', scrim, children }: SectionProps) {
  const justify =
    align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';
  const reduced = useSceneStore((s) => s.reducedMotion);
  const scrimClass =
    scrim === 'hero'
      ? 'scrim-hero'
      : scrim === 'left'
        ? 'scrim-left'
        : scrim === 'right'
          ? 'scrim-right'
          : scrim === 'center'
            ? 'scrim-center'
            : '';

  return (
    <section
      id={id}
      aria-current={active ? 'true' : undefined}
      className={`relative flex min-h-screen w-full items-center px-6 py-16 sm:px-12 ${justify}`}
    >
      {scrimClass && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-[1] ${scrimClass}`}
        />
      )}
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
    <p className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-sun-200 text-shadow-strong">
      {children}
    </p>
  );
}

function ScrollHint() {
  return (
    <div className="mt-12 inline-flex flex-col items-center gap-2 text-cream/85">
      <span className="text-[10px] uppercase tracking-[0.4em] text-shadow-soft">Scroll</span>
      <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-cream/90 to-transparent" />
    </div>
  );
}
