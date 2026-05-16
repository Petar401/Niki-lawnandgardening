import { site } from '@/content/site';
import { cn } from '@/lib/cn';

type Props = { className?: string; tone?: 'forest' | 'cream' };

export function Wordmark({ className, tone = 'forest' }: Props) {
  const text = tone === 'forest' ? 'text-forest' : 'text-cream';
  const accent = tone === 'forest' ? 'text-leaf' : 'text-moss';
  return (
    <a
      href="#top"
      className={cn('group inline-flex items-center gap-2.5', className)}
      aria-label={`${site.brand} — home`}
    >
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-inset',
          tone === 'forest' ? 'bg-forest/[0.06] ring-forest/15' : 'bg-cream/10 ring-cream/30',
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className={cn('h-4 w-4', accent)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4c-3 3-5 6-5 9a5 5 0 0 0 10 0c0-3-2-6-5-9Z" />
          <path d="M12 7v12" />
        </svg>
      </span>
      <span className="flex items-baseline gap-1.5">
        <span className={cn('font-display text-lg font-semibold leading-none', text)}>
          {site.brand.split(' ')[0]}
        </span>
        <span className={cn('hidden text-xs font-medium tracking-wide sm:inline', text)}>
          Lawn &amp; Gardening
        </span>
      </span>
    </a>
  );
}
