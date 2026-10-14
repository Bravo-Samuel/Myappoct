import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Flame, 
  Users, 
  FileText, 
  Shield, 
  Calendar, 
  BookOpen, 
  Award, 
  HeartHandshake, 
  Landmark, 
  Bot, 
  Sparkles, 
  Clock, 
  Lock, 
  Globe, 
  ChevronRight, 
  Filter, 
  Search, 
  CheckCircle2, 
  ArrowUpRight, 
  Info, 
  MapPin, 
  Bell, 
  Sun, 
  ShieldCheck,
  Eye,
  FileCheck,
  Building2,
  Share2,
  HelpCircle
} from 'lucide-react';
import { NavSection } from '../../types';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';

interface ActivityCenterViewProps {
  onNavigate?: (section: NavSection) => void;
}

export type ActivityFilter = 
  | 'all' 
  | 'my_activity' 
  | 'my_household' 
  | 'my_community' 
  | 'my_synagogue' 
  | 'regional_council' 
  | 'announcements' 
  | 'calendar' 
  | 'memorials';

interface CommunityActivityItem {
  id: string;
  dateGroup: 'Today' | 'Yesterday' | '3 Days Ago' | 'Earlier This Week' | 'Last Week';
  time: string;
  category: 'memorial' | 'census' | 'regional' | 'event' | 'torah' | 'volunteer' | 'family' | 'prayer' | 'synagogue' | 'ai_rabbi';
  iconEmoji: string;
  sourceModule: string;
  targetSection: NavSection;
  title: string;
  description: string;
  actionText: string;
  privacyLevel: 'Public Announcement' | 'Community Verified' | 'Synagogue Only' | 'Household Private';
  filterTags: ActivityFilter[];
  metadata?: {
    location?: string;
    person?: string;
    code?: string;
  };
}

export const ActivityCenterView: React.FC<ActivityCenterViewProps> = ({ onNavigate }) => {
  const { profile, session } = useSupabaseAuth();
  const [selectedFilter, setSelectedFilter] = useState<ActivityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivityDetail, setSelectedActivityDetail] = useState<CommunityActivityItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const userName = profile?.full_name || session?.user?.user_metadata?.full_name || 'Samuel Haokip';
  const householdName = 'Haokip Household (#BM-0842)';
  const synagogueName = profile?.onboarding_location?.synagogue || 'Beit Shalom';
  const regionalCouncil = profile?.onboarding_location?.regional_council || 'Churachandpur';

  // Comprehensive list of official platform activities aggregated across all modules
  const activities: CommunityActivityItem[] = useMemo(() => [
    {
      id: 'act-1',
      dateGroup: 'Today',
      time: '09:15',
      category: 'memorial',
      iconEmoji: '🕯',
      sourceModule: 'Memorial Board',
      targetSection: 'memorial',
      title: 'Perpetual Yahrzeit Candle Lit',
      description: 'A memorial candle was lit in the Beit Shalom Sanctuary for Elder David Haokip (Zt"l) on his 12th Yahrzeit anniversary.',
      actionText: 'View Memorial Sanctuary',
      privacyLevel: 'Community Verified',
      filterTags: ['all', 'my_community', 'my_synagogue', 'memorials'],
      metadata: { person: 'David Haokip (Zt"l)', location: 'Beit Shalom Synagogue' }
    },
    {
      id: 'act-2',
      dateGroup: 'Today',
      time: '08:30',
      category: 'synagogue',
      iconEmoji: '🕍',
      sourceModule: 'Beit Shalom Gabbaim',
      targetSection: 'sanctuary',
      title: 'Rosh Chodesh Av Minyan Quorum Confirmed',
      description: 'The morning Shacharit minyan reached 14 verified adult members. Torah reading of Parashat Pinchas completed.',
      actionText: 'View Shul Schedule',
      privacyLevel: 'Synagogue Only',
      filterTags: ['all', 'my_synagogue', 'my_community'],
      metadata: { location: 'Churachandpur Main Shul' }
    },
    {
      id: 'act-3',
      dateGroup: 'Today',
      time: '07:45',
      category: 'prayer',
      iconEmoji: '🙏',
      sourceModule: 'Prayer Requests',
      targetSection: 'sanctuary',
      title: 'Mishbeirach Prayer Registry Updated',
      description: 'A prayer request for Refuah Shleimah (complete recovery) was submitted by the Singson household for Sarah bat Leah.',
      actionText: 'View Prayer Roster',
      privacyLevel: 'Community Verified',
      filterTags: ['all', 'my_household', 'my_community'],
      metadata: { person: 'Sarah bat Leah' }
    },
    {
      id: 'act-4',
      dateGroup: 'Yesterday',
      time: '16:20',
      category: 'census',
      iconEmoji: '👨‍👩‍👧',
      sourceModule: 'Community Census Registry',
      targetSection: 'census_demographics',
      title: 'Household Demographics Officially Sealed',
      description: 'Your household registration (BM-2026-CHUR-0842) covering 5 souls under roof was verified and approved by the National Population Roster.',
      actionText: 'View Census Certificate',
      privacyLevel: 'Household Private',
      filterTags: ['all', 'my_activity', 'my_household'],
      metadata: { code: 'CERT-SEAL-0842' }
    },
    {
      id: 'act-5',
      dateGroup: 'Yesterday',
      time: '14:00',
      category: 'regional',
      iconEmoji: '🏛',
      sourceModule: 'Regional Council Portal',
      targetSection: 'regional_council',
      title: 'Official Shabbat & Holiday Bulletin Issued',
      description: 'Manipur & Mizoram Regional Council published updated community welfare grant guidelines and Aliyah document verification schedules.',
      actionText: 'Read Announcement',
      privacyLevel: 'Public Announcement',
      filterTags: ['all', 'regional_council', 'announcements'],
      metadata: { location: 'Regional Council HQ' }
    },
    {
      id: 'act-6',
      dateGroup: 'Yesterday',
      time: '11:10',
      category: 'event',
      iconEmoji: '📅',
      sourceModule: 'Community Calendar',
      targetSection: 'calendar',
      title: 'Tisha B\'Av Communal Preparation Schedule Published',
      description: 'Schedule for Kinot recitations, fast start zmanim (19:04 IST), and afternoon comfort sessions uploaded to offline calendar sync.',
      actionText: 'Open Halachic Calendar',
      privacyLevel: 'Public Announcement',
      filterTags: ['all', 'calendar', 'announcements', 'my_community'],
      metadata: { code: 'FAST-5786-AV' }
    },
    {
      id: 'act-7',
      dateGroup: '3 Days Ago',
      time: '15:40',
      category: 'volunteer',
      iconEmoji: '🤝',
      sourceModule: 'Volunteer Recognition Hub',
      targetSection: 'community',
      title: 'Gabbai Service Endorsement Awarded',
      description: 'Samuel Singson was formally recognized by Beit Shalom Synagogue for assisting 24 consecutive Shabbat minyan quorums and community kiddush setups.',
      actionText: 'View Service Certificate',
      privacyLevel: 'Community Verified',
      filterTags: ['all', 'my_activity', 'my_synagogue'],
      metadata: { person: 'Samuel Singson' }
    },
    {
      id: 'act-8',
      dateGroup: '3 Days Ago',
      time: '10:05',
      category: 'torah',
      iconEmoji: '📖',
      sourceModule: 'Torah Library & Daf Yomi',
      targetSection: 'torah_library',
      title: 'New Mizo & English Torah Lesson Available',
      description: 'Rabbi Shlomo Haokip published an in-depth audio and bilingual study guide on "Zealotry and Peace in Parashat Pinchas".',
      actionText: 'Listen & Study Lesson',
      privacyLevel: 'Public Announcement',
      filterTags: ['all', 'announcements', 'my_community'],
      metadata: { code: 'LESSON-PINCHAS-88' }
    },
    {
      id: 'act-9',
      dateGroup: 'Earlier This Week',
      time: '18:15',
      category: 'family',
      iconEmoji: '🎉',
      sourceModule: 'Ancestral Lineage Tree',
      targetSection: 'family',
      title: '4th Generation Ancestral Link Verified',
      description: 'Historical lineage connecting the Haokip family branch to the Bnei Menashe oral traditions of Shinlung was linked and cryptographically archived.',
      actionText: 'Open Family Tree',
      privacyLevel: 'Household Private',
      filterTags: ['all', 'my_activity', 'my_household'],
      metadata: { person: 'Haokip Family Lineage' }
    },
    {
      id: 'act-10',
      dateGroup: 'Last Week',
      time: '09:00',
      category: 'ai_rabbi',
      iconEmoji: '🤖',
      sourceModule: 'AI Rabbi Assistant',
      targetSection: 'ai_rabbi',
      title: 'Halachic Learning Milestone Achieved',
      description: 'You completed 10 interactive study inquiries on Shabbat candle lighting times and Eruv boundary guidelines.',
      actionText: 'Continue Halachic Study',
      privacyLevel: 'Household Private',
      filterTags: ['all', 'my_activity'],
      metadata: { code: 'STUDY-STREAK-10' }
    }
  ], []);

  const filterTabs: { id: ActivityFilter; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All Activity' },
    { id: 'my_activity', label: 'My Activity' },
    { id: 'my_household', label: 'My Household' },
    { id: 'my_community', label: 'My Community' },
    { id: 'my_synagogue', label: 'My Synagogue' },
    { id: 'regional_council', label: 'Regional Council' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'memorials', label: 'Memorials' }
  ];

  const filteredActivities = useMemo(() => {
    return activities.filter(item => {
      const matchesFilter = selectedFilter === 'all' || item.filterTags.includes(selectedFilter);
      const matchesSearch = searchQuery.trim() === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sourceModule.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activities, selectedFilter, searchQuery]);

  // Group filtered activities by Date Group
  const groupedTimeline = useMemo(() => {
    const groups: Record<string, CommunityActivityItem[]> = {};
    const order = ['Today', 'Yesterday', '3 Days Ago', 'Earlier This Week', 'Last Week'];
    
    order.forEach(g => {
      const items = filteredActivities.filter(a => a.dateGroup === g);
      if (items.length > 0) {
        groups[g] = items;
      }
    });
    return groups;
  }, [filteredActivities]);

  const getPrivacyBadge = (level: CommunityActivityItem['privacyLevel']) => {
    switch (level) {
      case 'Public Announcement':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
            <Globe className="w-3 h-3" />
            <span>Public Announcement</span>
          </span>
        );
      case 'Community Verified':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Community Verified</span>
          </span>
        );
      case 'Synagogue Only':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            <span>Synagogue Members</span>
          </span>
        );
      case 'Household Private':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Household Private</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 animate-fade-in text-slate-100 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500/95 text-slate-950 font-extrabold text-xs shadow-2xl flex items-center gap-3 backdrop-blur-md border border-white/20 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Activity Detail View */}
      {selectedActivityDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-start justify-between border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                  {selectedActivityDetail.iconEmoji}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                    {selectedActivityDetail.sourceModule}
                  </span>
                  <h3 className="text-lg font-black text-white leading-tight">
                    {selectedActivityDetail.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedActivityDetail(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 relative z-10 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm leading-relaxed text-slate-200">
                {selectedActivityDetail.description}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Timeline Record</span>
                  <span className="font-semibold text-white">{selectedActivityDetail.dateGroup} • {selectedActivityDetail.time} IST</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Privacy Standing</span>
                  <div className="mt-1">{getPrivacyBadge(selectedActivityDetail.privacyLevel)}</div>
                </div>
              </div>

              {selectedActivityDetail.metadata && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
                  <span>Official Record Reference:</span>
                  <span className="font-mono font-bold">
                    {selectedActivityDetail.metadata.code || selectedActivityDetail.metadata.person || selectedActivityDetail.metadata.location}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 relative z-10">
              <button
                onClick={() => {
                  showToast('Official timeline receipt shared securely.');
                  setSelectedActivityDetail(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Verification</span>
              </button>
              
              <button
                onClick={() => {
                  const target = selectedActivityDetail.targetSection;
                  setSelectedActivityDetail(null);
                  onNavigate?.(target);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2"
              >
                <span>{selectedActivityDetail.actionText}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          HEADER BANNER
          ==================================================== */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0A1128] via-slate-900 to-[#1e293b] p-6 sm:p-8 border border-amber-500/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Official Community Timeline</span>
              </span>
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Zero-Redundancy Aggregation</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Community Activity Center
            </h1>
            <p className="text-sm text-slate-300 font-light max-w-3xl leading-relaxed">
              Stay informed about important activities across your family, synagogue, regional council, and the wider Bnei Menashe community. Aggregating verified records with strict privacy adherence.
            </p>
          </div>

          {/* Core Governance Notice Card */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shrink-0 max-w-xs text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Official & Private</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Respects existing RBAC. Private activities are strictly visible only to authorized household members and designated gabbaim.
            </p>
          </div>
        </div>

        {/* Anti-Social Network Disclaimer Banner */}
        <div className="relative z-10 mt-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300">Not a Social Network:</strong> To preserve the sanctity and dignity of Bnei Menashe records, there are no likes, comments, followers, or public popularity metrics.
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-slate-950/60 font-mono text-[10px] text-slate-400 shrink-0 border border-white/5">
            10 Verified Events Active
          </span>
        </div>
      </div>

      {/* Phase 8: Help Everywhere ("What is this?") */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-white space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>What is the Community Activity Center?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Community Activity Center gives you a calm, organized summary of community assemblies, household milestones, synagogue announcements, and regional council notices. Unlike commercial social media, there are no likes, comments, or public follower counts—only respectful updates to help keep our community united and informed.
        </p>
      </div>

      {/* ====================================================
          QUICK ACTIONS BAR
          ==================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Direct Module Launchers</span>
          <span className="text-xs text-slate-400 font-medium">Quick Actions</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Light Candle', icon: <Flame className="w-4 h-4 text-amber-400" />, section: 'memorial' as NavSection, desc: 'Memorial Board' },
            { label: 'Register Prayer', icon: <Landmark className="w-4 h-4 text-emerald-400" />, section: 'sanctuary' as NavSection, desc: 'Mishbeirach Roster' },
            { label: 'Open Calendar', icon: <Calendar className="w-4 h-4 text-purple-400" />, section: 'calendar' as NavSection, desc: 'Zmanim & Fasts' },
            { label: 'Ask AI Rabbi', icon: <Bot className="w-4 h-4 text-amber-300" />, section: 'ai_rabbi' as NavSection, desc: 'Halachic Support' },
            { label: 'View Census', icon: <FileText className="w-4 h-4 text-blue-400" />, section: 'census_demographics' as NavSection, desc: 'Sealed Demographics' },
            { label: 'Open Family Tree', icon: <HeartHandshake className="w-4 h-4 text-rose-400" />, section: 'family' as NavSection, desc: 'Ancestral Lineage' }
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate?.(action.section)}
              className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-amber-500/40 transition-all text-left flex flex-col justify-between group h-24 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <span className="text-xs font-black text-white block group-hover:text-amber-300 transition-colors truncate">
                  {action.label}
                </span>
                <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                  {action.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ====================================================
          MAIN GRID: TIMELINE FEED & COMMUNITY HIGHLIGHTS
          ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: FILTER BAR & ACTIVITY TIMELINE */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Filters & Search Header */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Filter className="w-4 h-4 text-amber-400" />
                <span>Filter Activity By Scope:</span>
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search timeline activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Scrollable Pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                    selectedFilter === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TIMELINE FEED */}
          {Object.keys(groupedTimeline).length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
              <Activity className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-base font-bold text-white">No community activities match this filter</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try clearing your search query or selecting 'All Activity' to inspect the full chronological registry.
              </p>
              <button
                onClick={() => { setSelectedFilter('all'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedTimeline).map(([dateGroup, items]) => (
                <div key={dateGroup} className="space-y-4">
                  {/* Date Header Pill */}
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 rounded-full bg-slate-800/90 border border-white/10 text-xs font-black text-amber-400 uppercase tracking-wider shadow-sm">
                      {dateGroup}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent"></div>
                  </div>

                  {/* Cards inside this group */}
                  <div className="space-y-4 pl-2 sm:pl-4 border-l-2 border-amber-500/20">
                    {(items as CommunityActivityItem[]).map((act) => (
                      <div
                        key={act.id}
                        onClick={() => setSelectedActivityDetail(act)}
                        className="p-5 rounded-3xl bg-slate-900/85 hover:bg-slate-900 border border-white/10 hover:border-amber-500/40 transition-all shadow-xl cursor-pointer group relative overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            {/* Emoji Icon Badge */}
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform shadow-md">
                              {act.iconEmoji}
                            </div>

                            <div className="space-y-1.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                                  {act.sourceModule}
                                </span>
                                <span className="text-slate-600">•</span>
                                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{act.time} IST</span>
                                </span>
                              </div>

                              <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                                {act.title}
                              </h3>

                              <p className="text-xs text-slate-300 font-light leading-relaxed">
                                {act.description}
                              </p>
                            </div>
                          </div>

                          {/* Privacy Badge on right desktop */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                            {getPrivacyBadge(act.privacyLevel)}
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate?.(act.targetSection);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5 mt-2"
                            >
                              <span>{act.actionText}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: COMMUNITY HIGHLIGHTS PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Today's Highlights</span>
                <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Community Focus</span>
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono font-bold">
                5786
              </span>
            </div>

            <div className="space-y-4">
              {/* Highlight 1: Today's Yahrzeit */}
              <div 
                onClick={() => onNavigate?.('memorial')}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-amber-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Today's Yahrzeit</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">2 Souls</span>
                </div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  Elder Manmasi Haokip (Zt"l)
                </div>
                <p className="text-[11px] text-slate-400">
                  Perpetual candles lit in Beit Shalom Sanctuary. Recite Kaddish at Maariv.
                </p>
              </div>

              {/* Highlight 2: Today's Community Events */}
              <div 
                onClick={() => onNavigate?.('calendar')}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-purple-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>Today's Community Events</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">18:30 IST</span>
                </div>
                <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  Rosh Chodesh Av Gathering & Study
                </div>
                <p className="text-[11px] text-slate-400">
                  Beit Shalom Hall • Guest address by Regional Council leadership.
                </p>
              </div>

              {/* Highlight 3: Today's Prayer Times */}
              <div 
                onClick={() => onNavigate?.('zmanim')}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-emerald-400" />
                    <span>Today's Prayer Times</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300">Imphal GPS</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Shacharit</span>
                    <span className="font-mono font-bold text-white">06:15</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Mincha</span>
                    <span className="font-mono font-bold text-white">16:45</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Maariv</span>
                    <span className="font-mono font-bold text-white">18:20</span>
                  </div>
                </div>
              </div>

              {/* Highlight 4: Current Parashah */}
              <div 
                onClick={() => onNavigate?.('parashah')}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-blue-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span>Current Parashah</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Shabbat</span>
                </div>
                <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                  Parashat Pinchas (פִּינְחָס)
                </div>
                <p className="text-[11px] text-slate-400">
                  Numbers 25:10 – 30:1 • Mizo translation active in Torah Library.
                </p>
              </div>

              {/* Highlight 5: Upcoming Holidays */}
              <div 
                onClick={() => onNavigate?.('holidays')}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>Upcoming Holy Days</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">In 12 Days</span>
                </div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  Tisha B'Av (Fast of the Fifth Month)
                </div>
                <p className="text-[11px] text-slate-400">
                  Starts 9 Av at sunset. Full offline kinot booklet loaded.
                </p>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="pt-4 border-t border-white/10 text-center">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified by Bnei Menashe Council India</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
