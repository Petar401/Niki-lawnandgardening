import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

import { Logo } from './Logo';

/**
 * Full-viewport curtain shown until the R3F scene + its first wave of
 * textures have loaded. Fades out smoothly so the world is the first
 * thing the visitor actually sees, not a blank canvas.
 *
 * drei's <useProgress/> reports any active loader; we wait until both
 * `active === false` *and* a minimum dwell has passed so the curtain
 * doesn't strobe on fast networks.
 */
const MIN_DWELL_MS = 600;

export function LoadingCurtain() {
  const { active, progress } = useProgress();
  const [done, setDone] = useState(false);
  const [readyAt, setReadyAt] = useState<number | null>(null);

  useEffect(() => {
    if (!active && readyAt === null) setReadyAt(performance.now());
  }, [active, readyAt]);

  useEffect(() => {
    if (readyAt === null) return;
    const remaining = Math.max(0, MIN_DWELL_MS - (performance.now() - readyAt));
    const t = window.setTimeout(() => setDone(true), remaining);
    return () => clearTimeout(t);
  }, [readyAt]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-dusk-900"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-6">
            <Logo />
            <div className="h-px w-40 overflow-hidden rounded-full bg-cream/10">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: `${progress - 100}%` }}
                transition={{ duration: 0.2 }}
                className="h-full w-full bg-gradient-to-r from-transparent via-sun-400 to-transparent"
              />
            </div>
            <p className="font-display text-[10px] uppercase tracking-[0.32em] text-cream/55">
              Planting your garden…
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
