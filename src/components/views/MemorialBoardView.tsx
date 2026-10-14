import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Search, 
  Plus, 
  BookOpen, 
  Calendar as CalendarIcon, 
  MapPin, 
  Heart, 
  Share2, 
  Bell, 
  Sparkles, 
  Clock, 
  Users, 
  Filter, 
  X, 
  ChevronRight, 
  MessageSquareHeart, 
  Send, 
  Star, 
  ShieldCheck,
  Globe,
  Award,
  User,
  CheckCircle2,
  FileText,
  Info,
  HelpCircle
} from 'lucide-react';
import { MemorialService } from '../../services/data/MemorialService';
import { ProfileService } from '../../services/data/ProfileService';
import { NotificationService } from '../../services/data/NotificationService';
import { CalendarService } from '../../services/data/CalendarService';
import { HebrewCalendarService, YahrzeitCalculationResult } from '../../services/data/HebrewCalendarService';
import { AIRabbiService } from '../../services/airabbi';
import { MemorialRecord, MemorialTribute } from '../../types';
import confetti from 'canvas-confetti';

export const MemorialBoardView: React.FC = () => {
  const [memorials, setMemorials] = useState<MemorialRecord[]>(() => MemorialService.getAllMemorials());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('ALL');
  const [selectedVillage, setSelectedVillage] = useState('ALL');
  const [selectedRelation, setSelectedRelation] = useState('ALL');
  const [filterMode, setFilterMode] = useState<'all' | 'yahrzeit' | 'calculator' | 'family' | 'prayers'>('all');

  // Yahrzeit Calculator State
  const [calcInputDate, setCalcInputDate] = useState<string>('2018-06-26');
  const [calcAfterSunset, setCalcAfterSunset] = useState<boolean>(false);
  const [calcNameInput, setCalcNameInput] = useState<string>('Eliyahu Singson (z"l)');
  const [scheduledRemindersFeedback, setScheduledRemindersFeedback] = useState<string | null>(null);

  // AI Rabbi Yahrzeit Responsum Drawer State
  const [isAIRabbiModalOpen, setIsAIRabbiModalOpen] = useState<boolean>(false);
  const [aiRabbiQueryTarget, setAIRabbiQueryTarget] = useState<string>('General Yahrzeit Guidance');
  const [aiRabbiStreamingText, setAIRabbiStreamingText] = useState<string>('');
  const [isAIRabbiLoading, setIsAIRabbiLoading] = useState<boolean>(false);

  // Modals & Active View States
  const [activeDetailRecord, setActiveDetailRecord] = useState<MemorialRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTributeModalOpen, setIsTributeModalOpen] = useState(false);
  const [tributeTargetRecord, setTributeTargetRecord] = useState<MemorialRecord | null>(null);
  const [tributeMessage, setTributeMessage] = useState('');
  const [tributeAuthorName, setTributeAuthorName] = useState('Samuel Haokip');
  const [tributeRelation, setTributeRelation] = useState('Family / Community Member');

  // New Memorial Creation Form States
  const [newFormName, setNewFormName] = useState('');
  const [newFormHebrewName, setNewFormHebrewName] = useState('');
  const [newFormBirthYear, setNewFormBirthYear] = useState(1940);
  const [newFormPassingYear, setNewFormPassingYear] = useState(2020);
  const [newFormHebrewDate, setNewFormHebrewDate] = useState('15 Tammuz 5780');
  const [newFormGregorianDate, setNewFormGregorianDate] = useState('July 7, 2020');
  const [newFormRelation, setNewFormRelation] = useState<'Father' | 'Mother' | 'Grandfather' | 'Grandmother' | 'Elder' | 'Brother' | 'Sister'>('Father');
  const [newFormFamily, setNewFormFamily] = useState('Haokip');
  const [newFormVillage, setNewFormVillage] = useState('Churachandpur');
  const [newFormCommunity, setNewFormCommunity] = useState('Manipur → Nof HaGalil');
  const [newFormBio, setNewFormBio] = useState('');

  // Notification / Reminder Feedback
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  const stats = useMemo(() => MemorialService.getStatistics(), [memorials]);

  // Pre-calculate exact Yahrzeit details for every memorial record
  const memorialCalculations = useMemo(() => {
    const map = new Map<string, YahrzeitCalculationResult>();
    memorials.forEach(record => {
      const calc = HebrewCalendarService.calculateYahrzeit(record.gregorianPassingDate || '2018-06-26', false);
      map.set(record.id, calc);
    });
    return map;
  }, [memorials]);

  // Live calculation for the interactive Yahrzeit Calculator form
  const activeYahrzeitCalc = useMemo(() => {
    return HebrewCalendarService.calculateYahrzeit(calcInputDate, calcAfterSunset);
  }, [calcInputDate, calcAfterSunset]);

  // Dashboard widgets datasets
  const dashboardWidgetsData = useMemo(() => {
    const todays: MemorialRecord[] = [];
    const upcomingWeek: MemorialRecord[] = [];
    const upcomingMonth: MemorialRecord[] = [];
    const recentlyPassed = [...memorials].sort((a, b) => b.passingYear - a.passingYear).slice(0, 5);

    memorials.forEach(record => {
      const calc = memorialCalculations.get(record.id);
      if (!calc) return;
      if (calc.isTodayYahrzeit || record.isYahrzeitToday) {
        todays.push(record);
      } else if (calc.daysRemaining > 0 && calc.daysRemaining <= 7) {
        upcomingWeek.push(record);
      } else if (calc.daysRemaining > 7 && calc.daysRemaining <= 30) {
        upcomingMonth.push(record);
      }
    });

    return { todays, upcomingWeek, upcomingMonth, recentlyPassed };
  }, [memorials, memorialCalculations]);

  // Filtered list
  const filteredList = useMemo(() => {
    let result = MemorialService.searchMemorials(searchQuery, {
      family: selectedFamily,
      village: selectedVillage,
      relationship: selectedRelation,
      yahrzeitOnly: filterMode === 'yahrzeit'
    });

    if (filterMode === 'family') {
      result = result.filter(m => m.familyName === 'Singson' || m.familyName === 'Haokip');
    }
    return result;
  }, [memorials, searchQuery, selectedFamily, selectedVillage, selectedRelation, filterMode]);

  // Handle Light Candle
  const handleLightCandle = (e: React.MouseEvent, record: MemorialRecord) => {
    e.stopPropagation();
    const updated = MemorialService.lightCandle(record.id);
    if (updated) {
      setMemorials(MemorialService.getAllMemorials());
      if (activeDetailRecord?.id === record.id) {
        setActiveDetailRecord({ ...updated });
      }
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#F59E0B', '#FDE68A', '#D97706']
      });
    }
  };

  // Handle Set Yahrzeit Reminder
  const handleSetReminder = (record: MemorialRecord) => {
    const calc = memorialCalculations.get(record.id);
    const nextIso = calc ? calc.nextYahrzeit.gregorianDateIso : new Date().toISOString();
    const scheduled = NotificationService.scheduleYahrzeitReminders(record.name, record.hebrewPassingDate, nextIso);
    setReminderToast(`Sacred Yahrzeit alarm scheduled for ${record.name} on ${record.hebrewPassingDate} (${scheduled.length} automated alerts queued).`);
    setTimeout(() => setReminderToast(null), 4500);
  };

  const handleScheduleYahrzeitReminders = (name: string, hebrewDate: string, nextGregIso: string) => {
    const scheduled = NotificationService.scheduleYahrzeitReminders(name, hebrewDate, nextGregIso);
    setScheduledRemindersFeedback(`Successfully scheduled 7 automated reminders for ${name} (${scheduled.length} alerts queued: 30d, 14d, 7d, 3d, 1d prior, Sunset, & Morning of Yahrzeit).`);
    setTimeout(() => {
      setScheduledRemindersFeedback(null);
    }, 6000);
  };

  const handleAskAIRabbiYahrzeit = async (contextName?: string, hebrewDateInfo?: string) => {
    const soulRef = contextName ? `for ${contextName}` : 'on a Yahrzeit';
    const hDateRef = hebrewDateInfo ? ` (${hebrewDateInfo})` : '';
    const query = `What should I do on this Yahrzeit ${soulRef}${hDateRef}? Please explain Halachic customs (lighting a 24-hour candle at sunset, reciting Kaddish, studying Mishnah, and giving Tzedakah in their honor). Provide educational information only and include a reminder to consult a local rabbi for personal Halachic rulings.`;

    setAIRabbiQueryTarget(contextName ? `Yahrzeit Guidance for ${contextName}` : 'General Yahrzeit Halachic Guidance');
    setIsAIRabbiModalOpen(true);
    setIsAIRabbiLoading(true);
    setAIRabbiStreamingText('');

    try {
      const sessionMgr = AIRabbiService.getSessionManager('current-user');
      await sessionMgr.sendMessage(query, {
        language: 'English',
        mode: 'halacha',
        location: 'Nof HaGalil'
      });
      const thread = sessionMgr.getActiveThread();
      const lastMsg = thread?.messages[thread.messages.length - 1];
      if (lastMsg && lastMsg.sender === 'ai') {
        setAIRabbiStreamingText(lastMsg.text);
      } else {
        setAIRabbiStreamingText("### [Educational Explanation] Yahrzeit Observance Customs\n\nOn the anniversary of a loved one's passing (Yahrzeit), Jewish tradition teaches several meaningful customs:\n\n* **🕯 Lighting a 24-Hour Candle:** Kindle a Ner Neshama (memorial candle) at sunset when the Hebrew date begins.\n* **📖 Reciting Kaddish:** If a Minyan is present, the mourners' Kaddish is recited at Maariv, Shacharit, and Mincha.\n* **📚 Torah & Mishnah Study:** Learning Mishnah (whose letters form *Neshama* - soul) elevates the departed soul.\n* **💝 Giving Tzedakah:** Donating charity in their memory brings spiritual merit.\n\n---\n*⚠️ Reminder: Please consult your local synagogue Rabbi for personal binding Halachic rulings and community Minyan schedules.*");
      }
    } catch (err) {
      setAIRabbiStreamingText("### [Educational Explanation] Yahrzeit Observance Customs\n\nOn the anniversary of a loved one's passing (Yahrzeit), Jewish tradition teaches several meaningful customs:\n\n* **🕯 Lighting a 24-Hour Candle:** Kindle a Ner Neshama (memorial candle) at sunset when the Hebrew date begins.\n* **📖 Reciting Kaddish:** If a Minyan is present, the mourners' Kaddish is recited at Maariv, Shacharit, and Mincha.\n* **📚 Torah & Mishnah Study:** Learning Mishnah (whose letters form *Neshama* - soul) elevates the departed soul.\n* **💝 Giving Tzedakah:** Donating charity in their memory brings spiritual merit.\n\n---\n*⚠️ Reminder: Please consult your local synagogue Rabbi for personal binding Halachic rulings and community Minyan schedules.*");
    } finally {
      setIsAIRabbiLoading(false);
    }
  };

  // Submit Tribute
  const handleSubmitTribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tributeTargetRecord || !tributeMessage.trim()) return;

    MemorialService.addTribute({
      memorialId: tributeTargetRecord.id,
      authorName: tributeAuthorName || 'Community Member',
      authorRelation: tributeRelation,
      community: 'Nof HaGalil / Churachandpur',
      message: tributeMessage
    });

    setMemorials(MemorialService.getAllMemorials());
    setTributeMessage('');
    setIsTributeModalOpen(false);
    setTributeTargetRecord(null);
  };

  // Submit New Memorial
  const handleCreateMemorial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormName.trim()) return;

    MemorialService.createMemorial({
      name: newFormName,
      hebrewName: newFormHebrewName || 'בן מנשה',
      birthYear: Number(newFormBirthYear),
      passingYear: Number(newFormPassingYear),
      hebrewPassingDate: newFormHebrewDate,
      gregorianPassingDate: newFormGregorianDate,
      relationship: newFormRelation,
      biographyPreview: newFormBio.slice(0, 140) || 'Honoring our sacred ancestor whose legacy shines forever in Zion.',
      fullBiography: newFormBio || `${newFormName} was a cherished member of the Bnei Menashe community from ${newFormVillage}, preserving ancient traditions of Manasseh with love and piety.`,
      familyName: newFormFamily,
      village: newFormVillage,
      community: newFormCommunity,
      isYahrzeitToday: false,
      timeline: [
        { year: String(newFormBirthYear), title: `Born in ${newFormVillage}`, description: 'Raised amidst rich community traditions.', location: newFormVillage },
        { year: String(newFormPassingYear), title: 'Eternal Rest', description: 'May their soul be bound up in the bond of eternal life.', location: newFormCommunity }
      ],
      galleryUrls: [],
      psalmRecommendation: {
        number: 23,
        title: 'Mizmor LeDavid (Psalm 23)',
        hebrewExcerpt: 'יְהוָה רֹעִי, לֹא אֶחְסָר',
        englishExcerpt: 'The Lord is my shepherd; I shall not want...'
      }
    });

    setMemorials(MemorialService.getAllMemorials());
    setIsCreateModalOpen(false);
    setNewFormName('');
    setNewFormBio('');
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 pb-28 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Alert */}
      {reminderToast && (
        <div className="fixed bottom-24 right-6 z-50 p-4 rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-2xl flex items-center gap-3 border border-amber-300 animate-fade-in">
          <Bell className="w-5 h-5 animate-bounce" />
          <span className="text-xs sm:text-sm">{reminderToast}</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 p-8 sm:p-12 lg:p-16 border border-amber-500/30 shadow-2xl bg-gradient-to-b from-[#121A2F] via-[#0D1322] to-[#0A0E1A]">
        {/* Cinematic Background Glow Elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-12 left-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

        {/* Sacred Candle Silhouette Vector Accents */}
        <div className="absolute right-8 bottom-4 hidden lg:flex items-end gap-6 opacity-80 pointer-events-none">
          <div className="flex flex-col items-center">
            <Flame className="w-8 h-8 text-amber-400 animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
            <div className="w-6 h-28 bg-gradient-to-t from-amber-950/80 to-amber-200/90 rounded-t-sm border-t border-amber-300 shadow-lg"></div>
            <div className="w-16 h-3 bg-amber-900/60 rounded-full blur-xs mt-1"></div>
          </div>
          <div className="flex flex-col items-center">
            <Flame className="w-10 h-10 text-amber-300 animate-bounce drop-shadow-[0_0_20px_rgba(253,230,138,0.9)]" />
            <div className="w-8 h-36 bg-gradient-to-t from-amber-950/90 to-amber-100 rounded-t-sm border-t border-amber-200 shadow-xl"></div>
            <div className="w-20 h-4 bg-amber-900/60 rounded-full blur-xs mt-1"></div>
          </div>
          <div className="flex flex-col items-center">
            <Flame className="w-7 h-7 text-amber-500 animate-pulse drop-shadow-[0_0_12px_rgba(245,158,11,0.7)]" />
            <div className="w-5 h-24 bg-gradient-to-t from-amber-950/80 to-amber-300/80 rounded-t-sm border-t border-amber-400"></div>
            <div className="w-14 h-3 bg-amber-900/60 rounded-full blur-xs mt-1"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-widest backdrop-blur-md">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Community Memorial Sanctuary</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white flex flex-col sm:flex-row sm:items-baseline gap-3">
            <span>Community Memorial</span>
            <span className="text-amber-400 font-serif text-2xl sm:text-4xl font-bold tracking-normal drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
              יזכור ברוך
            </span>
          </h1>

          <p className="text-lg sm:text-xl font-serif italic text-amber-200/90 tracking-wide">
            "May Their Memory Be A Blessing • תְּהִי נִשְׁמָתָם צְרוּרָה בִּצְרוֹר הַחַיִּים"
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            In quiet reflection, we honor the beloved souls of our Bnei Menashe parents, grandparents, and community pioneers. Remembering our loved ones preserves our sacred generations from Northeast India to Zion. Families may kindle a perpetual candle and record cherished memories here in peace.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Memorial Dedication</span>
            </button>
            <button
              onClick={() => setFilterMode('yahrzeit')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <CalendarIcon className="w-4 h-4 text-amber-400" />
              <span>Today's Yahrzeit ({stats.todaysYahrzeits})</span>
            </button>
            <button
              onClick={() => setFilterMode('prayers')}
              className="px-5 py-3 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 font-bold text-xs sm:text-sm border border-indigo-400/30 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-indigo-300" />
              <span>Spiritual & Liturgy Hub</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Phase 8: Help Everywhere ("What is this?") */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-white space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>What is the Community Memorial Sanctuary?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Community Memorial Sanctuary is an digital Yizkor board honoring deceased relatives of Bnei Menashe families. It tracks Yahrzeit dates, displays automatic reminders, lists Psalms, and enables family members to light virtual memorial candles to commemorate and elevate the souls of their departed loved ones.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 flex items-center gap-3.5 hover:border-amber-500/30 transition-all shadow-md">
            <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Names Remembered</span>
              <span className="text-xl font-black font-mono text-white">{stats.totalNames.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 flex items-center gap-3.5 hover:border-amber-500/30 transition-all shadow-md">
            <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Candles Lit</span>
              <span className="text-xl font-black font-mono text-amber-400">{stats.totalCandles.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 flex items-center gap-3.5 hover:border-amber-500/30 transition-all shadow-md">
            <div className="p-3 rounded-xl bg-pink-500/15 text-pink-400 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Memorial Tributes</span>
              <span className="text-xl font-black font-mono text-white">{stats.totalTributes.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 flex items-center gap-3.5 hover:border-amber-500/30 transition-all shadow-md">
            <div className="p-3 rounded-xl bg-indigo-500/15 text-indigo-400 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Families Participating</span>
              <span className="text-xl font-black font-mono text-white">{stats.familiesCount}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-slate-900 border border-amber-400/40 flex items-center gap-3.5 shadow-lg col-span-2 sm:col-span-1">
            <div className="p-3 rounded-xl bg-amber-500 text-slate-950 shrink-0 font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-300 block tracking-wider">Today's Yahrzeit</span>
              <span className="text-xl font-black font-mono text-white">{stats.todaysYahrzeits} Souls</span>
            </div>
          </div>
        </div>

        {/* Primary Action Mode Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-slate-900/80 border border-white/10">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                filterMode === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>All Community Memorials</span>
            </button>

            <button
              onClick={() => setFilterMode('yahrzeit')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                filterMode === 'yahrzeit'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Today's Yahrzeit</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/40 text-[10px] font-mono">{stats.todaysYahrzeits}</span>
            </button>

            <button
              onClick={() => setFilterMode('calculator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                filterMode === 'calculator'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-amber-400" />
              <span>Yahrzeit Calculator & Dashboard</span>
            </button>

            <button
              onClick={() => setFilterMode('family')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                filterMode === 'family'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>My Lineage (Haokip / Singson)</span>
            </button>

            <button
              onClick={() => setFilterMode('prayers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                filterMode === 'prayers'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Sacred Prayers & Psalms</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Memorial</span>
          </button>
        </div>

        {filterMode === 'calculator' ? (
          /* YAHRZEIT CALCULATOR & DASHBOARD VIEW */
          <div className="space-y-8 animate-fade-in">
            {scheduledRemindersFeedback && (
              <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500 text-amber-200 text-xs sm:text-sm font-bold flex items-center justify-between animate-bounce">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <span>{scheduledRemindersFeedback}</span>
                </div>
                <button onClick={() => setScheduledRemindersFeedback(null)} className="text-amber-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* HALACHIC YAHRZEIT CALCULATOR SECTION */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0E1729] via-[#121E36] to-[#0A101D] border border-amber-500/40 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <CalendarIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Halachic Astronomical Engine</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Yahrzeit Calculator</h2>
                    <p className="text-xs text-slate-300">Convert Gregorian departure dates into exact Hebrew anniversaries & schedule reminders</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAskAIRabbiYahrzeit(calcNameInput, activeYahrzeitCalc.origHebrewDateEn)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Ask AI Rabbi: What should I do on this Yahrzeit?</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Form Column */}
                <div className="lg:col-span-5 space-y-5 p-5 rounded-2xl bg-black/40 border border-white/10">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Soul & Departure Parameters</span>
                  </h3>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Soul / Deceased Name</label>
                    <input
                      type="text"
                      value={calcNameInput}
                      onChange={e => setCalcNameInput(e.target.value)}
                      placeholder="Enter name (e.g. Eliyahu Singson z&quot;l)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-xs sm:text-sm text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Gregorian Date of Passing</label>
                    <input
                      type="date"
                      value={calcInputDate}
                      onChange={e => setCalcInputDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-xs sm:text-sm text-white focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 cursor-pointer text-xs text-slate-200">
                      <input
                        type="checkbox"
                        checked={calcAfterSunset}
                        onChange={e => setCalcAfterSunset(e.target.checked)}
                        className="mt-0.5 rounded text-amber-500 focus:ring-amber-500"
                      />
                      <div>
                        <span className="font-bold text-amber-300 block">Passed away after astronomical sunset?</span>
                        <span className="text-[11px] text-slate-300 block">According to Jewish law (Shulchan Aruch), a day begins at sunset. Checking this advances the Hebrew date by one day.</span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-3 flex flex-col gap-2">
                    <button
                      onClick={() => handleScheduleYahrzeitReminders(calcNameInput, activeYahrzeitCalc.origHebrewDateEn, activeYahrzeitCalc.nextYahrzeit.gregorianDateIso)}
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Bell className="w-4 h-4 text-slate-950" />
                      <span>Schedule 7 Yahrzeit Reminders</span>
                    </button>

                    <button
                      onClick={() => {
                        setNewFormName(calcNameInput);
                        setNewFormHebrewDate(activeYahrzeitCalc.origHebrewDateEn);
                        setNewFormGregorianDate(activeYahrzeitCalc.origGregorianFormatted);
                        setNewFormPassingYear(activeYahrzeitCalc.origHebrewYear);
                        setIsCreateModalOpen(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Dedicate Memorial Card for {calcNameInput}</span>
                    </button>
                  </div>
                </div>

                {/* Right Results Column */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="p-5 rounded-2xl bg-black/60 border border-white/15 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Hebrew Anniversary Date</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold">
                        {activeYahrzeitCalc.isLeapYearPassing ? 'Hebrew Leap Year' : 'Regular Year'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-2xl sm:text-3xl font-black font-serif text-amber-400">{activeYahrzeitCalc.origHebrewDateEn}</h4>
                        <p className="text-lg font-serif text-slate-200 mt-0.5">{activeYahrzeitCalc.origHebrewDateHe}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-slate-400 block">Parashah at Passing:</span>
                        <span className="text-xs font-bold text-white">{activeYahrzeitCalc.parashahOfPassing?.nameEn || 'Shabbat Schedule'}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3-Card Grid: Previous, Current Year, Next Yahrzeit */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Previous Yahrzeit</span>
                      <span className="text-sm font-bold text-white block">{activeYahrzeitCalc.previousYahrzeit.gregorianDateFormatted}</span>
                      <span className="text-xs font-serif text-amber-300/80 block">{activeYahrzeitCalc.previousYahrzeit.hebrewDateEn}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Current Year's Yahrzeit</span>
                      <span className="text-sm font-bold text-white block">{activeYahrzeitCalc.currentYearYahrzeit.gregorianDateFormatted}</span>
                      <span className="text-xs font-serif text-amber-300 block">{activeYahrzeitCalc.currentYearYahrzeit.hebrewDateEn}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-slate-900 border border-amber-400 space-y-1.5 shadow-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">Next Upcoming Yahrzeit</span>
                      <span className="text-sm font-black text-white block">{activeYahrzeitCalc.nextYahrzeit.gregorianDateFormatted}</span>
                      <span className="text-xs font-serif text-amber-300 block">{activeYahrzeitCalc.nextYahrzeit.hebrewDateEn}</span>
                    </div>
                  </div>

                  {/* Countdown Badge & Halachic Notes */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs">
                        <Flame className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Yahrzeit Countdown</span>
                        <span className="text-[11px] text-slate-400">Halachic day begins evening prior</span>
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-black text-sm">
                      {activeYahrzeitCalc.isTodayYahrzeit ? '🕯 YAHRZEIT IS TODAY!' : `${activeYahrzeitCalc.daysRemaining} Days Remaining`}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs text-slate-300">
                    <span className="font-bold text-amber-400 block uppercase text-[10px] tracking-wider">Halachic Calculation Rules Applied:</span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
                      {activeYahrzeitCalc.halachicNotes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* YAHRZEIT COMMUNAL DASHBOARD WIDGETS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <span>Yahrzeit Communal Dashboard</span>
                  </h3>
                  <p className="text-xs text-slate-400">Real-time tracking of soul anniversaries across the global Bnei Menashe community</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {/* 1. Today's Yahrzeit */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border border-amber-400/60 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 animate-bounce" />
                      <span>Today's Yahrzeit</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs">
                      {dashboardWidgetsData.todays.length}
                    </span>
                  </div>
                  {dashboardWidgetsData.todays.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">No communal Yahrzeits fall on today's Hebrew date.</p>
                  ) : (
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {dashboardWidgetsData.todays.map(rec => (
                        <div key={rec.id} onClick={() => setActiveDetailRecord(rec)} className="p-3 rounded-xl bg-black/40 border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-all">
                          <span className="text-xs font-bold text-white block">{rec.name}</span>
                          <span className="text-[10px] font-serif text-amber-300 block">{rec.hebrewPassingDate}</span>
                          <span className="text-[10px] text-slate-400">{rec.village} → {rec.familyName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Upcoming This Week */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Upcoming This Week</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono font-bold text-xs">
                      {dashboardWidgetsData.upcomingWeek.length}
                    </span>
                  </div>
                  {dashboardWidgetsData.upcomingWeek.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">No Yahrzeits within the next 7 days.</p>
                  ) : (
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {dashboardWidgetsData.upcomingWeek.map(rec => {
                        const calc = memorialCalculations.get(rec.id);
                        return (
                          <div key={rec.id} onClick={() => setActiveDetailRecord(rec)} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 cursor-pointer transition-all flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-white block">{rec.name}</span>
                              <span className="text-[10px] text-amber-300">{calc?.nextYahrzeit.gregorianDateFormatted}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                              {calc?.daysRemaining}d left
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Upcoming This Month */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Upcoming This Month</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono font-bold text-xs">
                      {dashboardWidgetsData.upcomingMonth.length}
                    </span>
                  </div>
                  {dashboardWidgetsData.upcomingMonth.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">No additional Yahrzeits within 30 days.</p>
                  ) : (
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {dashboardWidgetsData.upcomingMonth.map(rec => {
                        const calc = memorialCalculations.get(rec.id);
                        return (
                          <div key={rec.id} onClick={() => setActiveDetailRecord(rec)} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 cursor-pointer transition-all flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-white block">{rec.name}</span>
                              <span className="text-[10px] text-slate-400">{calc?.nextYahrzeit.gregorianDateFormatted}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-white/10 text-slate-300 font-bold">
                              {calc?.daysRemaining}d left
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Recently Passed */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Recently Departed Souls</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono font-bold text-xs">
                      {dashboardWidgetsData.recentlyPassed.length}
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {dashboardWidgetsData.recentlyPassed.map(rec => (
                      <div key={rec.id} onClick={() => setActiveDetailRecord(rec)} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 cursor-pointer transition-all">
                        <span className="text-xs font-bold text-white block">{rec.name}</span>
                        <span className="text-[10px] font-mono text-slate-300 block">Passed: {rec.passingYear} ({rec.hebrewPassingDate})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : filterMode === 'prayers' ? (
          /* SPIRITUAL & LITURGY SECTION */
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <BookOpen className="w-7 h-7 text-amber-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Sacred Spiritual & Liturgy Sanctuary</h2>
                  <p className="text-xs text-slate-400">Traditional prayers recited in honor of our ancestors during Yahrzeit and Yizkor services</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* El Malei Rachamim */}
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Memorial Prayer</span>
                    <span className="text-sm font-serif text-amber-200">אֵל מָלֵא רַחֲמִים</span>
                  </div>
                  <h3 className="text-base font-bold text-white">El Malei Rachamim (God Full of Mercy)</h3>
                  <p className="text-xs font-serif text-amber-200/90 leading-relaxed text-right text-base">
                    אֵל מָלֵא רַחֲמִים שׁוֹכֵן בַּמְּרוֹמִים, הַמְצֵא מְנוּחָה נְכוֹנָה תַּחַת כַּנְפֵי הַשְּׁכִינָה, בְּמַעֲלוֹת קְדוֹשִׁים וּטְהוֹרִים כְּזֹהַר הָרָקִיעַ מַזְהִירִים, אֶת נִשְׁמַת יַקִּירֵינוּ...
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "Exalted God, full of mercy, who dwells on high, grant true rest under the wings of the Divine Presence, in the exalted heights of the holy and pure, who shine as the brightness of the heavens, to the souls of our beloved ancestors who went to their eternal rest..."
                  </p>
                </div>

                {/* Mourner's Kaddish */}
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Kaddish Reminder</span>
                    <span className="text-sm font-serif text-indigo-200">קַדִּישׁ יָתוֹם</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Mourner's Kaddish (Kaddish Yatom)</h3>
                  <p className="text-xs font-serif text-indigo-200/90 leading-relaxed text-right text-base">
                    יִתְגַּדַּל וְיִתְקַדַּשׁ שְׁמֵהּ רַבָּא. בְּעָלְמָא דִּי בְרָא כִרְעוּתֵהּ, וְיַמְלִיךְ מַלְכוּתֵהּ בְּחַיֵּיכוֹן וּבְיוֹמֵיכוֹן וּבְחַיֵּי דְכָל בֵּית יִשְׂרָאֵל...
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "May His great name be exalted and sanctified in the world which He created according to His will. May He establish His kingdom in your lifetime and in your days..."
                  </p>
                </div>
              </div>

              {/* Psalm Recommendations Grid */}
              <div className="pt-4 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">Recommended Psalms for Reflection</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span>Psalm 23</span>
                      <span className="font-serif">מִזְמוֹר לְדָוִד</span>
                    </div>
                    <p className="text-xs text-slate-300 italic">"The Lord is my shepherd; I shall not want. He restores my soul and guides my steps."</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span>Psalm 121</span>
                      <span className="font-serif">שִׁיר לַמַּעֲלוֹת</span>
                    </div>
                    <p className="text-xs text-slate-300 italic">"I lift up my eyes to the hills. Behold, the Guardian of Israel neither slumbers nor sleeps."</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span>Psalm 16</span>
                      <span className="font-serif">מִכְתָּם לְדָוִד</span>
                    </div>
                    <p className="text-xs text-slate-300 italic">"I have set the Lord always before me. Therefore my heart is glad and my glory rejoices."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* SEARCH & FILTERS BAR */}
            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 space-y-3 shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by name, Hebrew name, family lineage, village, or community..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    aria-label="Search memorials"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Dropdown Filters */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <select
                    value={selectedFamily}
                    onChange={e => setSelectedFamily(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  >
                    <option value="ALL">All Families / Lineages</option>
                    <option value="Haokip">Haokip Family</option>
                    <option value="Singson">Singson Family</option>
                    <option value="Lhungdim">Lhungdim Family</option>
                    <option value="Touthang">Touthang Family</option>
                    <option value="Kipgen">Kipgen Family</option>
                  </select>

                  <select
                    value={selectedVillage}
                    onChange={e => setSelectedVillage(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  >
                    <option value="ALL">All Villages / Origins</option>
                    <option value="Churachandpur">Churachandpur</option>
                    <option value="Aizawl">Aizawl</option>
                    <option value="Kangpokpi">Kangpokpi</option>
                    <option value="Behiang">Behiang</option>
                    <option value="Imphal">Imphal</option>
                  </select>

                  <select
                    value={selectedRelation}
                    onChange={e => setSelectedRelation(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  >
                    <option value="ALL">All Relationships</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Grandmother">Grandmother</option>
                    <option value="Son">Son / Brother</option>
                    <option value="Elder">Elder / Pioneer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MEMORIAL CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredList.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-slate-900/50 rounded-3xl border border-amber-500/30">
                  <Flame className="w-10 h-10 text-amber-500/60 mx-auto mb-3 animate-pulse" />
                  <h3 className="text-base font-bold text-white">Remembering Our Loved Ones</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
                    Remembering our loved ones helps preserve the history of our community. When no memorials match your search, families are invited to gently preserve the memory and Yahrzeit of departed relatives here.
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
                  >
                    Preserve a Loved One&apos;s Memory
                  </button>
                </div>
              ) : (
                filteredList.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => setActiveDetailRecord(record)}
                    className={`group relative rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between cursor-pointer border backdrop-blur-xl ${
                      record.isYahrzeitToday
                        ? 'bg-gradient-to-b from-amber-950/70 via-slate-900/90 to-slate-900 border-amber-400/80 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/30'
                        : 'bg-slate-900/70 border-white/10 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/5'
                    }`}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Yahrzeit Ribbon */}
                    {record.isYahrzeitToday && (
                      <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-bl-xl rounded-tr-2xl shadow-md flex items-center gap-1">
                        <Flame className="w-3 h-3 animate-bounce" />
                        <span>Today's Yahrzeit</span>
                      </div>
                    )}

                    <div>
                      {/* Avatar Portrait & Relationship Header */}
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 p-0.5 shadow-md shrink-0">
                          <div className="w-full h-full rounded-full bg-[#0A0E1A] flex items-center justify-center overflow-hidden">
                            <span className="text-amber-400 font-serif font-bold text-lg">
                              {record.name.charAt(0)}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow-xs">
                            <Star className="w-3 h-3 fill-slate-950" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                            {record.relationship}
                          </span>
                          <h3 className="text-base font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                            {record.name}
                          </h3>
                          <p className="text-xs font-serif text-amber-400/90 truncate">
                            {record.hebrewName}
                          </p>
                        </div>
                      </div>

                      {/* Dates & Yahrzeit Countdown */}
                      {(() => {
                        const calc = memorialCalculations.get(record.id);
                        return (
                          <div className="space-y-1.5 py-2 border-y border-white/10 text-xs">
                            <div className="flex items-center justify-between text-slate-300">
                              <span className="text-slate-400">Birth – Passing:</span>
                              <span className="font-mono font-bold text-white">{record.birthYear} – {record.passingYear}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-300">
                              <span className="text-slate-400">Hebrew Date:</span>
                              <span className="font-semibold text-amber-300">{calc ? calc.origHebrewDateEn : record.hebrewPassingDate}</span>
                            </div>
                            {calc && (
                              <>
                                <div className="flex items-center justify-between text-slate-300">
                                  <span className="text-slate-400">Next Yahrzeit:</span>
                                  <span className="font-semibold text-white">{calc.nextYahrzeit.gregorianDateFormatted}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400">Countdown:</span>
                                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                                    calc.isTodayYahrzeit || record.isYahrzeitToday
                                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                                      : calc.daysRemaining <= 7
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                      : 'bg-white/10 text-slate-200'
                                  }`}>
                                    {calc.isTodayYahrzeit || record.isYahrzeitToday ? '🕯 TODAY!' : `${calc.daysRemaining} Days Left`}
                                  </span>
                                </div>
                              </>
                            )}
                            <div className="flex items-center justify-between text-slate-300 pt-0.5">
                              <span className="text-slate-400">Lineage & Origin:</span>
                              <span className="font-semibold text-slate-200 truncate max-w-[150px]">{record.village} → {record.familyName}</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Bio Preview */}
                      <p className="text-xs text-slate-300 line-clamp-3 mt-3 leading-relaxed italic">
                        "{record.biographyPreview}"
                      </p>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => handleLightCandle(e, record)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                          record.isLitByUser
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                        aria-label="Light a Candle"
                      >
                        <Flame className={`w-3.5 h-3.5 ${record.isLitByUser ? 'text-amber-400 animate-pulse' : ''}`} />
                        <span>{record.isLitByUser ? `Lit (${record.candlesCount})` : 'Light Candle'}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTributeTargetRecord(record);
                          setIsTributeModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-all"
                        title="Leave Tribute"
                        aria-label="Leave Tribute"
                      >
                        <MessageSquareHeart className="w-4 h-4 text-pink-400" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDetailRecord(record);
                        }}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-bold text-slate-300 transition-all flex items-center gap-1"
                      >
                        <span>Story</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* DETAIL VIEW MODAL (Full Biography, Timeline, Prayers, Tributes) */}
      {activeDetailRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#0D1322] w-full max-w-4xl rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#121A2F] to-[#0A0E1A] border-b border-white/10 flex items-start justify-between gap-4 relative">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-200 p-0.5 shadow-xl shrink-0 flex items-center justify-center text-slate-950 font-black text-2xl">
                  {activeDetailRecord.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs uppercase border border-amber-500/30">
                      {activeDetailRecord.relationship}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {activeDetailRecord.birthYear} – {activeDetailRecord.passingYear}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {activeDetailRecord.name}
                  </h2>
                  <p className="text-base sm:text-lg font-serif text-amber-400">
                    {activeDetailRecord.hebrewName} • {activeDetailRecord.hebrewPassingDate}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveDetailRecord(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scrollable Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
              {/* Quick Actions & Candle Counter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Flame className="w-5 h-5 animate-pulse" />
                    <span>{activeDetailRecord.candlesCount} Candles Lit</span>
                  </div>
                  <div className="h-4 w-px bg-white/20"></div>
                  <div className="text-xs text-slate-300">
                    Origin: <span className="font-semibold text-white">{activeDetailRecord.village}</span> ({activeDetailRecord.community})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleLightCandle(e, activeDetailRecord)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Light Yizkor Candle</span>
                  </button>

                  <button
                    onClick={() => handleSetReminder(activeDetailRecord)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition-all"
                  >
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Set Yahrzeit Alarm</span>
                  </button>
                </div>
              </div>

              {/* Full Biography Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Sacred Life Biography & Community Legacy</span>
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-serif bg-white/5 p-5 rounded-2xl border border-white/10">
                  {activeDetailRecord.fullBiography}
                </p>
              </div>

              {/* Life Milestones Timeline */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Historical Journey & Milestones</span>
                </h3>
                <div className="space-y-3 pl-3 border-l-2 border-amber-500/40">
                  {activeDetailRecord.timeline.map((item, idx) => (
                    <div key={idx} className="relative pl-5 pb-2">
                      <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-[#0D1322]"></div>
                      <span className="text-xs font-mono font-bold text-amber-400">{item.year}</span>
                      <h4 className="text-sm font-bold text-white">{item.title} ({item.location})</h4>
                      <p className="text-xs text-slate-300 mt-0.5">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Psalm */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Recommended Reflection • {activeDetailRecord.psalmRecommendation.title}
                  </span>
                  <BookOpen className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-base font-serif text-amber-200 text-right">
                  "{activeDetailRecord.psalmRecommendation.hebrewExcerpt}"
                </p>
                <p className="text-xs text-slate-300 italic">
                  "{activeDetailRecord.psalmRecommendation.englishExcerpt}"
                </p>
              </div>

              {/* Yahrzeit Quick Block & Action Row */}
              {(() => {
                const calc = memorialCalculations.get(activeDetailRecord.id);
                return (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-amber-300">
                        <CalendarIcon className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold">Next Yahrzeit: {calc ? `${calc.nextYahrzeit.gregorianDateFormatted} (${calc.nextYahrzeit.hebrewDateEn})` : activeDetailRecord.hebrewPassingDate}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-xs ${
                        calc?.isTodayYahrzeit || activeDetailRecord.isYahrzeitToday
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-white/10 text-slate-200'
                      }`}>
                        {calc?.isTodayYahrzeit || activeDetailRecord.isYahrzeitToday ? '🕯 TODAY!' : `${calc?.daysRemaining || 0} Days Remaining`}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => handleScheduleYahrzeitReminders(activeDetailRecord.name, activeDetailRecord.hebrewPassingDate, calc?.nextYahrzeit.gregorianDateIso || new Date().toISOString())}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Bell className="w-3.5 h-3.5 text-amber-400" />
                        <span>Schedule 7 Yahrzeit Reminders</span>
                      </button>

                      <button
                        onClick={() => handleAskAIRabbiYahrzeit(activeDetailRecord.name, activeDetailRecord.hebrewPassingDate)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>What should I do on this Yahrzeit?</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Tributes Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <MessageSquareHeart className="w-4 h-4 text-pink-400" />
                    <span>Heartfelt Tributes ({MemorialService.getTributes(activeDetailRecord.id).length})</span>
                  </h3>
                  <button
                    onClick={() => {
                      setTributeTargetRecord(activeDetailRecord);
                      setIsTributeModalOpen(true);
                    }}
                    className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Leave a Tribute</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {MemorialService.getTributes(activeDetailRecord.id).length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-4 text-center bg-black/20 rounded-xl">
                      Be the first to write a heartfelt remembrance tribute for {activeDetailRecord.name}.
                    </p>
                  ) : (
                    MemorialService.getTributes(activeDetailRecord.id).map((trib) => (
                      <div key={trib.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            {trib.authorName} <span className="text-amber-400/80 font-normal">({trib.authorRelation})</span>
                          </span>
                          <span className="text-[10px] text-slate-400">{trib.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-200 italic">"{trib.message}"</p>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{trib.community}</span>
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEAVE TRIBUTE MODAL */}
      {isTributeModalOpen && tributeTargetRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#121A2F] w-full max-w-md rounded-3xl p-6 border border-amber-500/40 shadow-2xl relative">
            <button
              onClick={() => setIsTributeModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
              <MessageSquareHeart className="w-4 h-4 text-pink-400" />
              <span>Leave Tribute</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Honoring {tributeTargetRecord.name}
            </h3>

            <form onSubmit={handleSubmitTribute} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={tributeAuthorName}
                  onChange={e => setTributeAuthorName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Relationship / Role</label>
                <input
                  type="text"
                  value={tributeRelation}
                  onChange={e => setTributeRelation(e.target.value)}
                  placeholder="e.g. Son, Granddaughter, Fellow Student"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Your Tribute Message</label>
                <textarea
                  rows={4}
                  value={tributeMessage}
                  onChange={e => setTributeMessage(e.target.value)}
                  placeholder="Share a blessed memory, favorite quote, or prayer..."
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Publish Tribute</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MEMORIAL DEDICATION MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#121A2F] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
              <Plus className="w-4 h-4" />
              <span>Sanctuary Registry</span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1">
              Create Memorial Dedication
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add your beloved elder or family member to the Bnei Menashe eternal community archive.
            </p>

            <form onSubmit={handleCreateMemorial} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Full English Name *</label>
                  <input
                    type="text"
                    value={newFormName}
                    onChange={e => setNewFormName(e.target.value)}
                    required
                    placeholder="e.g. Haokip Lunkholal"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Hebrew Name</label>
                  <input
                    type="text"
                    value={newFormHebrewName}
                    onChange={e => setNewFormHebrewName(e.target.value)}
                    placeholder="e.g. יוסף הוקיפ"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Birth Year</label>
                  <input
                    type="number"
                    value={newFormBirthYear}
                    onChange={e => setNewFormBirthYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Passing Year</label>
                  <input
                    type="number"
                    value={newFormPassingYear}
                    onChange={e => setNewFormPassingYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Relationship</label>
                  <select
                    value={newFormRelation}
                    onChange={e => setNewFormRelation(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Grandmother">Grandmother</option>
                    <option value="Elder">Elder / Pioneer</option>
                    <option value="Brother">Brother / Son</option>
                    <option value="Sister">Sister / Daughter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Hebrew Passing Date</label>
                  <input
                    type="text"
                    value={newFormHebrewDate}
                    onChange={e => setNewFormHebrewDate(e.target.value)}
                    placeholder="e.g. 13 Tammuz 5778"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Family Lineage / Surname</label>
                  <select
                    value={newFormFamily}
                    onChange={e => setNewFormFamily(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  >
                    <option value="Haokip">Haokip Family</option>
                    <option value="Singson">Singson Family</option>
                    <option value="Lhungdim">Lhungdim Family</option>
                    <option value="Touthang">Touthang Family</option>
                    <option value="Kipgen">Kipgen Family</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Village of Origin</label>
                  <input
                    type="text"
                    value={newFormVillage}
                    onChange={e => setNewFormVillage(e.target.value)}
                    placeholder="e.g. Churachandpur"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Migration Journey</label>
                  <input
                    type="text"
                    value={newFormCommunity}
                    onChange={e => setNewFormCommunity(e.target.value)}
                    placeholder="e.g. Manipur → Nof HaGalil"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Sacred Biography & Legacy *</label>
                <textarea
                  rows={4}
                  value={newFormBio}
                  onChange={e => setNewFormBio(e.target.value)}
                  placeholder="Share their life story, faith, community leadership, and devotion to Israel..."
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Dedicate Memorial to Sanctuary</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI RABBI HALACHIC YAHRZEIT RESPONSUM MODAL */}
      {isAIRabbiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0D1527] w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-amber-500/50 shadow-2xl relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">AI Rabbi & Torah Advisor</span>
                  <h3 className="text-lg font-bold text-white">{aiRabbiQueryTarget}</h3>
                </div>
              </div>
              <button
                onClick={() => setIsAIRabbiModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 overflow-y-auto space-y-4 flex-1 pr-1">
              {isAIRabbiLoading && !aiRabbiStreamingText ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3 text-center">
                  <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-mono text-amber-300 animate-pulse">Consulting Shulchan Aruch & Bnei Menashe Halachic Engine...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">Halachic Notice: Educational Guidance</span>
                      <span>This responsum provides educational information regarding communal Yahrzeit traditions. Please consult your local synagogue Rabbi for personal binding Halachic rulings.</span>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-black/40 p-5 rounded-2xl border border-white/10">
                    {aiRabbiStreamingText}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsAIRabbiModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
