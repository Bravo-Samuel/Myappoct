import { MemorialRecord, MemorialTribute } from '../../types';

let MEMORIAL_RECORDS: MemorialRecord[] = [
  {
    id: 'mem_1',
    name: 'Haokip Lunkholal',
    hebrewName: 'יוסף לונכהולל הוקיפ',
    birthYear: 1942,
    passingYear: 2018,
    hebrewPassingDate: '13 Tammuz 5778',
    gregorianPassingDate: 'June 26, 2018',
    relationship: 'Father',
    biographyPreview: 'Beloved Father & Grandfather who steadfastly kept Shabbat in Churachandpur and inspired his family’s eternal return to Zion.',
    fullBiography: 'Haokip Lunkholal was born in the lush hills of Manipur in 1942. Throughout decades of hardship, he maintained an unwavering faith in the heritage of Manasseh. He led Shabbat prayers in his local home minyan, taught Hebrew alphabet chants to three generations of children, and lived to see his eldest children make Aliyah to the Holy Land before his passing.',
    familyName: 'Haokip',
    village: 'Churachandpur',
    community: 'Manipur → Nof HaGalil',
    candlesCount: 142,
    isLitByUser: true,
    isYahrzeitToday: false,
    memoriesCount: 18,
    timeline: [
      { year: '1942', title: 'Birth in Manipur', description: 'Born into a traditional Bnei Menashe family preserving ancient tribal memory.', location: 'Churachandpur' },
      { year: '1975', title: 'Founding Community Minyan', description: 'Established regular Saturday prayer gatherings and biblical study.', location: 'Manipur Hills' },
      { year: '2012', title: 'First Visit to Jerusalem', description: 'Achieved a lifelong dream by praying at the Western Wall with his grandchildren.', location: 'Jerusalem, Israel' },
      { year: '2018', title: 'Eternal Rest', description: 'Passed peacefully surrounded by family singing Shabbat Zemirot.', location: 'Nof HaGalil, Israel' }
    ],
    galleryUrls: [],
    psalmRecommendation: {
      number: 23,
      title: 'Mizmor LeDavid (Psalm 23)',
      hebrewExcerpt: 'יְהוָה רֹעִי, לֹא אֶחְסָר. בִּנְאוֹת דֶּשֶׁא יַרְבִּיצֵנִי',
      englishExcerpt: 'The Lord is my shepherd; I shall not want. He makes me lie down in green pastures...'
    }
  },
  {
    id: 'mem_2',
    name: 'Neihulhing Haokip',
    hebrewName: 'שרה נֵיהוּלְהִינְג הוקיפ',
    birthYear: 1947,
    passingYear: 2019,
    hebrewPassingDate: '5 Elul 5779',
    gregorianPassingDate: 'September 5, 2019',
    relationship: 'Mother',
    biographyPreview: 'Beloved Mother & Grandmother known for her legendary hospitality and hosting communal Passover seders for over 80 people.',
    fullBiography: 'Neihulhing was the spiritual anchor of her family. Her home in Aizawl was known across Mizoram as a sanctuary of warmth, where travelers and students were welcomed with open arms and kosher home-cooked delicacies. Her deep piety and gentle wisdom guided dozens of young Bnei Menashe women.',
    familyName: 'Haokip',
    village: 'Aizawl',
    community: 'Mizoram → Kiryat Arba',
    candlesCount: 218,
    isLitByUser: false,
    isYahrzeitToday: false,
    memoriesCount: 24,
    timeline: [
      { year: '1947', title: 'Birth in Mizoram', description: 'Raised in a close-knit village with rich oral traditions of Israel.', location: 'Aizawl' },
      { year: '1985', title: 'Communal Seder Organizer', description: 'Initiated the annual communal Passover seder using hand-made matzoh.', location: 'Aizawl Synagogue' },
      { year: '2015', title: 'Aliyah to the Holy Land', description: 'Arrived in Israel with her children and grandchildren.', location: 'Kiryat Arba' },
      { year: '2019', title: 'Rest in Peace', description: 'Remembered as a righteous mother of Israel.', location: 'Kiryat Arba, Israel' }
    ],
    galleryUrls: [],
    psalmRecommendation: {
      number: 121,
      title: 'Shir LaMaalot (Psalm 121)',
      hebrewExcerpt: 'אֶשָּׂא עֵינַי אֶל הֶהָרִים, מֵאַיִן יָבֹא עֶזְרִי',
      englishExcerpt: 'I lift up my eyes to the hills—from where will my help come? My help comes from the Lord...'
    }
  },
  {
    id: 'mem_3',
    name: 'Rabbi Yochanan Singson',
    hebrewName: 'הרב יוחנן סינגסון',
    birthYear: 1938,
    passingYear: 2020,
    hebrewPassingDate: '17 Tammuz 5780',
    gregorianPassingDate: 'July 9, 2020',
    relationship: 'Elder',
    biographyPreview: 'Community Pioneer & Elder who dedicated 50 years to teaching Torah and translating Hebrew siddurim into Mizo and Kuki.',
    fullBiography: 'Rabbi Yochanan Singson was one of the foremost pioneers of the Bnei Menashe renaissance. Recognizing the profound connection between ancient Manasseh traditions and written Halacha, he labored endlessly to translate Hebrew prayers into local languages, bridging ancient tribal customs with formal normative Judaism.',
    familyName: 'Singson',
    village: 'Churachandpur',
    community: 'Manipur → Jerusalem',
    candlesCount: 450,
    isLitByUser: true,
    isYahrzeitToday: true,
    memoriesCount: 52,
    timeline: [
      { year: '1938', title: 'Born in Manipur', description: 'Learned the ancient songs of Zion from his elders.', location: 'Churachandpur' },
      { year: '1982', title: 'First Mizo Siddur Translation', description: 'Completed handwritten translations of Shabbat liturgy.', location: 'Manipur' },
      { year: '2005', title: 'Historic Aliyah', description: 'Welcomed at Ben Gurion Airport amidst great joyous singing.', location: 'Jerusalem' }
    ],
    galleryUrls: [],
    psalmRecommendation: {
      number: 16,
      title: 'Michtam LeDavid (Psalm 16)',
      hebrewExcerpt: 'שִׁוִּיתִי יְהוָה לְנֶגְדִּי תָמִיד, כִּי מִימִינִי בַּל אֶמּוֹט',
      englishExcerpt: 'I have set the Lord always before me; because He is at my right hand, I shall not be moved...'
    }
  },
  {
    id: 'mem_4',
    name: 'Jangmang Haokip',
    hebrewName: 'יהושע גַ׳נְגְמַנְג הוקיפ',
    birthYear: 1998,
    passingYear: 2021,
    hebrewPassingDate: '17 Av 5781',
    gregorianPassingDate: 'July 26, 2021',
    relationship: 'Son',
    biographyPreview: 'Beloved Son & Brother whose radiant smile, Torah learning, and love for Eretz Yisrael brought joy to everyone around him.',
    fullBiography: 'Jangmang was a beacon of light for Bnei Menashe youth. Exceling in both religious studies and community service, he volunteered mentoring new immigrant teens in Nof HaGalil. Though his life was short, the impact of his kindness, devotion, and joy continues to resonate deeply.',
    familyName: 'Haokip',
    village: 'Kangpokpi',
    community: 'Manipur → Nof HaGalil',
    candlesCount: 310,
    isLitByUser: false,
    isYahrzeitToday: false,
    memoriesCount: 41,
    timeline: [
      { year: '1998', title: 'Birth in Kangpokpi', description: 'A joyful addition to a dedicated community family.', location: 'Kangpokpi' },
      { year: '2016', title: 'Aliyah & Yeshiva Studies', description: 'Immersed himself in Hebrew language and Torah study.', location: 'Nof HaGalil' }
    ],
    galleryUrls: [],
    psalmRecommendation: {
      number: 23,
      title: 'Mizmor LeDavid (Psalm 23)',
      hebrewExcerpt: 'גַּם כִּי אֵלֵךְ בְּגֵיא צַלְמָוֶת לֹא אִירָא רָע',
      englishExcerpt: 'Even though I walk through the valley of the shadow of death, I will fear no evil...'
    }
  },
  {
    id: 'mem_5',
    name: 'Thanglianmang Haokip',
    hebrewName: 'רבקה תַּנְגְלִיאנְמַנְג הוקיפ',
    birthYear: 1935,
    passingYear: 2016,
    hebrewPassingDate: '2 Cheshvan 5777',
    gregorianPassingDate: 'November 3, 2016',
    relationship: 'Grandmother',
    biographyPreview: 'Beloved Grandmother and tribal storyteller who preserved the ancient song of the Red Sea crossing across generations.',
    fullBiography: 'Grandmother Thanglianmang carried within her memory the sacred songs and history of the tribe of Manasseh passed down orally for centuries. She recounted the miraculous preservation of tribal identity during wanderings and instilled deep pride and faith in her descendants.',
    familyName: 'Haokip',
    village: 'Behiang',
    community: 'Manipur → Nof HaGalil',
    candlesCount: 189,
    isLitByUser: false,
    isYahrzeitToday: false,
    memoriesCount: 29,
    timeline: [
      { year: '1935', title: 'Birth near the Border', description: 'Raised amidst ancient oral traditions.', location: 'Behiang' },
      { year: '2014', title: 'Gathering the Generations', description: 'Witnessed four generations gathered together under the Israeli sky.', location: 'Nof HaGalil' }
    ],
    galleryUrls: [],
    psalmRecommendation: {
      number: 121,
      title: 'Shir LaMaalot (Psalm 121)',
      hebrewExcerpt: 'הִנֵּה לֹא יָנוּם וְלֹא יִישָׁן שׁוֹמֵר יִשְׂרָאֵל',
      englishExcerpt: 'Behold, He who keeps Israel shall neither slumber nor sleep...'
    }
  },
  {
    id: 'mem_6',
    name: 'Elder Manmasi Lhungdim',
    hebrewName: 'מנמסי לונגדים זקן העדה',
    birthYear: 1925,
    passingYear: 2010,
    hebrewPassingDate: '12 Cheshvan 5771',
    gregorianPassingDate: 'October 20, 2010',
    relationship: 'Community Pioneer',
    biographyPreview: 'Venerated elder who guarded community scrolls and guided the first communal petitions to chief rabbinates in Israel.',
    fullBiography: 'Elder Manmasi was revered as a patriarch of the community. In an era when external communication was scarce, he organized community gatherings, recorded genealogical lineages, and encouraged every family to hold fast to the dream of Jerusalem.',
    familyName: 'Lhungdim',
    village: 'Churachandpur',
    community: 'Manipur Hills',
    candlesCount: 520,
    isLitByUser: true,
    isYahrzeitToday: false,
    memoriesCount: 65,
    timeline: [
      { year: '1925', title: 'Birth in Manipur', description: 'Born into tribal elder lineage.', location: 'Manipur Hills' },
      { year: '1970', title: 'Genealogical Archive Creation', description: 'Documented family trees linking clans to Manasseh.', location: 'Churachandpur' }
    ],
    galleryUrls: [],
    psalmRecommendation: {
      number: 16,
      title: 'Michtam LeDavid (Psalm 16)',
      hebrewExcerpt: 'חֲבָלִים נָפְלוּ לִי בַּנְּעִמִים, אַף נַחֲלָת שָׁפְרָה עָלָי',
      englishExcerpt: 'The lines have fallen to me in pleasant places; indeed, my heritage is beautiful to me...'
    }
  },
  {
    id: 'mem_7',
    name: 'Leah Touthang',
    hebrewName: 'לאה טותאנג',
    birthYear: 1952,
    passingYear: 2022,
    hebrewPassingDate: '17 Tammuz 5782',
    gregorianPassingDate: 'July 16, 2022',
    relationship: 'Mother',
    biographyPreview: 'Beloved Mother and Sunday school educator who taught Hebrew songs and Torah stories to hundreds of children.',
    fullBiography: 'Leah dedicated her life to children’s education. With boundless patience and a gentle voice, she taught Hebrew songs, holiday stories, and the beauty of Jewish values. Even after moving to Sderot, her apartment remained filled with children learning and singing.',
    familyName: 'Touthang',
    village: 'Imphal',
    community: 'Manipur → Sderot',
    candlesCount: 274,
    isLitByUser: false,
    isYahrzeitToday: true,
    memoriesCount: 38,
    timeline: [
      { year: '1952', title: 'Birth in Imphal', description: 'Grew up with love for music and learning.', location: 'Imphal' },
      { year: '1990', title: 'Establishes Torah Youth Choir', description: 'Organized children’s choir performing holiday hymns.', location: 'Manipur' }
    ],
    galleryUrls: [],
    psalmRecommendation: {
      number: 23,
      title: 'Mizmor LeDavid (Psalm 23)',
      hebrewExcerpt: 'תַּעֲרֹךְ לְפָנַי שֻׁלְחָן נֶגֶד צֹרְרָי, דִּשַּׁנְתָּ בַשֶּׁמֶן רֹאשִׁי כּוֹסִי רְוָיָה',
      englishExcerpt: 'You prepare a table before me in the presence of my enemies; You anoint my head with oil; my cup overflows...'
    }
  },
  {
    id: 'mem_8',
    name: 'Shalom Kipgen',
    hebrewName: 'שלום קיפגן',
    birthYear: 1960,
    passingYear: 2023,
    hebrewPassingDate: '22 Kislev 5784',
    gregorianPassingDate: 'December 5, 2023',
    relationship: 'Brother',
    biographyPreview: 'Devoted Brother & Community Torah scribe who inscribed mezuzot and tefillin with meticulous care and holiness.',
    fullBiography: 'Shalom combined skilled craftsmanship with profound spiritual devotion. After studying SaFRuT (Torah scribal arts) in Jerusalem, he wrote parchment scrolls and mezuzot for synagogues and homes across the Bnei Menashe diaspora.',
    familyName: 'Kipgen',
    village: 'Churachandpur',
    community: 'Manipur → Kiryat Arba',
    candlesCount: 196,
    isLitByUser: false,
    isYahrzeitToday: false,
    memoriesCount: 22,
    timeline: [
      { year: '1960', title: 'Birth in Churachandpur', description: 'Showed early talent for calligraphy and sacred arts.', location: 'Churachandpur' },
      { year: '2010', title: 'Certified Sofer STaM', description: 'Received rabbinic ordination as a certified Torah scribe.', location: 'Jerusalem' }
    ],
    galleryUrls: [],
    psalmRecommendation: {
      number: 121,
      title: 'Shir LaMaalot (Psalm 121)',
      hebrewExcerpt: 'יְהוָה יִשְׁמָרְךָ מִכָּל רָע, יִשְׁמֹר אֶת נַפְשֶׁךָ',
      englishExcerpt: 'The Lord shall preserve you from all evil; He shall preserve your soul...'
    }
  }
];

let MEMORIAL_TRIBUTES: MemorialTribute[] = [
  {
    id: 'trib_1',
    memorialId: 'mem_1',
    authorName: 'David Haokip',
    authorRelation: 'Son',
    community: 'Nof HaGalil, Israel',
    message: 'Abba, your Friday night blessings continue to protect our home every Shabbat. We miss your gentle smile and deep faith.',
    timestamp: '2 hours ago',
    likes: 19
  },
  {
    id: 'trib_2',
    memorialId: 'mem_1',
    authorName: 'Miriam Singson',
    authorRelation: 'Community Member',
    community: 'Jerusalem, Israel',
    message: 'We will never forget how Haokip Lunkholal opened his home for every traveler in Manipur. May his memory be a righteous blessing.',
    timestamp: '1 day ago',
    likes: 14
  },
  {
    id: 'trib_3',
    memorialId: 'mem_3',
    authorName: 'Yonatan Lhungdim',
    authorRelation: 'Student',
    community: 'Churachandpur, India',
    message: 'Moreh Yochanan taught me my very first Hebrew letters. Because of his devotion, thousands of us are connected to Torah today.',
    timestamp: 'Today',
    likes: 28
  },
  {
    id: 'trib_4',
    memorialId: 'mem_2',
    authorName: 'Rachel Haokip',
    authorRelation: 'Daughter',
    community: 'Kiryat Arba, Israel',
    message: 'Imma, your matzoh soup and seder table warmth live on in our kitchen every single Passover. Yehi Zichra Baruch.',
    timestamp: '3 days ago',
    likes: 21
  }
];

export class MemorialService {
  static getAllMemorials(): MemorialRecord[] {
    return [...MEMORIAL_RECORDS];
  }

  static getMemorialById(id: string): MemorialRecord | undefined {
    return MEMORIAL_RECORDS.find(m => m.id === id);
  }

  static searchMemorials(query: string, filters: {
    family?: string;
    village?: string;
    community?: string;
    relationship?: string;
    yahrzeitOnly?: boolean;
  }): MemorialRecord[] {
    const q = query.toLowerCase().trim();
    return MEMORIAL_RECORDS.filter(m => {
      // Query filter
      const matchQuery = !q || 
        m.name.toLowerCase().includes(q) || 
        m.hebrewName.toLowerCase().includes(q) || 
        m.familyName.toLowerCase().includes(q) ||
        m.village.toLowerCase().includes(q) ||
        m.community.toLowerCase().includes(q) ||
        m.biographyPreview.toLowerCase().includes(q);

      if (!matchQuery) return false;

      // Dropdown Filters
      if (filters.family && filters.family !== 'ALL' && m.familyName !== filters.family) return false;
      if (filters.village && filters.village !== 'ALL' && m.village !== filters.village) return false;
      if (filters.relationship && filters.relationship !== 'ALL' && m.relationship !== filters.relationship) return false;
      if (filters.yahrzeitOnly && !m.isYahrzeitToday) return false;

      return true;
    });
  }

  static getStatistics() {
    const totalNames = MEMORIAL_RECORDS.length + 334; // representing community archive history
    const totalCandles = MEMORIAL_RECORDS.reduce((sum, m) => sum + m.candlesCount, 0) + 1040;
    const totalTributes = MEMORIAL_TRIBUTES.length + 4820;
    const familiesCount = new Set(MEMORIAL_RECORDS.map(m => m.familyName)).size + 178;
    const todaysYahrzeits = MEMORIAL_RECORDS.filter(m => m.isYahrzeitToday).length;

    return {
      totalNames,
      totalCandles,
      totalTributes,
      familiesCount,
      todaysYahrzeits
    };
  }

  static lightCandle(id: string): MemorialRecord | undefined {
    const mem = MEMORIAL_RECORDS.find(m => m.id === id);
    if (mem) {
      if (!mem.isLitByUser) {
        mem.candlesCount += 1;
        mem.isLitByUser = true;
      }
    }
    return mem;
  }

  static getTributes(memorialId?: string): MemorialTribute[] {
    if (!memorialId) return [...MEMORIAL_TRIBUTES];
    return MEMORIAL_TRIBUTES.filter(t => t.memorialId === memorialId);
  }

  static addTribute(tribute: Omit<MemorialTribute, 'id' | 'timestamp' | 'likes'>): MemorialTribute {
    const newT: MemorialTribute = {
      ...tribute,
      id: `trib_${Date.now()}`,
      timestamp: 'Just now',
      likes: 1
    };
    MEMORIAL_TRIBUTES = [newT, ...MEMORIAL_TRIBUTES];
    const mem = MEMORIAL_RECORDS.find(m => m.id === tribute.memorialId);
    if (mem) {
      mem.memoriesCount += 1;
    }
    return newT;
  }

  static createMemorial(newRecordData: Omit<MemorialRecord, 'id' | 'candlesCount' | 'memoriesCount' | 'isLitByUser'>): MemorialRecord {
    const created: MemorialRecord = {
      ...newRecordData,
      id: `mem_${Date.now()}`,
      candlesCount: 1,
      memoriesCount: 0,
      isLitByUser: true
    };
    MEMORIAL_RECORDS = [created, ...MEMORIAL_RECORDS];
    return created;
  }
}
