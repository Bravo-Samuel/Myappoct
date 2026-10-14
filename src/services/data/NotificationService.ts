import { getBrowserSupabaseClient } from '../../lib/supabase/client';

export interface ScheduledYahrzeitReminder {
  id: string;
  memorialName: string;
  hebrewDate: string;
  triggerEvent: '30 days prior' | '14 days prior' | '7 days prior' | '3 days prior' | '1 day prior' | 'Beginning of Yahrzeit (Sunset)' | 'Morning of Yahrzeit';
  scheduledDateFormatted: string;
  status: 'Scheduled' | 'Delivered';
}

const YAHRZEIT_REMINDERS_KEY = 'bnei_menashe_yahrzeit_reminders';

export class NotificationService {
  /**
   * Fetch notifications for a user
   */
  static async getUserNotifications(userId: string) {
    const client = getBrowserSupabaseClient();
    if (!client || !userId) return { data: [], error: null };
    return await client
      .from('notifications')
      .select('*')
      .eq('recipient_user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: string) {
    const client = getBrowserSupabaseClient();
    if (!client) return { error: null };
    return await client
      .from('notifications')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('id', notificationId);
  }

  /**
   * Get all scheduled Yahrzeit reminders from local persistence
   */
  static getScheduledYahrzeitReminders(): ScheduledYahrzeitReminder[] {
    try {
      const raw = localStorage.getItem(YAHRZEIT_REMINDERS_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as ScheduledYahrzeitReminder[];
    } catch (e) {
      return [];
    }
  }

  /**
   * Automatically schedule exact Yahrzeit reminders: 30d, 14d, 7d, 3d, 1d, sunset, morning.
   */
  static scheduleYahrzeitReminders(
    memorialName: string,
    hebrewDate: string,
    nextYahrzeitGregorianIso: string
  ): ScheduledYahrzeitReminder[] {
    const targetDate = new Date(nextYahrzeitGregorianIso);
    if (isNaN(targetDate.getTime())) {
      return [];
    }

    const formatDate = (d: Date, timeStr: string) => {
      return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${timeStr}`;
    };

    const addDays = (d: Date, days: number) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + days);
      return copy;
    };

    const remindersToCreate: Array<{
      triggerEvent: ScheduledYahrzeitReminder['triggerEvent'];
      date: Date;
      timeStr: string;
    }> = [
      { triggerEvent: '30 days prior', date: addDays(targetDate, -30), timeStr: '9:00 AM' },
      { triggerEvent: '14 days prior', date: addDays(targetDate, -14), timeStr: '9:00 AM' },
      { triggerEvent: '7 days prior', date: addDays(targetDate, -7), timeStr: '9:00 AM' },
      { triggerEvent: '3 days prior', date: addDays(targetDate, -3), timeStr: '9:00 AM' },
      { triggerEvent: '1 day prior', date: addDays(targetDate, -1), timeStr: '9:00 AM' },
      { triggerEvent: 'Beginning of Yahrzeit (Sunset)', date: addDays(targetDate, -1), timeStr: '7:34 PM (Sunset)' },
      { triggerEvent: 'Morning of Yahrzeit', date: targetDate, timeStr: '7:30 AM (Shacharit)' }
    ];

    const newReminders: ScheduledYahrzeitReminder[] = remindersToCreate.map((item, idx) => ({
      id: `yahr_rem_${Date.now()}_${idx}`,
      memorialName,
      hebrewDate,
      triggerEvent: item.triggerEvent,
      scheduledDateFormatted: formatDate(item.date, item.timeStr),
      status: 'Scheduled'
    }));

    const existing = this.getScheduledYahrzeitReminders();
    // Filter out previous reminders for the exact same person to avoid duplicates
    const filtered = existing.filter(r => r.memorialName !== memorialName);
    const updated = [...newReminders, ...filtered];

    try {
      localStorage.setItem(YAHRZEIT_REMINDERS_KEY, JSON.stringify(updated));
    } catch (e) {}

    return newReminders;
  }
}
