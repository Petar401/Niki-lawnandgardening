export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: 'What areas do you cover?',
    a: 'Niki works across Norwich and the surrounding Norfolk countryside. If you’re unsure whether you’re in range, drop a message with your postcode and we’ll confirm.',
  },
  {
    q: 'Can you work in the rain?',
    a: 'Light rain is usually fine for hedging and clean-up; mowing on a soaked lawn damages the grass, so we reschedule. You’ll get a heads-up the day before if a visit is moving.',
  },
  {
    q: 'Do you take the cuttings and clippings away?',
    a: 'Yes — green waste removal is included unless you’ve asked us to leave it for the compost. For larger landscaping waste, we’ll agree the disposal plan in the quote.',
  },
  {
    q: 'Is there a minimum job size?',
    a: 'No fixed minimum, though small one-off visits (e.g. a quick mow) work best when grouped with a neighbour. Bigger landscaping projects always get a site visit first.',
  },
  {
    q: 'How quickly can I expect a quote?',
    a: 'Within one business day. Mowing and hedging usually get a price by reply; landscaping needs a short visit so we can see the ground and the access.',
  },
  {
    q: 'How do I pay?',
    a: 'Bank transfer after each visit, or monthly for regular customers. Card and cash work too — whatever suits.',
  },
];
