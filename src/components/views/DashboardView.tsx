import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Sparkles, 
  BookOpen, 
  Flame, 
  Bot, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  MapPin, 
  Calendar as CalendarIcon,
  Crown,
  Users,
  HeartHandshake,
  ShieldCheck,
  Clock,
  CloudSun,
  FileText,
  CheckSquare,
  Bell,
  ChevronRight,
  Award,
  Lock,
  RefreshCw,
  UserCheck,
  BarChart2,
  Landmark,
  Check,
  Circle,
  HelpCircle,
  X,
  Activity,
  FolderLock,
  Building2,
  Radio,
  Megaphone,
  Cpu,
  Compass,
  Heart,
  GraduationCap,
  Gift,
  Info
} from 'lucide-react';
import { NavSection } from '../../types';
import { FAMILY_TREE_SAMPLE, ANNOUNCEMENTS } from '../../data/mockData';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';

interface DashboardViewProps {
  locationName: string;
  onNavigate: (section: NavSection) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ locationName, onNavigate }) => {
  const { session, profile } = useSupabaseAuth();
  const [greetingTime, setGreetingTime] = useState<string>('Good Morning');
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [activeRhythmTab, setActiveRhythmTab] = useState<'today' | 'weekly' | 'monthly' | 'yearly'>('today');
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    household_reg: true,
    verify_family: true,
    confirm_memorial: true,
    review_notices: false,
    upload_passport: false
  });

  // Local state for census record insight
  const [censusStatus, setCensusStatus] = useState<'verified' | 'draft' | 'open'>('verified');
  const [householdId, setHouseholdId] = useState<string>('BM-2026-CHUR-0842');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingTime('Good Morning');
    else if (hour < 17) setGreetingTime('Good Afternoon');
    else setGreetingTime('Good Evening');

    if (session?.user?.id) {
      const savedRecord = localStorage.getItem(`bnei_menashe_census_record_${session.user.id}`);
      const savedDraft = localStorage.getItem(`bnei_menashe_census_draft_${session.user.id}`);
      if (savedRecord) {
        try {
          const parsed = JSON.parse(savedRecord);
          if (parsed.id) setHouseholdId(parsed.id);
          setCensusStatus('verified');
        } catch (e) {
          setCensusStatus('verified');
        }
      } else if (savedDraft) {
        setCensusStatus('draft');
      }
    }
  }, [session]);

  const toggleTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const userName = profile?.full_name?.split(' ')[0] || profile?.hebrew_name || session?.user?.user_metadata?.full_name || 'Samuel';
  const familyLastName = profile?.full_name?.split(' ').slice(-1)[0] || 'Haokip';
  const regionalCouncilName = profile?.onboarding_location?.regional_council || 'Churachandpur';
  const synagogueName = profile?.onboarding_location?.synagogue || 'Beit Shalom';

  return (
    <div className="space-y-8 pb-28 text-slate-100 font-sans">
      {/* ====================================================
          SECTION 1 — PERSONAL GREETING
          ==================================================== */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0A1128] p-6 sm:p-8">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-amber-700/20 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Community Home</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">Bnei Menashe Council India</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Shalom, {userName}. Welcome back to your community.
            </h1>
            <p className="text-sm text-slate-300 font-light flex items-center gap-2">
              <span>Welcome back to your digital sanctuary and living community portal.</span>
            </p>
          </div>

          {/* Quick Weather & Location Badge */}
          <div className="flex items-center gap-3 self-start lg:self-center p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shrink-0">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
              <CloudSun className="w-6 h-6" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-white">26°C • Sunny & Clear</div>
              <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{locationName} • {regionalCouncilName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Capsule Row: Dates, Parashah, Zmanim */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/10">
          <div 
            onClick={() => onNavigate('calendar')}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 group-hover:scale-105 transition-transform">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300">Hebrew Date & Month</div>
              <div className="text-xs sm:text-sm font-bold text-white truncate">16th of Tamuz, 5786</div>
              <div className="text-[10px] font-serif text-slate-400 mt-0.5">Month of Tammuz • ט״ז בְּתַמּוּז</div>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('parashah')}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">Current Parashah</div>
              <div className="text-xs sm:text-sm font-bold text-white truncate">Parashat Pinchas</div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">Weekly Torah reading (Parashat HaShavua)</div>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('community')}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300">Current Community</div>
              <div className="text-xs sm:text-sm font-bold text-white truncate">{regionalCouncilName} Sector</div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">Bnei Menashe Council India</div>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('zmanim')}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:scale-105 transition-transform">
              <Sun className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">Today&apos;s Prayer Times</div>
              <div className="text-xs sm:text-sm font-bold text-white truncate">Mincha Gedolah • 12:15 PM</div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">Candle Lighting at 5:50 PM</div>
            </div>
          </div>
        </div>

        {/* Phase 1 Banner: Today's Community Reminder & Upcoming Event */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
          <div 
            onClick={() => onNavigate('community')}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-amber-600/10 border border-amber-500/30 hover:border-amber-400/50 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-xs">
                <div className="font-extrabold text-amber-300 uppercase text-[10px] tracking-wider">Upcoming Community Event</div>
                <div className="font-bold text-white truncate">Community Prayer & Hebrew Learning Evening</div>
                <div className="text-[11px] text-slate-300 truncate">This Thursday @ {synagogueName} Sanctuary</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
          </div>

          <div 
            onClick={() => onNavigate('census_demographics')}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/15 to-indigo-600/10 border border-blue-500/30 hover:border-blue-400/50 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-xs">
                <div className="font-extrabold text-blue-300 uppercase text-[10px] tracking-wider">Today&apos;s Community Reminder</div>
                <div className="font-bold text-white truncate">Verify Your Household Record for 5786</div>
                <div className="text-[11px] text-slate-300 truncate">Ensure all family members are properly listed</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-400 shrink-0" />
          </div>
        </div>
      </section>

      {/* Phase 8: Help Everywhere ("What is this?") */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-white space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>What is the Bnei Menashe Digital Platform?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Project Emunah is the official, secure digital platform for the Bnei Menashe community. Designed to keep our heritage alive, it connects families, synagogue leaders, and Regional Councils through integrated tools: a central Census registry, digital document indexes, family tree mappings, memorial board candle-lightings, and an interactive Halachic AI Rabbi.
        </p>
      </div>

      {/* "My Journey" (Derech Chaim) Dashboard Callout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-[#101b38] border border-amber-500/20 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Compass className="w-32 h-32 text-amber-400 rotate-12" />
        </div>
        <div className="flex items-center gap-4 z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
              <span>Derech Chaim • דֶּרֶךְ חַיִּים</span>
            </div>
            <h3 className="text-lg font-black tracking-tight text-white mt-1">
              Your Community Life Journey is Active
            </h3>
            <p className="text-xs text-slate-300 max-w-xl font-medium leading-relaxed">
              Track your footsteps from Birth, Hebrew Learning, and Synagogue Membership to Aliyah and Legacy. Experience a continuous life timeline that celebrates your milestones.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('my_journey')}
          className="w-full md:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-transform hover:scale-102 flex items-center justify-center gap-2 shadow-md shrink-0 z-10"
        >
          <span>Open My Journey</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* ====================================================
          SECTION 2 — MY COMMUNITY STATUS
          ==================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>My Community Status</span>
            </h2>
            <p className="text-xs text-slate-400 font-light">Official household registration, Aliyah verification, and community standing</p>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <span>Manage Community Identity</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Community */}
          <div 
            onClick={() => onNavigate('community')}
            className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between h-36 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Community</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Council
              </span>
            </div>
            <div>
              <div className="text-base font-black text-white leading-tight">Bnei Menashe Council India</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>Northeast India Jurisdiction</span>
              </div>
            </div>
          </div>

          {/* Card 2: Regional Council */}
          <div 
            onClick={() => onNavigate('regional_council')}
            className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between h-36 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Regional Council</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Verified District
              </span>
            </div>
            <div>
              <div className="text-base font-black text-white leading-tight line-clamp-1">{regionalCouncilName}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Award className="w-3 h-3 text-blue-400" />
                <span>Coordinated by Local Gabbaim</span>
              </div>
            </div>
          </div>

          {/* Card 3: Synagogue */}
          <div 
            onClick={() => onNavigate('sanctuary')}
            className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between h-36 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Synagogue</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Active Minyan
              </span>
            </div>
            <div>
              <div className="text-base font-black text-white leading-tight line-clamp-1">{synagogueName}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Landmark className="w-3 h-3 text-purple-400" />
                <span>Congregation Roster Seat #42</span>
              </div>
            </div>
          </div>

          {/* Card 4: Household ID */}
          <div 
            onClick={() => onNavigate('census_demographics')}
            className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between h-36 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Household ID</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                Sealed Record
              </span>
            </div>
            <div>
              <div className="text-base font-mono font-black text-amber-400 tracking-wider">{householdId}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Official Population Registry ID
              </div>
            </div>
          </div>

          {/* Card 5: Census Status */}
          <div 
            onClick={() => onNavigate('census_demographics')}
            className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between h-36 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Census Status</span>
              {censusStatus === 'verified' ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified & Sealed</span>
                </span>
              ) : censusStatus === 'draft' ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Active Draft
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Action Required
                </span>
              )}
            </div>
            <div>
              <div className="text-base font-black text-white leading-tight">
                {censusStatus === 'verified' ? '2026–2027 Census Submitted' : 'Registration In Progress'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {censusStatus === 'verified' ? 'Rabbinic review estimated 5–7 days' : 'Click to continue your family submission'}
              </div>
            </div>
          </div>

          {/* Card 6: Profile Completion */}
          <div 
            onClick={() => onNavigate('profile')}
            className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between h-36 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Profile Completion</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                95% Complete
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-base font-black text-white leading-tight">Identity Verified</div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400 w-[95%]"></div>
              </div>
            </div>
          </div>

          {/* Card 7: Aliyah Status */}
          <div 
            onClick={() => onNavigate('census_demographics')}
            className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between h-36 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Aliyah Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Eligible & Active
              </span>
            </div>
            <div>
              <div className="text-base font-black text-white leading-tight">Processing File #9104</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Rabbinic documentation verified
              </div>
            </div>
          </div>

          {/* Card 8: Membership Status */}
          <div 
            onClick={() => onNavigate('community')}
            className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between h-36 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Membership Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Good Standing
              </span>
            </div>
            <div>
              <div className="text-base font-black text-white leading-tight">Active Community Soul</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Full voting & welfare rights
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 3 — QUICK ACTIONS
          ==================================================== */}
      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Quick Actions</span>
          </h2>
          <p className="text-xs text-slate-400 font-light">Direct shortcuts to essential Bnei Menashe modules and community services</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Lifecycle Registry', section: 'lifecycle_registry', icon: <Award className="w-5 h-5 text-amber-400" /> },
            { label: 'Infrastructure Control', section: 'enterprise_sysadmin', icon: <Cpu className="w-5 h-5 text-amber-400 animate-pulse" /> },
            { label: 'Official Broadcasts', section: 'communications_center', icon: <Megaphone className="w-5 h-5 text-amber-400" /> },
            { label: 'Community Operations', section: 'operations_center', icon: <Radio className="w-5 h-5 text-amber-400 animate-pulse" /> },
            { label: 'Community Documents', section: 'document_center', icon: <FolderLock className="w-5 h-5 text-amber-400" /> },
            { label: 'Community Services', section: 'service_center', icon: <Building2 className="w-5 h-5 text-amber-400" /> },
            { label: 'Community Records & Activity', section: 'activity_center', icon: <Activity className="w-5 h-5 text-emerald-400 animate-pulse" /> },
            { label: 'Community Census', section: 'census_demographics', icon: <BarChart2 className="w-5 h-5 text-amber-400" /> },
            { label: 'Lineage & Heritage Tree', section: 'family', icon: <HeartHandshake className="w-5 h-5 text-rose-400" /> },
            { label: 'Memorial Sanctuary', section: 'memorial', icon: <Flame className="w-5 h-5 text-amber-500" /> },
            { label: "Zmanim & Local GPS", section: 'zmanim', icon: <Sun className="w-5 h-5 text-yellow-400" /> },
            { label: 'AI Rabbi Guidance', section: 'ai_rabbi', icon: <Bot className="w-5 h-5 text-amber-300" /> },
            { label: 'Hebrew Calendar 5786', section: 'calendar', icon: <CalendarIcon className="w-5 h-5 text-purple-400" /> },
            { label: 'Synagogues & Sanctuaries', section: 'sanctuary', icon: <Landmark className="w-5 h-5 text-emerald-400" /> },
            { label: 'Community Alerts', section: 'NOTIFICATIONS', icon: <Bell className="w-5 h-5 text-blue-400" /> }
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (action.section === 'NOTIFICATIONS') {
                  setShowNotificationsModal(true);
                } else {
                  onNavigate(action.section as NavSection);
                }
              }}
              className="p-4 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-amber-500/50 hover:bg-slate-800/80 shadow-lg transition-all flex flex-col items-center justify-center text-center group min-h-[110px]"
            >
              <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors mt-2.5 leading-snug">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ====================================================
          FEATURED BANNERS — ACTIVITY CENTER & DOCUMENT VAULT
          ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Banner 1: Activity Center */}
        <section 
          onClick={() => onNavigate('activity_center')}
          className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-[#0D1838] to-[#132247] p-6 border border-emerald-500/30 hover:border-emerald-400/60 shadow-2xl transition-all cursor-pointer group overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 group-hover:scale-110 transition-transform shadow-lg">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">Official Timeline</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">LIVE</span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors tracking-tight mt-1">
                Community Activity Center
              </h3>
              <p className="text-xs text-slate-300 font-light mt-1 line-clamp-2">
                Aggregating verified memorials, census updates, gabbai notices, and Torah study without social noise.
              </p>
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-xs text-slate-400 font-mono">10 Active Events</span>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all">
              <span>Open Timeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </section>

        {/* Banner 2: Document Center */}
        <section 
          onClick={() => onNavigate('document_center')}
          className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-[#1E170C] to-[#2B1F0E] p-6 border border-amber-500/30 hover:border-amber-400/60 shadow-2xl transition-all cursor-pointer group overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform shadow-lg">
              <FolderLock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Apple Wallet + Files</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold">VERIFIED VAULT</span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors tracking-tight mt-1">
                Digital Document Center
              </h3>
              <p className="text-xs text-slate-300 font-light mt-1 line-clamp-2">
                Store, organize, verify, and share your official Community Identity Passes, census seals, and Aliyah records securely.
              </p>
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-xs text-slate-400 font-mono">Encrypted • Offline Ready</span>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs transition-all shadow-md">
              <span>Open Vault</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </section>
      </div>

      {/* ====================================================
          SECTION 4 & SECTION 5 — TODAY & MY TASKS (TWO-COLUMN GRID)
          ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="kehillah-rhythms-tasks-container">
        {/* SECTION 4 — PROJECT KEHILLAH 365 RHYTHMS */}
        <section className="p-6 sm:p-7 rounded-3xl bg-slate-900/95 border border-white/10 shadow-2xl space-y-6 flex flex-col justify-between" id="kehillah-365-operating-system">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Kehillah 365 • Operating System</span>
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                  <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
                  <span>Living Community Rhythm</span>
                </h3>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-center px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono font-bold uppercase">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Live Feed Sync</span>
              </div>
            </div>

            {/* Apple-style Horizontal Tab Bar */}
            <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto scrollbar-none gap-1">
              {[
                { id: 'today', label: 'Today', icon: <Sun className="w-3.5 h-3.5" /> },
                { id: 'weekly', label: 'Weekly', icon: <CalendarIcon className="w-3.5 h-3.5" /> },
                { id: 'monthly', label: 'Monthly', icon: <Users className="w-3.5 h-3.5" /> },
                { id: 'yearly', label: 'Yearly', icon: <Award className="w-3.5 h-3.5" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRhythmTab(tab.id as 'today' | 'weekly' | 'monthly' | 'yearly')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
                    activeRhythmTab === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="space-y-4 text-xs">
              {activeRhythmTab === 'today' && (
                <div className="space-y-4 animate-fade-in" id="rhythm-today-container">
                  {/* Daily Personal Morning Briefing */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/25 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Daily Morning Briefing</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">17 Tammuz 5786</span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-white">Good morning, {userName}.</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        Today is <strong className="text-white">17 Tammuz 5786</strong> (Monday, July 6, 2026). Hashem has returned your soul with great faithfulness; let us serve the community today with joy.
                      </p>
                    </div>

                    <div className="border-t border-white/5 pt-2.5 space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider shrink-0 min-w-[75px] mt-0.5">Prayer:</span>
                        <p className="text-[11px] text-slate-300 italic">"Hashkiveinu Hashem... Lay us down in peace, and raise us up to life. Guard our going and coming for life and peace, now and forever."</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider shrink-0 min-w-[75px] mt-0.5">Torah Thought:</span>
                        <p className="text-[11px] text-slate-300">Pinchas teaches us the power of dedication. True zealotry is not anger—it is a pure, loving defense of the community’s covenant of peace.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider shrink-0 min-w-[75px] mt-0.5">Notices:</span>
                        <p className="text-[11px] text-rose-200 font-semibold">Shivah Asar B&apos;Tamuz fast commences tomorrow morning at dawn (3:48 AM).</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider shrink-0 min-w-[75px] mt-0.5">Shabbat Prep:</span>
                        <p className="text-[11px] text-slate-300">Shabbat Pinchas commences at 5:50 PM. Reach out to the Synagogue Gabbai if your home needs guest placement.</p>
                      </div>
                    </div>
                  </div>

                  {/* Today's Zmanim, Holidays, & Micro Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Today's Zmanim */}
                    <div onClick={() => onNavigate('zmanim')} className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Today&apos;s Zmanim</div>
                          <div className="text-[11px] font-bold text-white truncate">Mincha Gedolah • 12:15 PM</div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>

                    {/* Holiday Countdown */}
                    <div onClick={() => onNavigate('holidays')} className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 transition-all cursor-pointer flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[9px] uppercase font-bold text-amber-400 tracking-wider">Fast Day Countdown</div>
                          <div className="text-[11px] font-black text-white truncate">Shivah Asar B&apos;Tamuz tomorrow</div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                    </div>

                    {/* Today's Hebrew Word */}
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <GraduationCap className="w-4 h-4 text-purple-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Today&apos;s Hebrew Word</div>
                          <div className="text-[11px] font-bold text-white">Kehillah • קְהִלָּה</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">"Community"</span>
                    </div>

                    {/* Study Recommendation */}
                    <div onClick={() => onNavigate('ai_rabbi')} className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Bot className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Study Suggestion</div>
                          <div className="text-[11px] font-bold text-white truncate">Mishnah study with AI Rabbi</div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>

                    {/* Today's Yahrzeit */}
                    <div onClick={() => onNavigate('memorial')} className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Flame className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                        <div className="min-w-0">
                          <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Today&apos;s Yahrzeit</div>
                          <div className="text-[11px] font-bold text-rose-300 truncate">Elder Manmasi Singson (Zt&quot;l)</div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>

                    {/* Today's Birthday */}
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Gift className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Community Birthday</div>
                          <div className="text-[11px] font-bold text-white truncate">Miriam Lhungdim (16 yrs)</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-400 font-bold font-mono">Mazel Tov!</span>
                    </div>

                    {/* Today's Prayer Request */}
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2.5 sm:col-span-2">
                      <Heart className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Today&apos;s Prayer Request (Refuah Sheleimah)</div>
                        <div className="text-[11px] font-medium text-slate-200">Refuah Sheleimah for <strong className="text-white">Sarah bat Rachel</strong> recovering from illness.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeRhythmTab === 'weekly' && (
                <div className="space-y-3.5 animate-fade-in" id="rhythm-weekly-container">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-amber-400" />
                      <span>This Week in our Community</span>
                    </h4>
                    <p className="text-xs text-slate-300 font-light">
                      The weekly cycle coordinates our learning, memorials, and Chessed events around Shabbat Pinchas.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-white block">Parashah Study Goal</span>
                        <span className="text-slate-300 font-medium">Complete reading of Parashat Pinchas, focusing on the inheritance of the daughters of Zelophehad.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-white block">Community Fellowship Evening</span>
                        <span className="text-slate-300 font-medium">This Thursday at 7:00 PM: Join the Hebrew language and Psalms study circle at Beit Shalom.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-white block">Volunteer (Chessed) Duty</span>
                        <span className="text-slate-300 font-medium">Friday morning elderly visitation and food parcel delivery coordinated by the community services hub.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-white block">Upcoming Family Yahrzeit</span>
                        <span className="text-slate-300 font-medium">Grandfather Rabbi Yochanan Singson&apos;s anniversary occurs later this week. Perpetual candle-lighting is open.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeRhythmTab === 'monthly' && (
                <div className="space-y-3.5 animate-fade-in" id="rhythm-monthly-container">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>Monthly Community Celebrations</span>
                    </h4>
                    <p className="text-xs text-slate-300 font-light">
                      Reviewing community achievements, welcoming new families, and celebrating regional Aliyah milestones this month.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">New Families</div>
                      <div className="text-xs font-bold text-white">4 Families Welcomed</div>
                      <p className="text-[11px] text-slate-400 leading-normal">Registered in our Churachandpur regional council database this month.</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="text-[10px] font-extrabold uppercase text-rose-400 tracking-wider">Births & Marriages</div>
                      <div className="text-xs font-bold text-white">3 Births • 1 Marriage</div>
                      <p className="text-[11px] text-slate-400 leading-normal">Yosef & Esther Singson celebrated their wedding under the Chuppah.</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider">Aliyah Progress</div>
                      <div className="text-xs font-bold text-white">12 Aliyah Approvals</div>
                      <p className="text-[11px] text-slate-400 leading-normal">12 files finalized and verified for upcoming absorption schedules.</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Volunteer Spotlight</div>
                      <div className="text-xs font-bold text-white">David Lhungdim</div>
                      <p className="text-[11px] text-slate-400 leading-normal">Donated 25 hours of Hebrew study coaching to synagogue youth.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeRhythmTab === 'yearly' && (
                <div className="space-y-3.5 animate-fade-in" id="rhythm-yearly-container">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Annual Community Report • 5786</span>
                    </h4>
                    <p className="text-xs text-slate-300 font-light">
                      Official statistical breakdown of Bnei Menashe growth, Aliyah rates, and service metrics across all districts.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 text-center space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Verified Souls</div>
                      <div className="text-2xl font-black text-amber-400">1,482</div>
                      <p className="text-[9px] text-slate-500 font-medium">Across 312 registered households</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 text-center space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Aliyah Returns</div>
                      <div className="text-2xl font-black text-blue-400">86</div>
                      <p className="text-[9px] text-slate-500 font-medium">Returned permanently to Israel</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 text-center space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Chessed Service</div>
                      <div className="text-2xl font-black text-emerald-400">1,240 hrs</div>
                      <p className="text-[9px] text-slate-500 font-medium">Logged by community volunteers</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 text-center space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Academy Grads</div>
                      <div className="text-2xl font-black text-purple-400">112</div>
                      <p className="text-[9px] text-slate-500 font-medium">Finished Hebrew foundation studies</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COMMUNITY INTELLIGENCE BLOCK */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-amber-500" />
              <span>Community Intelligence Center</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-semibold text-slate-300">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/25 transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                <span>12 pending household registrations.</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/5 border border-rose-500/10 hover:border-rose-500/25 transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>5 memorial anniversaries this week.</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/25 transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>3 families have incomplete census.</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/25 transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Hebrew courses up 18% this month.</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — MY TASKS */}
        <section className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-5 flex flex-col justify-between" id="my-tasks-section">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">Community Duties</span>
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                  <span>My Tasks & Verification</span>
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                {Object.values(completedTasks).filter(Boolean).length}/5 Complete
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                {
                  id: 'household_reg',
                  title: 'Complete Household Registration',
                  desc: 'Sealed in 2026–2027 Population Registry',
                  badge: 'Completed',
                  section: 'census_demographics' as NavSection
                },
                {
                  id: 'upload_passport',
                  title: 'Upload Passport / Identity Document',
                  desc: 'Optional document attachment for Aliyah expediting',
                  badge: 'Optional',
                  section: 'census_demographics' as NavSection
                },
                {
                  id: 'verify_family',
                  title: 'Verify Family Members Roster',
                  desc: 'Confirm 5 household souls listed under your roof',
                  badge: '5 Souls Verified',
                  section: 'family' as NavSection
                },
                {
                  id: 'confirm_memorial',
                  title: 'Confirm Memorial Information',
                  desc: 'Ensure Yahrzeit dates for grandparents are active',
                  badge: '2 Memorials Saved',
                  section: 'memorial' as NavSection
                },
                {
                  id: 'review_notices',
                  title: 'Review Gabbai Notifications',
                  desc: 'Check recent regional council announcements',
                  badge: 'New Notices',
                  section: 'NOTIFICATIONS'
                }
              ].map((task) => {
                const isDone = completedTasks[task.id];
                return (
                  <div
                    key={task.id}
                    onClick={() => {
                      if (task.section === 'NOTIFICATIONS') {
                        setShowNotificationsModal(true);
                      } else {
                        onNavigate(task.section);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                        : 'bg-white/5 border-white/10 hover:border-amber-500/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => toggleTask(task.id, e)}
                        className="mt-0.5 shrink-0 text-amber-400 hover:scale-110 transition-transform"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500 hover:text-amber-400" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <div className={`font-bold truncate ${isDone ? 'line-through opacity-80' : 'text-white'}`}>
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{task.desc}</div>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold shrink-0 ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {task.badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ====================================================
          SECTION 6 & SECTION 7 — MY FAMILY & MY MEMORIALS
          ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 6 — MY FAMILY */}
        <section className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400">Ancestral Lineage</span>
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                  <HeartHandshake className="w-5 h-5 text-rose-400" />
                  <span>My Family Tree</span>
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                5 Souls Registered
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Family Name</span>
                <span className="font-extrabold text-white text-sm">{familyLastName} Household</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Family Lineage</span>
                <span className="font-bold text-amber-300">Tribe of Manasseh • Haokip / Singson</span>
              </div>

              {/* Family Tree Preview Row */}
              <div className="pt-2">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Generations Preview</div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {FAMILY_TREE_SAMPLE.slice(0, 4).map((member, i) => (
                    <div key={member.id} className="flex items-center gap-2 shrink-0">
                      <div className="p-2.5 rounded-xl bg-slate-800 border border-white/10 text-center min-w-[110px]">
                        <div className="text-[10px] font-bold text-amber-400 uppercase">Gen {member.generation}</div>
                        <div className="text-xs font-bold text-white truncate max-w-[95px]">{member.name.split(' ')[0]}</div>
                      </div>
                      {i < 3 && <span className="text-slate-600 font-bold">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Latest Activity:</strong> Lineage linked to historical tribal archives in Churachandpur & Jerusalem.</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('family')}
            className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/10 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <span>Open Full Family Tree</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>

        {/* SECTION 7 — MY MEMORIALS */}
        <section className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Virtual Sanctuary</span>
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>My Memorials (Yahrzeit)</span>
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Active</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Upcoming Yahrzeit</span>
                <span className="font-extrabold text-white">Elder Manmasi (Zt&quot;l) • 12th of Cheshvan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Grandfather&apos;s Memorial</span>
                <span className="font-bold text-slate-200">Rabbi Yochanan Singson • 5th of Tevet</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
                <span className="text-slate-400 font-medium">Saved Sanctuary Records</span>
                <span className="font-extrabold text-amber-400">3 Family Ancestors Tracked</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-rose-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">248 Perpetual Candles Lit</div>
                  <div className="text-[11px] text-slate-300">Shining across India & Israel synagogues</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('memorial')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Visit Memorial Sanctuary</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>
      </div>

      {/* ====================================================
          SECTION 8 — COMMUNITY NEWS
          ==================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <span>Community News & Announcements</span>
            </h2>
            <p className="text-xs text-slate-400 font-light">Official updates from your Regional Council, Synagogue Gabbaim, and Aliyah Desk</p>
          </div>
          <button
            onClick={() => onNavigate('community')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <span>View All News</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ANNOUNCEMENTS.map((ann, idx) => (
            <div
              key={ann.id || idx}
              onClick={() => onNavigate('community')}
              className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer shadow-xl flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {idx === 0 ? 'Regional Council' : idx === 1 ? 'Synagogue Notice' : 'Holiday Alert'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{ann.date}</span>
                </div>
                <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                  {ann.title}
                </h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-2">
                  {ann.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-white">{ann.synagogue || 'Bnei Menashe Council'}</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span>Read Notice</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}

          {/* Additional Holiday Reminder Card */}
          <div
            onClick={() => onNavigate('holidays')}
            className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 transition-all cursor-pointer shadow-xl flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Holiday Reminder
                </span>
                <span className="text-[11px] text-amber-300 font-bold">Dawn Fast Day</span>
              </div>
              <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                Shivah Asar B&apos;Tamuz Fast Guidelines & Zmanim Schedule
              </h4>
              <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-2">
                Fast commences at dawn (Alot Hashachar 3:48 AM) and concludes at nightfall (6:50 PM). Special Selichot and Torah readings in all regional congregations.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-white">Halachic Commission</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <span>View Fast Laws</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 9 — AI ASSISTANT
          ==================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Bot className="w-48 h-48 text-amber-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Personalized Community Intelligence</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Need Guidance or Support?</h3>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Our specialized AI assistants are trained on Bnei Menashe customs, Halachic laws, and 2026–2027 Census requirements to help your household 24/7.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 shrink-0">
            <button
              onClick={() => onNavigate('ai_rabbi')}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2.5 scale-105"
            >
              <Bot className="w-5 h-5" />
              <span>Ask AI Rabbi</span>
            </button>

            <button
              onClick={() => onNavigate('census_demographics')}
              className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Ask Census Assistant</span>
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 10 — FOOTER
          ==================================================== */}
      <footer className="pt-6 border-t border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Last Sync: Just now</span>
          </div>
          <div className="text-slate-300 font-mono font-bold">Platform Release: Version 1.0 Kehillah</div>
          <div className="flex items-center gap-1 text-slate-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Privacy Status: Strictly Protected</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('regional_council')}
            className="hover:text-white transition-colors underline"
          >
            Regional Council Support
          </button>
          <span className="text-slate-600">•</span>
          <button 
            onClick={() => onNavigate('sanctuary')}
            className="hover:text-white transition-colors underline"
          >
            Synagogue Gabbai Help Desk
          </button>
        </div>
      </footer>

      {/* ====================================================
          NOTIFICATIONS MODAL DRAWER
          ==================================================== */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">Official Community Notifications</h4>
                  <p className="text-xs text-slate-400">Notices and alerts for {userName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20">
              <div 
                onClick={() => { setShowNotificationsModal(false); onNavigate('census_demographics'); }}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-emerald-500/30 cursor-pointer space-y-1"
              >
                <div className="flex justify-between items-center text-xs font-bold text-emerald-400">
                  <span>✓ Census Submission Received</span>
                  <span>Today</span>
                </div>
                <p className="text-xs text-slate-300">Your household registration ID {householdId} is under official review by your local Gabbai.</p>
              </div>

              <div 
                onClick={() => { setShowNotificationsModal(false); onNavigate('holidays'); }}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-amber-500/30 cursor-pointer space-y-1"
              >
                <div className="flex justify-between items-center text-xs font-bold text-amber-400">
                  <span>💡 Fast Day Alert</span>
                  <span>Yesterday</span>
                </div>
                <p className="text-xs text-slate-300">Remember: Shivah Asar B&apos;Tamuz fast commences at 3:48 AM tomorrow morning.</p>
              </div>

              <div 
                onClick={() => { setShowNotificationsModal(false); onNavigate('community'); }}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer space-y-1"
              >
                <div className="flex justify-between items-center text-xs font-bold text-purple-400">
                  <span>🕍 Minyan Invitation</span>
                  <span>2 days ago</span>
                </div>
                <p className="text-xs text-slate-300">You are invited to the Rosh Chodesh Av prayer circle at Beit Shalom Synagogue.</p>
              </div>
            </div>

            <button
              onClick={() => setShowNotificationsModal(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg"
            >
              Close Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
