import type { Intent } from './types';

/**
 * Gardening-knowledge intents — Niki's wisdom on tap. Plain-English
 * answers, UK English, kept to 2-3 sentences each.
 */
export const GARDENING_INTENTS: Intent[] = [
  {
    id: 'how-often-mow',
    patterns: ['how often should i mow', 'mowing frequency', 'how often cut grass', 'mow weekly', 'mow fortnightly', 'how often lawn'],
    keywords: ['mow'],
    responses: [
      `Rule of thumb: weekly from late April through September, fortnightly in March/October, monthly (or not at all) through deep winter. Never cut more than a third of the blade in one go — that's the only law that matters.`,
    ],
    followups: ['Book a mow', 'Mowing service'],
    category: 'knowledge',
  },
  {
    id: 'best-mow-height',
    patterns: ['mowing height', 'how short to cut grass', 'lawn height', 'cut grass length', 'how high should i cut'],
    keywords: ['mow'],
    responses: [
      `Aim for 25-40mm for a household lawn — shorter scalps the crown and lets moss in. In a Norfolk summer drought, lift the blade by 10mm so the grass shades its own roots.`,
    ],
    followups: ['Mowing service', 'Lawn problems'],
    category: 'knowledge',
  },
  {
    id: 'watering-lawn',
    patterns: ['watering lawn', 'water grass', 'water the lawn', 'how often water', 'lawn watering'],
    keywords: ['water', 'lawn'],
    responses: [
      `Most established Norfolk lawns survive on rain alone. In a dry spell, one deep soak a week (about 20mm) is better than daily sprinkles — it pushes roots down instead of up.`,
    ],
    followups: ['Lawn problems', 'Seasonal cleanup'],
    category: 'knowledge',
  },
  {
    id: 'seeding',
    patterns: ['overseed', 'reseed', 'lawn seed', 'patchy lawn', 'bare patches', 'new lawn'],
    keywords: ['seed'],
    responses: [
      `Overseeding works best in early September or mid-April — soil's warm, rain's reliable. Rake hard first, scatter a hard-wearing rye mix, top-dress, keep moist for ten days.`,
    ],
    followups: ['Landscaping', 'Book a visit'],
    category: 'knowledge',
  },
  {
    id: 'weeds',
    patterns: ['weeds', 'weeding', 'dandelions', 'clover', 'nettles', 'how to kill weeds', 'weed control'],
    keywords: ['weed'],
    responses: [
      `Niki's preference: pull-by-hand for borders, regular mowing for lawn weeds (most can't survive weekly mowing), and a targeted lawn feed-and-weed only when needed. Slow and steady beats scorched earth.`,
    ],
    followups: ['Seasonal cleanup', 'Book a visit'],
    category: 'knowledge',
  },
  {
    id: 'moss',
    patterns: ['moss', 'mossy lawn', 'scarify', 'scarifying', 'get rid of moss'],
    keywords: ['moss'],
    responses: [
      `Moss is a symptom — shade, compaction, low fertility, or scalping. The fix is scarification + aeration + an autumn feed. Niki does the lot as a one-off lawn renovation.`,
    ],
    followups: ['Book a visit', 'Mowing'],
    category: 'knowledge',
  },
  {
    id: 'feed-lawn',
    patterns: ['lawn feed', 'fertilise lawn', 'fertilize lawn', 'when to feed lawn', 'lawn fertiliser'],
    keywords: ['fertilise', 'lawn'],
    responses: [
      `Two feeds a year is plenty: a spring high-nitrogen feed in April, and an autumn potash feed in late September. Niki uses slow-release granules so it doesn't scorch in a Norfolk dry spell.`,
    ],
    followups: ['Seasonal cleanup', 'Book a visit'],
    category: 'knowledge',
  },
  {
    id: 'mulch',
    patterns: ['mulch', 'mulching', 'bark', 'wood chip', 'top dress'],
    keywords: ['soil'],
    responses: [
      `Mulch is the lazy gardener's secret: 5cm of bark or composted bark in spring keeps moisture in, weeds out, and the worms happy. Niki tops up clients' beds every March.`,
    ],
    followups: ['Landscaping', 'Book a visit'],
    category: 'knowledge',
  },
  {
    id: 'compost',
    patterns: ['compost', 'composting', 'compost bin', 'how to compost'],
    keywords: ['soil'],
    responses: [
      `Compost is just patient soil with ambitions. Mix browns (cardboard, dry leaves) and greens (grass, kitchen scraps) about 50/50, turn it monthly, and you'll have black gold in a year.`,
    ],
    followups: ['Landscaping', 'Seasonal cleanup'],
    category: 'knowledge',
  },
  {
    id: 'hedge-when',
    patterns: ['when to trim hedge', 'when cut hedges', 'hedge trim time', 'best time hedge'],
    keywords: ['hedge', 'trim'],
    responses: [
      `Most hedges want one trim in late June and another in late August — outside nesting season, before autumn growth slows. Niki always checks for nests first; legally and morally, that comes first.`,
    ],
    followups: ['Hedging service', 'Book a visit'],
    category: 'knowledge',
  },
  {
    id: 'pests',
    patterns: ['pests', 'slugs', 'snails', 'aphids', 'greenfly', 'bug problem'],
    keywords: ['pest'],
    responses: [
      `Niki's pest playbook: encourage frogs and ladybirds (they do the eating for you), water in the morning so leaves dry, and only spray when something's truly out of hand. Healthy soil beats heavy chemicals.`,
    ],
    followups: ['Seasonal cleanup', 'Book a visit'],
    category: 'knowledge',
  },
  {
    id: 'pruning',
    patterns: ['prune', 'pruning', 'when to prune', 'cut back shrubs', 'rose prune'],
    keywords: ['trim'],
    responses: [
      `Quick rule: prune spring-flowering shrubs right after they flower, summer-flowering shrubs in late winter. Roses get a hard prune in February. Niki's happy to walk a garden and show you which is which.`,
    ],
    followups: ['Hedging service', 'Book a visit'],
    category: 'knowledge',
  },
  {
    id: 'lawn-stripes',
    patterns: ['how stripes work', 'lawn stripes', 'how to get stripes', 'striped lawn', 'wembley lawn'],
    keywords: ['stripe'],
    responses: [
      `Stripes are an optical trick: grass bent toward you looks dark, away looks pale. A roller-mower (which Niki uses) bends alternate strips, and that's it. No special grass needed.`,
    ],
    followups: ['Mowing service', 'Book a visit'],
    category: 'knowledge',
  },
  {
    id: 'lawn-disease',
    patterns: ['red thread', 'fairy ring', 'dollar spot', 'lawn disease', 'yellow patches', 'brown patches'],
    keywords: ['lawn'],
    responses: [
      `Most "diseases" are stress — drought, compaction, too much shade, or thatch. Diagnose first, treat second. If you can send a photo to info@nikislawngardens.co.uk, Niki will tell you what's going on.`,
    ],
    followups: ['Email a photo', 'Book a visit'],
    category: 'knowledge',
  },
  {
    id: 'tree-care',
    patterns: ['tree', 'fruit tree', 'apple tree', 'pear tree', 'tree pruning'],
    keywords: ['plant'],
    responses: [
      `Niki handles small ornamental and fruit-tree pruning herself — anything taller than four metres or with structural concerns, she'll bring in a tree surgeon she trusts.`,
    ],
    followups: ['Book a visit', 'Hedging'],
    category: 'knowledge',
  },
  {
    id: 'water-restrictions',
    patterns: ['hosepipe ban', 'water restrictions', 'drought rules'],
    keywords: ['water'],
    responses: [
      `Anglian Water occasionally calls a hosepipe ban in dry summers. Watering cans and grey water (washing-up rinse, bath water) stay legal — and a deep soak twice a week beats daily dribbles anyway.`,
    ],
    followups: ['Watering tips', 'Book a visit'],
    category: 'knowledge',
  },
];
