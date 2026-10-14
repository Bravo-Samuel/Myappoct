import { FamilyTreePerson, FamilyTimelineEvent, FamilyHeritageRecord } from '../../types';
import { MemorialService } from './MemorialService';

let FAMILY_PERSONS: FamilyTreePerson[] = [
  // Generation 1: Great-Grandparents / Ancestors
  {
    id: 'person_gen1_1',
    familyClan: 'Haokip',
    name: 'Haokip Lunkholal',
    hebrewName: 'יוסף לונכהולל הוקיפ',
    gender: 'Male',
    birthDate: 'March 14, 1942',
    hebrewBirthDate: '25 Adar 5702',
    isDeceased: true,
    passingDate: 'June 26, 2018',
    hebrewPassingDate: '13 Tammuz 5778',
    memorialRecordId: 'mem_1',
    biography: 'Beloved Patriarch of the Haokip clan who steadfastly kept Shabbat in Churachandpur and taught Hebrew alphabet chants to three generations of children.',
    villageOfOrigin: 'Churachandpur',
    community: 'Manipur → Nof HaGalil',
    regionalCouncil: 'Northern Galilee Regional Council',
    occupation: 'Torah Educator & Community Elder',
    aliyahStatus: 'Made Aliyah',
    achievements: ['Founded Churachandpur Shabbat Minyan (1975)', 'Led Aliyah group of 42 families to Nof HaGalil (2012)'],
    familyRole: 'Patriarch & Great-Grandfather',
    communityParticipation: 'Synagogue Gabbai and Sabbath reader for over 40 years.',
    generation: 1,
    parentIds: [],
    spouseIds: ['person_gen1_2'],
    childIds: ['person_gen2_1', 'person_gen2_2'],
    siblingIds: [],
    canEdit: false
  },
  {
    id: 'person_gen1_2',
    familyClan: 'Haokip',
    name: 'Neihulhing Haokip',
    hebrewName: 'שרה נֵיהוּלְהִינְג הוקיפ',
    gender: 'Female',
    birthDate: 'August 22, 1947',
    hebrewBirthDate: '6 Elul 5707',
    isDeceased: true,
    passingDate: 'September 5, 2019',
    hebrewPassingDate: '5 Elul 5779',
    memorialRecordId: 'mem_2',
    biography: 'Spiritual matriarch known across Mizoram and Manipur for hosting communal Passover seders for over 80 people.',
    villageOfOrigin: 'Aizawl',
    community: 'Mizoram → Kiryat Arba',
    regionalCouncil: 'Judea Regional Council',
    occupation: 'Matriarch & Community Hospitality Coordinator',
    aliyahStatus: 'Made Aliyah',
    achievements: ['Organized annual communal hand-baked Matzoh oven in Aizawl', 'Mentor for young Bnei Menashe women arriving in Israel'],
    familyRole: 'Matriarch & Great-Grandmother',
    communityParticipation: 'Head of Women’s Tehillim Circle.',
    generation: 1,
    parentIds: [],
    spouseIds: ['person_gen1_1'],
    childIds: ['person_gen2_1', 'person_gen2_2'],
    siblingIds: [],
    canEdit: false
  },

  // Generation 2: Grandparents
  {
    id: 'person_gen2_1',
    familyClan: 'Singson',
    name: 'Rabbi Yochanan Singson',
    hebrewName: 'הרב יוחנן סינגסון',
    gender: 'Male',
    birthDate: 'November 12, 1962',
    hebrewBirthDate: '15 Cheshvan 5723',
    isDeceased: false,
    biography: 'Prominent community pioneer who translated Hebrew siddurim into Mizo and Kuki, guiding normative Halachic practice.',
    villageOfOrigin: 'Churachandpur',
    community: 'Jerusalem',
    regionalCouncil: 'Jerusalem District',
    occupation: 'Rabbi & Torah Translator',
    aliyahStatus: 'Made Aliyah',
    achievements: ['Published first bilingual Mizo-Hebrew Siddur (1998)', 'Rabbinic Ordination in Jerusalem (2007)'],
    familyRole: 'Grandfather & Spiritual Guide',
    communityParticipation: 'Senior Lecturer at Beit Shalom Bnei Menashe Academy.',
    generation: 2,
    parentIds: ['person_gen1_1', 'person_gen1_2'],
    spouseIds: ['person_gen2_3'],
    childIds: ['person_gen3_1', 'person_gen3_2'],
    siblingIds: ['person_gen2_2'],
    canEdit: true
  },
  {
    id: 'person_gen2_2',
    familyClan: 'Haokip',
    name: 'Shalom Haokip',
    hebrewName: 'שלום הוקיפ',
    gender: 'Male',
    birthDate: 'January 18, 1965',
    hebrewBirthDate: '14 Shevat 5725',
    isDeceased: false,
    biography: 'Certified Sofer STaM (Torah Scribe) who has inscribed over 300 mezuzot and tefillin for Bnei Menashe families.',
    villageOfOrigin: 'Churachandpur',
    community: 'Kiryat Arba',
    regionalCouncil: 'Judea Regional Council',
    occupation: 'Sofer STaM (Scribe)',
    aliyahStatus: 'Made Aliyah',
    achievements: ['Inscribed the Holy Ark Scroll for Nof HaGalil Synagogue'],
    familyRole: 'Great Uncle',
    communityParticipation: 'Teaches scribal calligraphy to youth.',
    generation: 2,
    parentIds: ['person_gen1_1', 'person_gen1_2'],
    spouseIds: [],
    childIds: [],
    siblingIds: ['person_gen2_1'],
    canEdit: true
  },
  {
    id: 'person_gen2_3',
    familyClan: 'Singson',
    name: 'Esther Lhungdim Singson',
    hebrewName: 'אסתר לונגדים סינגסון',
    gender: 'Female',
    birthDate: 'April 9, 1964',
    hebrewBirthDate: '27 Adar 5724',
    isDeceased: false,
    biography: 'Beloved Grandmother and educator who established Hebrew language kindergartens in Manipur before Aliyah.',
    villageOfOrigin: 'Kangpokpi',
    community: 'Jerusalem',
    regionalCouncil: 'Jerusalem District',
    occupation: 'Early Childhood Hebrew Educator',
    aliyahStatus: 'Made Aliyah',
    achievements: ['Received Ministry of Absorption Community Leadership Award'],
    familyRole: 'Grandmother',
    communityParticipation: 'Organizes holiday care baskets for new olim.',
    generation: 2,
    parentIds: [],
    spouseIds: ['person_gen2_1'],
    childIds: ['person_gen3_1', 'person_gen3_2'],
    siblingIds: [],
    canEdit: true
  },

  // Generation 3: Parents
  {
    id: 'person_gen3_1',
    familyClan: 'Singson',
    name: 'Eleazar Singson',
    hebrewName: 'אלעזר סינגסון',
    gender: 'Male',
    birthDate: 'October 5, 1986',
    hebrewBirthDate: '2 Tishrei 5747',
    isDeceased: false,
    biography: 'High-tech software engineer and community coordinator supporting new Bnei Menashe immigrants with job placement in northern Israel.',
    villageOfOrigin: 'Churachandpur',
    community: 'Nof HaGalil',
    regionalCouncil: 'Northern Galilee Regional Council',
    occupation: 'Senior Software Engineer & Aliyah Mentor',
    aliyahStatus: 'Made Aliyah',
    achievements: ['Created Bnei Menashe Tech Mentorship Network', 'IDF Reserves Captain (Golani Brigade)'],
    familyRole: 'Father & Head of Household',
    communityParticipation: 'Board Member of Northern Galilee Synagogue Council.',
    generation: 3,
    parentIds: ['person_gen2_1', 'person_gen2_3'],
    spouseIds: ['person_gen3_3'],
    childIds: ['person_gen4_1', 'person_gen4_2', 'person_gen4_3'],
    siblingIds: ['person_gen3_2'],
    canEdit: true
  },
  {
    id: 'person_gen3_2',
    familyClan: 'Singson',
    name: 'Leah Singson Touthang',
    hebrewName: 'לאה סינגסון טותאנג',
    gender: 'Female',
    birthDate: 'July 21, 1989',
    hebrewBirthDate: '18 Tammuz 5749',
    isDeceased: false,
    biography: 'Pediatric nurse at HaEmek Medical Center in Afula and active volunteer in community maternal health.',
    villageOfOrigin: 'Churachandpur',
    community: 'Afula',
    regionalCouncil: 'Jezreel Valley Regional Council',
    occupation: 'Registered Pediatric Nurse',
    aliyahStatus: 'Made Aliyah',
    achievements: ['Excellence in Nursing Award 2024'],
    familyRole: 'Aunt',
    communityParticipation: 'Leads medical translation for elderly olim.',
    generation: 3,
    parentIds: ['person_gen2_1', 'person_gen2_3'],
    spouseIds: [],
    childIds: [],
    siblingIds: ['person_gen3_1'],
    canEdit: true
  },
  {
    id: 'person_gen3_3',
    familyClan: 'Touthang',
    name: 'Miriam Touthang Singson',
    hebrewName: 'מרים טותאנג סינגסון',
    gender: 'Female',
    birthDate: 'December 14, 1988',
    hebrewBirthDate: '6 Tevet 5749',
    isDeceased: false,
    biography: 'Passionate architect and community history researcher documenting ancient Bnei Menashe songs and textiles.',
    villageOfOrigin: 'Imphal',
    community: 'Nof HaGalil',
    regionalCouncil: 'Northern Galilee Regional Council',
    occupation: 'Heritage Researcher & Architect',
    aliyahStatus: 'Made Aliyah',
    achievements: ['Curated the Bnei Menashe Oral Traditions Exhibition in Haifa'],
    familyRole: 'Mother',
    communityParticipation: 'Directs Youth Cultural Heritage Workshops.',
    generation: 3,
    parentIds: [],
    spouseIds: ['person_gen3_1'],
    childIds: ['person_gen4_1', 'person_gen4_2', 'person_gen4_3'],
    siblingIds: [],
    canEdit: true
  },

  // Generation 4: Children (Current Generation / User)
  {
    id: 'person_gen4_1',
    familyClan: 'Haokip',
    name: 'Samuel Haokip',
    hebrewName: 'שְׁמוּאֵל הוקיפ',
    gender: 'Male',
    birthDate: 'May 18, 2008',
    hebrewBirthDate: '13 Iyyar 5768',
    isDeceased: false,
    biography: 'Dedicated community member in Khuangkhai, Churachandpur, participating in Beit Shalom minyan.',
    villageOfOrigin: 'Khuangkhai',
    community: 'Khuangkhai',
    regionalCouncil: 'Churachandpur',
    occupation: 'Student & Youth Coordinator',
    aliyahStatus: 'Born in Israel',
    achievements: ['National Bible Contest Regional Finalist', 'Developed Bnei Menashe Digital Platform Phase 1'],
    familyRole: 'Eldest Son (You)',
    communityParticipation: 'Organizes weekly teen Tehillim and coding clubs.',
    generation: 4,
    parentIds: ['person_gen3_1', 'person_gen3_3'],
    spouseIds: [],
    childIds: [],
    siblingIds: ['person_gen4_2', 'person_gen4_3'],
    canEdit: true
  },
  {
    id: 'person_gen4_2',
    familyClan: 'Singson',
    name: 'Tamar Singson',
    hebrewName: 'תמר בת אלעזר סינגסון',
    gender: 'Female',
    birthDate: 'September 2, 2011',
    hebrewBirthDate: '3 Elul 5771',
    isDeceased: false,
    biography: 'Talented musician playing violin and traditional Bnei Menashe bamboo flute at community holiday simchas.',
    villageOfOrigin: 'Born in Nof HaGalil',
    community: 'Nof HaGalil',
    regionalCouncil: 'Northern Galilee Regional Council',
    occupation: 'Middle School Student & Musician',
    aliyahStatus: 'Born in Israel',
    achievements: ['First Place in Galilee Youth Symphony Soloist Competition'],
    familyRole: 'Daughter / Sister',
    communityParticipation: 'Choir leader for Hanukkah and Purim celebrations.',
    generation: 4,
    parentIds: ['person_gen3_1', 'person_gen3_3'],
    spouseIds: [],
    childIds: [],
    siblingIds: ['person_gen4_1', 'person_gen4_3'],
    canEdit: true
  },
  {
    id: 'person_gen4_3',
    familyClan: 'Singson',
    name: 'Yonatan Singson',
    hebrewName: 'יונתן בן אלעזר סינגסון',
    gender: 'Male',
    birthDate: 'February 10, 2016',
    hebrewBirthDate: '1 Adar I 5776',
    isDeceased: false,
    biography: 'Energetic elementary school student who loves studying weekly Parashah stories and playing soccer.',
    villageOfOrigin: 'Born in Nof HaGalil',
    community: 'Nof HaGalil',
    regionalCouncil: 'Northern Galilee Regional Council',
    occupation: 'Elementary Student',
    aliyahStatus: 'Born in Israel',
    achievements: ['Completed Mishnayot Berakhot memorization'],
    familyRole: 'Youngest Son / Brother',
    communityParticipation: 'Junior Sabbath Kiddush helper.',
    generation: 4,
    parentIds: ['person_gen3_1', 'person_gen3_3'],
    spouseIds: [],
    childIds: [],
    siblingIds: ['person_gen4_1', 'person_gen4_2'],
    canEdit: true
  }
];

let TIMELINE_EVENTS: FamilyTimelineEvent[] = [
  {
    id: 'tl_1',
    familyClan: 'Haokip',
    year: '1942',
    date: 'March 14, 1942',
    hebrewDate: '25 Adar 5702',
    eventType: 'Birth',
    title: 'Patriarch Haokip Lunkholal Born in Manipur Hills',
    description: 'Born into an ancient lineage preserving oral memories of Manasseh amidst the dense hills of Northeast India.',
    location: 'Churachandpur, Manipur'
  },
  {
    id: 'tl_2',
    familyClan: 'Haokip',
    year: '1975',
    date: 'October 11, 1975',
    hebrewDate: '6 Cheshvan 5736',
    eventType: 'Community Leadership',
    title: 'Founding of Churachandpur Sabbath Sanctuary',
    description: 'Haokip Lunkholal and elders established the first formal community synagogue for Shabbat prayers and Hebrew study.',
    location: 'Churachandpur Synagogue'
  },
  {
    id: 'tl_3',
    familyClan: 'Singson',
    year: '1998',
    date: 'August 15, 1998',
    hebrewDate: '23 Av 5758',
    eventType: 'Community Leadership',
    title: 'First Mizo-Hebrew Siddur Published',
    description: 'Rabbi Yochanan Singson completed the first bilingual prayer book, uniting thousands of families in standardized liturgy.',
    location: 'Aizawl & Churachandpur'
  },
  {
    id: 'tl_4',
    familyClan: 'Singson',
    year: '2005',
    date: 'December 20, 2005',
    hebrewDate: '19 Kislev 5766',
    eventType: 'Aliyah',
    title: 'Historic Aliyah Flight to Ben Gurion Airport',
    description: 'The Singson and Haokip families arrived in Israel, kissing the ground of Eretz Yisrael amidst joyful singing of "We Have Returned".',
    location: 'Ben Gurion Airport → Jerusalem'
  },
  {
    id: 'tl_5',
    familyClan: 'Singson',
    year: '2007',
    date: 'June 17, 2007',
    hebrewDate: '1 Tammuz 5767',
    eventType: 'Marriage',
    title: 'Marriage of Eleazar Singson & Miriam Touthang',
    description: 'Celebrated in Jerusalem with over 400 community members, blending Mizo melodies with traditional wedding blessings under the Chuppah.',
    location: 'Jerusalem, Israel'
  },
  {
    id: 'tl_6',
    familyClan: 'Haokip',
    year: '2018',
    date: 'June 26, 2018',
    hebrewDate: '13 Tammuz 5778',
    eventType: 'Memorial Event',
    title: 'Eternal Rest of Patriarch Haokip Lunkholal',
    description: 'Passed peacefully surrounded by four generations singing Shabbat Zemirot. Buried in Nof HaGalil cemetery.',
    location: 'Nof HaGalil, Israel'
  }
];

let HERITAGE_RECORDS: FamilyHeritageRecord[] = [
  {
    clanName: 'Haokip',
    hebrewClanName: 'שבט הוקיפ',
    villageHistory: 'The Haokip clan has lived for centuries across the lush river valleys and hills of Churachandpur in southern Manipur and northern Mizoram. Traditional tribal historians note that despite centuries of isolation, clan elders carefully preserved strict rules of holiness, ritual purification, and the song of the miraculous Red Sea crossing ("Miriam’s Song").',
    migrationPath: [
      'Ancient Kingdom of Israel (Tribe of Manasseh)',
      'Assyrian Exile across Persia & Afghanistan',
      'Kaifeng & Silk Road mountain passes',
      'Shinlung / Burma Border Hills',
      'Manipur & Mizoram Villages (Churachandpur)',
      'Return to Eretz Yisrael (Nof HaGalil & Kiryat Arba)'
    ],
    historicalNotes: 'The Haokip family crest features the sheaf of wheat and olive branch representing Joseph’s blessing in Genesis 49:22: "Joseph is a fruitful bough by a spring; his branches run over the wall."',
    communityPhotographs: [
      { id: 'p1', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', caption: 'Elders studying Torah scrolls in Churachandpur', year: '1988', location: 'Manipur Hills' },
      { id: 'p2', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80', caption: 'Haokip and Singson family Aliyah celebration at Western Wall', year: '2012', location: 'Jerusalem' }
    ]
  },
  {
    clanName: 'Singson',
    hebrewClanName: 'שבט סינגסון',
    villageHistory: 'The Singson clan originated in the high plateaus near Aizawl and Kangpokpi. Known for scholarly dedication and leadership, elders of the Singson clan maintained handwritten genealogies tracing descent from Manasseh son of Joseph.',
    migrationPath: [
      'Ancient Land of Israel',
      'Exile across Central Asia',
      'Mizoram & Manipur High Plateaus',
      'Aliyah to Jerusalem & Northern Galilee'
    ],
    historicalNotes: 'Singson clan elders were among the first to petition Israeli Chief Rabbinates in the 1980s, presenting historical oral traditions and cultural artifacts linking their customs to biblical commandments.',
    communityPhotographs: [
      { id: 'p3', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80', caption: 'Youth Hebrew choir performing at Hanukkah festival', year: '2015', location: 'Nof HaGalil' }
    ]
  },
  {
    clanName: 'Lhungdim',
    hebrewClanName: 'שבט לונגדים',
    villageHistory: 'The Lhungdim clan served historically as peace-keepers and village arbiters across Churachandpur.',
    migrationPath: ['Ancient Israel', 'Persian Diaspora', 'Burma Hills', 'Manipur', 'Israel'],
    historicalNotes: 'Preserved the tradition of blowing the ram’s horn (Shofar) during autumn harvesting months matching Tishrei.',
    communityPhotographs: []
  },
  {
    clanName: 'Touthang',
    hebrewClanName: 'שבט טותאנג',
    villageHistory: 'Prominent artisans and textile weavers in Imphal who wove white shawls with blue stripes resembling the traditional Tallit.',
    migrationPath: ['Ancient Israel', 'Silk Road', 'Imphal Valley', 'Sderot & Galilee'],
    historicalNotes: 'Renowned for hospitality and establishing community Sunday schools.',
    communityPhotographs: []
  },
  {
    clanName: 'Kipgen',
    hebrewClanName: 'שבט קיפגן',
    villageHistory: 'Known for producing skilled craftsmen and scribes who inscribed community records.',
    migrationPath: ['Ancient Israel', 'Manipur Hills', 'Kiryat Arba'],
    historicalNotes: 'Maintained the custom of levirate marriage and jubilee land restoration.',
    communityPhotographs: []
  }
];

export class FamilyService {
  static getAllPersons(): FamilyTreePerson[] {
    return [...FAMILY_PERSONS];
  }

  static getPersonById(id: string): FamilyTreePerson | undefined {
    return FAMILY_PERSONS.find(p => p.id === id);
  }

  static getPersonsByClan(clan: string): FamilyTreePerson[] {
    if (!clan || clan === 'ALL') return [...FAMILY_PERSONS];
    return FAMILY_PERSONS.filter(p => p.familyClan === clan);
  }

  static searchPersons(query: string, filters?: {
    clan?: string;
    village?: string;
    community?: string;
    status?: string;
  }): FamilyTreePerson[] {
    const q = query.toLowerCase().trim();
    return FAMILY_PERSONS.filter(p => {
      const matchQ = !q ||
        p.name.toLowerCase().includes(q) ||
        p.hebrewName.toLowerCase().includes(q) ||
        p.familyClan.toLowerCase().includes(q) ||
        p.villageOfOrigin.toLowerCase().includes(q) ||
        p.community.toLowerCase().includes(q) ||
        p.occupation.toLowerCase().includes(q) ||
        p.familyRole.toLowerCase().includes(q);

      if (!matchQ) return false;
      if (filters?.clan && filters.clan !== 'ALL' && p.familyClan !== filters.clan) return false;
      if (filters?.village && filters.village !== 'ALL' && p.villageOfOrigin !== filters.village) return false;
      if (filters?.community && filters.community !== 'ALL' && !p.community.includes(filters.community)) return false;
      if (filters?.status && filters.status !== 'ALL') {
        if (filters.status === 'Living' && p.isDeceased) return false;
        if (filters.status === 'Deceased' && !p.isDeceased) return false;
        if (filters.status === 'Made Aliyah' && p.aliyahStatus !== 'Made Aliyah' && p.aliyahStatus !== 'Born in Israel') return false;
      }
      return true;
    });
  }

  static getTimelineEvents(clan?: string): FamilyTimelineEvent[] {
    if (!clan || clan === 'ALL') return [...TIMELINE_EVENTS];
    return TIMELINE_EVENTS.filter(e => e.familyClan === clan);
  }

  static getHeritageRecords(clan?: string): FamilyHeritageRecord[] {
    if (!clan || clan === 'ALL') return [...HERITAGE_RECORDS];
    return HERITAGE_RECORDS.filter(r => r.clanName === clan);
  }

  static getLivingMembers(): FamilyTreePerson[] {
    return FAMILY_PERSONS.filter(p => !p.isDeceased);
  }

  static getDeceasedMembersWithMemorials(): { person: FamilyTreePerson; memorial?: any }[] {
    return FAMILY_PERSONS.filter(p => p.isDeceased).map(p => {
      const memorial = p.memorialRecordId ? MemorialService.getMemorialById(p.memorialRecordId) : undefined;
      return { person: p, memorial };
    });
  }

  static addPerson(person: Omit<FamilyTreePerson, 'id'>): FamilyTreePerson {
    const newPerson: FamilyTreePerson = {
      ...person,
      id: `person_${Date.now()}`
    };

    // Link bidirectional edges
    person.parentIds.forEach(pid => {
      const parent = FAMILY_PERSONS.find(p => p.id === pid);
      if (parent && !parent.childIds.includes(newPerson.id)) {
        parent.childIds.push(newPerson.id);
      }
    });

    FAMILY_PERSONS = [...FAMILY_PERSONS, newPerson];
    return newPerson;
  }

  static updatePerson(id: string, updates: Partial<FamilyTreePerson>): FamilyTreePerson | undefined {
    const idx = FAMILY_PERSONS.findIndex(p => p.id === id);
    if (idx !== -1) {
      FAMILY_PERSONS[idx] = { ...FAMILY_PERSONS[idx], ...updates };
      return FAMILY_PERSONS[idx];
    }
    return undefined;
  }

  static addTimelineEvent(event: Omit<FamilyTimelineEvent, 'id'>): FamilyTimelineEvent {
    const newEv: FamilyTimelineEvent = {
      ...event,
      id: `tl_${Date.now()}`
    };
    TIMELINE_EVENTS = [newEv, ...TIMELINE_EVENTS];
    return newEv;
  }
}
