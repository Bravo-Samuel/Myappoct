import { IKnowledgeProvider, KnowledgeSource, DetectedIntent, KnowledgeCategory } from './IKnowledgeProvider';
import { HebrewCalendarService } from '../../data/HebrewCalendarService';
import { getProductionKnowledgeSourcesByCategory } from '../../../data/knowledge';

export class CalendarKnowledgeProvider implements IKnowledgeProvider {
  public getProviderId(): string {
    return 'PROVIDER_CALENDAR_ZMANIM';
  }

  public getProviderName(): string {
    return 'Platform Hebrew Calendar & Zmanim Engine';
  }

  public async search(query: string, intent?: DetectedIntent, limit: number = 4): Promise<KnowledgeSource[]> {
    const q = query.toLowerCase();
    const isCalendarQuery =
      intent?.requiresCalendarCalculation ||
      q.includes('date') ||
      q.includes('omer') ||
      q.includes('parashah') ||
      q.includes('candle') ||
      q.includes('shabbat') ||
      q.includes('time') ||
      q.includes('today');

    if (!isCalendarQuery && !q.includes('calendar')) {
      return [];
    }

    const now = new Date();
    const isIsrael = q.includes('israel') || q.includes('galil') || q.includes('jerusalem');
    const hebrewDate = HebrewCalendarService.getHebrewDateInfo(now, isIsrael);
    const parashah = HebrewCalendarService.getParashatHaShavua(now, isIsrael);

    const sources: KnowledgeSource[] = [
      {
        id: `cal-today-${now.toISOString().split('T')[0]}`,
        title: `Verified Today's Calendar Date (${hebrewDate.gregorianFormatted})`,
        hebrewTitle: hebrewDate.hebrewDateFormattedHe,
        category: 'CALENDAR_FACT',
        citation: 'Platform Astronomical Hebrew Calendar Engine v2.4',
        contentSnippet: `Today is ${hebrewDate.hebrewDateFormattedEn} (${hebrewDate.hebrewDateFormattedHe}). Gregorian date: ${hebrewDate.gregorianFormatted}. Season: Month of ${hebrewDate.hebrewMonthNameEn}.`,
        tags: ['date', 'today', 'hebrew calendar', 'month', 'current']
      },
      {
        id: `cal-parashah-${parashah.nameEn.toLowerCase()}`,
        title: `This Week's Parashat HaShavua: ${parashah.nameEn}`,
        hebrewTitle: parashah.nameHe,
        category: 'CALENDAR_FACT',
        citation: 'Weekly Torah Reading Cycle (Bnei Menashe / Sefardi Rite)',
        contentSnippet: `The Torah portion assigned for reading this Shabbat across all community synagogues is Parashat ${parashah.nameEn} (${parashah.nameHe}).`,
        tags: ['parashah', 'portion', 'reading', 'shabbat', 'torah']
      }
    ];

    if (hebrewDate.omer) {
      sources.push({
        id: `cal-omer-live`,
        title: `Active Sefirat HaOmer Status: Day ${hebrewDate.omer.dayNumber}`,
        hebrewTitle: 'ספירת העומר',
        category: 'CALENDAR_FACT',
        citation: 'Leviticus 23:15; Platform Omer Tracker',
        contentSnippet: `Today corresponds to ${hebrewDate.omer.countStringEn}. Each evening after stars emerge (Tzeit HaKochavim), the community counts with a blessing.`,
        tags: ['omer', 'count', 'sefirat haomer', 'calendar']
      });
    }

    sources.push({
      id: 'cal-zmanim-rule-hills',
      title: 'Candle Lighting Rule for Hilly Terrain (Manipur & Mizoram)',
      hebrewTitle: 'זמני הדלקת נרות בהרים',
      category: 'CALENDAR_FACT',
      citation: 'Shulchan Aruch O.C. 261:2; Bnei Menashe Regional Calendar Standard',
      contentSnippet: `For Churachandpur, Kangpokpi, and Aizawl, visual horizon shadows occur earlier due to surrounding mountain ridges. Candle lighting is calculated strictly at 18 minutes before true astronomical sunset (Shkiah). Always check the platform's Zmanim Dashboard for minute-accurate GPS times.`,
      tags: ['candle lighting', 'shabbat', 'manipur', 'mizoram', 'sunset', 'zmanim']
    });

    sources.push(...getProductionKnowledgeSourcesByCategory('CALENDAR_FACT'));

    return sources.slice(0, limit);
  }

  public async getSourcesByCategory(category: KnowledgeCategory): Promise<KnowledgeSource[]> {
    if (category !== 'CALENDAR_FACT') return [];
    return this.search('today date candle parashah omer');
  }
}
