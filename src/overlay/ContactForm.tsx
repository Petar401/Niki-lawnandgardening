import { useState } from 'react';

const SERVICES = [
  'Mowing',
  'Landscaping',
  'Hedging',
  'Seasonal cleanup',
  'Not sure — help me pick',
] as const;

type Status = 'idle' | 'submitting' | 'sent' | 'error';

/**
 * Step 5: contact form skeleton. Visual + HTML5 validation only.
 * Step 8 wires the real submission (Formspree/Netlify Forms) and a
 * firefly-burst confirmation animation on success.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder until Step 8.
    setStatus('submitting');
    setTimeout(() => setStatus('sent'), 700);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="glass mx-auto w-full max-w-xl rounded-3xl p-6 text-left sm:p-8"
      noValidate={false}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            placeholder="+1 (555) 555 1234"
            className={inputCls}
          />
        </Field>

        <Field label="Service" htmlFor="cf-service">
          <select id="cf-service" name="service" required className={`${inputCls} pr-9`}>
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
            rows={4}
            required
            placeholder="Tell me about your yard — size, what you'd like, when…"
            className={`${inputCls} min-h-[7rem] resize-y`}
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-[11px] uppercase tracking-[0.28em] text-cream/55">
          Reply within one business day.
        </p>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center gap-2 rounded-full bg-sun-500 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-dusk-900 shadow-[0_6px_18px_rgba(245,177,58,0.45)] transition-all hover:-translate-y-0.5 hover:bg-sun-400 hover:shadow-[0_8px_22px_rgba(245,177,58,0.55)] disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : 'Send message'}
        </button>
      </div>

      {status === 'sent' && (
        <p
          role="status"
          className="mt-4 rounded-2xl border border-moss-400/40 bg-moss-400/10 px-4 py-3 text-sm text-moss-200"
        >
          Thanks — message received (mock). Step 8 wires this to a real inbox + the
          firefly-burst celebration.
        </p>
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
