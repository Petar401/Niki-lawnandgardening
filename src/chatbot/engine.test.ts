import { describe, it, expect } from 'vitest';
import { runEngine, initialContext, DEFAULT_GREETING } from './engine';
import { INTENTS, type IntentId } from './intents';

describe('runEngine — intent matching', () => {
  it('matches a greeting', () => {
    const { reply } = runEngine('hello there', initialContext());
    expect(reply.intent).toBe('greeting');
  });

  it('matches pricing on "how much"', () => {
    const { reply } = runEngine('how much do you charge?', initialContext());
    expect(reply.intent).toBe('pricing');
  });

  it('prefers the longer / more specific string token', () => {
    // "good morning" (intent greeting) should beat a bare "good" partial.
    const { reply } = runEngine('good morning!', initialContext());
    expect(reply.intent).toBe('greeting');
  });

  it('routes to the services section with a scrollTo side-effect', () => {
    const { reply } = runEngine('what services do you offer', initialContext());
    expect(reply.intent).toBe('services');
    expect(reply.scrollTo).toBe('services');
  });
});

describe('runEngine — empty / whitespace input', () => {
  it('returns the fallback intent and increments consecutiveFallbacks', () => {
    const { reply, nextCtx } = runEngine('   ', initialContext());
    expect(reply.intent).toBe('fallback');
    expect(nextCtx.consecutiveFallbacks).toBe(1);
  });
});

describe('runEngine — fallback escalation', () => {
  it('escalates to a human hand-off after two consecutive fallbacks', () => {
    const ctx = { lastIntent: 'fallback' as IntentId, consecutiveFallbacks: 1 };
    const { reply, nextCtx } = runEngine('asdfghjkl qwerty zxcv', ctx);
    expect(reply.intent).toBe('fallback');
    expect(nextCtx.consecutiveFallbacks).toBe(2);
    expect(reply.text.toLowerCase()).toContain('form');
    expect(reply.followups).toContain('Yes, take me there');
  });
});

describe('runEngine — contextual yes/no hand-off', () => {
  it('routes a bare "yes" after pricing straight to the contact form', () => {
    const ctx = { lastIntent: 'pricing' as IntentId, consecutiveFallbacks: 0 };
    const { reply, nextCtx } = runEngine('yes', ctx);
    expect(reply.intent).toBe('contact');
    expect(reply.scrollTo).toBe('contact');
    expect(nextCtx.lastIntent).toBe('contact');
    expect(nextCtx.consecutiveFallbacks).toBe(0);
  });

  it('does NOT hand off for a bare "yes" without a triggering context', () => {
    const { reply } = runEngine('yes', initialContext());
    // Falls through to normal scoring → the affirm intent, not contact.
    expect(reply.intent).not.toBe('contact');
  });

  it('does not treat a long affirmative sentence as a hand-off', () => {
    const ctx = { lastIntent: 'pricing' as IntentId, consecutiveFallbacks: 0 };
    const long = 'yes but actually I have several detailed questions about the lawn first';
    const { reply } = runEngine(long, ctx);
    expect(reply.intent).not.toBe('contact');
  });
});

describe('intent registry integrity', () => {
  const ids = new Set(INTENTS.map((i) => i.id));

  it('every scrollTo target is a known section id', () => {
    const sections = new Set(['hero', 'services', 'gallery', 'contact']);
    for (const intent of INTENTS) {
      if (intent.scrollTo) expect(sections.has(intent.scrollTo)).toBe(true);
    }
  });

  it('the engine depends on these intents existing', () => {
    for (const required of ['fallback', 'contact', 'pricing', 'scheduling', 'area', 'greeting']) {
      expect(ids.has(required as IntentId)).toBe(true);
    }
  });

  it('exposes a default greeting', () => {
    expect(DEFAULT_GREETING.intent).toBe('greeting');
    expect(DEFAULT_GREETING.followups.length).toBeGreaterThan(0);
  });
});
