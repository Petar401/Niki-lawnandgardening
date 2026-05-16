import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  align?: 'left' | 'center';
  size?: 'md' | 'lg';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  size = 'lg',
  as: HeadingTag = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-eyebrow font-medium uppercase text-forest">{eyebrow}</span>
      ) : null}
      <HeadingTag
        className={cn(
          'text-balance font-display text-forest',
          size === 'lg' ? 'text-display-lg' : 'text-display-md',
        )}
      >
        {title}
      </HeadingTag>
      {lede ? (
        <p
          className={cn(
            'max-w-prose text-pretty text-lg leading-relaxed text-ink/75',
            align === 'center' && 'mx-auto',
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}
