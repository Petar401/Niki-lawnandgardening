import { Container, SectionHeading } from '@/components/primitives';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/nav/Footer';
import { DraftBanner } from './PrivacyPage';
import { site } from '@/content/site';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function TermsPage() {
  useDocumentTitle(`Terms of service · ${site.brand}`);
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <Header />
      <main id="main-content" className="flex-1">
        <Container size="md" className="py-20">
          <DraftBanner kind="Terms of service" />
          <SectionHeading
            eyebrow="Legal"
            title="Terms of service"
            lede={`The basis on which ${site.brand} provides garden design and maintenance services.`}
            size="md"
            as="h1"
          />

          <div className="mt-10 max-w-none">
            <Section title="Who we are">
              <p>
                These terms apply to gardening services provided by {site.brand}.
                By accepting a quote or booking a visit, you agree to these
                terms.
              </p>
            </Section>

            <Section title="Quotes & visits">
              <p>
                The first walk-through is free and without obligation. Quotes
                are itemised and valid for thirty days from the date issued.
                Materials and plants are quoted at the price on the day; we will
                confirm with you before substituting.
              </p>
            </Section>

            <Section title="Working in your garden">
              <p>
                We aim to arrive at the agreed time and to leave the garden
                tidy at the end of every visit. Garden waste is removed and
                disposed of responsibly. We carry public liability insurance
                and can share the certificate on request.
              </p>
            </Section>

            <Section title="Cancellations & weather">
              <p>
                You can cancel or reschedule a visit up to twenty-four hours
                in advance at no charge. We may need to reschedule visits
                where the weather makes the work unsafe or impractical; we
                will let you know as early as possible.
              </p>
            </Section>

            <Section title="Payment">
              <p>
                Invoices are issued after each visit or at the end of a project,
                payable within seven days. Larger projects may be invoiced in
                stages, agreed in advance.
              </p>
            </Section>

            <Section title="Plants & living material">
              <p>
                Plants are living things — establishment depends on watering,
                weather, and many factors outside our control. Where a plant
                fails within a reasonable establishment period, we will work
                with you to put it right.
              </p>
            </Section>

            <Section title="Liability">
              <p>
                Nothing in these terms limits liability for personal injury or
                anything that cannot be limited by law. Otherwise, our
                liability is limited to the value of the work done.
              </p>
            </Section>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-xl text-forest">{title}</h2>
      <div className="mt-2 text-base leading-relaxed text-ink/80">{children}</div>
    </div>
  );
}
