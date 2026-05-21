import { Component, type ErrorInfo, type ReactNode } from 'react';
import { CONTACT_EMAIL } from '@/config/contact';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface in dev; in prod this is the user's only signal something broke.
    console.error('[Niki] scene crashed', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dusk-900 px-6 text-cream">
        <div className="max-w-md text-center">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-sun-200">
            Niki Lawn &amp; Gardening
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-cream">
            Garden took a nap.
          </h1>
          <p className="mt-3 text-cream/80">
            Something went wrong loading the 3D scene. A refresh usually wakes it up.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-sun-500 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-dusk-900 transition-colors hover:bg-sun-400"
            >
              Refresh
            </button>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="rounded-full border border-cream/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cream/85 transition-colors hover:border-cream/60 hover:bg-cream/10"
            >
              Email Niki directly
            </a>
          </div>
        </div>
      </div>
    );
  }
}
