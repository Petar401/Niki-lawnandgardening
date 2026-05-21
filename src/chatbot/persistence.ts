import type { ChatContext } from './engine';

export interface StoredMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
  ts: number;
}

const KEY = 'garden-genie:transcript:v1';

interface StoredState {
  messages: StoredMessage[];
  ctx: ChatContext;
}

export function loadTranscript(): StoredState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (!parsed?.messages?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveTranscript(state: StoredState) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // sessionStorage may be unavailable (Safari private mode, etc.) — silent.
  }
}

export function clearTranscript() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // noop
  }
}
