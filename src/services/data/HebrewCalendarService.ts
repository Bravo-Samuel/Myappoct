import {
  HDate,
  HebrewCalendar,
  Sedra,
  ParshaEvent,
  Locale,
  gematriya,
  flags
} from '@hebcal/core';
import { getLeyningForParshaHaShavua } from '@hebcal/leyning';

export interface AliyahReading {
  aliyah: string; // '1'..'7', 'M'
  book: string;
  verses: string;
  verseCount: number;
}

export interface TorahReadingSchedule {
  parashahNameEn: string;
  parashahNameHe: string;
  summary: string;
  aliyot: AliyahReading[];
  haftarah: string;
}

export interface HolidayBadge {
  nameEn: string;
  nameHe: string;
  category: 'MAJOR_HOLIDAY' | 'MINOR_HOLIDAY' | 'FAST_DAY' | 'ROSH_CHODESH' | 'SPECIAL_SHABBAT' | 'OMER' | 'OTHER';
  flags: number;
}

export interface OmerDetails {
  dayNumber: number; // 1..49
  countStringEn: string;
  countStringHe: string;
  weeks: number;
  days: number;
  sefirahEn?: string;
  sefirahHe?: string;
}

export interface HebrewDateInfo {
  gregorianDate: string; // YYYY-MM-DD
  gregorianFormatted: string;
  hebrewYear: number;
  hebrewMonth: number;
  hebrewMonthNameEn: string;
  hebrewMonthNameHe: string;
  hebrewDay: number;
  hebrewDayHe: string; // e.g. ט״ז
  hebrewDateFormattedEn: string;
  hebrewDateFormattedHe: string;
  isLeapYear: boolean;
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  dayOfWeekNameEn: string;
  dayOfWeekNameHe: string;
  isShabbat: boolean;
  isRoshChodesh: boolean;
  roshChodeshDetails?: {
    monthNameEn: string;
    monthNameHe: string;
  };
  omer?: OmerDetails;
  parashah?: {
    nameEn: string;
    nameHe: string;
    summary?: string;
    haftarah?: string;
  };
  holidays: HolidayBadge[];
  torahReadingSchedule?: TorahReadingSchedule;
}

export interface YahrzeitInstanceInfo {
  hebrewDateEn: string;
  hebrewDateHe: string;
  gregorianDateFormatted: string;
  gregorianDateIso: string;
  hebrewYear: number;
}

export interface YahrzeitCalculationResult {
  origGregorianDate: string; // YYYY-MM-DD
  origGregorianFormatted: string;
  origHebrewDateEn: string;
  origHebrewDateHe: string;
  origHebrewYear: number;
  afterSunset: boolean;
  isLeapYearPassing: boolean;
  isTodayYahrzeit: boolean;
  daysRemaining: number;
  previousYahrzeit: YahrzeitInstanceInfo;
  currentYearYahrzeit: YahrzeitInstanceInfo;
  nextYahrzeit: YahrzeitInstanceInfo;
  parashahOfPassing?: {
    nameEn: string;
    nameHe: string;
  };
  halachicNotes: string[];
}

const KABBALISTIC_SEFIROT: Record<number, { en: string; he: string }> = {
  1: { en: 'Chesed shebeChesed (Loving-kindness in Loving-kindness)', he: 'חֶסֶד שֶׁבְּחֶסֶד' },
  2: { en: 'Gevurah shebeChesed (Discipline in Loving-kindness)', he: 'גְּבוּרָה שֶׁבְּחֶסֶד' },
  3: { en: 'Tiferet shebeChesed (Compassion in Loving-kindness)', he: 'תִּפְאֶרֶת שֶׁבְּחֶסֶד' },
  4: { en: 'Netzach shebeChesed (Endurance in Loving-kindness)', he: 'נֵצַח שֶׁבְּחֶסֶד' },
  5: { en: 'Hod shebeChesed (Humility in Loving-kindness)', he: 'הוֹד שֶׁבְּחֶסֶד' },
  6: { en: 'Yesod shebeChesed (Bonding in Loving-kindness)', he: 'יְסוֹד שֶׁבְּחֶסֶד' },
  7: { en: 'Malchut shebeChesed (Nobility in Loving-kindness)', he: 'מַלְכוּת שֶׁבְּחֶסֶד' },
  8: { en: 'Chesed shebeGevurah (Loving-kindness in Discipline)', he: 'חֶסֶד שֶׁבִּגְבוּרָה' },
  9: { en: 'Gevurah shebeGevurah (Discipline in Discipline)', he: 'גְּבוּרָה שֶׁבִּגְבוּרָה' },
  10: { en: 'Tiferet shebeGevurah (Compassion in Discipline)', he: 'תִּפְאֶרֶת שֶׁבִּגְבוּרָה' },
  11: { en: 'Netzach shebeGevurah (Endurance in Discipline)', he: 'נֵצַח שֶׁבִּגְבוּרָה' },
  12: { en: 'Hod shebeGevurah (Humility in Discipline)', he: 'הוֹד שֶׁבִּגְבוּרָה' },
  13: { en: 'Yesod shebeGevurah (Bonding in Discipline)', he: 'יְסוֹד שֶׁבִּגְבוּרָה' },
  14: { en: 'Malchut shebeGevurah (Nobility in Discipline)', he: 'מַלְכוּת שֶׁבִּגְבוּרָה' },
  15: { en: 'Chesed shebeTiferet (Loving-kindness in Compassion)', he: 'חֶסֶד שֶׁבְּתִפְאֶרֶת' },
  16: { en: 'Gevurah shebeTiferet (Discipline in Compassion)', he: 'גְּבוּרָה שֶׁבְּתִפְאֶרֶת' },
  17: { en: 'Tiferet shebeTiferet (Compassion in Compassion)', he: 'תִּפְאֶרֶת שֶׁבְּתִפְאֶרֶת' },
  18: { en: 'Netzach shebeTiferet (Endurance in Compassion)', he: 'נֵצַח שֶׁבְּתִפְאֶרֶת' },
  19: { en: 'Hod shebeTiferet (Humility in Compassion)', he: 'הוֹד שֶׁבְּתִפְאֶרֶת' },
  20: { en: 'Yesod shebeTiferet (Bonding in Compassion)', he: 'יְסוֹד שֶׁבְּתִפְאֶרֶת' },
  21: { en: 'Malchut shebeTiferet (Nobility in Compassion)', he: 'מַלְכוּת שֶׁבְּתִפְאֶרֶת' },
  22: { en: 'Chesed shebeNetzach (Loving-kindness in Endurance)', he: 'חֶסֶד שֶׁבְּנֵצַח' },
  23: { en: 'Gevurah shebeNetzach (Discipline in Endurance)', he: 'גְּבוּרָה שֶׁבְּנֵצַח' },
  24: { en: 'Tiferet shebeNetzach (Compassion in Endurance)', he: 'תִּפְאֶרֶת שֶׁבְּנֵצַח' },
  25: { en: 'Netzach shebeNetzach (Endurance in Endurance)', he: 'נֵצַח שֶׁבְּנֵצַח' },
  26: { en: 'Hod shebeNetzach (Humility in Endurance)', he: 'הוֹד שֶׁבְּנֵצַח' },
  27: { en: 'Yesod shebeNetzach (Bonding in Endurance)', he: 'יְסוֹד שֶׁבְּנֵצַח' },
  28: { en: 'Malchut shebeNetzach (Nobility in Endurance)', he: 'מַלְכוּת שֶׁבְּנֵצַח' },
  29: { en: 'Chesed shebeHod (Loving-kindness in Humility)', he: 'חֶסֶד שֶׁבְּהוֹד' },
  30: { en: 'Gevurah shebeHod (Discipline in Humility)', he: 'גְּבוּרָה שֶׁבְּהוֹד' },
  31: { en: 'Tiferet shebeHod (Compassion in Humility)', he: 'תִּפְאֶרֶת שֶׁבְּהוֹד' },
  32: { en: 'Netzach shebeHod (Endurance in Humility)', he: 'נֵצַח שֶׁבְּהוֹד' },
  33: { en: 'Hod shebeHod (Humility in Humility — Lag BaOmer)', he: 'הוֹד שֶׁבְּהוֹד' },
  34: { en: 'Yesod shebeHod (Bonding in Humility)', he: 'יְסוֹד שֶׁבְּהוֹד' },
  35: { en: 'Malchut shebeHod (Nobility in Humility)', he: 'מַלְכוּת שֶׁבְּהוֹד' },
  36: { en: 'Chesed shebeYesod (Loving-kindness in Bonding)', he: 'חֶסֶד שֶׁבִּיסוֹד' },
  37: { en: 'Gevurah shebeYesod (Discipline in Bonding)', he: 'גְּבוּרָה שֶׁבִּיסוֹד' },
  38: { en: 'Tiferet shebeYesod (Compassion in Bonding)', he: 'תִּפְאֶרֶת שֶׁבִּיסוֹד' },
  39: { en: 'Netzach shebeYesod (Endurance in Bonding)', he: 'נֵצַח שֶׁבִּיסוֹד' },
  40: { en: 'Hod shebeYesod (Humility in Bonding)', he: 'הוֹד שֶׁבִּיסוֹד' },
  41: { en: 'Yesod shebeYesod (Bonding in Bonding)', he: 'יְסוֹד שֶׁבִּיסוֹד' },
  42: { en: 'Malchut shebeYesod (Nobility in Bonding)', he: 'מַלְכוּת שֶׁבִּיסוֹד' },
  43: { en: 'Chesed shebeMalchut (Loving-kindness in Nobility)', he: 'חֶסֶד שֶׁבְּמַלְכוּת' },
  44: { en: 'Gevurah shebeMalchut (Discipline in Nobility)', he: 'גְּבוּרָה שֶׁבְּמַלְכוּת' },
  45: { en: 'Tiferet shebeMalchut (Compassion in Nobility)', he: 'תִּפְאֶרֶת שֶׁבְּמַלְכוּת' },
  46: { en: 'Netzach shebeMalchut (Endurance in Nobility)', he: 'נֵצַח שֶׁבְּמַלְכוּת' },
  47: { en: 'Hod shebeMalchut (Humility in Nobility)', he: 'הוֹד שֶׁבְּמַלְכוּת' },
  48: { en: 'Yesod shebeMalchut (Bonding in Nobility)', he: 'יְסוֹד שֶׁבְּמַלְכוּת' },
  49: { en: 'Malchut shebeMalchut (Nobility in Nobility)', he: 'מַלְכוּת שֶׁבְּמַלְכוּת' },
};

export class HebrewCalendarService {
  /**
   * Calculate comprehensive Hebrew date information for any Gregorian Date
   */
  static getHebrewDateInfo(inputDate: Date = new Date(), il: boolean = false): HebrewDateInfo {
    const hDate = new HDate(inputDate);
    const year = hDate.getFullYear();
    const month = hDate.getMonth();
    const day = hDate.getDate();
    const isLeapYear = hDate.isLeapYear();
    const dayOfWeek = inputDate.getDay();

    const monthNameEn = hDate.getMonthName();
    const monthNameHe = Locale.gettext(monthNameEn, 'he');

    const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Shabbat'];
    const dayNamesHe = ['יוֹם רִאשׁוֹן', 'יוֹם שֵׁנִי', 'יוֹם שְׁלִישִׁי', 'יוֹם רְבִיעִי', 'יוֹם חֲמִישִׁי', 'יוֹם שִׁשִּׁי', 'שַׁבָּת'];

    const gregorianStr = inputDate.toISOString().split('T')[0];
    const gregorianFormatted = inputDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get events on this date (including Omer counts and holidays)
    const events = HebrewCalendar.calendar({
      start: inputDate,
      end: inputDate,
      il,
      omer: true
    }) || [];
    const holidays: HolidayBadge[] = [];
    let isRoshChodesh = false;
    let roshChodeshDetails: { monthNameEn: string; monthNameHe: string } | undefined = undefined;
    let omer: OmerDetails | undefined = undefined;
    let parashah: { nameEn: string; nameHe: string; summary?: string; haftarah?: string } | undefined = undefined;
    let torahReadingSchedule: TorahReadingSchedule | undefined = undefined;

    // Check Sedra / Parashah if Shabbat
    if (dayOfWeek === 6) {
      const sedraObj = new Sedra(year, il);
      const parshaLookup = sedraObj.lookup(hDate);
      if (parshaLookup && !parshaLookup.chag && parshaLookup.parsha && parshaLookup.parsha.length > 0) {
        const parshaNameEn = parshaLookup.parsha.join('-');
        const parshaNameHe = parshaLookup.parsha.map(p => Locale.gettext(p, 'he')).join('־');
        
        try {
          const dayEvents = HebrewCalendar.calendar({
            start: inputDate,
            end: inputDate,
            sedrot: true,
            il
          });
          const parshaEv = dayEvents.find(e => (e.getFlags() & flags.PARSHA_HASHAVUA) !== 0);
          if (parshaEv) {
            const leyning = getLeyningForParshaHaShavua(parshaEv, il);
            parashah = {
              nameEn: leyning.name?.en || parshaNameEn,
              nameHe: leyning.name?.he || parshaNameHe,
              summary: leyning.summary || '',
              haftarah: leyning.haftara || ''
            };

            if (leyning.fullkriyah) {
              const aliyotList: AliyahReading[] = [];
              for (const key of ['1', '2', '3', '4', '5', '6', '7', 'M']) {
                const a = (leyning.fullkriyah as any)[key];
                if (a) {
                  aliyotList.push({
                    aliyah: key === 'M' ? 'Maftir' : `Aliyah ${key}`,
                    book: a.k,
                    verses: `${a.b} - ${a.e}`,
                    verseCount: a.v || 0
                  });
                }
              }
              torahReadingSchedule = {
                parashahNameEn: parashah.nameEn,
                parashahNameHe: parashah.nameHe,
                summary: parashah.summary || '',
                aliyot: aliyotList,
                haftarah: parashah.haftarah || ''
              };
            }
          } else {
            parashah = {
              nameEn: parshaNameEn,
              nameHe: parshaNameHe
            };
          }
        } catch {
          parashah = {
            nameEn: parshaNameEn,
            nameHe: parshaNameHe
          };
        }
      }
    }

    for (const ev of events) {
      const evFlags = ev.getFlags();
      const descEn = ev.render('en');
      const descHe = ev.render('he');

      let category: HolidayBadge['category'] = 'OTHER';
      if (evFlags & flags.MAJOR_FAST || evFlags & flags.MINOR_FAST) {
        category = 'FAST_DAY';
      } else if (evFlags & flags.CHAG) {
        category = 'MAJOR_HOLIDAY';
      } else if (evFlags & flags.ROSH_CHODESH) {
        category = 'ROSH_CHODESH';
        isRoshChodesh = true;
        roshChodeshDetails = {
          monthNameEn: descEn.replace('Rosh Chodesh ', ''),
          monthNameHe: descHe
        };
      } else if (evFlags & flags.SPECIAL_SHABBAT) {
        category = 'SPECIAL_SHABBAT';
      } else if (evFlags & flags.OMER_COUNT) {
        category = 'OMER';
        const match = descEn.match(/(\d+)(st|nd|rd|th) day of the Omer/i);
        if (match) {
          const omerDay = parseInt(match[1], 10);
          const weeks = Math.floor(omerDay / 7);
          const remDays = omerDay % 7;
          const sef = KABBALISTIC_SEFIROT[omerDay];
          omer = {
            dayNumber: omerDay,
            countStringEn: descEn,
            countStringHe: descHe,
            weeks,
            days: remDays,
            sefirahEn: sef?.en,
            sefirahHe: sef?.he
          };
        }
      } else if (evFlags & flags.MODERN_HOLIDAY || evFlags & flags.LIGHT_CANDLES) {
        category = 'MINOR_HOLIDAY';
      }

      // Add badge unless it's just daily Omer or Sedra handled above
      if (!(evFlags & flags.OMER_COUNT) && !(evFlags & flags.PARSHA_HASHAVUA)) {
        holidays.push({
          nameEn: descEn,
          nameHe: descHe,
          category,
          flags: evFlags
        });
      }
    }

    return {
      gregorianDate: gregorianStr,
      gregorianFormatted,
      hebrewYear: year,
      hebrewMonth: month,
      hebrewMonthNameEn: monthNameEn,
      hebrewMonthNameHe: monthNameHe,
      hebrewDay: day,
      hebrewDayHe: gematriya(day),
      hebrewDateFormattedEn: hDate.render('en'),
      hebrewDateFormattedHe: hDate.render('he'),
      isLeapYear,
      dayOfWeek,
      dayOfWeekNameEn: dayNamesEn[dayOfWeek] || 'Sunday',
      dayOfWeekNameHe: dayNamesHe[dayOfWeek] || 'יוֹם רִאשׁוֹן',
      isShabbat: dayOfWeek === 6,
      isRoshChodesh,
      roshChodeshDetails,
      omer,
      parashah,
      holidays,
      torahReadingSchedule
    };
  }

  /**
   * Convert Gregorian Date to Hebrew representation
   */
  static gregorianToHebrew(date: Date = new Date()) {
    const info = this.getHebrewDateInfo(date);
    return {
      gregorian: info.gregorianDate,
      year: info.hebrewYear,
      month: info.hebrewMonth,
      monthNameEn: info.hebrewMonthNameEn,
      monthNameHe: info.hebrewMonthNameHe,
      day: info.hebrewDay,
      dayHe: info.hebrewDayHe,
      formattedEn: info.hebrewDateFormattedEn,
      formattedHe: info.hebrewDateFormattedHe
    };
  }

  /**
   * Convert Hebrew Year, Month Name/Index, and Day back to Gregorian Date
   */
  static hebrewToGregorian(year: number, month: number | string, day: number): Date {
    const hDate = new HDate(day, month as any, year);
    return hDate.greg();
  }

  /**
   * Get calendar data for an entire Gregorian Month (1-indexed month, e.g. 7 for July)
   */
  static getMonthlyCalendar(year: number, month: number, il: boolean = false): HebrewDateInfo[] {
    const results: HebrewDateInfo[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month - 1, d);
      results.push(this.getHebrewDateInfo(date, il));
    }
    return results;
  }

  /**
   * Get upcoming Jewish Holidays starting from a specific date
   */
  static getUpcomingHolidays(fromDate: Date = new Date(), count: number = 8, il: boolean = false) {
    const year = fromDate.getFullYear();
    const events = HebrewCalendar.calendar({
      start: fromDate,
      end: new Date(year + 1, fromDate.getMonth(), fromDate.getDate()),
      isHebrewYear: false,
      il
    });

    const holidayEvents = events.filter(e => {
      const f = e.getFlags();
      return (f & flags.CHAG || f & flags.MAJOR_FAST || f & flags.MINOR_FAST || f & flags.ROSH_CHODESH || f & flags.MODERN_HOLIDAY) && !(f & flags.OMER_COUNT);
    });

    return holidayEvents.slice(0, count).map(ev => {
      const d = ev.getDate().greg();
      const hDate = ev.getDate();
      const f = ev.getFlags();
      let category = 'Holiday';
      if (f & flags.MAJOR_FAST || f & flags.MINOR_FAST) category = 'Fast Day';
      else if (f & flags.ROSH_CHODESH) category = 'Rosh Chodesh';
      else if (f & flags.CHAG) category = 'Major Chag';

      return {
        gregorianDate: d.toISOString().split('T')[0],
        formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        hebrewDate: hDate.render('en'),
        nameEn: ev.render('en'),
        nameHe: ev.render('he'),
        category
      };
    });
  }

  /**
   * Get Weekly Parashah reading for current or upcoming Shabbat
   */
  static getParashatHaShavua(date: Date = new Date(), il: boolean = false) {
    // Find upcoming Shabbat
    const shabbat = new Date(date);
    const dayOfWeek = shabbat.getDay();
    if (dayOfWeek !== 6) {
      shabbat.setDate(shabbat.getDate() + (6 - dayOfWeek));
    }
    const info = this.getHebrewDateInfo(shabbat, il);
    return info.parashah || {
      nameEn: 'Special Holiday Schedule',
      nameHe: 'קְרִיאָה מְיוּחֶדֶת',
      summary: 'Special Torah reading for holiday or Yom Tov.',
      haftarah: ''
    };
  }

  /**
   * Comprehensive Halachic Yahrzeit Calculator reusing @hebcal/core algorithm.
   * Correctly handles leap years, Adar I/II, sunset transitions, and variable month lengths.
   */
  static calculateYahrzeit(passingGregorianInput: Date | string, afterSunset: boolean = false): YahrzeitCalculationResult {
    let dateObj = typeof passingGregorianInput === 'string' ? new Date(passingGregorianInput) : new Date(passingGregorianInput);
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date(2018, 5, 26); // June 26, 2018 fallback
    }

    // Jewish day transitions at sunset
    let origHDate = new HDate(dateObj);
    if (afterSunset) {
      origHDate = origHDate.next();
    }

    const origGreg = origHDate.greg();
    const origGregorianDate = origGreg.toISOString().split('T')[0];
    const origGregorianFormatted = origGreg.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const origHYear = origHDate.getFullYear();
    const origHMonth = origHDate.getMonth();
    const origHDay = origHDate.getDate();
    const origHebrewDateEn = origHDate.render('en');
    const origHebrewDateHe = origHDate.render('he');
    const isLeapYearPassing = origHDate.isLeapYear();

    const halachicNotes: string[] = [];
    if (afterSunset) {
      halachicNotes.push('Jewish day begins at sunset: Hebrew date advanced to evening following Gregorian daytime.');
    }
    if (isLeapYearPassing) {
      if (origHMonth === 12) {
        halachicNotes.push('Passing occurred in Adar I during a Hebrew leap year. In regular years observed in Adar; in leap years observed in Adar I.');
      } else if (origHMonth === 13) {
        halachicNotes.push('Passing occurred in Adar II during a Hebrew leap year. Observed in regular Adar in non-leap years.');
      } else {
        halachicNotes.push(`Passing occurred in a Hebrew leap year (${origHYear}).`);
      }
    } else if (origHMonth === 12) {
      halachicNotes.push('Passing occurred in Adar during a regular Hebrew year. In Hebrew leap years observed in Adar I.');
    }
    if (origHDay === 30 && (origHMonth === 8 || origHMonth === 9)) {
      halachicNotes.push('Variable month length rule applied: Cheshvan/Kislev 30 anniversary follows Edward M. Reingold & Nachum Dershowitz Halachic algorithm.');
    }
    if (halachicNotes.length === 0) {
      halachicNotes.push('Standard Yahrzeit calculation conforming strictly to @hebcal/core Shulchan Aruch rules.');
    }

    const today = new Date();
    const todayHDate = new HDate(today);
    const currentHYear = todayHDate.getFullYear();

    const formatInstance = (hDate: HDate): YahrzeitInstanceInfo => {
      const g = hDate.greg();
      return {
        hebrewDateEn: hDate.render('en'),
        hebrewDateHe: hDate.render('he'),
        gregorianDateFormatted: g.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        gregorianDateIso: g.toISOString().split('T')[0],
        hebrewYear: hDate.getFullYear()
      };
    };

    const getSafeYahrzeit = (targetYear: number): HDate => {
      if (targetYear <= origHYear) return origHDate;
      try {
        const y = HebrewCalendar.getYahrzeit(targetYear, origHDate);
        return y || origHDate;
      } catch (e) {
        return origHDate;
      }
    };

    const currentYahrzeitHDate = getSafeYahrzeit(currentHYear);
    const currentYahrzeitGreg = currentYahrzeitHDate.greg();

    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const currentStart = new Date(currentYahrzeitGreg.getFullYear(), currentYahrzeitGreg.getMonth(), currentYahrzeitGreg.getDate()).getTime();

    let previousYahrzeitHDate: HDate;
    let nextYahrzeitHDate: HDate;
    let isTodayYahrzeit = false;

    if (currentStart < todayStart) {
      previousYahrzeitHDate = currentYahrzeitHDate;
      nextYahrzeitHDate = getSafeYahrzeit(currentHYear + 1);
    } else if (currentStart === todayStart) {
      isTodayYahrzeit = true;
      previousYahrzeitHDate = getSafeYahrzeit(currentHYear - 1);
      nextYahrzeitHDate = currentYahrzeitHDate;
    } else {
      previousYahrzeitHDate = getSafeYahrzeit(currentHYear - 1);
      nextYahrzeitHDate = currentYahrzeitHDate;
    }

    const nextGreg = nextYahrzeitHDate.greg();
    const nextStart = new Date(nextGreg.getFullYear(), nextGreg.getMonth(), nextGreg.getDate()).getTime();
    const daysRemaining = isTodayYahrzeit ? 0 : Math.max(0, Math.round((nextStart - todayStart) / (1000 * 60 * 60 * 24)));

    let parashahOfPassing: { nameEn: string; nameHe: string } | undefined;
    try {
      const parInfo = this.getParashatHaShavua(origGreg, false);
      parashahOfPassing = { nameEn: parInfo.nameEn, nameHe: parInfo.nameHe };
    } catch (e) {}

    return {
      origGregorianDate,
      origGregorianFormatted,
      origHebrewDateEn,
      origHebrewDateHe,
      origHebrewYear: origHYear,
      afterSunset,
      isLeapYearPassing,
      isTodayYahrzeit,
      daysRemaining,
      previousYahrzeit: formatInstance(previousYahrzeitHDate),
      currentYearYahrzeit: formatInstance(currentYahrzeitHDate),
      nextYahrzeit: formatInstance(nextYahrzeitHDate),
      parashahOfPassing,
      halachicNotes
    };
  }
}
