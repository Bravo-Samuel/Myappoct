import { IKnowledgeProvider, KnowledgeSource, DetectedIntent, KnowledgeCategory } from './IKnowledgeProvider';
import { getProductionKnowledgeSourcesByCategory } from '../../../data/knowledge';

export class HolidayKnowledgeProvider implements IKnowledgeProvider {
  private sources: KnowledgeSource[] = [
    ...getProductionKnowledgeSourcesByCategory('HOLIDAY_FESTIVAL'),
    {
      id: 'hol-tisha-bav',
      title: 'Laws and Meaning of Tisha B\'Av',
      hebrewTitle: 'הלכות ומנהגי תשעה באב',
      category: 'HOLIDAY_FESTIVAL',
      citation: 'Shulchan Aruch O.C. 550-559; Megillat Eicha',
      contentSnippet: `Tisha B'Av (the 9th of Av) commemorates the destruction of the First and Second Holy Temples and the start of tribal dispersion. It is observed as a full 25-hour fast involving five abstentions: food/drink, leather footwear, bathing, anointing, and marital relations. Synagogues chant Megillat Eicha while seated on low stools in subdued lighting.`,
      tags: ['tisha bav', 'fasting', 'temple', 'eicha', 'mourning', 'three weeks', 'tammuz', 'av']
    },
    {
      id: 'hol-shabbat-malka',
      title: 'Shabbat HaMalka: The Sabbath Queen',
      hebrewTitle: 'שבת המלכה ומנוחת הנפש',
      category: 'HOLIDAY_FESTIVAL',
      citation: 'Exodus 20:8; Sefer HaChinuch 32',
      contentSnippet: `Shabbat is the weekly holy sanctuary in time. By refraining from creative labor (Melachah) and gathering for Kabbalat Shabbat melodies, Kiddush, and family meals, community members receive the Neshamah Yeteirah (the elevated Sabbath soul).`,
      tags: ['shabbat', 'kiddush', 'rest', 'sabbath', 'challah', 'wine']
    },
    {
      id: 'hol-pesach-mimuna',
      title: 'Pesach & Bnei Menashe Spring Traditions',
      hebrewTitle: 'חג הפסח ומסורת אבות',
      category: 'HOLIDAY_FESTIVAL',
      citation: 'Exodus 12:14; Bnei Menashe Oral History',
      contentSnippet: `During Pesach, Bnei Menashe families rigorously eliminate leavened bread (Chametz) and retell the Exodus story around festive Seder tables. Ancient tribal songs preserved in Northeast India mirror biblical Passover accounts of liberation and divine protection.`,
      tags: ['pesach', 'passover', 'matzah', 'seder', 'exodus']
    },
    {
      id: 'hol-rosh-hashanah',
      title: 'Rosh Hashanah & Coronation of the King',
      hebrewTitle: 'ראש השנה ותקיעת שופר',
      category: 'HOLIDAY_FESTIVAL',
      citation: 'Leviticus 23:24; Rambam Hilchot Teshuvah',
      contentSnippet: `Rosh Hashanah marks the Day of Judgment and the anniversary of human creation. The central Mitzvah is hearing 100 blasts of the Shofar (ram's horn), awakening the soul to introspection (Teshuvah) and reaffirming God's sovereignty over all nations.`,
      tags: ['rosh hashanah', 'shofar', 'new year', 'teshuvah', 'judgment']
    }
  ];

  public getProviderId(): string {
    return 'PROVIDER_HOLIDAY_FESTIVALS';
  }

  public getProviderName(): string {
    return 'Jewish Holidays & Festival Repository';
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
          intent?.primaryCategory === 'HOLIDAY_FESTIVAL'
        );
      })
      .slice(0, limit);
  }

  public async getSourcesByCategory(category: KnowledgeCategory): Promise<KnowledgeSource[]> {
    return this.sources.filter(s => s.category === category);
  }
}
