import type { Intent } from './types';

export const SMALLTALK_INTENTS: Intent[] = [
  {
    id: 'greeting',
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'aloha'],
    keywords: ['hello'],
    responses: [
      `Hello! I'm GardenGenie — Niki's friendly little helper. 🪴 What can I help with today?`,
      `Hi there. Mowing, landscaping, hedging, seasonal cleanup, or just a Norfolk garden chat — what'll it be?`,
      `Hey! Tell me about your garden and I'll point you the right way.`,
    ],
    followups: ['Services', 'Pricing', 'Areas served', 'Book a visit'],
    category: 'smalltalk',
  },
  {
    id: 'farewell',
    patterns: ['bye', 'goodbye', 'see ya', 'farewell', 'gotta go', 'cheerio'],
    keywords: ['bye'],
    responses: [
      `Take care — I'll be under the lamp whenever you need me. 🪔`,
      `Sun on your shoulders. Come back any time.`,
      `Cheerio! Happy gardening.`,
    ],
    category: 'smalltalk',
  },
  {
    id: 'thanks',
    patterns: ['thanks', 'thank you', 'cheers', 'appreciated', 'much obliged'],
    keywords: ['thanks'],
    responses: [
      `Anytime — that's what genies are for.`,
      `You're very welcome.`,
      `Glad I could help. Anything else I can prune for you?`,
    ],
    followups: ['Services', 'Book a visit', 'Before/after'],
    category: 'smalltalk',
  },
  {
    id: 'how-are-you',
    patterns: ['how are you', 'how are things', 'how are you doing', 'you ok', 'how is it going'],
    responses: [
      `Roots deep, leaves high — thanks for asking. How can I help your garden?`,
      `Photosynthesising nicely. You?`,
    ],
    followups: ['Services', 'Pricing'],
    category: 'smalltalk',
  },
  {
    id: 'genie',
    patterns: ['genie', 'three wishes', 'wish', 'rub the lamp', 'magic', 'are you a bot', 'are you ai', 'are you human', 'are you real'],
    keywords: ['genie'],
    responses: [
      `Genie by name, gardener by nature. I'm a small chatbot — not the real Niki, but I can answer most things and route you to her when you need a human.`,
      `I'm a friendly little script. Niki handles the actual shears.`,
      `Three wishes? Mow. Landscape. Hedge. That's the magic.`,
    ],
    followups: ['Services', 'Get a quote', 'About Niki'],
    category: 'smalltalk',
  },
  {
    id: 'joke',
    patterns: ['joke', 'tell me a joke', 'pun', 'gardening joke', 'plant joke', 'make me laugh'],
    responses: [
      `Why did the gardener plant light bulbs? She wanted to grow a power plant.`,
      `My favourite gardening pun: when the lawn was sad, it said "I'm feeling a bit cut up."`,
      `Compost is just patient soil with ambitions.`,
      `What do you call a stolen yam? A hot potato.`,
      `Norfolk fact, free of charge: it has the lowest hills, the longest coastline of any inland county, and the most acceptable scones.`,
    ],
    followups: ['Services', 'Before/after', 'Get a quote'],
    category: 'smalltalk',
  },
  {
    id: 'weather',
    patterns: ['weather', 'is it raining', 'forecast', 'sunny today', 'cold today'],
    responses: [
      `I can't peek at the sky from in here — but Niki checks the BBC Norfolk forecast every morning before heading out. Wet days are saved for landscape planning.`,
    ],
    followups: ['Book a visit', 'Services'],
    category: 'smalltalk',
  },
  {
    id: 'time',
    patterns: ['what time is it', 'time now', 'whats the time'],
    responses: [
      `Time-wise I'm useless — but Niki works Mon-Fri 7:30am-6:30pm and Saturday 8-4.`,
    ],
    followups: ['Hours', 'Book a visit'],
    category: 'smalltalk',
  },
  {
    id: 'compliment',
    patterns: ['nice site', 'cool site', 'love the design', 'beautiful', 'amazing', 'wow', 'awesome'],
    responses: [
      `Aw, thank you — I'll tell the petunias. 🌷`,
      `Kind of you to say. The garden grew itself, mostly.`,
    ],
    followups: ['Services', 'Get a quote'],
    category: 'smalltalk',
  },
  {
    id: 'language',
    patterns: ['do you speak', 'languages', 'francais', 'espanol', 'deutsch'],
    responses: [
      `English only, I'm afraid — though Niki is patient with everyone. Drop a message in any language and she'll figure it out.`,
    ],
    followups: ['Email Niki', 'Services'],
    category: 'smalltalk',
  },
  {
    id: 'name',
    patterns: ['what is your name', 'whats your name', 'who am i talking to'],
    responses: [
      `I'm GardenGenie — Niki's little assistant. Pleased to meet you.`,
    ],
    followups: ['About Niki', 'Services'],
    category: 'smalltalk',
  },
  {
    id: 'affirm',
    patterns: ['yes', 'yes please', 'go ahead', 'do it', 'sure', 'ok', 'okay', 'sounds good'],
    keywords: ['yes'],
    responses: [`On it.`],
    category: 'meta',
  },
  {
    id: 'deny',
    patterns: ['no', 'no thanks', 'not now', 'maybe later', 'nope'],
    keywords: ['no'],
    responses: [`No worries. Ask me anything else when you're ready.`],
    followups: ['Services', 'Pricing', 'Areas served'],
    category: 'meta',
  },
  {
    id: 'help',
    patterns: ['help', 'menu', 'what can you do', 'options', 'topics'],
    keywords: ['help'],
    responses: [
      `I can help with services, pricing, scheduling, areas, gardening tips, Niki herself, or just chat. Tap a chip, or ask anything.`,
    ],
    followups: ['Services', 'Pricing', 'Gardening tips', 'Areas served'],
    category: 'meta',
  },
];
