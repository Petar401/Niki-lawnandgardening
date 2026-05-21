import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FAQ } from '@/config/faq';

/**
 * Accessible accordion. One open at a time; ESC + arrow-key navigation
 * intentionally skipped — three to eight items is small enough that the
 * native tab order through each header is enough.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mx-auto mt-8 w-full max-w-xl text-left">
      <h3 className="font-display text-xs uppercase tracking-[0.4em] text-sun-200 drop-shadow-md">
        Common questions
      </h3>
      <ul className="mt-3 divide-y divide-cream/10 rounded-3xl bg-dusk-900/40 ring-1 ring-cream/10">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium text-cream/90 transition-colors hover:bg-cream/5"
              >
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className={`inline-block h-2 w-2 rotate-45 border-b border-r border-cream/50 transition-transform ${
                    isOpen ? '-rotate-[135deg]' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-[13px] leading-relaxed text-cream/75">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
