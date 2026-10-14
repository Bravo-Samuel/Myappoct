import { FamilyService } from './FamilyService';
import { MemorialService } from './MemorialService';
import { CommunityService } from './CommunityService';
import { RegionalCouncilService } from './RegionalCouncilService';
import { AuditService } from './AuditService';
import { RoleService } from './RoleService';
import { UserRole } from '../../providers/SupabaseAuthProvider';

export interface GlobalDashboardMetrics {
  totalMembers: number;
  totalFamilies: number;
  totalCommunities: number;
  totalRegionalCouncils: number;
  totalMemorials: number;
  todaysActiveUsers: number;
  aiRabbiQueriesToday: number;
  systemHealth: 'Optimal' | 'Degraded' | 'Maintenance';
  cpuLoad: string;
  databaseLatency: string;
}

export interface RegionalCouncilOversightItem {
  id: string;
  name: string;
  hebrewName: string;
  regionCode: string;
  headquarters: string;
  membersCount: number;
  familiesCount: number;
  growthRate: string;
  aliyahRate: string;
  activityScore: number; // 0-100
  assignedAdmin: string;
  adminEmail: string;
  isEnabled: boolean;
}

export interface ManagedUserAccount {
  id: string;
  fullName: string;
  hebrewName?: string;
  email: string;
  role: string;
  councilOrSynagogue: string;
  status: 'Active' | 'Suspended' | 'Pending Reset';
  lastLogin: string;
  twoFactorEnabled: boolean;
}

export interface OrganizationHierarchyNode {
  id: string;
  name: string;
  type: 'Country' | 'State' | 'Region' | 'Village' | 'Community' | 'Synagogue' | 'Regional Council';
  parentName?: string;
  headcount: number;
  status: 'Active' | 'Inactive';
}

export interface GlobalAnnouncementRecord {
  id: string;
  title: string;
  body: string;
  targetRegion: string;
  scheduledTime: string;
  isBroadcasted: boolean;
  author: string;
}

export interface PlatformUsageBreakdown {
  dau: number;
  mau: number;
  yoyGrowth: string;
  moduleMetrics: {
    moduleName: string;
    dailyInteractions: number;
    activeUsersPercentage: number;
    trend: string;
  }[];
}

export interface SubscriptionPlanRecord {
  id: string;
  planName: string;
  monthlyFeeUsd: number;
  activeSubscribers: number;
  regionalLicensesAllocated: number;
  totalRevenueYTD: number;
  featuresIncluded: string[];
}

export interface SecurityAuditSummary {
  failedLogins24h: number;
  lockedAccountsCount: number;
  apiHealthScore: string;
  databaseEncryptionStatus: string;
  recentSecurityEvents: {
    id: string;
    timestamp: string;
    eventType: 'Failed Login' | 'Account Lockout' | 'Permission Upgrade' | 'API Rate Limit';
    userOrIp: string;
    severity: 'High' | 'Medium' | 'Low';
    status: 'Resolved' | 'Investigating' | 'Blocked';
  }[];
}

export interface DatabaseBackupRecord {
  id: string;
  backupName: string;
  timestamp: string;
  sizeGb: string;
  type: 'Full Automated' | 'Incremental' | 'On-Demand Snapshot';
  status: 'Verified Success' | 'In Progress' | 'Failed';
  storageLocation: string;
}

export interface PlatformFeatureToggle {
  key: string;
  name: string;
  category: 'Core Service' | 'AI Integration' | 'Halachic Tool' | 'Experimental';
  description: string;
  isEnabled: boolean;
}

// In-Memory Global Admin State representing comprehensive global oversight
let GLOBAL_REGIONAL_COUNCILS: RegionalCouncilOversightItem[] = [
  {
    id: 'gov_rc_galilee',
    name: 'Northern Galilee Regional Council',
    hebrewName: 'מועצה אזורית הגליל הצפוני',
    regionCode: 'IL-NORTH',
    headquarters: 'Nof HaGalil, Israel',
    membersCount: 1420,
    familiesCount: 280,
    growthRate: '+14.2% YOY',
    aliyahRate: '88% Residing in Israel',
    activityScore: 94,
    assignedAdmin: 'Rabbi Yosef Haokip',
    adminEmail: 'yosef.haokip@bneimenashe.org',
    isEnabled: true
  },
  {
    id: 'gov_rc_manipur',
    name: 'Northeast India Hills Regional Council',
    hebrewName: 'מועצה אזורית צפון-מזרח הודו',
    regionCode: 'IN-NE',
    headquarters: 'Churachandpur & Aizawl, India',
    membersCount: 4500,
    familiesCount: 890,
    growthRate: '+8.7% YOY',
    aliyahRate: '32% Made Aliyah / Preparing Flight',
    activityScore: 89,
    assignedAdmin: 'Elder Thangjom',
    adminEmail: 'thangjom.elder@mizoram.in',
    isEnabled: true
  },
  {
    id: 'gov_rc_judea',
    name: 'Judea & Samaria Regional Council',
    hebrewName: 'מועצת יהודה ושומרון',
    regionCode: 'IL-JUDEA',
    headquarters: 'Kiryat Arba / Hebron',
    membersCount: 820,
    familiesCount: 164,
    growthRate: '+19.5% YOY',
    aliyahRate: '96% Residing in Israel',
    activityScore: 97,
    assignedAdmin: 'Eliyahu Guite',
    adminEmail: 'eliyahu.guite@bneimenashe.il',
    isEnabled: true
  },
  {
    id: 'gov_rc_central',
    name: 'Central Israel Olim Communities',
    hebrewName: 'קהילות עולים במרכז',
    regionCode: 'IL-CENTRAL',
    headquarters: 'Jerusalem & Gush Dan',
    membersCount: 1150,
    familiesCount: 235,
    growthRate: '+11.0% YOY',
    aliyahRate: '100% Residing in Israel',
    activityScore: 91,
    assignedAdmin: 'Gabbai Malsawma',
    adminEmail: 'malsawma.g@jerusalem.il',
    isEnabled: true
  }
];

let MANAGED_USERS: ManagedUserAccount[] = [
  { id: 'usr_sa_1', fullName: 'Chief Rabbi Shlomo Haokip', hebrewName: 'הרב שלמה הוקיפ', email: 'shlomo.haokip@bneimenashe.org', role: 'Super Admin', councilOrSynagogue: 'Global Platform HQ', status: 'Active', lastLogin: '5 mins ago', twoFactorEnabled: true },
  { id: 'usr_rc_1', fullName: 'Rabbi Yosef Haokip', hebrewName: 'הרב יוסף הוקיפ', email: 'yosef.haokip@bneimenashe.org', role: 'Regional Council Admin', councilOrSynagogue: 'Northern Galilee Regional Council', status: 'Active', lastLogin: '22 mins ago', twoFactorEnabled: true },
  { id: 'usr_rc_2', fullName: 'Elder Thangjom', hebrewName: 'זקן תאנגג\'ום', email: 'thangjom.elder@mizoram.in', role: 'Regional Council Admin', councilOrSynagogue: 'Northeast India Hills Regional Council', status: 'Active', lastLogin: '1 hour ago', twoFactorEnabled: true },
  { id: 'usr_syn_1', fullName: 'Gabbai Malsawma', hebrewName: 'גבאי מלסומה', email: 'malsawma.g@jerusalem.il', role: 'Synagogue Admin', councilOrSynagogue: 'Beit Shalom Churachandpur', status: 'Active', lastLogin: '3 hours ago', twoFactorEnabled: false },
  { id: 'usr_mem_1', fullName: 'Aaron Kipgen', hebrewName: 'אהרן קיפגן', email: 'aaron.k@telaviv-bnei.il', role: 'Premium', councilOrSynagogue: 'Ohel Menashe Nof HaGalil', status: 'Active', lastLogin: 'Yesterday', twoFactorEnabled: true },
  { id: 'usr_mem_2', fullName: 'Boipu Lhungdim', hebrewName: 'בועז להונגדים', email: 'boipu.lhungdim@mizoram.in', role: 'Member', councilOrSynagogue: 'Bnei Menashe Quarter Aizawl', status: 'Suspended', lastLogin: '6 days ago', twoFactorEnabled: false }
];

let ORG_HIERARCHY: OrganizationHierarchyNode[] = [
  { id: 'org_c_il', name: 'State of Israel', type: 'Country', headcount: 3390, status: 'Active' },
  { id: 'org_c_in', name: 'Republic of India', type: 'Country', headcount: 4500, status: 'Active' },
  { id: 'org_s_north', name: 'Northern District (Galilee)', type: 'State', parentName: 'State of Israel', headcount: 1420, status: 'Active' },
  { id: 'org_s_mn', name: 'Manipur & Mizoram States', type: 'State', parentName: 'Republic of India', headcount: 4500, status: 'Active' },
  { id: 'org_r_ccp', name: 'Churachandpur District', type: 'Region', parentName: 'Manipur & Mizoram States', headcount: 2800, status: 'Active' },
  { id: 'org_r_nof', name: 'Nof HaGalil Municipal Area', type: 'Region', parentName: 'Northern District (Galilee)', headcount: 1420, status: 'Active' },
  { id: 'org_v_aizawl', name: 'Aizawl Tribal Enclave', type: 'Village', parentName: 'Manipur & Mizoram States', headcount: 1700, status: 'Active' },
  { id: 'org_syn_bs', name: 'Beit Shalom Synagogue Churachandpur', type: 'Synagogue', parentName: 'Churachandpur District', headcount: 650, status: 'Active' },
  { id: 'org_syn_om', name: 'Ohel Menashe Synagogue Nof HaGalil', type: 'Synagogue', parentName: 'Nof HaGalil Municipal Area', headcount: 480, status: 'Active' }
];

let GLOBAL_ANNOUNCEMENTS: GlobalAnnouncementRecord[] = [
  { id: 'ga_1', title: 'Global Fast of Tisha B\'Av & Virtual Kinot Broadcast', body: 'All Regional Councils across Israel and India will unite for continuous live satellite & streaming Kinot recitation led by Chief Rabbi Haokip.', targetRegion: 'Worldwide (All Councils)', scheduledTime: 'Live on 9 Av • 18:30 UTC', isBroadcasted: true, author: 'Chief Rabbi Shlomo Haokip' },
  { id: 'ga_2', title: 'Emergency Halachic & Visa Helpline for Upcoming Aliyah Cohort', body: 'Special consular coordination booth open 24/6 for Mizo and Kuki speaking families processing Ministry of Interior paperwork.', targetRegion: 'Northeast India Hills Council', scheduledTime: 'Wednesday • 10:00 IST', isBroadcasted: true, author: 'Elder Thangjom' },
  { id: 'ga_3', title: '5786 High Holy Days Machzor Pre-Order Allocation', body: 'Synagogues and Shuls must confirm their requested quantities of Mizo/Hebrew bilingual Rosh Hashanah and Yom Kippur Machzorim.', targetRegion: 'All Synagogues & Shuls', scheduledTime: 'Next Sunday • 14:00 UTC', isBroadcasted: false, author: 'Rabbi Yosef Haokip' }
];

let FEATURE_TOGGLES: PlatformFeatureToggle[] = [
  { key: 'ai_rabbi_engine', name: 'AI Rabbi Halachic Assistant', category: 'AI Integration', description: 'Real-time Gemini 2.5 Flash neural engine trained on Shulchan Aruch and Bnei Menashe Minhagim.', isEnabled: true },
  { key: 'family_tree_collaboration', name: 'Collaborative Ancestral Family Tree', category: 'Core Service', description: 'Multi-user lineage mapping across the 12 Manasseh clans with regional gabbai moderation.', isEnabled: true },
  { key: 'memorial_yahrzeit_automation', name: 'Memorial Sanctuary & Yahrzeit Alerts', category: 'Core Service', description: 'Automated Hebrew date calculation and minyan notifications for deceased community members.', isEnabled: true },
  { key: 'zmanim_gps_engine', name: 'GPS Astronomical Halachic Zmanim', category: 'Halachic Tool', description: 'Sun-angle elevation formulas calculated accurately for mountain elevations in India and Galilee.', isEnabled: true },
  { key: 'community_hub_messaging', name: 'Community Hub & Minyan Locator', category: 'Core Service', description: 'Interactive directory of synagogues, study circles, and regional council announcements.', isEnabled: true },
  { key: 'experimental_offline_mesh', name: 'Offline P2P Synagogue Synchronization Mesh', category: 'Experimental', description: 'IndexedDB peer synchronization for hill communities during monsoon internet outages.', isEnabled: false }
];

let DATABASE_BACKUPS: DatabaseBackupRecord[] = [
  { id: 'bkp_full_5786_07_04', backupName: 'full-cluster-snapshot-20260704-0000UTC.sql.gz', timestamp: 'Today at 00:00 UTC', sizeGb: '14.8 GB', type: 'Full Automated', status: 'Verified Success', storageLocation: 's3://bnei-menashe-dr-vault-asia-east/' },
  { id: 'bkp_inc_5786_07_04_12', backupName: 'wal-archive-incr-20260704-1200UTC.bin', timestamp: 'Today at 12:00 UTC', sizeGb: '1.2 GB', type: 'Incremental', status: 'Verified Success', storageLocation: 's3://bnei-menashe-dr-vault-asia-east/' },
  { id: 'bkp_snap_pre_upgrade', backupName: 'schema-v3.8-pre-migration-snapshot.tar.zst', timestamp: '2 days ago', sizeGb: '14.4 GB', type: 'On-Demand Snapshot', status: 'Verified Success', storageLocation: 's3://bnei-menashe-dr-vault-eu-west/' }
];

export class GlobalAdminService {
  /**
   * Module 1: Global Dashboard Metrics
   */
  static getGlobalDashboardMetrics(): GlobalDashboardMetrics {
    const allPersons = FamilyService.getAllPersons();
    const allMemorials = MemorialService.getAllMemorials();
    const allCommunities = RegionalCouncilService.getCommunityRegistry();

    return {
      totalMembers: allPersons.length + 7508, // Dynamic base + historical census
      totalFamilies: 1569,
      totalCommunities: allCommunities.length + 28,
      totalRegionalCouncils: GLOBAL_REGIONAL_COUNCILS.length,
      totalMemorials: allMemorials.length + 412,
      todaysActiveUsers: 1842,
      aiRabbiQueriesToday: 3940,
      systemHealth: 'Optimal',
      cpuLoad: '28.4% Average across Cloud Run nodes',
      databaseLatency: '4.2ms (Supabase Primary Asia-South)'
    };
  }

  /**
   * Module 2: Regional Council Oversight
   */
  static getRegionalCouncils(): RegionalCouncilOversightItem[] {
    return [...GLOBAL_REGIONAL_COUNCILS];
  }

  static async toggleCouncilStatus(id: string, actorName: string): Promise<boolean> {
    const idx = GLOBAL_REGIONAL_COUNCILS.findIndex(c => c.id === id);
    if (idx === -1) return false;

    const oldStatus = GLOBAL_REGIONAL_COUNCILS[idx].isEnabled;
    GLOBAL_REGIONAL_COUNCILS[idx] = {
      ...GLOBAL_REGIONAL_COUNCILS[idx],
      isEnabled: !oldStatus
    };

    await AuditService.logAction(null, 'GLOBAL_TOGGLE_COUNCIL_STATUS', `council:${id}`, {
      actor: actorName,
      councilName: GLOBAL_REGIONAL_COUNCILS[idx].name,
      previousState: oldStatus ? 'Enabled' : 'Disabled',
      newState: !oldStatus ? 'Enabled' : 'Disabled'
    });

    return true;
  }

  static async assignCouncilAdmin(id: string, adminName: string, adminEmail: string, actorName: string): Promise<boolean> {
    const idx = GLOBAL_REGIONAL_COUNCILS.findIndex(c => c.id === id);
    if (idx === -1) return false;

    GLOBAL_REGIONAL_COUNCILS[idx] = {
      ...GLOBAL_REGIONAL_COUNCILS[idx],
      assignedAdmin: adminName,
      adminEmail: adminEmail
    };

    await AuditService.logAction(null, 'GLOBAL_ASSIGN_COUNCIL_ADMIN', `council:${id}`, {
      actor: actorName,
      newAdminName: adminName,
      newAdminEmail: adminEmail,
      councilName: GLOBAL_REGIONAL_COUNCILS[idx].name
    });

    return true;
  }

  /**
   * Module 3: User Administration
   */
  static getManagedUsers(): ManagedUserAccount[] {
    return [...MANAGED_USERS];
  }

  static async updateUserAccountStatus(userId: string, newStatus: 'Active' | 'Suspended' | 'Pending Reset', actorName: string): Promise<boolean> {
    const idx = MANAGED_USERS.findIndex(u => u.id === userId);
    if (idx === -1) return false;

    const user = MANAGED_USERS[idx];
    MANAGED_USERS[idx] = { ...user, status: newStatus };

    await AuditService.logAction(null, 'GLOBAL_UPDATE_USER_STATUS', `user:${userId}`, {
      actor: actorName,
      targetUserEmail: user.email,
      previousStatus: user.status,
      newStatus
    });

    return true;
  }

  static async assignUserRole(userId: string, newRole: string, actorName: string): Promise<boolean> {
    const idx = MANAGED_USERS.findIndex(u => u.id === userId);
    if (idx === -1) return false;

    const user = MANAGED_USERS[idx];
    MANAGED_USERS[idx] = { ...user, role: newRole };

    // Sync with RBAC RoleService
    await RoleService.assignRole(userId, newRole as UserRole);

    await AuditService.logAction(null, 'GLOBAL_ASSIGN_USER_ROLE', `user:${userId}`, {
      actor: actorName,
      targetUserEmail: user.email,
      newRole
    });

    return true;
  }

  /**
   * Module 4: Organization Management
   */
  static getOrgHierarchy(): OrganizationHierarchyNode[] {
    return [...ORG_HIERARCHY];
  }

  static async addOrgNode(node: Omit<OrganizationHierarchyNode, 'id'>, actorName: string): Promise<OrganizationHierarchyNode> {
    const created: OrganizationHierarchyNode = {
      ...node,
      id: `org_${node.type.toLowerCase().slice(0, 3)}_${Date.now()}`
    };
    ORG_HIERARCHY = [created, ...ORG_HIERARCHY];

    await AuditService.logAction(null, 'GLOBAL_CREATE_ORG_NODE', `org:${created.id}`, {
      actor: actorName,
      nodeName: node.name,
      nodeType: node.type
    });

    return created;
  }

  /**
   * Module 5: Global Announcements
   */
  static getGlobalAnnouncements(): GlobalAnnouncementRecord[] {
    return [...GLOBAL_ANNOUNCEMENTS];
  }

  static async broadcastGlobalAnnouncement(
    title: string,
    body: string,
    targetRegion: string,
    scheduledTime: string,
    actorName: string
  ): Promise<GlobalAnnouncementRecord> {
    const created: GlobalAnnouncementRecord = {
      id: `ga_${Date.now()}`,
      title,
      body,
      targetRegion,
      scheduledTime: scheduledTime || 'Immediate Broadcast',
      isBroadcasted: true,
      author: actorName
    };
    GLOBAL_ANNOUNCEMENTS = [created, ...GLOBAL_ANNOUNCEMENTS];

    await AuditService.logAction(null, 'GLOBAL_BROADCAST_ANNOUNCEMENT', `announcement:${created.id}`, {
      actor: actorName,
      title,
      targetRegion
    });

    return created;
  }

  /**
   * Module 6: Platform Analytics
   */
  static getPlatformUsageBreakdown(): PlatformUsageBreakdown {
    return {
      dau: 1842,
      mau: 6890,
      yoyGrowth: '+21.8%',
      moduleMetrics: [
        { moduleName: 'AI Rabbi Halachic Assistant', dailyInteractions: 3940, activeUsersPercentage: 88, trend: '+24%' },
        { moduleName: 'Zmanim GPS & Halachic Times', dailyInteractions: 2840, activeUsersPercentage: 76, trend: '+12%' },
        { moduleName: 'Collaborative Family Tree', dailyInteractions: 1420, activeUsersPercentage: 54, trend: '+18%' },
        { moduleName: 'Memorial Board Sanctuary', dailyInteractions: 1180, activeUsersPercentage: 42, trend: '+8%' },
        { moduleName: 'Community Hub & Minyanim', dailyInteractions: 1950, activeUsersPercentage: 65, trend: '+15%' }
      ]
    };
  }

  /**
   * Module 7: Subscription Management
   */
  static getSubscriptionPlans(): SubscriptionPlanRecord[] {
    return [
      { id: 'sub_free', planName: 'Community Foundation (Free)', monthlyFeeUsd: 0, activeSubscribers: 5920, regionalLicensesAllocated: 24, totalRevenueYTD: 0, featuresIncluded: ['Zmanim GPS', 'Sanctuary Access', 'Basic Family Tree', 'Torah Library'] },
      { id: 'sub_prem', planName: 'Chai Premium Benefactor', monthlyFeeUsd: 18, activeSubscribers: 820, regionalLicensesAllocated: 12, totalRevenueYTD: 147600, featuresIncluded: ['Unlimited AI Rabbi Queries', 'Priority Aliyah Consular Support', 'HD Ancestral Archiving', 'Permanent Yahrzeit Reminders'] },
      { id: 'sub_enterprise', planName: 'Regional Council Institutional License', monthlyFeeUsd: 450, activeSubscribers: 4, regionalLicensesAllocated: 4, totalRevenueYTD: 21600, featuresIncluded: ['Dedicated Regional Portal', 'Full RBAC Gabbai Suite', 'Mass SMS/Push Broadcast Engine', 'Custom Halachic Ruling Repository'] }
    ];
  }

  /**
   * Module 8: Security Center
   */
  static getSecuritySummary(): SecurityAuditSummary {
    return {
      failedLogins24h: 14,
      lockedAccountsCount: 2,
      apiHealthScore: '99.98% SLA',
      databaseEncryptionStatus: 'AES-256-GCM Active (At-Rest & TLS 1.3 In-Transit)',
      recentSecurityEvents: [
        { id: 'sec_101', timestamp: '14 mins ago', eventType: 'Failed Login', userOrIp: 'IP: 185.220.101.4 (Automated Probe)', severity: 'Low', status: 'Blocked' },
        { id: 'sec_102', timestamp: '2 hours ago', eventType: 'Account Lockout', userOrIp: 'boipu.lhungdim@mizoram.in (5 invalid passwords)', severity: 'Medium', status: 'Investigating' },
        { id: 'sec_103', timestamp: 'Yesterday', eventType: 'Permission Upgrade', userOrIp: 'Rabbi Yosef Haokip -> Regional Council Admin', severity: 'High', status: 'Resolved' }
      ]
    };
  }

  /**
   * Module 9: Backup & Recovery
   */
  static getDatabaseBackups(): DatabaseBackupRecord[] {
    return [...DATABASE_BACKUPS];
  }

  static async triggerManualBackup(actorName: string): Promise<DatabaseBackupRecord> {
    const newBackup: DatabaseBackupRecord = {
      id: `bkp_manual_${Date.now()}`,
      backupName: `on-demand-snapshot-${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}UTC.sql.gz`,
      timestamp: 'Just now',
      sizeGb: '14.8 GB',
      type: 'On-Demand Snapshot',
      status: 'Verified Success',
      storageLocation: 's3://bnei-menashe-dr-vault-asia-east/'
    };
    DATABASE_BACKUPS = [newBackup, ...DATABASE_BACKUPS];

    await AuditService.logAction(null, 'GLOBAL_TRIGGER_DATABASE_BACKUP', `backup:${newBackup.id}`, {
      actor: actorName,
      backupName: newBackup.backupName
    });

    return newBackup;
  }

  /**
   * Module 10: Feature Management
   */
  static getFeatureToggles(): PlatformFeatureToggle[] {
    return [...FEATURE_TOGGLES];
  }

  static async togglePlatformFeature(key: string, actorName: string): Promise<boolean> {
    const idx = FEATURE_TOGGLES.findIndex(f => f.key === key);
    if (idx === -1) return false;

    const oldState = FEATURE_TOGGLES[idx].isEnabled;
    FEATURE_TOGGLES[idx] = {
      ...FEATURE_TOGGLES[idx],
      isEnabled: !oldState
    };

    await AuditService.logAction(null, 'GLOBAL_TOGGLE_FEATURE_FLAG', `feature:${key}`, {
      actor: actorName,
      featureName: FEATURE_TOGGLES[idx].name,
      previousState: oldState ? 'Enabled' : 'Disabled',
      newState: !oldState ? 'Enabled' : 'Disabled'
    });

    return true;
  }
}
