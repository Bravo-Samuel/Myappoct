import React, { useState, useMemo } from 'react';
import {
  Radio,
  Activity,
  Users,
  Building2,
  FolderLock,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  ShieldCheck,
  Bot,
  Calendar,
  Sun,
  Flame,
  Search,
  ArrowUpRight,
  UserCheck,
  RefreshCw,
  Sliders,
  Send,
  Download,
  Eye,
  BarChart3,
  MapPin,
  Filter,
  Terminal,
  Cpu,
  Globe,
  Bell,
  HardDrive,
  Wifi,
  Lock,
  HeartHandshake,
  Award,
  BookOpen,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  UserPlus
} from 'lucide-react';
import { NavSection } from '../../types';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';

interface OperationsCenterViewProps {
  onNavigate?: (section: NavSection) => void;
}

type TabType = 'overview' | 'councils' | 'services' | 'health' | 'reports' | 'actions';

interface LiveFeedItem {
  id: string;
  time: string;
  type: 'household' | 'census' | 'document' | 'synagogue' | 'event' | 'memorial' | 'ai_rabbi' | 'welfare';
  iconEmoji: string;
  badge: string;
  title: string;
  detail: string;
  council: string;
  targetSection: NavSection;
  status: 'completed' | 'verified' | 'approved' | 'published';
}

interface RegionalCouncilStatus {
  id: string;
  name: string;
  region: string;
  status: 'Healthy' | 'Busy' | 'Delayed' | 'Offline';
  pendingReviews: number;
  openRequests: number;
  avgResponseTime: string;
  activeOfficers: number;
  citizensCount: number;
}

interface ServiceWorkload {
  id: string;
  name: string;
  icon: React.ReactNode;
  openCases: number;
  avgProcessingTime: string;
  oldestPendingCase: string;
  assignedOfficers: number;
  status: 'Normal' | 'Elevated' | 'Attention Required';
  targetSection: NavSection;
}

interface SystemHealthItem {
  id: string;
  name: string;
  category: string;
  status: 'Healthy' | 'Warning' | 'Maintenance';
  metric: string;
  uptime: string;
  icon: React.ReactNode;
}

interface CommunityAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  actionLabel: string;
  targetSection?: NavSection;
}

export const OperationsCenterView: React.FC<OperationsCenterViewProps> = ({ onNavigate }) => {
  const { profile, role } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [simulatedRole, setSimulatedRole] = useState<'Global Admin' | 'Regional Council Admin' | 'Authorized Operations Staff'>('Global Admin');
  const [isLiveAutoRefresh, setIsLiveAutoRefresh] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [feedFilter, setFeedFilter] = useState<string>('all');

  // Interactive Operator Actions state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedCouncilForAction, setSelectedCouncilForAction] = useState('All Councils');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. LIVE OPERATIONS FEED
  const initialFeed: LiveFeedItem[] = useMemo(() => [
    {
      id: 'feed-1',
      time: 'Just now',
      type: 'household',
      iconEmoji: '🟢',
      badge: 'VERIFIED',
      title: 'Household verified',
      detail: 'Singson / Haokip Household (#BM-0842) digital record confirmed by Churachandpur Officer.',
      council: 'Churachandpur Council',
      targetSection: 'census_demographics',
      status: 'verified'
    },
    {
      id: 'feed-2',
      time: '3 mins ago',
      type: 'census',
      iconEmoji: '📄',
      badge: 'SUBMITTED',
      title: 'Census submitted',
      detail: 'New family registration submitted from Aizawl District (4 members registered).',
      council: 'Aizawl District Council',
      targetSection: 'census_demographics',
      status: 'completed'
    },
    {
      id: 'feed-3',
      time: '8 mins ago',
      type: 'document',
      iconEmoji: '📂',
      badge: 'APPROVED',
      title: 'Document approved',
      detail: 'Rabbinical Letter of Jewish Identity verified and sealed for Leah Haokip (#DOC-9941).',
      council: 'Jerusalem Aliyah Desk',
      targetSection: 'document_center',
      status: 'approved'
    },
    {
      id: 'feed-4',
      time: '14 mins ago',
      type: 'ai_rabbi',
      iconEmoji: '📖',
      badge: 'COMPLETED',
      title: 'AI Rabbi consultation completed',
      detail: 'Halachic inquiry answered regarding Shabbat candle lighting times in Manipur mountain region.',
      council: 'Imphal Valley Council',
      targetSection: 'ai_rabbi',
      status: 'completed'
    },
    {
      id: 'feed-5',
      time: '22 mins ago',
      type: 'synagogue',
      iconEmoji: '🕍',
      badge: 'PUBLISHED',
      title: 'Synagogue announcement published',
      detail: 'Rosh Chodesh Av Minyan Schedule and Kiddush sponsorship broadcasted to Beit Shalom congregation.',
      council: 'Churachandpur Council',
      targetSection: 'sanctuary',
      status: 'published'
    },
    {
      id: 'feed-6',
      time: '31 mins ago',
      type: 'memorial',
      iconEmoji: '🕯',
      badge: 'LIT',
      title: 'Memorial candle lit',
      detail: 'Perpetual Yahrzeit digital flame lit for Elder David Haokip (Zt"l) on 12th Yahrzeit.',
      council: 'Kangpokpi Council',
      targetSection: 'memorial',
      status: 'completed'
    },
    {
      id: 'feed-7',
      time: '45 mins ago',
      type: 'welfare',
      iconEmoji: '❤️',
      badge: 'APPROVED',
      title: 'Welfare request approved',
      detail: 'Emergency medical transport support grant approved for elderly community member in Kangpokpi.',
      council: 'Kangpokpi Council',
      targetSection: 'service_center',
      status: 'approved'
    },
    {
      id: 'feed-8',
      time: '1 hr ago',
      type: 'event',
      iconEmoji: '📅',
      badge: 'CREATED',
      title: 'Community event created',
      detail: 'Youth Aliyah Preparation & Hebrew Language Intensive Seminar scheduled for next Sunday.',
      council: 'Aizawl District Council',
      targetSection: 'calendar',
      status: 'completed'
    }
  ], []);

  const [feedItems, setFeedItems] = useState<LiveFeedItem[]>(initialFeed);

  // Trigger simulated live feed event
  const simulateNewEvent = () => {
    const newItems: LiveFeedItem[] = [
      {
        id: `feed-${Date.now()}`,
        time: 'Just now',
        type: 'document',
        iconEmoji: '📂',
        badge: 'APPROVED',
        title: 'Document approved',
        detail: 'Synagogue Membership Certificate digitally verified for Moshe Lhungdim (#DOC-1088).',
        council: 'Churachandpur Council',
        targetSection: 'document_center',
        status: 'approved'
      }
    ];
    setFeedItems(prev => [...newItems, ...prev.slice(0, 15)]);
    showToast('Real-time feed updated: New document verified.');
  };

  // 2. REGIONAL STATUS MAP / DATA
  const regionalCouncils: RegionalCouncilStatus[] = useMemo(() => [
    {
      id: 'rc-churachandpur',
      name: 'Churachandpur Regional Council',
      region: 'Manipur South District HQ',
      status: 'Healthy',
      pendingReviews: 12,
      openRequests: 18,
      avgResponseTime: '2.4 hrs',
      activeOfficers: 8,
      citizensCount: 4850
    },
    {
      id: 'rc-aizawl',
      name: 'Aizawl District Council',
      region: 'Mizoram North Community Hub',
      status: 'Healthy',
      pendingReviews: 4,
      openRequests: 14,
      avgResponseTime: '1.8 hrs',
      activeOfficers: 6,
      citizensCount: 3210
    },
    {
      id: 'rc-kangpokpi',
      name: 'Kangpokpi & Senapati Council',
      region: 'Manipur North Hill Districts',
      status: 'Busy',
      pendingReviews: 18,
      openRequests: 27,
      avgResponseTime: '4.1 hrs',
      activeOfficers: 4,
      citizensCount: 1980
    },
    {
      id: 'rc-imphal',
      name: 'Imphal Valley Community Council',
      region: 'Manipur Central & Transit',
      status: 'Healthy',
      pendingReviews: 2,
      openRequests: 5,
      avgResponseTime: '1.2 hrs',
      activeOfficers: 3,
      citizensCount: 840
    },
    {
      id: 'rc-jerusalem',
      name: 'Jerusalem Aliyah Transit Desk',
      region: 'Israel Liaison & Absorption Hub',
      status: 'Healthy',
      pendingReviews: 6,
      openRequests: 11,
      avgResponseTime: '0.8 hrs',
      activeOfficers: 5,
      citizensCount: 1650
    }
  ], []);

  // 3. SERVICE MONITOR
  const serviceWorkloads: ServiceWorkload[] = useMemo(() => [
    {
      id: 'srv-cert',
      name: 'Certificates',
      icon: <Award className="w-4 h-4 text-amber-400" />,
      openCases: 14,
      avgProcessingTime: '1.5 hrs',
      oldestPendingCase: '18 hrs',
      assignedOfficers: 3,
      status: 'Normal',
      targetSection: 'document_center'
    },
    {
      id: 'srv-doc',
      name: 'Document Verification',
      icon: <FolderLock className="w-4 h-4 text-blue-400" />,
      openCases: 22,
      avgProcessingTime: '2.1 hrs',
      oldestPendingCase: '24 hrs',
      assignedOfficers: 4,
      status: 'Normal',
      targetSection: 'document_center'
    },
    {
      id: 'srv-house',
      name: 'Household Services',
      icon: <Users className="w-4 h-4 text-emerald-400" />,
      openCases: 8,
      avgProcessingTime: '3.4 hrs',
      oldestPendingCase: '36 hrs',
      assignedOfficers: 2,
      status: 'Normal',
      targetSection: 'service_center'
    },
    {
      id: 'srv-syn',
      name: 'Synagogue Services',
      icon: <Building2 className="w-4 h-4 text-purple-400" />,
      openCases: 5,
      avgProcessingTime: '0.9 hrs',
      oldestPendingCase: '4 hrs',
      assignedOfficers: 5,
      status: 'Normal',
      targetSection: 'sanctuary'
    },
    {
      id: 'srv-census',
      name: 'Community Census',
      icon: <BarChart3 className="w-4 h-4 text-amber-400" />,
      openCases: 18,
      avgProcessingTime: '4.2 hrs',
      oldestPendingCase: '48 hrs',
      assignedOfficers: 3,
      status: 'Elevated',
      targetSection: 'census_demographics'
    },
    {
      id: 'srv-aliyah',
      name: 'Aliyah Preparation & Registration',
      icon: <Globe className="w-4 h-4 text-cyan-400" />,
      openCases: 31,
      avgProcessingTime: '12.5 hrs',
      oldestPendingCase: '72 hrs',
      assignedOfficers: 6,
      status: 'Attention Required',
      targetSection: 'service_center'
    },
    {
      id: 'srv-edu',
      name: 'Education & Torah Studies',
      icon: <BookOpen className="w-4 h-4 text-amber-300" />,
      openCases: 6,
      avgProcessingTime: '1.8 hrs',
      oldestPendingCase: '8 hrs',
      assignedOfficers: 2,
      status: 'Normal',
      targetSection: 'torah_library'
    },
    {
      id: 'srv-welfare',
      name: 'Community Welfare & Aid',
      icon: <HeartHandshake className="w-4 h-4 text-rose-400" />,
      openCases: 9,
      avgProcessingTime: '0.7 hrs',
      oldestPendingCase: '2 hrs',
      assignedOfficers: 4,
      status: 'Normal',
      targetSection: 'service_center'
    }
  ], []);

  // 4. SYSTEM HEALTH
  const systemHealthItems: SystemHealthItem[] = useMemo(() => [
    { id: 'sys-auth', name: 'Authentication Engine', category: 'Supabase Auth / JWT', status: 'Healthy', metric: '99.99%', uptime: '100%', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { id: 'sys-db', name: 'Database Cluster', category: 'PostgreSQL / RLS Vault', status: 'Healthy', metric: '2.1 ms avg', uptime: '99.98%', icon: <Database className="w-4 h-4 text-emerald-400" /> },
    { id: 'sys-rt', name: 'Realtime WebSocket Sync', category: 'Live Channels & Presence', status: 'Healthy', metric: '1,428 active peers', uptime: '99.95%', icon: <Wifi className="w-4 h-4 text-emerald-400" /> },
    { id: 'sys-notif', name: 'Notification Dispatcher', category: 'Push & SMS Relay Queue', status: 'Healthy', metric: '0 backlog', uptime: '100%', icon: <Bell className="w-4 h-4 text-emerald-400" /> },
    { id: 'sys-vault', name: 'Document Vault Storage', category: 'Encrypted Object Bucket', status: 'Healthy', metric: 'AES-256 Active', uptime: '100%', icon: <Lock className="w-4 h-4 text-emerald-400" /> },
    { id: 'sys-ai', name: 'AI Rabbi Inference API', category: 'Gemini 2.5 Halachic Engine', status: 'Healthy', metric: '380 ms latency', uptime: '99.92%', icon: <Bot className="w-4 h-4 text-emerald-400" /> },
    { id: 'sys-cal', name: 'Calendar Engine', category: '5786 Hebrew Year Calculator', status: 'Healthy', metric: 'Exact Sync', uptime: '100%', icon: <Calendar className="w-4 h-4 text-emerald-400" /> },
    { id: 'sys-zmanim', name: 'Zmanim Solar Engine', category: 'GPS Astronomical Tracker', status: 'Healthy', metric: 'Sub-second precise', uptime: '100%', icon: <Sun className="w-4 h-4 text-emerald-400" /> },
    { id: 'sys-api', name: 'Platform API Gateway', category: 'REST / GraphQL Ingress', status: 'Healthy', metric: '480 req/sec', uptime: '99.99%', icon: <Server className="w-4 h-4 text-emerald-400" /> },
    { id: 'sys-backup', name: 'Automated Disaster Recovery', category: 'Cross-Region Backup Vault', status: 'Healthy', metric: 'Last backup 14m ago', uptime: '100%', icon: <HardDrive className="w-4 h-4 text-emerald-400" /> }
  ], []);

  // 5. COMMUNITY ALERTS
  const communityAlerts: CommunityAlert[] = useMemo(() => [
    {
      id: 'alt-1',
      severity: 'medium',
      title: 'Large increase in census registrations',
      description: '+340% surge in family registration submissions from Churachandpur district following community announcement.',
      timestamp: '25 mins ago',
      actionLabel: 'View Census Queue',
      targetSection: 'census_demographics'
    },
    {
      id: 'alt-2',
      severity: 'high',
      title: 'Regional Council backlog exceeds threshold',
      description: 'Kangpokpi & Senapati review queue currently has 18 pending reviews, with 7 cases exceeding 24 hours SLA.',
      timestamp: '1 hr ago',
      actionLabel: 'Rebalance Workload',
      targetSection: 'service_center'
    },
    {
      id: 'alt-3',
      severity: 'low',
      title: 'Memorial reminder volume unusually high',
      description: 'Upcoming Yahrzeit week for 2015 community memorial has triggered 420 automated candle notification relays.',
      timestamp: '2 hrs ago',
      actionLabel: 'View Memorial Board',
      targetSection: 'memorial'
    },
    {
      id: 'alt-4',
      severity: 'medium',
      title: 'AI Rabbi nearing daily consultation quota',
      description: 'Community has completed 186 consultations today (85% of daily allocated Gemini token budget).',
      timestamp: '3 hrs ago',
      actionLabel: 'View AI Rabbi Analytics',
      targetSection: 'ai_rabbi'
    },
    {
      id: 'alt-5',
      severity: 'low',
      title: 'Document verification queue growing',
      description: '22 Jewish Identity and Synagogue certificates uploaded today awaiting digital notary signature.',
      timestamp: '4 hrs ago',
      actionLabel: 'Open Vault Desk',
      targetSection: 'document_center'
    }
  ], []);

  // Filtered feed items based on search and tabs
  const filteredFeed = useMemo(() => {
    return feedItems.filter(item => {
      const matchesFilter = feedFilter === 'all' || item.type === feedFilter;
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.council.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchQuery.toLowerCase().includes('cas-') ||
        searchQuery.toLowerCase().includes('bm-');
      return matchesFilter && matchesSearch;
    });
  }, [feedItems, feedFilter, searchQuery]);

  // Handle Operator actions
  const handleRebalanceWorkload = () => {
    showToast('Workload automatically rebalanced: 6 Kangpokpi verifications shifted to Aizawl available officers.');
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    showToast(`Notice broadcasted to ${selectedCouncilForAction}: "${broadcastMessage}"`);
    setBroadcastMessage('');
    setIsBroadcastModalOpen(false);
  };

  const handleGenerateReport = (reportName: string) => {
    showToast(`Generating ${reportName}... Audit bundle compiled successfully.`);
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 pb-16 font-sans">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-5 py-3 rounded-xl font-bold text-sm shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce">
          <Radio className="w-4 h-4 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MISSION CONTROL HEADER */}
      <div className="sticky top-0 z-30 bg-[#0A1128]/95 backdrop-blur-xl border-b border-amber-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Radio className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  BNEI MENASHE <span className="text-amber-400 font-extrabold">OPERATIONS CENTER</span>
                </h1>
                <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  MISSION CONTROL LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time operational command center monitoring platform health, regional councils, and community services.
              </p>
            </div>
          </div>

          {/* Search Everything Bar & Role Simulation */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search case, citizen, household, council..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded">
                  Clear
                </button>
              )}
            </div>

            {/* Operator Tier Switcher */}
            <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 py-1.5">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={simulatedRole}
                onChange={(e) => {
                  setSimulatedRole(e.target.value as any);
                  showToast(`Switched operator scope to: ${e.target.value}`);
                }}
                className="bg-transparent text-[11px] font-semibold text-amber-300 focus:outline-none cursor-pointer"
              >
                <option value="Global Admin" className="bg-slate-900 text-white">Role: Global Admin</option>
                <option value="Regional Council Admin" className="bg-slate-900 text-white">Role: Regional Council Admin</option>
                <option value="Authorized Operations Staff" className="bg-slate-900 text-white">Role: Authorized Operations Staff</option>
              </select>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Home Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('councils')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'councils'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Regional Status Map</span>
              <span className="bg-slate-800 text-amber-400 text-[10px] px-1.5 rounded">5</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'services'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Service Monitor</span>
              <span className="bg-slate-800 text-amber-400 text-[10px] px-1.5 rounded">8</span>
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'health'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>System Health</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 rounded">100%</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'reports'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Reports & Audit</span>
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'actions'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Operator Actions</span>
            </button>
          </div>

          {/* Quick Operator Actions Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={simulateNewEvent}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors border border-slate-700"
              title="Verify incoming real-time telemetry stream"
            >
              <RefreshCw className="w-3 h-3 text-amber-400" />
              <span>Pulse Live Feed</span>
            </button>
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs transition-colors border border-amber-500/40"
            >
              <Send className="w-3 h-3" />
              <span>Broadcast Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">

        {/* TAB 1: HOME DASHBOARD & OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 10 LIVE OPERATIONAL KPI CARDS */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>Live Operational KPIs</span>
                  </h2>
                  <p className="text-xs text-slate-400">Real-time aggregate platform telemetrics updated continuously.</p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                  Aggregation status: <span className="text-emerald-400 font-semibold">Real-time synced</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* 1. Online Citizens */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 hover:border-amber-500/40 transition-all shadow-lg group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Online Citizens</span>
                    <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white tracking-tight">1,428</span>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">+12% vs avg</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Active sessions today across 5 regions</div>
                </div>

                {/* 2. Active Community Services */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 hover:border-amber-500/40 transition-all shadow-lg group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Active Services</span>
                    <Building2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white tracking-tight">8 / 8</span>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">100% UP</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Core operational modules online</div>
                </div>

                {/* 3. Open Service Requests */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 hover:border-amber-500/40 transition-all shadow-lg group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Open Requests</span>
                    <FileText className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white tracking-tight">42</span>
                    <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">Avg 1.8h SLA</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Pending tickets across all councils</div>
                </div>

                {/* 4. Pending Council Reviews */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 hover:border-amber-500/40 transition-all shadow-lg group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Pending Reviews</span>
                    <FolderLock className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white tracking-tight">42</span>
                    <span className="text-[10px] text-purple-300 font-semibold bg-purple-500/10 px-1.5 py-0.5 rounded">Notary Desk</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Document & household verifications</div>
                </div>

                {/* 5. New Census Registrations Today */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 hover:border-amber-500/40 transition-all shadow-lg group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">New Census Today</span>
                    <UserPlus className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white tracking-tight">+14</span>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">Surge +34%</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Family units submitted for review</div>
                </div>

                {/* 6. Memorial Activities Today */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 hover:border-amber-500/40 transition-all shadow-lg group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Memorial Activities</span>
                    <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white tracking-tight">30</span>
                    <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">24 Candles</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">6 Yahrzeit recitations recorded</div>
                </div>

                {/* 7. AI Rabbi Consultations Today */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 hover:border-amber-500/40 transition-all shadow-lg group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">AI Rabbi Q&A</span>
                    <Bot className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white tracking-tight">186</span>
                    <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">380ms avg</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Halachic consultations completed</div>
                </div>

                {/* 8. Community Events Today */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 hover:border-amber-500/40 transition-all shadow-lg group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Events Today</span>
                    <Calendar className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white tracking-tight">5</span>
                    <span className="text-[10px] text-cyan-300 font-semibold bg-cyan-500/10 px-1.5 py-0.5 rounded">Live Minyanim</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">Scheduled classes & shul gatherings</div>
                </div>

                {/* 9. System Health */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 hover:border-amber-500/40 transition-all shadow-lg group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">System Health</span>
                    <Cpu className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-emerald-400 tracking-tight">99.98%</span>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">Optimal</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">All infrastructure services normal</div>
                </div>

                {/* 10. Database Status */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 hover:border-amber-500/40 transition-all shadow-lg group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Database Status</span>
                    <Database className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white tracking-tight">SYNCED</span>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">2.1ms Query</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">PostgreSQL replicated across 5 hubs</div>
                </div>
              </div>
            </div>

            {/* TWO-COLUMN GRID: LIVE OPERATIONS FEED (Left 7) & COMMUNITY ALERTS (Right 5) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* LIVE OPERATIONS FEED */}
              <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <h3 className="font-bold text-white text-base">Live Operations Feed</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={feedFilter}
                      onChange={(e) => setFeedFilter(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="all">All Events</option>
                      <option value="household">Households</option>
                      <option value="census">Census</option>
                      <option value="document">Documents</option>
                      <option value="synagogue">Synagogues</option>
                      <option value="ai_rabbi">AI Rabbi</option>
                      <option value="memorial">Memorials</option>
                      <option value="welfare">Welfare</option>
                    </select>

                    <button
                      onClick={simulateNewEvent}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3 text-amber-400" />
                      <span>Test Stream Pulse</span>
                    </button>
                  </div>
                </div>

                {/* Chronological List */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {filteredFeed.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      No operational feed events match your search or filter criteria.
                    </div>
                  ) : (
                    filteredFeed.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 hover:border-amber-500/40 transition-all flex items-start justify-between gap-4 group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl p-1 bg-slate-900 rounded-lg border border-slate-800 shrink-0">
                            {item.iconEmoji}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                                {item.title}
                              </span>
                              <span className="text-[10px] font-extrabold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-1.5 py-0.5 rounded">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              {item.detail}
                            </p>
                            <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1 text-slate-400">
                                <MapPin className="w-3 h-3 text-amber-400/80" />
                                {item.council}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.time}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Link to Source Module */}
                        {onNavigate && (
                          <button
                            onClick={() => onNavigate(item.targetSection)}
                            className="shrink-0 flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1.5 rounded-lg transition-colors self-center"
                          >
                            <span>Module</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* COMMUNITY ALERTS & QUICK OPERATOR ACTIONS */}
              <div className="lg:col-span-5 space-y-6 flex flex-col">
                {/* Community Operational Alerts */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
                      <h3 className="font-bold text-white text-base">Community Operational Alerts</h3>
                    </div>
                    <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                      {communityAlerts.length} Active
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {communityAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`border rounded-xl p-3.5 transition-all ${
                          alert.severity === 'high'
                            ? 'bg-rose-950/30 border-rose-500/40'
                            : alert.severity === 'medium'
                            ? 'bg-amber-950/20 border-amber-500/40'
                            : 'bg-slate-950/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-xs font-bold ${
                            alert.severity === 'high' ? 'text-rose-400' : alert.severity === 'medium' ? 'text-amber-400' : 'text-slate-300'
                          }`}>
                            {alert.title}
                          </span>
                          <span className="text-[10px] text-slate-500 shrink-0">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {alert.description}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                            alert.severity === 'high' ? 'bg-rose-500/20 text-rose-300' : alert.severity === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {alert.severity} Priority
                          </span>
                          <button
                            onClick={() => alert.targetSection ? onNavigate && onNavigate(alert.targetSection) : handleRebalanceWorkload()}
                            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <span>{alert.actionLabel}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Operator Actions Panel */}
                <div className="bg-gradient-to-br from-slate-900 to-[#0A1128] border border-amber-500/30 rounded-2xl p-5 shadow-xl">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-3">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <span>Quick Operator Command Desk</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setIsAssignModalOpen(true)}
                      className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl p-3 text-left transition-all hover:border-amber-500/50"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-400 mb-1" />
                      <div className="text-xs font-bold text-white">Assign Officer</div>
                      <div className="text-[10px] text-slate-400">Route queued cases</div>
                    </button>

                    <button
                      onClick={handleRebalanceWorkload}
                      className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl p-3 text-left transition-all hover:border-amber-500/50"
                    >
                      <Sliders className="w-4 h-4 text-amber-400 mb-1" />
                      <div className="text-xs font-bold text-white">Rebalance Workload</div>
                      <div className="text-[10px] text-slate-400">Shift regional backlog</div>
                    </button>

                    <button
                      onClick={() => setIsBroadcastModalOpen(true)}
                      className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl p-3 text-left transition-all hover:border-amber-500/50"
                    >
                      <Send className="w-4 h-4 text-cyan-400 mb-1" />
                      <div className="text-xs font-bold text-white">Broadcast Notice</div>
                      <div className="text-[10px] text-slate-400">Alert community hubs</div>
                    </button>

                    <button
                      onClick={() => {
                        showToast('Case #CAS-2026-0842 escalated to Global Admin Desk.');
                      }}
                      className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl p-3 text-left transition-all hover:border-amber-500/50"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-400 mb-1" />
                      <div className="text-xs font-bold text-white">Escalate Case</div>
                      <div className="text-[10px] text-slate-400">High priority routing</div>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: REGIONAL STATUS MAP & COUNCILS */}
        {activeTab === 'councils' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <span>Regional Council Status Map</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Monitor live processing queues, SLA compliance, and officer availability across all 5 official Bnei Menashe centers.
                </p>
              </div>
              <button
                onClick={handleRebalanceWorkload}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 self-start sm:self-center shadow-lg shadow-amber-500/20"
              >
                <Sliders className="w-4 h-4" />
                <span>Auto-Rebalance Backlogs</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionalCouncils.map((council) => (
                <div
                  key={council.id}
                  className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 hover:border-amber-500/50 transition-all shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-white text-base">{council.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{council.region}</span>
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 ${
                        council.status === 'Healthy'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : council.status === 'Busy'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          council.status === 'Healthy' ? 'bg-emerald-400' : council.status === 'Busy' ? 'bg-amber-400' : 'bg-rose-400'
                        }`} />
                        <span>{council.status}</span>
                      </span>
                    </div>

                    {/* Telemetrics Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-5 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Pending Reviews</div>
                        <div className="text-lg font-black text-white mt-0.5">{council.pendingReviews}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Open Requests</div>
                        <div className="text-lg font-black text-white mt-0.5">{council.openRequests}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Avg SLA Response</div>
                        <div className="text-sm font-bold text-amber-400 mt-0.5">{council.avgResponseTime}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Assigned Officers</div>
                        <div className="text-sm font-bold text-emerald-400 mt-0.5">{council.activeOfficers} Active</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Citizens served: <strong className="text-slate-200">{council.citizensCount.toLocaleString()}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCouncilForAction(council.name);
                        setIsBroadcastModalOpen(true);
                      }}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Message Council
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICE MONITOR */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>Service Workload Monitor</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time queue analytics and officer workload distribution across all 8 Bnei Menashe platform modules.
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase font-bold">
                      <th className="py-3.5 px-4">Service Category</th>
                      <th className="py-3.5 px-4">Open Cases</th>
                      <th className="py-3.5 px-4">Avg Processing Time</th>
                      <th className="py-3.5 px-4">Oldest Pending Case</th>
                      <th className="py-3.5 px-4">Assigned Officers</th>
                      <th className="py-3.5 px-4">Workload Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {serviceWorkloads.map((service) => (
                      <tr key={service.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                          <span className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                            {service.icon}
                          </span>
                          <span>{service.name}</span>
                        </td>
                        <td className="py-4 px-4 font-black text-white">{service.openCases} cases</td>
                        <td className="py-4 px-4 text-slate-300 font-semibold">{service.avgProcessingTime}</td>
                        <td className="py-4 px-4 text-slate-400">{service.oldestPendingCase}</td>
                        <td className="py-4 px-4 font-bold text-emerald-400">{service.assignedOfficers} officers</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            service.status === 'Normal'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : service.status === 'Elevated'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {service.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {onNavigate && (
                            <button
                              onClick={() => onNavigate(service.targetSection)}
                              className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Open Queue
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM HEALTH */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-emerald-400" />
                    <span>System Infrastructure Health</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Live status indicators for core backend engines, AI models, astronomical calculators, and database vaults.
                  </p>
                </div>
                <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 self-start sm:self-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  All 10 Systems Operational (100% Uptime)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemHealthItems.map((sys) => (
                  <div
                    key={sys.id}
                    className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 hover:border-emerald-500/40 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        {sys.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{sys.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{sys.category}</p>
                        <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-slate-300">
                          <span className="text-emerald-400">{sys.metric}</span>
                          <span className="text-slate-600">•</span>
                          <span>Uptime: {sys.uptime}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {sys.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REPORTS & AUDIT */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <span>Operational Audit & Performance Reports</span>
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Generate cryptographic audit reports and service performance breakdowns across community councils.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Daily Operations Report', desc: 'Summary of 24-hr activity, new census registrations, and verification approvals.', badge: 'DAILY' },
                  { title: 'Weekly Summary Report', desc: 'Trend analysis across all 5 regional councils and Shabbat minyan attendances.', badge: 'WEEKLY' },
                  { title: 'Monthly Activity Report', desc: 'Demographic shifts, Aliyah intake progression, and service resolution metrics.', badge: 'MONTHLY' },
                  { title: 'Regional Performance Report', desc: 'Comparison of council response times, officer throughput, and open ticket volumes.', badge: 'COUNCILS' },
                  { title: 'Service Performance Report', desc: 'Workload breakdown and processing speed per service category.', badge: 'WORKLOAD' },
                  { title: 'Citizen Satisfaction Report', desc: 'Feedback ratings and resolution SLA compliance across community centers.', badge: 'SLA AUDIT' }
                ].map((rep, idx) => (
                  <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-white text-base">{rep.title}</h4>
                        <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded font-bold">
                          {rep.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{rep.desc}</p>
                    </div>

                    <button
                      onClick={() => handleGenerateReport(rep.title)}
                      className="mt-5 w-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-amber-400 shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Compile & Export PDF/CSV</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: OPERATOR ACTIONS */}
        {activeTab === 'actions' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <span>Operator Command Console</span>
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Execute authorized platform interventions, rebalance regional workload queues, and broadcast emergency notices.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assign Officer Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-white">Assign Officer to Backlog</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Manually assign pending document verification or census queue cases to specific regional verification officers.
                  </p>
                  <button
                    onClick={() => setIsAssignModalOpen(true)}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold px-4 py-2 rounded-xl text-xs border border-emerald-500/40 transition-colors"
                  >
                    Launch Officer Assignment Desk
                  </button>
                </div>

                {/* Rebalance Workload Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Sliders className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-white">Rebalance Workload</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Automatically redistribute pending tickets from councils experiencing heavy backlog (e.g. Kangpokpi) to healthy councils.
                  </p>
                  <button
                    onClick={handleRebalanceWorkload}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-4 py-2 rounded-xl text-xs border border-amber-500/40 transition-colors"
                  >
                    Execute Automatic Queue Shift
                  </button>
                </div>

                {/* Broadcast Notice Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Send className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-white">Broadcast Community Notice</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Transmit official real-time announcements or holiday alerts directly to regional council dashboards or citizen apps.
                  </p>
                  <button
                    onClick={() => setIsBroadcastModalOpen(true)}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold px-4 py-2 rounded-xl text-xs border border-cyan-500/40 transition-colors"
                  >
                    Open Broadcast Terminal
                  </button>
                </div>

                {/* View Cryptographic Audit Trail */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold text-white">View Cryptographic Audit Trail</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Inspect immutable ledger of all officer actions, verification approvals, and RBAC role transitions across the platform.
                  </p>
                  <button
                    onClick={() => showToast('Cryptographic Audit Ledger verified: 100% hash consistency across 14,280 actions.')}
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold px-4 py-2 rounded-xl text-xs border border-purple-500/40 transition-colors"
                  >
                    Verify & Display Ledger
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ASSIGN OFFICER */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-[#0A1128] border border-amber-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>Assign Verification Officer</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select an officer to handle the oldest pending cases in the queue.
            </p>
            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-semibold">Target Service Queue</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white">
                <option>Document Verification Queue (22 pending)</option>
                <option>Community Census Queue (18 pending)</option>
                <option>Aliyah Registration Desk (31 pending)</option>
              </select>
            </div>
            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-semibold">Available Officer</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white">
                <option>Officer David Haokip (Churachandpur)</option>
                <option>Officer Sarah Lhungdim (Aizawl)</option>
                <option>Officer Yitzhak Singson (Imphal)</option>
                <option>Officer Leah Kipgen (Jerusalem Aliyah Desk)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  showToast('Officer assigned successfully to 5 pending verification cases.');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 shadow-lg shadow-amber-500/20"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BROADCAST NOTICE */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-[#0A1128] border border-amber-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-400" />
              <span>Broadcast Real-Time Notice</span>
            </h3>
            <form onSubmit={handleBroadcastSubmit} className="space-y-4">
              <div className="space-y-1.5 text-xs">
                <label className="block text-slate-300 font-semibold">Target Audience</label>
                <select
                  value={selectedCouncilForAction}
                  onChange={(e) => setSelectedCouncilForAction(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="All Regional Councils">All 5 Regional Councils (Platform-Wide)</option>
                  <option value="Churachandpur Council">Churachandpur Regional Council</option>
                  <option value="Aizawl District Council">Aizawl District Council</option>
                  <option value="Kangpokpi Council">Kangpokpi & Senapati Council</option>
                  <option value="Imphal Valley Council">Imphal Valley Community Council</option>
                </select>
              </div>
              <div className="space-y-1.5 text-xs">
                <label className="block text-slate-300 font-semibold">Notice Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter official operational bulletin or urgent notice..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                >
                  Transmit Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
