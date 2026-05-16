import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type ButtonOwnProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
};

type ButtonProps<E extends ElementType = 'button'> = ButtonOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps | 'as'>;

const base =
  'inline-flex items-center justify-center gap-2 font-sans font-medium ' +
  'rounded-md transition-all duration-200 ease-out-soft ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bloom focus-visible:ring-offset-2 focus-visible:ring-offset-cream ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'select-none whitespace-nowrap';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-forest text-cream hover:bg-forest/90 active:bg-forest shadow-soft hover:shadow-lift',
  secondary:
    'bg-cream text-forest border border-forest/15 hover:border-forest/30 hover:bg-mist',
  ghost:
    'bg-transparent text-forest hover:bg-forest/5',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-12 px-7 text-base sm:h-[3.25rem]',
};

export function Button<E extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  className,
  children,
  ...rest
}: ButtonProps<E>) {
  const Component = (as ?? 'button') as ElementType;
  const extraProps: Record<string, unknown> = {};
  if (Component === 'button' && !('type' in rest)) {
    extraProps.type = 'button';
  }
  return (
    <Component
      className={cn(
        base,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...extraProps}
      {...rest}
    >
      {leadingIcon ? <span className="-ml-0.5 inline-flex">{leadingIcon}</span> : null}
      {children}
      {trailingIcon ? <span className="-mr-0.5 inline-flex">{trailingIcon}</span> : null}
    </Component>
  );
}
