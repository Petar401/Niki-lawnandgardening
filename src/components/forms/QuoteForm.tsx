import { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, Send } from 'lucide-react';
import { Button, Icon } from '@/components/primitives';
import { services } from '@/content/services';
import {
  emptyForm,
  type Errors,
  type QuoteFormState,
  submitQuote,
  validate,
} from '@/lib/quote-form';

const gardenSizes = [
  { value: 'small', label: 'Small (under 50 m²)' },
  { value: 'medium', label: 'Medium (50–200 m²)' },
  { value: 'large', label: 'Large (over 200 m²)' },
  { value: 'unsure', label: 'Not sure' },
] as const;

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'error'; message: string }
  | { kind: 'success' };

export function QuoteForm() {
  const [state, setState] = useState<QuoteFormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const startedAtRef = useRef<number>(Date.now());
  const errorSummaryRef = useRef<HTMLDivElement | null>(null);
  const summaryId = useId();

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  // Clear field errors as the user edits.
  const set = <K extends keyof QuoteFormState>(key: K, value: QuoteFormState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
    if (submitted && errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const toggleService = (id: string) => {
    set(
      'services',
      state.services.includes(id)
        ? state.services.filter((s) => s !== id)
        : [...state.services, id],
    );
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    const next = validate(state);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Move focus to the error summary and scroll it into view.
      requestAnimationFrame(() => {
        errorSummaryRef.current?.focus();
        errorSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }
    setStatus({ kind: 'submitting' });
    const result = await submitQuote(state, startedAtRef.current);
    if (result.ok) {
      setStatus({ kind: 'success' });
      // mailto opens the mail client in the same tab; for the endpoint path,
      // navigate to the dedicated thanks page.
      if (result.mode === 'endpoint') {
        window.location.assign('/thanks');
      }
    } else {
      setStatus({ kind: 'error', message: result.message });
    }
  }

  if (status.kind === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-md border border-leaf/40 bg-leaf/5 p-6"
      >
        <h3 className="font-display text-xl text-forest">Thanks — message on its way</h3>
        <p className="mt-2 text-sm text-ink/75">
          We have your enquiry and will reply within one working day. If you used
          the email link above, check your mail client to send.
        </p>
      </div>
    );
  }

  const hasErrors = submitted && Object.keys(errors).length > 0;

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={onSubmit}>
      {/* honeypot — bots fill this; humans never see it */}
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Leave this field blank
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={state.company}
            onChange={(e) => set('company', e.target.value)}
          />
        </label>
      </div>

      {hasErrors ? (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby={`${summaryId}-title`}
          className="rounded-md border border-bloom/35 bg-bloom/[0.06] p-4"
        >
          <div className="flex items-center gap-2">
            <Icon icon={AlertCircle} size="sm" className="text-bloom" />
            <p id={`${summaryId}-title`} className="text-sm font-medium text-soil">
              Please check the highlighted fields:
            </p>
          </div>
          <ul className="mt-2 list-disc pl-6 text-sm text-soil">
            {Object.entries(errors).map(([key, msg]) => (
              <li key={key}>
                <a href={`#qf-${key}`} className="underline">
                  {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {status.kind === 'error' ? (
        <div
          role="alert"
          className="rounded-md border border-bloom/35 bg-bloom/[0.06] px-4 py-3 text-sm text-soil"
        >
          {status.message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Your name" htmlFor="qf-name" error={errors.name}>
          <input
            id="qf-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={state.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'qf-name-err' : undefined}
            className={inputClass(!!errors.name)}
          />
        </Field>
        <Field label="Email" htmlFor="qf-email" error={errors.email}>
          <input
            id="qf-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={state.email}
            onChange={(e) => set('email', e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'qf-email-err' : undefined}
            className={inputClass(!!errors.email)}
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Phone (optional)" htmlFor="qf-phone">
          <input
            id="qf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={state.phone}
            onChange={(e) => set('phone', e.target.value)}
            className={inputClass(false)}
          />
        </Field>
        <Field label="Postcode" htmlFor="qf-postcode" error={errors.postcode}>
          <input
            id="qf-postcode"
            name="postcode"
            type="text"
            autoComplete="postal-code"
            required
            value={state.postcode}
            onChange={(e) => set('postcode', e.target.value)}
            aria-invalid={!!errors.postcode}
            aria-describedby={errors.postcode ? 'qf-postcode-err' : undefined}
            className={inputClass(!!errors.postcode)}
          />
        </Field>
      </div>

      <fieldset
        className="flex flex-col gap-3"
        aria-invalid={!!errors.gardenSize}
        aria-describedby={errors.gardenSize ? 'qf-gardenSize-err' : undefined}
      >
        <legend className="text-sm font-medium text-ink/80">Garden size</legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" id="qf-gardenSize">
          {gardenSizes.map((size) => (
            <label
              key={size.value}
              className="group relative flex cursor-pointer items-center justify-center rounded-md border border-stone bg-white px-3 py-2.5 text-center text-xs font-medium text-ink/75 transition-colors hover:border-leaf has-[:checked]:border-forest has-[:checked]:bg-forest has-[:checked]:text-cream"
            >
              <input
                type="radio"
                name="gardenSize"
                value={size.value}
                checked={state.gardenSize === size.value}
                onChange={(e) => set('gardenSize', e.target.value)}
                className="sr-only"
              />
              {size.label}
            </label>
          ))}
        </div>
        {errors.gardenSize ? (
          <p id="qf-gardenSize-err" className="text-xs text-soil">
            {errors.gardenSize}
          </p>
        ) : null}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-ink/80">
          What can we help with? <span className="text-ink/70">(pick any)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => {
            const active = state.services.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleService(s.id)}
                aria-pressed={active}
                className={
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bloom focus-visible:ring-offset-2 focus-visible:ring-offset-cream ' +
                  (active
                    ? 'border-forest bg-forest text-cream'
                    : 'border-stone bg-white text-ink/75 hover:border-leaf')
                }
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Field label="Tell us about your garden" htmlFor="qf-message" error={errors.message}>
        <textarea
          id="qf-message"
          name="message"
          rows={5}
          required
          value={state.message}
          onChange={(e) => set('message', e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'qf-message-err' : undefined}
          placeholder="What is the space like today, and what would you like it to feel like? Any access notes, deadlines, or things to know?"
          className={`${inputClass(!!errors.message)} min-h-[140px] resize-y`}
        />
      </Field>

      <p className="text-xs text-ink/70">
        We will reply within one working day. We do not share your details.
      </p>

      <div className="mt-2">
        <Button
          type="submit"
          size="lg"
          disabled={status.kind === 'submitting'}
          trailingIcon={<Icon icon={Send} size="sm" />}
        >
          {status.kind === 'submitting' ? 'Sending…' : 'Send my enquiry'}
        </Button>
      </div>
    </form>
  );
}

const inputClass = (hasError: boolean) =>
  'block w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bloom focus-visible:ring-offset-2 focus-visible:ring-offset-cream ' +
  (hasError ? 'border-bloom focus-visible:border-bloom' : 'border-stone focus-visible:border-forest');

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink/80">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-err`} className="text-xs text-soil">
          {error}
        </p>
      ) : null}
    </div>
  );
}
