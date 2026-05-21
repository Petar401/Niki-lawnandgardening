/**
 * Tiny, dependency-free fuzzy matcher.
 *
 * `dice(a, b)` returns the Sørensen-Dice coefficient between the bigram
 * sets of `a` and `b` — a value in [0, 1]. Works well for short user
 * messages and tolerates typos / word-order changes better than a raw
 * Levenshtein distance.
 *
 * `closest(query, candidates)` picks the best match above a threshold.
 */
function bigrams(s: string): string[] {
  const t = s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').trim();
  if (t.length < 2) return [t];
  const out: string[] = [];
  for (let i = 0; i < t.length - 1; i++) out.push(t.slice(i, i + 2));
  return out;
}

export function dice(a: string, b: string): number {
  const ba = bigrams(a);
  const bb = bigrams(b);
  if (ba.length === 0 || bb.length === 0) return 0;
  const counts = new Map<string, number>();
  for (const g of ba) counts.set(g, (counts.get(g) ?? 0) + 1);
  let overlap = 0;
  for (const g of bb) {
    const n = counts.get(g);
    if (n && n > 0) {
      overlap++;
      counts.set(g, n - 1);
    }
  }
  return (2 * overlap) / (ba.length + bb.length);
}

export function closest<T extends { key: string }>(
  query: string,
  candidates: T[],
  threshold = 0.45,
): { item: T; score: number } | null {
  let best: T | null = null;
  let bestScore = 0;
  for (const c of candidates) {
    const s = dice(query, c.key);
    if (s > bestScore) {
      bestScore = s;
      best = c;
    }
  }
  if (!best || bestScore < threshold) return null;
  return { item: best, score: bestScore };
}

/** Tokenised Levenshtein for very short queries (1-2 words). */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const v0: number[] = new Array(b.length + 1);
  const v1: number[] = new Array(b.length + 1);
  for (let i = 0; i <= b.length; i++) v0[i] = i;
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
  }
  return v0[b.length];
}
