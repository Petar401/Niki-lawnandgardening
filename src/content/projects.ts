export type Project = {
  id: string;
  title: string;
  location: string;
  type: string;
  durationDays: number;
  brief: string;
  outcome: string;
  before: string;
  after: string;
  alt: { before: string; after: string };
  tags: readonly string[];
  /** When true, the photos are real customer work; otherwise illustrative. */
  isRealPhotography: boolean;
};

export const projects: readonly Project[] = [
  {
    id: 'stone-tier-bed',
    title: 'Tiered stone bed in a tired side garden',
    location: 'Local · private garden',
    type: 'Border revival',
    durationDays: 2,
    brief:
      'A neglected strip along the side path had taken over with grasses and weeds, and the existing edge had collapsed.',
    outcome:
      'Cleared and re-shaped into a tiered, stone-edged bed with fresh soil, a young ornamental tree, and solar path lights for the evenings.',
    before: '/images/projects/stone-tier-bed-before.jpg',
    after: '/images/projects/stone-tier-bed-after.jpg',
    alt: {
      before: 'Side path bed overgrown with tall grasses and weeds before redesign.',
      after: 'Same bed cleared and re-built with a tiered stone edge, fresh soil, an ornamental tree, and solar lights.',
    },
    tags: ['Garden design', 'Border revival', 'Hardscape'],
    isRealPhotography: true,
  },
  {
    id: 'brick-corner-bed',
    title: 'Brick-edged corner under an ornamental tree',
    location: 'Local · private garden',
    type: 'Corner refresh',
    durationDays: 1,
    brief:
      'A weedy patch around the base of an ornamental tree was crowding the patio and never looked tidy for long.',
    outcome:
      'Cleared back to soil, re-edged with reclaimed brick, top-dressed with decorative gravel, and finished with a stone slab and ornamental spheres so it stays neat between visits.',
    before: '/images/projects/brick-corner-bed-before.jpg',
    after: '/images/projects/brick-corner-bed-after.jpg',
    alt: {
      before: 'Weedy patch around the base of a tree at the corner of a brick patio.',
      after: 'Same corner re-edged with reclaimed brick, decorative gravel, a stone slab, and ornamental spheres.',
    },
    tags: ['Border revival', 'Hardscape', 'Low maintenance'],
    isRealPhotography: true,
  },
  {
    id: 'lawn-restoration-illustrative',
    title: 'Lawn restoration after a wet winter',
    location: 'Illustrative example',
    type: 'Lawn care',
    durationDays: 1,
    brief:
      'A typical post-winter lawn — bare patches, moss in the shaded corners, and uneven edges from year-round wear.',
    outcome:
      'Scarified, aerated, overseeded, and put on a monthly mow + seasonal feed plan. Within a season the lawn fills back in, and edges stay sharp.',
    before: '',
    after: '',
    alt: { before: '', after: '' },
    tags: ['Lawn care', 'Maintenance plan'],
    isRealPhotography: false,
  },
  {
    id: 'planting-plan-illustrative',
    title: 'Year-round planting plan for a small back garden',
    location: 'Illustrative example',
    type: 'Garden design',
    durationDays: 3,
    brief:
      'A small garden that looked great for two weeks in May and tired for the rest of the year.',
    outcome:
      'A planting plan layered for spring bulbs, early-summer perennials, late-summer structure, and winter form. Mulched in to keep weeds down and reduce watering.',
    before: '',
    after: '',
    alt: { before: '', after: '' },
    tags: ['Garden design', 'Planting plan'],
    isRealPhotography: false,
  },
] as const;
