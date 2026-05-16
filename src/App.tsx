import { lazy, Suspense } from 'react';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/nav/Footer';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Projects } from '@/components/sections/Projects';
import { Process } from '@/components/sections/Process';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { StructuredData } from '@/components/util/StructuredData';

const ThanksPage = lazy(() => import('@/pages/ThanksPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const Styleguide = lazy(() => import('@/dev/Styleguide'));

function currentPath(): string {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname.replace(/\/+$/, '');
  return path === '' ? '/' : path;
}

const PageLoading = () => (
  <div className="p-10 text-ink/70" aria-busy="true">
    Loading…
  </div>
);

export default function App() {
  const path = currentPath();

  if (import.meta.env.DEV && path === '/dev/styleguide') {
    return (
      <Suspense fallback={<PageLoading />}>
        <Styleguide />
      </Suspense>
    );
  }

  if (path === '/thanks') {
    return (
      <Suspense fallback={<PageLoading />}>
        <ThanksPage />
      </Suspense>
    );
  }
  if (path === '/privacy') {
    return (
      <Suspense fallback={<PageLoading />}>
        <PrivacyPage />
      </Suspense>
    );
  }
  if (path === '/terms') {
    return (
      <Suspense fallback={<PageLoading />}>
        <TermsPage />
      </Suspense>
    );
  }

  if (path !== '/') {
    return (
      <Suspense fallback={<PageLoading />}>
        <NotFoundPage />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <StructuredData />
      <Header />
      <main id="main-content">
        <Hero />
        <Services />
        <Projects />
        <Process />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
