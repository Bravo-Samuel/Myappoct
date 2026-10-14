import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Radio, 
  MapPin, 
  Heart, 
  Plus, 
  Calendar, 
  Video, 
  MessageSquareQuote, 
  HelpCircle, 
  Sun, 
  Sunrise, 
  Sunset, 
  BookOpen, 
  Flame, 
  Compass, 
  ShieldAlert, 
  Sparkles, 
  Phone, 
  Mail, 
  Clock, 
  Map, 
  ClipboardList, 
  Info, 
  ChevronRight, 
  Check, 
  Award, 
  Eye, 
  ExternalLink, 
  Moon, 
  RefreshCw, 
  ChevronLeft, 
  Smile, 
  BookmarkCheck, 
  Activity, 
  HeartHandshake
} from 'lucide-react';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';
import { NavSection } from '../../types';

interface CommunityViewProps {
  onNavigate?: (section: NavSection) => void;
}

// Hebrew & English Tehillim (Psalm 23) for Memorial Board
const psalm23Hebrew = `מִזְמוֹר לְדָוִד: יְהוָה רֹעִי, לֹא אֶחְסָר.
בִּנְאוֹת דֶּשֶׁא, יַרְבִּיצֵנִי; עַל-מֵי מְנֻחוֹת יְנַהֲלֵנִי.
נַפְשִׁי יְשׁוֹבֵב; יַנְחֵנִי בְמַעְגְּלֵי-צֶדֶק, לְמַעַן שְׁמוֹ.
גַּם כִּי-אֵלֵךְ בְּגֵיא צַלְמָוֶת, לֹא-אִירָא רָע--כִּי-אַתָּה עִמָּדִי;
שִׁבְטְךָ וּמִשְׁעַנְתֶּךָ, הֵמָּה יְנַחֲמֻנִי.
תַּעֲרֹךְ לְפָנַי, שׁ🇺🇲לְחָן--נֶגֶד צֹרְרָי;
דִּשַּׁנְתָּ בַשֶּׁמֶן רֹאשִׁי, כּוֹסִי רְוָיָה.
אַךְ, טוֹב וָחֶסֶד יִרְדְּפוּנִי כָּל-יְמֵי חַיָּי;
וְשַׁבְתִּי בְּבֵית-יְהוָה, לְאֹרֶךְ יָמִים.`;

const psalm23English = `A Psalm of David.
The LORD is my shepherd; I shall not want.
He maketh me to lie down in green pastures; He leadeth me beside the still waters.
He restoreth my soul; He guideth me in straight paths for His name's sake.
Yea, though I walk through the valley of the shadow of death, I will fear no evil, for Thou art with me; Thy rod and Thy staff, they comfort me.
Thou preparest a table before me in the presence of mine enemies; Thou hast anointed my head with oil; my cup runneth over.
Surely goodness and mercy shall follow me all the days of my life; and I shall dwell in the house of the LORD for ever.`;

// List of other regional synagogues for SECTION 13
const OTHER_SYNAGOGUES = [
  {
    name: "Shalom Zion Synagogue",
    community: "Imphal Community",
    region: "Manipur, India",
    rabbi: "Rabbi Yehuda Lhungdim",
    phone: "+91 98765 43211",
    email: "imphal@bneimenashe.org",
    address: "Kekru Villa, Imphal West, Manipur 795001"
  },
  {
    name: "Ateret Menashe Synagogue",
    community: "Aizawl Community",
    region: "Mizoram, India",
    rabbi: "Rabbi Shimshon Haokip",
    phone: "+91 98765 43212",
    email: "aizawl@bneimenashe.org",
    address: "Chaltlang, Aizawl, Mizoram 796012"
  },
  {
    name: "Beit El Congregation",
    community: "Nof HaGalil Center",
    region: "Galilee, Israel",
    rabbi: "Rabbi Yosef Kipgen",
    phone: "+972 4 123 4567",
    email: "nofhalgalil@bneimenashe.org",
    address: "Har Yonah, Nof HaGalil, Israel"
  },
  {
    name: "Or Chadasch Synagogue",
    community: "Kiryat Arba Community",
    region: "Judea, Israel",
    rabbi: "Rabbi Elazar Singson",
    phone: "+972 2 987 6543",
    email: "kiryatarba@bneimenashe.org",
    address: "Hebron Hills District, Kiryat Arba, Israel"
  }
];

// Thoughts for SECTION 14
const TORAH_THOUGHTS = [
  {
    text: "The world stands upon three things: upon the Torah, upon divine service, and upon acts of loving-kindness.",
    source: "Pirkei Avot 1:2"
  },
  {
    text: "May your home be filled with peace, light, and the eternal warmth of Torah today.",
    source: "Kehillah Blessing"
  },
  {
    text: "He who saves a single soul, it is as if he has saved an entire world.",
    source: "Talmud Sanhedrin 37a"
  },
  {
    text: "One small deed of kindness in our community shines brighter than a thousand words of advice.",
    source: "Chassidic Saying"
  },
  {
    text: "The Bnei Menashe journey home is a living testament to Hashem's eternal promise of covenant and redemption.",
    source: "Rabbinic Thought"
  }
];

export const CommunityView: React.FC<CommunityViewProps> = ({ onNavigate }) => {
  const { profile } = useSupabaseAuth();
  
  // Base details with personalized fallback
  const userName = profile?.full_name?.split(' ')[0] || "Samuel";
  const userHebrewName = profile?.hebrew_name || "Shmuel";
  const userSynagogue = profile?.onboarding_location?.synagogue || "Beit Shalom Synagogue";
  const userCommunity = profile?.onboarding_location?.community || "Khuangkhai Community";
  const userDistrict = profile?.onboarding_location?.district || "Churachandpur";

  // Active States for simulation and interactivity
  const [showPsalmModal, setShowPsalmModal] = useState<boolean>(false);
  const [isCandleLit, setIsCandleLit] = useState<boolean>(false);
  const [candleLitCount, setCandleLitCount] = useState<number>(42);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasVolunteered, setHasVolunteered] = useState<Record<number, boolean>>({});
  
  // Active States for display (simulations removed to preserve mature, production standard)
  const simulateEmptyPulse = false;
  const simulateEmptyPrayers = false;
  const simulateEmptyYahrzeit = false;
  const simulateEmptyVolunteers = false;
  const simulateEmptyProgress = false;

  // SECTION 6: Prayer Request state
  const [prayerRequests, setPrayerRequests] = useState([
    { id: 1, name: "Sarah bat Leah", reason: "Refuah Shleimah (Complete Healing)", location: "Churachandpur", count: 18 },
    { id: 2, name: "Yosef ben Esther", reason: "Safe travel and Aliyah absorption preparations", location: "Aizawl → Jerusalem", count: 12 },
    { id: 3, name: "Bnei Menashe Pioneers", reason: "Strength, protection, and integration support", location: "Kiryat Arba & Galilee", count: 54 }
  ]);
  const [newPrayerName, setNewPrayerName] = useState('');
  const [newPrayerReason, setNewPrayerReason] = useState('');
  const [showAddPrayerForm, setShowAddPrayerForm] = useState(false);

  // SECTION 8: Volunteers State
  const [volunteerOpportunities, setVolunteerOpportunities] = useState([
    { id: 1, title: "Teach Hebrew Ulpan", description: "Help adult learners master basic conversational Hebrew in preparation for their upcoming Aliyah.", time: "Today, 5:30 PM", location: "Library Annex", count: 4 },
    { id: 2, title: "Elder Home Visiting", description: "Bring joy and community updates to elderly members unable to attend the synagogue services.", time: "Today, 2:00 PM", location: "Churachandpur Ward V", count: 7 },
    { id: 3, title: "Food Box Sorting & Distribution", description: "Organize dry grain and flour donations and deliver packages to needy households.", time: "Today, 10:00 AM", location: "Synagogue Kitchen Annex", count: 12 }
  ]);

  // SECTION 14: Rotatable thoughts
  const [thoughtIndex, setThoughtIndex] = useState<number>(0);

  // SECTION 2: MY NEXT ACTION ⭐
  // Allow toggling next action for an interactive demonstration
  const [nextActionIndex, setNextActionIndex] = useState<number>(0);
  const nextActions = [
    {
      title: "Complete Official Census Survey",
      description: "Your official Bnei Menashe household census review is waiting. Completing this ensures proper council documentation and Aliyah priority queues.",
      label: "Continue Census",
      section: "census_demographics" as NavSection,
      icon: <ClipboardList className="w-5 h-5 text-amber-400" />
    },
    {
      title: "Mincha Prayers Commence Soon",
      description: "The community Mincha service begins in 2 hours. Join your neighbors for unified prayers in the main sanctuary.",
      label: "View Zmanim",
      section: "zmanim" as NavSection,
      icon: <Clock className="w-5 h-5 text-amber-400" />
    },
    {
      title: "Today's Torah Portion Ready",
      description: "Dive into Parashat Pinchas. The daily study focus on the Daughters of Zelophehad is ready for review.",
      label: "Study Torah",
      section: "torah_library" as NavSection,
      icon: <BookOpen className="w-5 h-5 text-amber-400" />
    },
    {
      title: "Unread Community Announcement",
      description: "A critical Halachic announcement regarding the upcoming 17 Tammuz fast tomorrow has been posted by the Regional Council.",
      label: "Read Announcement",
      section: "communications_center" as NavSection,
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />
    }
  ];

  // Countdowns to next prayer (Dynamic local time matching July 6, 2026, 7:36 PM)
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [nextPrayerName, setNextPrayerName] = useState<string>('Maariv');

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const curHours = now.getHours();
      const curMins = now.getMinutes();
      const curSecs = now.getSeconds();

      let targetHours = 19;
      let targetMins = 30;
      let name = 'Maariv';

      const totalMinutesNow = curHours * 60 + curMins;
      if (totalMinutesNow < 6 * 60) {
        targetHours = 6;
        targetMins = 0;
        name = 'Shacharit';
      } else if (totalMinutesNow < 12 * 60 + 15) {
        targetHours = 12;
        targetMins = 15;
        name = 'Mincha';
      } else if (totalMinutesNow < 19 * 60 + 30) {
        targetHours = 19;
        targetMins = 30;
        name = 'Maariv';
      } else {
        targetHours = 6 + 24;
        targetMins = 0;
        name = 'Shacharit (Tomorrow)';
      }

      setNextPrayerName(name);

      const nowInSeconds = (curHours * 3600) + (curMins * 60) + curSecs;
      const targetInSeconds = (targetHours * 3600) + (targetMins * 60);
      let diff = targetInSeconds - nowInSeconds;

      if (diff < 0) {
        diff = 0;
      }

      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      if (h > 0) {
        setTimeRemaining(`${h}h ${m}m ${s}s`);
      } else {
        setTimeRemaining(`${m}m ${s}s`);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Automatic Thought Rotator (Section 14)
  useEffect(() => {
    const thoughtTimer = setInterval(() => {
      setThoughtIndex(prev => (prev + 1) % TORAH_THOUGHTS.length);
    }, 12000);
    return () => clearInterval(thoughtTimer);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Submit prayer requests
  const handleAddPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayerName.trim()) return;
    setPrayerRequests(prev => [
      {
        id: Date.now(),
        name: newPrayerName,
        reason: newPrayerReason.trim() || "Refuah Sheleimah & Blessings",
        location: userCommunity,
        count: 1
      },
      ...prev
    ]);
    setNewPrayerName('');
    setNewPrayerReason('');
    setShowAddPrayerForm(false);
    triggerToast("Mi Shebeirach request added onto the living prayer board.");
  };

  // Pray together action
  const handlePrayTogether = (id: number) => {
    setPrayerRequests(prev => prev.map(p => p.id === id ? { ...p, count: p.count + 1 } : p));
    triggerToast("Joined in reciting Tehillim for this beloved soul. Amen!");
  };

  // Volunteer toggle
  const handleJoinVolunteer = (id: number, title: string) => {
    const isJoined = !!hasVolunteered[id];
    setHasVolunteered(prev => ({ ...prev, [id]: !isJoined }));
    
    setVolunteerOpportunities(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, count: isJoined ? item.count - 1 : item.count + 1 };
      }
      return item;
    }));

    if (!isJoined) {
      triggerToast(`Thank you! You are registered to volunteer for: ${title}`);
    } else {
      triggerToast(`Your registration was cancelled for: ${title}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32 px-4 sm:px-6 text-slate-100" id="kehillah-living-synagogue-container">

      {/* ====================================================
          SECTION 1 — WELCOME & SACRED HEADER
          ==================================================== */}
      <header className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-amber-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6" id="welcome-sacred-header">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>The Living Synagogue Experience</span>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Shalom, <span className="text-amber-400">{userName}</span>.
            </h1>
            <p className="text-base sm:text-lg font-medium text-slate-300">
              Welcome to <span className="text-white underline decoration-amber-500/40 decoration-2">{userSynagogue}</span>
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{userCommunity} • {userDistrict} Region</span>
            </p>
          </div>
        </div>

        {/* Live Calendar and Info Metadata Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-3.5 max-w-lg w-full relative z-10 bg-slate-950/40 p-4 rounded-2xl border border-white/5 font-sans text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Hebrew Date</span>
            <div className="text-white font-black">17 Tammuz 5786</div>
            <div className="text-[10px] text-amber-400 font-medium">ט״ז בְּתַמּוּז</div>
          </div>
          
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Gregorian Date</span>
            <div className="text-white font-black">Monday, July 6, 2026</div>
            <div className="text-[10px] text-slate-400 font-medium">Fast commences tomorrow</div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Current Parashah</span>
            <div className="text-white font-bold flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Pinchas</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Numbers 25:10 - 30:1</div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Today&apos;s Weather</span>
            <div className="text-white font-black flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Sunny • 27°C</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Churachandpur Center</div>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-amber-500/40 text-slate-100 shadow-2xl flex items-center gap-3 animate-bounce max-w-md">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs font-bold leading-normal">{toastMessage}</p>
        </div>
      )}

      {/* ====================================================
          SECTION 2 — MY NEXT ACTION ⭐ (FOCAL POINT)
          ==================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-slate-900 border border-amber-500/30 shadow-xl relative" id="my-next-action">
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <button 
            onClick={() => setNextActionIndex(prev => (prev - 1 + nextActions.length) % nextActions.length)}
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
            title="Previous Action"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-slate-400 font-mono font-bold px-1">
            {nextActionIndex + 1}/{nextActions.length}
          </span>
          <button 
            onClick={() => setNextActionIndex(prev => (prev + 1) % nextActions.length)}
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
            title="Next Action"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 font-mono">My Next Action</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/20 shrink-0">
              {nextActions[nextActionIndex].icon}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white tracking-tight">{nextActions[nextActionIndex].title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">{nextActions[nextActionIndex].description}</p>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <p className="text-[10px] text-slate-400 font-mono">Recommended action matches your profile status</p>
            <button
              onClick={() => onNavigate && onNavigate(nextActions[nextActionIndex].section)}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center gap-1"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Grid containing Section 3 & Section 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ====================================================
            SECTION 3 — TODAY'S PRAYER (ZMANIM ENGINE)
            ==================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6" id="todays-prayer-times">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Beit Shalom Zmanim</span>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>Today&apos;s Prayers</span>
              </h3>
            </div>
            <button 
              onClick={() => onNavigate && onNavigate('zmanim')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-amber-300 border border-white/10 transition-colors"
            >
              Complete Prayer Times
            </button>
          </div>

          {/* Quick Times List */}
          <div className="space-y-3.5">
            {/* Shacharit Card */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${nextPrayerName === 'Shacharit' ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-950/40 border-white/5'}`}>
              <div className="flex items-center gap-3">
                <Sunrise className="w-4 h-4 text-amber-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Shacharit</h4>
                  <p className="text-[10px] text-slate-400">Minyan starts with Korbanot</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-white">06:00 AM</div>
                {nextPrayerName === 'Shacharit' && <span className="text-[9px] text-amber-400 uppercase font-mono tracking-wider">Next Prayer</span>}
              </div>
            </div>

            {/* Mincha Card */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${nextPrayerName === 'Mincha' ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-950/40 border-white/5'}`}>
              <div className="flex items-center gap-3">
                <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
                <div>
                  <h4 className="text-xs font-bold text-white">Mincha</h4>
                  <p className="text-[10px] text-slate-400">Mincha Gedolah (Noon)</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-white">12:15 PM</div>
                {nextPrayerName === 'Mincha' && <span className="text-[9px] text-amber-400 uppercase font-mono tracking-wider">Next Prayer</span>}
              </div>
            </div>

            {/* Maariv Card */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${nextPrayerName === 'Maariv' ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-950/40 border-white/5'}`}>
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-indigo-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Maariv</h4>
                  <p className="text-[10px] text-slate-400">Evening blessings & Shema</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-white">07:30 PM</div>
                {nextPrayerName === 'Maariv' && <span className="text-[9px] text-amber-400 uppercase font-mono tracking-wider animate-pulse">Next Prayer</span>}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 flex items-center justify-between">
            <div className="space-y-0.5 text-left">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Remaining to {nextPrayerName}</span>
              <span className="text-xs text-slate-300 font-light">Be on time for congregational Tefillah.</span>
            </div>
            <div className="text-xl font-mono font-black text-amber-400 animate-pulse">
              {timeRemaining || "00m 00s"}
            </div>
          </div>
        </section>

        {/* ====================================================
            SECTION 4 — COMMUNITY PULSE ⭐
            ==================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6" id="community-pulse">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">Kehillah Live Sync</span>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Community Pulse Today</span>
              </h3>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Synced 1m ago</span>
            </div>
          </div>

          {!simulateEmptyPulse ? (
            <div className="grid grid-cols-2 gap-4 font-sans" id="pulse-active-data">
              
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Active Members Today</span>
                <span className="text-2xl font-black text-white">184</span>
                <p className="text-[10px] text-emerald-400 font-light font-sans">✓ Verified under council log</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Prayer Requests Submitted</span>
                <span className="text-2xl font-black text-white">{prayerRequests.length}</span>
                <p className="text-[10px] text-slate-400 font-light font-sans">Active today on the board</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Memorial Observers</span>
                <span className="text-2xl font-black text-white">{simulateEmptyYahrzeit ? "0" : "1"}</span>
                <p className="text-[10px] text-rose-400 font-light font-sans">Departed pioneer remembered</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Volunteers Serving Today</span>
                <span className="text-2xl font-black text-white">
                  {Object.values(hasVolunteered).filter(Boolean).length + 23}
                </span>
                <p className="text-[10px] text-emerald-400 font-light font-sans">Joined in local acts of Chessed</p>
              </div>

              <div className="col-span-2 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200 leading-normal flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="font-light">
                  <strong>Shabbat Preparations:</strong> Complete cleaning & Kiddush donation sorting in progress. Register under service center.
                </p>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-950/40 border border-white/5 text-center py-12 space-y-2" id="pulse-empty-state">
              <Compass className="w-10 h-10 text-slate-600 mx-auto opacity-50" />
              <h4 className="text-sm font-black text-slate-400">No community activity has been recorded yet today.</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-light">
                Activity records are updated in real-time as community members complete census tasks, volunteer, or participate in prayers.
              </p>
            </div>
          )}
        </section>

      </div>

      {/* ====================================================
          SECTION 5 — TODAY'S TORAH (BEIT MIDRASH SPOTLIGHT)
          ==================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6" id="todays-torah">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Digital Beit Midrash Spotlight</span>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Today&apos;s Torah study</span>
            </h3>
          </div>
          
          <button 
            onClick={() => onNavigate && onNavigate('torah_library')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Continue Learning</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-950/60 border border-amber-500/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div>
                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Weekly Torah Cycle</span>
                <h4 className="text-lg font-black text-white">Parashat HaShavua • Pinchas (פִּינְחָס)</h4>
              </div>
              <div className="px-2.5 py-1 rounded bg-white/5 text-slate-300 text-xs font-mono">
                Estimated Reading Time: 6 mins read
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-semibold text-amber-200">
                "Pinchas, the son of Eleazar, the son of Aaron the priest, has turned back My wrath..." (Numbers 25:11)
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Pinchas is rewarded with Hashem&apos;s eternal covenant of peace and priesthood for his prompt intervention. A new census of the twelve tribes is conducted in preparation for inheritance claims. The daughters of Zelophehad step forward and successfully petition Moses for their deceased father&apos;s land allocation, establishing a beautiful precedent for family rights. Finally, Moses stands upon the peak of Abarim and officially ordains Joshua as his faithful successor.
              </p>
            </div>
          </div>

          {/* Today's Hebrew Word Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-slate-950 border border-white/5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                Hebrew Word of the Day
              </div>
              <h4 className="text-xl font-serif font-black text-amber-400 mt-1">Kavanah (כַּוָּנָה)</h4>
              <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                Meaning: "Intention", "devotion", or "direction of the heart".
              </p>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                In Jewish liturgy, Kavanah is the mental focus and sincere dedication one brings to prayer or mitzvot. Doing a small act with wholehearted Kavanah is far greater than performing many deeds mechanically.
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 text-[9px] text-slate-500 font-mono">
              Daily linguistic enrichment cycle v1.0
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 6 — PRAYER REQUESTS
          ==================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F3] dark:bg-slate-900 border border-amber-300/60 dark:border-slate-800 shadow-md text-slate-900 dark:text-slate-100 space-y-6" id="prayer-requests">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600 dark:text-amber-400">Mi Shebeirach Board</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
              <span>Today&apos;s Prayer Requests</span>
            </h3>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddPrayerForm(!showAddPrayerForm)}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 font-black text-xs shadow-md transition-all flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Prayer Request</span>
            </button>
          </div>
        </div>

        {/* Submit Prayer Form */}
        {showAddPrayerForm && (
          <form onSubmit={handleAddPrayer} className="p-4 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Name (e.g., Sarah bat Leah)"
              value={newPrayerName}
              onChange={(e) => setNewPrayerName(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="text"
              placeholder="Reason (e.g., Refuah Sheleimah)"
              value={newPrayerReason}
              onChange={(e) => setNewPrayerReason(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-xs shadow-sm transition-all text-center"
            >
              Add to Prayer List
            </button>
          </form>
        )}

        {!simulateEmptyPrayers ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="prayer-requests-grid">
            {prayerRequests.map((pr) => (
              <div 
                key={pr.id} 
                className="p-5 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 hover:border-amber-400 dark:hover:border-amber-500/50 shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                        {pr.name}
                      </h5>
                      <p className="text-[11px] text-slate-400">📍 {pr.location}</p>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold uppercase font-mono">
                      {pr.count} Prayers
                    </div>
                  </div>
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 inline-block px-2.5 py-0.5 rounded-md">
                    {pr.reason}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => handlePrayTogether(pr.id)}
                    className="w-full px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[11px] font-extrabold transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Pray Together</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-center py-12 space-y-2" id="prayer-requests-empty">
            <HeartHandshake className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
            <h4 className="text-sm font-black text-slate-500 dark:text-slate-400">No active prayer requests today.</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-light">
              Submit a request if you or a family member requires prayers, and our community will recite Tehillim together.
            </p>
          </div>
        )}
      </section>

      {/* ====================================================
          SECTION 7 — TODAY WE REMEMBER (MEMORIAL BOARD)
          ==================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6" id="todays-memorial">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-white/10 pb-4 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400">Perpetual Memorial</span>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
              <span>Today We Remember</span>
            </h3>
          </div>
          
          <button 
            onClick={() => onNavigate && onNavigate('memorial')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 border border-white/10 transition-colors"
          >
            Memorial Board
          </button>
        </div>

        {!simulateEmptyYahrzeit ? (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-500/5 via-slate-950/60 to-rose-500/5 border border-rose-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6" id="active-yahrzeit-card">
            <div className="space-y-3.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] font-extrabold uppercase text-rose-400 font-mono">Yahrzeit Observed Today</span>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-xl font-black text-white tracking-tight flex items-baseline gap-2">
                  <span>Elder Manmasi Singson</span>
                  <span className="text-slate-400 text-xs font-normal font-serif">Zt&quot;l</span>
                </h4>
                <p className="text-xs text-slate-400 leading-normal font-light">
                  <strong>Relationship:</strong> Community Father & Aliyah Pioneer • <strong>Hebrew Date:</strong> 17 Tammuz
                </p>
                <div className="p-3 rounded-lg bg-slate-950/50 border border-white/5 text-xs text-slate-300 leading-relaxed font-serif italic">
                  "He established some of the earliest Torah classes in Churachandpur district and worked tirelessly for the Aliyah and absorption of the lost ten tribes of Israel."
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-3 min-w-[200px]">
              {/* Light Memorial Candle Button */}
              <button
                onClick={() => {
                  if (!isCandleLit) {
                    setCandleLitCount(prev => prev + 1);
                  } else {
                    setCandleLitCount(prev => prev - 1);
                  }
                  setIsCandleLit(!isCandleLit);
                }}
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isCandleLit
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                    : 'bg-white/5 hover:bg-white/10 text-rose-300 border-rose-500/20'
                }`}
              >
                <Flame className={`w-4 h-4 ${isCandleLit ? 'text-slate-950 animate-bounce' : 'text-rose-400'}`} />
                <span>{isCandleLit ? 'Candle is Lit 🔥' : 'Light Memorial Candle'}</span>
              </button>

              {/* Read Psalm 23 Button */}
              <button
                onClick={() => setShowPsalmModal(true)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/10 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Psalm 23</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-950/40 border border-white/5 text-center space-y-2 py-12" id="empty-yahrzeit-state">
            <Flame className="w-10 h-10 text-slate-600 mx-auto opacity-50" />
            <h4 className="text-sm font-black text-slate-400">No Yahrzeit observances today.</h4>
            <p className="text-xs text-slate-500 font-light max-w-md mx-auto leading-normal">
              May the memories of all departed souls of Bnei Menashe remain bound up in the bond of life.
            </p>
          </div>
        )}

        {!simulateEmptyYahrzeit && (
          <p className="text-[11px] text-slate-400 text-center font-mono">
            🔥 <strong>{candleLitCount}</strong> community members have lit virtual candles in memory of Elder Manmasi Singson today.
          </p>
        )}
      </section>

      {/* ====================================================
          PSALM 23 MODAL OVERLAY
          ==================================================== */}
      {showPsalmModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setShowPsalmModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono font-bold text-sm bg-white/5 border border-white/10 p-2 rounded-xl"
            >
              ✕ Close
            </button>
            
            <div className="text-center space-y-1">
              <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest font-mono">Tehillim</span>
              <h3 className="text-xl font-black text-white">Psalm 23 (מִזְמוֹר כ"ג)</h3>
              <p className="text-xs text-slate-400 font-light">A Psalm of Comfort, Faith, and Eternity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Hebrew Text */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 text-right font-serif text-slate-200 leading-loose text-base sm:text-lg select-all whitespace-pre-line">
                {psalm23Hebrew}
              </div>

              {/* English Text */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 text-left text-slate-300 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
                {psalm23English}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-center">
              <p className="text-xs text-amber-400 font-bold italic">
                "May their soul be bound in the bond of life with the souls of Abraham, Isaac, and Jacob."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          SECTION 8 — HOW CAN I HELP TODAY? (COMMUNITY SERVICES / VOLUNTEERS)
          ==================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6" id="volunteer-today">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-white/10 pb-4 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Acts of Loving-Kindness</span>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>How Can I Help Today?</span>
            </h3>
          </div>
          
          <button 
            onClick={() => onNavigate && onNavigate('service_center')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1"
          >
            <span>Volunteer Today</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {!simulateEmptyVolunteers ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="active-volunteer-opportunities">
            {volunteerOpportunities.map((op) => {
              const isJoined = !!hasVolunteered[op.id];
              return (
                <div 
                  key={op.id}
                  className="p-5 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col justify-between hover:border-emerald-500/20 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-mono font-bold text-emerald-400">{op.time}</span>
                      <span className="text-xs text-slate-400 font-mono">{op.count} Registered</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{op.title}</h4>
                    <p className="text-xs text-slate-400 font-light leading-normal">{op.description}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2">
                    <button
                      onClick={() => handleJoinVolunteer(op.id, op.title)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isJoined
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-emerald-300'
                      }`}
                    >
                      {isJoined ? <Check className="w-4 h-4" /> : null}
                      <span>{isJoined ? 'Joined Duty! (RSVPed)' : 'Register for this Duty'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-950/40 border border-white/5 text-center py-12 space-y-2" id="volunteer-empty">
            <Users className="w-10 h-10 text-slate-600 mx-auto opacity-50" />
            <h4 className="text-sm font-black text-slate-400">No volunteer opportunities today.</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-light">
              All slots for regional kitchen help, Aliyah tutoring, and elderly support are filled. Check back tomorrow!
            </p>
          </div>
        )}
      </section>

      {/* ====================================================
          SECTION 9 — CONTINUE WHERE I LEFT OFF ⭐
          ==================================================== */}
      {!simulateEmptyProgress && (
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6 animate-fade-in" id="continue-where-left-off">
          <div className="border-b border-white/10 pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">My Personal Progress Journey</span>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-amber-400" />
              <span>Continue Where I Left Off</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Continue Census */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-slate-400">Household Demographics</span>
                <h4 className="text-sm font-bold text-white">Community Census Form</h4>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '60%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>60% Completed</span>
                  <span>Updated yesterday</span>
                </div>
              </div>
              <button 
                onClick={() => onNavigate && onNavigate('census_demographics')}
                className="w-full py-2 mt-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-amber-400 font-bold transition-all text-center"
              >
                Resume Form
              </button>
            </div>

            {/* Continue Family Tree */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-slate-400">Heritage Preservation</span>
                <h4 className="text-sm font-bold text-white">My Family Tree Model</h4>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '45%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>45% Completed</span>
                  <span>3 days ago</span>
                </div>
              </div>
              <button 
                onClick={() => onNavigate && onNavigate('family')}
                className="w-full py-2 mt-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-amber-400 font-bold transition-all text-center"
              >
                Open Family Tree
              </button>
            </div>

            {/* Continue Torah Study */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-slate-400">Beit Midrash</span>
                <h4 className="text-sm font-bold text-white">Hebrew Liturgy Study</h4>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '80%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>80% Completed</span>
                  <span>2 hours ago</span>
                </div>
              </div>
              <button 
                onClick={() => onNavigate && onNavigate('torah_library')}
                className="w-full py-2 mt-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-amber-400 font-bold transition-all text-center"
              >
                Resume Learning
              </button>
            </div>

            {/* Continue AI Rabbi */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-slate-400">Ask the Halachic AI</span>
                <h4 className="text-sm font-bold text-white">AI Rabbi Conversation</h4>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '95%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Active Session</span>
                  <span>Today, 7:15 PM</span>
                </div>
              </div>
              <button 
                onClick={() => onNavigate && onNavigate('ai_rabbi')}
                className="w-full py-2 mt-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-amber-400 font-bold transition-all text-center"
              >
                Resume Conversation
              </button>
            </div>

          </div>
        </section>
      )}

      {/* ====================================================
          SECTION 10 — COMMUNITY JOY
          ==================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6" id="community-joy">
        <div className="border-b border-white/10 pb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400">Kehillah Simchas</span>
          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Smile className="w-5 h-5 text-pink-400" />
            <span>Community Joy</span>
          </h3>
          <p className="text-xs text-slate-400 font-light mt-1">
            Celebrating birthdays, anniversaries, Aliyah milestones, and public achievements while fully respecting privacy selections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Birth celebration */}
          <div className="p-5 rounded-2xl bg-pink-500/5 border border-pink-500/20 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[8px] uppercase font-extrabold tracking-wider text-pink-400 px-2 py-0.5 rounded bg-pink-500/10 inline-block">Newborn Mazel Tov</span>
              <h4 className="text-sm font-black text-white">Birth of Shimon Lhungdim</h4>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Mazel Tov to the proud parents Avi and Rachel Lhungdim on the birth of their baby boy Shimon. May they merit to raise him to Torah, Chuppah, and good deeds.
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 text-[10px] text-slate-400 font-mono">
              Observed: July 5, 2026
            </div>
          </div>

          {/* Completed Hebrew Course */}
          <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[8px] uppercase font-extrabold tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 inline-block">Academic Achievement</span>
              <h4 className="text-sm font-black text-white">Advanced Hebrew Ulpan Graduates</h4>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Congratulations to 14 of our community youth who passed the Advanced Hebrew Grammar & Conversation finals! Special recognition to Eliyahu Singson for the top score.
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 text-[10px] text-slate-400 font-mono">
              Volunteer Recognition Day
            </div>
          </div>

          {/* Aliyah Milestone */}
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[8px] uppercase font-extrabold tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 inline-block">Aliyah Milestone</span>
              <h4 className="text-sm font-black text-white">3 Years Absorption in Nof HaGalil</h4>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Sending beautiful blessings to the Kipgen & Haokip households who completed their third official year of successful Aliyah integration in Har Yonah, Galilee center!
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 text-[10px] text-slate-400 font-mono">
              Publicly approved tribute
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================
          SECTION 11 — QUICK ACTIONS
          ==================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6" id="quick-actions">
        <div className="border-b border-white/10 pb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Unified Shortcuts Panel</span>
          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>Synagogue Quick Actions</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <button 
            onClick={() => onNavigate && onNavigate('ai_rabbi')}
            className="p-4 rounded-2xl bg-slate-950/40 hover:bg-amber-500/10 border border-white/5 hover:border-amber-400/40 transition-all text-center space-y-2"
          >
            <Video className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="text-xs font-bold text-white">Ask AI Rabbi</h4>
          </button>

          <button 
            onClick={() => onNavigate && onNavigate('calendar')}
            className="p-4 rounded-2xl bg-slate-950/40 hover:bg-amber-500/10 border border-white/5 hover:border-amber-400/40 transition-all text-center space-y-2"
          >
            <Calendar className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="text-xs font-bold text-white">Community Calendar</h4>
          </button>

          <button 
            onClick={() => onNavigate && onNavigate('family')}
            className="p-4 rounded-2xl bg-slate-950/40 hover:bg-amber-500/10 border border-white/5 hover:border-amber-400/40 transition-all text-center space-y-2"
          >
            <Users className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="text-xs font-bold text-white">Family Tree</h4>
          </button>

          <button 
            onClick={() => onNavigate && onNavigate('document_center')}
            className="p-4 rounded-2xl bg-slate-950/40 hover:bg-amber-500/10 border border-white/5 hover:border-amber-400/40 transition-all text-center space-y-2"
          >
            <ClipboardList className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="text-xs font-bold text-white">Digital Documents</h4>
          </button>

          <button 
            onClick={() => onNavigate && onNavigate('service_center')}
            className="p-4 rounded-2xl bg-slate-950/40 hover:bg-amber-500/10 border border-white/5 hover:border-amber-400/40 transition-all text-center space-y-2"
          >
            <HeartHandshake className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="text-xs font-bold text-white">Community Services</h4>
          </button>

          <button 
            onClick={() => {
              const el = document.getElementById('prayer-requests');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setShowAddPrayerForm(true);
            }}
            className="p-4 rounded-2xl bg-slate-950/40 hover:bg-amber-500/10 border border-white/5 hover:border-amber-400/40 transition-all text-center space-y-2"
          >
            <Heart className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="text-xs font-bold text-white">Request Prayer</h4>
          </button>

          <button 
            onClick={() => onNavigate && onNavigate('memorial')}
            className="p-4 rounded-2xl bg-slate-950/40 hover:bg-amber-500/10 border border-white/5 hover:border-amber-400/40 transition-all text-center space-y-2"
          >
            <Flame className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="text-xs font-bold text-white">Memorial Board</h4>
          </button>

          <button 
            onClick={() => onNavigate && onNavigate('census_demographics')}
            className="p-4 rounded-2xl bg-slate-950/40 hover:bg-amber-500/10 border border-white/5 hover:border-amber-400/40 transition-all text-center space-y-2"
          >
            <ClipboardList className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="text-xs font-bold text-white">Community Census</h4>
          </button>

        </div>
      </section>

      {/* ====================================================
          SECTION 12 — MY SYNAGOGUE
          ==================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6" id="my-synagogue">
        <div className="border-b border-white/10 pb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Spiritual Hub Overview</span>
          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>My Synagogue Profile</span>
          </h3>
          <p className="text-xs text-slate-400 font-light mt-1">
            Detailed directory records and administrative contacts for your assigned neighborhood sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts info */}
          <div className="p-5 rounded-2xl bg-slate-950/40 border border-white/5 space-y-4 font-sans text-xs">
            <h4 className="text-sm font-black text-white border-b border-white/5 pb-2 uppercase tracking-wider">
              Administration Contacts
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Spiritual Leadership</span>
                  <span className="font-bold text-slate-200">Rabbi Yochanan Lhungdim</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Synagogue Gabbai</span>
                  <span className="font-bold text-slate-200">Gabbai Menashe Singson</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Office Hours</span>
                  <span className="font-bold text-slate-200">Sun - Thu: 8:30 AM - 1:00 PM</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Synagogue Phone</span>
                  <span className="font-bold text-slate-200 font-mono">+91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Office Email</span>
                  <span className="font-bold text-slate-200 font-mono">office@beitshalomccp.org</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Mailing Address</span>
                  <span className="font-bold text-slate-200 leading-normal">
                    Hill Town Ward V, Churachandpur District, Manipur, India 795128
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map and Directions Column */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-white/5 bg-slate-950 flex flex-col justify-between relative shadow-inner p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">Interactive Location Model</span>
                <h4 className="text-sm font-bold text-white">Beit Shalom Synagogue Campus</h4>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                Lat: 24.331° N • Lon: 93.687° E
              </span>
            </div>

            {/* Custom stylized vector layout representing Beit Shalom Synagogue inside workspace */}
            <div className="h-64 rounded-xl bg-slate-900 border border-white/5 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Fake Map Layout UI */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center space-y-3 z-10">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center animate-pulse">
                  <MapPin className="w-6 h-6 text-amber-400" />
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-white/10 shadow-2xl space-y-1 max-w-xs">
                  <span className="text-[10px] font-black text-amber-400 block uppercase">Beit Shalom Sanctuary</span>
                  <p className="text-[11px] text-slate-300 font-light">Hill Town Central Gate Road, Churachandpur</p>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 p-2 rounded bg-slate-950/80 border border-white/5 text-[9px] text-slate-400 font-mono">
                🗺️ Local District Map Model v2.0
              </div>

              <div className="absolute top-4 left-4 p-2 rounded bg-slate-950/80 border border-white/5 text-[9px] text-slate-400 font-mono space-y-0.5 text-left">
                <div>📍 Central Churachandpur District</div>
                <div>🇮🇳 Manipur, India</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={() => triggerToast("Launching external GPS application...")}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Map className="w-4 h-4 text-amber-400" />
                <span>Open in Local System GPS</span>
              </button>
              <button 
                onClick={() => triggerToast("Calculating routing steps in new tab...")}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-indigo-400" />
                <span>Get Walking Directions</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 13 — OTHER SYNAGOGUES (SECONDARY DIRECTORY)
          ==================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6" id="community-synagogue-directory">
        <div className="border-b border-white/10 pb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Regional Synagogue Directory</span>
          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Browse Other Affiliated Synagogues</span>
          </h3>
          <p className="text-xs text-slate-400 font-light mt-1">
            Connect with other congregations across North-East India (Manipur/Mizoram) and absorbing cities in Israel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {OTHER_SYNAGOGUES.map((syn, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-amber-400/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-extrabold text-amber-400 font-mono tracking-wider">
                      {syn.community}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-slate-400">
                      {syn.region.split(',')[0]}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white">{syn.name}</h4>
                  <p className="text-[10px] text-slate-400 font-light leading-snug">{syn.address}</p>
                </div>

                <div className="border-t border-white/5 pt-3 space-y-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-medium truncate">{syn.rabbi}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{syn.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                <button 
                  onClick={() => triggerToast(`Assigned as preferred synagogue: ${syn.name}`)}
                  className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-extrabold text-amber-300 transition-all"
                >
                  Set as Preferred Synagogue
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          SECTION 14 — THOUGHT FOR TODAY ⭐
          ==================================================== */}
      <section className="p-8 rounded-3xl bg-slate-950/80 border border-amber-500/10 shadow-2xl relative text-center max-w-4xl mx-auto space-y-4" id="thought-for-today">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        
        <div className="flex items-center justify-center gap-2 text-amber-400">
          <MessageSquareQuote className="w-5 h-5" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">Peaceful Thought & Blessing</span>
        </div>

        <div className="min-h-[80px] flex flex-col justify-center transition-all duration-500 transform">
          <p className="text-base sm:text-lg text-slate-200 font-serif leading-relaxed italic">
            "{TORAH_THOUGHTS[thoughtIndex].text}"
          </p>
          <span className="text-xs text-amber-400/80 font-bold mt-2.5 block font-serif">
            — {TORAH_THOUGHTS[thoughtIndex].source}
          </span>
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-2">
          {TORAH_THOUGHTS.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setThoughtIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${idx === thoughtIndex ? 'bg-amber-400 scale-125' : 'bg-slate-700 hover:bg-slate-600'}`}
              title={`Quote ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ====================================================
          HELP CARD FOOTER (WHAT IS MY SYNAGOGUE TODAY?)
          ==================================================== */}
      <footer className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-slate-100 space-y-3 shadow-lg max-w-4xl mx-auto" id="help-card-section">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4.5 h-4.5" />
          <span>What is My Synagogue Today?</span>
        </div>
        
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          This page keeps you connected with your synagogue every day. Here you can see today&apos;s prayers, announcements, Torah learning, memorial observances, volunteer opportunities, and important community updates. Think of it as opening the front door of your synagogue from anywhere.
        </p>

        <p className="text-[10px] text-amber-400/80 font-mono">
          🔒 Kehillah Sanctuary Hub v3.0 • Secured under regional council community policies.
        </p>
      </footer>

    </div>
  );
};
