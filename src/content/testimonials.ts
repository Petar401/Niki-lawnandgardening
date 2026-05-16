export type Testimonial = {
  quote: string;
  author: string;
  detail: string;
  rating: 1 | 2 | 3 | 4 | 5;
};

/**
 * Illustrative testimonials in the voice the real customers tend to use.
 * The site flags this section as illustrative until the owner replaces them
 * with real, attributable quotes — see `site.flags.testimonialsAreIllustrative`.
 */
export const testimonials: readonly Testimonial[] = [
  {
    quote:
      'They cleared a side bed that had been getting away from us for years and re-built it with a stone edge in a weekend. We actually use that side of the garden again.',
    author: 'A. M.',
    detail: 'Side garden redesign · returning customer',
    rating: 5,
  },
  {
    quote:
      'Same friendly face every visit, no chasing for invoices, and the lawn has never looked better. Worth every penny.',
    author: 'S. & D.',
    detail: 'Monthly maintenance plan',
    rating: 5,
  },
  {
    quote:
      'Honest about what would and would not work in the shade. The planting plan they put together has carried us through three seasons already.',
    author: 'R. P.',
    detail: 'Garden design · planting plan',
    rating: 5,
  },
];
