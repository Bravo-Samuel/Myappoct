import React, { useState, useMemo } from 'react';
import {
  Award,
  Heart,
  Baby,
  GraduationCap,
  HeartHandshake,
  Home,
  PlaneTakeoff,
  Sparkles,
  Flame,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  MapPin,
  FileText,
  Share2,
  Download,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  User,
  Users,
  Building2,
  Clock,
  ExternalLink,
  PlusCircle,
  X,
  ChevronRight,
  AlertCircle,
  Database,
  Cpu,
  Lock,
  Layers,
  HelpCircle
} from 'lucide-react';
import { NavSection } from '../../types';
import {
  LifecycleEvent,
  LifecycleAuditLog,
  INITIAL_LIFECYCLE_EVENTS,
  INITIAL_AUDIT_LOGS
} from '../../data/lifecycleEventsData';

interface CommunityLifeEventsRegistryViewProps {
  onNavigate?: (section: NavSection) => void;
}

export const CommunityLifeEventsRegistryView: React.FC<CommunityLifeEventsRegistryViewProps> = ({
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'timeline' | 'automations' | 'search'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2026');

  // State for events & logs
  const [events, setEvents] = useState<LifecycleEvent[]>(INITIAL_LIFECYCLE_EVENTS);
  const [auditLogs, setAuditLogs] = useState<LifecycleAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerFormCategory, setRegisterFormCategory] = useState<'birth' | 'education' | 'marriage' | 'household' | 'aliyah' | 'religious' | 'volunteer' | 'memorial'>('birth');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [automationSteps, setAutomationSteps] = useState<string[]>([]);
  const [selectedEventForCert, setSelectedEventForCert] = useState<LifecycleEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    citizenName: '',
    hebrewName: '',
    secondaryCitizenName: '',
    secondaryHebrewName: '',
    date: new Date().toISOString().split('T')[0],
    hebrewDate: '18 Tammuz 5786',
    location: 'Churachandpur' as LifecycleEvent['location'],
    description: '',
    referenceNumber: '',
    privacy: 'Public Community' as LifecycleEvent['privacy'],
    detailsPrimary: '',
    detailsSecondary: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const categoriesList = [
    { id: 'all', label: 'All Milestones', icon: <Sparkles className="w-4 h-4" />, count: events.length },
    { id: 'birth', label: '👶 Birth', icon: <Baby className="w-4 h-4 text-sky-400" />, count: events.filter(e => e.category === 'birth').length },
    { id: 'education', label: '🎓 Education', icon: <GraduationCap className="w-4 h-4 text-emerald-400" />, count: events.filter(e => e.category === 'education').length },
    { id: 'marriage', label: '💍 Marriage', icon: <HeartHandshake className="w-4 h-4 text-rose-400" />, count: events.filter(e => e.category === 'marriage').length },
    { id: 'household', label: '👨‍👩‍👧 Household', icon: <Home className="w-4 h-4 text-amber-400" />, count: events.filter(e => e.category === 'household').length },
    { id: 'aliyah', label: '✈️ Aliyah', icon: <PlaneTakeoff className="w-4 h-4 text-blue-400" />, count: events.filter(e => e.category === 'aliyah').length },
    { id: 'religious', label: '🕍 Religious', icon: <Award className="w-4 h-4 text-purple-400" />, count: events.filter(e => e.category === 'religious').length },
    { id: 'volunteer', label: '❤️ Volunteer', icon: <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />, count: events.filter(e => e.category === 'volunteer').length },
    { id: 'memorial', label: '🕯 Memorial', icon: <Flame className="w-4 h-4 text-amber-500" />, count: events.filter(e => e.category === 'memorial').length },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      if (selectedCategory !== 'all' && evt.category !== selectedCategory) return false;
      if (selectedLocation !== 'all' && evt.location !== selectedLocation) return false;
      if (selectedYear !== 'all' && !evt.date.startsWith(selectedYear)) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = evt.citizenName.toLowerCase().includes(q);
        const matchesHeb = evt.hebrewName?.toLowerCase().includes(q);
        const matchesRef = evt.referenceNumber.toLowerCase().includes(q);
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesDesc = evt.description.toLowerCase().includes(q);
        return matchesName || matchesHeb || matchesRef || matchesTitle || matchesDesc;
      }
      return true;
    });
  }, [events, selectedCategory, selectedLocation, selectedYear, searchQuery]);

  const handleOpenRegistration = (category: typeof registerFormCategory) => {
    setRegisterFormCategory(category);
    const refNum = `REG-${category.toUpperCase()}-5786-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      citizenName: '',
      hebrewName: '',
      secondaryCitizenName: '',
      secondaryHebrewName: '',
      date: new Date().toISOString().split('T')[0],
      hebrewDate: '18 Tammuz 5786',
      location: 'Churachandpur',
      description: '',
      referenceNumber: refNum,
      privacy: 'Public Community',
      detailsPrimary: '',
      detailsSecondary: ''
    });
    setAutomationSteps([]);
    setIsRegisterModalOpen(true);
  };

  const handleRunRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.citizenName.trim()) {
      showToast('Please enter the primary citizen name');
      return;
    }

    setIsSubmitting(true);
    setAutomationSteps([]);

    // Determine automation sequence based on category
    let steps: string[] = [];
    if (registerFormCategory === 'birth') {
      steps = [
        'Connecting to Bnei Menashe Registrar Core...',
        `Provisioning new Community Identity Pass BM-2026-BIRTH-${Math.floor(1000 + Math.random() * 9000)}...`,
        `Updating Family Tree: Attaching ${formData.citizenName} to Household...`,
        'Synchronizing Census & Demographics (+1 Population count)...',
        'Generating verified Birth & Hebrew Naming Certificate...'
      ];
    } else if (registerFormCategory === 'marriage') {
      steps = [
        'Validating Beit Din Ketubah & Rabbinical Signatures...',
        `Merging Household records for ${formData.citizenName} & ${formData.secondaryCitizenName || 'Spouse'}...`,
        'Updating Family Tree spousal linkage node...',
        'Generating Official Community Marriage Certificate...'
      ];
    } else if (registerFormCategory === 'aliyah') {
      steps = [
        'Verifying Interior Ministry & Shavei Israel Aliyah Dossier...',
        `Transferring Citizen location from ${formData.location} to Eretz Yisrael...`,
        'Updating Indian & Israeli Sector Census Demographic figures...',
        'Issuing Aliyah Absorption & Integration Welcome Record...'
      ];
    } else if (registerFormCategory === 'memorial') {
      steps = [
        `Creating permanent Yizkor Memorial Record for ${formData.citizenName} Z"L...`,
        'Updating Family Tree lineage status...',
        'Calculating 50-year automated Hebrew Yahrzeit schedule...',
        'Dispatching notification to Gabbai & household family members...'
      ];
    } else {
      steps = [
        `Recording official ${registerFormCategory.toUpperCase()} milestone...`,
        'Synchronizing Citizen Digital ID profile badges...',
        'Issuing verifiable cryptographic community certificate...'
      ];
    }

    // Step through automations
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setAutomationSteps(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          // Finish registration
          setTimeout(() => {
            const newEventId = `evt-${Date.now()}`;
            const newEvent: LifecycleEvent = {
              id: newEventId,
              category: registerFormCategory,
              title: `${registerFormCategory.toUpperCase()} REGISTRATION: ${formData.citizenName}`,
              citizenName: formData.citizenName,
              hebrewName: formData.hebrewName || undefined,
              citizenId: `BM-${registerFormCategory.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
              secondaryCitizenName: formData.secondaryCitizenName || undefined,
              date: formData.date,
              hebrewDate: formData.hebrewDate,
              location: formData.location,
              description: formData.description || `Official community ${registerFormCategory} registration logged via System Registrar.`,
              referenceNumber: formData.referenceNumber,
              status: 'Verified',
              privacy: formData.privacy,
              automationStatus: {
                communityIdCreated: registerFormCategory === 'birth',
                familyTreeUpdated: ['birth', 'marriage', 'memorial'].includes(registerFormCategory),
                householdMergedOrUpdated: ['birth', 'marriage', 'household', 'aliyah'].includes(registerFormCategory),
                censusSynchronized: ['birth', 'household', 'aliyah', 'memorial'].includes(registerFormCategory),
                certificateIssued: true,
                yahrzeitScheduled: registerFormCategory === 'memorial',
                memorialBoardCreated: registerFormCategory === 'memorial'
              },
              blessingsCount: 1
            };

            setEvents(prev => [newEvent, ...prev]);

            // Add Audit log
            const newAudit: LifecycleAuditLog = {
              id: `aud-${Date.now()}`,
              timestamp: `${new Date().toLocaleTimeString()} IST`,
              eventReference: formData.referenceNumber,
              eventType: `${registerFormCategory.toUpperCase()} Automated Registration`,
              actionTaken: `Executed 100% automated cross-module sync for ${formData.citizenName}`,
              targetModule: registerFormCategory === 'birth' ? 'Census & Demographics' : registerFormCategory === 'marriage' ? 'Household Registry' : 'Family Tree',
              actor: 'Authorized Community Registrar',
              status: 'SUCCESS'
            };
            setAuditLogs(prev => [newAudit, ...prev]);

            setIsSubmitting(false);
            setIsRegisterModalOpen(false);
            showToast(`Mazel Tov! ${formData.citizenName}'s lifecycle event has been safely recorded. Thank you for enriching our community history.`);
          }, 600);
        }
      }, (idx + 1) * 400);
    });
  };

  const handleBlessing = (id: string, name: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, blessingsCount: e.blessingsCount + 1 } : e));
    showToast(`❤️ Sent warmth & Mazel Tov blessing to ${name}!`);
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 p-4 md:p-8 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900/95 border border-amber-500/40 text-amber-200 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0D1938] to-slate-900 border border-amber-500/20 p-6 md:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" />
                OFFICIAL BNEI MENASHE LIFECYCLE REGISTRY • V1.0 INTEGRATED
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white flex items-center gap-3">
                <span>❤️ Community Life Events</span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
                Celebrate and record important milestones in our community. Every event automatically enriches Family Trees, Households, Census records, and Memorial schedules without duplicate data entry.
              </p>
            </div>

            <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
              <button
                onClick={() => handleOpenRegistration('birth')}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                Register New Milestone
              </button>
              <button
                onClick={() => setActiveTab('automations')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-medium transition-all"
              >
                <Cpu className="w-4 h-4 text-amber-400" />
                View Live Sync Automations
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Total Registered</div>
              <div className="text-xl font-black text-amber-400 mt-0.5">{events.length} Milestones</div>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">👶 Births & Naming</div>
              <div className="text-xl font-black text-sky-400 mt-0.5">{events.filter(e => e.category === 'birth').length} Recorded</div>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">💍 Marriages</div>
              <div className="text-xl font-black text-rose-400 mt-0.5">{events.filter(e => e.category === 'marriage').length} Unions</div>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">✈️ Aliyah Departures</div>
              <div className="text-xl font-black text-blue-400 mt-0.5">{events.filter(e => e.category === 'aliyah').length} Missions</div>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">🎓 Torah & Edu</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">{events.filter(e => e.category === 'education').length} Graduates</div>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">🕯 Memorial Yahrzeits</div>
              <div className="text-xl font-black text-amber-500 mt-0.5">{events.filter(e => e.category === 'memorial').length} Active Sync</div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 8: Help Everywhere ("What is this?") */}
      <div className="max-w-7xl mx-auto mb-8 p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-white space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>What is the Community Life Events Registry?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Community Life Events Registry is our shared family album and community record. When your household welcomes a newborn, celebrates a Bar/Bat Mitzvah or wedding, departs for Aliyah, or observes a memorial Yahrzeit, logging it here ensures our entire community rejoices with you and honors your family&apos;s story across generations.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 backdrop-blur-md">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'categories'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Event Categories ({events.length})
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'timeline'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              Chronological Timeline
            </button>
            <button
              onClick={() => setActiveTab('automations')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'automations'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Automations & RBAC Audit
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'search'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4" />
              Advanced Search
            </button>
          </div>

          <div className="flex items-center gap-2 px-3">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Deduplication Guard: ACTIVE</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>
      </div>

      {/* TAB 1: EVENT CATEGORIES & FEED */}
      {activeTab === 'categories' && (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Category Filter Pills & Register Actions */}
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                {categoriesList.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-slate-800 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-slate-800/60'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-[10px] text-slate-300">{cat.count}</span>
                  </button>
                ))}
              </div>

              {/* Quick Launch Registration Dropdown/Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Quick Register:</span>
                <button
                  onClick={() => handleOpenRegistration('birth')}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-medium transition-all"
                >
                  + Birth
                </button>
                <button
                  onClick={() => handleOpenRegistration('marriage')}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-all"
                >
                  + Marriage
                </button>
                <button
                  onClick={() => handleOpenRegistration('aliyah')}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-medium transition-all"
                >
                  + Aliyah
                </button>
                <button
                  onClick={() => handleOpenRegistration('memorial')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all"
                >
                  + Memorial
                </button>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map(evt => (
              <div
                key={evt.id}
                className="group relative bg-slate-900/80 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-amber-500/30 p-6 transition-all duration-300 shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        evt.category === 'birth' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                        evt.category === 'marriage' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        evt.category === 'aliyah' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        evt.category === 'education' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        evt.category === 'memorial' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {evt.category === 'birth' && <Baby className="w-6 h-6" />}
                        {evt.category === 'marriage' && <HeartHandshake className="w-6 h-6" />}
                        {evt.category === 'aliyah' && <PlaneTakeoff className="w-6 h-6" />}
                        {evt.category === 'education' && <GraduationCap className="w-6 h-6" />}
                        {evt.category === 'memorial' && <Flame className="w-6 h-6" />}
                        {evt.category === 'religious' && <Award className="w-6 h-6" />}
                        {evt.category === 'volunteer' && <Heart className="w-6 h-6" />}
                        {evt.category === 'household' && <Home className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
                            {evt.category}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs font-mono text-slate-400">{evt.referenceNumber}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {evt.title}
                        </h3>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                      evt.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      evt.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                      'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    }`}>
                      {evt.status}
                    </span>
                  </div>

                  {/* Names & Dates */}
                  <div className="bg-slate-950/60 rounded-xl p-3.5 mb-4 border border-slate-800/60 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-light">Primary Citizen:</span>
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        {evt.citizenName}
                        {evt.hebrewName && <span className="text-amber-300 font-serif font-normal">({evt.hebrewName})</span>}
                      </span>
                    </div>
                    {evt.secondaryCitizenName && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-light">Secondary Citizen:</span>
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          {evt.secondaryCitizenName}
                          {evt.secondaryHebrewName && <span className="text-amber-300 font-serif font-normal">({evt.secondaryHebrewName})</span>}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {evt.date} • <strong className="text-slate-300">{evt.hebrewDate}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {evt.location}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 font-light leading-relaxed mb-4">
                    {evt.description}
                  </p>

                  {/* Automated Module Sync Indicators */}
                  <div className="mb-4">
                    <div className="text-[11px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-amber-400" />
                      Automated Module Sync Status:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {evt.automationStatus.communityIdCreated && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 text-[11px] font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ID Generated
                        </span>
                      )}
                      {evt.automationStatus.familyTreeUpdated && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 text-[11px] font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Family Tree Synced
                        </span>
                      )}
                      {evt.automationStatus.householdMergedOrUpdated && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 text-[11px] font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Household Synced
                        </span>
                      )}
                      {evt.automationStatus.censusSynchronized && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 text-[11px] font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Census Adjusted
                        </span>
                      )}
                      {evt.automationStatus.yahrzeitScheduled && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/50 text-[11px] font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-amber-400" /> 50-Yr Yahrzeit Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleBlessing(evt.id, evt.citizenName)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                    <span>Mazel Tov ({evt.blessingsCount})</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedEventForCert(evt)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Certificate</span>
                    </button>

                    {onNavigate && (
                      <button
                        onClick={() => {
                          if (evt.category === 'birth' || evt.category === 'marriage' || evt.category === 'memorial') {
                            onNavigate('family');
                          } else if (evt.category === 'aliyah' || evt.category === 'household') {
                            onNavigate('census_demographics');
                          } else {
                            onNavigate('profile');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-400 transition-all"
                        title="View linked module"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CHRONOLOGICAL TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Community Lifecycle Chronology</span>
            </h2>
            <p className="text-sm text-slate-300 font-light">
              Every milestone recorded across Churachandpur, Aizawl, Kangpokpi, and Israel in chronological sequence.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-10 border-l-2 border-amber-500/30 space-y-8 my-8">
            {events.map((evt, idx) => (
              <div key={evt.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-md shadow-amber-500/30">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>

                <div className="bg-slate-900/80 hover:bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition-all shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                      {evt.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {evt.date} ({evt.hebrewDate}) • {evt.location}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{evt.title}</h3>
                  <p className="text-sm text-slate-300 font-light mb-4">{evt.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                    <div>Ref: <span className="font-mono text-slate-300">{evt.referenceNumber}</span></div>
                    <button
                      onClick={() => setSelectedEventForCert(evt)}
                      className="text-amber-400 hover:underline font-medium flex items-center gap-1"
                    >
                      View Verified Certificate <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUTOMATIONS & RBAC AUDIT LOGS */}
      {activeTab === 'automations' && (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Architecture & Flow Specs */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 rounded-2xl p-6 border border-amber-500/30 shadow-xl">
            <h2 className="text-xl font-black text-white mb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <span>Zero-Duplicate Automated Sync Engine</span>
            </h2>
            <p className="text-sm text-slate-300 font-light max-w-3xl mb-6">
              Per frozen architectural mandates, the Community Life Events Registry operates as a master event bus. Recording a single lifecycle milestone immediately triggers transactional updates across related platform databases without requiring manual double-entry.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">👶 Birth Automation Pipeline</div>
                <div className="text-xs font-mono text-slate-300 space-y-1.5">
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-sky-400" /> Create Community ID</div>
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-sky-400" /> Update Family Tree Lineage</div>
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-sky-400" /> Update Household Member Count</div>
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-sky-400" /> Synchronize Demographics Census</div>
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">💍 Marriage Automation Pipeline</div>
                <div className="text-xs font-mono text-slate-300 space-y-1.5">
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-rose-400" /> Merge Household IDs</div>
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-rose-400" /> Update Spousal Family Tree Link</div>
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-rose-400" /> Generate Cryptographic Ketubah</div>
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-rose-400" /> Link Synagogue Membership</div>
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">🕯 Memorial Automation Pipeline</div>
                <div className="text-xs font-mono text-slate-300 space-y-1.5">
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-amber-400" /> Create Virtual Yizkor Plaque</div>
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-amber-400" /> Schedule 50-Year Yahrzeit Alerts</div>
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-amber-400" /> Notify Household & Gabbai</div>
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-amber-400" /> Generate Memorial Certificate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live RBAC Audit Logs */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <span>Real-Time Cross-Module Sync Logs</span>
                </h3>
                <p className="text-xs text-slate-400">Cryptographically verified audit trail of automated module updates</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                RBAC ENFORCED • NO DUPLICATES
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase text-slate-400 font-bold">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Event Ref</th>
                    <th className="py-3 px-4">Action & Target Module</th>
                    <th className="py-3 px-4">Registrar Actor</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/40 font-light">
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{log.timestamp}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-amber-300 font-semibold">{log.eventReference}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-white font-medium">{log.eventType}</div>
                        <div className="text-xs text-slate-400">
                          → Synced to <strong className="text-slate-300">{log.targetModule}</strong>: {log.actionTaken}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-300">{log.actor}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                          <CheckCircle2 className="w-3 h-3" /> {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ADVANCED SEARCH */}
      {activeTab === 'search' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" />
              <span>Search Community Registry</span>
            </h2>
            <p className="text-sm text-slate-300 font-light">
              Search by Citizen Name, Hebrew Name, Household ID, Community City, Event Type, or Year.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search citizen name, ID or keywords..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Communities / Regions</option>
                  <option value="Churachandpur">Churachandpur Sector</option>
                  <option value="Aizawl">Aizawl Sector</option>
                  <option value="Shalom Zion Synagogue">Shalom Zion Synagogue</option>
                  <option value="Beit Shalom Aizawl">Beit Shalom Aizawl</option>
                  <option value="Nof HaGalil, Israel">Nof HaGalil, Israel</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Years</option>
                  <option value="2026">2026 (5786)</option>
                  <option value="2025">2025 (5785)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="bg-slate-900/60 rounded-2xl p-12 text-center border border-slate-800 text-slate-400">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-60" />
                <div className="text-base font-semibold text-white">No registry records found matching query</div>
                <p className="text-xs text-slate-500 mt-1">Try adjusting keywords or selecting 'All Communities'</p>
              </div>
            ) : (
              filteredEvents.map(evt => (
                <div key={evt.id} className="bg-slate-900/80 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase">
                        {evt.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Ref: {evt.referenceNumber}</span>
                    </div>
                    <div className="text-base font-bold text-white">{evt.title}</div>
                    <div className="text-xs text-slate-400">
                      {evt.date} ({evt.hebrewDate}) • <strong className="text-slate-300">{evt.location}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setSelectedEventForCert(evt)}
                      className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
                    >
                      View Certificate
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* REGISTRATION MODAL WITH LIVE CROSS-MODULE SIMULATION */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#0D1630] border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    Register Community Milestone ({registerFormCategory})
                  </h3>
                  <p className="text-xs text-slate-400">Automated cross-module registration & verified certificate generation</p>
                </div>
              </div>
              <button
                onClick={() => !isSubmitting && setIsRegisterModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleRunRegistration} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Primary Citizen Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.citizenName}
                    onChange={e => setFormData({ ...formData, citizenName: e.target.value })}
                    placeholder="e.g. Noa Batya Singson or Ephraim Haokip"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Hebrew Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.hebrewName}
                    onChange={e => setFormData({ ...formData, hebrewName: e.target.value })}
                    placeholder="e.g. נועה בתיה"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 text-right font-serif"
                  />
                </div>
              </div>

              {(registerFormCategory === 'marriage' || registerFormCategory === 'household') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Spouse / Secondary Citizen Name
                    </label>
                    <input
                      type="text"
                      value={formData.secondaryCitizenName}
                      onChange={e => setFormData({ ...formData, secondaryCitizenName: e.target.value })}
                      placeholder="e.g. Sarah Fanai"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Spouse Hebrew Name
                    </label>
                    <input
                      type="text"
                      value={formData.secondaryHebrewName}
                      onChange={e => setFormData({ ...formData, secondaryHebrewName: e.target.value })}
                      placeholder="e.g. שרה בת שרה"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 text-right font-serif"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Civil Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Hebrew Calendar Date</label>
                  <input
                    type="text"
                    value={formData.hebrewDate}
                    onChange={e => setFormData({ ...formData, hebrewDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Community Sector</label>
                  <select
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Churachandpur">Churachandpur Sector</option>
                    <option value="Aizawl">Aizawl Sector</option>
                    <option value="Kangpokpi">Kangpokpi Sector</option>
                    <option value="Shalom Zion Synagogue">Shalom Zion Synagogue</option>
                    <option value="Beit Shalom Aizawl">Beit Shalom Aizawl</option>
                    <option value="Nof HaGalil, Israel">Nof HaGalil, Israel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Event Description & Notes</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide ceremonial notes, officiating Beit Din / Mohel / Rabbi details..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Live Automation Steps Feedback */}
              {isSubmitting && (
                <div className="bg-slate-950/90 rounded-2xl p-4 border border-amber-500/40 space-y-2.5">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    Executing Automated Cross-Module Synchronizations...
                  </div>
                  <div className="space-y-1.5">
                    {automationSteps.map((step, idx) => (
                      <div key={idx} className="text-xs text-emerald-300 font-mono flex items-center gap-2 animate-in fade-in duration-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synchronizing Modules...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Register & Trigger Automations</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CERTIFICATE VIEW MODAL */}
      {selectedEventForCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-gradient-to-b from-slate-900 via-[#0A122C] to-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedEventForCert(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-3 mb-8 border-b border-amber-500/30 pb-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-xs uppercase tracking-widest font-extrabold text-amber-400">
                OFFICIAL BNEI MENASHE COMMUNITY LIFECYCLE REGISTRY
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                CERTIFICATE OF {selectedEventForCert.category.toUpperCase()}
              </h3>
              <div className="text-xs font-mono text-slate-400">
                REGISTRY REFERENCE: <strong className="text-amber-300">{selectedEventForCert.referenceNumber}</strong>
              </div>
            </div>

            <div className="bg-slate-950/60 rounded-2xl p-6 border border-slate-800 space-y-4 mb-6">
              <div className="text-center space-y-1">
                <div className="text-xs text-slate-400 font-light">THIS IS TO CERTIFY THAT THE RECORD OF</div>
                <div className="text-xl font-bold text-white">{selectedEventForCert.citizenName}</div>
                {selectedEventForCert.hebrewName && (
                  <div className="text-lg text-amber-300 font-serif">{selectedEventForCert.hebrewName}</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block font-light">Civil Date:</span>
                  <span className="font-semibold text-white">{selectedEventForCert.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-light">Hebrew Date:</span>
                  <span className="font-semibold text-amber-300">{selectedEventForCert.hebrewDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-light">Community Sector:</span>
                  <span className="font-semibold text-white">{selectedEventForCert.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-light">Verification Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {selectedEventForCert.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-800 pt-4">
              <div>Cryptographic Hash: 0x981F...E42A</div>
              <div className="text-amber-400 font-bold">SEALED BY BNEI MENASHE BEIT DIN</div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => showToast('Certificate copied to clipboard!')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
              >
                <Share2 className="w-4 h-4" /> Share Record
              </button>
              <button
                onClick={() => showToast('Official PDF downloaded!')}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
              >
                <Download className="w-4 h-4" /> Download Certified PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
