import { isPlaceholder, site } from '@/content/site';

export type QuoteFormState = {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  gardenSize: string;
  services: string[];
  message: string;
  /** Honeypot — bots fill this; humans never see it. */
  company: string;
};

export const emptyForm: QuoteFormState = {
  name: '',
  email: '',
  phone: '',
  postcode: '',
  gardenSize: '',
  services: [],
  message: '',
  company: '',
};

export type Errors = Partial<Record<keyof QuoteFormState, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(state: QuoteFormState): Errors {
  const errors: Errors = {};
  if (!state.name.trim()) errors.name = 'Please add your name.';
  else if (state.name.trim().length < 2) errors.name = 'That looks a little short — full name please.';

  if (!state.email.trim()) errors.email = 'Please add an email so we can reply.';
  else if (!EMAIL_RE.test(state.email.trim())) errors.email = 'That email address does not look right.';

  if (!state.postcode.trim()) errors.postcode = 'Postcode helps us check we cover your area.';

  if (!state.gardenSize) errors.gardenSize = 'Pick a rough size — we can confirm on the visit.';

  if (!state.message.trim()) errors.message = 'A few words about the garden helps a lot.';
  else if (state.message.trim().length < 10) errors.message = 'A little more detail please.';

  return errors;
}

const FORM_ENDPOINT: string | undefined = import.meta.env.VITE_FORM_ENDPOINT;
/** Minimum time the form must be on screen before we accept the submission. */
const MIN_SUBMIT_MS = 1500;

export type SubmissionMode = 'endpoint' | 'mailto' | 'unconfigured';

export function getSubmissionMode(): SubmissionMode {
  if (FORM_ENDPOINT && FORM_ENDPOINT.trim().length > 0) return 'endpoint';
  if (!isPlaceholder(site.contact.email)) return 'mailto';
  return 'unconfigured';
}

export type SubmitResult =
  | { ok: true; mode: SubmissionMode }
  | { ok: false; reason: 'spam' | 'too-fast' | 'network' | 'unconfigured'; message: string };

/** Build a clean mailto: URL from the form. */
function buildMailto(state: QuoteFormState): string {
  const subject = `Garden enquiry — ${state.name || 'new visitor'}`;
  const body = [
    `Name: ${state.name}`,
    `Email: ${state.email}`,
    state.phone ? `Phone: ${state.phone}` : null,
    `Postcode: ${state.postcode}`,
    `Garden size: ${state.gardenSize}`,
    state.services.length ? `Services of interest: ${state.services.join(', ')}` : null,
    '',
    state.message,
  ]
    .filter(Boolean)
    .join('\n');
  const params = new URLSearchParams({ subject, body });
  return `mailto:${site.contact.email}?${params.toString()}`;
}

export async function submitQuote(
  state: QuoteFormState,
  startedAt: number,
): Promise<SubmitResult> {
  // Honeypot: silently report success but never actually deliver.
  if (state.company.trim().length > 0) {
    return { ok: true, mode: 'endpoint' };
  }
  if (Date.now() - startedAt < MIN_SUBMIT_MS) {
    return {
      ok: false,
      reason: 'too-fast',
      message: 'That was fast — please give it a moment and try again.',
    };
  }

  const mode = getSubmissionMode();

  if (mode === 'endpoint' && FORM_ENDPOINT) {
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...state,
          company: undefined,
          source: 'niki-lawn-and-gardening',
        }),
      });
      if (!res.ok) {
        return {
          ok: false,
          reason: 'network',
          message: 'Something went wrong on our side — please try again, or call us.',
        };
      }
      return { ok: true, mode };
    } catch {
      return {
        ok: false,
        reason: 'network',
        message: 'We could not send that — please check your connection or call us.',
      };
    }
  }

  if (mode === 'mailto') {
    // Open the user's mail client with everything pre-filled.
    window.location.href = buildMailto(state);
    return { ok: true, mode };
  }

  return {
    ok: false,
    reason: 'unconfigured',
    message:
      'Online enquiries are not configured yet. Please call or email us directly using the details on the contact section.',
  };
}
