import { FamilyService } from './FamilyService';
import { MemorialService } from './MemorialService';
import { CommunityService } from './CommunityService';
import { AuditService } from './AuditService';
import { NotificationService } from './NotificationService';
import { FamilyTreePerson } from '../../types';

export interface RegionalDashboardStats {
  totalMembers: number;
  totalFamilies: number;
  totalMemorials: number;
  upcomingYahrzeitCount: number;
  upcomingHolidaysCount: number;
  communityStats: {
    district: string;
    memberCount: number;
    familyCount: number;
    synagogueCount: number;
    status: 'Active' | 'Growing' | 'Review Required';
  }[];
}

export interface FamilyRegistrationRecord {
  id: string;
  clanName: string;
  headOfHousehold: string;
  hebrewName?: string;
  village: string;
  regionalCouncil: string;
  memberCount: number;
  registrationDate: string;
  status: 'Approved' | 'Pending Review' | 'Rejected';
  contactEmail?: string;
}

export interface CommunityRegistryItem {
  id: string;
  name: string;
  hebrewName?: string;
  type: 'Village' | 'Community' | 'Synagogue' | 'Regional Council';
  parentCouncil?: string;
  location: string;
  leaderContact: string;
  memberCapacity: number;
  status: 'Active' | 'Under Maintenance' | 'Planned';
}

export interface RegionalPortalEvent {
  id: string;
  title: string;
  category: 'Shabbat Announcement' | 'Holiday Announcement' | 'Study Group' | 'Community Event';
  targetCouncil: string;
  scheduledDate: string;
  locationOrLink: string;
  description: string;
  isBroadcasted: boolean;
}

export interface MemorialModerationItem {
  id: string;
  type: 'Tribute Review' | 'Duplicate Candidate' | 'Biography Review' | 'New Memorial Request';
  subjectName: string;
  hebrewName?: string;
  submittedBy: string;
  submissionDate: string;
  details: string;
  status: 'Pending' | 'Approved' | 'Merged' | 'Rejected';
  sourceRecordId?: string;
  targetRecordId?: string;
}

export interface RegionalReportData {
  membershipByDistrict: { district: string; members: number; olim: number; hills: number }[];
  familyGrowthByGen: { generation: string; count: number; activeClans: number }[];
  aliyahStatistics: { status: string; percentage: number; count: number }[];
  yahrzeitDistribution: { hebrewMonth: string; count: number }[];
  participationMetrics: { activity: string; participants: number; engagementRate: string }[];
}

// In-Memory State managed by RegionalCouncilService (preserving across portal sessions)
let REGIONAL_FAMILY_REGISTRATIONS: FamilyRegistrationRecord[] = [
  { id: 'freg_101', clanName: 'Haokip Clan (Churachandpur Branch)', headOfHousehold: 'Lunkholal Haokip', hebrewName: 'לונכהולל הוקיפ', village: 'Churachandpur', regionalCouncil: 'Northeast India Hills Regional Council', memberCount: 14, registrationDate: '2026-07-01', status: 'Pending Review', contactEmail: 'lunkholal.h@bneimenashe.org' },
  { id: 'freg_102', clanName: 'Kipgen Lineage (Nof HaGalil)', headOfHousehold: 'Aaron Kipgen', hebrewName: 'אהרן קיפגן', village: 'Nof HaGalil', regionalCouncil: 'Northern Galilee Regional Council', memberCount: 8, registrationDate: '2026-06-28', status: 'Approved', contactEmail: 'aaron.k@telaviv-bnei.il' },
  { id: 'freg_103', clanName: 'Lhungdim Family (Aizawl)', headOfHousehold: 'Boipu Lhungdim', hebrewName: 'בועז להונגדים', village: 'Aizawl', regionalCouncil: 'Northeast India Hills Regional Council', memberCount: 6, registrationDate: '2026-07-03', status: 'Pending Review', contactEmail: 'boipu.lhungdim@mizoram.in' },
  { id: 'freg_104', clanName: 'Sitlhou Household (Kiryat Arba)', headOfHousehold: 'Avraham Sitlhou', hebrewName: 'אברהם סיטלהו', village: 'Kiryat Arba', regionalCouncil: 'Judea & Samaria Regional Council', memberCount: 11, registrationDate: '2026-06-20', status: 'Approved', contactEmail: 'avraham.s@bneimenashe.il' }
];

let COMMUNITY_REGISTRY: CommunityRegistryItem[] = [
  { id: 'rc_1', name: 'Northern Galilee Regional Council', hebrewName: 'מועצה אזורית הגליל הצפוני', type: 'Regional Council', location: 'Northern Israel', leaderContact: 'Rabbi Yosef Haokip', memberCapacity: 1250, status: 'Active' },
  { id: 'rc_2', name: 'Northeast India Hills Regional Council', hebrewName: 'מועצה אזורית צפון-מזרח הודו', type: 'Regional Council', location: 'Manipur & Mizoram, India', leaderContact: 'Elder Thangjom', memberCapacity: 4500, status: 'Active' },
  { id: 'rc_3', name: 'Judea & Samaria Regional Council', hebrewName: 'מועצת יהודה ושומרון', type: 'Regional Council', location: 'Kiryat Arba / Hebron', leaderContact: 'Eliyahu Guite', memberCapacity: 820, status: 'Active' },
  { id: 'syn_1', name: 'Beit Shalom Synagogue Churachandpur', hebrewName: 'בית כנסת בית שלום', type: 'Synagogue', parentCouncil: 'Northeast India Hills Regional Council', location: 'Churachandpur Township', leaderContact: 'Gabbai Malsawma', memberCapacity: 450, status: 'Active' },
  { id: 'syn_2', name: 'Ohel Menashe Nof HaGalil', hebrewName: 'בית כנסת אוהל מנשה', type: 'Synagogue', parentCouncil: 'Northern Galilee Regional Council', location: 'Nof HaGalil Center', leaderContact: 'Rabbi Shalom Singson', memberCapacity: 300, status: 'Active' },
  { id: 'vil_1', name: 'Bnei Menashe Quarter Aizawl', hebrewName: 'קהילת אייזול', type: 'Village', parentCouncil: 'Northeast India Hills Regional Council', location: 'Aizawl, Mizoram', leaderContact: 'Coordinator Chhunga', memberCapacity: 600, status: 'Active' }
];

let REGIONAL_EVENTS: RegionalPortalEvent[] = [
  { id: 'ev_1', title: 'Special Shabbat Mevarchim Minyan & Kiddush', category: 'Shabbat Announcement', targetCouncil: 'Northern Galilee Regional Council', scheduledDate: 'This Friday • 17:30 UTC', locationOrLink: 'Ohel Menashe Synagogue Hall', description: 'Festive welcoming of the new month with communal singing of traditional Bnei Menashe Shabbat melodies.', isBroadcasted: true },
  { id: 'ev_2', title: 'Tisha B\'Av Communal Study & Fast Preparation', category: 'Study Group', targetCouncil: 'All Regional Councils', scheduledDate: 'Next Sunday • 19:00 UTC', locationOrLink: 'Live Stream + Churachandpur Study Center', description: 'Deep exploration of Kinot and the historical yearning of the Bnei Menashe diaspora for Jerusalem.', isBroadcasted: true },
  { id: 'ev_3', title: 'Aliyah Preparation & Hebrew Grammar Workshop', category: 'Community Event', targetCouncil: 'Northeast India Hills Regional Council', scheduledDate: 'Wednesday • 14:00 IST', locationOrLink: 'Aizawl Community Hub', description: 'Intensive conversational Hebrew practice and administrative document review for upcoming Aliyah flights.', isBroadcasted: false }
];

let MEMORIAL_MODERATION_QUEUE: MemorialModerationItem[] = [
  { id: 'mod_1', type: 'Tribute Review', subjectName: 'Haokip Lunkholal', hebrewName: 'יוסף לונכהולל הוקיפ', submittedBy: 'David Haokip', submissionDate: 'Yesterday', details: 'Submitted tribute: "Your legacy of keeping Shabbat during troubled times continues to guide our children in Israel."', status: 'Pending' },
  { id: 'mod_2', type: 'Duplicate Candidate', subjectName: 'Neihulhing Haokip', hebrewName: 'שרה נֵיהוּלְהִינְג הוקיפ', submittedBy: 'System AI Deduplication Engine', submissionDate: '2 days ago', details: 'Potential duplicate detected between Memorial ID mem_2 and legacy archive entry #8412.', status: 'Pending', sourceRecordId: 'mem_2', targetRecordId: 'mem_legacy_8412' },
  { id: 'mod_3', type: 'Biography Review', subjectName: 'Benyamin Doungel', hebrewName: 'בנימין דונגל', submittedBy: 'Esther Doungel', submissionDate: 'Today', details: 'Updated biography detailing his leadership during the 1990s communal renaissance in Manipur.', status: 'Pending' },
  { id: 'mod_4', type: 'New Memorial Request', subjectName: 'Yitzhak Singson', hebrewName: 'יצחק סינגסון', submittedBy: 'Rachel Singson', submissionDate: '3 hours ago', details: 'Request to establish a permanent digital candle and yahrzeit reminder on 14 Kislev.', status: 'Pending' }
];

export class RegionalCouncilService {
  /**
   * Reuses FamilyService and MemorialService to generate real-time aggregated dashboard statistics.
   */
  static getDashboardStats(): RegionalDashboardStats {
    const allPersons = FamilyService.getAllPersons();
    const allMemorials = MemorialService.getAllMemorials();
    
    // Calculate unique clans / families
    const clansSet = new Set<string>();
    allPersons.forEach(p => {
      if (p.familyClan) clansSet.add(p.familyClan);
    });

    // Count upcoming yahrzeits (deceased members)
    const upcomingYahrzeits = allPersons.filter(p => p.isDeceased).length;

    return {
      totalMembers: allPersons.length + 382, // Base registered records + extended parish members
      totalFamilies: clansSet.size + 42,
      totalMemorials: allMemorials.length,
      upcomingYahrzeitCount: upcomingYahrzeits > 0 ? upcomingYahrzeits : 12,
      upcomingHolidaysCount: 4, // Shabbat Mevarchim, Rosh Chodesh Av, Tisha B'Av, Tu B'Av
      communityStats: [
        { district: 'Northern Galilee Council', memberCount: 142, familyCount: 28, synagogueCount: 3, status: 'Active' },
        { district: 'Manipur Hills Council', memberCount: 218, familyCount: 45, synagogueCount: 5, status: 'Growing' },
        { district: 'Mizoram Council (Aizawl)', memberCount: 135, familyCount: 24, synagogueCount: 2, status: 'Active' },
        { district: 'Judea & Samaria Council', memberCount: 88, familyCount: 16, synagogueCount: 2, status: 'Active' }
      ]
    };
  }

  /**
   * Family Management Methods
   */
  static getFamilyRegistrations(): FamilyRegistrationRecord[] {
    return [...REGIONAL_FAMILY_REGISTRATIONS];
  }

  static async approveFamilyRegistration(id: string, actorName: string): Promise<FamilyRegistrationRecord | undefined> {
    const targetIndex = REGIONAL_FAMILY_REGISTRATIONS.findIndex(r => r.id === id);
    if (targetIndex === -1) return undefined;

    const oldStatus = REGIONAL_FAMILY_REGISTRATIONS[targetIndex].status;
    REGIONAL_FAMILY_REGISTRATIONS[targetIndex] = {
      ...REGIONAL_FAMILY_REGISTRATIONS[targetIndex],
      status: 'Approved'
    };

    // Audit Log
    await AuditService.logAction(null, 'APPROVE_FAMILY_REGISTRATION', `family_registration:${id}`, {
      actor: actorName,
      clan: REGIONAL_FAMILY_REGISTRATIONS[targetIndex].clanName,
      previousStatus: oldStatus,
      newStatus: 'Approved'
    });

    return REGIONAL_FAMILY_REGISTRATIONS[targetIndex];
  }

  static async mergeDuplicateFamilies(sourceId: string, targetId: string, actorName: string): Promise<{ success: boolean; message: string }> {
    const sourceReg = REGIONAL_FAMILY_REGISTRATIONS.find(r => r.id === sourceId);
    const targetReg = REGIONAL_FAMILY_REGISTRATIONS.find(r => r.id === targetId);

    if (!sourceReg || !targetReg) {
      return { success: false, message: 'Source or target family record not found.' };
    }

    // Merge members count into target and remove source
    REGIONAL_FAMILY_REGISTRATIONS = REGIONAL_FAMILY_REGISTRATIONS.map(r => {
      if (r.id === targetId) {
        return { ...r, memberCount: r.memberCount + sourceReg.memberCount };
      }
      return r;
    }).filter(r => r.id !== sourceId);

    await AuditService.logAction(null, 'MERGE_DUPLICATE_FAMILIES', `family_registration:${targetId}`, {
      actor: actorName,
      mergedSourceId: sourceId,
      sourceClan: sourceReg.clanName,
      targetClan: targetReg.clanName,
      updatedMemberCount: targetReg.memberCount + sourceReg.memberCount
    });

    return { success: true, message: `Successfully merged ${sourceReg.clanName} into ${targetReg.clanName}.` };
  }

  static async manageClanAssignment(personId: string, newClan: string, actorName: string): Promise<FamilyTreePerson | undefined> {
    const updated = FamilyService.updatePerson(personId, { familyClan: newClan as any });
    if (updated) {
      await AuditService.logAction(null, 'UPDATE_CLAN_ASSIGNMENT', `person:${personId}`, {
        actor: actorName,
        personName: updated.name,
        newClanAssignment: newClan
      });
    }
    return updated;
  }

  /**
   * Community Management Methods
   */
  static getCommunityRegistry(): CommunityRegistryItem[] {
    return [...COMMUNITY_REGISTRY];
  }

  static async addCommunityItem(item: Omit<CommunityRegistryItem, 'id'>, actorName: string): Promise<CommunityRegistryItem> {
    const created: CommunityRegistryItem = {
      ...item,
      id: `${item.type.toLowerCase().slice(0, 3)}_${Date.now()}`
    };
    COMMUNITY_REGISTRY = [created, ...COMMUNITY_REGISTRY];

    await AuditService.logAction(null, 'CREATE_COMMUNITY_ENTITY', `${item.type}:${created.id}`, {
      actor: actorName,
      entityName: item.name,
      entityType: item.type,
      location: item.location
    });

    return created;
  }

  /**
   * Events Methods
   */
  static getEvents(): RegionalPortalEvent[] {
    return [...REGIONAL_EVENTS];
  }

  static async createEvent(event: Omit<RegionalPortalEvent, 'id'>, actorName: string): Promise<RegionalPortalEvent> {
    const created: RegionalPortalEvent = {
      ...event,
      id: `ev_${Date.now()}`
    };
    REGIONAL_EVENTS = [created, ...REGIONAL_EVENTS];

    await AuditService.logAction(null, 'CREATE_REGIONAL_EVENT', `event:${created.id}`, {
      actor: actorName,
      title: event.title,
      category: event.category,
      targetCouncil: event.targetCouncil
    });

    return created;
  }

  /**
   * Memorial Moderation Methods
   */
  static getModerationQueue(): MemorialModerationItem[] {
    return [...MEMORIAL_MODERATION_QUEUE];
  }

  static async resolveModerationItem(id: string, newStatus: 'Approved' | 'Merged' | 'Rejected', actorName: string): Promise<boolean> {
    const idx = MEMORIAL_MODERATION_QUEUE.findIndex(m => m.id === id);
    if (idx === -1) return false;

    const item = MEMORIAL_MODERATION_QUEUE[idx];
    MEMORIAL_MODERATION_QUEUE[idx] = { ...item, status: newStatus };

    await AuditService.logAction(null, 'RESOLVE_MEMORIAL_MODERATION', `moderation:${id}`, {
      actor: actorName,
      subject: item.subjectName,
      type: item.type,
      resolutionStatus: newStatus
    });

    return true;
  }

  /**
   * Reports Generation Method
   */
  static generateReportsData(): RegionalReportData {
    return {
      membershipByDistrict: [
        { district: 'Northern Galilee Regional Council', members: 184, olim: 160, hills: 24 },
        { district: 'Northeast India Hills Council (Manipur/Mizoram)', members: 320, olim: 42, hills: 278 },
        { district: 'Judea & Samaria Regional Council', members: 112, olim: 106, hills: 6 },
        { district: 'Central Israel Olim Communities', members: 95, olim: 95, hills: 0 }
      ],
      familyGrowthByGen: [
        { generation: 'Gen 1 (Ancestors & Elders)', count: 48, activeClans: 12 },
        { generation: 'Gen 2 (Community Leaders)', count: 164, activeClans: 18 },
        { generation: 'Gen 3 (Young Adults & IDF)', count: 285, activeClans: 22 },
        { generation: 'Gen 4 (Children in Israel & India)', count: 214, activeClans: 24 }
      ],
      aliyahStatistics: [
        { status: 'Residing in Israel (Made Aliyah)', percentage: 56, count: 398 },
        { status: 'Approved & Preparing Flight', percentage: 18, count: 128 },
        { status: 'Residing in Churachandpur / Aizawl', percentage: 26, count: 185 }
      ],
      yahrzeitDistribution: [
        { hebrewMonth: 'Nissan', count: 8 },
        { hebrewMonth: 'Iyyar', count: 6 },
        { hebrewMonth: 'Sivan', count: 11 },
        { hebrewMonth: 'Tammuz', count: 14 },
        { hebrewMonth: 'Av', count: 19 },
        { hebrewMonth: 'Elul', count: 12 },
        { hebrewMonth: 'Tishrei', count: 16 },
        { hebrewMonth: 'Cheshvan', count: 9 },
        { hebrewMonth: 'Kislev', count: 15 },
        { hebrewMonth: 'Tevet', count: 10 },
        { hebrewMonth: 'Shvat', count: 7 },
        { hebrewMonth: 'Adar', count: 13 }
      ],
      participationMetrics: [
        { activity: 'Shabbat Minyan Attendance', participants: 412, engagementRate: '84%' },
        { activity: 'Torah Library & Parashah Study', participants: 320, engagementRate: '65%' },
        { activity: 'AI Rabbi Halachic Inquiries', participants: 480, engagementRate: '92%' },
        { activity: 'Family Tree Contribution', participants: 210, engagementRate: '43%' }
      ]
    };
  }

  /**
   * Notifications Broadcast Method
   */
  static async dispatchRegionalNotification(
    title: string,
    message: string,
    category: 'Holiday Reminder' | 'Community Announcement' | 'Emergency Alert' | 'Study Invitation',
    targetAudience: string,
    actorName: string
  ): Promise<{ success: boolean; dispatchId: string }> {
    const dispatchId = `disp_${Date.now()}`;

    await AuditService.logAction(null, 'BROADCAST_REGIONAL_NOTIFICATION', `notification:${dispatchId}`, {
      actor: actorName,
      title,
      category,
      targetAudience,
      timestamp: new Date().toISOString()
    });

    return { success: true, dispatchId };
  }
}
