import { ALL_INTENTS, FALLBACK_INTENT, type Intent } from './intents';
import { expandSynonyms } from './synonyms';
import { dice, levenshtein } from './fuzzy';

export interface ChatContext {
  /** Last bot-recognised intent id — drives yes/no contextualisation. */
  lastIntent: string | null;
  /** Last service-category id (mowing/landscaping/hedging/seasonal). */
  lastServiceTopic: string | null;
  /** Number of fallbacks in a row (so we can escalate to "talk to a human"). */
  consecutiveFallbacks: number;
}

export interface EngineReply {
  text: string;
  intent: string;
  followups: string[];
  scrollTo?: 'hero' | 'services' | 'gallery' | 'contact';
}

const INTENT_BY_ID = new Map(ALL_INTENTS.map((i) => [i.id, i]));

const AFFIRM_HEAD = /^\s*(yes|yeah|yep|sure|ok|okay|yup|please|go ahead|do it|take me there)\b/i;
const SHORT_WORDS = new Set([
  'a', 'an', 'the', 'i', 'me', 'my', 'is', 'it', 'of', 'to', 'in', 'on',
  'and', 'or', 'for', 'with', 'about', 'that', 'this', 'how', 'what',
  'when', 'where', 'who', 'why', 'do', 'does', 'did', 'so', 'be',
]);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Score one intent against a normalised user message.
 *
 * Three components are added:
 *   1. Best fuzzy similarity (Sørensen-Dice) between any pattern and the
 *      whole message. Catches typos and word-order changes.
 *   2. Keyword bonus: any canonical keyword token present in `tokens`
 *      adds 0.35 — strong, unambiguous signal.
 *   3. Word-overlap bonus: how many of the user's content words appear
 *      verbatim in a pattern.
 */
function scoreIntent(message: string, tokens: Set<string>, intent: Intent): number {
  if (intent.patterns.length === 0) return 0;

  let bestDice = 0;
  for (const p of intent.patterns) {
    const d = dice(message, p);
    if (d > bestDice) bestDice = d;
  }

  let kwBonus = 0;
  if (intent.keywords) {
    const msgWords = new Set(message.split(/\s+/));
    for (const k of intent.keywords) {
      // Match canonical synonym token, or the raw word in the user message.
      if (tokens.has(k) || msgWords.has(k)) {
        kwBonus = Math.max(kwBonus, 0.5);
      }
    }
  }

  const userWords = message.split(/\s+/).filter((w) => w.length > 2 && !SHORT_WORDS.has(w));
  let overlap = 0;
  for (const p of intent.patterns) {
    const pw = new Set(p.split(/\s+/));
    let hit = 0;
    for (const w of userWords) if (pw.has(w)) hit++;
    if (hit > overlap) overlap = hit;
  }
  const overlapBonus = userWords.length === 0 ? 0 : overlap / userWords.length;

  return bestDice * 0.6 + kwBonus + overlapBonus * 0.3;
}

/**
 * Run the matcher against the user message and return the engine reply.
 */
export function runEngine(
  message: string,
  ctx: ChatContext,
): { reply: EngineReply; nextCtx: ChatContext } {
  const trimmed = message.trim();
  if (!trimmed) {
    return {
      reply: makeFallback(),
      nextCtx: { ...ctx, consecutiveFallbacks: ctx.consecutiveFallbacks + 1 },
    };
  }

  // Bare "yes" / "no" right after a handoff-style intent inherits context.
  if (AFFIRM_HEAD.test(trimmed) && trimmed.length < 25) {
    const handoff = new Set(['pricing', 'scheduling', 'area', 'contact']);
    if (ctx.lastIntent && handoff.has(ctx.lastIntent)) {
      const contact = INTENT_BY_ID.get('contact')!;
      return {
        reply: {
          text: pick(contact.responses),
          intent: 'contact',
          followups: contact.followups ?? [],
          scrollTo: contact.scrollTo,
        },
        nextCtx: { lastIntent: 'contact', lastServiceTopic: ctx.lastServiceTopic, consecutiveFallbacks: 0 },
      };
    }
  }

  const { text: expanded, tokens } = expandSynonyms(trimmed);

  let best: Intent | null = null;
  let bestScore = 0;
  let runnerUp: Intent | null = null;
  for (const intent of ALL_INTENTS) {
    const s = scoreIntent(expanded, tokens, intent);
    if (s > bestScore) {
      runnerUp = best;
      best = intent;
      bestScore = s;
    }
  }

  // Confidence threshold — below this we try a deeper fallback path.
  if (!best || bestScore < 0.55) {
    // 1-2 word message? Try a Levenshtein nearest match against intent ids and keywords.
    const wordCount = expanded.split(/\s+/).length;
    if (wordCount <= 2 && expanded.length >= 3) {
      const lev = nearestByLev(expanded);
      if (lev && lev.distance <= 2) {
        const hit = INTENT_BY_ID.get(lev.intentId)!;
        return makeReply(hit, ctx);
      }
    }
    return {
      reply: makeFallback(ctx.consecutiveFallbacks + 1),
      nextCtx: { ...ctx, consecutiveFallbacks: ctx.consecutiveFallbacks + 1 },
    };
  }

  // Multi-intent disambiguation: if top two are close, surface both as chips.
  if (runnerUp && bestScore - scoreIntent(expanded, tokens, runnerUp) < 0.08 && best.category !== 'meta') {
    const text =
      `I caught a couple of things — did you mean **${humanise(best.id)}** or **${humanise(runnerUp.id)}**?`;
    return {
      reply: {
        text,
        intent: best.id,
        followups: [humanise(best.id), humanise(runnerUp.id), 'Something else'],
      },
      nextCtx: { lastIntent: best.id, lastServiceTopic: ctx.lastServiceTopic, consecutiveFallbacks: 0 },
    };
  }

  return makeReply(best, ctx);
}

function makeReply(intent: Intent, ctx: ChatContext): { reply: EngineReply; nextCtx: ChatContext } {
  const isService = intent.category === 'service';
  return {
    reply: {
      text: pick(intent.responses),
      intent: intent.id,
      followups: intent.followups ?? [],
      scrollTo: intent.scrollTo,
    },
    nextCtx: {
      lastIntent: intent.id,
      lastServiceTopic: isService ? intent.id : ctx.lastServiceTopic,
      consecutiveFallbacks: 0,
    },
  };
}

function makeFallback(consecutive = 1): EngineReply {
  if (consecutive >= 2) {
    return {
      text:
        "I'm out of my depth on that one — but Niki can answer in person. Call **07843 818290**, email **info@nikislawngardens.co.uk**, or I can drop you at the form.",
      intent: 'fallback',
      followups: ['Take me to the form', 'Services', 'Areas served'],
    };
  }
  return {
    text: pick(FALLBACK_INTENT.responses),
    intent: 'fallback',
    followups: FALLBACK_INTENT.followups ?? [],
  };
}

function nearestByLev(query: string): { intentId: string; distance: number } | null {
  let bestId = '';
  let bestDist = Infinity;
  for (const intent of ALL_INTENTS) {
    for (const k of intent.keywords ?? []) {
      const d = levenshtein(query, k);
      if (d < bestDist) {
        bestDist = d;
        bestId = intent.id;
      }
    }
  }
  return bestId ? { intentId: bestId, distance: bestDist } : null;
}

function humanise(id: string): string {
  return id.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function initialContext(): ChatContext {
  return { lastIntent: null, lastServiceTopic: null, consecutiveFallbacks: 0 };
}

export const DEFAULT_GREETING: EngineReply = {
  text:
    "Hi! I'm GardenGenie 🪔 — Niki's helper for Norwich & Norfolk gardens. Ask me about services, pricing, areas covered, gardening tips, or just say hello.",
  intent: 'greeting',
  followups: ['Services', 'Pricing', 'Areas served', 'Gardening tips'],
};
