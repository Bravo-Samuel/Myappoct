import {
  IKnowledgeProvider,
  KnowledgeSource,
  DetectedIntent,
  KnowledgeCategory,
  CalendarKnowledgeProvider,
  TorahKnowledgeProvider,
  HolidayKnowledgeProvider,
  HalachaKnowledgeProvider,
  CommunityKnowledgeProvider,
  FutureRAGProvider
} from './providers';

/**
 * Phase 2 Knowledge Orchestrator
 * Transforms AI Rabbi from a chatbot into a structured, federated Torah knowledge system.
 * Coordinates Calendar, Torah, Holiday, Halacha, Community, and Future RAG providers.
 */
export class KnowledgeOrchestrator implements IKnowledgeProvider {
  private providers: Map<string, IKnowledgeProvider> = new Map();
  private calendarProvider: CalendarKnowledgeProvider;
  private torahProvider: TorahKnowledgeProvider;
  private holidayProvider: HolidayKnowledgeProvider;
  private halachaProvider: HalachaKnowledgeProvider;
  private communityProvider: CommunityKnowledgeProvider;
  private ragProvider: FutureRAGProvider;

  constructor() {
    this.calendarProvider = new CalendarKnowledgeProvider();
    this.torahProvider = new TorahKnowledgeProvider();
    this.holidayProvider = new HolidayKnowledgeProvider();
    this.halachaProvider = new HalachaKnowledgeProvider();
    this.communityProvider = new CommunityKnowledgeProvider();
    this.ragProvider = new FutureRAGProvider();

    this.registerProvider(this.calendarProvider);
    this.registerProvider(this.torahProvider);
    this.registerProvider(this.holidayProvider);
    this.registerProvider(this.halachaProvider);
    this.registerProvider(this.communityProvider);
    this.registerProvider(this.ragProvider);
  }

  public getProviderId(): string {
    return 'ORCHESTRATOR_FEDERATED_KNOWLEDGE';
  }

  public getProviderName(): string {
    return 'AI Rabbi Knowledge Orchestrator';
  }

  public registerProvider(provider: IKnowledgeProvider): void {
    this.providers.set(provider.getProviderId(), provider);
  }

  public getProviderIds(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Step 1: Detect Intent from User Prompt
   */
  public detectIntent(query: string): DetectedIntent {
    const q = query.toLowerCase().trim();
    
    const requiresCalendarCalculation =
      q.includes('date') ||
      q.includes('today') ||
      q.includes('omer') ||
      q.includes('parashah') ||
      q.includes('candle') ||
      q.includes('shabbat') ||
      q.includes('time') ||
      q.includes('when') ||
      q.includes('zmanim');

    const requiresHalachaDisclaimer =
      q.includes('halacha') ||
      q.includes('ruling') ||
      q.includes('allowed') ||
      q.includes('prohibited') ||
      q.includes('kosher') ||
      q.includes('tefillin') ||
      q.includes('prayer') ||
      q.includes('fast');

    const requiresCommunityData =
      q.includes('synagogue') ||
      q.includes('shul') ||
      q.includes('minyan') ||
      q.includes('event') ||
      q.includes('announcement') ||
      q.includes('churachandpur') ||
      q.includes('aizawl') ||
      q.includes('nof hagalil') ||
      q.includes('council');

    let primaryCategory: KnowledgeCategory = 'TORAH_PARASHAH';
    if (requiresCalendarCalculation) primaryCategory = 'CALENDAR_FACT';
    else if (q.includes('holiday') || q.includes('pesach') || q.includes('sukkot') || q.includes('tisha')) primaryCategory = 'HOLIDAY_FESTIVAL';
    else if (requiresHalachaDisclaimer) primaryCategory = 'HALACHA_EDUCATION';
    else if (requiresCommunityData) primaryCategory = 'COMMUNITY_INFO';

    return {
      primaryCategory,
      keywords: q.split(/\s+/).filter(w => w.length > 2),
      requiresCalendarCalculation,
      requiresHalachaDisclaimer,
      requiresCommunityData
    };
  }

  /**
   * Step 2: Query Appropriate Providers
   */
  public async search(query: string, intent?: DetectedIntent, limit: number = 8): Promise<KnowledgeSource[]> {
    const activeIntent = intent || this.detectIntent(query);

    // Query all registered providers concurrently
    const searchPromises = Array.from(this.providers.values()).map(provider =>
      provider.search(query, activeIntent, limit)
    );

    const resultsArray = await Promise.all(searchPromises);
    const allResults: KnowledgeSource[] = resultsArray.flat();

    // Deduplicate by source ID
    const seen = new Set<string>();
    const deduplicated = allResults.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

    return deduplicated.slice(0, limit);
  }

  public async getSourcesByCategory(category: KnowledgeCategory): Promise<KnowledgeSource[]> {
    const allResults: KnowledgeSource[] = [];
    for (const provider of this.providers.values()) {
      const results = await provider.getSourcesByCategory(category);
      allResults.push(...results);
    }
    return allResults;
  }

  /**
   * Step 3: Merge Structured Context & Clearly Distinguish Categories
   */
  public mergeStructuredContext(sources: KnowledgeSource[]): string {
    if (sources.length === 0) {
      return `[System Notice]: No local structured Torah or community repository record found matching this query. Proceed with authentic Torah principles and advise user if specific local schedule data is required.`;
    }

    const calendarFacts = sources.filter(s => s.category === 'CALENDAR_FACT');
    const educationalInfo = sources.filter(s => s.category === 'TORAH_PARASHAH' || s.category === 'HOLIDAY_FESTIVAL' || s.category === 'HALACHA_EDUCATION');
    const communityInfo = sources.filter(s => s.category === 'COMMUNITY_INFO');
    const recommendations = sources.filter(s => s.category === 'RECOMMENDATION');

    const sections: string[] = [];

    if (calendarFacts.length > 0) {
      sections.push(
        `### [Calendar Facts] (Verified Platform Schedule)\n` +
        calendarFacts.map(s => `* **${s.title}** (${s.citation}): ${s.contentSnippet}`).join('\n')
      );
    }

    if (educationalInfo.length > 0) {
      sections.push(
        `### [Educational Information] (Torah, Holiday & Halacha Explanation)\n` +
        educationalInfo.map(s => `* **${s.title}** (${s.citation}): ${s.contentSnippet}`).join('\n\n')
      );
    }

    if (communityInfo.length > 0) {
      sections.push(
        `### [Community Information] (Synagogues, Events & Regional Council)\n` +
        communityInfo.map(s => `* **${s.title}** (${s.citation}): ${s.contentSnippet}`).join('\n')
      );
    }

    if (recommendations.length > 0) {
      sections.push(
        `### [Recommendations & Guidance]\n` +
        recommendations.map(s => `* **${s.title}**: ${s.contentSnippet}`).join('\n')
      );
    }

    return sections.join('\n\n────────────────────────────────────────\n\n');
  }

  /**
   * Pipeline Executor: Returns merged formatted context string for prompt injection
   */
  public async getRelevantContextString(query: string): Promise<string> {
    const intent = this.detectIntent(query);
    const sources = await this.search(query, intent, 8);
    return this.mergeStructuredContext(sources);
  }
}

// Export singleton alias preserving backwards compatibility with existing imports
export const knowledgeSourceService = new KnowledgeOrchestrator();
export type { KnowledgeSource, DetectedIntent, KnowledgeCategory, IKnowledgeProvider };
export type StructuredKnowledgeSourceService = KnowledgeOrchestrator;
