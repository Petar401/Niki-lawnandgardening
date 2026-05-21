/**
 * GardenGenie intent registry. Each intent defines:
 *   - patterns: regex or substring tokens to score against the user message
 *   - responses: one is picked at random for variety
 *   - followups: quick-reply chips to surface after this reply
 *   - scrollTo: optional section id to anchor-scroll to as side effect
 *
 * The genie's voice is warm, playful, gardener-themed. Replies are kept
 * short (1-3 sentences) so the panel doesn't feel chatty.
 */

export type IntentId =
  | 'greeting'
  | 'farewell'
  | 'thanks'
  | 'about'
  | 'services'
  | 'mowing'
  | 'landscaping'
  | 'hedging'
  | 'seasonal'
  | 'pricing'
  | 'scheduling'
  | 'area'
  | 'contact'
  | 'genie'
  | 'help'
  | 'fun'
  | 'affirm'
  | 'deny'
  | 'fallback';

export interface Intent {
  id: IntentId;
  patterns: (string | RegExp)[];
  responses: string[];
  followups?: string[];
  scrollTo?: 'hero' | 'services' | 'gallery' | 'contact';
}

export const INTENTS: Intent[] = [
  {
    id: 'greeting',
    patterns: ['hi', 'hello', 'hey', 'howdy', 'hola', 'good morning', 'good afternoon', 'good evening', /\bsup\b/i],
    responses: [
      "Hello! I'm GardenGenie — your wish is my mulch. 🪴 What can I help with?",
      'Hi there! Tell me about your yard and I will point you in the right direction.',
      'Hey! Mow, landscape, hedge, or seasonal cleanup — which sounds like you?',
    ],
    followups: ['Services', 'Pricing', 'Areas served', 'Book a visit'],
  },
  {
    id: 'farewell',
    patterns: ['bye', 'goodbye', 'see ya', 'see you', 'later', 'cya', 'farewell'],
    responses: [
      "Take care! I'll be here under the lamp whenever you need me. 🪔",
      'Sun on your shoulders. Come back any time.',
      "Goodbye for now — happy gardening!",
    ],
  },
  {
    id: 'thanks',
    patterns: ['thanks', 'thank you', 'thx', 'cheers', 'appreciated', 'appreciate it'],
    responses: [
      "Anytime — that's what genies are for.",
      "You're very welcome.",
      'Glad I could help. Anything else I can prune for you?',
    ],
    followups: ['Services', 'Book a visit', 'Show me before/after'],
  },
  {
    id: 'about',
    patterns: ['who are you', 'what is this', 'about niki', 'who is niki', 'about you', 'what do you do', 'who runs this'],
    responses: [
      "I'm GardenGenie, the assistant for Niki Lawn & Gardening. Niki handles mowing, landscaping, hedging, and seasonal cleanup with a sharp eye and a soft touch.",
      "Niki Lawn & Gardening is a small, hands-on outfit. Niki herself does the work — no big crews, no upsell, just tidy yards.",
    ],
    followups: ['Services', 'See before/after', 'Get a quote'],
  },
  {
    id: 'services',
    patterns: ['services', 'offerings', 'what do you offer', 'what services', 'list services', 'what kind of work'],
    responses: [
      "We do four things, all with care: 🌱 Mowing · 🪵 Landscaping · ✂️ Hedging · 🍂 Seasonal cleanup. Which one's on your mind?",
      "Four offerings — mowing, landscaping, hedging, and seasonal cleanup. Scroll up to see the orbs, or ask me about any of them.",
    ],
    followups: ['Mowing', 'Landscaping', 'Hedging', 'Seasonal'],
    scrollTo: 'services',
  },
  {
    id: 'mowing',
    patterns: ['mow', 'mowing', 'cut grass', 'grass cut', 'lawn cut', 'lawn cutting', 'striping'],
    responses: [
      "Mowing comes in weekly or fortnightly visits. Crisp edges, trimmer work along borders, and stripes if you'd like that look.",
      "Lawns get a steady cadence — usually weekly in growing season, fortnightly in slow weeks. Edged and tidied as part of the visit.",
    ],
    followups: ['Pricing', 'Book a visit', 'Other services'],
  },
  {
    id: 'landscaping',
    patterns: ['landscape', 'landscaping', 'design', 'garden design', 'beds', 'border', 'borders', 'path', 'paths', 'planting'],
    responses: [
      "Landscaping spans planting plans, beds, borders, paths, and soil + mulch. We start with a walk-through and a quick sketch.",
      "Niki loves a blank patch. From bare dirt to garden room — planting design, beds, borders, the lot.",
    ],
    followups: ['Pricing', 'See before/after', 'Book a visit'],
  },
  {
    id: 'hedging',
    patterns: ['hedge', 'hedges', 'hedging', 'topiary', 'trim hedge', 'shape hedge', 'box hedge', 'beech', 'privet'],
    responses: [
      'Hedging — annual or twice-yearly trims. Box, beech, privet, leylandii. Up to about 4 metres on a ladder; taller needs a quote.',
      "Hedge work: shaped, levelled, and clippings hauled away. Sculpting on request.",
    ],
    followups: ['Pricing', 'Book a visit', 'Other services'],
  },
  {
    id: 'seasonal',
    patterns: ['seasonal', 'spring', 'fall', 'autumn', 'winter', 'cleanup', 'leaves', 'leaf', 'tidy up', 'deadhead'],
    responses: [
      "Seasonal cleanups bookend the year — spring wake-ups and fall blowouts. Includes deadheading, cutbacks, leaf removal, and winter prep.",
      "Two big tidies a year: spring to wake the garden and fall to put it to bed. Leaves, mulch, the works.",
    ],
    followups: ['Pricing', 'Book a visit', 'Other services'],
  },
  {
    id: 'pricing',
    patterns: ['price', 'pricing', 'cost', 'costs', 'how much', 'quote', 'estimate', 'rate', 'rates', 'pay', 'charge'],
    responses: [
      "Pricing depends on yard size, plant density, and travel. I can't quote here — but Niki replies within a business day. Want me to take you to the form?",
      "Quotes are free and usually back the same day. Faster if you can share a few photos. Shall I drop you at the form?",
    ],
    followups: ['Yes, take me there', 'What do you need to quote?', 'Areas served'],
  },
  {
    id: 'scheduling',
    patterns: ['schedule', 'book', 'appointment', 'available', 'availability', 'when can you', 'next week', 'this week', 'come by'],
    responses: [
      "Most weeks Niki can fit a new visit within 5–7 days. Use the form and we'll suggest a slot.",
      "Booking is via the form — drop your details and we'll come back with two times that work.",
    ],
    followups: ['Yes, take me there', 'Areas served', 'Pricing'],
  },
  {
    id: 'area',
    patterns: ['area', 'areas', 'where are you', 'where do you', 'located', 'serve', 'cover', 'neighborhood', 'neighbourhood', 'zip', 'postcode', 'distance', 'far'],
    responses: [
      "We work across the neighbourhood and the surrounding towns. If you're within a 25-minute drive, almost always a yes.",
      "Local-first — neighbourhood and adjacent towns. Drop your address in the form and we'll confirm.",
    ],
    followups: ['Book a visit', 'Pricing', 'Other services'],
  },
  {
    id: 'contact',
    patterns: ['contact', 'email', 'phone', 'call', 'reach', 'get in touch', 'talk to a person', 'real person', 'human'],
    responses: [
      "Easiest is the form at the bottom — it goes straight to Niki. I'll take you there.",
      "Best way to reach Niki: the form on this page. Dropping you there now.",
    ],
    followups: ['Pricing', 'Areas served'],
    scrollTo: 'contact',
  },
  {
    id: 'genie',
    patterns: ['genie', 'wish', 'wishes', 'magic', 'rub the lamp', 'three wishes', 'are you ai', 'are you a bot', 'are you real'],
    responses: [
      "Genie by name, gardener by nature. I'm a small assistant — not the real Niki, but I can answer most questions and route you to her.",
      "I'm a friendly little chatbot. Niki handles the actual shears.",
      "Three wishes? Mow, landscape, hedge. That's the magic.",
    ],
    followups: ['Services', 'Get a quote', 'See before/after'],
  },
  {
    id: 'fun',
    patterns: ['joke', 'fun fact', 'tell me something', 'pun', 'gardening joke', 'plant joke'],
    responses: [
      "Why did the gardener plant light bulbs? She wanted to grow a power plant.",
      "A fun one: grass is the largest crop on Earth by total acreage — yes, lawns.",
      "Compost is just patient soil with ambitions.",
    ],
    followups: ['Services', 'See before/after', 'Get a quote'],
  },
  {
    id: 'help',
    patterns: ['help', 'menu', 'what can you do', 'options', 'topics', 'commands'],
    responses: [
      "I can help with services, pricing, scheduling, areas served, and pointing you to the form. Tap a chip or just ask.",
    ],
    followups: ['Services', 'Pricing', 'Areas served', 'Book a visit'],
  },
  {
    id: 'affirm',
    patterns: [/^(yes|yeah|yep|sure|ok|okay|yup|definitely|please)\b/i, 'yes please', 'go ahead'],
    responses: ['On it.'],
  },
  {
    id: 'deny',
    patterns: [/^(no|nope|nah|not now|maybe later)\b/i],
    responses: ["No worries. Ask me anything else when you're ready."],
    followups: ['Services', 'Pricing', 'Areas served'],
  },
  {
    id: 'fallback',
    patterns: [],
    responses: [
      "I'm not sure I caught that — try one of the chips below, or ask about services, pricing, or booking.",
      "Hmm, not in my soil yet. Try: services, pricing, areas, or book a visit.",
    ],
    followups: ['Services', 'Pricing', 'Areas served', 'Book a visit'],
  },
];
