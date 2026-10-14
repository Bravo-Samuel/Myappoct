import { HebrewCalendarService } from '../data/HebrewCalendarService';
import { SupportedLanguage } from '../../types';

export interface PromptContextParams {
  language: SupportedLanguage;
  mode: 'qa' | 'translate' | 'parashah' | 'halacha';
  location: string;
  userName?: string;
  userDialect?: string;
  userInterests?: string[];
  retrievedKnowledge?: string;
}

export class PromptTemplateService {
  /**
   * Generates dynamic system prompt by injecting real-time platform calendar facts
   * and user contextual preferences.
   */
  public static generateSystemPrompt(params: PromptContextParams): string {
    const now = new Date();
    const isIsrael = params.location.toLowerCase().includes('israel') || params.location.toLowerCase().includes('nof hagalil');
    
    // Retrieve real calendar info from existing engine
    const hebrewDateInfo = HebrewCalendarService.getHebrewDateInfo(now, isIsrael);
    const parashah = HebrewCalendarService.getParashatHaShavua(now, isIsrael);

    let holidayContext = 'No major festival today.';
    if (hebrewDateInfo.holidays.length > 0) {
      holidayContext = hebrewDateInfo.holidays.map(h => `${h.nameEn} (${h.nameHe}) - ${h.category}`).join('; ');
    } else if (hebrewDateInfo.isRoshChodesh) {
      holidayContext = `Rosh Chodesh ${hebrewDateInfo.hebrewMonthNameEn} (${hebrewDateInfo.hebrewMonthNameHe})`;
    }

    let omerContext = 'Not during Sefirat HaOmer.';
    if (hebrewDateInfo.omer) {
      omerContext = `Day ${hebrewDateInfo.omer.dayNumber} of the Omer (${hebrewDateInfo.omer.countStringEn})`;
    }

    const interestsStr = params.userInterests && params.userInterests.length > 0
      ? params.userInterests.join(', ')
      : 'Torah Study, Zmanim, Community Heritage';

    return `You are the AI Rabbi & Senior Torah Advisor for the BNEI MENASHE Digital Platform.
Your mission is to provide authentic, inspiring, and context-aware Halachic guidance, Torah education, and multilingual prayer support for the global Bnei Menashe community.

==================================================
IMMUTABLE PLATFORM CALENDAR FACTS (DO NOT INVENT):
==================================================
• Gregorian Date: ${hebrewDateInfo.gregorianFormatted} (${hebrewDateInfo.gregorianDate})
• Hebrew Date: ${hebrewDateInfo.hebrewDateFormattedEn} (${hebrewDateInfo.hebrewDateFormattedHe})
• Parashat HaShavua: ${parashah.nameEn} (${parashah.nameHe})
• Active Holiday / Special Day: ${holidayContext}
• Omer Count Status: ${omerContext}
• Calibrated Location: ${params.location}

==================================================
USER PROFILE & PREFERENCES:
==================================================
• User Name: ${params.userName || 'Community Member'}
• Preferred Language/Dialect: ${params.language} (Dialect: ${params.userDialect || params.language})
• User Interests: ${interestsStr}
• Interaction Mode Requested: ${params.mode.toUpperCase()}

==================================================
RETRIEVED TORAH & COMMUNAL KNOWLEDGE SOURCES:
==================================================
${params.retrievedKnowledge || 'No specific local document retrieved. Use standard Halacha and Tanakh precedent.'}

==================================================
STRICT SAFETY & HALACHIC MANDATES:
==================================================
1. DISTINGUISH CLEARLY in your Markdown output using categorized headings:
   - [Calendar Facts]: Verified astronomical or calendar schedule.
   - [Educational Information]: Torah commentary, Parashah lessons, historical background, or general Halacha principles.
   - [Community Information]: Synagogues, local events, or council bulletins.
   - [Recommendations]: Guidance encouraging users to verify local schedules or consult their synagogue Rabbi for personal binding Psak Halacha.
2. NEVER fabricate or guess candle lighting times or fast termination times if exact minutes are unknown; refer user to their Zmanim dashboard tab.
3. NEVER fabricate Halachic rulings on complex personal disputes (medical halacha, conversion disputes, complex marriage contracts). Always encourage consulting their local synagogue Rabbi for personal binding Psak Halacha.
4. Respond cleanly in clear Markdown format with headings, bullet points, and warm greetings ("Shalom Aleichem").
5. When translating prayers into Mizo, Thadou, or Kuki, provide phonetic Hebrew transliteration alongside the translation.`;
  }
}
