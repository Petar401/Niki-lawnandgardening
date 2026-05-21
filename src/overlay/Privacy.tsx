import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CONTACT_EMAIL } from '@/config/contact';
import { useFocusTrap } from '@/lib/useFocusTrap';

interface Props {
  onClose: () => void;
}

/**
 * Lightweight privacy sheet. No router — just a dialog the footer opens.
 * Covers the three places visitor data touches: the mailto: form, the
 * chatbot's sessionStorage transcript, and the (absent) third-party
 * trackers. Updates Niki can keep in sync from one component.
 */
export function Privacy({ onClose }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  useFocusTrap(ref, true, onClose);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Privacy notice"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-dusk-900/75 px-4 py-8 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.article
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="glass max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 text-left text-cream/85 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-cream">Privacy</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close privacy notice"
            className="rounded-full p-1.5 text-cream/60 transition-colors hover:bg-cream/5 hover:text-cream"
          >
            <CloseIcon />
          </button>
        </header>

        <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-sun-200/80">
          What we do (and don’t do) with your data
        </p>

        <section className="mt-4 space-y-3 text-sm leading-relaxed">
          <p>
            <strong className="font-semibold text-cream">Quote form.</strong>{' '}
            Submitting the contact form opens your own email client and
            composes a message to{' '}
            <a className="text-sun-200 underline-offset-2 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            . Nothing is sent to a server we operate — your details only
            leave your device when you press Send in your mail app. Niki
            keeps quote enquiries for as long as needed to follow up; you
            can ask for them to be deleted at any time.
          </p>
          <p>
            <strong className="font-semibold text-cream">GardenGenie chat.</strong>{' '}
            Conversations with the chatbot stay on your device only —
            stored in your browser&apos;s sessionStorage so a refresh
            doesn&apos;t wipe the thread. Closing the tab clears it. We
            never see what you typed.
          </p>
          <p>
            <strong className="font-semibold text-cream">Tracking.</strong>{' '}
            No analytics, no cookies, no third-party scripts. The fonts
            (Google Fonts) and Apple touch icon come from public CDNs;
            those providers can see your IP address as part of any web
            request. Beyond that, nothing.
          </p>
          <p>
            <strong className="font-semibold text-cream">Your rights.</strong>{' '}
            Under UK GDPR you can ask for access to, correction of, or
            deletion of any quote enquiry Niki holds about you. Email{' '}
            <a className="text-sun-200 underline-offset-2 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>{' '}
            and we&apos;ll sort it within a working week.
          </p>
        </section>
      </motion.article>
    </motion.div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
