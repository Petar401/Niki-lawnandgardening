import type { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '@/lib/cn';

type IconProps = LucideProps & {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
};

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export function Icon({ icon: Lucide, size = 'md', label, className, ...rest }: IconProps) {
  const accessibleProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true };
  return (
    <Lucide
      size={sizeMap[size]}
      strokeWidth={1.75}
      className={cn('shrink-0', className)}
      {...accessibleProps}
      {...rest}
    />
  );
}
