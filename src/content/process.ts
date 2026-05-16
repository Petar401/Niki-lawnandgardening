export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  duration: string;
};

export const processSteps: readonly ProcessStep[] = [
  {
    number: '01',
    title: 'Garden walk-through',
    description:
      'A short on-site visit to look at the space together, hear how you use it, and talk through what you would like to change.',
    duration: '~30 minutes · free',
  },
  {
    number: '02',
    title: 'Plan & written quote',
    description:
      'A clear, itemised quote with a sketch where the work needs one. No pressure, no upsells, no surprises later.',
    duration: 'Within a few days',
  },
  {
    number: '03',
    title: 'The work',
    description:
      'We turn up when we said we would, do the job tidily, and take the waste away. Same gardener throughout.',
    duration: 'A day to a few days',
  },
  {
    number: '04',
    title: 'Ongoing care',
    description:
      'Most gardens look after better with a light monthly visit. Optional, no contract, easy to pause for the winter.',
    duration: 'Monthly or seasonal',
  },
];
