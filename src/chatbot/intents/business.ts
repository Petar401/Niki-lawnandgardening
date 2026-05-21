import type { Intent } from './types';
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, SERVICE_AREA_NAMES } from '@/config/contact';

const PHONE = CONTACT_PHONE_DISPLAY;
const EMAIL = CONTACT_EMAIL;

export const BUSINESS_INTENTS: Intent[] = [
  {
    id: 'about',
    patterns: ['who are you', 'what is this', 'about niki', 'who is niki', 'tell me about niki', 'who runs this'],
    keywords: ['about'],
    responses: [
      `I'm GardenGenie, the friendly little helper for Niki Lawn & Gardening — a one-gardener Norwich business covering Norwich and the whole of Norfolk. Niki herself handles mowing, landscaping, hedging and seasonal cleanups personally.`,
      `Niki Lawn & Gardening is a small, hands-on Norwich outfit. No big crews, no upsell — just Niki, sharp shears and a soft touch with plants.`,
    ],
    followups: ['Services', 'See before/after', 'Get a quote'],
    category: 'business',
  },

  // ---------- Services overview & each service ----------
  {
    id: 'services',
    patterns: ['services', 'what do you offer', 'what services', 'list services', 'what kind of work', 'what can niki do', 'help me with my garden'],
    keywords: ['services'],
    responses: [
      `Four things, all done with care: 🌱 lawn mowing · 🪵 garden landscaping · ✂️ hedge trimming · 🍂 seasonal cleanups. Which one's on your mind?`,
      `Niki does mowing, landscaping, hedging and seasonal cleanups — across Norwich and Norfolk. Want details on any?`,
    ],
    followups: ['Mowing', 'Landscaping', 'Hedging', 'Seasonal'],
    scrollTo: 'services',
    category: 'business',
  },
  {
    id: 'mowing',
    patterns: ['mow', 'mowing', 'cut grass', 'grass cut', 'lawn cut', 'lawn cutting', 'striping', 'edging the lawn'],
    keywords: ['mow', 'lawn', 'stripe', 'edge'],
    responses: [
      `Lawn mowing comes weekly through the growing season and fortnightly when growth slows. Crisp edges, trimmer work along borders, and Wembley-style stripes if you'd like that look. Clippings cleared.`,
      `Mowing visits include the cut, the edge, and the tidy. Niki keeps a steady cadence so your lawn never looks shaggy.`,
    ],
    followups: ['Pricing', 'How often?', 'Book a visit'],
    category: 'service',
  },
  {
    id: 'landscaping',
    patterns: ['landscape', 'landscaping', 'garden design', 'design my garden', 'beds', 'borders', 'paths', 'planting', 'replant', 'new garden', 'redesign'],
    keywords: ['landscape', 'bed', 'path', 'plant'],
    responses: [
      `Landscaping spans planting plans, beds, borders, paths, soil and mulch. It starts with a walk-around and a sketch on the back of an envelope — then a clear quote.`,
      `From bare dirt to garden room: Niki loves a blank patch. Beds, paths, planting design — the lot.`,
    ],
    followups: ['Pricing', 'See before/after', 'Book a visit'],
    category: 'service',
  },
  {
    id: 'hedging',
    patterns: ['hedge', 'hedges', 'hedging', 'topiary', 'trim hedge', 'shape hedge', 'box', 'beech', 'privet', 'leylandii', 'yew'],
    keywords: ['hedge', 'trim'],
    responses: [
      `Hedge work: annual or twice-yearly trims for box, beech, privet, yew, leylandii. Niki works up to about four metres on the ladder; taller hedges get quoted separately. Clippings cleared.`,
      `Hedges shaped, levelled, and tidied. Topiary on request — Niki has been known to coax a chicken out of a privet bush.`,
    ],
    followups: ['Pricing', 'Book a visit', 'Other services'],
    category: 'service',
  },
  {
    id: 'seasonal',
    patterns: ['seasonal', 'spring cleanup', 'autumn cleanup', 'fall cleanup', 'leaf removal', 'tidy up', 'deadhead', 'winter prep', 'put garden to bed'],
    keywords: ['cleanup', 'spring', 'autumn', 'winter', 'leaves'],
    responses: [
      `Seasonal cleanups bookend the year: spring wake-ups (deadheading, cutbacks, mulch top-up) and autumn blowouts (leaves cleared, bulbs in, beds tucked in). Winter prep on request.`,
      `Two big tidies a year keep a Norfolk garden honest — Niki handles both.`,
    ],
    followups: ['Pricing', 'Book a visit', 'Other services'],
    category: 'service',
  },

  // ---------- Pricing / booking / area / contact ----------
  {
    id: 'pricing',
    patterns: ['price', 'pricing', 'how much', 'cost', 'quote', 'estimate', 'rate', 'rates', 'pay', 'charge', 'cheap', 'expensive', 'budget'],
    keywords: ['price'],
    responses: [
      `Honest answer: every garden is different, so Niki doesn't quote blind. A short walk-around (or a couple of photos by email) lets her give a clear, no-obligation number — usually back the same day. Want me to drop you at the form?`,
      `No fixed price list — gardens vary too much. Free quotes, no obligation, usually back within a business day. Shall I take you to the contact form?`,
    ],
    followups: ['Yes, take me there', `Call ${PHONE}`, 'Areas served'],
    category: 'business',
  },
  {
    id: 'scheduling',
    patterns: ['book', 'booking', 'appointment', 'schedule', 'available', 'availability', 'when can you come', 'next week', 'this week', 'come round'],
    keywords: ['book', 'hour'],
    responses: [
      `Most weeks Niki can slot in a new visit within 5-7 days. Drop your details in the form or ring ${PHONE} and she'll suggest two times.`,
      `Booking is easy — form below, or a quick call to ${PHONE}. Niki usually replies the same day.`,
    ],
    followups: ['Yes, take me there', 'Areas served', 'Hours'],
    scrollTo: 'contact',
    category: 'business',
  },
  {
    id: 'area',
    patterns: ['area', 'areas', 'where are you', 'where do you work', 'covered', 'cover', 'serve', 'service area', 'neighbourhood', 'postcode', 'distance', 'far'],
    keywords: ['area', 'norfolk'],
    responses: [
      `Niki covers all of Norwich and the whole of Norfolk — from Costessey to Cromer, Wymondham to Wells. The interactive map at the bottom of the page shows the towns and villages.`,
      `Norwich and the full Norfolk county: ${SERVICE_AREA_NAMES.slice(0, 8).join(', ')}, and everything in between. If you're in Norfolk, you're covered.`,
    ],
    followups: ['Show the map', 'Book a visit', 'Pricing'],
    scrollTo: 'contact',
    category: 'business',
  },
  {
    id: 'contact',
    patterns: ['contact', 'how do i contact', 'how to reach', 'get in touch', 'talk to niki', 'talk to a person', 'real person', 'human'],
    keywords: ['contact', 'email', 'phone'],
    responses: [
      `Quickest is to call Niki on ${PHONE}, or pop your details in the form — straight to her inbox. Email: ${EMAIL}.`,
      `Two ways: phone ${PHONE} or the form on this page. I'll take you there.`,
    ],
    followups: [`Call ${PHONE}`, 'Take me to the form', 'Areas served'],
    scrollTo: 'contact',
    category: 'business',
  },
  {
    id: 'phone',
    patterns: ['phone number', 'phone', 'call you', 'ring', 'mobile', 'whats your number', 'what is your number', 'how to call'],
    keywords: ['phone'],
    responses: [
      `Niki's mobile is ${PHONE}. Best between 7:30am and 6:30pm Monday to Friday, 8 to 4 on Saturday.`,
    ],
    followups: ['Email instead', 'Take me to the form'],
    category: 'business',
  },
  {
    id: 'email',
    patterns: ['email', 'whats your email', 'what is your email', 'email address', 'how to email'],
    keywords: ['email'],
    responses: [
      `Drop a line to ${EMAIL} — Niki reads it personally, usually replies inside a business day.`,
    ],
    followups: [`Call ${PHONE}`, 'Take me to the form'],
    category: 'business',
  },
  {
    id: 'hours',
    patterns: ['hours', 'opening hours', 'open', 'when are you open', 'business hours', 'do you work weekends'],
    keywords: ['hour'],
    responses: [
      `Monday-Friday 7:30am-6:30pm, Saturday 8:00am-4:00pm. Sunday is for tea and seed catalogues.`,
    ],
    followups: ['Book a visit', `Call ${PHONE}`],
    category: 'business',
  },
  {
    id: 'guarantee',
    patterns: ['guarantee', 'warranty', 'happy with the work', 'not happy', 'refund', 'reliable', 'trust'],
    keywords: ['guarantee'],
    responses: [
      `Niki's word: if you're not happy with a visit, she'll come back and fix it free. Most jobs are paid after — so there's never a punt-and-hope.`,
    ],
    followups: ['Book a visit', 'See before/after'],
    category: 'business',
  },
  {
    id: 'insurance',
    patterns: ['insured', 'insurance', 'public liability', 'covered if'],
    keywords: ['insurance'],
    responses: [
      `Yes — Niki carries public liability insurance for garden work. Happy to share a copy of the certificate before a job if you'd like.`,
    ],
    followups: ['Book a visit', 'Services'],
    category: 'business',
  },
  {
    id: 'payment',
    patterns: ['pay', 'payment', 'bank transfer', 'cash', 'card', 'invoice', 'how do i pay'],
    keywords: ['payment'],
    responses: [
      `Bank transfer or cash — whichever's easier. Niki sends a simple invoice after the visit.`,
    ],
    followups: ['Pricing', 'Book a visit'],
    category: 'business',
  },
  {
    id: 'one-off',
    patterns: ['one off', 'one-off', 'just once', 'single visit', 'no contract', 'no commitment'],
    keywords: ['one-off'],
    responses: [
      `Absolutely — one-off visits are welcome. No contracts, no minimum number of visits. Pay-as-you-grow.`,
    ],
    followups: ['Book a visit', 'Pricing'],
    category: 'business',
  },
  {
    id: 'commercial',
    patterns: ['commercial', 'business garden', 'office', 'pub garden', 'shop front', 'rental', 'airbnb', 'holiday let'],
    keywords: ['commercial'],
    responses: [
      `Yes — Niki looks after a handful of small commercial gardens, pub fronts, and Airbnb / holiday lets across Norfolk. Drop the details and she'll quote.`,
    ],
    followups: ['Book a visit', 'Areas served'],
    category: 'business',
  },
  {
    id: 'equipment',
    patterns: ['equipment', 'tools', 'mower', 'do you bring', 'do i need to provide'],
    keywords: ['equipment'],
    responses: [
      `Niki brings everything — mower, strimmer, hedge trimmer, blower, the lot. You provide the tea (optional).`,
    ],
    followups: ['Book a visit', 'Services'],
    category: 'business',
  },
  {
    id: 'pets',
    patterns: ['pet', 'dog', 'cat', 'safe for pets', 'pet friendly'],
    keywords: ['pet'],
    responses: [
      `Pet-friendly through and through. Niki loves a garden dog — just let her know on the day and she'll keep the gate closed.`,
    ],
    followups: ['Book a visit'],
    category: 'business',
  },
];
