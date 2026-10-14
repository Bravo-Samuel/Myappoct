import { CommunityAnnouncement } from '../../types';
import { ANNOUNCEMENTS } from '../../data/mockData';

export interface PrayerRequest {
  id: string;
  name: string;
  hebrewName?: string;
  reason: string;
  location: string;
  submittedBy?: string;
  timestamp: string;
}

let PRAYER_REQUESTS: PrayerRequest[] = [
  { id: 'pr_1', name: "Yosef ben Esther", hebrewName: 'יוסף בן אסתר', reason: "Refuah Shleimah (Complete Healing)", location: "Churachandpur Hospital", timestamp: 'Today' },
  { id: 'pr_2', name: "Sarah bat Leah", hebrewName: 'שרה בת לאה', reason: "Safe travel and Aliyah preparations", location: "Aizawl → Tel Aviv", timestamp: 'Yesterday' },
  { id: 'pr_3', name: "IDF Soldiers of Bnei Menashe", hebrewName: 'חיילי בני מנשה בצה״ל', reason: "Safety, strength, and peace across Israel", location: "Northern & Southern Borders", timestamp: 'Daily' }
];

export class CommunityService {
  static getAnnouncements(): CommunityAnnouncement[] {
    return [...ANNOUNCEMENTS];
  }

  static getPrayerRequests(): PrayerRequest[] {
    return [...PRAYER_REQUESTS];
  }

  static addPrayerRequest(request: Omit<PrayerRequest, 'id' | 'timestamp'>): PrayerRequest {
    const created: PrayerRequest = {
      ...request,
      id: `pr_${Date.now()}`,
      timestamp: 'Just now'
    };
    PRAYER_REQUESTS = [created, ...PRAYER_REQUESTS];
    return created;
  }
}
