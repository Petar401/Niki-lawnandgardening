/**
 * Synonym expansion. Every word in `from` is rewritten to the canonical
 * `to` token before intent scoring. Lets one keyword cover dozens of
 * phrasings ("cut", "trim", "buzz" → "mow").
 *
 * Order matters: more specific groups first.
 */
export const SYNONYMS: Array<{ to: string; from: string[] }> = [
  // Greetings
  { to: 'hello', from: ['hi', 'hey', 'howdy', 'hola', 'yo', 'sup', 'hiya', 'morning', 'evening', 'afternoon', 'gday', "g'day", 'greetings', 'aloha', 'oi', 'ay'] },
  { to: 'bye', from: ['goodbye', 'cya', 'cheerio', 'farewell', 'ttyl', 'laters', 'bye-bye', 'so long'] },
  { to: 'thanks', from: ['thank you', 'thx', 'cheers', 'ta', 'appreciate it', 'appreciated', 'much obliged', 'nice one'] },

  // Mowing
  { to: 'mow', from: ['mowing', 'cut', 'cutting', 'trimming the grass', 'grass cut', 'lawn cut', 'lawncut', 'lawn cutting', 'buzz', 'shave', 'haircut', 'strim'] },
  { to: 'lawn', from: ['grass', 'turf', 'lawns', 'greensward', 'sward'] },
  { to: 'stripe', from: ['stripes', 'striping', 'lines', 'wembley', 'wimbledon stripes'] },
  { to: 'edge', from: ['edging', 'edges', 'border edge', 'kerb', 'curb'] },

  // Landscaping
  { to: 'landscape', from: ['landscaping', 'design', 'designing', 'redesign', 'makeover', 'overhaul'] },
  { to: 'bed', from: ['beds', 'flowerbed', 'flower bed', 'border', 'borders', 'planting bed'] },
  { to: 'path', from: ['paths', 'pathway', 'walkway', 'paving', 'patio', 'pavers', 'flagstone'] },
  { to: 'plant', from: ['planting', 'planted', 'plants', 'flowers', 'shrubs', 'perennial', 'annual', 'bulbs', 'sapling'] },
  { to: 'soil', from: ['dirt', 'earth', 'topsoil', 'compost', 'mulch', 'manure', 'feed', 'fertiliser', 'fertilizer'] },

  // Hedging
  { to: 'hedge', from: ['hedges', 'hedging', 'topiary', 'shrubbery', 'box hedge', 'beech', 'privet', 'leylandii', 'yew', 'laurel', 'conifer'] },
  { to: 'trim', from: ['trimming', 'cut back', 'cutback', 'shape', 'shaping', 'prune', 'pruning', 'pollard'] },

  // Seasonal
  { to: 'cleanup', from: ['clean up', 'tidy', 'tidy up', 'clearance', 'clear out', 'declutter'] },
  { to: 'spring', from: ['springtime', 'easter'] },
  { to: 'autumn', from: ['fall', 'autumnal'] },
  { to: 'winter', from: ['wintertime', 'wintery', 'wintry', 'christmas', 'december', 'january', 'february'] },
  { to: 'summer', from: ['summertime', 'july', 'august', 'sunny'] },
  { to: 'leaves', from: ['leaf', 'leafs', 'foliage', 'leaf fall', 'fallen leaves'] },

  // Business Q&A
  { to: 'price', from: ['cost', 'costs', 'pricing', 'how much', 'quote', 'estimate', 'rate', 'rates', 'fee', 'fees', 'charge', 'budget', 'cheap', 'expensive', 'affordable', 'value'] },
  { to: 'book', from: ['booking', 'appointment', 'schedule', 'scheduling', 'arrange', 'visit', 'come round', 'come over', 'pop over', 'call out', 'callout'] },
  { to: 'area', from: ['areas', 'where', 'serve', 'covering', 'coverage', 'travel', 'distance', 'far', 'local', 'postcode', 'zip', 'nearby', 'near me'] },
  { to: 'phone', from: ['call', 'ring', 'telephone', 'mobile', 'cell', 'number'] },
  { to: 'email', from: ['mail', 'message', 'write', 'inbox'] },
  { to: 'contact', from: ['reach', 'get in touch', 'talk', 'speak', 'talk to', 'human', 'real person', 'somebody', 'support'] },
  { to: 'hour', from: ['hours', 'open', 'opening', 'time', 'times', 'when open'] },

  // Gardening knowledge
  { to: 'water', from: ['watering', 'irrigation', 'sprinkler', 'hose'] },
  { to: 'seed', from: ['seeding', 'overseed', 'overseeding', 'reseed', 'reseeding', 'sowing', 'sow'] },
  { to: 'weed', from: ['weeds', 'weeding', 'invasive', 'nettles', 'dandelion', 'dandelions', 'thistle', 'clover'] },
  { to: 'pest', from: ['pests', 'bug', 'bugs', 'insect', 'insects', 'aphid', 'aphids', 'slug', 'slugs', 'snail'] },
  { to: 'moss', from: ['mossy', 'scarify', 'scarifying'] },
  { to: 'fertilise', from: ['fertilize', 'feeding', 'feed lawn', 'lawn feed'] },

  // Norfolk-specific
  { to: 'norfolk', from: ['norfolk', 'norwich', 'broads', 'broadland'] },

  // Yes / no / chit-chat
  { to: 'yes', from: ['yeah', 'yep', 'yup', 'sure', 'ok', 'okay', 'definitely', 'please', 'go ahead', 'do it', 'sounds good'] },
  { to: 'no', from: ['nope', 'nah', 'not now', 'maybe later', 'no thanks', 'no thank you'] },
];

const TO_SET = new Set(SYNONYMS.map((s) => s.to));

/**
 * Lower-case + strip punctuation, then replace synonyms with their
 * canonical form. Returns the rewritten string and the set of canonical
 * tokens present (handy for keyword scoring).
 */
export function expandSynonyms(input: string): { text: string; tokens: Set<string> } {
  let s = ` ${input.toLowerCase().replace(/[^a-z0-9 ']+/g, ' ').replace(/\s+/g, ' ').trim()} `;
  for (const { to, from } of SYNONYMS) {
    for (const f of from) {
      const re = new RegExp(`\\s${escapeRegex(f)}\\s`, 'g');
      s = s.replace(re, ` ${to} `);
    }
  }
  s = s.trim();
  const tokens = new Set<string>();
  for (const w of s.split(/\s+/)) {
    if (TO_SET.has(w)) tokens.add(w);
  }
  return { text: s, tokens };
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
