/**
 * Curated FAQ — exposed both to crawlers (FAQPage JSON-LD) and to the
 * chatbot panel's "common questions" hint.
 */
export interface FAQ {
  question: string;
  answer: string;
}

export const BUSINESS_FAQ: FAQ[] = [
  {
    question: 'Where does Niki Lawn & Gardening operate?',
    answer:
      'Niki covers Norwich and the whole of Norfolk — from Costessey to Cromer, Wymondham to Wells, Thetford to Great Yarmouth. If you are in Norfolk, you are covered.',
  },
  {
    question: 'How much does lawn mowing cost in Norwich?',
    answer:
      'Every garden is different, so Niki does not publish fixed prices. Quotes are free, no obligation, usually back within one business day — either from a quick walk-around or a couple of photos by email.',
  },
  {
    question: 'How often should a Norfolk lawn be mowed?',
    answer:
      'Weekly from late April through September, fortnightly in March and October, and monthly (or not at all) through deep winter. Never cut more than a third of the blade length in one go.',
  },
  {
    question: 'When is the best time to trim hedges?',
    answer:
      'Most hedges want one trim in late June and another in late August — outside bird nesting season, before autumn growth slows. Niki always checks for nests first.',
  },
  {
    question: 'What services does Niki offer?',
    answer:
      'Lawn mowing and striping, garden landscaping, hedge trimming and shaping, and seasonal cleanups (spring wake-ups and autumn leaf blowouts).',
  },
  {
    question: 'How do I book a visit?',
    answer:
      'Call 07843 818290 or use the contact form on this page. Niki usually replies the same day and can fit a new visit within 5-7 days.',
  },
  {
    question: 'Is Niki insured?',
    answer:
      'Yes — Niki carries public liability insurance for garden work and is happy to share the certificate before a job.',
  },
  {
    question: 'Are there minimum visits or contracts?',
    answer:
      'No contracts and no minimum visit count. One-off jobs are welcome, as are regular weekly or fortnightly visits.',
  },
  {
    question: 'Do you serve commercial gardens, pubs or holiday lets?',
    answer:
      'Yes — Niki looks after a handful of small commercial gardens, pub fronts and Airbnb / holiday lets across Norfolk.',
  },
  {
    question: 'What are Niki Lawn & Gardening business hours?',
    answer:
      'Monday to Friday 7:30am-6:30pm, Saturday 8:00am-4:00pm. Closed Sunday.',
  },
  {
    question: 'How is the lawn made to look striped?',
    answer:
      'Stripes are an optical effect. A roller mower bends each strip of grass in alternating directions — light reflects differently from each row, giving the Wembley-style stripes.',
  },
  {
    question: 'Do you take pets and children into account?',
    answer:
      'Pet- and child-friendly. Niki keeps gates closed, picks up clippings, and uses minimal chemicals — healthy soil instead.',
  },
  {
    question: 'What plants grow best in Norfolk?',
    answer:
      'Norfolk is the driest county in England (about 600mm rain a year), so drought-tolerant perennials shine: lavender, rosemary, sea holly, salvia, verbena bonariensis, achillea. Near the coast: escallonia and sea buckthorn.',
  },
  {
    question: 'When is the last frost in Norfolk?',
    answer:
      'The last frost in Norfolk is typically mid-May, the first frost early-to-mid October. Tender plants are usually safe outside after 15 May.',
  },
  {
    question: 'How do I get rid of moss in my lawn?',
    answer:
      'Moss is a symptom of shade, compaction, low fertility, or scalping. The fix is scarification, aeration, and an autumn potash feed. Niki offers a one-off lawn renovation that handles all three.',
  },
];
