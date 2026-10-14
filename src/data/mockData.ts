import { LocationOption, ZmanItem, HolidayEvent, TorahStudyItem, SubscriptionTier, FamilyMember, CommunityAnnouncement } from '../types';

export const LOCATIONS: LocationOption[] = [
  { id: 'churachandpur', name: 'Churachandpur', region: 'Manipur', country: 'India', lat: 24.3333, lng: 93.6833, timezone: 'IST (UTC+5:30)' },
  { id: 'lamka', name: 'Lamka', region: 'Manipur', country: 'India', lat: 24.3400, lng: 93.6800, timezone: 'IST (UTC+5:30)' },
  { id: 'aizawl', name: 'Aizawl', region: 'Mizoram', country: 'India', lat: 23.7271, lng: 92.7176, timezone: 'IST (UTC+5:30)' },
  { id: 'imphal', name: 'Imphal', region: 'Manipur', country: 'India', lat: 24.8170, lng: 93.9368, timezone: 'IST (UTC+5:30)' },
  { id: 'kangpokpi', name: 'Kangpokpi', region: 'Manipur', country: 'India', lat: 25.1480, lng: 93.9740, timezone: 'IST (UTC+5:30)' },
  { id: 'moreh', name: 'Moreh', region: 'Manipur border', country: 'India', lat: 24.2490, lng: 94.3050, timezone: 'IST (UTC+5:30)' },
  { id: 'lunglei', name: 'Lunglei', region: 'Mizoram', country: 'India', lat: 22.8878, lng: 92.7303, timezone: 'IST (UTC+5:30)' },
  { id: 'sangaikot', name: 'Sangaikot', region: 'Manipur', country: 'India', lat: 24.1800, lng: 93.7500, timezone: 'IST (UTC+5:30)' },
  { id: 'saikul', name: 'Saikul', region: 'Manipur', country: 'India', lat: 25.0800, lng: 93.9500, timezone: 'IST (UTC+5:30)' },
  { id: 'behiang', name: 'Behiang', region: 'Manipur border', country: 'India', lat: 24.0300, lng: 93.5500, timezone: 'IST (UTC+5:30)' },
  { id: 'jerusalem', name: 'Jerusalem', region: 'Judea', country: 'Israel', lat: 31.7683, lng: 35.2137, timezone: 'IDT (UTC+3:00)' },
  { id: 'nof_hagalil', name: 'Nof HaGalil', region: 'Galilee', country: 'Israel', lat: 32.7056, lng: 35.3314, timezone: 'IDT (UTC+3:00)' },
  { id: 'haifa', name: 'Haifa', region: 'Mount Carmel', country: 'Israel', lat: 32.7940, lng: 34.9896, timezone: 'IDT (UTC+3:00)' },
  { id: 'maalot_tarshiha', name: "Ma'alot-Tarshiha", region: 'Upper Galilee', country: 'Israel', lat: 33.0167, lng: 35.2833, timezone: 'IDT (UTC+3:00)' },
  { id: 'kiryat_arba', name: 'Kiryat Arba', region: 'Judea', country: 'Israel', lat: 31.5284, lng: 35.1098, timezone: 'IDT (UTC+3:00)' },
  { id: 'beer_sheva', name: "Be'er Sheva", region: 'Negev', country: 'Israel', lat: 31.2518, lng: 34.7913, timezone: 'IDT (UTC+3:00)' },
  { id: 'upper_galilee', name: 'Upper Galilee', region: 'Northern District', country: 'Israel', lat: 33.0500, lng: 35.5000, timezone: 'IDT (UTC+3:00)' }
];

export const CURRENT_ZMANIM: ZmanItem[] = [
  { key: 'alot', label: 'Alot Hashachar (Dawn)', hebrewLabel: 'עלות השחר', time: '3:48 AM', description: 'First light of dawn on the eastern horizon.' },
  { key: 'tallit', label: 'Tallit & Tefillin', hebrewLabel: 'זמן ציצית ותפילין', time: '4:12 AM', description: 'Earliest time to wear Tallit and Tefillin with a blessing.' },
  { key: 'sunrise', label: 'Sunrise (HaNetz)', hebrewLabel: 'הנץ החמה', time: '4:31 AM', description: 'Sun disk visible above the mountain ridge.', isKeyEvent: true },
  { key: 'shema', label: 'Sof Zman Shema (GRA)', hebrewLabel: 'סוף זמן שמע', time: '8:42 AM', description: 'Latest time to recite morning Shema.' },
  { key: 'tefillah', label: 'Sof Zman Tefillah', hebrewLabel: 'סוף זמן תפילה', time: '9:58 AM', description: 'Latest time for morning Shacharit amidah.' },
  { key: 'chatzot', label: 'Chatzot (Midday)', hebrewLabel: 'חצות היום', time: '11:39 AM', description: 'Halachic solar midday.' },
  { key: 'mincha_g', label: 'Mincha Gedolah', hebrewLabel: 'מנחה גדולה', time: '12:15 PM', description: 'Earliest time to pray Mincha afternoon prayers.' },
  { key: 'plag', label: 'Plag Hamincha', hebrewLabel: 'פלג המנחה', time: '5:18 PM', description: 'One and a quarter seasonal hours before sunset.' },
  { key: 'sunset', label: 'Sunset (Shkiah)', hebrewLabel: 'שקיעת החמה', time: '6:08 PM', description: 'Sun disappears below the horizon.', isKeyEvent: true },
  { key: 'nightfall', label: 'Nightfall (Tzet)', hebrewLabel: 'צאת הכוכבים', time: '6:50 PM', description: 'Three medium stars visible; appearance of night.', isKeyEvent: true },
  { key: 'candle', label: 'Candle Lighting', hebrewLabel: 'הדלקת נרות', time: '5:50 PM', description: '18 minutes before Shabbat/Yom Tov sunset.', isKeyEvent: true },
  { key: 'havdalah', label: 'Havdalah', hebrewLabel: 'הבדילה', time: '6:50 PM', description: 'End of Shabbat or Yom Tov.' }
];

export const UPCOMING_HOLIDAYS: HolidayEvent[] = [
  {
    id: 'shivah_asar',
    name: "Shivah Asar B'Tamuz",
    hebrewName: 'שבעה עשר בתמוז',
    date: 'July 2, 2026',
    hebrewDate: '17th of Tamuz, 5786',
    category: 'Fast Day',
    description: 'Dawn-to-dusk fast marking the breach of Jerusalem’s walls and beginning the Three Weeks of mourning.',
    customs: ['Fast from dawn until nightfall', 'Special Selichot prayers', 'Refraining from weddings & celebrations']
  },
  {
    id: 'tisha_bav',
    name: "Tisha B'Av",
    hebrewName: 'תשעה באב',
    date: 'July 23, 2026',
    hebrewDate: '9th of Av, 5786',
    category: 'Fast Day',
    description: 'Full 25-hour fast commemorating the destruction of the First and Second Holy Temples.',
    customs: ['Reading Eicha (Lamentations)', 'Sitting on low benches', 'Fasting from sunset to sunset']
  },
  {
    id: 'rosh_hashanah',
    name: 'Rosh Hashanah (5787)',
    hebrewName: 'ראש השנה',
    date: 'September 12, 2026',
    hebrewDate: '1st of Tishrei, 5787',
    category: 'Major Holiday',
    description: 'Jewish New Year and Day of Judgment. The Shofar is sounded in synagogues worldwide.',
    customs: ['Blowing the Shofar 100 sounds', 'Apples dipped in honey', 'Tashlich communal prayer by flowing water']
  },
  {
    id: 'yom_kippur',
    name: 'Yom Kippur',
    hebrewName: 'יום כיפור',
    date: 'September 21, 2026',
    hebrewDate: '10th of Tishrei, 5787',
    category: 'Major Holiday',
    description: 'Day of Atonement, the holiest and most solemn day on the Hebrew calendar.',
    customs: ['25-hour fast', 'Wearing white kittel/clothing', 'Kol Nidrei & Neilah prayers']
  }
];

export const TORAH_STUDY_TRACKERS: TorahStudyItem[] = [
  {
    id: 'parashah_pinchas',
    title: 'Parashat Pinchas',
    hebrewTitle: 'פרשת פינחס',
    subtitle: 'Numbers 25:10 - 30:1',
    category: 'Parashah',
    progress: 74,
    dailyGoal: 'Aliah 4 & 5 (Daughters of Zelophehad of Tribe of Manasseh)',
    lastRead: 'Today, 2:15 PM'
  },
  {
    id: 'daf_yomi',
    title: 'Daf Yomi: Chullin',
    hebrewTitle: 'דף יומי: חולין',
    subtitle: "Today's Daf: Tractate Chullin 54",
    category: 'Daf Yomi',
    progress: 42,
    dailyGoal: 'Page 54a - Kosher preparation laws',
    lastRead: 'Yesterday, 9:30 PM'
  },
  {
    id: '48_ways',
    title: '48 Ways to Torah Wisdom',
    hebrewTitle: 'מ״ח קנייני תורה',
    subtitle: 'Pirkei Avot Chapter 6',
    category: '48 Ways',
    progress: 60,
    dailyGoal: 'Way #29: Joy in learning and companionship',
    lastRead: 'Today, 8:00 AM'
  },
  {
    id: 'tehillim_daily',
    title: 'Tehillim for the Community',
    hebrewTitle: 'תהלים יומי',
    subtitle: 'Psalms 120 - 134 (Songs of Ascent)',
    category: 'Tehillim',
    progress: 90,
    dailyGoal: 'Recited for safety & unity of Bnei Menashe in Israel & Northeast India',
    lastRead: 'Today, 7:15 AM'
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Community Free',
    price: '$0',
    billingCycle: 'forever',
    badge: 'Essential',
    description: 'Core Hebrew/Gregorian calendar, local Zmanim, and basic Torah reading tracker.',
    features: [
      'Dual Hebrew & Gregorian Calendar',
      'Accurate GPS Zmanim for all townships',
      'Weekly Parashah & Daf Yomi tracker',
      'Community announcement board',
      '5 AI Rabbi queries / month'
    ]
  },
  {
    id: 'family',
    name: 'Family Workspace',
    price: '$12',
    billingCycle: 'per month',
    badge: 'Most Popular',
    isPopular: true,
    description: 'Shared family genealogy, Yahrzeit memorials, offline sync, and unlimited AI study assistant.',
    features: [
      'Everything in Community Free',
      'Shared Family Calendar & Yahrzeit alerts',
      'Bnei Menashe Genealogy Lineage Tree builder',
      'Unlimited AI Rabbi Q&A & Hebrew dialect translation',
      'Full Offline PWA sync for remote regions',
      'Virtual Yizkor Memorial Sanctuary archive'
    ]
  },
  {
    id: 'council',
    name: 'Synagogue & Regional Council',
    price: '$89',
    billingCycle: 'per month',
    badge: 'Regional Council',
    description: 'Full governance console for Synagogue leaders, gabbaim, minyan management, and community welfare.',
    features: [
      'Everything in Family Workspace',
      'Synagogue Member & Minyan management',
      'Official Community Broadcast Alerts & notices',
      'Live Streaming & Virtual Torah classes',
      'Ma\'aser & Tzedakah welfare accounting reports',
      'Dedicated cloud storage for community archives',
      'Role-based Governance Permissions & Audit records'
    ]
  }
];

export const FAMILY_TREE_SAMPLE: FamilyMember[] = [
  {
    id: 'gen1_1',
    name: 'Menashe (Tribe Patriarch)',
    hebrewName: 'מנשה בן יוסף',
    relation: 'Ancestral Patriarch',
    birthplace: 'Egypt / Ancient Israel',
    location: 'Eternal Heritage',
    generation: 1
  },
  {
    id: 'gen2_1',
    name: 'Zelophehad & His 5 Daughters',
    hebrewName: 'צלפחד ובנותיו',
    relation: 'Tribe Leaders in Torah',
    birthplace: 'Wilderness of Sinai',
    location: 'Inheritance of Manasseh',
    generation: 2
  },
  {
    id: 'gen3_1',
    name: 'Elder Manmasi (Manasseh Tradition)',
    hebrewName: 'מנמסי - זקן העדה',
    relation: 'Community Pioneer',
    birthplace: 'Manipur Hills',
    location: 'Churachandpur Archive',
    yahrzeitHebrewDate: '12th of Cheshvan',
    generation: 3
  },
  {
    id: 'gen4_1',
    name: 'Rabbi Yochanan Singson',
    hebrewName: 'הרב יוחנן סינגסון',
    relation: 'Grandfather',
    birthplace: 'Aizawl, Mizoram',
    location: 'Jerusalem, Israel',
    yahrzeitHebrewDate: '5th of Tevet',
    generation: 4
  },
  {
    id: 'gen4_2',
    name: 'Esther Haokip Singson',
    hebrewName: 'אסתר הוקיפ סינגסון',
    relation: 'Grandmother',
    birthplace: 'Churachandpur, Manipur',
    location: 'Nof HaGalil, Israel',
    generation: 4
  },
  {
    id: 'gen5_1',
    name: 'Samuel Haokip',
    hebrewName: 'שְׁמוּאֵל הוקיפ',
    relation: 'Account Holder (You)',
    birthplace: 'Khuangkhai, Churachandpur',
    location: 'Churachandpur, India',
    generation: 5
  }
];

export const ANNOUNCEMENTS: CommunityAnnouncement[] = [
  {
    id: 'ann_1',
    title: 'Special Rosh Chodesh Av Minyan & Tehillim',
    synagogue: 'Beit Shalom Bnei Menashe Synagogue',
    location: 'Churachandpur & Live Streamed',
    date: 'Friday, July 10, 2026 • 6:30 AM IST',
    category: 'Minyan',
    attendees: 142,
    description: 'Join our united Shacharit and Tehillim prayer circle praying for blessings, health, and Aliyah progress across all regional councils.'
  },
  {
    id: 'ann_2',
    title: 'Daf Yomi Tractate Chullin Siyum Celebration',
    synagogue: 'Aizawl Torah Study Center',
    location: 'Aizawl, Mizoram',
    date: 'Sunday, July 19, 2026 • 5:00 PM IST',
    category: 'Study Group',
    attendees: 88,
    description: 'Celebrating the completion of Tractate Chullin! Festive meal and guest lecture on Bnei Menashe shechita traditions.'
  },
  {
    id: 'ann_3',
    title: 'Youth Hebrew Conversational & Torah Workshop',
    synagogue: 'Nof HaGalil Community Hall',
    location: 'Nof HaGalil, Israel',
    date: 'Every Tuesday • 7:00 PM IDT',
    category: 'Volunteer',
    attendees: 64,
    description: 'Empowering young adults with advanced conversational Hebrew, Torah chantings, and Israeli tech mentoring.'
  }
];
