import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { GenieLamp } from './GenieLamp';
import { DEFAULT_GREETING, initialContext, runEngine, type ChatContext } from './engine';
import {
  clearTranscript,
  loadTranscript,
  saveTranscript,
  type StoredMessage,
} from './persistence';

const TYPING_MS_MIN = 320;
const TYPING_MS_MAX = 700;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * GardenGenie chatbot widget — fixed bottom-right, launcher ↔ panel.
 *  - Launcher: glowing lamp button.
 *  - Panel: glass-morphism card with header, scrollable message stream,
 *    typing indicator, quick-reply chips, and an input row.
 *  - Smooth Framer Motion morph between the two states.
 *  - Transcript persisted to sessionStorage so the conversation survives
 *    soft refreshes.
 *  - Engine handles intent matching, context, and optional scrollTo
 *    section hand-offs (e.g. "take me to the form").
 */
export function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  // Load any existing transcript on first mount; else seed with greeting.
  const initial = useMemo(() => {
    const stored = loadTranscript();
    if (stored) return { messages: stored.messages, ctx: stored.ctx };
    const greeting: StoredMessage = {
      id: uid(),
      role: 'bot',
      text: DEFAULT_GREETING.text,
      ts: Date.now(),
    };
    return {
      messages: [greeting],
      ctx: initialContext(),
      followups: DEFAULT_GREETING.followups,
    };
  }, []);

  const [messages, setMessages] = useState<StoredMessage[]>(initial.messages);
  const [ctx, setCtx] = useState<ChatContext>(initial.ctx);
  const [followups, setFollowups] = useState<string[]>(
    'followups' in initial ? (initial.followups ?? []) : DEFAULT_GREETING.followups,
  );
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');

  // Persist any time the convo state changes.
  useEffect(() => {
    saveTranscript({ messages, ctx });
  }, [messages, ctx]);

  // Auto-scroll the stream to bottom.
  const streamRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = streamRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  // Send a user message + run the engine.
  const send = useCallback(
    (text: string) => {
      const clean = text.trim();
      if (!clean) return;
      const userMsg: StoredMessage = { id: uid(), role: 'user', text: clean, ts: Date.now() };
      setMessages((m) => [...m, userMsg]);
      setFollowups([]);
      setTyping(true);

      // Compute reply *now*, but reveal after a small typing pause for warmth.
      const { reply, nextCtx } = runEngine(clean, ctx);
      const delay = TYPING_MS_MIN + Math.random() * (TYPING_MS_MAX - TYPING_MS_MIN);

      window.setTimeout(() => {
        const botMsg: StoredMessage = { id: uid(), role: 'bot', text: reply.text, ts: Date.now() };
        setMessages((m) => [...m, botMsg]);
        setCtx(nextCtx);
        setFollowups(reply.followups);
        setTyping(false);
        if (reply.scrollTo) {
          // Tiny delay so the bot message paints first.
          window.setTimeout(() => {
            const el = document.getElementById(reply.scrollTo!);
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 320);
        }
      }, delay);
    },
    [ctx],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typing) return;
    const text = draft;
    setDraft('');
    send(text);
  };

  const reset = () => {
    clearTranscript();
    const greeting: StoredMessage = { id: uid(), role: 'bot', text: DEFAULT_GREETING.text, ts: Date.now() };
    setMessages([greeting]);
    setCtx(initialContext());
    setFollowups(DEFAULT_GREETING.followups);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <AnimatePresence initial={false}>
        {open ? (
          <motion.section
            key="panel"
            role="dialog"
            aria-label="GardenGenie chatbot"
            initial={{ opacity: 0, scale: 0.86, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="glass relative flex h-[34rem] max-h-[78vh] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl text-cream shadow-[0_30px_70px_-20px_rgba(15,10,40,0.55)]"
            style={{ originX: 1, originY: 1 }}
          >
            <PanelHeader onMinimize={() => setOpen(false)} onReset={reset} />

            <div
              ref={streamRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scroll-smooth"
            >
              {messages.map((m) => (
                <Bubble key={m.id} role={m.role}>
                  {m.text}
                </Bubble>
              ))}
              {typing && <TypingDots />}
            </div>

            {followups.length > 0 && !typing && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {followups.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => send(f)}
                    className="rounded-full border border-cream/20 bg-cream/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-cream/85 transition-colors hover:border-sun-400/60 hover:bg-sun-400/15 hover:text-cream"
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 border-t border-cream/10 px-3 py-2.5"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask GardenGenie…"
                aria-label="Message GardenGenie"
                className="flex-1 rounded-full bg-dusk-900/40 px-4 py-2.5 text-sm text-cream placeholder:text-cream/40 outline-none focus:bg-dusk-900/60"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!draft.trim() || typing}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sun-500 text-dusk-900 transition-all hover:-translate-y-0.5 hover:bg-sun-400 disabled:opacity-40 disabled:translate-y-0"
              >
                <SendIcon />
              </button>
            </form>
          </motion.section>
        ) : (
          <motion.button
            key="launcher"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full glass shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-1"
            aria-label="Open GardenGenie chat"
          >
            <span
              aria-hidden
              className="absolute inset-[-4px] -z-10 rounded-full bg-[radial-gradient(circle,rgba(245,177,58,0.55)_0%,rgba(245,177,58,0)_70%)] opacity-70 transition-opacity group-hover:opacity-100"
            />
            <GenieLamp size={30} />
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-3 w-3 rounded-full border-2 border-dusk-900 bg-moss-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function PanelHeader({ onMinimize, onReset }: { onMinimize: () => void; onReset: () => void }) {
  return (
    <header className="flex items-center gap-3 border-b border-cream/10 px-4 py-3">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-dusk-900/40 ring-1 ring-cream/10">
        <GenieLamp size={22} />
      </span>
      <div className="flex-1">
        <p className="font-display text-sm font-semibold leading-none text-cream">GardenGenie</p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-cream/65">
          <span className="h-1.5 w-1.5 rounded-full bg-moss-300" />
          Always lit
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        title="Clear conversation"
        aria-label="Clear conversation"
        className="rounded-full p-1.5 text-cream/60 transition-colors hover:bg-cream/5 hover:text-cream"
      >
        <ResetIcon />
      </button>
      <button
        type="button"
        onClick={onMinimize}
        title="Minimize"
        aria-label="Minimize chat"
        className="rounded-full p-1.5 text-cream/60 transition-colors hover:bg-cream/5 hover:text-cream"
      >
        <MinimizeIcon />
      </button>
    </header>
  );
}

function Bubble({ role, children }: { role: 'bot' | 'user'; children: React.ReactNode }) {
  const isBot = role === 'bot';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={
          isBot
            ? 'max-w-[80%] rounded-2xl rounded-bl-md bg-dusk-900/40 px-3.5 py-2.5 text-sm text-cream/95 ring-1 ring-cream/10'
            : 'max-w-[80%] rounded-2xl rounded-br-md bg-moss-600 px-3.5 py-2.5 text-sm text-cream'
        }
      >
        {children}
      </div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-dusk-900/40 px-3 py-2.5 ring-1 ring-cream/10">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-1.5 w-1.5 animate-pulse rounded-full bg-cream/70"
            style={{ animationDelay: `${i * 140}ms`, animationDuration: '900ms' }}
          />
        ))}
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M3 11.5 L21 4 L13.5 21 L11 13 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path d="M6 14 L18 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
      <path d="M4 12 a8 8 0 1 0 2.5 -5.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 4 L4 8 L8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
