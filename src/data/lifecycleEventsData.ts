export interface LifecycleEvent {
  id: string;
  category: 'birth' | 'education' | 'marriage' | 'household' | 'aliyah' | 'religious' | 'volunteer' | 'memorial';
  title: string;
  citizenName: string;
  hebrewName?: string;
  citizenId?: string;
  secondaryCitizenName?: string;
  secondaryHebrewName?: string;
  secondaryCitizenId?: string;
  date: string;
  hebrewDate?: string;
  location: 'Churachandpur' | 'Aizawl' | 'Kangpokpi' | 'Shalom Zion Synagogue' | 'Beit Shalom Aizawl' | 'Nof HaGalil, Israel' | 'Kiryat Arba, Israel';
  description: string;
  referenceNumber: string;
  status: 'Verified' | 'Pending Rabbinical Review' | 'Completed' | 'Beit Din Approved';
  privacy: 'Public Community' | 'Synagogue Only' | 'Private Household';
  automationStatus: {
    communityIdCreated?: boolean;
    familyTreeUpdated?: boolean;
    householdMergedOrUpdated?: boolean;
    censusSynchronized?: boolean;
    certificateIssued?: boolean;
    yahrzeitScheduled?: boolean;
    memorialBoardCreated?: boolean;
  };
  details?: {
    birthWeight?: string;
    mohelOrRabbi?: string;
    institution?: string;
    serviceHours?: number;
    aliyahFlight?: string;
    burialSite?: string;
    yahrzeitHebrewDay?: string;
  };
  blessingsCount: number;
}

export const INITIAL_LIFECYCLE_EVENTS: LifecycleEvent[] = [
  {
    id: 'evt-2026-001',
    category: 'birth',
    title: 'Newborn Daughter Naming: Noa Batya Singson',
    citizenName: 'Noa Batya Singson',
    hebrewName: 'נועה בתיה ע"ה',
    citizenId: 'BM-2026-BIRTH-8842',
    date: '2026-07-02',
    hebrewDate: '17 Tammuz 5786',
    location: 'Shalom Zion Synagogue',
    description: 'Born to Boaz & Rivka Singson in Churachandpur. Naming ceremony conducted by Rabbi Yehuda Gin at Shalom Zion Synagogue.',
    referenceNumber: 'REG-BR-5786-0921',
    status: 'Verified',
    privacy: 'Public Community',
    automationStatus: {
      communityIdCreated: true,
      familyTreeUpdated: true,
      householdMergedOrUpdated: true,
      censusSynchronized: true,
      certificateIssued: true
    },
    details: {
      birthWeight: '3.4 kg',
      mohelOrRabbi: 'Rabbi Yehuda Gin'
    },
    blessingsCount: 42
  },
  {
    id: 'evt-2026-002',
    category: 'aliyah',
    title: 'Aliyah Flight Departure: The Haokip Family (5 Members)',
    citizenName: 'Ephraim Haokip (Head of Household)',
    hebrewName: 'אפרים הוקיפ',
    citizenId: 'BM-ID-4410-IL',
    date: '2026-06-28',
    hebrewDate: '13 Tammuz 5786',
    location: 'Nof HaGalil, Israel',
    description: 'Approved by Shavei Israel & Interior Ministry Beit Din. Arrived safely at Ben Gurion Airport on El Al Flight LY072.',
    referenceNumber: 'ALY-2026-NOF-114',
    status: 'Completed',
    privacy: 'Public Community',
    automationStatus: {
      censusSynchronized: true,
      householdMergedOrUpdated: true,
      certificateIssued: true
    },
    details: {
      aliyahFlight: 'LY072 New Delhi to Tel Aviv'
    },
    blessingsCount: 89
  },
  {
    id: 'evt-2026-003',
    category: 'marriage',
    title: 'Sacred Union: Menashe Lhungdim & Sarah Fanai',
    citizenName: 'Menashe Lhungdim',
    hebrewName: 'מנשה בן אברהם',
    citizenId: 'BM-ID-2109',
    secondaryCitizenName: 'Sarah Fanai',
    secondaryHebrewName: 'שרה בת שרה',
    secondaryCitizenId: 'BM-ID-3391',
    date: '2026-06-15',
    hebrewDate: '29 Sivan 5786',
    location: 'Beit Shalom Aizawl',
    description: 'Chuppah and Kiddushin celebrated under the auspices of Bnei Menashe Rabbinical Council in Aizawl.',
    referenceNumber: 'MAR-5786-AZ-004',
    status: 'Verified',
    privacy: 'Public Community',
    automationStatus: {
      householdMergedOrUpdated: true,
      familyTreeUpdated: true,
      certificateIssued: true
    },
    details: {
      mohelOrRabbi: 'Rabbi Hanoch Avtzon'
    },
    blessingsCount: 115
  },
  {
    id: 'evt-2026-004',
    category: 'education',
    title: 'Siyum Masechet Chullin & Hebrew Institute Graduation',
    citizenName: 'David Ben-Tzion Thangjom',
    hebrewName: 'דוד בן ציון תאנגג\'ום',
    citizenId: 'BM-ID-5502',
    date: '2026-06-10',
    hebrewDate: '24 Sivan 5786',
    location: 'Churachandpur',
    description: 'Successfully completed 3-year Hebrew Literacy & Halacha Leadership Fellowship with distinction.',
    referenceNumber: 'EDU-SIYUM-5786-88',
    status: 'Verified',
    privacy: 'Public Community',
    automationStatus: {
      certificateIssued: true
    },
    details: {
      institution: 'Bnei Menashe Torah & Leadership Academy'
    },
    blessingsCount: 64
  },
  {
    id: 'evt-2026-005',
    category: 'religious',
    title: 'Bar Mitzvah Celebration: Yitzhak Kipgen',
    citizenName: 'Yitzhak Kipgen',
    hebrewName: 'יצחק בן יוסף',
    citizenId: 'BM-ID-7712',
    date: '2026-05-22',
    hebrewDate: '5 Sivan 5786',
    location: 'Shalom Zion Synagogue',
    description: 'Called to the Torah for Parashat Bamidbar. Delivered drasha on tribal unity and service to Am Yisrael.',
    referenceNumber: 'REL-BM-5786-302',
    status: 'Verified',
    privacy: 'Public Community',
    automationStatus: {
      familyTreeUpdated: true,
      certificateIssued: true
    },
    details: {
      mohelOrRabbi: 'Gabbai Shmuel Hangshing'
    },
    blessingsCount: 78
  },
  {
    id: 'evt-2026-006',
    category: 'volunteer',
    title: 'Keter Shem Tov Community Distinction Award',
    citizenName: 'Esther Lallianpuii',
    hebrewName: 'אסתר לאליאנפויי',
    citizenId: 'BM-ID-1894',
    date: '2026-05-15',
    hebrewDate: '28 Iyar 5786',
    location: 'Aizawl',
    description: 'Awarded for over 450 hours of dedicated Shabbat hospitality organization and youth Hebrew tutoring.',
    referenceNumber: 'VOL-AWARD-2026-19',
    status: 'Verified',
    privacy: 'Public Community',
    automationStatus: {
      certificateIssued: true
    },
    details: {
      serviceHours: 450
    },
    blessingsCount: 93
  },
  {
    id: 'evt-2026-007',
    category: 'memorial',
    title: 'Memorial Transition: Yaakov Ben-Moshe Ralte Z"L',
    citizenName: 'Yaakov Ben-Moshe Ralte',
    hebrewName: 'יעקב בן משה ז"ל',
    citizenId: 'BM-ID-0412',
    date: '2026-04-18',
    hebrewDate: '1 Iyar 5786',
    location: 'Churachandpur',
    description: 'Revered elder and pioneer of the Churachandpur Hebrew classes. Laid to rest at Churachandpur Jewish Cemetery.',
    referenceNumber: 'MEM-YZ-5786-009',
    status: 'Verified',
    privacy: 'Public Community',
    automationStatus: {
      familyTreeUpdated: true,
      censusSynchronized: true,
      yahrzeitScheduled: true,
      memorialBoardCreated: true,
      certificateIssued: true
    },
    details: {
      burialSite: 'Churachandpur Jewish Cemetery Plot A-12',
      yahrzeitHebrewDay: '1 Iyar (Annual Kaddish Schedule Activated)'
    },
    blessingsCount: 130
  },
  {
    id: 'evt-2026-008',
    category: 'household',
    title: 'Household Inter-Community Relocation & Merge',
    citizenName: 'Gideon & Leah Touthang Household',
    hebrewName: 'משפחת תותאנג',
    citizenId: 'BM-HH-9921',
    date: '2026-04-02',
    hebrewDate: '15 Nisan 5786',
    location: 'Aizawl',
    description: 'Relocated from Kangpokpi district to Beit Shalom community sector in Aizawl. Household registry merged with elder parents.',
    referenceNumber: 'HH-REL-2026-44',
    status: 'Verified',
    privacy: 'Synagogue Only',
    automationStatus: {
      householdMergedOrUpdated: true,
      censusSynchronized: true
    },
    blessingsCount: 28
  }
];

export interface LifecycleAuditLog {
  id: string;
  timestamp: string;
  eventReference: string;
  eventType: string;
  actionTaken: string;
  targetModule: 'Family Tree' | 'Census & Demographics' | 'Citizen Digital ID' | 'Memorial Board' | 'Household Registry';
  actor: string;
  status: 'SUCCESS' | 'SYNCED' | 'VERIFIED';
}

export const INITIAL_AUDIT_LOGS: LifecycleAuditLog[] = [
  {
    id: 'aud-991',
    timestamp: '2026-07-02 14:22:05 IST',
    eventReference: 'REG-BR-5786-0921',
    eventType: 'Birth Registration',
    actionTaken: 'Provisioned Citizen ID BM-2026-BIRTH-8842 & Increment Churachandpur Census +1',
    targetModule: 'Census & Demographics',
    actor: 'System Automated Registrar Engine',
    status: 'SUCCESS'
  },
  {
    id: 'aud-990',
    timestamp: '2026-07-02 14:22:06 IST',
    eventReference: 'REG-BR-5786-0921',
    eventType: 'Birth Registration',
    actionTaken: 'Attached child node Noa Batya Singson under parents Boaz & Rivka Singson',
    targetModule: 'Family Tree',
    actor: 'System Automated Registrar Engine',
    status: 'SYNCED'
  },
  {
    id: 'aud-989',
    timestamp: '2026-06-28 09:15:10 IDT',
    eventReference: 'ALY-2026-NOF-114',
    eventType: 'Aliyah Arrival Confirmation',
    actionTaken: 'Migrated 5 Citizen Records from Churachandpur sector to Nof HaGalil sector',
    targetModule: 'Household Registry',
    actor: 'Beit Din Aliyah Sync Node',
    status: 'VERIFIED'
  },
  {
    id: 'aud-988',
    timestamp: '2026-06-15 19:40:00 IST',
    eventReference: 'MAR-5786-AZ-004',
    eventType: 'Marriage Ketubah Registry',
    actionTaken: 'Merged Household IDs BM-HH-2109 and BM-HH-3391 into Joint Household BM-HH-5500',
    targetModule: 'Household Registry',
    actor: 'Rabbi Hanoch Avtzon (Registrar)',
    status: 'SUCCESS'
  },
  {
    id: 'aud-987',
    timestamp: '2026-04-18 21:05:12 IST',
    eventReference: 'MEM-YZ-5786-009',
    eventType: 'Memorial Transition',
    actionTaken: 'Created virtual plaque on Memorial Board & scheduled 50-year Kaddish reminder for 1 Iyar',
    targetModule: 'Memorial Board',
    actor: 'System Automated Registrar Engine',
    status: 'SUCCESS'
  }
];
