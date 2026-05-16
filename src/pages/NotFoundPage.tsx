import { ArrowLeft } from 'lucide-react';
import { Button, Container, Icon } from '@/components/primitives';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/nav/Footer';
import { site } from '@/content/site';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle(`Page not found · ${site.brand}`);
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <Header />
      <main id="main-content" className="flex flex-1 items-center">
        <Container size="md" className="py-24 text-center">
          <p className="text-eyebrow font-medium uppercase text-forest">404</p>
          <h1 className="mt-3 font-display text-display-lg text-forest">
            That page has wandered off
          </h1>
          <p className="mt-5 text-pretty text-lg text-ink/75">
            We could not find what you were looking for. Let&rsquo;s get you back
            to somewhere greener.
          </p>
          <div className="mt-8">
            <Button
              as="a"
              href="/"
              leadingIcon={<Icon icon={ArrowLeft} size="sm" />}
            >
              Back to the home page
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
