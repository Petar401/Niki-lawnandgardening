import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Button, Container, Icon } from '@/components/primitives';
import { navLinks } from '@/content/nav';
import { site } from '@/content/site';
import { cn } from '@/lib/cn';
import { Wordmark } from './Wordmark';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-200',
          scrolled
            ? 'border-b border-stone/60 bg-cream/85 backdrop-blur'
            : 'border-b border-transparent bg-cream/0',
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-forest focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-cream focus:shadow-lift focus:outline-none focus:ring-2 focus:ring-bloom focus:ring-offset-2 focus:ring-offset-cream"
        >
          Skip to main content
        </a>
        <Container className="flex h-16 items-center justify-between gap-6">
          <Wordmark />
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-ink/75 transition-colors hover:bg-forest/[0.06] hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bloom focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              as="a"
              href={site.cta.primary.href}
              size="sm"
              className="hidden sm:inline-flex"
            >
              {site.cta.primary.label}
            </Button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-forest hover:bg-forest/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bloom focus-visible:ring-offset-2 focus-visible:ring-offset-cream lg:hidden"
            >
              <Icon icon={Menu} />
            </button>
          </div>
        </Container>
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
