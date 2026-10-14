import { IKnowledgeProvider, KnowledgeSource, DetectedIntent, KnowledgeCategory } from './IKnowledgeProvider';
import { getProductionKnowledgeSourcesByCategory } from '../../../data/knowledge';

export class CommunityKnowledgeProvider implements IKnowledgeProvider {
  private sources: KnowledgeSource[] = [
    ...getProductionKnowledgeSourcesByCategory('COMMUNITY_INFO'),
    {
      id: 'com-synagogue-churachandpur',
      title: 'Beith Shalom Synagogue & Community Center (Churachandpur)',
      hebrewTitle: 'בית כנסת בית שלום - צ\'וראצ\'אנדפור',
      category: 'COMMUNITY_INFO',
      citation: 'Bnei Menashe Synagogue Directory - Manipur',
      contentSnippet: `Beith Shalom is the central community hub in Churachandpur, Manipur. Daily Shacharit minyan begins promptly at 5:45 AM. Shabbat services include youth Hebrew chorales, Parashah study classes, and community Kiddush.`,
      tags: ['synagogue', 'churachandpur', 'manipur', 'minyan', 'beith shalom', 'services']
    },
    {
      id: 'com-synagogue-aizawl',
      title: 'Shalom Synagogue & Cultural Center (Aizawl)',
      hebrewTitle: 'בית כנסת שלום - אייזול מיזורם',
      category: 'COMMUNITY_INFO',
      citation: 'Bnei Menashe Synagogue Directory - Mizoram',
      contentSnippet: `Located in Aizawl, Mizoram, Shalom Synagogue hosts weekly Shabbat gatherings, children's Hebrew school on Sunday mornings, and pre-Aliyah Hebrew language workshops.`,
      tags: ['synagogue', 'aizawl', 'mizoram', 'hebrew school', 'workshop']
    },
    {
      id: 'com-synagogue-nof-hagalil',
      title: 'Kehillat Bnei Menashe (Nof HaGalil & Kiryat Arba, Israel)',
      hebrewTitle: 'קהילת בני מנשה - נוף הגליל וקריית ארבע',
      category: 'COMMUNITY_INFO',
      citation: 'Israel Absorption Registry - Kehillat Bnei Menashe',
      contentSnippet: `In Israel, flourishing Bnei Menashe congregations in Nof HaGalil, Kiryat Arba, and Sderot provide integrated Sefardi liturgy, youth leadership programs, and rabbinic counseling in Hebrew, Mizo, and Kuki.`,
      tags: ['nof hagalil', 'kiryat arba', 'israel', 'synagogue', 'aliyah', 'absorption']
    },
    {
      id: 'com-council-announcement',
      title: 'Regional Council Announcement: Aliyah Prep & Hebrew Bootcamps',
      hebrewTitle: 'הודעת מועצת הקהילה - הכנה לעלייה',
      category: 'COMMUNITY_INFO',
      citation: 'Bnei Menashe Council Official Bulletin',
      contentSnippet: `The Regional Council announces upcoming online conversational Hebrew bootcamps and Torah heritage seminars designed to support families preparing for upcoming Aliyah flights. Registration is open via the Community Sanctuary tab.`,
      tags: ['council', 'announcement', 'aliyah', 'hebrew', 'seminar', 'events']
    }
  ];

  public getProviderId(): string {
    return 'PROVIDER_COMMUNITY_DIRECTORY';
  }

  public getProviderName(): string {
    return 'Bnei Menashe Community & Synagogue Directory';
  }

  public async search(query: string, intent?: DetectedIntent, limit: number = 4): Promise<KnowledgeSource[]> {
    const q = query.toLowerCase();
    const isCommunityQuery =
      intent?.requiresCommunityData ||
      q.includes('synagogue') ||
      q.includes('shul') ||
      q.includes('minyan') ||
      q.includes('churachandpur') ||
      q.includes('aizawl') ||
      q.includes('manipur') ||
      q.includes('mizoram') ||
      q.includes('council') ||
      q.includes('event') ||
      q.includes('announcement') ||
      q.includes('nof hagalil');

    if (!isCommunityQuery && intent?.primaryCategory !== 'COMMUNITY_INFO') {
      return [];
    }

    return this.sources
      .filter(item => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.contentSnippet.toLowerCase().includes(q) ||
          item.tags.some(t => q.includes(t)) ||
          isCommunityQuery
        );
      })
      .slice(0, limit);
  }

  public async getSourcesByCategory(category: KnowledgeCategory): Promise<KnowledgeSource[]> {
    return this.sources.filter(s => s.category === category);
  }
}
