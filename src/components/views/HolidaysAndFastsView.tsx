import React, { useState, useMemo } from 'react';
import { 
  Search, Sparkles, Clock, BookOpen, Calendar, Flame, 
  CheckCircle2, HelpCircle, Info, ChevronDown, ChevronUp, 
  BookMarked, MapPin, Feather, Filter, Heart
} from 'lucide-react';
import jewishHolidays from '../../data/knowledge/jewish_holidays.json';
import fastDays from '../../data/knowledge/fast_days.json';

// Define TS interfaces for our data items
interface FAQItem {
  question: string;
  answer: string;
}

interface HolidayOrFastItem {
  id: string;
  title: string;
  hebrewTitle: string;
  category: string;
  citation: string;
  tags: string[];
  overview: string;
  historicalBackground: string;
  torahSources: string[];
  classicalCommentary: string;
  bneiMenashePerspective: string;
  practicalLessons: string[];
  frequentlyAskedQuestions: FAQItem[];
  relatedTopics: string[];
  difficultyLevel: string;
  suggestedFollowUpQuestions: string[];
  type: 'holiday' | 'fast';
}

export const HolidaysAndFastsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'holidays' | 'fasts' | 'pilgrimage' | 'rabbinic' | 'halacha'>('all');
  const [selectedItem, setSelectedItem] = useState<HolidayOrFastItem | null>(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  
  // Offline Study Progress Tracker (stored in LocalStorage)
  const [completedPreparation, setCompletedPreparation] = useState<string[]>(() => {
    const saved = localStorage.getItem('bnei_menashe_holiday_prep_progress');
    return saved ? JSON.parse(saved) : [];
  });

  const togglePreparation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card selection click
    const next = completedPreparation.includes(id)
      ? completedPreparation.filter(item => item !== id)
      : [...completedPreparation, id];
    setCompletedPreparation(next);
    localStorage.setItem('bnei_menashe_holiday_prep_progress', JSON.stringify(next));
  };

  // Merge the JSON items, marking their source type
  const allItems = useMemo<HolidayOrFastItem[]>(() => {
    const holidays = (jewishHolidays.items || []).map(h => ({ ...h, type: 'holiday' as const }));
    const fasts = (fastDays.items || []).map(f => ({ ...f, type: 'fast' as const }));
    return [...holidays, ...fasts] as HolidayOrFastItem[];
  }, []);

  // Filtering Logic
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // Tab matching
      if (activeTab === 'holidays' && item.type !== 'holiday') return false;
      if (activeTab === 'fasts' && item.type !== 'fast') return false;
      
      // Pilgrimage festivals (Pesach, Shavuot, Sukkot)
      if (activeTab === 'pilgrimage') {
        const isPilg = ['hol-sukkot', 'hol-passover', 'hol-shavuot'].includes(item.id) || 
                      item.tags.some(t => t.includes('pilgrimage') || t.includes('three festivals'));
        if (!isPilg) return false;
      }

      // Rabbinic and modern (Chanukah, Purim, Yom HaAtzmaut, Yom Yerushalayim, Lag BaOmer)
      if (activeTab === 'rabbinic') {
        const isRabbinic = ['hol-chanukah', 'hol-purim', 'hol-yom-haatzmaut', 'hol-yom-yerushalayim', 'hol-lag-baomer'].includes(item.id) ||
                           item.tags.some(t => t.includes('rabbinic') || t.includes('modern'));
        if (!isRabbinic || item.type === 'fast') return false;
      }

      // Search matching (Title, Hebrew, description, overview, tags)
      if (searchTerm.trim() !== '') {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(lowerSearch);
        const matchesHebrew = item.hebrewTitle.includes(lowerSearch);
        const matchesOverview = item.overview.toLowerCase().includes(lowerSearch);
        const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(lowerSearch));
        return matchesTitle || matchesHebrew || matchesOverview || matchesTags;
      }

      return true;
    });
  }, [allItems, activeTab, searchTerm]);

  // General Halachic overview guide for quick reference
  const halachicGuidelines = [
    {
      title: "Yamim Tovim (Biblical Festivals)",
      desc: "Like Shabbat, work (Melacha) is prohibited on Yamim Tovim (first & last days of Passover, Shavuot, Rosh Hashanah, Sukkot, Shemini Atzeret). However, cooking/food prep (Ochel Nefesh) and transferring fire from an existing flame are permitted for use on the festival itself, provided an Eruv Tavshilin is made when Yom Tov leads directly into Shabbat.",
      rules: [
        "Prohibited: Writing, sewing, commercial activity, agricultural work, extinguishing fire.",
        "Permitted: Cooking, baking, carrying in public domains, lighting from pre-existing flames.",
        "Requirement: Honor the festival with clean white garments, candles, and twice-daily festive meals containing meat & wine."
      ]
    },
    {
      title: "Major Fast Days (Yom Kippur & Tisha B'Av)",
      desc: "The two full 25-hour fasts (running from sunset to star-fall the next night) that carry stringent biblical or rabbinic prohibitions to subvert comfort and arouse national/personal repentance.",
      rules: [
        "Complete abstinence from all food, water, and liquids.",
        "No bathing, washing, or rinsing hands (except after restroom or waking up to knuckles only).",
        "No anointing the skin with lotions, oils, or perfumes.",
        "Strict prohibition of marital relations.",
        "No leather-soled footwear (customary to wear canvas, rubber, or plastic)."
      ]
    },
    {
      title: "Minor Fast Days (Dawn to Dusk)",
      desc: "Commemorating tragic events surrounding the destruction of both Holy Temples. Fasting begins at Alot HaShachar (dawn) and ends at Tzeit HaKochavim (star-fall) on the same day.",
      rules: [
        "Fasts included: Tzom Gedaliah, 10th of Tevet, Fast of Esther, 17th of Tammuz.",
        "Eating and drinking are strictly prohibited for healthy adults.",
        "Bathing, wearing leather, and anointing are permitted, though fine luxury bathing is discouraged.",
        "Pregnant, nursing mothers, and those who are ill are completely exempt from minor fasts.",
        "Aneinu prayer is added to the Amidah in Shacharit and Mincha by the congregation."
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12 animate-fade-in" id="holidays-fasts-view">
      {/* Header Banner */}
      <div className="relative p-8 rounded-3xl bg-slate-900 overflow-hidden border border-amber-500/30 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Sacred Registry</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Holidays & Fasts Overview</h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Explore the complete cycle of sacred times, festivals, and solemn fasts. Sync and study the Torah sources, 
            classical commentaries, and local Bnei Menashe customs of Manipur, Mizoram, and Israel completely offline.
          </p>
        </div>
      </div>

      {/* Main Grid and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Tabs & Search (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Search Box */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Search Sacred Calendar</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Purim, fast, shofar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Tab Selection */}
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-1">
            <button
              onClick={() => { setActiveTab('all'); setSelectedItem(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'all'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-l-4 border-amber-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>All Sacred Days</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">{allItems.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('holidays'); setSelectedItem(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'holidays'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-l-4 border-amber-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                Festivals & Holidays
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                {allItems.filter(i => i.type === 'holiday').length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('fasts'); setSelectedItem(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'fasts'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-l-4 border-amber-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Solemn Fast Days
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                {allItems.filter(i => i.type === 'fast').length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('pilgrimage'); setSelectedItem(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'pilgrimage'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-l-4 border-amber-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookMarked className="w-3.5 h-3.5 text-amber-500" />
                Three Pilgrimage Feasts
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold uppercase">Shalosh</span>
            </button>

            <button
              onClick={() => { setActiveTab('rabbinic'); setSelectedItem(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'rabbinic'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-l-4 border-amber-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Feather className="w-3.5 h-3.5 text-amber-500" />
                Rabbinic & Modern Days
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/20 text-purple-600 dark:text-purple-400 font-extrabold uppercase font-sans">Post-Bib</span>
            </button>

            <button
              onClick={() => { setActiveTab('halacha'); setSelectedItem(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1 pt-3 ${
                activeTab === 'halacha'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-l-4 border-amber-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Info className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Halachic Observance Code</span>
            </button>
          </div>

          {/* Quick Offline Status Card */}
          <div className="bg-slate-900/90 text-white p-5 rounded-2xl border border-amber-500/30 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Synced & Ready</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              All calendar sources, parashot summaries, and historical fast guidelines are cached directly inside your local sandbox. Access completely without network.
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">Database Status:</span>
              <span className="text-[10px] font-bold text-emerald-400">OFFLINE SYNCED</span>
            </div>
          </div>
        </div>

        {/* Dynamic Display Area (9 Columns) */}
        <div className="lg:col-span-9">
          
          <div className="space-y-6">
            {/* 1. HALACHA GUIDELINES VIEW */}
            {activeTab === 'halacha' && (
              <div
                className="space-y-6 animate-fade-in"
              >
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">General Laws & Halachic Framework</h2>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Observance of the sacred calendar rests on core Halachic categories. Below is an overview of the legal structures governing Jewish Holidays, festivals, and dawn-to-dusk or full-day fasts.
                  </p>

                  <div className="space-y-6 pt-2">
                    {halachicGuidelines.map((g, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                        <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          {g.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {g.desc}
                        </p>
                        <div className="pt-2 space-y-2 border-t border-slate-200/50 dark:border-slate-700/50">
                          <h4 className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Core Mitzvot & Restrictions:</h4>
                          <ul className="space-y-1.5 pl-4 list-disc">
                            {g.rules.map((r, ri) => (
                              <li key={ri} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. MAIN HOLIDAY & FAST CARD GRID */}
            {activeTab !== 'halacha' && !selectedItem && (
              <div
                className="space-y-6 animate-fade-in"
              >
                {/* Section Stats & Filter Title */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-amber-500" />
                    <span>
                      {activeTab === 'all' && 'All Holidays and Fasts'}
                      {activeTab === 'holidays' && 'Jewish Festivals & Holidays'}
                      {activeTab === 'fasts' && 'Solemn Fast Days'}
                      {activeTab === 'pilgrimage' && 'The Three Pilgrimage Feasts'}
                      {activeTab === 'rabbinic' && 'Rabbinic & Historical Celebrations'}
                    </span>
                    <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      {filteredItems.length} found
                    </span>
                  </h2>
                </div>

                {/* Grid Layout */}
                {filteredItems.length === 0 ? (
                  <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Info className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">No holidays or fasts match your search query.</p>
                    <button 
                      onClick={() => { setSearchTerm(''); setActiveTab('all'); }} 
                      className="mt-3 px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-amber-400 transition-all"
                    >
                      Clear Search Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredItems.map((item) => {
                      const isCompleted = completedPreparation.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-500/40 dark:hover:border-amber-500/40 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group space-y-4 relative"
                        >
                          <div className="space-y-2">
                            {/* Card Top Badges */}
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                                item.type === 'fast' 
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              }`}>
                                {item.type === 'fast' ? 'Solemn Fast' : 'Yom Tov / Festival'}
                              </span>
                              
                              {/* Offline Study Mark */}
                              <button
                                onClick={(e) => togglePreparation(item.id, e)}
                                title={isCompleted ? "Mark as preparation uncompleted" : "Mark as studied & prepared"}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  isCompleted 
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                                    : 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 hover:text-amber-500'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Titles */}
                            <div>
                              <h3 className="font-extrabold text-slate-800 dark:text-white text-base group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {item.title.split(':')[0]}
                              </h3>
                              <p className="text-xs font-serif text-slate-400 dark:text-slate-500 tracking-wide mt-0.5">
                                {item.hebrewTitle}
                              </p>
                            </div>

                            {/* Brief Overview Snippet */}
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1">
                              {item.overview}
                            </p>
                          </div>

                          {/* Footer Info */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-500" />
                              {item.citation.split(';')[0]}
                            </span>
                            <span className="font-semibold text-slate-500 dark:text-slate-300 flex items-center gap-1.5">
                              <span>Learn More</span>
                              <span className="transition-transform group-hover:translate-x-1">→</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. DETAILED SPLIT / FULL-SCREEN DETAIL VIEW */}
            {selectedItem && (
              <div
                className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in"
              >
                {/* Detail View Header */}
                <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                  <div className="space-y-1">
                    <button
                      onClick={() => { setSelectedItem(null); setExpandedFaqIndex(null); }}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline mb-2 block flex items-center gap-1"
                    >
                      ← Back to Registry
                    </button>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {selectedItem.title}
                    </h2>
                    <p className="text-base font-serif text-amber-600 dark:text-amber-500">
                      {selectedItem.hebrewTitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        {selectedItem.citation}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                        Difficulty: {selectedItem.difficultyLevel}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                        selectedItem.type === 'fast' 
                          ? 'bg-rose-500/10 text-rose-600' 
                          : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {selectedItem.type === 'fast' ? 'Solemn Fast' : 'Festival'}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Prep Button in Detail View */}
                  <button
                    onClick={(e) => togglePreparation(selectedItem.id, e)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                      completedPreparation.includes(selectedItem.id)
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{completedPreparation.includes(selectedItem.id) ? 'Prepared & Studied' : 'Mark as Prepared'}</span>
                  </button>
                </div>

                {/* Detail Sections: Grid of Information */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  
                  {/* Left Column (8 cols): Torah Sources, Historical Context, Commentary */}
                  <div className="md:col-span-8 space-y-6">
                    
                    {/* Overview */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Info className="w-4 h-4 text-amber-500" />
                        <span>Overview</span>
                      </h3>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedItem.overview}
                      </p>
                    </div>

                    {/* Historical Background */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Feather className="w-4 h-4 text-amber-500" />
                        <span>Historical Origins & Context</span>
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {selectedItem.historicalBackground}
                      </p>
                    </div>

                    {/* Torah Sources */}
                    {selectedItem.torahSources && selectedItem.torahSources.length > 0 && (
                      <div className="space-y-2.5">
                        <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-amber-500" />
                          <span>Torah Sources & Biblical Mandate</span>
                        </h3>
                        <div className="space-y-2">
                          {selectedItem.torahSources.map((source, sIdx) => (
                            <blockquote 
                              key={sIdx} 
                              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-l-4 border-amber-500 text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed font-serif"
                            >
                              {source}
                            </blockquote>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Classical Commentary */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Feather className="w-4 h-4 text-amber-500" />
                        <span>Classical Rabbinic Commentary</span>
                      </h3>
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedItem.classicalCommentary}
                      </div>
                    </div>

                    {/* Halachic Laws & Practical Lessons */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <BookMarked className="w-4 h-4 text-amber-500" />
                        <span>Halachic Observances & Customs</span>
                      </h3>
                      <div className="space-y-2">
                        {selectedItem.practicalLessons.map((lesson, lIdx) => (
                          <div key={lIdx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            <span className="p-0.5 rounded-full bg-amber-500 text-slate-900 font-extrabold text-[9px] w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                              {lIdx + 1}
                            </span>
                            <span>{lesson}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column (4 cols): Bnei Menashe Customs, FAQs, Related Topics */}
                  <div className="md:col-span-4 space-y-6 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-6">
                    
                    {/* Bnei Menashe Custom Highlight */}
                    <div className="p-5 rounded-2xl bg-slate-900 text-white border border-amber-500/30 space-y-3 shadow-md">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span>Bnei Menashe Perspective</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {selectedItem.bneiMenashePerspective}
                      </p>
                    </div>

                    {/* FAQ Accordion */}
                    {selectedItem.frequentlyAskedQuestions && selectedItem.frequentlyAskedQuestions.length > 0 && (
                      <div className="space-y-2.5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-amber-500" />
                          <span>Frequently Asked</span>
                        </h3>
                        <div className="space-y-2">
                          {selectedItem.frequentlyAskedQuestions.map((faq, fIdx) => {
                            const isOpen = expandedFaqIndex === fIdx;
                            return (
                              <div 
                                key={fIdx} 
                                className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden text-xs"
                              >
                                <button
                                  onClick={() => setExpandedFaqIndex(isOpen ? null : fIdx)}
                                  className="w-full text-left p-3 bg-slate-50 dark:bg-slate-800 font-bold text-slate-800 dark:text-white flex items-center justify-between gap-2"
                                >
                                  <span>{faq.question}</span>
                                  {isOpen ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
                                </button>
                                {isOpen && (
                                  <div className="p-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                                    {faq.answer}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Related Topics & Follow Up */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Related Themes</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedItem.relatedTopics.map((topic, rIdx) => (
                          <span 
                            key={rIdx} 
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Study Suggestions */}
                      {selectedItem.suggestedFollowUpQuestions && selectedItem.suggestedFollowUpQuestions.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">Study Guide Prompts:</span>
                          <ul className="space-y-1 pl-1">
                            {selectedItem.suggestedFollowUpQuestions.map((q, qIdx) => (
                              <li key={qIdx} className="text-[11px] text-slate-500 dark:text-slate-400 list-none flex items-start gap-1.5">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span>"{q}"</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                  </div>

                </div>

                {/* Back button at the bottom */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <button
                    onClick={() => { setSelectedItem(null); setExpandedFaqIndex(null); }}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    ← Back to List
                  </button>
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                    Bnei Menashe Sacred Registry
                  </span>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
