import { CONTACT_AREA, CONTACT_EMAIL, CONTACT_PHONE } from '@/config/contact';

interface Props {
  onOpenPrivacy: () => void;
}

const YEAR = new Date().getFullYear();

/**
 * Site footer. Lives at the bottom of the Contact section, not as a stuck
 * landmark — the 3D scene runs full-bleed so a sticky footer would obscure
 * the mailbox. Carries trust-signal lines and the privacy link.
 */
export function Footer({ onOpenPrivacy }: Props) {
  return (
    <footer className="mx-auto mt-12 w-full max-w-2xl border-t border-cream/10 pt-6 text-center">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.28em] text-cream/55">
        <span>Fully insured</span>
        <span aria-hidden>·</span>
        <span>{CONTACT_AREA}</span>
        <span aria-hidden>·</span>
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-cream/70 transition-colors hover:text-cream">
          {CONTACT_EMAIL}
        </a>
        {CONTACT_PHONE && (
          <>
            <span aria-hidden>·</span>
            <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`} className="text-cream/70 transition-colors hover:text-cream">
              {CONTACT_PHONE}
            </a>
          </>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.32em] text-cream/40">
        <span>© {YEAR} Niki Lawn &amp; Gardening</span>
        <span aria-hidden>·</span>
        <button
          type="button"
          onClick={onOpenPrivacy}
          className="cursor-pointer text-cream/55 transition-colors hover:text-cream/90"
        >
          Privacy
        </button>
      </div>
    </footer>
  );
}
