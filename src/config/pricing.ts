/**
 * Pricing anchors per service. Showing a "from £X" anchor drops bounce
 * rate from price-sensitive visitors without committing Niki to a fixed
 * quote. Set `from: null` if a service is purely bespoke.
 *
 * TODO before launch: replace `null` placeholders with real "from" prices
 * Niki is comfortable advertising.
 */
export interface PriceTier {
  id: 'mowing' | 'landscaping' | 'hedging' | 'seasonal';
  label: string;
  from: number | null;
  unit: string;
}

export const PRICING: PriceTier[] = [
  { id: 'mowing', label: 'Mowing', from: null, unit: 'visit' }, // TODO e.g. 35
  { id: 'landscaping', label: 'Landscaping', from: null, unit: 'project' }, // bespoke
  { id: 'hedging', label: 'Hedging', from: null, unit: 'visit' }, // TODO e.g. 60
  { id: 'seasonal', label: 'Seasonal cleanup', from: null, unit: 'visit' }, // TODO e.g. 95
];

export function priceLabel(tier: PriceTier): string {
  if (tier.from == null) return 'Bespoke quote';
  return `from £${tier.from} / ${tier.unit}`;
}
