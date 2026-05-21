import { INTENTS, type Intent, type IntentId } from './intents';

export interface ChatContext {
  /** Last bot-recognised intent — drives yes/no contextualisation. */
  lastIntent: IntentId | null;
  /** Number of fallbacks in a row (so we can escalate to "talk to a human"). */
  consecutiveFallbacks: number;
}

export interface EngineReply {
  text: string;
  intent: IntentId;
  followups: string[];
  scrollTo?: 'hero' | 'services' | 'gallery' | 'contact';
}

const INTENT_BY_ID = new Map(INTENTS.map((i) => [i.id, i]));

// Lightweight skip-list. Returns true if a message is hostile/spammy enough
// that we should answer with a polite deflection rather than try to match.
const PROFANITY = /\b(f+u+c*k+|sh[!1i]t|c+u+n+t+|b[i!1]tch|a+s+h+o+l+e+|w+a+n+k+(er)?)\b/i;
export function isHostile(message: string): boolean {
  return PROFANITY.test(message);
}

function normalize(s: string) {
  return (
    s
      .toLowerCase()
      .trim()
      // Drop trailing punctuation so "hi!" still matches "hi".
      .replace(/[!?.,;:]+$/g, '')
      // Cheap plural strip on word boundaries so "hedges" matches "hedge".
      .replace(/(\b\w{4,})s\b/g, '$1')
  );
}

const MIN_INTENT_SCORE = 4;

/**
 * Scoring matcher. For each intent we sum the "weight" of every pattern
 * that matches:
 *   - string token → word-bounded case-insensitive regex
 *   - RegExp → use as-is
 * Longer string tokens score higher (e.g., "good morning" beats "good").
 */
function scoreIntent(message: string, intent: Intent): number {
  if (intent.patterns.length === 0) return 0;
  const m = normalize(message);
  let score = 0;
  for (const p of intent.patterns) {
    if (typeof p === 'string') {
      const re = new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (re.test(m)) score += p.length + 1;
    } else if (p.test(m)) {
      score += 8;
    }
  }
  return score;
}

const AFFIRM_HEAD = /^\s*(yes|yeah|yep|sure|ok|okay|yup|please|go ahead|do it|take me there)\b/i;

/** Pick a random response from an array. */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

/**
 * Match a user message against the intent registry and produce a reply.
 * Includes context handling so "yes" right after the pricing intent
 * routes the user to the contact form instead of triggering 'affirm'.
 */
export function runEngine(message: string, ctx: ChatContext): { reply: EngineReply; nextCtx: ChatContext } {
  const trimmed = message.trim();
  if (!trimmed) {
    const fallback = INTENT_BY_ID.get('fallback')!;
    return {
      reply: { text: pick(fallback.responses), intent: 'fallback', followups: fallback.followups ?? [] },
      nextCtx: { ...ctx, consecutiveFallbacks: ctx.consecutiveFallbacks + 1 },
    };
  }

  if (isHostile(trimmed)) {
    return {
      reply: {
        text: "Let's keep it friendly — happy to help with services, pricing, or booking.",
        intent: 'fallback',
        followups: ['Services', 'Pricing', 'Book a visit'],
      },
      nextCtx: { lastIntent: 'fallback', consecutiveFallbacks: 0 },
    };
  }

  // Contextual yes/no: a bare "yes" right after pricing/scheduling/contact
  // intents jumps to the form rather than firing the bland affirm intent.
  if (AFFIRM_HEAD.test(trimmed) && trimmed.length < 25) {
    const handoffTriggers: IntentId[] = ['pricing', 'scheduling', 'area'];
    if (ctx.lastIntent && handoffTriggers.includes(ctx.lastIntent)) {
      const contact = INTENT_BY_ID.get('contact')!;
      return {
        reply: {
          text: pick(contact.responses),
          intent: 'contact',
          followups: contact.followups ?? [],
          scrollTo: contact.scrollTo,
        },
        nextCtx: { lastIntent: 'contact', consecutiveFallbacks: 0 },
      };
    }
  }

  // Score every intent.
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const s = scoreIntent(trimmed, intent);
    if (s > bestScore) {
      bestScore = s;
      best = intent;
    }
  }

  if (!best || bestScore < MIN_INTENT_SCORE) {
    const fallback = INTENT_BY_ID.get('fallback')!;
    const consecutive = ctx.consecutiveFallbacks + 1;
    // After 2 fallbacks in a row, suggest the contact handoff explicitly.
    let text = pick(fallback.responses);
    let followups = fallback.followups ?? [];
    if (consecutive >= 2) {
      text =
        "Looks like I'm a bit out of my depth here — Niki can answer in person. Want me to take you to the form?";
      followups = ['Yes, take me there', 'Services', 'Pricing'];
    }
    return {
      reply: { text, intent: 'fallback', followups },
      nextCtx: { lastIntent: 'fallback', consecutiveFallbacks: consecutive },
    };
  }

  return {
    reply: {
      text: pick(best.responses),
      intent: best.id,
      followups: best.followups ?? [],
      scrollTo: best.scrollTo,
    },
    nextCtx: { lastIntent: best.id, consecutiveFallbacks: 0 },
  };
}

export function initialContext(): ChatContext {
  return { lastIntent: null, consecutiveFallbacks: 0 };
}

export const DEFAULT_GREETING: EngineReply = {
  text: "Hi! I'm GardenGenie. 🪔 Ask me about services, pricing, or booking — your wish is my mulch.",
  intent: 'greeting',
  followups: ['Services', 'Pricing', 'Areas served', 'Book a visit'],
};
