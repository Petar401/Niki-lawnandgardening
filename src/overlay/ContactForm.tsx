import { useEffect, useRef, useState } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '@/config/contact';

const SERVICES = [
  'Mowing',
  'Landscaping',
  'Hedging',
  'Seasonal cleanup',
  'Not sure — help me pick',
] as const;

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Contact form. No backend — submission builds a `mailto:` URL and hands
 * it to the OS mail client. A `niki:area-selected` window event from the
 * Norfolk map prefills the message with the selected town.
 *
 * Includes a hidden honeypot field that bots commonly fill but humans
 * never see — if it's non-empty on submit, the message is silently
 * dropped.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [town, setTown] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const triggerBurst = useSceneStore((s) => s.triggerBurst);

  // Listen for town selections from <NorfolkMap/>.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const detail = (e as CustomEvent<{ name: string }>).detail;
      if (!detail?.name) return;
      setTown(detail.name);
      if (messageRef.current) {
        const existing = messageRef.current.value.trim();
        const prefix = `Hi Niki, I'm based in ${detail.name} and would love a quote for my garden. `;
        if (!existing.startsWith('Hi Niki')) {
          messageRef.current.value = prefix + existing;
          messageRef.current.focus();
        }
      }
    };
    window.addEventListener('niki:area-selected', onSelect);
    return () => window.removeEventListener('niki:area-selected', onSelect);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const service = String(data.get('service') ?? '');
    const message = String(data.get('message') ?? '').trim();
    const honeypot = String(data.get('hp_url') ?? '').trim();
    const townField = String(data.get('town') ?? '').trim();

    // Spam: bot filled the hidden honeypot. Silently pretend success.
    if (honeypot) {
      setStatus('sent');
      return;
    }

    if (!name || !email || !message) {
      setStatus('error');
      return;
    }

    const subject = `Quote request · ${service || 'Niki Lawn & Gardening'}${townField ? ` · ${townField}` : ''}`;
    const body = [
      message,
      ``,
      `— ${name}${email ? ` <${email}>` : ''}${phone ? ` · ${phone}` : ''}`,
      `Service: ${service}`,
      townField ? `Town: ${townField}` : '',
      `Sent from nikislawngardens.co.uk`,
    ]
      .filter(Boolean)
      .join('\n');

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
    setTown('');
    setStatus('idle');
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="glass mx-auto w-full max-w-xl rounded-3xl p-4 text-left sm:p-7"
      noValidate
    >
      {/* Honeypot — visually hidden, bots fill it. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="hp_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset disabled={status === 'sending' || status === 'sent'} className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <Field label="Name" htmlFor="cf-name">
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Your name"
            className={inputCls}
          />
        </Field>

        <Field label="Email" htmlFor="cf-email">
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className={inputCls}
          />
        </Field>

        <Field label="Phone (optional)" htmlFor="cf-phone">
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="07xxx xxx xxx"
            className={inputCls}
          />
        </Field>

        <Field label="Town / village" htmlFor="cf-town">
          <input
            id="cf-town"
            name="town"
            type="text"
            value={town}
            onChange={(e) => setTown(e.target.value)}
            placeholder="e.g. Norwich"
            className={inputCls}
            list="cf-towns-list"
          />
        </Field>

        <Field className="sm:col-span-2" label="Service" htmlFor="cf-service">
          <select
            id="cf-service"
            name="service"
            required
            defaultValue={SERVICES[0]}
            className={`${inputCls} pr-9`}
          >
            {SERVICES.map((s) => (
              <option key={s} value={s} className="bg-dusk-900 text-cream">
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field className="sm:col-span-2" label="Message" htmlFor="cf-message">
          <textarea
            id="cf-message"
            name="message"
            ref={messageRef}
            rows={3}
            required
            placeholder="Tell me about your garden — size, what you'd like, when…"
            className={`${inputCls} min-h-[5rem] resize-y sm:min-h-[7rem]`}
          />
        </Field>
      </fieldset>

      <div className="mt-4 flex flex-col items-center gap-3 sm:mt-6 sm:flex-row sm:justify-between">
        <p className="text-[11px] uppercase tracking-[0.28em] text-cream/70">
          Reply within one business day · {' '}
          <a className="text-sun-200 hover:underline" href={`tel:${CONTACT_PHONE_TEL}`}>
            {CONTACT_PHONE_DISPLAY}
          </a>
        </p>
        <button
          type="submit"
          disabled={status === 'sending' || status === 'sent'}
          className="inline-flex items-center gap-2 rounded-full bg-sun-500 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-dusk-900 shadow-[0_6px_18px_rgba(245,177,58,0.45)] transition-all hover:-translate-y-0.5 hover:bg-sun-400 hover:shadow-[0_8px_22px_rgba(245,177,58,0.55)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'sending' ? 'Opening mail…' : status === 'sent' ? 'Sent ✓' : 'Send message'}
        </button>
      </div>

      {status === 'error' && (
        <p role="alert" className="mt-3 rounded-2xl border border-sun-500/40 bg-sun-500/10 px-4 py-2 text-sm text-sun-200">
          Please fill in name, email and a short message so Niki can reply.
        </p>
      )}

      {status === 'sent' && (
        <div
          role="status"
          className="mt-4 rounded-2xl border border-moss-400/40 bg-moss-400/10 px-4 py-3 text-sm text-moss-200"
        >
          <p>
            Off it goes — your email client should be open now. If nothing happened, write to{' '}
            <a className="text-sun-200 underline-offset-2 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>{' '}
            or call{' '}
            <a className="text-sun-200 underline-offset-2 hover:underline" href={`tel:${CONTACT_PHONE_TEL}`}>
              {CONTACT_PHONE_DISPLAY}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 text-[11px] uppercase tracking-[0.24em] text-cream/85 underline-offset-2 hover:underline"
          >
            Send another
          </button>
        </div>
      )}
    </form>
  );
}

const inputCls =
  'block w-full rounded-2xl border border-cream/15 bg-dusk-900/30 px-4 py-3 text-sm text-cream placeholder:text-cream/40 outline-none transition-colors focus:border-sun-400/70 focus:bg-dusk-900/50';

function Field({
  label,
  htmlFor,
  children,
  className = '',
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`block ${className}`}>
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-cream text-shadow-soft">
        {label}
      </span>
      {children}
    </label>
  );
}
