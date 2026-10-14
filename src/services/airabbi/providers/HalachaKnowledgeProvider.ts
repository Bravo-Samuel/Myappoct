import { IKnowledgeProvider, KnowledgeSource, DetectedIntent, KnowledgeCategory } from './IKnowledgeProvider';
import { getProductionKnowledgeSourcesByCategory } from '../../../data/knowledge';

export class HalachaKnowledgeProvider implements IKnowledgeProvider {
  private sources: KnowledgeSource[] = [
    ...getProductionKnowledgeSourcesByCategory('HALACHA_EDUCATION'),
    {
      id: 'hal-tefillin-shacharit',
      title: 'Laws of Tefillin & Shacharit Prayer Times',
      hebrewTitle: 'הלכות תפילין וזמן תפילת שחרית',
      category: 'HALACHA_EDUCATION',
      citation: 'Shulchan Aruch O.C. 30:1',
      contentSnippet: `The earliest permissible time to don Tallit and Tefillin with blessings is Misheyakir (when blue threads can be distinguished from white). Shacharit commences ideally after Hanetz HaChama (sunrise). Note: This is educational general Halacha; for precise congregational minyan schedules, check with your local Gabbai or Rabbi.`,
      tags: ['tefillin', 'tallit', 'shacharit', 'prayer', 'misheyakir', 'sunrise']
    },
    {
      id: 'hal-kashrut-separation',
      title: 'Educational Principles of Kashrut in the Kitchen',
      hebrewTitle: 'עקרונות כשרות - הפרדה במטבח',
      category: 'HALACHA_EDUCATION',
      citation: 'Shulchan Aruch Yoreh Deah 87; Communal Kitchen Guide',
      contentSnippet: `Halacha requires strict separation between meat (Basari) and dairy (Halavi) utensils, sinks, and food preparations. Following Sefardi customs observed in Bnei Menashe centers, waiting periods after consuming meat prior to dairy are observed meticulously.`,
      tags: ['kashrut', 'kosher', 'meat', 'dairy', 'kitchen', 'utensils']
    },
    {
      id: 'hal-remote-minhagim',
      title: 'Preserving Custom & Minhag in Community Transitions',
      hebrewTitle: 'שמירת מנהגי אבות במסורת בני מנשה',
      category: 'HALACHA_EDUCATION',
      citation: 'Chazon Ish; Bnei Menashe Rabbinic Directorate',
      contentSnippet: `When community members transition between Northeast India townships and Aliyah absorption centers in Israel, ancestral liturgy and Sefardi pronunciation rites are lovingly preserved. Halachic questions regarding communal integration are guided by established rabbinic boards.`,
      tags: ['minhag', 'custom', 'aliyah', 'israel', 'india', 'sefardi']
    }
  ];

  public getProviderId(): string {
    return 'PROVIDER_HALACHA_EDUCATION';
  }

  public getProviderName(): string {
    return 'Halachic Educational Reference Repository';
  }

  public async search(query: string, intent?: DetectedIntent, limit: number = 4): Promise<KnowledgeSource[]> {
    const q = query.toLowerCase();
    const results = this.sources
      .filter(item => {
        return (
          item.title.toLowerCase().includes(q) ||
          (item.hebrewTitle && item.hebrewTitle.includes(q)) ||
          item.contentSnippet.toLowerCase().includes(q) ||
          item.tags.some(t => q.includes(t)) ||
          intent?.primaryCategory === 'HALACHA_EDUCATION'
        );
      })
      .slice(0, limit);

    // Always inject Halachic Recommendation Disclaimer if Halacha is queried
    if (results.length > 0 || intent?.requiresHalachaDisclaimer) {
      results.push({
        id: 'hal-disclaimer-safety',
        title: 'Mandatory Rabbinic Consultation Recommendation',
        hebrewTitle: 'עשה לך רב - הדרכה הלכתית',
        category: 'RECOMMENDATION',
        citation: 'Pirkei Avot 1:6; Platform Halachic Governance',
        contentSnippet: `[Recommendation] The AI Rabbi provides structured educational explanations of Torah and Halacha. It does not issue binding personal Halachic rulings (Psak Halacha) for complex family, medical, or dietary questions. Please consult your local synagogue Rabbi for authoritative personal guidance.`,
        tags: ['rabbi', 'consultation', 'disclaimer', 'ruling', 'psak']
      });
    }

    return results;
  }

  public async getSourcesByCategory(category: KnowledgeCategory): Promise<KnowledgeSource[]> {
    return this.sources.filter(s => s.category === category);
  }
}
