export type KnowledgeCategory =
  | 'CALENDAR_FACT'
  | 'TORAH_PARASHAH'
  | 'HOLIDAY_FESTIVAL'
  | 'HALACHA_EDUCATION'
  | 'COMMUNITY_INFO'
  | 'RECOMMENDATION'
  | 'RAG_EXTERNAL';

export interface KnowledgeSource {
  id: string;
  title: string;
  hebrewTitle?: string;
  category: KnowledgeCategory;
  citation: string;
  contentSnippet: string;
  tags: string[];
  relevanceScore?: number;
}

export interface DetectedIntent {
  primaryCategory: KnowledgeCategory;
  keywords: string[];
  requiresCalendarCalculation: boolean;
  requiresHalachaDisclaimer: boolean;
  requiresCommunityData: boolean;
}

export interface IKnowledgeProvider {
  getProviderId(): string;
  getProviderName(): string;
  search(query: string, intent?: DetectedIntent, limit?: number): Promise<KnowledgeSource[]>;
  getSourcesByCategory(category: KnowledgeCategory): Promise<KnowledgeSource[]>;
}
