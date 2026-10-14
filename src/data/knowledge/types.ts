export interface TopicItem {
  id: string;
  title: string;
  hebrewTitle?: string;
  category: 'TORAH_PARASHAH' | 'HOLIDAY_FESTIVAL' | 'CALENDAR_FACT' | 'HALACHA_EDUCATION' | 'COMMUNITY_INFO' | 'RECOMMENDATION' | 'RAG_EXTERNAL';
  citation: string;
  tags: string[];
  overview: string;
  historicalBackground: string;
  torahSources: string[];
  classicalCommentary: string;
  bneiMenashePerspective: string;
  practicalLessons: string[];
  frequentlyAskedQuestions: Array<{ question: string; answer: string }>;
  relatedTopics: string[];
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  suggestedFollowUpQuestions: string[];
}

export interface KnowledgeJSONFile {
  topicGroup: string;
  description: string;
  version: string;
  items: TopicItem[];
}
