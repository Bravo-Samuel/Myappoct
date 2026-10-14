export type NavSection = 
  | 'dashboard' 
  | 'my_journey'
  | 'activity_center'
  | 'document_center'
  | 'service_center'
  | 'operations_center'
  | 'profile'
  | 'calendar' 
  | 'zmanim' 
  | 'holidays' 
  | 'parashah' 
  | 'memorial' 
  | 'sanctuary' 
  | 'torah_library' 
  | 'ai_rabbi' 
  | 'community' 
  | 'family' 
  | 'donations' 
  | 'analytics' 
  | 'admin_console'
  | 'security_audit'
  | 'enterprise_dashboard'
  | 'phase3_governance'
  | 'supabase_foundation'
  | 'auth_portal'
  | 'scalable_architecture'
  | 'regional_council'
  | 'global_admin_console'
  | 'family_purity'
  | 'census_demographics'
  | 'communications_center'
  | 'enterprise_sysadmin'
  | 'lifecycle_registry'
  | 'settings';

export type SupportedLanguage = 'English' | 'Hebrew' | 'Mizo' | 'Thadou' | 'Kuki';

export type EnterpriseRole = 
  | 'Guest'
  | 'Member'
  | 'Premium'
  | 'Family Admin'
  | 'Synagogue Admin'
  | 'Regional Council Admin'
  | 'Content Editor'
  | 'Moderator'
  | 'Support'
  | 'System Administrator'
  | 'DevOps'
  | 'Super Admin';

export interface GranularPermission {
  key: string;
  label: string;
  category: 'System' | 'Tenancy' | 'Halacha & Content' | 'Security & Audit' | 'AI Control';
  description: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
    role: EnterpriseRole;
  };
  ipAddress: string;
  device: string;
  action: string;
  category: 'AUTH' | 'TENANT' | 'HALACHA' | 'SECURITY' | 'BILLING' | 'AI_QUERY';
  previousValue?: string;
  newValue?: string;
  status: 'SUCCESS' | 'BLOCKED' | 'FLAGGED';
}

export interface ApiEndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  requiredRole: EnterpriseRole;
  rateLimit: string;
  caching: string;
  responseSchemaPreview: string;
}

export interface DbTableSpec {
  tableName: string;
  description: string;
  rowCountEstimate: string;
  columns: {
    name: string;
    type: string;
    isPrimaryKey?: boolean;
    isForeignKey?: boolean;
    isNullable?: boolean;
    description: string;
  }[];
  indexes: string[];
}

export interface NotificationDispatchRecord {
  id: string;
  timestamp: string;
  channel: 'Push' | 'WhatsApp' | 'SMS' | 'Email' | 'In-App';
  recipientGroup: string;
  title: string;
  message: string;
  status: 'Delivered' | 'Scheduled' | 'Queued';
}

export interface LocationOption {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
}

export interface ZmanItem {
  key: string;
  label: string;
  hebrewLabel: string;
  time: string;
  description: string;
  isKeyEvent?: boolean;
}

export interface HolidayEvent {
  id: string;
  name: string;
  hebrewName: string;
  date: string;
  hebrewDate: string;
  category: 'Major Holiday' | 'Fast Day' | 'Rosh Chodesh' | 'Memorial / Yahrzeit';
  description: string;
  customs: string[];
}

export interface TorahStudyItem {
  id: string;
  title: string;
  hebrewTitle: string;
  subtitle: string;
  category: 'Parashah' | 'Daf Yomi' | '48 Ways' | 'Halacha' | 'Tehillim';
  progress: number; // 0 to 100
  dailyGoal: string;
  lastRead?: string;
}

export interface AIRabbiMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  language?: string;
  mode?: 'qa' | 'translate' | 'parashah' | 'halacha';
  isVoiceAudio?: boolean;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  billingCycle: string;
  badge: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  hebrewName: string;
  relation: string;
  birthplace: string;
  location: string;
  yahrzeitHebrewDate?: string;
  photoUrl?: string;
  generation: number;
}

export interface FamilyTreePerson {
  id: string;
  familyClan: 'Haokip' | 'Singson' | 'Lhungdim' | 'Touthang' | 'Kipgen' | 'Other';
  name: string;
  hebrewName: string;
  gender: 'Male' | 'Female';
  birthDate: string;
  hebrewBirthDate: string;
  isDeceased: boolean;
  passingDate?: string;
  hebrewPassingDate?: string;
  memorialRecordId?: string;
  biography: string;
  villageOfOrigin: string;
  community: string;
  regionalCouncil: string;
  occupation: string;
  aliyahStatus: 'Made Aliyah' | 'In India Awaiting Aliyah' | 'In Transit / Processing' | 'Born in Israel';
  portraitUrl?: string;
  achievements: string[];
  familyRole: string;
  communityParticipation: string;
  generation: number; // 1=Patriarchs/Great-Grandparents, 2=Grandparents, 3=Parents/Aunts/Uncles, 4=Current/Siblings/Spouses, 5=Children, 6=Grandchildren
  parentIds: string[];
  spouseIds: string[];
  childIds: string[];
  siblingIds: string[];
  canEdit?: boolean;
}

export interface FamilyTimelineEvent {
  id: string;
  personId?: string;
  familyClan: string;
  year: string;
  date: string;
  hebrewDate: string;
  eventType: 'Birth' | 'Marriage' | 'Aliyah' | 'Community Leadership' | 'Memorial Event' | 'Migration';
  title: string;
  description: string;
  location: string;
  imageUrl?: string;
}

export interface FamilyHeritageRecord {
  clanName: string;
  hebrewClanName: string;
  villageHistory: string;
  migrationPath: string[];
  historicalNotes: string;
  communityPhotographs: {
    id: string;
    url: string;
    caption: string;
    year: string;
    location: string;
  }[];
}

export interface CommunityAnnouncement {
  id: string;
  title: string;
  synagogue: string;
  location: string;
  date: string;
  category: 'Minyan' | 'Study Group' | 'Volunteer' | 'Live Stream' | 'Simcha';
  attendees: number;
  description: string;
}

// Phase 2 Enterprise Architectural Governance Interfaces

export interface MasterWorkflowRequest<T = any> {
  actionId: string;
  actionName: string;
  actorRole: EnterpriseRole;
  actorEmail: string;
  requiredPermission: string;
  payload: T;
  tenantId?: string;
}

export interface MasterWorkflowExecutionResult<R = any> {
  success: boolean;
  stepCompleted: 'USER_CLICK' | 'PERMISSION_VALIDATION' | 'INPUT_VALIDATION' | 'BUSINESS_RULES' | 'DB_TRANSACTION' | 'AUDIT_LOG' | 'ANALYTICS_EVENT' | 'NOTIFICATION_DISPATCH' | 'UI_REFRESH' | 'FEEDBACK';
  executionId: string;
  timestamp: string;
  data?: R;
  errorMessage?: string;
  latencyMs: number;
}

export interface EnterpriseEvent {
  id: string;
  eventType: 'USER_REGISTERED' | 'FAMILY_CREATED' | 'PRAYER_ADDED' | 'MEMORIAL_UPDATED' | 'HOLIDAY_IMPORTED' | 'AI_CONVERSATION_COMPLETED' | 'SUBSCRIPTION_RENEWED' | 'COMMUNITY_ANNOUNCEMENT_PUBLISHED' | 'SECURITY_ALERT_TRIGGERED';
  timestamp: string;
  tenantId: string;
  actor: string;
  payload: Record<string, any>;
}

export interface BackgroundJobItem {
  id: string;
  jobType: 'EMAIL_DISPATCH' | 'SMS_DISPATCH' | 'WHATSAPP_DISPATCH' | 'PUSH_DISPATCH' | 'CALENDAR_CALCULATIONS' | 'ASTRONOMICAL_ZMANIM_SYNC' | 'AI_RAG_PROCESSING' | 'PDF_REPORT_GENERATION' | 'DB_BACKUP_SNAPSHOT';
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'RETRYING';
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  attempts: number;
  maxRetries: number;
  createdTime: string;
  completedTime?: string;
  errorMessage?: string;
  payloadSummary: string;
}

export interface FeatureFlagConfig {
  key: string;
  name: string;
  description: string;
  status: 'DEVELOPMENT' | 'INTERNAL_TESTING' | 'BETA_USERS' | 'REGIONAL_ROLLOUT' | 'GLOBAL_RELEASE' | 'EMERGENCY_DISABLED';
  rolloutPercentage: number;
  targetRegions: string[];
  minimumRole: EnterpriseRole;
  isEmergencyKillSwitchActive: boolean;
}

export interface InstalledPluginSpec {
  id: string;
  name: string;
  version: string;
  category: 'Genealogy' | 'Aliyah Portal' | 'School Management' | 'Youth Programs' | 'Donations' | 'Volunteer Management' | 'Marketplace' | 'Regional Elections' | 'Hebrew Learning Academy';
  author: string;
  status: 'ACTIVE' | 'SANDBOXED' | 'DISABLED';
  permissionsGranted: string[];
  registeredHooks: string[];
  description: string;
}

export interface SystemObservabilityHealth {
  systemHealthScore: number;
  apiHealth: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  queueHealth: 'OPTIMAL' | 'BACKLOGGED' | 'STALLED';
  dbHealth: 'NORMAL_SYNC' | 'HIGH_LOAD' | 'FAILOVER';
  cacheHitRatePercentage: number;
  storageUsageGB: number;
  storageCapacityGB: number;
  avgLatencyMs: number;
  activeUsersLiveCount: number;
  activeTenantsCount: number;
  monthlyRecurringRevenueUSD: number;
  securityThreatsBlockedToday: number;
}

// Phase 3 CTO / ARB Technical Governance Board Interfaces

export type ArchitectureLifecycleStage = 
  | 'Architecture Review'
  | 'Business Analysis'
  | 'Dependency Analysis'
  | 'Database Review'
  | 'API Review'
  | 'Security Review'
  | 'Performance Review'
  | 'Accessibility Review'
  | 'Scalability Review'
  | 'Implementation'
  | 'Testing'
  | 'Documentation'
  | 'Deployment Plan'
  | 'Monitoring'
  | 'Continuous Improvement';

export interface Phase3ProposalReview {
  id: string;
  title: string;
  author: string;
  category: 'AI Gateway' | 'Database Schema' | 'Edge CDN' | 'Security Policy' | 'Tenancy Engine';
  status: 'PENDING_REVIEW' | 'IN_LIFECYCLE_GATES' | 'APPROVED' | 'REJECTED_NEEDS_REDESIGN';
  currentStage: ArchitectureLifecycleStage;
  completedGates: string[];
  purpose: string;
  businessValue: string;
  acceptanceCriteria: string[];
  modularityScore: number;
  tenYearFutureProofScore: number;
}

export type TenancyTierLevel = 
  | 'Global Platform'
  | 'Country'
  | 'State'
  | 'District'
  | 'Regional Council'
  | 'Synagogue'
  | 'Community'
  | 'Family'
  | 'Member';

export interface TenancyHierarchyNode {
  id: string;
  name: string;
  tier: TenancyTierLevel;
  parentTier?: TenancyTierLevel;
  parentId?: string;
  activeMembersCount: number;
  isolatedDbSchema: string;
  rlsPolicyName: string;
  regionCode: string;
}

export interface SystemOfRecordEntity {
  entityName: string;
  domain: string;
  primaryStorageService: 'Cloud SQL Postgres Cluster' | 'Google Cloud Storage' | 'Firebase Auth' | 'Redis Enterprise';
  syncState: 'ACID_REALTIME' | 'EVENTUAL_CONSISTENCY_100MS' | 'CRON_SNAPSHOT';
  recordCount: string;
  ownerModule: string;
  isSingleSourceOfTruth: boolean;
}

export interface DisasterRecoveryStatus {
  primaryRegion: string;
  replicaRegion: string;
  replicationLagMs: number;
  pitrEnabled: boolean;
  lastSuccessfulSnapshotTime: string;
  recoveryTimeObjectiveMin: number;
  recoveryPointObjectiveSec: number;
  activeFailoverMode: 'PRIMARY_ACTIVE' | 'GRACEFUL_DEGRADATION' | 'READ_ONLY_SAFE_MODE' | 'FAILOVER_TRANSITION';
}

export interface ScalabilityBenchmark {
  tierName: string;
  targetUsersCount: number;
  dbArchitecture: string;
  edgeCachingStrategy: string;
  requiredReadQPS: string;
  avgResponseTargetMs: number;
  estimatedMonthlyComputeCost: string;
  status: 'PROVEN_VERIFIED' | 'STRESS_TESTED' | 'ARCHITECTED_READY';
}

export interface MemorialTribute {
  id: string;
  memorialId: string;
  authorName: string;
  authorRelation: string;
  community: string;
  message: string;
  timestamp: string;
  likes: number;
}

export interface MemorialTimelineItem {
  year: string;
  title: string;
  description: string;
  location: string;
}

export interface MemorialRecord {
  id: string;
  name: string;
  hebrewName: string;
  portraitUrl?: string;
  birthYear: number;
  passingYear: number;
  hebrewPassingDate: string;
  gregorianPassingDate: string;
  relationship: 'Father' | 'Mother' | 'Grandfather' | 'Grandmother' | 'Son' | 'Daughter' | 'Brother' | 'Sister' | 'Community Pioneer' | 'Elder';
  biographyPreview: string;
  fullBiography: string;
  familyName: string;
  village: string;
  community: string;
  candlesCount: number;
  isLitByUser?: boolean;
  timeline: MemorialTimelineItem[];
  galleryUrls: string[];
  memoriesCount: number;
  linkedFamilyMemberId?: string;
  isYahrzeitToday?: boolean;
  psalmRecommendation: {
    number: number;
    title: string;
    hebrewExcerpt: string;
    englishExcerpt: string;
  };
}

export interface BedikaChecklist {
  dayNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  gregorianDateIso: string;
  hebrewDateStr: string;
  morningCompleted: boolean;
  afternoonCompleted: boolean;
  notes?: string;
}

export interface FamilyPurityCycleRecord {
  id: string;
  userId: string;
  startDateIso: string; // Gregorian date of onset
  startAfterSunset: boolean; // Did onset occur after sunset?
  hebrewStartDate: string; // e.g. "14 Adar II 5786"
  hebrewMonthName: string;
  hebrewDayNumber: number;
  hebrewYear: number;
  hesekTaharahDateIso?: string; // Date of Hefsek Taharah
  hesekTaharahAfterSunset?: boolean;
  sevenCleanDaysStartIso?: string; // Day 1 of 7 clean days
  mikvehNightIso?: string; // Calculated 8th night (sunset of 7th clean day)
  mikvehHebrewDate?: string;
  status: 'active_flow' | 'seven_clean_days' | 'tahor';
  bedikot: BedikaChecklist[];
  expectedNextVesetHachodeshIso?: string; // Same Hebrew date next month
  expectedNextVesetHaflagaIso?: string; // Same interval
  expectedNextBeinonitIso?: string; // 30th day
  intervalDays?: number;
  notes?: string;
  createdAt: string;
}

export interface FamilyPuritySettings {
  userId: string;
  biometricLockEnabled: boolean;
  pinCode?: string;
  customRabbiPhone?: string;
  customRabbiName?: string;
  reminderMikvehNight: boolean;
  reminderBedikot: boolean;
  reminderVeset: boolean;
  locationId?: string;
  sessionTimeoutMinutes?: number;
  emergencyHideEnabled?: boolean;
  highContrast?: boolean;
  largeText?: boolean;
  reducedMotion?: boolean;
  reminderTimingHoursBeforeSunset?: number;
  minCleanWaitDays?: number;
}



