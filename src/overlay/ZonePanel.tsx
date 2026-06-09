import { AnimatePresence, motion } from 'framer-motion';

import { useSceneStore } from '@/store/useSceneStore';
import { NODES_BY_ID } from '@/scene/navigationNodes';
import { ContactForm } from './ContactForm';

/**
 * Floating glass detail panel for the active zone. Slides in from the left
 * when the camera arrives, swaps content per zone, and shows the full
 * ContactForm when the contact zone is active. For every other zone a
 * "Get a quote" CTA flies the camera to contact.
 *
 * Replaces the per-section overlay copy that used to live in Sections.tsx.
 */
export function ZonePanel() {
  const activeZone = useSceneStore((s) => s.activeZone);
  const reduced = useSceneStore((s) => s.reducedMotion);
  const navigateTo = useSceneStore((s) => s.navigateTo);
  const node = activeZone ? NODES_BY_ID[activeZone] : null;

  return (
    <AnimatePresence mode="wait">
      {node && (
        <motion.aside
          key={node.id}
          initial={{ opacity: 0, x: -32, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
          transition={{ duration: reduced ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed bottom-6 left-4 z-20 w-[calc(100%-2rem)] max-w-sm sm:bottom-8 sm:left-12"
        >
          <div className="glass pointer-events-auto rounded-3xl px-6 py-5">
            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-sun-200">
              {node.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-cream">
              {node.service.title}
            </h2>
            <p className="mt-2 text-sm leading-snug text-cream/85">{node.service.oneLiner}</p>

            <ul className="mt-3 space-y-1.5 text-[12px] text-cream/75">
              {node.service.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-moss-300" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {node.id === 'contact' ? (
              <div className="mt-4">
                <ContactForm />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigateTo('contact')}
                className="mt-4 inline-flex rounded-full bg-sun-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-dusk-900 shadow-[0_4px_14px_rgba(245,177,58,0.45)] transition-all hover:-translate-y-0.5 hover:bg-sun-400"
              >
                {node.service.ctaLabel}
              </button>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
