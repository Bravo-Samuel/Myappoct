import { HDate, Locale } from '@hebcal/core';
import { FamilyPurityCycleRecord, FamilyPuritySettings, BedikaChecklist } from '../../types';
import { getBrowserSupabaseClient } from '../../lib/supabase/client';
import { ZmanimService } from '../zmanim/ZmanimService';
import { LocationResolver } from '../zmanim/LocationResolver';

const FP_RECORDS_KEY = 'bnei_menashe_private_fp_records';
const FP_SETTINGS_KEY = 'bnei_menashe_private_fp_settings';

export interface CalculatedCyclePredictions {
  onsetGregorianIso: string;
  onsetHebrewStrEn: string;
  onsetHebrewStrHe: string;
  minimumHefsekDateIso: string;
  minimumHefsekHebrewStr: string;
  sevenCleanDaysStartIso: string;
  mikvehNightIso: string; // Sunset of day 7
  mikvehNightFormatted: string;
  mikvehNightHebrewStr: string;
  vesetHachodeshIso: string;
  vesetHachodeshHebrewStr: string;
  vesetHaflagaIso: string;
  onahBeinonitIso: string;
  exactSunsetTimeStr?: string;
  exactNightfallTimeStr?: string;
}

export class FamilyPurityService {
  /**
   * Get exact sunset (Shkiah) and nightfall (Tzeit HaKochavim) for a date and location
   */
  static getSunsetAndNightfallForDate(dateIso: string, locationId: string = 'churachandpur'): { sunsetStr: string; nightfallStr: string; locationName: string } {
    try {
      const loc = LocationResolver.getLocationByNameOrId(locationId);
      const schedule = ZmanimService.getDailyZmanim(new Date(dateIso), loc);
      const sunset = schedule.zmanim.find(z => z.key === 'sunset');
      const nightfall = schedule.zmanim.find(z => z.key === 'nightfall');
      return {
        sunsetStr: sunset ? sunset.formattedTime : '17:45',
        nightfallStr: nightfall ? nightfall.formattedTime : '18:18',
        locationName: loc.name
      };
    } catch (e) {
      return { sunsetStr: '17:45', nightfallStr: '18:18', locationName: 'Churachandpur' };
    }
  }

  /**
   * Get settings for the user
   */
  static getSettings(userId?: string): FamilyPuritySettings {
    const defaultSettings: FamilyPuritySettings = {
      userId: userId || 'local_user',
      biometricLockEnabled: false,
      reminderMikvehNight: true,
      reminderBedikot: true,
      reminderVeset: true,
      locationId: 'churachandpur',
      sessionTimeoutMinutes: 5,
      emergencyHideEnabled: true,
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      reminderTimingHoursBeforeSunset: 1,
      minCleanWaitDays: 5
    };

    try {
      const raw = localStorage.getItem(`${FP_SETTINGS_KEY}_${userId || 'local'}`);
      if (!raw) return defaultSettings;
      return { ...defaultSettings, ...JSON.parse(raw) };
    } catch (e) {
      return defaultSettings;
    }
  }

  /**
   * Save settings
   */
  static saveSettings(settings: FamilyPuritySettings): void {
    try {
      localStorage.setItem(`${FP_SETTINGS_KEY}_${settings.userId}`, JSON.stringify(settings));
    } catch (e) {}
  }

  /**
   * Calculate exact Halachic dates for an onset date
   */
  static calculateCycleDates(
    startDateIso: string,
    startAfterSunset: boolean,
    hefsekDateIso?: string,
    intervalDays: number = 30,
    locationId: string = 'churachandpur'
  ): CalculatedCyclePredictions {
    const origDate = new Date(startDateIso);
    let hDate = new HDate(origDate);
    if (startAfterSunset) {
      hDate = hDate.next();
    }

    const onsetGregorianIso = hDate.greg().toISOString().split('T')[0];
    const onsetHebrewStrEn = hDate.render('en');
    const onsetHebrewStrHe = Locale.gettext(hDate.getMonthName(), 'he')
      ? `${hDate.getDate()} ${Locale.gettext(hDate.getMonthName(), 'he')} ${hDate.getFullYear()}`
      : hDate.render('he');

    // Minimum 5 days wait before Hefsek Taharah
    const minHefsekHDate = hDate.add(4); // Day 1 is onset, +4 = Day 5
    const minimumHefsekDateIso = minHefsekHDate.greg().toISOString().split('T')[0];
    const minimumHefsekHebrewStr = minHefsekHDate.render('en');

    // If Hefsek was performed, or using default minimum Hefsek
    const actualHefsekGreg = hefsekDateIso ? new Date(hefsekDateIso) : minHefsekHDate.greg();
    const actualHefsekHDate = new HDate(actualHefsekGreg);

    // 7 clean days begin the day following Hefsek Taharah
    const cleanDay1HDate = actualHefsekHDate.next();
    const cleanDay7HDate = cleanDay1HDate.add(6);

    // Mikveh night is sunset of Day 7 (which enters Day 8 in Hebrew calendar)
    const mikvehNightHDate = cleanDay7HDate.next();
    const mikvehNightGreg = cleanDay7HDate.greg(); // Evening of clean day 7

    const mikvehNightIso = mikvehNightGreg.toISOString().split('T')[0];
    const zmanimTimes = this.getSunsetAndNightfallForDate(mikvehNightIso, locationId);

    const mikvehNightFormatted = mikvehNightGreg.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ` at Tzeit HaKochavim (${zmanimTimes.nightfallStr})`;
    const mikvehNightHebrewStr = mikvehNightHDate.render('en');

    // Veset HaChodesh (Same Hebrew date in the following Hebrew month)
    let nextMonth = hDate.getMonth() + 1;
    let nextYear = hDate.getFullYear();
    if (nextMonth > 13 || (nextMonth > 12 && !HDate.isLeapYear(nextYear))) {
      nextMonth = 1;
      nextYear++;
    }
    // Handle short months (e.g. 30th day in a 29-day month moves to last day or Rosh Chodesh)
    const maxDaysInNextMonth = HDate.daysInMonth(nextMonth, nextYear);
    const nextDay = Math.min(hDate.getDate(), maxDaysInNextMonth);
    const vesetHDate = new HDate(nextDay, nextMonth, nextYear);

    // Veset Haflaga (interval days from onset)
    const vesetHaflagaHDate = hDate.add(intervalDays);

    // Onah Beinonit (30th day inclusive = +29 days)
    const onahBeinonitHDate = hDate.add(29);

    return {
      onsetGregorianIso,
      onsetHebrewStrEn,
      onsetHebrewStrHe,
      minimumHefsekDateIso,
      minimumHefsekHebrewStr,
      sevenCleanDaysStartIso: cleanDay1HDate.greg().toISOString().split('T')[0],
      mikvehNightIso,
      mikvehNightFormatted,
      mikvehNightHebrewStr,
      vesetHachodeshIso: vesetHDate.greg().toISOString().split('T')[0],
      vesetHachodeshHebrewStr: vesetHDate.render('en'),
      vesetHaflagaIso: vesetHaflagaHDate.greg().toISOString().split('T')[0],
      onahBeinonitIso: onahBeinonitHDate.greg().toISOString().split('T')[0],
      exactSunsetTimeStr: zmanimTimes.sunsetStr,
      exactNightfallTimeStr: zmanimTimes.nightfallStr
    };
  }

  /**
   * Generate 7-day bedikot checklist for Seven Clean Days
   */
  static generateBedikotChecklist(cleanDay1Iso: string): BedikaChecklist[] {
    const list: BedikaChecklist[] = [];
    const baseDate = new Date(cleanDay1Iso);
    let hDate = new HDate(baseDate);

    for (let i = 1; i <= 7; i++) {
      const gDate = hDate.greg();
      list.push({
        dayNumber: i as 1 | 2 | 3 | 4 | 5 | 6 | 7,
        gregorianDateIso: gDate.toISOString().split('T')[0],
        hebrewDateStr: hDate.render('en'),
        morningCompleted: false,
        afternoonCompleted: false
      });
      hDate = hDate.next();
    }
    return list;
  }

  /**
   * Get all cycle records for user
   */
  static async getRecords(userId?: string): Promise<FamilyPurityCycleRecord[]> {
    const uid = userId || 'local_user';

    // Try Supabase if client & authenticated
    const client = getBrowserSupabaseClient();
    if (client && userId && userId !== 'local_user') {
      try {
        const { data, error } = await client
          .from('family_purity_records')
          .select('*')
          .eq('user_id', userId)
          .order('start_date_iso', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            userId: item.user_id,
            startDateIso: item.start_date_iso,
            startAfterSunset: item.start_after_sunset,
            hebrewStartDate: item.hebrew_start_date,
            hebrewMonthName: item.hebrew_month_name || '',
            hebrewDayNumber: item.hebrew_day_number || 1,
            hebrewYear: item.hebrew_year || 5786,
            hesekTaharahDateIso: item.hefsek_taharah_date_iso,
            hesekTaharahAfterSunset: item.hefsek_taharah_after_sunset,
            sevenCleanDaysStartIso: item.seven_clean_days_start_iso,
            mikvehNightIso: item.mikveh_night_iso,
            mikvehHebrewDate: item.mikveh_hebrew_date,
            status: item.status || 'active_flow',
            bedikot: item.bedikot || [],
            expectedNextVesetHachodeshIso: item.expected_veset_hachodesh_iso,
            expectedNextVesetHaflagaIso: item.expected_veset_haflaga_iso,
            expectedNextBeinonitIso: item.expected_beinonit_iso,
            intervalDays: item.interval_days || 30,
            notes: item.notes,
            createdAt: item.created_at || new Date().toISOString()
          }));
        }
      } catch (e) {
        // Fall back to local
      }
    }

    // Local storage fallback
    try {
      const raw = localStorage.getItem(`${FP_RECORDS_KEY}_${uid}`);
      if (!raw) return [];
      return JSON.parse(raw) as FamilyPurityCycleRecord[];
    } catch (e) {
      return [];
    }
  }

  /**
   * Save a cycle record
   */
  static async saveRecord(record: FamilyPurityCycleRecord): Promise<void> {
    const uid = record.userId || 'local_user';

    // Save to local storage first for offline / instant availability
    try {
      const existing = await this.getRecords(uid);
      const idx = existing.findIndex(r => r.id === record.id);
      let updated: FamilyPurityCycleRecord[];
      if (idx >= 0) {
        updated = [...existing];
        updated[idx] = record;
      } else {
        updated = [record, ...existing];
      }
      localStorage.setItem(`${FP_RECORDS_KEY}_${uid}`, JSON.stringify(updated));
    } catch (e) {}

    // Save to Supabase if authenticated
    const client = getBrowserSupabaseClient();
    if (client && record.userId && record.userId !== 'local_user') {
      try {
        await client.from('family_purity_records').upsert({
          id: record.id,
          user_id: record.userId,
          start_date_iso: record.startDateIso,
          start_after_sunset: record.startAfterSunset,
          hebrew_start_date: record.hebrewStartDate,
          hebrew_month_name: record.hebrewMonthName,
          hebrew_day_number: record.hebrewDayNumber,
          hebrew_year: record.hebrewYear,
          hefsek_taharah_date_iso: record.hesekTaharahDateIso,
          hefsek_taharah_after_sunset: record.hesekTaharahAfterSunset,
          seven_clean_days_start_iso: record.sevenCleanDaysStartIso,
          mikveh_night_iso: record.mikvehNightIso,
          mikveh_hebrew_date: record.mikvehHebrewDate,
          status: record.status,
          bedikot: record.bedikot,
          expected_veset_hachodesh_iso: record.expectedNextVesetHachodeshIso,
          expected_veset_haflaga_iso: record.expectedNextVesetHaflagaIso,
          expected_beinonit_iso: record.expectedNextBeinonitIso,
          interval_days: record.intervalDays || 30,
          notes: record.notes,
          updated_at: new Date().toISOString()
        });
      } catch (e) {}
    }
  }

  /**
   * Delete a cycle record
   */
  static async deleteRecord(recordId: string, userId: string): Promise<void> {
    const uid = userId || 'local_user';
    try {
      const existing = await this.getRecords(uid);
      const filtered = existing.filter(r => r.id !== recordId);
      localStorage.setItem(`${FP_RECORDS_KEY}_${uid}`, JSON.stringify(filtered));
    } catch (e) {}

    const client = getBrowserSupabaseClient();
    if (client && userId && userId !== 'local_user') {
      try {
        await client.from('family_purity_records').delete().eq('id', recordId).eq('user_id', userId);
      } catch (e) {}
    }
  }
}
