import { motion } from 'framer-motion';
import { TESTIMONIALS } from '@/config/testimonials';

/**
 * Three-quote testimonial strip. Rendered inside Sections between gallery
 * and contact. Reads from src/config/testimonials.ts so Niki can swap the
 * placeholders without touching JSX.
 */
export function Testimonials() {
  return (
    <div className="mx-auto mt-6 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
      {TESTIMONIALS.map((t, i) => (
        <motion.figure
          key={`${t.name}-${i}`}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-3xl p-4 text-left"
        >
          <blockquote className="text-[13px] leading-relaxed text-cream/85">
            “{t.quote}”
          </blockquote>
          <figcaption className="mt-3 text-[10px] uppercase tracking-[0.28em] text-cream/55">
            {t.name} · {t.location}
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
