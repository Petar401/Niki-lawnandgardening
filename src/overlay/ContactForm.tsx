import { useRef, useState } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { CONTACT_EMAIL } from '@/config/contact';

const SERVICES = [
  'Mowing',
  'Landscaping',
  'Hedging',
  'Seasonal cleanup',
  'Not sure — help me pick',
] as const;

type Status = 'idle' | 'sending' | 'sent';

// Loose enough for "ada@example.uk" / "+ada@a.io" but rejects obvious junk.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Contact form. No backend / no API — we build a mailto: URL with all the
 * fields and hand it to the OS mail client. The firefly burst fires on
 * successful submit (visual reward), and the mailbox door animation lifts
 * off the same triggerBurst nonce.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const triggerBurst = useSceneStore((s) => s.triggerBurst);

  const validate = (data: FormData): FieldErrors => {
    const next: FieldErrors = {};
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    if (!name) next.name = 'Please share your name.';
    if (!email) next.email = 'Please share an email so Niki can reply.';
    else if (!EMAIL_RE.test(email)) next.email = 'That email doesn’t look quite right.';
    if (!message) next.message = 'Add a quick note about the work.';
    else if (message.length < 8) next.message = 'A bit more detail helps Niki quote accurately.';
    return next;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== 'idle') return;

    const data = new FormData(e.currentTarget);
    const fieldErrors = validate(data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const firstBad = Object.keys(fieldErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    setErrors({});

    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const service = String(data.get('service') ?? '');
    const message = String(data.get('message') ?? '').trim();

    const subject = `Quote request · ${service || 'Niki Lawn & Gardening'}`;
    const body = [
      `Hi Niki,`,
      ``,
      message,
      ``,
      `— ${name}${email ? ` <${email}>` : ''}${phone ? ` · ${phone}` : ''}`,
      `Service: ${service}`,
    ].join('\n');

    const mailto = `mailto:${encodeURIComponent(CONTACT_EMAIL)}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setStatus('sending');
    triggerBurst();

    window.setTimeout(() => {
      window.location.href = mailto;
      setStatus('sent');
    }, 220);
  };

  const reset = () => {
    formRef.current?.reset();
    setErrors({});
    setStatus('idle');
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="glass mx-auto w-full max-w-xl rounded-3xl p-4 text-left sm:p-7"
    >
      <fieldset disabled={status !== 'idle'} className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <Field label="Name" htmlFor="cf-name" error={errors.name}>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Your name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'cf-name-err' : undefined}
            className={inputCls(!!errors.name)}
          />
        </Field>

        <Field label="Email" htmlFor="cf-email" error={errors.email}>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'cf-email-err' : undefined}
            className={inputCls(!!errors.email)}
          />
        </Field>

        <Field label="Phone (optional)" htmlFor="cf-phone">
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="07123 456 789"
            className={inputCls(false)}
          />
        </Field>

        <Field label="Service" htmlFor="cf-service">
          <select id="cf-service" name="service" required defaultValue={SERVICES[0]} className={`${inputCls(false)} pr-9`}>
            {SERVICES.map((s) => (
              <option key={s} value={s} className="bg-dusk-900 text-cream">{s}</option>
            ))}
          </select>
        </Field>

        <Field className="sm:col-span-2" label="Message" htmlFor="cf-message" error={errors.message}>
          <textarea
            id="cf-message"
            name="message"
            rows={3}
            required
            placeholder="Tell me about your yard — size, what you'd like, when…"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'cf-message-err' : undefined}
            className={`${inputCls(!!errors.message)} min-h-[5rem] resize-y sm:min-h-[7rem]`}
          />
        </Field>
      </fieldset>

      <div className="mt-4 flex flex-col items-center gap-3 sm:mt-6 sm:flex-row sm:justify-between">
        <p className="text-[11px] uppercase tracking-[0.28em] text-cream/55">
          Reply within one business day.
        </p>
        <button
          type="submit"
          disabled={status !== 'idle'}
          className="inline-flex items-center gap-2 rounded-full bg-sun-500 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-dusk-900 shadow-[0_6px_18px_rgba(245,177,58,0.45)] transition-all hover:-translate-y-0.5 hover:bg-sun-400 hover:shadow-[0_8px_22px_rgba(245,177,58,0.55)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'sending' ? 'Opening mail…' : status === 'sent' ? 'Sent' : 'Send message'}
        </button>
      </div>

      {status === 'sent' && (
        <div
          role="status"
          className="mt-4 rounded-2xl border border-moss-400/40 bg-moss-400/10 px-4 py-3 text-sm text-moss-200"
        >
          <p>
            Your email client should have opened. If nothing happened, write to{' '}
            <a className="text-sun-200 underline-offset-2 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>{' '}
            directly — Niki replies within one business day.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 text-[11px] uppercase tracking-[0.24em] text-cream/80 underline-offset-2 hover:underline"
          >
            Send another
          </button>
        </div>
      )}
    </form>
  );
}

const inputCls = (invalid: boolean) =>
  `block w-full rounded-2xl border bg-dusk-900/30 px-4 py-3 text-sm text-cream placeholder:text-cream/40 outline-none transition-colors focus:bg-dusk-900/50 ${
    invalid
      ? 'border-red-400/70 focus:border-red-300'
      : 'border-cream/15 focus:border-sun-400/70'
  }`;

function Field({
  label,
  htmlFor,
  children,
  className = '',
  error,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`block ${className}`}>
      <span className="mb-1.5 block text-[10px] uppercase tracking-[0.28em] text-cream/65">
        {label}
      </span>
      {children}
      {error && (
        <span
          id={`${htmlFor}-err`}
          className="mt-1 block text-[11px] leading-snug text-red-300"
        >
          {error}
        </span>
      )}
    </label>
  );
}
