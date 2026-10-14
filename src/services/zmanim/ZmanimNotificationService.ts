/**
 * ZmanimNotificationService.ts
 * Manages calculations, state, scheduling, and local-push event triggers for important Zmanim.
 * Fully integrates with LocationService active profile settings and Service Worker.
 */

import { ZmanimService, ZmanDetail } from './ZmanimService';
import { LocationService } from '../data/LocationService';

export interface PendingAlert {
  id: string; // Unique alert identifier to prevent duplicate firing (e.g. zman-candle-2026-07-12)
  title: string;
  body: string;
  timeDate: Date;
  key: string; // 'candle' | 'havdalah' | 'shema_gra' | 'tefillah_gra' | 'mincha_k'
}

export class ZmanimNotificationService {
  private static tickerInterval: number | null = null;

  /**
   * Check if notifications and service workers are supported by the browser
   */
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Request notification permission from the user
   */
  static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Get current notification permission state
   */
  static getPermissionState(): string {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  /**
   * Generates pending Zmanim alerts for today and tomorrow based on user location & configuration
   */
  static generatePendingAlerts(): PendingAlert[] {
    const locState = LocationService.getLocationState();
    const location = locState.activeLocation;
    if (!location) return [];

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const scheduleToday = ZmanimService.getDailyZmanim(today, location);
    const scheduleTomorrow = ZmanimService.getDailyZmanim(tomorrow, location);

    const alerts: PendingAlert[] = [];

    // Helper to format date keys uniformly
    const getDateKey = (date: Date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    // Load active notification configurations saved from the Modal/Profile settings
    const notifCandlesEnabled = localStorage.getItem('bnei_menashe_notif_candles') !== 'false'; // default true
    const notifFastsEnabled = localStorage.getItem('bnei_menashe_notif_fasts') !== 'false'; // default true
    const notifPrayersEnabled = localStorage.getItem('bnei_menashe_notif_prayers') !== 'false'; // default true
    const leadTimeMins = parseInt(localStorage.getItem('bnei_menashe_notif_prayer_lead') || '15', 10);

    const processSchedule = (schedule: any, date: Date) => {
      const dKey = getDateKey(date);

      schedule.zmanim.forEach((zman: ZmanDetail) => {
        // 1. Shabbat & Holiday Candle Lighting Alerts
        if (zman.key === 'candle' && notifCandlesEnabled) {
          alerts.push({
            id: `zman-candle-${dKey}`,
            title: `Shabbat Candle Lighting — ${location.name}`,
            body: `Light candles by ${zman.formattedTime} according to local custom. Shabbat Shalom!`,
            timeDate: zman.timeDate,
            key: 'candle'
          });
        }

        // 2. Havdalah Alerts (Shabbat Concludes)
        if (zman.key === 'havdalah' && notifCandlesEnabled) {
          alerts.push({
            id: `zman-havdalah-${dKey}`,
            title: `Shabbat Concludes — Havdalah`,
            body: `Shabbat has ended at ${zman.formattedTime}. Shavua Tov!`,
            timeDate: zman.timeDate,
            key: 'havdalah'
          });
        }

        // 3. Fast Day Begin/End Reminders
        if (schedule.isFastDay && notifFastsEnabled) {
          const fastName = schedule.fastName || 'Fast Day';
          if (zman.key === 'alot') {
            alerts.push({
              id: `zman-fastbegin-${dKey}`,
              title: `${fastName} Begins`,
              body: `${fastName} starts this morning at Alot HaShachar (${zman.formattedTime}).`,
              timeDate: zman.timeDate,
              key: 'fast_begin'
            });
          }
          if (zman.key === 'nightfall') {
            alerts.push({
              id: `zman-fastend-${dKey}`,
              title: `${fastName} Concludes`,
              body: `${fastName} concludes tonight at Tzeit HaKochavim (${zman.formattedTime}). You may now break your fast.`,
              timeDate: zman.timeDate,
              key: 'fast_end'
            });
          }
        }

        // 4. Daily Prayer Halachic Deadlines
        if (notifPrayersEnabled) {
          // Sof Zman Shema
          if (zman.key === 'shema_gra') {
            const alertTime = new Date(zman.timeDate.getTime() - leadTimeMins * 60 * 1000);
            alerts.push({
              id: `zman-shemagra-${dKey}`,
              title: `Sof Zman Shema (GRA) — ${leadTimeMins}m Warning`,
              body: `Sof Zman Shema is approaching at ${zman.formattedTime}. Pray before the deadline.`,
              timeDate: alertTime,
              key: 'shema_gra'
            });
          }

          // Sof Zman Tefillah
          if (zman.key === 'tefillah_gra') {
            const alertTime = new Date(zman.timeDate.getTime() - leadTimeMins * 60 * 1000);
            alerts.push({
              id: `zman-tefillahgra-${dKey}`,
              title: `Sof Zman Shacharit Tefillah — ${leadTimeMins}m Warning`,
              body: `Sof Zman Shacharit Amidah is approaching at ${zman.formattedTime}. Pray before the deadline.`,
              timeDate: alertTime,
              key: 'tefillah_gra'
            });
          }

          // Mincha Ketanah
          if (zman.key === 'mincha_k') {
            const alertTime = new Date(zman.timeDate.getTime() - leadTimeMins * 60 * 1000);
            alerts.push({
              id: `zman-minchak-${dKey}`,
              title: `Mincha Ketanah — ${leadTimeMins}m Warning`,
              body: `The preferred afternoon Mincha time is approaching at ${zman.formattedTime}.`,
              timeDate: alertTime,
              key: 'mincha_k'
            });
          }
        }
      });
    };

    processSchedule(scheduleToday, today);
    processSchedule(scheduleTomorrow, tomorrow);

    return alerts;
  }

  /**
   * Initializes and starts the background notification scheduler ticker
   */
  static startNotificationEngine() {
    if (!this.isSupported()) return;

    // Clear any previous interval to avoid memory leaks
    if (this.tickerInterval) {
      window.clearInterval(this.tickerInterval);
    }

    // Trigger immediate checks on startup
    this.checkAndTriggerAlarms();

    // Check periodically every 30 seconds
    this.tickerInterval = window.setInterval(() => {
      this.checkAndTriggerAlarms();
    }, 30000);

    console.log('[Notification Engine] Zmanim alerts background scheduler initialized.');
  }

  /**
   * Stops the active background notification scheduler ticker
   */
  static stopNotificationEngine() {
    if (this.tickerInterval) {
      window.clearInterval(this.tickerInterval);
      this.tickerInterval = null;
    }
  }

  /**
   * Compares the generated pending alerts against the current timestamp,
   * firing service worker notifications if there is a match and the alert is not already fired.
   */
  private static checkAndTriggerAlarms() {
    if (Notification.permission !== 'granted') return;

    const pending = this.generatePendingAlerts();
    const now = new Date();

    // Retrieve already triggered alert identifiers to prevent duplicates
    let firedIds: string[] = [];
    try {
      const rawFired = localStorage.getItem('bnei_menashe_fired_alerts');
      firedIds = rawFired ? JSON.parse(rawFired) : [];
    } catch {
      firedIds = [];
    }

    const newFiredIds: string[] = [];

    pending.forEach(alert => {
      if (firedIds.includes(alert.id)) return;

      // Check if alert time is reached and not older than 1 hour (to avoid spamming outdated alerts on boot)
      const diffMs = now.getTime() - alert.timeDate.getTime();
      if (diffMs >= 0 && diffMs < 3600 * 1000) {
        this.fireNotification(alert.title, alert.body, alert.id);
        newFiredIds.push(alert.id);
      }
    });

    if (newFiredIds.length > 0) {
      const updatedFired = [...firedIds, ...newFiredIds];
      // Keep only the last 50 historical alerts to preserve storage space
      if (updatedFired.length > 50) {
        updatedFired.splice(0, updatedFired.length - 50);
      }
      localStorage.setItem('bnei_menashe_fired_alerts', JSON.stringify(updatedFired));
    }
  }

  /**
   * Dispatches the local notification payload to the Service Worker, or falls back to browser notifications
   */
  private static fireNotification(title: string, body: string, id: string) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        body,
        tag: id,
        icon: '/favicon.ico'
      });
    } else {
      try {
        new Notification(title, {
          body,
          tag: id,
          icon: '/favicon.ico'
        });
      } catch (e) {
        console.error('Failed to trigger local fallback notification:', e);
      }
    }
    console.log(`[Notification Engine] Dispatched: ${title} - ${body}`);
  }
}
