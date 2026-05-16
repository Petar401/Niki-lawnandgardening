import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Reserved for future scroll-in animation; currently ignored. */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'header';
};

/**
 * Group wrapper used in section composition. Currently a no-op passthrough so
 * content is always visible — earlier versions used opacity-based scroll-in
 * reveals, but those left content invisible when JS was slow or the element
 * never entered the viewport (e.g. fullPage screenshots, JS-disabled crawls).
 * Subtle motion is reserved for the 3D hero. If we want section-level
 * micro-interactions later, we can re-add them via scroll-timeline CSS
 * (progressive enhancement only — never hide the content underneath).
 */
export function Reveal({ children, className, as: Tag = 'div' }: Props) {
  return <Tag className={className}>{children}</Tag>;
}
