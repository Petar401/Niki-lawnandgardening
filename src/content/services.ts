import type { LucideIcon } from 'lucide-react';
import { Flower2, Hammer, Leaf, Scissors, Shovel, Sprout } from 'lucide-react';

export type Service = {
  id: string;
  icon: LucideIcon;
  name: string;
  short: string;
  description: string;
  highlights: readonly string[];
};

export const services: readonly Service[] = [
  {
    id: 'garden-design',
    icon: Sprout,
    name: 'Garden design & planting plans',
    short: 'A garden that suits your home, your light, and how you actually use it.',
    description:
      'We walk the space with you, sketch a plan that fits the soil and aspect, and choose plants that look good in every season — not just the day they go in.',
    highlights: [
      'On-site consultation and planting plan',
      'Plant selection for your soil, light, and time',
      'Phased work to spread cost across seasons',
    ],
  },
  {
    id: 'lawn-care',
    icon: Leaf,
    name: 'Lawn care',
    short: 'A healthy, even lawn — without the weekend mowing.',
    description:
      'Mowing, edging, scarifying, aerating, and seasonal feed. Regular visits keep the lawn thick and the moss out, so you keep the weekends.',
    highlights: ['Fortnightly or monthly mowing', 'Spring scarify and aerate', 'Seasonal feed and overseeding'],
  },
  {
    id: 'hedges-pruning',
    icon: Scissors,
    name: 'Hedge trimming & pruning',
    short: 'Clean lines on hedges, the right cut for each shrub.',
    description:
      'From a single overgrown hedge to a full perimeter trim, we cut to a clean line and shape shrubs at the right time of year for each species.',
    highlights: ['One-off or annual hedge cuts', 'Species-correct pruning timing', 'All clippings cleared away'],
  },
  {
    id: 'seasonal-planting',
    icon: Flower2,
    name: 'Seasonal planting & beds',
    short: 'Beds that look intentional from March through November.',
    description:
      'Spring bulbs, summer perennials, autumn structure. We refresh tired beds, top-dress with mulch, and pick combinations that earn their place.',
    highlights: ['Bed clearance and prep', 'Bulbs, perennials, and shrubs', 'Mulch top-dress to keep weeds down'],
  },
  {
    id: 'patios-borders',
    icon: Hammer,
    name: 'Patios, paths & borders',
    short: 'Tidy edges, clean paving, defined planting borders.',
    description:
      'Re-edging beds, repointing tired patios, laying brick or stone borders, and small hardscape refreshes that make the rest of the garden read as cared for.',
    highlights: ['Brick and stone bed borders', 'Patio clean and repoint', 'Path widening and repair'],
  },
  {
    id: 'maintenance-plans',
    icon: Shovel,
    name: 'Ongoing maintenance plans',
    short: 'A monthly visit, the same friendly face, no chasing.',
    description:
      'A simple monthly or fortnightly plan tailored to your garden — mowing, weeding, pruning, and seasonal jobs handled before you have to think about them.',
    highlights: ['Monthly or fortnightly visits', 'Same gardener every time', 'No long contracts'],
  },
] as const;
