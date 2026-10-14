import { getBrowserSupabaseClient } from '../../lib/supabase/client';
import { HebrewCalendarService, HebrewDateInfo } from './HebrewCalendarService';

export interface UnifiedDayItem extends HebrewDateInfo {
  synagogueEvents: Array<{
    id: string;
    title: string;
    description?: string;
    event_type?: string;
    start_time?: string;
    location?: string;
  }>;
}

export class CalendarService {
  /**
   * Fetch active calendar events
   */
  static async getEvents(synagogueId?: string) {
    const client = getBrowserSupabaseClient();
    if (!client) return { data: [], error: null };
    let query = client
      .from('calendar_events')
      .select('*')
      .is('deleted_at', null)
      .order('gregorian_date', { ascending: true });

    if (synagogueId) {
      query = query.eq('synagogue_id', synagogueId);
    }
    return await query;
  }

  /**
   * Orchestrate database events and Hebrew calendar engine calculations for an entire month
   */
  static async getUnifiedMonthlyCalendar(
    year: number,
    month: number, // 1-indexed (1 = Jan, 7 = Jul)
    synagogueId?: string,
    diaspora: boolean = true
  ): Promise<UnifiedDayItem[]> {
    const calculatedDays = HebrewCalendarService.getMonthlyCalendar(year, month, !diaspora);
    const { data: dbEvents } = await this.getEvents(synagogueId);

    return calculatedDays.map(dayInfo => {
      const matchingEvents = (dbEvents || []).filter(
        (ev: any) => ev.gregorian_date?.startsWith(dayInfo.gregorianDate)
      ).map((ev: any) => ({
        id: ev.id,
        title: ev.title || ev.event_name || 'Community Assembly',
        description: ev.description,
        event_type: ev.event_type,
        start_time: ev.start_time,
        location: ev.location
      }));

      return {
        ...dayInfo,
        synagogueEvents: matchingEvents
      };
    });
  }

  /**
   * Get unified detail for a single day
   */
  static async getUnifiedDayDetail(date: Date = new Date(), synagogueId?: string, diaspora: boolean = true): Promise<UnifiedDayItem> {
    const dayInfo = HebrewCalendarService.getHebrewDateInfo(date, !diaspora);
    const dateStr = dayInfo.gregorianDate;
    const { data: dbEvents } = await this.getEvents(synagogueId);

    const matchingEvents = (dbEvents || []).filter(
      (ev: any) => ev.gregorian_date?.startsWith(dateStr)
    ).map((ev: any) => ({
      id: ev.id,
      title: ev.title || ev.event_name || 'Community Assembly',
      description: ev.description,
      event_type: ev.event_type,
      start_time: ev.start_time,
      location: ev.location
    }));

    return {
      ...dayInfo,
      synagogueEvents: matchingEvents
    };
  }
}
