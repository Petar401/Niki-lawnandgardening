/** Shared intent type for the modular GardenGenie engine. */
export type ScrollTarget = 'hero' | 'services' | 'gallery' | 'contact';

export interface Intent {
  /** Stable identifier (used for context tracking and analytics). */
  id: string;
  /**
   * Free-text phrases that mean this intent. Scored against the
   * user's (synonym-expanded) message via Sørensen-Dice + keyword
   * overlap. Include several phrasings, including misspellings.
   */
  patterns: string[];
  /**
   * Keyword tokens that *strongly* indicate this intent. After synonym
   * expansion, presence of any of these adds a flat keyword bonus.
   */
  keywords?: string[];
  /** One picked at random per reply. */
  responses: string[];
  /** Quick-reply chips. */
  followups?: string[];
  /** Side-effect: scroll the page to a section. */
  scrollTo?: ScrollTarget;
  /**
   * Optional category — used to weight context follow-ups
   * ("how much?" right after `mowing` should still mean mowing price).
   */
  category?: 'service' | 'business' | 'knowledge' | 'norfolk' | 'smalltalk' | 'meta';
}
