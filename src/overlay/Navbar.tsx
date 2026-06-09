import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from './Logo';
import { useSceneStore } from '@/store/useSceneStore';
import { type ZoneId } from '@/scene/navigationNodes';

const LINKS: { id: ZoneId; label: string }[] = [
  { id: 'entry', label: 'Garden' },
  { id: 'lawn', label: 'Lawn' },
  { id: 'hedges', label: 'Hedges' },
  { id: 'flowerbeds', label: 'Beds' },
  { id: 'patio', label: 'Before / After' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Top navigation: logo left, zone links centre (md+), CTA right.
 *   - Always visible, glass background.
 *   - On mobile a hamburger toggles a full-screen menu sheet.
 *   - Clicks fly the camera to the zone via the store's navigateTo.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const activeZone = useSceneStore((s) => s.activeZone);
  const navigateTo = useSceneStore((s) => s.navigateTo);

  const go = (id: ZoneId) => {
    navigateTo(id);
    setOpen(false);
  };

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
          <button type="button" onClick={() => go('entry')} className="glass rounded-full px-4 py-2">
            <Logo />
          </button>

          {/* Desktop links */}
          <nav className="hidden md:block">
            <ul className="glass flex items-center gap-1 rounded-full px-2 py-1.5">
              {LINKS.map((l) => {
                const isActive = activeZone === l.id;
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => go(l.id)}
                      className={`block rounded-full px-3 py-1.5 text-[12px] uppercase tracking-[0.22em] transition-colors hover:bg-cream/10 hover:text-cream ${
                        isActive ? 'bg-cream/[0.12] text-cream' : 'text-cream/85'
                      }`}
                    >
                      {l.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go('contact')}
              className="hidden rounded-full bg-sun-500 px-4 py-2 text-[12px] font-semibold uppercase tracking-widest text-dusk-900 shadow-[0_4px_14px_rgba(245,177,58,0.45)] transition-all hover:-translate-y-0.5 hover:bg-sun-400 hover:shadow-[0_6px_20px_rgba(245,177,58,0.6)] sm:inline-flex"
            >
              Get a quote
            </button>

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
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => go(l.id)}
                      className="block w-full rounded-2xl px-4 py-3 text-left font-display text-lg text-cream/90 hover:bg-cream/10"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
                <li className="mt-2">
                  <button
                    type="button"
                    onClick={() => go('contact')}
                    className="block w-full rounded-2xl bg-sun-500 px-4 py-3 text-center font-semibold uppercase tracking-widest text-dusk-900"
                  >
                    Get a quote
                  </button>
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
