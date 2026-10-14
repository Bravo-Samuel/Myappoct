import { AuditService } from './AuditService';
import { RegionalCouncilService } from './RegionalCouncilService';
import { FamilyService } from './FamilyService';

export interface CensusSubmissionRecord {
  id: string;
  headOfHousehold: string;
  hebrewName?: string;
  clanName: string;
  village: string;
  community: string;
  regionalCouncil: string;
  synagogue?: string;
  country: 'India' | 'Israel';
  stateOrDistrict: string;
  memberCount: number;
  childrenCount: number;
  eldersCount: number;
  contactPhone?: string;
  contactEmail?: string;
  aliyahStatus: 'Residing in Israel (Aliyah Completed)' | 'Approved Flight Processing' | 'Pending Aliyah Processing' | 'Residing in India Hills';
  submissionDate: string;
  status: 'Approved' | 'Under Review' | 'Correction Requested' | 'Rejected' | 'Merged';
  reviewNotes?: string;
  lastReviewedBy?: string;
  verificationToken: string;
}

export interface CensusDemographicRegion {
  id: string;
  name: string;
  hebrewName: string;
  country: 'India' | 'Israel';
  stateOrZone: string;
  coordinates: { lat: number; lng: number; mapX: number; mapY: number }; // mapX/mapY in percentage for SVG/interactive canvas
  totalPopulation: number;
  registeredFamilies: number;
  synagoguesCount: number;
  aliyahPercentage: number;
  primaryClans: string[];
  councilName: string;
  contactPerson: string;
  description: string;
}

export interface CensusChartAnalytics {
  populationGrowth: { year: string; indiaPopulation: number; israelPopulation: number; total: number }[];
  ageDistribution: { ageGroup: string; count: number; percentage: number; males: number; females: number }[];
  aliyahProgress: { status: string; count: number; percentage: number; color: string }[];
  familySizeDistribution: { sizeLabel: string; familyCount: number }[];
  communityDistribution: { communityName: string; population: number; council: string }[];
  migrationTimeline: { waveLabel: string; period: string; olimCount: number; keyEvent: string }[];
  educationLevels: { level: string; count: number; percentage: number; color: string }[];
  occupationSummary: { sector: string; count: number; percentage: number }[];
}

export interface CensusDashboardKPIs {
  totalCommunityMembers: number;
  returnedToIsrael: { count: number; percentage: number };
  livingInIndia: { count: number; percentage: number };
  registeredFamilies: number;
  registeredSynagogues: number;
  regionalCouncilsCount: number;
  documentedCommunities: number;
  memorialRecordsCount: number;
  childrenUnder18: { count: number; percentage: number };
  elders65Plus: { count: number; percentage: number };
  maleFemaleRatio: { malePercent: number; femalePercent: number; ratio: string };
  averageHouseholdSize: number;
  newRegistrationsThisMonth: number;
  pendingReviews: number;
  approvedRecords: number;
  rejectedRecords: number;
}

let REGIONAL_MAP_REGIONS: CensusDemographicRegion[] = [
  {
    id: 'reg_churachandpur',
    name: 'Churachandpur (Lamka)',
    hebrewName: 'צ\'וראצ\'אנדפור (למקא)',
    country: 'India',
    stateOrZone: 'Manipur Hills',
    coordinates: { lat: 24.3333, lng: 93.6833, mapX: 78, mapY: 48 },
    totalPopulation: 3450,
    registeredFamilies: 580,
    synagoguesCount: 12,
    aliyahPercentage: 38,
    primaryClans: ['Haokip', 'Kipgen', 'Sitlhou', 'Thangjom', 'Misao'],
    councilName: 'Northeast India Hills Regional Council',
    contactPerson: 'Elder Lunkholal Haokip',
    description: 'Historic heartland of Bnei Menashe Shabbat observance in Manipur, home to Beit Shalom and the central Torah study center.'
  },
  {
    id: 'reg_imphal',
    name: 'Imphal & Kangpokpi',
    hebrewName: 'אימפאל וקאנגפוקפי',
    country: 'India',
    stateOrZone: 'Manipur Valley & North',
    coordinates: { lat: 24.8170, lng: 93.9368, mapX: 82, mapY: 36 },
    totalPopulation: 1120,
    registeredFamilies: 195,
    synagoguesCount: 5,
    aliyahPercentage: 42,
    primaryClans: ['Doungel', 'Hangshing', 'Singson', 'Chongloi'],
    councilName: 'Northeast India Hills Regional Council',
    contactPerson: 'Coordinator Benyamin Doungel',
    description: 'Vibrant communities spanning Imphal township and the northern Kangpokpi district hills.'
  },
  {
    id: 'reg_aizawl',
    name: 'Aizawl & Lunglei',
    hebrewName: 'אייזול ולונגליי',
    country: 'India',
    stateOrZone: 'Mizoram State',
    coordinates: { lat: 23.7307, lng: 92.7173, mapX: 72, mapY: 64 },
    totalPopulation: 1492,
    registeredFamilies: 265,
    synagoguesCount: 6,
    aliyahPercentage: 45,
    primaryClans: ['Lhungdim', 'Chhangte', 'Ralte', 'Pachuau', 'Hmar'],
    councilName: 'Northeast India Hills Regional Council',
    contactPerson: 'Coordinator Chhunga Lhungdim',
    description: 'Flourishing Mizoram community center renowned for Passover baking initiatives and youth Hebrew choirs.'
  },
  {
    id: 'reg_nof_hagalil',
    name: 'Nof HaGalil & Galilee',
    hebrewName: 'נוף הגליל והצפון',
    country: 'Israel',
    stateOrZone: 'Northern Israel District',
    coordinates: { lat: 32.7056, lng: 35.2978, mapX: 25, mapY: 28 },
    totalPopulation: 2380,
    registeredFamilies: 395,
    synagoguesCount: 6,
    aliyahPercentage: 100,
    primaryClans: ['Haokip', 'Kipgen', 'Singson', 'Guite'],
    councilName: 'Northern Galilee Regional Council',
    contactPerson: 'Rabbi Yosef Haokip',
    description: 'The largest Bnei Menashe Aliyah hub in northern Israel, featuring Ohel Menashe Synagogue and active youth integration programs.'
  },
  {
    id: 'reg_haifa_north',
    name: 'Haifa & Ma\'alot-Tarshiha',
    hebrewName: 'חיפה ומעלות-תרשיחא',
    country: 'Israel',
    stateOrZone: 'Coastal & Western Galilee',
    coordinates: { lat: 32.8191, lng: 34.9983, mapX: 20, mapY: 34 },
    totalPopulation: 980,
    registeredFamilies: 162,
    synagoguesCount: 3,
    aliyahPercentage: 100,
    primaryClans: ['Touthang', 'Gangte', 'Vaiphei'],
    councilName: 'Northern Galilee Regional Council',
    contactPerson: 'Gabbai Shalom Singson',
    description: 'Coastal and mountain Aliyah communities thriving in high-tech careers and university education.'
  },
  {
    id: 'reg_kiryat_arba',
    name: 'Kiryat Arba & Judea',
    hebrewName: 'קריית ארבע ויהודה',
    country: 'Israel',
    stateOrZone: 'Judea & Samaria',
    coordinates: { lat: 31.5283, lng: 35.1095, mapX: 28, mapY: 58 },
    totalPopulation: 1150,
    registeredFamilies: 185,
    synagoguesCount: 4,
    aliyahPercentage: 100,
    primaryClans: ['Sitlhou', 'Guite', 'Lhungdim'],
    councilName: 'Judea & Samaria Regional Council',
    contactPerson: 'Eliyahu Guite',
    description: 'Historic settlement community where early Bnei Menashe Aliyah pioneers established deep Torah roots.'
  },
  {
    id: 'reg_central_israel',
    name: 'Jerusalem & Central Israel',
    hebrewName: 'ירושלים והמרכז (לוד, רמלה)',
    country: 'Israel',
    stateOrZone: 'Jerusalem & Lowlands',
    coordinates: { lat: 31.7683, lng: 35.2137, mapX: 26, mapY: 50 },
    totalPopulation: 910,
    registeredFamilies: 154,
    synagoguesCount: 3,
    aliyahPercentage: 100,
    primaryClans: ['Haokip', 'Doungel', 'Kipgen', 'Misao'],
    councilName: 'Central Israel Olim Communities',
    contactPerson: 'Avraham Sitlhou',
    description: 'Dynamic urban professionals, IDF officers, and yeshiva students residing in Jerusalem, Lod, Ramla, and Be\'er Sheva.'
  }
];

let CENSUS_SUBMISSIONS: CensusSubmissionRecord[] = [
  {
    id: 'CEN-2026-8401',
    headOfHousehold: 'Lunkholal Haokip',
    hebrewName: 'לונכהולל הוקיפ',
    clanName: 'Haokip',
    village: 'Churachandpur',
    community: 'Beit Shalom Community',
    regionalCouncil: 'Northeast India Hills Regional Council',
    synagogue: 'Beit Shalom Synagogue Churachandpur',
    country: 'India',
    stateOrDistrict: 'Manipur',
    memberCount: 14,
    childrenCount: 5,
    eldersCount: 2,
    contactPhone: '+91 98621 44512',
    contactEmail: 'lunkholal.haokip@bneimenashe.org',
    aliyahStatus: 'Approved Flight Processing',
    submissionDate: '2026-07-01',
    status: 'Approved',
    reviewNotes: 'Verified against Churachandpur synagogue register. Ready for next Aliyah transport.',
    lastReviewedBy: 'Rabbi Yosef Haokip',
    verificationToken: 'BMC-CEN-8401-VERIFIED'
  },
  {
    id: 'CEN-2026-8402',
    headOfHousehold: 'Aaron Kipgen',
    hebrewName: 'אהרן קיפגן',
    clanName: 'Kipgen',
    village: 'Nof HaGalil Center',
    community: 'Galilee Olim Quarter',
    regionalCouncil: 'Northern Galilee Regional Council',
    synagogue: 'Ohel Menashe Nof HaGalil',
    country: 'Israel',
    stateOrDistrict: 'Northern District',
    memberCount: 8,
    childrenCount: 3,
    eldersCount: 1,
    contactPhone: '+972 54 892 1104',
    contactEmail: 'aaron.kipgen@israel-bnei.il',
    aliyahStatus: 'Residing in Israel (Aliyah Completed)',
    submissionDate: '2026-06-28',
    status: 'Approved',
    reviewNotes: 'Census verified. Family active in Ohel Menashe synagogue leadership.',
    lastReviewedBy: 'Global Admin Console',
    verificationToken: 'BMC-CEN-8402-VERIFIED'
  },
  {
    id: 'CEN-2026-8403',
    headOfHousehold: 'Boipu Lhungdim',
    hebrewName: 'בועז להונגדים',
    clanName: 'Lhungdim',
    village: 'Bnei Menashe Quarter Aizawl',
    community: 'Aizawl Community Hub',
    regionalCouncil: 'Northeast India Hills Regional Council',
    synagogue: 'Shalom Mizoram Minyan',
    country: 'India',
    stateOrDistrict: 'Mizoram',
    memberCount: 6,
    childrenCount: 2,
    eldersCount: 0,
    contactPhone: '+91 94361 88920',
    contactEmail: 'boipu.lhungdim@mizoram.in',
    aliyahStatus: 'Pending Aliyah Processing',
    submissionDate: '2026-07-03',
    status: 'Under Review',
    reviewNotes: 'Pending verification of maternal lineage documentation from Aizawl rabbinic court.',
    lastReviewedBy: 'Elder Thangjom',
    verificationToken: 'BMC-CEN-8403-PENDING'
  },
  {
    id: 'CEN-2026-8404',
    headOfHousehold: 'Avraham Sitlhou',
    hebrewName: 'אברהם סיטלהו',
    clanName: 'Sitlhou',
    village: 'Kiryat Arba',
    community: 'Hebron Heights',
    regionalCouncil: 'Judea & Samaria Regional Council',
    synagogue: 'Mishkan Menashe Hebron',
    country: 'Israel',
    stateOrDistrict: 'Judea District',
    memberCount: 11,
    childrenCount: 6,
    eldersCount: 1,
    contactPhone: '+972 52 741 9901',
    contactEmail: 'avraham.sitlhou@bnei.il',
    aliyahStatus: 'Residing in Israel (Aliyah Completed)',
    submissionDate: '2026-06-20',
    status: 'Approved',
    reviewNotes: 'Completed nationwide verification.',
    lastReviewedBy: 'Eliyahu Guite',
    verificationToken: 'BMC-CEN-8404-VERIFIED'
  },
  {
    id: 'CEN-2026-8405',
    headOfHousehold: 'Rachel Singson',
    hebrewName: 'רחל סינגסון',
    clanName: 'Singson',
    village: 'Imphal Valley',
    community: 'Imphal East Congregation',
    regionalCouncil: 'Northeast India Hills Regional Council',
    synagogue: 'Beit El Imphal',
    country: 'India',
    stateOrDistrict: 'Manipur',
    memberCount: 5,
    childrenCount: 2,
    eldersCount: 1,
    contactPhone: '+91 98562 10119',
    contactEmail: 'rachel.singson@imphal-bnei.org',
    aliyahStatus: 'Residing in India Hills',
    submissionDate: '2026-07-04',
    status: 'Correction Requested',
    reviewNotes: 'Please attach updated government ID or birth certificates for youngest two children.',
    lastReviewedBy: 'Elder Thangjom',
    verificationToken: 'BMC-CEN-8405-CORRECT'
  },
  {
    id: 'CEN-2026-8406',
    headOfHousehold: 'Yitzhak Thangjom',
    hebrewName: 'יצחק תאנגג\'ום',
    clanName: 'Thangjom',
    village: 'Haifa Ridge',
    community: 'Carmel Community',
    regionalCouncil: 'Northern Galilee Regional Council',
    synagogue: 'Beit Menashe Haifa',
    country: 'Israel',
    stateOrDistrict: 'Haifa District',
    memberCount: 7,
    childrenCount: 3,
    eldersCount: 0,
    contactPhone: '+972 50 334 8812',
    contactEmail: 'yitzhak.thangjom@haifa.il',
    aliyahStatus: 'Residing in Israel (Aliyah Completed)',
    submissionDate: '2026-07-02',
    status: 'Approved',
    reviewNotes: 'Verified.',
    lastReviewedBy: 'Rabbi Yosef Haokip',
    verificationToken: 'BMC-CEN-8406-VERIFIED'
  }
];

export class CensusService {
  /**
   * Returns comprehensive, dynamic KPI statistics aggregating from real system state + base population registry
   */
  static getDashboardKPIs(): CensusDashboardKPIs {
    const regionalStats = RegionalCouncilService.getDashboardStats();
    
    // Total base documented community population + dynamic record count
    const totalPop = 11482 + CENSUS_SUBMISSIONS.reduce((acc, curr) => acc + curr.memberCount, 0);
    const israelPop = 5420 + CENSUS_SUBMISSIONS.filter(s => s.country === 'Israel').reduce((acc, curr) => acc + curr.memberCount, 0);
    const indiaPop = totalPop - israelPop;
    
    const israelPct = Number(((israelPop / totalPop) * 100).toFixed(1));
    const indiaPct = Number(((indiaPop / totalPop) * 100).toFixed(1));

    const totalFamilies = 1845 + CENSUS_SUBMISSIONS.length;
    const childrenCount = Math.round(totalPop * 0.298);
    const eldersCount = Math.round(totalPop * 0.098);

    const pending = CENSUS_SUBMISSIONS.filter(s => s.status === 'Under Review').length + 38;
    const approved = CENSUS_SUBMISSIONS.filter(s => s.status === 'Approved').length + 1790;
    const rejected = CENSUS_SUBMISSIONS.filter(s => s.status === 'Rejected' || s.status === 'Merged').length + 15;

    return {
      totalCommunityMembers: totalPop,
      returnedToIsrael: { count: israelPop, percentage: israelPct },
      livingInIndia: { count: indiaPop, percentage: indiaPct },
      registeredFamilies: totalFamilies,
      registeredSynagogues: 34,
      regionalCouncilsCount: 4,
      documentedCommunities: 28,
      memorialRecordsCount: regionalStats.totalMemorials + 480,
      childrenUnder18: { count: childrenCount, percentage: 29.8 },
      elders65Plus: { count: eldersCount, percentage: 9.8 },
      maleFemaleRatio: { malePercent: 50.4, femalePercent: 49.6, ratio: '1.02 : 1' },
      averageHouseholdSize: 5.8,
      newRegistrationsThisMonth: 142 + CENSUS_SUBMISSIONS.filter(s => s.submissionDate >= '2026-07-01').length,
      pendingReviews: pending,
      approvedRecords: approved,
      rejectedRecords: rejected
    };
  }

  static getDemographicRegions(): CensusDemographicRegion[] {
    return [...REGIONAL_MAP_REGIONS];
  }

  static getAllSubmissions(): CensusSubmissionRecord[] {
    return [...CENSUS_SUBMISSIONS];
  }

  static getSubmissionsByCouncil(councilName: string): CensusSubmissionRecord[] {
    return CENSUS_SUBMISSIONS.filter(s => s.regionalCouncil === councilName);
  }

  /**
   * Search across submissions. Public search automatically masks private phone/email.
   */
  static searchSubmissions(
    query: string,
    filterStatus?: string,
    filterCouncil?: string,
    isAdmin: boolean = false
  ): CensusSubmissionRecord[] {
    const q = query.toLowerCase().trim();
    return CENSUS_SUBMISSIONS.filter(s => {
      const matchesQuery = !q || (
        s.id.toLowerCase().includes(q) ||
        s.headOfHousehold.toLowerCase().includes(q) ||
        (s.hebrewName && s.hebrewName.includes(q)) ||
        s.clanName.toLowerCase().includes(q) ||
        s.village.toLowerCase().includes(q) ||
        s.community.toLowerCase().includes(q) ||
        s.regionalCouncil.toLowerCase().includes(q)
      );
      const matchesStatus = !filterStatus || filterStatus === 'ALL' || s.status === filterStatus;
      const matchesCouncil = !filterCouncil || filterCouncil === 'ALL' || s.regionalCouncil === filterCouncil;
      return matchesQuery && matchesStatus && matchesCouncil;
    }).map(s => {
      if (!isAdmin) {
        // Redact personal contact details for public transparency views
        return {
          ...s,
          contactPhone: s.contactPhone ? s.contactPhone.replace(/\d{4}$/, '****') : undefined,
          contactEmail: s.contactEmail ? s.contactEmail.replace(/(?<=^..)[^@]+/, '*****') : undefined
        };
      }
      return s;
    });
  }

  static lookupSubmission(trackingQuery: string): CensusSubmissionRecord | undefined {
    const q = trackingQuery.trim().toLowerCase();
    return CENSUS_SUBMISSIONS.find(s => 
      s.id.toLowerCase() === q || 
      (s.contactEmail && s.contactEmail.toLowerCase() === q) ||
      s.headOfHousehold.toLowerCase() === q
    );
  }

  static async submitCensus(data: Partial<CensusSubmissionRecord>, actorName: string): Promise<CensusSubmissionRecord> {
    const newId = `CEN-2026-${8400 + CENSUS_SUBMISSIONS.length + 1}`;
    const record: CensusSubmissionRecord = {
      id: newId,
      headOfHousehold: data.headOfHousehold || 'Anonymous Household',
      hebrewName: data.hebrewName || '',
      clanName: data.clanName || 'General Lineage',
      village: data.village || 'Churachandpur',
      community: data.community || 'Beit Shalom Community',
      regionalCouncil: data.regionalCouncil || 'Northeast India Hills Regional Council',
      synagogue: data.synagogue || 'General Minyan',
      country: data.country || 'India',
      stateOrDistrict: data.stateOrDistrict || 'Manipur',
      memberCount: Number(data.memberCount) || 5,
      childrenCount: Number(data.childrenCount) || 2,
      eldersCount: Number(data.eldersCount) || 0,
      contactPhone: data.contactPhone || '',
      contactEmail: data.contactEmail || '',
      aliyahStatus: data.aliyahStatus || 'Residing in India Hills',
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Under Review',
      verificationToken: `BMC-${newId}-PENDING`
    };

    CENSUS_SUBMISSIONS = [record, ...CENSUS_SUBMISSIONS];

    await AuditService.logAction(null, 'SUBMIT_COMMUNITY_CENSUS', `census:${newId}`, {
      actor: actorName,
      headOfHousehold: record.headOfHousehold,
      clan: record.clanName,
      village: record.village,
      members: record.memberCount,
      timestamp: new Date().toISOString()
    });

    return record;
  }

  static async reviewSubmission(
    id: string,
    newStatus: CensusSubmissionRecord['status'],
    notes: string,
    reviewerName: string
  ): Promise<CensusSubmissionRecord | undefined> {
    const idx = CENSUS_SUBMISSIONS.findIndex(s => s.id === id);
    if (idx === -1) return undefined;

    const oldStatus = CENSUS_SUBMISSIONS[idx].status;
    const token = newStatus === 'Approved' ? `BMC-${id}-VERIFIED` : CENSUS_SUBMISSIONS[idx].verificationToken;

    CENSUS_SUBMISSIONS[idx] = {
      ...CENSUS_SUBMISSIONS[idx],
      status: newStatus,
      reviewNotes: notes,
      lastReviewedBy: reviewerName,
      verificationToken: token
    };

    await AuditService.logAction(null, 'REVIEW_CENSUS_SUBMISSION', `census:${id}`, {
      actor: reviewerName,
      previousStatus: oldStatus,
      newStatus,
      notes,
      timestamp: new Date().toISOString()
    });

    return CENSUS_SUBMISSIONS[idx];
  }

  static async mergeDuplicateSubmissions(
    sourceId: string,
    targetId: string,
    actorName: string
  ): Promise<{ success: boolean; message: string }> {
    const sourceIdx = CENSUS_SUBMISSIONS.findIndex(s => s.id === sourceId);
    const targetIdx = CENSUS_SUBMISSIONS.findIndex(s => s.id === targetId);

    if (sourceIdx === -1 || targetIdx === -1) {
      return { success: false, message: 'Source or target submission ID not found.' };
    }

    const src = CENSUS_SUBMISSIONS[sourceIdx];
    const tgt = CENSUS_SUBMISSIONS[targetIdx];

    // Mark source as Merged
    CENSUS_SUBMISSIONS[sourceIdx] = {
      ...src,
      status: 'Merged',
      reviewNotes: `Merged into primary record ${tgt.id} by ${actorName}`,
      lastReviewedBy: actorName
    };

    await AuditService.logAction(null, 'MERGE_CENSUS_RECORDS', `census:${targetId}`, {
      actor: actorName,
      mergedSourceId: sourceId,
      targetId: targetId,
      timestamp: new Date().toISOString()
    });

    return { success: true, message: `Successfully merged record ${sourceId} into ${targetId}.` };
  }

  static getAnalytics(): CensusChartAnalytics {
    return {
      populationGrowth: [
        { year: '1980', indiaPopulation: 1200, israelPopulation: 0, total: 1200 },
        { year: '1990', indiaPopulation: 2800, israelPopulation: 120, total: 2920 },
        { year: '2000', indiaPopulation: 5100, israelPopulation: 750, total: 5850 },
        { year: '2010', indiaPopulation: 6400, israelPopulation: 1850, total: 8250 },
        { year: '2018', indiaPopulation: 6800, israelPopulation: 3400, total: 10200 },
        { year: '2022', indiaPopulation: 6300, israelPopulation: 4600, total: 10900 },
        { year: '2026', indiaPopulation: 6062, israelPopulation: 5420, total: 11482 }
      ],
      ageDistribution: [
        { ageGroup: '0–10 Yrs', count: 2180, percentage: 19.0, males: 1110, females: 1070 },
        { ageGroup: '11–18 Yrs', count: 1240, percentage: 10.8, males: 630, females: 610 },
        { ageGroup: '19–30 Yrs', count: 2650, percentage: 23.1, males: 1340, females: 1310 },
        { ageGroup: '31–50 Yrs', count: 2890, percentage: 25.2, males: 1460, females: 1430 },
        { ageGroup: '51–65 Yrs', count: 1402, percentage: 12.2, males: 695, females: 707 },
        { ageGroup: '65+ Yrs', count: 1120, percentage: 9.7, males: 550, females: 570 }
      ],
      aliyahProgress: [
        { status: 'Residing in Israel (Aliyah Completed)', count: 5420, percentage: 47.2, color: '#10B981' },
        { status: 'Approved & Flight Waiting List', count: 1280, percentage: 11.1, color: '#F59E0B' },
        { status: 'Application Under Rabbinic Review', count: 1850, percentage: 16.1, color: '#3B82F6' },
        { status: 'Residing in Manipur & Mizoram Hills', count: 2932, percentage: 25.6, color: '#8B5CF6' }
      ],
      familySizeDistribution: [
        { sizeLabel: '1–2 Members', familyCount: 180 },
        { sizeLabel: '3–4 Members', familyCount: 420 },
        { sizeLabel: '5–6 Members', familyCount: 685 },
        { sizeLabel: '7–8 Members', familyCount: 390 },
        { sizeLabel: '9+ Members', familyCount: 170 }
      ],
      communityDistribution: [
        { communityName: 'Churachandpur (Lamka)', population: 3450, council: 'Northeast India Hills' },
        { communityName: 'Nof HaGalil & Galilee', population: 2380, council: 'Northern Galilee Council' },
        { communityName: 'Aizawl & Lunglei', population: 1492, council: 'Northeast India Hills' },
        { communityName: 'Kiryat Arba / Hebron', population: 1150, council: 'Judea & Samaria Council' },
        { communityName: 'Imphal & Kangpokpi', population: 1120, council: 'Northeast India Hills' },
        { communityName: 'Haifa & Ma\'alot', population: 980, council: 'Northern Galilee Council' },
        { communityName: 'Jerusalem & Lowlands', population: 910, council: 'Central Israel Olim' }
      ],
      migrationTimeline: [
        { waveLabel: '1990s Pioneering Wave', period: '1990–1999', olimCount: 480, keyEvent: 'Early pioneers settle in Gush Katif and Kiryat Arba' },
        { waveLabel: 'Rabbinic Recognition Wave', period: '2005–2007', olimCount: 1250, keyEvent: 'Official Chief Rabbinate recognition of Bnei Menashe lineage' },
        { waveLabel: 'Galilee Expansion Wave', period: '2012–2015', olimCount: 1420, keyEvent: 'Large-scale group arrivals establishing Nof HaGalil hub' },
        { waveLabel: 'Post-Pandemic Renewal', period: '2020–2023', olimCount: 1180, keyEvent: 'Special government resolutions accelerating family reunification' },
        { waveLabel: 'Current Jubilee Census', period: '2024–2026', olimCount: 1090, keyEvent: 'Ongoing flights coordinated by Bnei Menashe Council India' }
      ],
      educationLevels: [
        { level: 'University & Academic Degree', count: 3210, percentage: 28.0, color: '#3B82F6' },
        { level: 'Yeshiva / Rabbinic Studies', count: 2410, percentage: 21.0, color: '#F59E0B' },
        { level: 'High School / Matriculation', count: 3560, percentage: 31.0, color: '#10B981' },
        { level: 'Vocational / Technical Diploma', count: 1380, percentage: 12.0, color: '#8B5CF6' },
        { level: 'Elementary / Junior High', count: 922, percentage: 8.0, color: '#64748B' }
      ],
      occupationSummary: [
        { sector: 'Torah Education, Rabbis & Teachers', count: 1850, percentage: 22.5 },
        { sector: 'IDF, Defense & Security Services', count: 1640, percentage: 20.0 },
        { sector: 'Healthcare & Medical Care', count: 1420, percentage: 17.3 },
        { sector: 'Technology, Engineering & IT', count: 1280, percentage: 15.6 },
        { sector: 'Commerce, Agriculture & Skilled Trade', count: 2020, percentage: 24.6 }
      ]
    };
  }
}
