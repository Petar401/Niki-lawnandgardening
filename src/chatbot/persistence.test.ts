import { describe, it, expect, beforeEach } from 'vitest';
import { loadTranscript, saveTranscript, clearTranscript, type StoredMessage } from './persistence';
import { initialContext } from './engine';

const KEY = 'garden-genie:transcript:v1';

const sampleMessages: StoredMessage[] = [
  { id: 'a', role: 'bot', text: 'Hi!', ts: 1 },
  { id: 'b', role: 'user', text: 'Pricing?', ts: 2 },
];

beforeEach(() => {
  sessionStorage.clear();
});

describe('transcript persistence', () => {
  it('round-trips messages and context', () => {
    saveTranscript({ messages: sampleMessages, ctx: initialContext() });
    const loaded = loadTranscript();
    expect(loaded?.messages).toHaveLength(2);
    expect(loaded?.messages[1].text).toBe('Pricing?');
    expect(loaded?.ctx.consecutiveFallbacks).toBe(0);
  });

  it('returns null when nothing is stored', () => {
    expect(loadTranscript()).toBeNull();
  });

  it('returns null for an empty message list', () => {
    saveTranscript({ messages: [], ctx: initialContext() });
    expect(loadTranscript()).toBeNull();
  });

  it('tolerates corrupt JSON without throwing', () => {
    sessionStorage.setItem(KEY, '{not valid json');
    expect(() => loadTranscript()).not.toThrow();
    expect(loadTranscript()).toBeNull();
  });

  it('clears the stored transcript', () => {
    saveTranscript({ messages: sampleMessages, ctx: initialContext() });
    clearTranscript();
    expect(loadTranscript()).toBeNull();
  });
});
