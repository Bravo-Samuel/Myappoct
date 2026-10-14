import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Heart,
  BookOpen,
  Flame,
  FolderLock,
  Building2,
  Users,
  Bot,
  Sun,
  ChevronRight,
  Baby,
  Activity,
  FileText,
  HeartHandshake,
  ArrowRight,
  GraduationCap,
  Home,
  PlaneTakeoff,
  AlertCircle,
  Calendar,
  MapPin,
  HelpCircle,
  Coins,
  Crown,
  User
} from 'lucide-react';
import { NavSection } from '../../types';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';
import confetti from 'canvas-confetti';

interface MyJourneyViewProps {
  onNavigate: (section: NavSection) => void;
}

interface Milestone {
  id: string;
  category: 'personal' | 'family' | 'community';
  title: string;
  hebrewTitle: string;
  icon: React.ReactNode;
  description: string;
  whyItMatters: string;
  targetSection: NavSection;
  actionText: string;
  badge?: string;
  checkKey: string; // Key used in local storage to track completion
  encourageText: string;
  connectedModuleLabel: string;
}

export const MyJourneyView: React.FC<MyJourneyViewProps> = ({ onNavigate }) => {
  const { profile, role } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'family' | 'community'>('personal');
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null);

  // Load completed milestones from local storage on mount
  useEffect(() => {
    if (profile?.id) {
      const saved = localStorage.getItem(`bnei_menashe_journey_completed_${profile.id}`);
      if (saved) {
        try {
          setCompletedMilestones(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse completed milestones', e);
        }
      } else {
        // Set default completed milestones to match the user profile defaults
        const defaults: Record<string, boolean> = {
          'birth': true,
          'naming': profile.hebrew_name ? true : false,
          'census': true,
          'family_tree': true,
          'membership': true
        };
        setCompletedMilestones(defaults);
        localStorage.setItem(`bnei_menashe_journey_completed_${profile.id}`, JSON.stringify(defaults));
      }
    }
  }, [profile]);

  const toggleMilestone = (id: string, title: string) => {
    if (!profile?.id) return;
    
    const updated = {
      ...completedMilestones,
      [id]: !completedMilestones[id]
    };
    setCompletedMilestones(updated);
    localStorage.setItem(`bnei_menashe_journey_completed_${profile.id}`, JSON.stringify(updated));

    // If just completed, celebrate with confetti!
    if (updated[id]) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#D97706', '#10B981', '#3B82F6', '#EF4444']
      });
    }
  };

  // Define the milestones along the continuous journey
  const milestones: Milestone[] = [
    // --- PERSONAL JOURNEY ---
    {
      id: 'birth',
      category: 'personal',
      title: 'Sacred Soul Departure (Birth)',
      hebrewTitle: 'יְצִירַת הַנְּשָׁמָה',
      icon: <Baby className="w-5 h-5 text-sky-400" />,
      description: 'Your physical descent into this world. Each birth introduces a unique light and infinite potential to serve Am Yisrael.',
      whyItMatters: 'Every soul is sent with a specific task that only they can fulfill. The Talmud teaches that saving one life is akin to saving an entire universe.',
      targetSection: 'profile',
      actionText: 'View Community Identity Pass',
      badge: 'PROPHETIC BIRTH',
      checkKey: 'birth',
      encourageText: 'Register your child’s birth details under the local lifecycle registry.',
      connectedModuleLabel: 'Community Identity Pass'
    },
    {
      id: 'naming',
      category: 'personal',
      title: 'Hebrew Naming & Covenant',
      hebrewTitle: 'קְרִיאַת הַשֵּׁם וְהַבְּרִית',
      icon: <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />,
      description: 'The formal receipt of your Hebrew name, representing your spiritual conduit, tribal essence, and national identity.',
      whyItMatters: 'Your Hebrew name connects you to the Covenant of Abraham and Sarah. It is the spiritual channel through which you are called to the Torah.',
      targetSection: 'profile',
      actionText: 'Confirm Hebrew Name',
      badge: 'SACRED BRANDING',
      checkKey: 'naming',
      encourageText: 'You have not yet registered or updated your official Hebrew name.',
      connectedModuleLabel: 'Community Identity Pass & AI Rabbi'
    },
    {
      id: 'bar_mitzvah',
      category: 'personal',
      title: 'Torah Accountability (Bar/Bat Mitzvah)',
      hebrewTitle: 'קַבָּלַת הַמִּצְוֹת',
      icon: <BookOpen className="w-5 h-5 text-indigo-400" />,
      description: 'The physical transition to adult responsibility under Halacha, taking ownership of the sacred commandments.',
      whyItMatters: 'Standing before the Torah and the Kehillah establishes you as an active partner in maintaining the eternal chain of Jewish tradition.',
      targetSection: 'torah_library',
      actionText: 'Explore Torah Portions',
      checkKey: 'bar_mitzvah',
      encourageText: 'Add your Bar/Bat Mitzvah reading milestones or explore your Shabbat Torah portion.',
      connectedModuleLabel: 'Torah Library'
    },
    {
      id: 'hebrew_learning',
      category: 'personal',
      title: 'Hebrew Language Proficiency',
      hebrewTitle: 'לִמּוּד עִבְרִית',
      icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
      description: 'Acquiring fluency in Hebrew script, conversation, and reading of the daily prayers (Siddur).',
      whyItMatters: 'Reclaiming the holy tongue (Lashon HaKodesh) unlocks the direct meanings of our scriptures, aligning your voice with millions of Jews.',
      targetSection: 'parashah',
      actionText: 'Study Torah Parashah',
      badge: 'HEBREW ACADEMY',
      checkKey: 'hebrew_learning',
      encourageText: 'You have not yet completed your basic Hebrew language and daily prayer cycle modules.',
      connectedModuleLabel: 'Torah Library & Study Trackers'
    },
    {
      id: 'aliyah_return',
      category: 'personal',
      title: 'The Great Return (Aliyah)',
      hebrewTitle: 'שִׁיבַת צִיּוֹן',
      icon: <PlaneTakeoff className="w-5 h-5 text-blue-400" />,
      description: 'The physical Aliyah journey from Manipur/Mizoram back to our ancient homeland of Israel.',
      whyItMatters: 'Your physical presence in Israel is a living fulfillment of biblical prophecies: "And I will bring them back, for I have compassion on them" (Zechariah 10:6).',
      targetSection: 'document_center',
      actionText: 'Review Aliyah Visas',
      badge: 'ZION BOUND',
      checkKey: 'aliyah_return',
      encourageText: 'You have not yet uploaded your immigration visa or verified your Aliyah absorption papers.',
      connectedModuleLabel: 'Digital Document Vault'
    },

    // --- FAMILY JOURNEY ---
    {
      id: 'family_tree',
      category: 'family',
      title: 'Genealogy Tree & Tribal Heritage',
      hebrewTitle: 'שַׁלְשֶׁלֶת הַיּוּחֲסִין',
      icon: <Users className="w-5 h-5 text-amber-500" />,
      description: 'Mapping your family lineage (Haokip, Singson, Lhungdim, Touthang, etc.) across multiple generations.',
      whyItMatters: 'Preserving our pedigree is how we verify our connection to Menashe, recognizing the families who guarded their faith for over two millennia.',
      targetSection: 'family',
      actionText: 'View Lineage Tree',
      checkKey: 'family_tree',
      encourageText: 'Your family tree is missing historical records or ancestral village roots.',
      connectedModuleLabel: 'Lineage & Heritage Tree'
    },
    {
      id: 'marriage',
      category: 'family',
      title: 'Sacred Household (Chuppah)',
      hebrewTitle: 'חוּפָּה וְקִדּוּשִׁין',
      icon: <HeartHandshake className="w-5 h-5 text-rose-400" />,
      description: 'The union under the Chuppah canopy, building a kosher, loving household in Israel.',
      whyItMatters: 'A Jewish marriage is described as a "Holy Temple in miniature". It is where the Shechinah (Divine Presence) dwells in peaceful harmony.',
      targetSection: 'family_purity',
      actionText: 'Explore Family Guidelines',
      checkKey: 'marriage',
      encourageText: 'You have not yet registered your wedding ketubah or verified household integration.',
      connectedModuleLabel: 'Taharat HaMishpacha & Lineage'
    },
    {
      id: 'children',
      category: 'family',
      title: 'Generational Continuity (Children)',
      hebrewTitle: 'דּוֹר לְדוֹר',
      icon: <Home className="w-5 h-5 text-teal-400" />,
      description: 'Passing the holy flame, traditions, and faith of the Bnei Menashe down to your children.',
      whyItMatters: 'Our children are our ultimate guarantors. Teaching them Torah ensures that the song of Israel will continue to echo in our homes forever.',
      targetSection: 'family',
      actionText: 'Manage Household Members',
      checkKey: 'children',
      encourageText: 'You have not yet linked any children nodes to your lineage profile.',
      connectedModuleLabel: 'Lineage & Heritage Tree'
    },
    {
      id: 'memorial_honor',
      category: 'family',
      title: 'Legacy & Ancestral Memorial',
      hebrewTitle: 'נֵר נִשְׁמַת אָבוֹת',
      icon: <Flame className="w-5 h-5 text-orange-500 animate-pulse" />,
      description: 'Honoring and elevating the memory of departed parents, grandparents, and community pioneers.',
      whyItMatters: 'By lighting virtual candles and reciting Psalms on their Yahrzeits, we elevate their souls and keep their sacrifices alive.',
      targetSection: 'memorial',
      actionText: 'Light Memorial Candle',
      checkKey: 'memorial_honor',
      encourageText: 'You have not yet lit a virtual memorial candle or added departed relatives to the sanctuary.',
      connectedModuleLabel: 'Memorial Sanctuary'
    },

    // --- COMMUNITY JOURNEY ---
    {
      id: 'census',
      category: 'community',
      title: 'Community Census & Digital ID',
      hebrewTitle: 'מִפְקַד הַקְּהִלָּה',
      icon: <Activity className="w-5 h-5 text-emerald-500" />,
      description: 'Registering with the national census and Bnei Menashe Digital Registry for official council status.',
      whyItMatters: 'A census unites us numerically and organizationally. Moses counted the tribes to prepare them to organize, settle, and inherit Israel.',
      targetSection: 'census_demographics',
      actionText: 'View Census Dashboard',
      checkKey: 'census',
      encourageText: 'Your census records are out-of-date or lack regional verification.',
      connectedModuleLabel: 'Community Census'
    },
    {
      id: 'membership',
      category: 'community',
      title: 'Synagogue Affiliation & Verified Membership',
      hebrewTitle: 'חַבְרוּת בְּבֵית הַכְּנֶסֶת',
      icon: <Building2 className="w-5 h-5 text-amber-600" />,
      description: 'Aligning with a localized synagogue (e.g., Shalom Zion) and participating in daily minyanim.',
      whyItMatters: 'Our synagogues are the beating heart of our exile and redemption. It is where we assemble, pray, and support one another in unity.',
      targetSection: 'sanctuary',
      actionText: 'Select Synagogue',
      checkKey: 'membership',
      encourageText: 'You have not yet selected or verified your synagogue membership with a gabbai.',
      connectedModuleLabel: 'Synagogues & Sanctuaries'
    },
    {
      id: 'volunteer',
      category: 'community',
      title: 'Communal Volunteerism (Chesed)',
      hebrewTitle: 'גְּמִילוּת חֲסָדִים',
      icon: <Heart className="w-5 h-5 text-red-400 animate-pulse" />,
      description: 'Devoting active service hours toward community coordination, hosting Shabbat, or tutoring youth.',
      whyItMatters: 'The pillars of the world are Torah, prayer, and acts of lovingkindness. Giving your time elevates the entire community.',
      targetSection: 'service_center',
      actionText: 'View Volunteer Hub',
      checkKey: 'volunteer',
      encourageText: 'You have not yet logged volunteer hours or applied for a Chesed service certificate.',
      connectedModuleLabel: 'Community Services'
    },
    {
      id: 'contributions',
      category: 'community',
      title: 'Community Contributions (Ma’aser)',
      hebrewTitle: 'תְּרוּמָה וּמַעֲשֵׂר',
      icon: <Coins className="w-5 h-5 text-yellow-500" />,
      description: 'Supporting synagogue developments, Hebrew learning fellowships, and families in financial need.',
      whyItMatters: 'Ma’aser is not just charity; it is a spiritual declaration that everything we own belongs to Hashem. It creates mutual responsibility.',
      targetSection: 'analytics',
      actionText: 'Manage Contributions',
      checkKey: 'contributions',
      encourageText: 'No previous community donations or local contributions are recorded under your wallet.',
      connectedModuleLabel: 'Community Analytics'
    },
    {
      id: 'leadership',
      category: 'community',
      title: 'Elected Council & Gabbai Leadership',
      hebrewTitle: 'מַנְהִיגוּת הַקְּהִלָּה',
      icon: <Crown className="w-5 h-5 text-amber-500 animate-bounce" />,
      description: 'Stepping forward as a localized leader, rabbi, gabbai, or regional council representative.',
      whyItMatters: 'True Jewish leaders are servants of the public, dedicated to guiding the flock with gentleness, integrity, and faith.',
      targetSection: 'regional_council',
      actionText: 'Access Regional Council',
      checkKey: 'leadership',
      encourageText: 'Apply for council participation or volunteer for administrative leadership duties.',
      connectedModuleLabel: 'Regional Council Portal'
    }
  ];

  const currentMilestones = milestones.filter(m => m.category === activeTab);
  const totalInTab = currentMilestones.length;
  const completedInTab = currentMilestones.filter(m => completedMilestones[m.id]).length;
  const progressPercent = totalInTab > 0 ? Math.round((completedInTab / totalInTab) * 100) : 0;

  // Let's compute overall summary counts across all 3 journey tabs
  const overallTotal = milestones.length;
  const overallCompleted = milestones.filter(m => completedMilestones[m.id]).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-900 dark:text-slate-100 font-sans" id="my-journey-view-container">
      {/* Visual Header Banner - Minimalist, Apple-Quality, Peaceful */}
      <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 text-white border border-amber-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Compass className="w-64 h-64 text-amber-400 rotate-12" />
        </div>
        
        <div className="space-y-3 max-w-2xl text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin-slow text-amber-400" />
            <span>Project Derech Chaim • דֶּרֶךְ חַיִּים</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-sans text-white">
            The Journey of Life
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xl font-medium">
            Your sacred life journey inside the Bnei Menashe community. This is not an administrative tracker—it is a living, breathing map of your milestones, legacy, and faith, guiding your path from Northeast India back to Zion.
          </p>
        </div>

        {/* Global Progress Dial */}
        <div className="relative flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-3xl border border-white/10 shrink-0 shadow-lg min-w-[200px] z-10">
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Overall Journey</div>
          <div className="text-4xl font-black text-amber-400 tracking-tight font-sans">
            {overallCompleted}<span className="text-lg text-slate-400 font-normal">/{overallTotal}</span>
          </div>
          <div className="text-[11px] font-bold text-emerald-400 mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{Math.round((overallCompleted / overallTotal) * 100)}% Fulfilled</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center leading-relaxed">
            Hashem guides your footprints through every milestone.
          </p>
        </div>
      </div>

      {/* Warm Phase 8 Context Block */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-white space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>What is Project Derech Chaim?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Project Derech Chaim maps out your personal, familial, and communal footsteps. Each milestone connects you straight to real, active modules on this platform (such as your Digital ID, Family Tree, or Memorial Sanctuary) without duplicating records. Complete milestones, light candles, and track your Aliyah visa stages under one unified journey.
        </p>
      </div>

      {/* Navigation Tabs - Apple Style Minimal */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'personal'
                ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-md border border-slate-200 dark:border-slate-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Journey</span>
          </button>
          <button
            onClick={() => setActiveTab('family')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'family'
                ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-md border border-slate-200 dark:border-slate-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>My Family Journey</span>
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'community'
                ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-md border border-slate-200 dark:border-slate-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>My Community Journey</span>
          </button>
        </div>

        {/* Tab Progress Metric */}
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Tab Progress:
          </span>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full shadow-xs">
            <span className="text-xs font-black text-amber-500 font-mono">{progressPercent}%</span>
            <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400">({completedInTab}/{totalInTab})</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Timeline Content */}
      <div className="relative flex flex-col md:flex-row gap-8">
        
        {/* Timeline Line & Milestones Map */}
        <div className="flex-1 space-y-6 relative">
          
          {/* Vertical Timeline Background Line (Desktop Only) */}
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-slate-200 dark:bg-slate-800 hidden sm:block pointer-events-none" />

          {currentMilestones.map((milestone, idx) => {
            const isCompleted = completedMilestones[milestone.id];
            const isHovered = hoveredMilestone === milestone.id;

            return (
              <div
                key={milestone.id}
                onMouseEnter={() => setHoveredMilestone(milestone.id)}
                onMouseLeave={() => setHoveredMilestone(null)}
                className={`relative flex flex-col sm:flex-row items-start gap-6 p-6 rounded-3xl border transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-emerald-500/5 to-slate-50/50 dark:to-slate-900/50 border-emerald-500/20 hover:border-emerald-500/40'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-amber-500/30'
                } ${isHovered ? 'shadow-lg scale-[1.01]' : 'shadow-xs'}`}
              >
                {/* Checkbox / Timeline Bullet */}
                <div className="relative z-10 flex items-center justify-center shrink-0 self-start sm:self-center">
                  <button
                    onClick={() => toggleMilestone(milestone.id, milestone.title)}
                    className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-amber-500/10 hover:text-amber-500 border border-slate-200 dark:border-slate-700'
                    }`}
                    title={isCompleted ? "Mark Milestone Incomplete" : "Mark Milestone Fulfilled"}
                  >
                    {milestone.icon}
                    <span className="text-[9px] uppercase font-black tracking-widest">
                      {isCompleted ? '✓ Done' : 'Fulfil'}
                    </span>
                  </button>
                  
                  {/* Circular step counter badge */}
                  <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] font-mono font-bold shadow-sm">
                    {idx + 1}
                  </span>
                </div>

                {/* Milestone Detail Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                          {milestone.title}
                        </h3>
                        {milestone.badge && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
                            {milestone.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-black text-amber-500 font-mono tracking-wider uppercase">
                        {milestone.hebrewTitle}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{milestone.connectedModuleLabel}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {milestone.description}
                  </p>

                  {/* Why It Matters Callout Box */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-slate-800/40 border border-amber-500/10 space-y-1">
                    <div className="text-[10px] uppercase font-black tracking-widest text-amber-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Why This Matters</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed font-medium">
                      "{milestone.whyItMatters}"
                    </p>
                  </div>

                  {/* Gentle Encouragement for Empty Milestones */}
                  {!isCompleted && (
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-500 dark:text-rose-400 text-xs font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{milestone.encourageText}</span>
                    </div>
                  )}

                  {/* Quick Connection Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => onNavigate(milestone.targetSection)}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center gap-2 border border-slate-700"
                    >
                      <span>{milestone.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {isCompleted ? (
                      <div className="px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Milestone Celebrated</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleMilestone(milestone.id, milestone.title)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all hover:scale-102 flex items-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Record Accomplishment</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Apple-Quality Guide Sidebar */}
        <div className="w-full md:w-80 shrink-0 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-500" />
              <span>Journey Companion</span>
            </h3>
            
            <div className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                The Talmud counsels us: "Prepare yourself in the vestibule so that you may enter the banquet hall."
              </p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Each completed milestone strengthens the Bnei Menashe national identity registry. Your lineage and steps help complete the digital tapestry of our entire tribe.
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Quick Integration Checks
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <span>Household Registered</span>
                  <span className={completedMilestones['family_tree'] ? "text-emerald-500" : "text-amber-500"}>
                    {completedMilestones['family_tree'] ? "✓ Active" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <span>Hebrew Level I</span>
                  <span className={completedMilestones['hebrew_learning'] ? "text-emerald-500" : "text-amber-500"}>
                    {completedMilestones['hebrew_learning'] ? "✓ Verified" : "Incomplete"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <span>Census Completed</span>
                  <span className={completedMilestones['census'] ? "text-emerald-500" : "text-amber-500"}>
                    {completedMilestones['census'] ? "✓ Sync" : "No record"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <span>Synagogue Verified</span>
                  <span className={completedMilestones['membership'] ? "text-emerald-500" : "text-amber-500"}>
                    {completedMilestones['membership'] ? "✓ Gabbai Check" : "Incomplete"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <span>Memorial Plaque Lit</span>
                  <span className={completedMilestones['memorial_honor'] ? "text-emerald-500" : "text-amber-500"}>
                    {completedMilestones['memorial_honor'] ? "✓ Lighted" : "No candle"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                // Bulk reset simulation for verification
                if (profile?.id) {
                  const resetDefaults = {
                    'birth': true,
                    'naming': profile.hebrew_name ? true : false,
                    'census': true,
                    'family_tree': true,
                    'membership': true
                  };
                  setCompletedMilestones(resetDefaults);
                  localStorage.setItem(`bnei_menashe_journey_completed_${profile.id}`, JSON.stringify(resetDefaults));
                  confetti({ particleCount: 30, spread: 40 });
                }
              }}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 text-[11px] font-black uppercase tracking-wider text-slate-500 hover:text-amber-500 transition-colors"
            >
              Reset to Profile Sync
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-300 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Bot className="w-4 h-4" />
              <span>Ask the AI Rabbi</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Wondering about your Hebrew birthdate, your family lineage history, or the halachot of Aliyah and conversion? Consult our secure AI Rabbi.
            </p>
            <button
              onClick={() => onNavigate('ai_rabbi')}
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Consult AI Rabbi</span>
              <Bot className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
