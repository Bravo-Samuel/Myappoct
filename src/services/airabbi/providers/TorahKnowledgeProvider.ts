import { IKnowledgeProvider, KnowledgeSource, DetectedIntent, KnowledgeCategory } from './IKnowledgeProvider';
import { getProductionKnowledgeSourcesByCategory } from '../../../data/knowledge';

export class TorahKnowledgeProvider implements IKnowledgeProvider {
  private sources: KnowledgeSource[] = [
    ...getProductionKnowledgeSourcesByCategory('TORAH_PARASHAH'),
    {
      id: 'torah-pinchas-commentary',
      title: 'Parashat Pinchas: Courage & Daughters of Zelophehad',
      hebrewTitle: 'בנות צלפחד - שבט מנשה',
      category: 'TORAH_PARASHAH',
      citation: 'Bamidbar (Numbers) 27:1-11; Midrash Rabbah',
      contentSnippet: `The five daughters of Zelophehad—Mahlah, Noa, Hoglah, Milcah, and Tirzah—belonged directly to the Tribe of Manasseh (Menashe). Their unwavering demand for ancestral land rights in Eretz Yisrael established an eternal Torah precedent for female inheritance and love for the Promised Land. For Bnei Menashe today, their story is the spiritual heartbeat of Aliyah.`,
      tags: ['pinchas', 'zelophehad', 'menashe', 'aliyah', 'parashah', 'inheritance', 'land']
    },
    {
      id: 'torah-bereshit-menashe',
      title: 'Patriarchal Blessing of Ephraim & Menashe',
      hebrewTitle: 'המלאך הגואל אותי - ברכת אפריים ומנשה',
      category: 'TORAH_PARASHAH',
      citation: 'Bereshit (Genesis) 48:16; Shabbat Liturgy',
      contentSnippet: `Jacob (Yaakov Avinu) blessed Joseph's sons: "May the angel who redeemed me from all evil bless the youths... and let them multiply into a multitude in the midst of the earth." Throughout centuries of exile across the Silk Road and East Asia, Bnei Menashe parents have preserved this Friday night blessing over their children.`,
      tags: ['blessing', 'menashe', 'ephraim', 'shabbat', 'jacob', 'genesis']
    },
    {
      id: 'torah-study-daf-yomi',
      title: 'Daily Torah Study & Communal Learning',
      hebrewTitle: 'לימוד תורה ודף יומי',
      category: 'TORAH_PARASHAH',
      citation: 'Pirkei Avot 1:1; Bnei Menashe Study Network',
      contentSnippet: `Torah study is the vital thread uniting Bnei Menashe congregations across Manipur, Mizoram, and Israel. Whether participating in daily Mishnah study groups or weekly Parashah classes, structured learning maintains our unbroken Sinaitic heritage.`,
      tags: ['study', 'daf yomi', 'mishnah', 'learning', 'education']
    }
  ];

  public getProviderId(): string {
    return 'PROVIDER_TORAH_TANAKH';
  }

  public getProviderName(): string {
    return 'Structured Torah & Tanakh Repository';
  }

  public async search(query: string, intent?: DetectedIntent, limit: number = 4): Promise<KnowledgeSource[]> {
    const q = query.toLowerCase();
    return this.sources
      .filter(item => {
        return (
          item.title.toLowerCase().includes(q) ||
          (item.hebrewTitle && item.hebrewTitle.includes(q)) ||
          item.contentSnippet.toLowerCase().includes(q) ||
          item.tags.some(t => q.includes(t)) ||
          intent?.primaryCategory === 'TORAH_PARASHAH'
        );
      })
      .slice(0, limit);
  }

  public async getSourcesByCategory(category: KnowledgeCategory): Promise<KnowledgeSource[]> {
    return this.sources.filter(s => s.category === category);
  }
}
