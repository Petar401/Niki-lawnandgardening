import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button, Container, Icon } from '@/components/primitives';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/nav/Footer';
import { isPlaceholder, site } from '@/content/site';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function ThanksPage() {
  useDocumentTitle(`Thank you · ${site.brand}`);
  const phoneOk = !isPlaceholder(site.contact.phone);
  const emailOk = !isPlaceholder(site.contact.email);

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <Header />
      <main id="main-content" className="flex flex-1 items-center">
        <Container size="md" className="py-24">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-leaf/15 text-forest">
              <Icon icon={CheckCircle2} size="lg" />
            </span>
            <p className="mt-6 text-eyebrow font-medium uppercase text-forest">
              Thank you
            </p>
            <h1 className="mt-3 font-display text-display-lg text-forest">
              Your enquiry is on its way
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg text-ink/75">
              We will read it carefully and reply within one working day with next
              steps — usually a short reply suggesting a time to come and look at
              the garden.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                as="a"
                href="/"
                variant="secondary"
                leadingIcon={<Icon icon={ArrowLeft} size="sm" />}
              >
                Back to the home page
              </Button>
            </div>
            {(phoneOk || emailOk) && (
              <p className="mt-10 text-sm text-ink/70">
                In the meantime, you can reach us
                {phoneOk ? (
                  <>
                    {' '}on{' '}
                    <a className="font-medium text-forest hover:underline" href={site.contact.phoneHref}>
                      {site.contact.phone}
                    </a>
                  </>
                ) : null}
                {phoneOk && emailOk ? ' or ' : ' '}
                {emailOk ? (
                  <>
                    by email at{' '}
                    <a className="font-medium text-forest hover:underline" href={`mailto:${site.contact.email}`}>
                      {site.contact.email}
                    </a>
                  </>
                ) : null}
                .
              </p>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
