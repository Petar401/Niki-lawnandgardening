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

/**
 * Contact form (Step 8: real submission).
 *
 * No backend / no API — we build a mailto: URL with all the fields and
 * hand it to the OS mail client. The firefly burst fires regardless
 * (visual reward for the click), and a sun-gold success banner offers a
 * "send again" affordance and the raw email address as a fallback.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const triggerBurst = useSceneStore((s) => s.triggerBurst);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
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

    // Trigger the firefly burst immediately (visual reward).
    triggerBurst();

    // Open mail client. Short tick so the state update + burst paint first.
    window.setTimeout(() => {
      window.location.href = mailto;
      setStatus('sent');
    }, 220);
  };

  const reset = () => {
    formRef.current?.reset();
    setStatus('idle');
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="glass mx-auto w-full max-w-xl rounded-3xl p-4 text-left sm:p-7"
    >
      <fieldset disabled={status !== 'idle'} className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <Field label="Name" htmlFor="cf-name">
          <input id="cf-name" name="name" type="text" autoComplete="name" required placeholder="Your name" className={inputCls} />
        </Field>

        <Field label="Email" htmlFor="cf-email">
          <input id="cf-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className={inputCls} />
        </Field>

        <Field label="Phone (optional)" htmlFor="cf-phone">
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 (555) 555 1234" className={inputCls} />
        </Field>

        <Field label="Service" htmlFor="cf-service">
          <select id="cf-service" name="service" required defaultValue={SERVICES[0]} className={`${inputCls} pr-9`}>
            {SERVICES.map((s) => (
              <option key={s} value={s} className="bg-dusk-900 text-cream">{s}</option>
            ))}
          </select>
        </Field>

        <Field className="sm:col-span-2" label="Message" htmlFor="cf-message">
          <textarea
            id="cf-message"
            name="message"
            rows={3}
            required
            placeholder="Tell me about your yard — size, what you'd like, when…"
            className={`${inputCls} min-h-[5rem] resize-y sm:min-h-[7rem]`}
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
          {status === 'sending' ? 'Opening mail…' : status === 'sent' ? 'Sent ✓' : 'Send message'}
        </button>
      </div>

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
            directly.
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
      <span className="mb-1.5 block text-[10px] uppercase tracking-[0.28em] text-cream/65">
        {label}
      </span>
      {children}
    </label>
  );
}
