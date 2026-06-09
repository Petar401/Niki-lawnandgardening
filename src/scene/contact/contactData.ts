/** Bell curve around the contact zone progress (1.0) for fade-in. */
export function contactIntensity(progress: number): number {
  const center = 1.0;
  const halfWidth = 0.25;
  const d = Math.abs(progress - center) / halfWidth;
  return Math.max(0, 1 - d);
}

/** World-space anchor for the mailbox + firefly swarm. */
export const CONTACT_ANCHOR: [number, number, number] = [0, 1.8, 0];
