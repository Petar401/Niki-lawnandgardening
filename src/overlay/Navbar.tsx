import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from './Logo';
import { useSceneStore } from '@/store/useSceneStore';

const LINKS: { href: string; label: string }[] = [
  { href: '#hero', label: 'Garden' },
  { href: '#services', label: 'Services' },
  { href: '#gallery', label: 'Before / After' },
  { href: '#contact', label: 'Contact' },
];

/**
 * Top navigation: logo left, anchor links centre (sm+), CTA right.
 *   - Always visible, glass background.
 *   - On mobile a hamburger toggles a full-screen menu sheet.
 *   - Anchor clicks rely on the existing #section ids in <Sections/>.
 */
const PHASE_TO_HREF: Record<string, string> = {
  hero: '#hero',
  services: '#services',
  gallery: '#gallery',
  contact: '#contact',
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const phase = useSceneStore((s) => s.phase);

  // Close the mobile sheet on hash change or escape.
  useEffect(() => {
    if (!open) return;
    const onHash = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('hashchange', onHash);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#hero" className="glass rounded-full px-4 py-2">
            <Logo />
          </a>

          {/* Desktop links */}
          <nav className="hidden md:block">
            <ul className="glass flex items-center gap-1 rounded-full px-2 py-1.5">
              {LINKS.map((l) => {
                const isActive = PHASE_TO_HREF[phase] === l.href;
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className={`block rounded-full px-3 py-1.5 text-[12px] uppercase tracking-[0.22em] transition-colors hover:bg-cream/10 hover:text-cream ${
                        isActive ? 'bg-cream/[0.12] text-cream' : 'text-cream/85'
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-full bg-sun-500 px-4 py-2 text-[12px] font-semibold uppercase tracking-widest text-dusk-900 shadow-[0_4px_14px_rgba(245,177,58,0.45)] transition-all hover:-translate-y-0.5 hover:bg-sun-400 hover:shadow-[0_6px_20px_rgba(245,177,58,0.6)] sm:inline-flex"
            >
              Get a quote
            </a>

            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="glass inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            >
              <BurgerIcon open={open} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-20 bg-dusk-900/70 backdrop-blur-md md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-24 max-w-sm px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="flex flex-col gap-1 rounded-3xl glass p-3">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="block rounded-2xl px-4 py-3 font-display text-lg text-cream/90 hover:bg-cream/10"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li className="mt-2">
                  <a
                    href="#contact"
                    className="block rounded-2xl bg-sun-500 px-4 py-3 text-center font-semibold uppercase tracking-widest text-dusk-900"
                  >
                    Get a quote
                  </a>
                </li>
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-5">
      <span
        className={`absolute left-0 top-0 h-[1.5px] w-full bg-cream transition-transform ${
          open ? 'translate-y-1.5 rotate-45' : ''
        }`}
      />
      <span
        className={`absolute left-0 top-1.5 h-[1.5px] w-full bg-cream transition-opacity ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`absolute left-0 top-3 h-[1.5px] w-full bg-cream transition-transform ${
          open ? '-translate-y-1.5 -rotate-45' : ''
        }`}
      />
    </span>
  );
}
