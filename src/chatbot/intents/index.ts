import type { Intent } from './types';
import { BUSINESS_INTENTS } from './business';
import { GARDENING_INTENTS } from './gardening';
import { NORFOLK_INTENTS } from './norfolk';
import { SMALLTALK_INTENTS } from './smalltalk';

export const ALL_INTENTS: Intent[] = [
  ...BUSINESS_INTENTS,
  ...GARDENING_INTENTS,
  ...NORFOLK_INTENTS,
  ...SMALLTALK_INTENTS,
];

export const FALLBACK_INTENT: Intent = {
  id: 'fallback',
  patterns: [],
  responses: [
    `Hmm, that one's not in my soil yet — try services, pricing, areas, gardening tips, or hit one of the chips.`,
    `I'm not sure I caught that. Ask me about services, pricing, booking, or gardening tips — or call Niki on 07843 818290.`,
  ],
  followups: ['Services', 'Pricing', 'Gardening tips', 'Areas served'],
  category: 'meta',
};

export type { Intent } from './types';
