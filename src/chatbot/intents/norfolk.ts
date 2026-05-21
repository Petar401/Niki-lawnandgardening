import type { Intent } from './types';

/**
 * Norfolk-flavoured intents. Local knowledge that makes the bot feel
 * like it actually lives in the same village.
 */
export const NORFOLK_INTENTS: Intent[] = [
  {
    id: 'norfolk-soil',
    patterns: ['norfolk soil', 'soil in norwich', 'clay soil', 'sandy soil', 'breckland soil'],
    keywords: ['soil', 'norfolk'],
    responses: [
      `Norfolk's a mixed bag: heavy clay in the north and east, free-draining sandy loam through the Breckland, peaty pockets near the Broads. Niki tests with a squeeze of damp earth — if it ribbons like plasticine, it's clay; if it falls apart, sandy.`,
    ],
    followups: ['Landscaping', 'Book a visit'],
    category: 'norfolk',
  },
  {
    id: 'norwich-climate',
    patterns: ['norfolk weather', 'norwich climate', 'dry county', 'rainfall norfolk'],
    keywords: ['norfolk'],
    responses: [
      `Norfolk is the driest county in England — about 600mm a year. Gardens here cope best with deep-rooted perennials and a heavy spring mulch. Lawns want extra patience in August.`,
    ],
    followups: ['Watering tips', 'Landscaping'],
    category: 'norfolk',
  },
  {
    id: 'norfolk-plants',
    patterns: ['what grows in norfolk', 'best plants for norfolk', 'plants for norwich', 'drought tolerant', 'coastal plants'],
    keywords: ['plant', 'norfolk'],
    responses: [
      `Norfolk-friendly: lavender, rosemary, sea holly, salvia, verbena bonariensis, achillea — anything that shrugs off a dry summer. Near the coast, escallonia and sea buckthorn love the salt air.`,
    ],
    followups: ['Landscaping', 'Book a visit'],
    category: 'norfolk',
  },
  {
    id: 'frost-dates',
    patterns: ['frost', 'first frost', 'last frost', 'when frost', 'planting out', 'when to plant outside'],
    keywords: ['winter'],
    responses: [
      `In Norfolk the last frost is typically mid-May, first frost early-to-mid October. Plant tender stuff out after the 15th of May and you'll usually be safe.`,
    ],
    followups: ['Seasonal cleanup', 'Book a visit'],
    category: 'norfolk',
  },
  {
    id: 'norwich-areas',
    patterns: ['do you do norwich', 'cover norwich', 'in norwich', 'gardener in norwich'],
    keywords: ['norfolk', 'area'],
    responses: [
      `Norwich is home base — Niki covers every postcode from NR1 through NR8, plus the villages just outside the ring road.`,
    ],
    followups: ['Show the map', 'Book a visit'],
    scrollTo: 'contact',
    category: 'norfolk',
  },
  {
    id: 'broads',
    patterns: ['broads', 'broadland', 'wroxham', 'horning', 'reedham', 'broads garden'],
    keywords: ['norfolk'],
    responses: [
      `Yes — Niki works around the Broads regularly. Damp soil and reed-edge planting are right up her street. Wroxham, Horning, Reedham, Acle all covered.`,
    ],
    followups: ['Book a visit', 'Areas served'],
    category: 'norfolk',
  },
  {
    id: 'coast',
    patterns: ['coast', 'cromer', 'sheringham', 'hunstanton', 'caister', 'coastal garden'],
    keywords: ['norfolk'],
    responses: [
      `North Norfolk coast and east coast are all on Niki's regular round — Cromer, Sheringham, Hunstanton, Caister. Salt-tolerant planting a speciality.`,
    ],
    followups: ['Book a visit', 'Areas served'],
    category: 'norfolk',
  },
  {
    id: 'norwich-landmarks',
    patterns: ['norwich castle', 'norwich cathedral', 'uea', 'university of east anglia'],
    keywords: ['norfolk'],
    responses: [
      `Niki's based a short walk from the Castle and the Cathedral close. UEA gardens are some of her favourite to drive past on a job.`,
    ],
    followups: ['About Niki', 'Areas served'],
    category: 'norfolk',
  },
];
