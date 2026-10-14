import { IKnowledgeProvider, KnowledgeSource, DetectedIntent, KnowledgeCategory } from './IKnowledgeProvider';
import { ALL_PRODUCTION_KNOWLEDGE_SOURCES } from '../../../data/knowledge';

/**
 * Phase 2 & 3 Vector RAG (Retrieval-Augmented Generation) Hook
 * Decouples lookup engines and searches our production structured JSON repository.
 */
export class FutureRAGProvider implements IKnowledgeProvider {
  private isVectorStoreConnected: boolean = true;

  public getProviderId(): string {
    return 'PROVIDER_FUTURE_VECTOR_RAG';
  }

  public getProviderName(): string {
    return 'Vector RAG Torah Knowledge Engine (Phase 3 Hook)';
  }

  public async search(query: string, _intent?: DetectedIntent, limit: number = 3): Promise<KnowledgeSource[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    // Search across all production structured knowledge files
    const matches = ALL_PRODUCTION_KNOWLEDGE_SOURCES.filter(source => {
      return (
        source.title.toLowerCase().includes(q) ||
        (source.hebrewTitle && source.hebrewTitle.toLowerCase().includes(q)) ||
        source.tags.some(t => q.includes(t.toLowerCase())) ||
        source.contentSnippet.toLowerCase().includes(q)
      );
    });

    return matches.slice(0, limit);
  }

  public async getSourcesByCategory(category: KnowledgeCategory): Promise<KnowledgeSource[]> {
    return ALL_PRODUCTION_KNOWLEDGE_SOURCES.filter(s => s.category === category);
  }

  public connectExternalVectorStore(connected: boolean): void {
    this.isVectorStoreConnected = connected;
  }
}

