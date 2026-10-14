import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  MapPin, 
  Building2, 
  Globe, 
  Moon, 
  Clock, 
  CheckCircle2, 
  Crown, 
  Calendar, 
  Bell, 
  Camera, 
  Save, 
  Sparkles,
  Fingerprint,
  QrCode,
  Download,
  FileText,
  Award,
  Users,
  HeartHandshake,
  Flame,
  BookOpen,
  Bot,
  Landmark,
  BarChart2,
  Lock,
  Smartphone,
  Laptop,
  Check,
  ChevronRight,
  ExternalLink,
  X,
  Share2,
  Activity,
  KeyRound,
  ShieldCheck,
  BadgeCheck,
  HelpCircle
} from 'lucide-react';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';
import { NavSection } from '../../types';
import { PublicVerificationModal } from '../common/PublicVerificationModal';

interface ProfileViewProps {
  onNavigate?: (section: NavSection) => void;
}

interface DigitalRecord {
  id: string;
  title: string;
  subtitle: string;
  category: 'identity' | 'census' | 'memorial' | 'governance' | 'aliyah';
  issueDate: string;
  status: 'Verified & Sealed' | 'Active Endorsement' | 'Processing';
  code: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { profile, session } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState<'id_card' | 'wallet' | 'services' | 'activity' | 'security' | 'settings'>('id_card');
  
  // Modals & Notifications
  const [activeQRModal, setActiveQRModal] = useState<{ title: string; code: string; subtitle: string } | null>(null);
  const [publicVerifyCode, setPublicVerifyCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editable Profile Preferences State
  const [displayName, setDisplayName] = useState(profile?.full_name || 'Samuel Haokip');
  const [hebrewName, setHebrewName] = useState(profile?.hebrew_name || 'שְׁמוּאֵל');
  const [language, setLanguage] = useState(profile?.preferred_dialect || 'English / Hebrew');
  const [theme, setTheme] = useState('System Dark / Slate');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [minyanUpdates, setMinyanUpdates] = useState(true);
  
  // Security State toggles
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [directoryVisibility, setDirectoryVisibility] = useState(true);
  const [encryptedVault, setEncryptedVault] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      showToast('Community Identity Pass preferences & notification alerts updated.');
    }, 700);
  };

  const emailAddress = profile?.email || session?.user?.email || 'samuel.haokip@bneimenashe.org';
  const phoneNum = profile?.phone || '+91 98620 48210';
  const citizenId = 'BMCI-2026-0001824';
  const householdId = 'BM-2026-CHUR-0842';
  const communityName = 'Khuangkhai';
  const regionalCouncil = profile?.onboarding_location?.regional_council || 'Churachandpur';
  const synagogueName = profile?.onboarding_location?.synagogue || 'Beit Shalom';

  const digitalRecords: DigitalRecord[] = [
    {
      id: 'doc-1',
      title: 'Official Community Identity Pass',
      subtitle: 'Verified Bnei Menashe Council Community Identity Pass',
      category: 'identity',
      issueDate: '14 Tishrei 5784 (Sept 2023)',
      status: 'Verified & Sealed',
      code: 'BM-PASS-2026-9104'
    },
    {
      id: 'doc-2',
      title: '2026–2027 Census Demographic Certificate',
      subtitle: 'National Population Registry Sealed Household Record',
      category: 'census',
      issueDate: '10 Tamuz 5786 (July 2026)',
      status: 'Verified & Sealed',
      code: 'CENSUS-SEAL-0842'
    },
    {
      id: 'doc-3',
      title: 'Household Registration Roster',
      subtitle: '5 Registered Souls under Singson / Haokip Roof',
      category: 'census',
      issueDate: '12 Tamuz 5786 (July 2026)',
      status: 'Verified & Sealed',
      code: 'HH-ROSTER-5SOULS'
    },
    {
      id: 'doc-4',
      title: 'Perpetual Memorial Sanctuary Certificate',
      subtitle: '2 Yahrzeit Candles Registered in Beit Shalom Sanctuary',
      category: 'memorial',
      issueDate: '15 Kislev 5785 (Nov 2024)',
      status: 'Active Endorsement',
      code: 'YAHRZEIT-CANDLE-248'
    },
    {
      id: 'doc-5',
      title: 'Regional Council Membership Endorsement',
      subtitle: 'Churachandpur District Good Standing Certificate',
      category: 'governance',
      issueDate: '1 Tishrei 5786 (Sept 2025)',
      status: 'Verified & Sealed',
      code: 'RC-CHUR-ENDORS-99'
    },
    {
      id: 'doc-6',
      title: 'Gabbai Volunteer Service Certificate',
      subtitle: 'Recognized Minyan Coordinator & Welfare Assistant',
      category: 'governance',
      issueDate: '28 Iyar 5786 (May 2026)',
      status: 'Active Endorsement',
      code: 'VOL-GABBAI-2026'
    },
    {
      id: 'doc-7',
      title: 'Aliyah Documentation Endorsement',
      subtitle: 'Rabbinic Lineage Verification File #9104',
      category: 'aliyah',
      issueDate: '5 Sivan 5786 (May 2026)',
      status: 'Processing',
      code: 'ALIYAH-FILE-9104'
    },
    {
      id: 'doc-8',
      title: 'High Holiday Prayer Quorum Certificate',
      subtitle: '5786 Rosh Hashanah & Yom Kippur Congregation Seat',
      category: 'identity',
      issueDate: '10 Tishrei 5786 (Oct 2025)',
      status: 'Verified & Sealed',
      code: 'MINYAN-SEAT-042'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-fade-in text-slate-100 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500/90 text-slate-950 font-extrabold text-xs shadow-2xl flex items-center gap-3 backdrop-blur-md border border-white/20 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0A1128] via-slate-900 to-[#1e293b] p-6 sm:p-8 border border-amber-500/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                <span>Unified Community Identity Pass</span>
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" />
                <span>Cryptographically Sealed</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Community Identity Pass
            </h1>
            <p className="text-sm text-slate-300 font-light max-w-2xl">
              One trusted digital identity linking your household, census verification, synagogue standing, and community documents across all Bnei Menashe modules.
            </p>
          </div>

          {/* Quick Verification Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveQRModal({
                title: 'Community Identity Pass',
                subtitle: `${displayName} • ID: ${citizenId}`,
                code: `VERIFIED-CITIZEN:${citizenId}:TIMESTAMP:${Date.now()}`
              })}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-xl transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Show QR Pass</span>
            </button>
            <button
              onClick={() => showToast('Community Identity Pass downloaded as secure PDF.')}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download ID</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="relative z-10 flex items-center gap-2 mt-8 pt-6 border-t border-white/10 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: 'id_card', label: 'Identity Pass', icon: <Fingerprint className="w-4 h-4" /> },
            { id: 'wallet', label: 'Community Wallet', icon: <FileText className="w-4 h-4" />, count: digitalRecords.length },
            { id: 'services', label: 'My Services & Household', icon: <Users className="w-4 h-4" /> },
            { id: 'activity', label: 'Activity & Achievements', icon: <Award className="w-4 h-4" /> },
            { id: 'security', label: 'Security & Governance', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'settings', label: 'Identity Preferences', icon: <KeyRound className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === tab.id ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Phase 8: Help Everywhere ("What is this?") */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-white space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>What is the Community Identity Pass & Wallet?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Bnei Menashe Community Identity Pass serves as your unified digital pass for our national platform. It securely links your digital documents (like Census certificates and Synagogue endorsements), logs your civic and educational milestones, protects your family lineage, and provides cryptographically signed verification QR codes for official checks.
        </p>
      </div>

      {/* ====================================================
          TAB 1: COMMUNITY IDENTITY PASS & OVERVIEW
          ==================================================== */}
      {activeTab === 'id_card' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Apple-Quality Community Identity Pass Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A1128] border-2 border-amber-500/40 shadow-2xl overflow-hidden p-6 sm:p-8">
              {/* Holographic Watermark effect */}
              <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
                <Crown className="w-96 h-96 text-amber-400" />
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/15 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase">
                      Bnei Menashe Council India
                    </div>
                    <div className="text-sm font-black text-white tracking-tight">
                      Community Identity Pass
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>VERIFIED CITIZEN</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">ISSUED: 5784 / 2023</span>
                </div>
              </div>

              {/* Citizen Details Body */}
              <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-6 relative z-10 items-center">
                {/* Photo Monogram */}
                <div className="sm:col-span-4 flex flex-col items-center text-center">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 p-1 shadow-2xl relative group">
                    <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center overflow-hidden relative">
                      <span className="text-3xl font-black text-amber-300">
                        {displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Citizen Seal</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-500 text-slate-950 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 mt-3">{citizenId}</span>
                  <span className="text-[10px] text-slate-400">Community ID</span>
                </div>

                {/* Identity Metadata Grid */}
                <div className="sm:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                    <span className="text-sm font-black text-white">{displayName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hebrew Name</span>
                    <span className="text-sm font-bold text-amber-300 font-serif">{hebrewName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Community ID</span>
                    <span className="text-xs font-mono font-bold text-white bg-white/5 px-2 py-0.5 rounded border border-white/10 inline-block mt-0.5">
                      {citizenId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Member Status</span>
                    <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Regional Council</span>
                    <span className="text-xs font-bold text-white mt-0.5 block">{regionalCouncil}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Community</span>
                    <span className="text-xs font-bold text-white mt-0.5 block">{communityName}</span>
                  </div>
                  <div className="sm:col-span-2 border-t border-white/10 pt-3 mt-1 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Synagogue</span>
                      <span className="text-xs font-bold text-white">{synagogueName}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-bold">
                      Active Minyan Member
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-5 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-full sm:w-48">
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span className="text-slate-400">Profile Completion</span>
                      <span className="text-amber-400">95%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400 w-[95%]"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveQRModal({
                      title: 'Community Identity Pass QR',
                      subtitle: `${displayName} • ${citizenId}`,
                      code: `BM-VERIFY-CITIZEN-${citizenId}`
                    })}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Verification</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Navigation to Services */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'View Census', icon: <BarChart2 className="w-4 h-4 text-amber-400" />, section: 'census_demographics' as NavSection },
                { label: 'Lineage & Heritage', icon: <HeartHandshake className="w-4 h-4 text-rose-400" />, section: 'family' as NavSection },
                { label: 'Memorial Sanctuary', icon: <Flame className="w-4 h-4 text-amber-500" />, section: 'memorial' as NavSection },
                { label: 'Members Hub', icon: <Users className="w-4 h-4 text-cyan-400" />, section: 'community' as NavSection }
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate?.(btn.section)}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 hover:bg-slate-800 transition-all text-left group flex flex-col justify-between h-24"
                >
                  <div className="p-2 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
                    {btn.icon}
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-white mt-2">
                    <span>{btn.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Verification Levels Ladder & Trust Standing */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Trust Standing</span>
                <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Verification Hierarchy</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your identity trust standing establishes eligibility for voting, welfare grants, and Aliyah endorsements.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { lvl: 1, label: 'Basic Member', desc: 'Contact phone & email registered', done: true },
                  { lvl: 2, label: 'Verified Household', desc: 'Census demographic roster sealed', done: true },
                  { lvl: 3, label: 'Verified Community Member', desc: 'Endorsed by Synagogue Gabbaim', done: true, current: true },
                  { lvl: 4, label: 'Community Volunteer', desc: 'Recognized active minyan contributor', done: false },
                  { lvl: 5, label: 'Regional Leader', desc: 'Council officer or committee gabbai', done: false },
                  { lvl: 6, label: 'Rabbinic Authority', desc: 'Halachic Commission & Dayan standing', done: false },
                  { lvl: 7, label: 'Global Administrator', desc: 'Core platform governance administrator', done: false }
                ].map((item) => (
                  <div
                    key={item.lvl}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      item.current
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-lg'
                        : item.done
                        ? 'bg-emerald-500/10 border-emerald-500/20 opacity-90'
                        : 'bg-white/5 border-white/5 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                        item.current
                          ? 'bg-amber-500 text-slate-950'
                          : item.done
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.done ? <Check className="w-4 h-4 stroke-[3]" /> : `L${item.lvl}`}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold truncate ${item.current ? 'text-amber-300' : 'text-white'}`}>
                            {item.label}
                          </span>
                          {item.current && (
                            <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-500 text-slate-950 uppercase">
                              Current
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block truncate">{item.desc}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          TAB 2: DIGITAL WALLET ("MY COMMUNITY WALLET")
          ==================================================== */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Official Document Vault</span>
              <h2 className="text-xl font-black text-white tracking-tight">My Community Wallet</h2>
              <p className="text-xs text-slate-400 mt-1">
                Verifiable digital records, census credentials, synagogue seats, and regional certificates stored securely.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>{digitalRecords.length} Documents Sealed</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {digitalRecords.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      doc.status === 'Verified & Sealed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : doc.status === 'Active Endorsement'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {doc.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{doc.code}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors leading-tight">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{doc.subtitle}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Issued Date:</span>
                    <span className="font-semibold text-white">{doc.issueDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Downloaded ${doc.title} official PDF copy.`)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => setActiveQRModal({
                        title: doc.title,
                        subtitle: `${doc.code} • ${doc.issueDate}`,
                        code: `SEALED-DOC:${doc.code}:${doc.status}`
                      })}
                      className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QR Verify</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================
          TAB 3: MY SERVICES & HOUSEHOLD CONNECTION
          ==================================================== */}
      {activeTab === 'services' && (
        <div className="space-y-8">
          {/* Household Connection Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-900 border border-amber-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Linked Household Vault</span>
                  <h2 className="text-xl font-black text-white tracking-tight">Singson / Haokip Household</h2>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                ID: {householdId}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block mb-1">Registered Souls</span>
                <span className="text-base font-black text-white">5 Family Members</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block mb-1">Lineage Tree</span>
                <span className="text-base font-black text-rose-300">4 Generations</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block mb-1">Community Jurisdiction</span>
                <span className="text-base font-black text-blue-300">Churachandpur</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block mb-1">Perpetual Memorials</span>
                <span className="text-base font-black text-amber-400">2 Candles Lit</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate?.('census_demographics')}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-lg"
              >
                <span>Manage Household Census</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate?.('family')}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-2"
              >
                <span>Open Family Tree Roster</span>
                <ExternalLink className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>

          {/* Aggregated Platform Modules Grid */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>My Services & Connected Modules</span>
              </h3>
              <p className="text-xs text-slate-400">
                Every Bnei Menashe module directly recognizes your verified digital identity without duplicate sign-ins.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Community Census', desc: 'Sealed population registry record & demographic survey.', icon: <BarChart2 className="w-5 h-5 text-amber-400" />, section: 'census_demographics' as NavSection },
                { title: 'Family Tree Lineage', desc: 'Four generations of ancestral records linked to Manasseh.', icon: <HeartHandshake className="w-5 h-5 text-rose-400" />, section: 'family' as NavSection },
                { title: 'Memorial Sanctuary', desc: 'Perpetual Yahrzeit candles and Kaddish reminders.', icon: <Flame className="w-5 h-5 text-amber-500" />, section: 'memorial' as NavSection },
                { title: 'Prayer Requests & Shuls', desc: 'Mishbeirach names and Beit Shalom congregation quorum.', icon: <Landmark className="w-5 h-5 text-emerald-400" />, section: 'sanctuary' as NavSection },
                { title: 'Community Calendar', desc: 'Halachic zmanim schedule, holidays, and offline sync.', icon: <Calendar className="w-5 h-5 text-purple-400" />, section: 'calendar' as NavSection },
                { title: 'AI Rabbi Assistant', desc: 'Personalized Halachic guidance and census FAQ support.', icon: <Bot className="w-5 h-5 text-amber-300" />, section: 'ai_rabbi' as NavSection },
                { title: 'Community Directory', desc: 'Member lookup, Gabbaim contact list, and announcements.', icon: <Users className="w-5 h-5 text-cyan-400" />, section: 'community' as NavSection },
                { title: 'Regional Council Portal', desc: 'Official governance notices and welfare grants.', icon: <Shield className="w-5 h-5 text-blue-400" />, section: 'regional_council' as NavSection },
                { title: 'Torah & Parashah Library', desc: 'Weekly Torah readings and Mizo/English translations.', icon: <BookOpen className="w-5 h-5 text-yellow-400" />, section: 'parashah' as NavSection }
              ].map((srv, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate?.(srv.section)}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer shadow-lg flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                      {srv.icon}
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      ID LINKED
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                      {srv.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-light mt-1 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>Launch Module</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          TAB 4: MY ACTIVITY & ACHIEVEMENTS
          ==================================================== */}
      {activeTab === 'activity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recent Activity Timeline */}
          <div className="lg:col-span-7 space-y-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Citizen Audit Trail</span>
                <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                  <Activity className="w-5 h-5 text-amber-400" />
                  <span>Recent Citizen Activity</span>
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Updated Profile preferences & dialect setting', time: 'Today, 14:20 IST', icon: <User className="w-4 h-4 text-amber-400" /> },
                  { title: 'Submitted 2026–2027 Household Census Demographics', time: 'Yesterday, 09:15 IST', icon: <BarChart2 className="w-4 h-4 text-emerald-400" /> },
                  { title: 'Lit Memorial Candle for Elder Manmasi (Zt"l)', time: '2 days ago', icon: <Flame className="w-4 h-4 text-rose-400" /> },
                  { title: 'Asked AI Rabbi query regarding Shabbat travel laws', time: '3 days ago', icon: <Bot className="w-4 h-4 text-blue-400" /> },
                  { title: 'Downloaded Official Census Verification Certificate', time: 'Last week', icon: <Download className="w-4 h-4 text-purple-400" /> },
                  { title: 'Joined Community Rosh Chodesh Av Minyan Event', time: '2 weeks ago', icon: <Users className="w-4 h-4 text-cyan-400" /> }
                ].map((act, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                    <div className="p-2 rounded-xl bg-slate-800 shrink-0 mt-0.5">
                      {act.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white">{act.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Community Milestones & Achievements */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">Community Milestones</span>
                <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>My Achievements</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {[
                  { badge: 'Verified Household', desc: '5 souls under one roof sealed in registry', icon: <ShieldCheck className="w-5 h-5 text-emerald-400" /> },
                  { badge: 'Completed Census', desc: 'Submitted full family demographics', icon: <BarChart2 className="w-5 h-5 text-amber-400" /> },
                  { badge: 'Family Tree Created', desc: 'Linked 4 ancestral generations', icon: <HeartHandshake className="w-5 h-5 text-rose-400" /> },
                  { badge: 'First Prayer Request', desc: 'Submitted Mishbeirach for healing', icon: <Landmark className="w-5 h-5 text-purple-400" /> },
                  { badge: 'First Community Event', desc: 'Attended Regional Council gathering', icon: <Users className="w-5 h-5 text-blue-400" /> },
                  { badge: 'Volunteer Recognition', desc: 'Assisted Beit Shalom Shabbat Kiddush', icon: <Sparkles className="w-5 h-5 text-yellow-400" /> },
                  { badge: 'Community Contributor', desc: 'Supporting Bnei Menashe welfare initiatives', icon: <Award className="w-5 h-5 text-emerald-300" /> }
                ].map((milestone, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 shrink-0">
                      {milestone.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-white truncate">{milestone.badge}</div>
                      <div className="text-[11px] text-slate-400 truncate">{milestone.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          TAB 5: SECURITY & GOVERNANCE
          ==================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Credentials & MFA */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Identity Protection</span>
                    <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                      <Lock className="w-5 h-5 text-amber-400" />
                      <span>Account Security & Verification</span>
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    Highly Protected
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="font-bold text-white">Email Verification</div>
                        <div className="text-slate-400">{emailAddress}</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold">Verified ✓</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="font-bold text-white">Phone SMS Authentication</div>
                        <div className="text-slate-400">{phoneNum}</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold">Verified ✓</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <KeyRound className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="font-bold text-white">Two-Factor Authentication (2FA)</div>
                        <div className="text-slate-400">Biometric TouchID & Authenticator App Code</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTwoFactorEnabled(!twoFactorEnabled);
                        showToast(twoFactorEnabled ? 'Two-Factor Authentication disabled.' : 'Two-Factor Authentication enabled.');
                      }}
                      className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                        twoFactorEnabled
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {twoFactorEnabled ? 'Active ✓' : 'Turn On'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Sessions & Trusted Devices */}
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">Sessions Audit</span>
                    <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                      <Laptop className="w-5 h-5 text-blue-400" />
                      <span>Active Sessions & Trusted Devices</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => showToast('All other device sessions successfully revoked.')}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Revoke Other Sessions
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Laptop className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="font-bold text-white">Apple MacBook Pro M3 (Current Device)</div>
                        <div className="text-slate-300">macOS Chrome • Imphal, India • IP: 103.21.XX.XX</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] uppercase">
                      Active Now
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="font-bold text-white">Apple iPhone 15 Pro</div>
                        <div className="text-slate-400">iOS Safari • Churachandpur, India • Yesterday 18:30 IST</div>
                      </div>
                    </div>
                    <span className="text-slate-400 font-medium">Trusted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Settings & Zero-Knowledge Vault */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">Citizen Privacy</span>
                  <h3 className="text-base font-black text-white tracking-tight mt-0.5">
                    Privacy Controls
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage how your digital identity is shared with regional gabbaim and directory lookups.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                    <div>
                      <span className="font-bold text-white block">Directory Visibility</span>
                      <span className="text-[11px] text-slate-400">Show name in community roster</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={directoryVisibility}
                      onChange={(e) => {
                        setDirectoryVisibility(e.target.checked);
                        showToast(e.target.checked ? 'Directory visibility enabled.' : 'Directory visibility hidden.');
                      }}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                    <div>
                      <span className="font-bold text-white block">Encrypted Census Vault</span>
                      <span className="text-[11px] text-slate-400">Zero-knowledge demographic lock</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={encryptedVault}
                      onChange={(e) => {
                        setEncryptedVault(e.target.checked);
                        showToast(e.target.checked ? 'Zero-knowledge vault enabled.' : 'Vault encryption disabled.');
                      }}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          TAB 6: IDENTITY PREFERENCES (EDIT PROFILE)
          ==================================================== */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSavePreferences} className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Manage Identity</span>
              <h2 className="text-xl font-black text-white tracking-tight">Identity & Profile Preferences</h2>
              <p className="text-xs text-slate-400 mt-1">Update your display names, regional language dialect, and alert preferences.</p>
            </div>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                Enable Editing
              </button>
            ) : (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                Editing Active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Legal / Display Name</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 text-white font-medium focus:ring-2 focus:ring-amber-500 disabled:opacity-60 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Hebrew Name</span>
              </label>
              <input
                type="text"
                value={hebrewName}
                onChange={(e) => setHebrewName(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 text-amber-300 font-bold font-serif focus:ring-2 focus:ring-amber-500 disabled:opacity-60 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Interface Language Dialect</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 text-white font-medium focus:ring-2 focus:ring-amber-500 disabled:opacity-60 transition-all"
              >
                <option value="English / Hebrew">English / Hebrew</option>
                <option value="English">English</option>
                <option value="Hebrew">Hebrew (עברית)</option>
                <option value="Mizo">Mizo Dialect</option>
                <option value="Thadou">Thadou Dialect</option>
                <option value="Kuki">Kuki Dialect</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Visual Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 text-white font-medium focus:ring-2 focus:ring-amber-500 disabled:opacity-60 transition-all"
              >
                <option value="System Dark / Slate">System Dark / Slate</option>
                <option value="High Contrast Slate">High Contrast Accessibility</option>
                <option value="Warm Gold Sanctuary">Warm Gold Sanctuary</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Broadcast & Alert Preferences</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Email Newsletter & Parashah Briefings</span>
                  <span className="text-slate-400">Weekly community summaries and holiday zmanim schedules.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 rounded text-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">SMS Shabbat Candle Lighting Alerts</span>
                  <span className="text-slate-400">Instant SMS notification 45 mins prior to local sunset.</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 rounded text-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Synagogue Minyan Schedule Broadcasts</span>
                  <span className="text-slate-400">Real-time alerts when Beit Shalom requires a Minyan quorum.</span>
                </div>
                <input
                  type="checkbox"
                  checked={minyanUpdates}
                  onChange={(e) => setMinyanUpdates(e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 rounded text-amber-500"
                />
              </label>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Identity Preferences</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      )}

      {/* ====================================================
          QR VERIFICATION INTERACTIVE MODAL
          ==================================================== */}
      {activeQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-gradient-to-b from-slate-900 to-[#0A1128] border-2 border-amber-500/50 rounded-3xl w-full max-w-md p-7 space-y-6 shadow-2xl text-center relative">
            <button
              onClick={() => setActiveQRModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">{activeQRModal.title}</h3>
              <p className="text-xs font-bold text-amber-300">{activeQRModal.subtitle}</p>
            </div>

            {/* High-Contrast QR Code Display Box */}
            <div className="p-6 rounded-3xl bg-white text-slate-950 mx-auto w-64 h-64 flex flex-col items-center justify-center shadow-inner relative">
              <div className="w-48 h-48 border-[6px] border-slate-950 rounded-2xl p-2 flex flex-col items-center justify-center relative bg-white">
                <QrCode className="w-40 h-40 text-slate-950 stroke-[1.2]" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 border-2 border-slate-950 flex items-center justify-center shadow-md">
                    <Crown className="w-5 h-5 text-slate-950" />
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-600 mt-2 tracking-widest uppercase">
                Bnei Menashe Council Seal
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-slate-300 text-left space-y-1">
              <div className="flex items-center justify-between font-bold text-white">
                <span>Cryptographic Seal:</span>
                <span className="text-emerald-400">Active & Valid ✓</span>
              </div>
              <div><strong>Verification Date:</strong> 16 Tamuz 5786 (July 5, 2026)</div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-white/5">
                When scanned by Gabbaim or Regional Council officers, this code verifies active membership without exposing private demographic data.
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const codeToVerify = 'BMCI-2026-0001824';
                  setActiveQRModal(null);
                  setPublicVerifyCode(codeToVerify);
                }}
                className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Seal (Public Page)</span>
              </button>
              <button
                onClick={() => {
                  setActiveQRModal(null);
                  showToast('QR verification seal closed.');
                }}
                className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLIC VERIFICATION PAGE / MODAL */}
      {publicVerifyCode && (
        <PublicVerificationModal
          initialCode={publicVerifyCode}
          onClose={() => setPublicVerifyCode(null)}
        />
      )}
    </div>
  );
};
