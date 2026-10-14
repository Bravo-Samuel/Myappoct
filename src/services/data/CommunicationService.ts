import { AuditService } from './AuditService';
import { DigitalSignatureService } from './DigitalSignatureService';

export type CommChannel =
  | 'Official Announcements'
  | 'Regional Council'
  | 'Synagogue Notices'
  | 'Holiday Greetings'
  | 'Emergency Alerts'
  | 'Community Bulletins'
  | 'Youth Programs'
  | 'Education Updates'
  | 'Volunteer Opportunities';

export type InboxCategory =
  | 'All'
  | 'Unread'
  | 'Important'
  | 'Community'
  | 'Regional Council'
  | 'Synagogue'
  | 'Documents'
  | 'Services';

export type BroadcastAuthority =
  | 'Regional Council'
  | 'Global Admin'
  | 'Synagogue Leadership';

export type CommMessageType =
  | 'Information'
  | 'Reminder'
  | 'Action Required'
  | 'Emergency'
  | 'Invitation'
  | 'Approval Notice'
  | 'Document Ready'
  | 'Appointment Reminder';

export type SmartDeliveryTarget =
  | 'Entire Community'
  | 'One Regional Council'
  | 'Specific Synagogue'
  | 'Household'
  | 'Individual Member'
  | 'Volunteer Group'
  | 'Youth Group'
  | 'Women\'s Group';

export type ReadReceiptStatus = 'Delivered' | 'Read' | 'Unread' | 'Acknowledged';

export interface MessageAttachment {
  id: string;
  docNumber: string;
  title: string;
  category: string;
  sha256Fingerprint: string;
}

export interface CalendarEventLink {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  location?: string;
}

export interface CommMessage {
  id: string;
  title: string;
  body: string;
  senderName: string;
  senderRole: string;
  authority: BroadcastAuthority;
  channel: CommChannel;
  inboxCategory: 'Community' | 'Regional Council' | 'Synagogue' | 'Documents' | 'Services';
  messageType: CommMessageType;
  target: SmartDeliveryTarget;
  targetDetail?: string;
  createdAt: string;
  status: 'Draft' | 'Scheduled' | 'Published' | 'Withdrawn' | 'Archived';
  isPinned?: boolean;
  isImportant?: boolean;
  receiptStatus: ReadReceiptStatus;
  attachments?: MessageAttachment[];
  calendarEventLink?: CalendarEventLink;
  analytics: {
    totalDelivered: number;
    readCount: number;
    ackCount: number;
    viewsCount: number;
    regionalReach: { [region: string]: number };
  };
}

export interface UserNotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inAppOnly: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

const COMM_MESSAGES_KEY = 'bnei_menashe_comm_messages_v1';
const COMM_PREFS_KEY = 'bnei_menashe_comm_prefs_v1';

export class CommunicationService {
  private static getInitialMessages(): CommMessage[] {
    return [
      {
        id: 'comm-2026-001',
        title: 'URGENT: Rosh Hashanah 5787 Sanctuary Registration & Seating Protocol',
        body: 'Official directive from the Bnei Menashe Regional Council: All heads of households in Churachandpur and Aizawl districts must verify and confirm their synagogue seating allocation for High Holy Days by Elul 15. Please ensure your Community Identity Pass is attached or accessible in the Digital Document Center.',
        senderName: 'Gabbai Malsawma Haokip',
        senderRole: 'Regional Council Secretary',
        authority: 'Regional Council',
        channel: 'Official Announcements',
        inboxCategory: 'Regional Council',
        messageType: 'Action Required',
        target: 'Entire Community',
        targetDetail: 'Churachandpur & Aizawl Districts',
        createdAt: '2026-07-05 09:15',
        status: 'Published',
        isPinned: true,
        isImportant: true,
        receiptStatus: 'Read',
        attachments: [
          {
            id: 'att-1',
            docNumber: 'BMCI-2026-0001824',
            title: 'Official Community Membership Pass - Samuel Haokip',
            category: 'Community Identity Pass',
            sha256Fingerprint: '9a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a'
          }
        ],
        calendarEventLink: {
          eventTitle: 'High Holy Days Seating Verification Deadline',
          eventDate: '2026-08-28',
          eventTime: '17:00 PM',
          location: 'Beit Shalom Synagogue Churachandpur'
        },
        analytics: {
          totalDelivered: 4820,
          readCount: 4210,
          ackCount: 3890,
          viewsCount: 12450,
          regionalReach: {
            'Churachandpur': 2600,
            'Aizawl': 1520,
            'Imphal': 450,
            'Israel Hub': 250
          }
        }
      },
      {
        id: 'comm-2026-002',
        title: 'Platform Maintenance & Digital Trust Node Upgrade',
        body: 'Global Administration informs all citizens that cryptographic hashing verification nodes and backup synchronizations will undergo scheduled maintenance this Thursday between 02:00 and 04:00 IST. Digital Document Center seals will remain accessible offline via cached verification certificates.',
        senderName: 'Global Operations Desk',
        senderRole: 'System Infrastructure Admin',
        authority: 'Global Admin',
        channel: 'Emergency Alerts',
        inboxCategory: 'Services',
        messageType: 'Information',
        target: 'Entire Community',
        createdAt: '2026-07-04 14:30',
        status: 'Published',
        isPinned: true,
        isImportant: true,
        receiptStatus: 'Delivered',
        analytics: {
          totalDelivered: 5100,
          readCount: 3410,
          ackCount: 1820,
          viewsCount: 8900,
          regionalReach: {
            'Churachandpur': 2700,
            'Aizawl': 1600,
            'Imphal': 500,
            'Israel Hub': 300
          }
        }
      },
      {
        id: 'comm-2026-003',
        title: 'Aliyah Dossier & Census Certification Ready for Download',
        body: 'Your verified Family Census & Demographic Certificate (4 Generations) has been cryptographically signed and sealed by the Regional Council Registrar. You may now submit this document to the Shavei Israel Aliyah desk.',
        senderName: 'Rabbi Yehuda Lalthlamuana',
        senderRole: 'Regional Rabbinic Arbiter',
        authority: 'Regional Council',
        channel: 'Regional Council',
        inboxCategory: 'Documents',
        messageType: 'Document Ready',
        target: 'Household',
        targetDetail: 'Haokip Household (#HH-7721)',
        createdAt: '2026-07-03 16:20',
        status: 'Published',
        isImportant: true,
        receiptStatus: 'Acknowledged',
        attachments: [
          {
            id: 'att-2',
            docNumber: 'BMCI-2026-0002109',
            title: 'Halachic Lineage & Census Certificate (Signed)',
            category: 'Community Census Certificate',
            sha256Fingerprint: '4f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f11'
          }
        ],
        analytics: {
          totalDelivered: 1,
          readCount: 1,
          ackCount: 1,
          viewsCount: 14,
          regionalReach: { 'Churachandpur': 1 }
        }
      },
      {
        id: 'comm-2026-004',
        title: 'Shabbat Chazon Schedule & Special Guest Lecturer at Beit Shalom',
        body: 'Please note that Mincha on Erev Shabbat will commence promptly at 18:05. Following Kabbalat Shabbat, our guest scholar from Jerusalem will deliver a keynote address on "The Rebuilding of Zion and the Return of the Lost Tribes". All congregants are invited.',
        senderName: 'Gabbai David Fanai',
        senderRole: 'Synagogue Gabbai',
        authority: 'Synagogue Leadership',
        channel: 'Synagogue Notices',
        inboxCategory: 'Synagogue',
        messageType: 'Invitation',
        target: 'Specific Synagogue',
        targetDetail: 'Beit Shalom Synagogue Churachandpur',
        createdAt: '2026-07-03 11:00',
        status: 'Published',
        receiptStatus: 'Read',
        calendarEventLink: {
          eventTitle: 'Shabbat Chazon Guest Lecture & Kabbalat Shabbat',
          eventDate: '2026-07-10',
          eventTime: '18:05 PM',
          location: 'Beit Shalom Synagogue Sanctuary'
        },
        analytics: {
          totalDelivered: 840,
          readCount: 790,
          ackCount: 650,
          viewsCount: 2310,
          regionalReach: { 'Churachandpur': 840 }
        }
      },
      {
        id: 'comm-2026-005',
        title: 'Youth Torah Quiz Competition & Summer Camp Registration',
        body: 'The Bnei Menashe Youth Directorate is launching the annual Torah & Jewish History Quiz for boys and girls ages 12-18. Preliminary rounds will be conducted in local shuls across Mizoram and Manipur. Top finalists will receive full scholarships to the Jerusalem Heritage Summer Workshop.',
        senderName: 'Esther Renthlei',
        senderRole: 'Youth Program Coordinator',
        authority: 'Regional Council',
        channel: 'Youth Programs',
        inboxCategory: 'Community',
        messageType: 'Information',
        target: 'Youth Group',
        targetDetail: 'Ages 12-18 Across All Districts',
        createdAt: '2026-07-02 10:15',
        status: 'Published',
        receiptStatus: 'Delivered',
        analytics: {
          totalDelivered: 1120,
          readCount: 890,
          ackCount: 420,
          viewsCount: 3100,
          regionalReach: {
            'Churachandpur': 580,
            'Aizawl': 410,
            'Imphal': 130
          }
        }
      },
      {
        id: 'comm-2026-006',
        title: 'Emergency Flood Relief Task Force & Volunteer Mobilization',
        body: 'Due to monsoon river overflows near Kangpokpi, the Regional Welfare Committee requests volunteer support for food and medical pack distribution. Able-bodied volunteers with vehicles are requested to assemble at the Community Welfare Office tomorrow morning.',
        senderName: 'Regional Emergency Taskforce',
        senderRole: 'Welfare Director',
        authority: 'Regional Council',
        channel: 'Volunteer Opportunities',
        inboxCategory: 'Community',
        messageType: 'Emergency',
        target: 'Volunteer Group',
        targetDetail: 'Manipur Emergency Relief Volunteers',
        createdAt: '2026-07-01 08:00',
        status: 'Published',
        isImportant: true,
        receiptStatus: 'Acknowledged',
        calendarEventLink: {
          eventTitle: 'Flood Relief Volunteer Briefing',
          eventDate: '2026-07-06',
          eventTime: '07:30 AM',
          location: 'Community Welfare Office, Churachandpur'
        },
        analytics: {
          totalDelivered: 350,
          readCount: 340,
          ackCount: 310,
          viewsCount: 1120,
          regionalReach: { 'Churachandpur': 280, 'Imphal': 70 }
        }
      },
      {
        id: 'comm-2026-007',
        title: 'Hebrew Immersion & Ulpan Evening Classes - Term III Intake',
        body: 'Registration is now open for Level A (Beginner) and Level B (Conversational Hebrew) evening classes conducted via interactive satellite link from Kiryat Arba. Classes meet twice weekly. Study materials are available in Mizo and English.',
        senderName: 'Rabbi Hanoch Singson',
        senderRole: 'Director of Education',
        authority: 'Global Admin',
        channel: 'Education Updates',
        inboxCategory: 'Community',
        messageType: 'Information',
        target: 'Entire Community',
        createdAt: '2026-06-28 15:00',
        status: 'Published',
        receiptStatus: 'Read',
        analytics: {
          totalDelivered: 4800,
          readCount: 3100,
          ackCount: 1400,
          viewsCount: 7600,
          regionalReach: { 'Churachandpur': 2500, 'Aizawl': 1500, 'Imphal': 500, 'Israel Hub': 300 }
        }
      },
      {
        id: 'comm-2026-008',
        title: 'Welfare Stipend Approval Notice - Q3 5786',
        body: 'Your household application for educational textbook assistance has been reviewed and formally approved by the Bnei Menashe Welfare Council. Funds have been credited to your registered community account.',
        senderName: 'Regional Finance Desk',
        senderRole: 'Treasurer',
        authority: 'Regional Council',
        channel: 'Community Bulletins',
        inboxCategory: 'Services',
        messageType: 'Approval Notice',
        target: 'Household',
        targetDetail: 'Haokip Household (#HH-7721)',
        createdAt: '2026-06-25 13:40',
        status: 'Published',
        receiptStatus: 'Acknowledged',
        analytics: {
          totalDelivered: 1,
          readCount: 1,
          ackCount: 1,
          viewsCount: 6,
          regionalReach: { 'Churachandpur': 1 }
        }
      }
    ];
  }

  public static getMessages(): CommMessage[] {
    try {
      const raw = localStorage.getItem(COMM_MESSAGES_KEY);
      if (!raw) {
        const initials = this.getInitialMessages();
        localStorage.setItem(COMM_MESSAGES_KEY, JSON.stringify(initials));
        return initials;
      }
      return JSON.parse(raw);
    } catch (e) {
      return this.getInitialMessages();
    }
  }

  public static saveMessages(messages: CommMessage[]): void {
    try {
      localStorage.setItem(COMM_MESSAGES_KEY, JSON.stringify(messages));
    } catch (e) {}
  }

  public static getPreferences(): UserNotificationPreferences {
    try {
      const raw = localStorage.getItem(COMM_PREFS_KEY);
      if (!raw) {
        const initial: UserNotificationPreferences = {
          email: true,
          push: true,
          sms: false,
          inAppOnly: false,
          quietHoursEnabled: true,
          quietHoursStart: '22:00',
          quietHoursEnd: '06:00'
        };
        localStorage.setItem(COMM_PREFS_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch (e) {
      return {
        email: true,
        push: true,
        sms: false,
        inAppOnly: false,
        quietHoursEnabled: true,
        quietHoursStart: '22:00',
        quietHoursEnd: '06:00'
      };
    }
  }

  public static savePreferences(prefs: UserNotificationPreferences): void {
    try {
      localStorage.setItem(COMM_PREFS_KEY, JSON.stringify(prefs));
      AuditService.logAction('user_self', 'UPDATE_COMM_PREFERENCES', 'UserNotificationPreferences', prefs);
    } catch (e) {}
  }

  /**
   * Filter personal inbox messages
   */
  public static getPersonalInbox(category: InboxCategory): CommMessage[] {
    const all = this.getMessages().filter(m => m.status === 'Published');
    if (category === 'All') return all;
    if (category === 'Unread') return all.filter(m => m.receiptStatus === 'Delivered' || m.receiptStatus === 'Unread');
    if (category === 'Important') return all.filter(m => m.isImportant || m.messageType === 'Emergency' || m.messageType === 'Action Required');
    return all.filter(m => m.inboxCategory === category);
  }

  /**
   * Mark message read receipt status
   */
  public static updateReceiptStatus(messageId: string, status: ReadReceiptStatus): CommMessage[] {
    const all = this.getMessages();
    const updated = all.map(m => {
      if (m.id === messageId) {
        const prevStatus = m.receiptStatus;
        const newAnalytics = { ...m.analytics };
        if (status === 'Read' && prevStatus !== 'Read' && prevStatus !== 'Acknowledged') {
          newAnalytics.readCount += 1;
        }
        if (status === 'Acknowledged' && prevStatus !== 'Acknowledged') {
          if (prevStatus !== 'Read') newAnalytics.readCount += 1;
          newAnalytics.ackCount += 1;
        }
        newAnalytics.viewsCount += 1;
        return { ...m, receiptStatus: status, analytics: newAnalytics };
      }
      return m;
    });
    this.saveMessages(updated);
    AuditService.logAction('user_self', `RECEIPT_${status.toUpperCase()}`, `CommMessage:${messageId}`);
    return updated;
  }

  /**
   * Broadcast a new official message (Admin Tool)
   */
  public static createBroadcast(params: {
    title: string;
    body: string;
    senderName: string;
    senderRole: string;
    authority: BroadcastAuthority;
    channel: CommChannel;
    inboxCategory: 'Community' | 'Regional Council' | 'Synagogue' | 'Documents' | 'Services';
    messageType: CommMessageType;
    target: SmartDeliveryTarget;
    targetDetail?: string;
    status: 'Draft' | 'Scheduled' | 'Published';
    isPinned?: boolean;
    isImportant?: boolean;
    attachmentDocNumbers?: string[];
    calendarEventLink?: CalendarEventLink;
  }): CommMessage {
    const all = this.getMessages();
    
    // Resolve attachments from DigitalSignatureService
    const attachments: MessageAttachment[] = [];
    if (params.attachmentDocNumbers && params.attachmentDocNumbers.length > 0) {
      const allDocs = DigitalSignatureService.getAllCertifiedDocuments();
      params.attachmentDocNumbers.forEach((docNum, idx) => {
        const found = allDocs.find(d => d.documentNumber === docNum);
        if (found) {
          attachments.push({
            id: `att-${Date.now()}-${idx}`,
            docNumber: found.documentNumber,
            title: found.documentName,
            category: found.category,
            sha256Fingerprint: found.sha256Fingerprint
          });
        }
      });
    }

    const estimatedDelivered = params.target === 'Entire Community' ? 5200 : params.target === 'One Regional Council' ? 2600 : params.target === 'Specific Synagogue' ? 850 : 120;

    const newMsg: CommMessage = {
      id: `comm-${Date.now()}`,
      title: params.title,
      body: params.body,
      senderName: params.senderName,
      senderRole: params.senderRole,
      authority: params.authority,
      channel: params.channel,
      inboxCategory: params.inboxCategory,
      messageType: params.messageType,
      target: params.target,
      targetDetail: params.targetDetail || (params.target === 'Entire Community' ? 'All Bnei Menashe Districts' : 'Specified Recipient'),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: params.status,
      isPinned: params.isPinned || false,
      isImportant: params.isImportant || false,
      receiptStatus: 'Delivered',
      attachments: attachments.length > 0 ? attachments : undefined,
      calendarEventLink: params.calendarEventLink,
      analytics: {
        totalDelivered: params.status === 'Published' ? estimatedDelivered : 0,
        readCount: 0,
        ackCount: 0,
        viewsCount: 0,
        regionalReach: {
          'Churachandpur': Math.round(estimatedDelivered * 0.52),
          'Aizawl': Math.round(estimatedDelivered * 0.32),
          'Imphal': Math.round(estimatedDelivered * 0.10),
          'Israel Hub': Math.round(estimatedDelivered * 0.06)
        }
      }
    };

    const updated = [newMsg, ...all];
    this.saveMessages(updated);
    AuditService.logAction(params.senderName, `BROADCAST_${params.status.toUpperCase()}`, `CommMessage:${newMsg.id}`, { title: params.title, target: params.target });
    return newMsg;
  }

  /**
   * Update message status (Publish, Withdraw, Archive, Pin)
   */
  public static updateMessageStatus(messageId: string, status: CommMessage['status'], togglePin?: boolean): CommMessage[] {
    const all = this.getMessages();
    const updated = all.map(m => {
      if (m.id === messageId) {
        return {
          ...m,
          status: status,
          isPinned: togglePin !== undefined ? togglePin : m.isPinned
        };
      }
      return m;
    });
    this.saveMessages(updated);
    AuditService.logAction('admin', `COMM_STATUS_UPDATE:${status}`, `CommMessage:${messageId}`);
    return updated;
  }
}
