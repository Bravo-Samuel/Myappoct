/**
 * ZmanimService.ts
 * Core Halachic Time Engine orchestrator.
 * Combines high-precision AstronomyService solar math, ElevationCalculator terrain dip adjustments,
 * TimezoneResolver formatting, and HebrewCalendarService holiday/fast detection.
 */

import { AstronomyService } from './AstronomyService';
import { ElevationCalculator } from './ElevationCalculator';
import { TimezoneResolver } from './TimezoneResolver';
import { HalachicLocation } from './LocationResolver';
import { HebrewCalendarService } from '../data/HebrewCalendarService';

export interface ZmanDetail {
  key: string;
  label: string;
  hebrewLabel: string;
  timeDate: Date;
  formattedTime: string;
  category: 'DAWN' | 'MORNING' | 'SHEMA_TEFILLAH' | 'MIDDAY' | 'AFTERNOON' | 'EVENING' | 'SHABBAT_FAST';
  description: string;
  isKeyEvent?: boolean;
}

export interface DailyZmanimSchedule {
  dateStr: string;
  locationName: string;
  timeZone: string;
  elevationMeters: number;
  hebrewDateSummary: string;
  isShabbatOrYomTov: boolean;
  isFastDay: boolean;
  fastName?: string;
  shaahZmanitGRASeconds: number;
  shaahZmanitMGASeconds: number;
  zmanim: ZmanDetail[];
  nextZman: ZmanDetail | null;
  elevationSummary: {
    dipAngleArcMinutes: string;
    timeShiftMinutesSeconds: string;
    description: string;
  };
}

export class ZmanimService {
  private static memoryCache = new Map<string, DailyZmanimSchedule>();

  /**
   * Calculate complete Halachic Zmanim schedule for a date and location
   */
  static getDailyZmanim(date: Date, location: HalachicLocation): DailyZmanimSchedule {
    // Standardize cache key
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const cacheKey = `${location.id}_${dateStr}`;

    // Check memory cache
    if (this.memoryCache.has(cacheKey)) {
      const cached = this.memoryCache.get(cacheKey)!;
      return this.enrichWithLiveCountdown(cached);
    }

    // Check localStorage cache
    try {
      const localStr = localStorage.getItem(`ZMANIM_CACHE_${cacheKey}`);
      if (localStr) {
        const parsed = JSON.parse(localStr);
        // Revive Date objects
        parsed.zmanim.forEach((z: any) => { z.timeDate = new Date(z.timeDate); });
        if (parsed.nextZman) parsed.nextZman.timeDate = new Date(parsed.nextZman.timeDate);
        this.memoryCache.set(cacheKey, parsed);
        return this.enrichWithLiveCountdown(parsed);
      }
    } catch {
      // ignore storage errors
    }

    // 1. Calculate base solar times at sea level
    const solarTimes = AstronomyService.getSolarTimes(date, location.latitude, location.longitude);

    // 2. Apply elevation adjustments
    const netzHaChamah = ElevationCalculator.adjustSunriseForElevation(
      solarTimes.sunriseSeaLevel,
      location.elevationMeters,
      location.latitude
    );
    const shkiah = ElevationCalculator.adjustSunsetForElevation(
      solarTimes.sunsetSeaLevel,
      location.elevationMeters,
      location.latitude
    );

    const alotHaShachar = solarTimes.dawn16_1;
    const misheyakir = solarTimes.misheyakir10_2;
    const chatzot = solarTimes.solarNoon;
    const tzeitHaKochavim = solarTimes.nightfall8_5;

    // 3. Calculate Sha'ah Zmanit (Proportional Halachic Hour)
    // GRA: Day length from Netz to Shkiah divided by 12
    const dayLengthGRA = shkiah.getTime() - netzHaChamah.getTime();
    const shaahGRA = dayLengthGRA / 12;

    // MGA: Day length from Alot to Tzeit divided by 12
    const dayLengthMGA = tzeitHaKochavim.getTime() - alotHaShachar.getTime();
    const shaahMGA = dayLengthMGA / 12;

    // 4. Derive Sof Zman Shema & Tefillah
    // Shema GRA: Netz + 3 Sha'ot GRA
    const sofZmanShemaGRA = new Date(netzHaChamah.getTime() + 3 * shaahGRA);
    // Shema MGA: Alot + 3 Sha'ot MGA
    const sofZmanShemaMGA = new Date(alotHaShachar.getTime() + 3 * shaahMGA);

    // Tefillah GRA: Netz + 4 Sha'ot GRA
    const sofZmanTefillahGRA = new Date(netzHaChamah.getTime() + 4 * shaahGRA);
    // Tefillah MGA: Alot + 4 Sha'ot MGA
    const sofZmanTefillahMGA = new Date(alotHaShachar.getTime() + 4 * shaahMGA);

    // 5. Derive Mincha & Plag
    // Mincha Gedolah: 6.5 Sha'ot GRA after Netz
    const minchaGedolah = new Date(netzHaChamah.getTime() + 6.5 * shaahGRA);
    // Mincha Ketanah: 9.5 Sha'ot GRA after Netz
    const minchaKetanah = new Date(netzHaChamah.getTime() + 9.5 * shaahGRA);
    // Plag HaMincha: 10.75 Sha'ot GRA after Netz (1.25 Sha'ot before Shkiah)
    const plagHaMincha = new Date(netzHaChamah.getTime() + 10.75 * shaahGRA);

    // 6. Candle Lighting & Havdalah
    const candleMinutes = location.candleLightingCustomMinutes || 18;
    const candleLighting = new Date(shkiah.getTime() - candleMinutes * 60 * 1000);
    // Havdalah: Tzeit + 3 min buffer or 42 minutes after Shkiah
    const havdalah = new Date(Math.max(tzeitHaKochavim.getTime(), shkiah.getTime() + 42 * 60 * 1000));

    // 7. Check Hebrew calendar date info
    const hebrewInfo = HebrewCalendarService.getHebrewDateInfo(date, location.country === 'Israel');
    const isShabbat = hebrewInfo.isShabbat;
    const fastHoliday = hebrewInfo.holidays.find(h => h.category === 'FAST_DAY');
    const isFastDay = !!fastHoliday;
    const fastName = fastHoliday ? fastHoliday.nameEn : undefined;

    // Fast Begin / End
    const isMajorFast = fastName && (fastName.includes("Tisha B'Av") || fastName.includes('Yom Kippur'));
    const fastBegin = isMajorFast
      ? new Date(shkiah.getTime() - 24 * 3600 * 1000) // sunset of previous day roughly
      : alotHaShachar;
    const fastEnd = tzeitHaKochavim;

    const formatTz = (dt: Date) => TimezoneResolver.formatInTimezone(dt, location.timeZone);

    const zmanimList: ZmanDetail[] = [
      {
        key: 'alot',
        label: 'Alot HaShachar (Dawn)',
        hebrewLabel: 'עלות השחר',
        timeDate: alotHaShachar,
        formattedTime: formatTz(alotHaShachar),
        category: 'DAWN',
        description: 'First rays of solar illumination (16.1° below eastern horizon).'
      },
      {
        key: 'misheyakir',
        label: 'Misheyakir (Tallit & Tefillin)',
        hebrewLabel: 'משיכיר (ציצית ותפילין)',
        timeDate: misheyakir,
        formattedTime: formatTz(misheyakir),
        category: 'MORNING',
        description: 'Earliest time when blue and white tzitzit threads can be distinguished (10.2°).'
      },
      {
        key: 'sunrise',
        label: 'Netz HaChamah (Sunrise)',
        hebrewLabel: 'הנץ החמה',
        timeDate: netzHaChamah,
        formattedTime: formatTz(netzHaChamah),
        category: 'MORNING',
        isKeyEvent: true,
        description: `Visible solar disk emergence calibrated for ${location.elevationMeters}m elevation.`
      },
      {
        key: 'shema_mga',
        label: 'Sof Zman Shema (MGA)',
        hebrewLabel: 'סוף זמן שמע (מג״א)',
        timeDate: sofZmanShemaMGA,
        formattedTime: formatTz(sofZmanShemaMGA),
        category: 'SHEMA_TEFILLAH',
        description: 'Latest Shema according to Magen Avraham (3 Sha\'ot calculated from Alot to Tzeit).'
      },
      {
        key: 'shema_gra',
        label: 'Sof Zman Shema (GRA)',
        hebrewLabel: 'סוף זמן שמע (גר״א)',
        timeDate: sofZmanShemaGRA,
        formattedTime: formatTz(sofZmanShemaGRA),
        category: 'SHEMA_TEFILLAH',
        isKeyEvent: true,
        description: 'Latest Shema according to Vilna Gaon (3 Sha\'ot calculated from Netz to Shkiah).'
      },
      {
        key: 'tefillah_mga',
        label: 'Sof Zman Tefillah (MGA)',
        hebrewLabel: 'סוף זמן תפילה (מג״א)',
        timeDate: sofZmanTefillahMGA,
        formattedTime: formatTz(sofZmanTefillahMGA),
        category: 'SHEMA_TEFILLAH',
        description: 'Latest morning Shacharit Amidah according to Magen Avraham.'
      },
      {
        key: 'tefillah_gra',
        label: 'Sof Zman Tefillah (GRA)',
        hebrewLabel: 'סוף זמן תפילה (גר״א)',
        timeDate: sofZmanTefillahGRA,
        formattedTime: formatTz(sofZmanTefillahGRA),
        category: 'SHEMA_TEFILLAH',
        description: 'Latest morning Shacharit Amidah according to Vilna Gaon (4 Sha\'ot).'
      },
      {
        key: 'chatzot',
        label: 'Chatzot HaYom (Midday)',
        hebrewLabel: 'חצות היום',
        timeDate: chatzot,
        formattedTime: formatTz(chatzot),
        category: 'MIDDAY',
        description: 'Exact solar meridian transit (Halachic noon).'
      },
      {
        key: 'mincha_g',
        label: 'Mincha Gedolah',
        hebrewLabel: 'מנחה גדולה',
        timeDate: minchaGedolah,
        formattedTime: formatTz(minchaGedolah),
        category: 'AFTERNOON',
        description: 'Earliest time for afternoon Mincha prayer (6.5 Sha\'ot).'
      },
      {
        key: 'mincha_k',
        label: 'Mincha Ketanah',
        hebrewLabel: 'מנחה קטנה',
        timeDate: minchaKetanah,
        formattedTime: formatTz(minchaKetanah),
        category: 'AFTERNOON',
        description: 'Preferred afternoon Mincha time (9.5 Sha\'ot).'
      },
      {
        key: 'plag',
        label: 'Plag HaMincha',
        hebrewLabel: 'פלג המנחה',
        timeDate: plagHaMincha,
        formattedTime: formatTz(plagHaMincha),
        category: 'AFTERNOON',
        description: 'One and a quarter Halachic hours before sunset.'
      },
      {
        key: 'sunset',
        label: 'Shkiah (Sunset)',
        hebrewLabel: 'שקיעת החמה',
        timeDate: shkiah,
        formattedTime: formatTz(shkiah),
        category: 'EVENING',
        isKeyEvent: true,
        description: `Solar disk disappearance below horizon at ${location.elevationMeters}m elevation.`
      },
      {
        key: 'nightfall',
        label: 'Tzeit HaKochavim (Nightfall)',
        hebrewLabel: 'צאת הכוכבים',
        timeDate: tzeitHaKochavim,
        formattedTime: formatTz(tzeitHaKochavim),
        category: 'EVENING',
        isKeyEvent: true,
        description: 'Emergence of 3 medium stars (8.5° solar depression below western horizon).'
      }
    ];

    // Add Candle Lighting on Friday or Yom Tov Eve
    if (date.getDay() === 5 || hebrewInfo.holidays.some(h => h.nameEn.includes('Erev'))) {
      zmanimList.splice(11, 0, {
        key: 'candle',
        label: `Candle Lighting (${candleMinutes} min)`,
        hebrewLabel: 'הדלקת נרות',
        timeDate: candleLighting,
        formattedTime: formatTz(candleLighting),
        category: 'SHABBAT_FAST',
        isKeyEvent: true,
        description: `${candleMinutes} minutes before Shkiah according to local custom.`
      });
    }

    // Add Havdalah on Saturday evening or Yom Tov conclusion
    if (date.getDay() === 6) {
      zmanimList.push({
        key: 'havdalah',
        label: 'Havdalah (Shabbat End)',
        hebrewLabel: 'הבדילה מוצאי שבת',
        timeDate: havdalah,
        formattedTime: formatTz(havdalah),
        category: 'SHABBAT_FAST',
        isKeyEvent: true,
        description: 'Conclusion of Shabbat (appearance of 3 small stars / 42 min after Shkiah).'
      });
    }

    // Add Fast Begin / End if today is a Fast Day
    if (isFastDay) {
      zmanimList.unshift({
        key: 'fast_begin',
        label: `Fast Begins (${fastName})`,
        hebrewLabel: 'תחילת הצום',
        timeDate: fastBegin,
        formattedTime: formatTz(fastBegin),
        category: 'SHABBAT_FAST',
        isKeyEvent: true,
        description: `Commencement of ${fastName} prohibition.`
      });

      zmanimList.push({
        key: 'fast_end',
        label: `Fast Ends (${fastName})`,
        hebrewLabel: 'סיום הצום',
        timeDate: fastEnd,
        formattedTime: formatTz(fastEnd),
        category: 'SHABBAT_FAST',
        isKeyEvent: true,
        description: `Conclusion of ${fastName} upon Tzeit HaKochavim.`
      });
    }

    // Sort strictly by timestamp
    zmanimList.sort((a, b) => a.timeDate.getTime() - b.timeDate.getTime());

    const elevationSummary = ElevationCalculator.getElevationSummary(location.elevationMeters, location.latitude);

    const schedule: DailyZmanimSchedule = {
      dateStr,
      locationName: location.name,
      timeZone: location.timeZone,
      elevationMeters: location.elevationMeters,
      hebrewDateSummary: `${hebrewInfo.hebrewDateFormattedEn} (${hebrewInfo.hebrewDateFormattedHe})`,
      isShabbatOrYomTov: isShabbat || hebrewInfo.holidays.some(h => h.category === 'MAJOR_HOLIDAY'),
      isFastDay,
      fastName,
      shaahZmanitGRASeconds: Math.round(shaahGRA / 1000),
      shaahZmanitMGASeconds: Math.round(shaahMGA / 1000),
      zmanim: zmanimList,
      nextZman: null,
      elevationSummary
    };

    // Store in cache
    this.memoryCache.set(cacheKey, schedule);
    try {
      localStorage.setItem(`ZMANIM_CACHE_${cacheKey}`, JSON.stringify(schedule));
    } catch {
      // ignore
    }

    return this.enrichWithLiveCountdown(schedule);
  }

  /**
   * Determine next upcoming zman relative to current browser time
   */
  private static enrichWithLiveCountdown(schedule: DailyZmanimSchedule): DailyZmanimSchedule {
    const now = new Date().getTime();
    const next = schedule.zmanim.find(z => z.timeDate.getTime() > now);

    return {
      ...schedule,
      nextZman: next || null
    };
  }

  /**
   * Get tomorrow's preview schedule
   */
  static getTomorrowZmanim(location: HalachicLocation): DailyZmanimSchedule {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.getDailyZmanim(tomorrow, location);
  }

  /**
   * Get 7-day weekly schedule matrix
   */
  static getWeeklySchedule(startDate: Date, location: HalachicLocation): DailyZmanimSchedule[] {
    const week: DailyZmanimSchedule[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      week.push(this.getDailyZmanim(d, location));
    }
    return week;
  }

  /**
   * Get monthly schedule grid for current month
   */
  static getMonthlySchedule(year: number, month0: number, location: HalachicLocation): DailyZmanimSchedule[] {
    const daysInMonth = new Date(year, month0 + 1, 0).getDate();
    const monthSchedule: DailyZmanimSchedule[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month0, d);
      monthSchedule.push(this.getDailyZmanim(date, location));
    }
    return monthSchedule;
  }
}
