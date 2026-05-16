import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type CardProps<E extends ElementType = 'div'> = {
  as?: E;
  variant?: 'default' | 'interactive' | 'subtle';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<E>, 'as' | 'className' | 'children'>;

const variantClasses = {
  default: 'bg-white border border-stone/60 shadow-soft',
  interactive:
    'bg-white border border-stone/60 shadow-soft transition-all duration-200 ease-out-soft hover:-translate-y-0.5 hover:shadow-lift hover:border-leaf/40',
  subtle: 'bg-mist border border-stone/40',
} as const;

const paddingClasses = {
  sm: 'p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-7 sm:p-9',
} as const;

export function Card<E extends ElementType = 'div'>({
  as,
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...rest
}: CardProps<E>) {
  const Component = (as ?? 'div') as ElementType;
  return (
    <Component
      className={cn(
        'rounded-lg',
        variantClasses[variant],
        paddingClasses[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
