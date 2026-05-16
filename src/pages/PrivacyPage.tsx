import { Container, SectionHeading } from '@/components/primitives';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/nav/Footer';
import { isPlaceholder, site } from '@/content/site';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function PrivacyPage() {
  useDocumentTitle(`Privacy policy · ${site.brand}`);
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <Header />
      <main id="main-content" className="flex-1">
        <Container size="md" className="py-20">
          <DraftBanner kind="Privacy policy" />
          <SectionHeading
            eyebrow="Legal"
            title="Privacy policy"
            lede="What information we collect when you contact us, why we collect it, and how we look after it."
            size="md"
            as="h1"
          />

          <div className="prose mt-10 max-w-none text-ink/80">
            <Section title="What we collect">
              <p>
                When you fill in the enquiry form on this site or get in touch by
                phone or email, we collect only what you give us — typically your
                name, your email address, your postcode, and a short description
                of your garden.
              </p>
            </Section>

            <Section title="Why we collect it">
              <p>
                We use your details to reply to your enquiry, arrange a visit,
                and provide a quote. If you go ahead with us, we keep the
                details on file so we can run the work and send invoices.
              </p>
            </Section>

            <Section title="Who we share it with">
              <p>
                We do not share your details with third parties for marketing.
                We may use email or messaging providers to deliver our reply
                (such as a standard email service); those providers process
                your message only to deliver it.
              </p>
            </Section>

            <Section title="How long we keep it">
              <p>
                Enquiries we do not act on are deleted within twelve months.
                Customer details are kept for the duration of the work and for
                a reasonable period afterwards for accounting purposes.
              </p>
            </Section>

            <Section title="Your rights">
              <p>
                You can ask us at any time what information we hold about you,
                ask for it to be corrected, or ask us to delete it. The easiest
                way is to email us using the contact details below.
              </p>
            </Section>

            <Section title="Contact us">
              <p>
                {isPlaceholder(site.contact.email) ? (
                  <span className="text-ink/70" title="Replace before launch">
                    Email — add before launch
                  </span>
                ) : (
                  <a className="text-forest underline" href={`mailto:${site.contact.email}`}>
                    {site.contact.email}
                  </a>
                )}
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

export function DraftBanner({ kind }: { kind: string }) {
  return (
    <div className="mb-8 rounded-md border border-bloom/35 bg-bloom/[0.06] px-4 py-3 text-sm text-soil">
      <strong>Draft — not legal advice.</strong> This {kind.toLowerCase()} is a
      starting template only. Have it reviewed by a qualified professional in
      your jurisdiction before launch.
    </div>
  );
}
