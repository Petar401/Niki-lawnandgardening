import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button, Container, Icon } from '@/components/primitives';
import { Wordmark } from './Wordmark';
import { navLinks } from '@/content/nav';
import { site } from '@/content/site';
import { cn } from '@/lib/cn';

type Props = { open: boolean; onClose: () => void };

export function MobileMenu({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Lock body scroll, autofocus the close button, Esc to close, Tab trapped within the panel.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const getFocusable = (): HTMLElement[] => {
      if (!panelRef.current) return [];
      return Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('aria-hidden'));
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        'fixed inset-0 z-50 lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-ink/30 backdrop-blur-sm transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />
      {/* panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          'absolute inset-x-0 top-0 origin-top bg-cream shadow-lift transition-transform duration-200 ease-out-soft',
          open ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <Container className="flex h-16 items-center justify-between">
          <Wordmark />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-forest hover:bg-forest/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bloom focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            aria-label="Close menu"
          >
            <Icon icon={X} />
          </button>
        </Container>
        <nav aria-label="Primary" className="border-t border-stone/60">
          <Container className="py-4">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between py-3 font-display text-2xl text-forest hover:text-leaf"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-stone/60 pt-6">
              <Button
                as="a"
                href={site.cta.primary.href}
                onClick={onClose}
                fullWidth
                size="lg"
              >
                {site.cta.primary.label}
              </Button>
            </div>
          </Container>
        </nav>
      </div>
    </div>
  );
}
