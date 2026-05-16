import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ContainerProps<E extends ElementType = 'div'> = {
  as?: E;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<E>, 'as' | 'className' | 'children'>;

const sizeClasses: Record<NonNullable<ContainerProps['size']>, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
};

export function Container<E extends ElementType = 'div'>({
  as,
  size = 'xl',
  className,
  children,
  ...rest
}: ContainerProps<E>) {
  const Component = (as ?? 'div') as ElementType;
  return (
    <Component
      className={cn('mx-auto w-full px-5 sm:px-6 lg:px-8', sizeClasses[size], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
