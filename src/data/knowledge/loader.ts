import { TopicItem, KnowledgeJSONFile } from './types';
import { KnowledgeSource, KnowledgeCategory } from '../../services/airabbi/providers/IKnowledgeProvider';

export function formatTopicSnippet(item: TopicItem): string {
  const sourcesText = item.torahSources.map(s => `• ${s}`).join('\n');
  const lessonsText = item.practicalLessons.map(l => `• ${l}`).join('\n');
  const faqsText = item.frequentlyAskedQuestions.map(f => `• Q: ${f.question}\n  A: ${f.answer}`).join('\n');
  const followUpsText = item.suggestedFollowUpQuestions.map(q => `• "${q}"`).join('\n');

  return `
**Overview:** ${item.overview}

**Historical Background:** ${item.historicalBackground}

**Torah Sources:**
${sourcesText}

**Classical Commentary:** ${item.classicalCommentary}

**Bnei Menashe Perspective:** ${item.bneiMenashePerspective}

**Practical Lessons:**
${lessonsText}

**Frequently Asked Questions:**
${faqsText}

**Related Topics:** ${item.relatedTopics.join(', ')} | **Difficulty Level:** ${item.difficultyLevel}

**Suggested Follow-up Questions:**
${followUpsText}
`.trim();
}

export function convertTopicToKnowledgeSource(item: TopicItem): KnowledgeSource {
  return {
    id: item.id,
    title: item.title,
    hebrewTitle: item.hebrewTitle,
    category: item.category as KnowledgeCategory,
    citation: item.citation,
    contentSnippet: formatTopicSnippet(item),
    tags: item.tags
  };
}

export function loadKnowledgeSourcesFromJSON(jsonFile: KnowledgeJSONFile): KnowledgeSource[] {
  return (jsonFile.items || []).map(convertTopicToKnowledgeSource);
}
