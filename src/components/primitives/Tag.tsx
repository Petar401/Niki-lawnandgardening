import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type TagProps = {
  children: ReactNode;
  tone?: 'leaf' | 'bloom' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
};

const toneClasses: Record<NonNullable<TagProps['tone']>, string> = {
  leaf: 'bg-forest/[0.08] text-forest ring-forest/15',
  bloom: 'bg-bloom/[0.12] text-soil ring-bloom/30',
  neutral: 'bg-stone/40 text-ink/75 ring-stone',
};

const sizeClasses: Record<NonNullable<TagProps['size']>, string> = {
  sm: 'h-6 px-2.5 text-[0.7rem]',
  md: 'h-7 px-3 text-xs',
};

export function Tag({ children, tone = 'leaf', size = 'sm', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium uppercase tracking-wider ring-1 ring-inset',
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
