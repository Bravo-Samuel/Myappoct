import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  Users,
  Plane,
  Home,
  Landmark,
  Shield,
  MapPin,
  Flame,
  Baby,
  UserCheck,
  Scale,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  FileText,
  Download,
  BookOpen,
  Send,
  Eye,
  EyeOff,
  Filter,
  Check,
  AlertCircle,
  GitMerge,
  Crown,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Globe,
  Award,
  Layers,
  HelpCircle,
  Briefcase,
  GraduationCap,
  Loader2,
  UploadCloud,
  UserPlus,
  Trash2,
  Edit3,
  Save,
  FileCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  CensusService,
  CensusSubmissionRecord,
  CensusDemographicRegion,
  CensusDashboardKPIs
} from '../../services/data/CensusService';

type TabView = 'portal' | 'map' | 'analytics' | 'search' | 'admin';
type AdminRoleMode = 'Public' | 'Regional Admin' | 'Global Admin';

export const CensusDemographicsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('portal');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [adminRoleMode, setAdminRoleMode] = useState<AdminRoleMode>('Public');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('reg_churachandpur');
  const [mapCountryFilter, setMapCountryFilter] = useState<'ALL' | 'India' | 'Israel'>('ALL');

  // Local state trigger to re-render KPIs after actions
  const [dataVersion, setDataVersion] = useState<number>(1);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchStatusFilter, setSearchStatusFilter] = useState<string>('ALL');
  const [searchCouncilFilter, setSearchCouncilFilter] = useState<string>('ALL');

  // Modals state
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [showLearnModal, setShowLearnModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<CensusSubmissionRecord | null>(null);
  const [showMergeModal, setShowMergeModal] = useState<CensusSubmissionRecord | null>(null);
  const [mergeTargetId, setMergeTargetId] = useState<string>('');

  // Submit form state
  const [formHead, setFormHead] = useState<string>('');
  const [formHebrew, setFormHebrew] = useState<string>('');
  const [formClan, setFormClan] = useState<string>('Haokip');
  const [formVillage, setFormVillage] = useState<string>('Churachandpur');
  const [formCouncil, setFormCouncil] = useState<string>('Northeast India Hills Regional Council');
  const [formCountry, setFormCountry] = useState<'India' | 'Israel'>('India');
  const [formMembers, setFormMembers] = useState<number>(5);
  const [formChildren, setFormChildren] = useState<number>(2);
  const [formElders, setFormElders] = useState<number>(0);
  const [formPhone, setFormPhone] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formAliyah, setFormAliyah] = useState<any>('Residing in India Hills');
  const [submitSuccessRecord, setSubmitSuccessRecord] = useState<CensusSubmissionRecord | null>(null);

  // Guided wizard navigation & step state
  const [regStep, setRegStep] = useState<number>(0);
  const [isSubmittingCensus, setIsSubmittingCensus] = useState<boolean>(false);
  const [draftSavedText, setDraftSavedText] = useState<string>('2 minutes ago');
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);

  // Section 1: Community
  const [formCommunity, setFormCommunity] = useState<string>('Churachandpur Beith Shalom Congregation');
  const [formSynagogue, setFormSynagogue] = useState<string>('Beith Shalom Synagogue');
  const [formBranch, setFormBranch] = useState<string>('Manipur South Hill District');

  // Section 2: Identity
  const [formSurname, setFormSurname] = useState<string>('Haokip');
  const [formGivenName, setFormGivenName] = useState<string>('');

  // Section 3: Personal Details
  const [formSex, setFormSex] = useState<'Male' | 'Female'>('Male');
  const [formDob, setFormDob] = useState<string>('1986-05-14');
  const [formMaritalStatus, setFormMaritalStatus] = useState<string>('Married');
  const [formNationality, setFormNationality] = useState<string>('Indian');

  // Section 4: Family Lineage
  const [formFatherName, setFormFatherName] = useState<string>('');
  const [formMotherName, setFormMotherName] = useState<string>('');
  const [formVillageOrigin, setFormVillageOrigin] = useState<string>('Saikot, Churachandpur');
  const [formCurrentHead, setFormCurrentHead] = useState<string>('Self (Head of Household)');

  // Section 5: Religious Info
  const [formJudaismDate, setFormJudaismDate] = useState<string>('1998');
  const [formRabbi, setFormRabbi] = useState<string>('Rabbi Yehuda Gin / Rabbi Hanoch Avichail heritage');
  const [formReligiousNotes, setFormReligiousNotes] = useState<string>('');

  // Section 6: Documents
  const [formPassportNo, setFormPassportNo] = useState<string>('');
  const [formPassportIssue, setFormPassportIssue] = useState<string>('');
  const [formPassportExpiry, setFormPassportExpiry] = useState<string>('');
  const [formAadhaarNo, setFormAadhaarNo] = useState<string>('');
  const [formOtherId, setFormOtherId] = useState<string>('');

  // Section 7: Household Members
  const [householdMembersList, setHouseholdMembersList] = useState<Array<{
    id: string;
    relationship: string;
    name: string;
    hebrewName: string;
    sex: string;
    dob: string;
    passport: string;
    aliyahStatus: string;
  }>>([
    { id: 'm1', relationship: 'Spouse', name: 'Lhingnei Haokip', hebrewName: 'שרה הוקיפ', sex: 'Female', dob: '1989-08-12', passport: 'N/A', aliyahStatus: 'Residing in India Hills' },
    { id: 'm2', relationship: 'Child', name: 'Boipu Haokip', hebrewName: 'דוד הוקיפ', sex: 'Male', dob: '2014-03-20', passport: 'N/A', aliyahStatus: 'Residing in India Hills' }
  ]);
  const [newMemberRel, setNewMemberRel] = useState<string>('Child');
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [newMemberHebrew, setNewMemberHebrew] = useState<string>('');
  const [newMemberSex, setNewMemberSex] = useState<string>('Male');
  const [newMemberDob, setNewMemberDob] = useState<string>('2016-01-01');
  const [newMemberPassport, setNewMemberPassport] = useState<string>('');
  const [newMemberAliyah, setNewMemberAliyah] = useState<string>('Residing in India Hills');

  // Section 8: Local Admin Notes
  const [formAdminNotes, setFormAdminNotes] = useState<string>('');

  // Status lookup state
  const [statusLookupInput, setStatusLookupInput] = useState<string>('');
  const [lookupResult, setLookupResult] = useState<CensusSubmissionRecord | null>(null);
  const [lookupSearched, setLookupSearched] = useState<boolean>(false);

  // Receipt preview state
  const [receiptRecord, setReceiptRecord] = useState<CensusSubmissionRecord | null>(null);

  // Review action notes
  const [reviewNotesInput, setReviewNotesInput] = useState<string>('');

  const calculatedAge = useMemo(() => {
    if (!formDob) return 38;
    const birthYear = new Date(formDob).getFullYear();
    if (isNaN(birthYear)) return 38;
    return Math.max(0, new Date().getFullYear() - birthYear);
  }, [formDob]);

  const handleSaveDraft = () => {
    setDraftSavedText('Just now');
  };

  // Data memoization
  const kpis: CensusDashboardKPIs = useMemo(() => {
    return CensusService.getDashboardKPIs();
  }, [dataVersion]);

  const regions: CensusDemographicRegion[] = useMemo(() => {
    return CensusService.getDemographicRegions();
  }, [dataVersion]);

  const analytics = useMemo(() => {
    return CensusService.getAnalytics();
  }, [dataVersion]);

  const filteredRegions = useMemo(() => {
    if (mapCountryFilter === 'ALL') return regions;
    return regions.filter(r => r.country === mapCountryFilter);
  }, [regions, mapCountryFilter]);

  const selectedRegion = useMemo(() => {
    return regions.find(r => r.id === selectedRegionId) || regions[0];
  }, [regions, selectedRegionId]);

  const searchResults = useMemo(() => {
    return CensusService.searchSubmissions(
      searchQuery,
      searchStatusFilter,
      searchCouncilFilter,
      adminRoleMode !== 'Public'
    );
  }, [searchQuery, searchStatusFilter, searchCouncilFilter, adminRoleMode, dataVersion]);

  const adminSubmissions = useMemo(() => {
    return CensusService.getAllSubmissions();
  }, [dataVersion]);

  // Handle Form Submission
  const handleSubmitCensusForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmittingCensus(true);
    await new Promise(resolve => setTimeout(resolve, 1400));

    const finalHead = formHead || `${formGivenName} ${formSurname}`.trim() || 'Lunkholal Haokip';
    const created = await CensusService.submitCensus({
      headOfHousehold: finalHead,
      hebrewName: formHebrew || 'יוסף',
      clanName: formClan,
      village: formVillage,
      community: formCommunity || `${formVillage} Congregation`,
      regionalCouncil: formCouncil,
      country: formCountry,
      stateOrDistrict: formCountry === 'India' ? 'Manipur' : 'Northern District',
      memberCount: Math.max(formMembers, householdMembersList.length + 1),
      childrenCount: formChildren,
      eldersCount: formElders,
      contactPhone: formPhone || '+91-9862000000',
      contactEmail: formEmail || 'applicant@bneimenashe.org',
      aliyahStatus: formAliyah
    }, finalHead);

    setIsSubmittingCensus(false);
    setSubmitSuccessRecord(created);
    setDataVersion(v => v + 1);
  };

  // Handle Admin Review Action
  const handleAdminAction = async (id: string, action: 'Approved' | 'Correction Requested' | 'Rejected') => {
    await CensusService.reviewSubmission(
      id,
      action,
      reviewNotesInput || `Action performed via ${adminRoleMode}`,
      adminRoleMode === 'Global Admin' ? 'Global Admin Console' : 'Regional Council Coordinator'
    );
    setShowReviewModal(null);
    setReviewNotesInput('');
    setDataVersion(v => v + 1);
  };

  // Handle Merge Duplicates
  const handleMergeAction = async () => {
    if (!showMergeModal || !mergeTargetId) return;
    await CensusService.mergeDuplicateSubmissions(
      showMergeModal.id,
      mergeTargetId,
      adminRoleMode === 'Global Admin' ? 'Global Admin Console' : 'Regional Council Coordinator'
    );
    setShowMergeModal(null);
    setMergeTargetId('');
    setDataVersion(v => v + 1);
  };

  // Export Simulation
  const handleExportReport = (format: string, name: string) => {
    const csvContent = "ApplicationID,HeadOfHousehold,FamilyLineage,Village,Council,Country,Members,Status\n" +
      adminSubmissions.map(s => `${s.id},"${s.headOfHousehold}",${s.clanName},${s.village},"${s.regionalCouncil}",${s.country},${s.memberCount},${s.status}`).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bnei_Menashe_Census_${name.replace(/\s+/g, '_')}_2026.${format.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 pb-24 font-sans select-none space-y-8 max-w-7xl mx-auto">
      {/* 1. TOP HERO & GOVERNMENT PORTAL HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-[#1E1B4B] border border-amber-500/30 p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                <Landmark className="w-3.5 h-3.5" />
                <span>Population Registry</span>
              </span>
              <span className="text-xs font-medium text-slate-300">
                Bnei Menashe Council India • Official Community Census 2026–2027
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>📊 Community Census</span>
              <span className="text-amber-400 font-serif text-2xl font-normal hidden sm:inline">מפקד האוכלוסין</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-light">
              Every Bnei Menashe household is encouraged to participate. Your census information helps strengthen community planning, education, welfare, Aliyah preparation, genealogy, and future development.
            </p>
          </div>

          {/* Subtle Administrative Role Switcher */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shrink-0 flex flex-col items-end gap-2 w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Governance Mode</span>
            <div className="flex gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {(['Public', 'Regional Admin', 'Global Admin'] as AdminRoleMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAdminRoleMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    adminRoleMode === mode
                      ? mode === 'Global Admin'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold'
                        : mode === 'Regional Admin'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-amber-300/80 font-medium">
              {adminRoleMode === 'Public' ? '🏛️ Official Portal Mode' : adminRoleMode === 'Regional Admin' ? '🛡️ Regional Verification Queue' : '👑 Full Demographic Dashboard Access'}
            </span>
          </div>
        </div>
      </div>

      {/* Phase 8: Help Everywhere ("What is this?") */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-white space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>What is the Community Census?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Community Census is our official tribal registry. By registering your household, you help the Bnei Menashe Council plan Hebrew schools for our children, coordinate eldercare, arrange holiday assistance, and preserve our sacred lineage records across Northeast India and Israel for generations to come.
        </p>
      </div>

      {/* 2. TAB NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
        {[
          { id: 'portal', label: 'Official Portal', icon: <Landmark className="w-4 h-4 text-amber-400" /> },
          { id: 'map', label: 'Demographic Map', icon: <MapPin className="w-4 h-4 text-purple-400" /> },
          { id: 'analytics', label: 'Population Analytics', icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
          { id: 'search', label: 'Search Directory', icon: <Search className="w-4 h-4 text-blue-400" /> },
          { id: 'admin', label: `Admin Workflow (${adminRoleMode})`, icon: <Crown className="w-4 h-4 text-amber-400" /> }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as TabView)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-300 border border-amber-500/50 shadow-lg'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OFFICIAL COMMUNITY CENSUS PORTAL (WELCOME LANDING) */}
      {/* ========================================================= */}
      {activeTab === 'portal' && (
        <div className="space-y-12 animate-fade-in">
          {/* SECTION 1: PRIMARY ACTIONS (FOUR LARGE CENTERED ACTION CARDS) */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Community Registration Office</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Official Census Services</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Select an option below to register a household, verify approval status, update information, or obtain an official census certificate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Register My Household */}
              <div
                onClick={() => { setShowSubmitModal(true); setRegStep(0); }}
                className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer shadow-xl hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between group h-full space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    📤
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Register My Household</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed font-light">
                      Begin a new census application for your family residing in Manipur, Mizoram, or Israel.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400">
                  <span>Begin Application</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Check My Application */}
              <div
                onClick={() => { setShowStatusModal(true); setLookupSearched(false); setLookupResult(null); }}
                className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-blue-500/10 via-slate-900 to-slate-900 border border-blue-500/30 hover:border-blue-400 transition-all cursor-pointer shadow-xl hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between group h-full space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    🔍
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Check My Application</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed font-light">
                      Track approval status and verification stages using your official Application ID.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-blue-400">
                  <span>Track Status</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: Update My Census */}
              <div
                onClick={() => { setShowStatusModal(true); setLookupSearched(false); setLookupResult(null); }}
                className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-purple-500/10 via-slate-900 to-slate-900 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer shadow-xl hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between group h-full space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    ✏️
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Update My Census</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed font-light">
                      Update household information, add newborns, or notify changes in address or Aliyah progress.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-400">
                  <span>Update Record</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 4: Download My Census Certificate */}
              <div
                onClick={() => { setShowReceiptModal(true); setReceiptRecord(adminSubmissions[0]); }}
                className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer shadow-xl hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between group h-full space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    📄
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Download My Certificate</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed font-light">
                      Download the official verified certificate complete with cryptographic QR code verification.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>Download Certificate</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: WHY PARTICIPATE? (BEAUTIFUL ICON CARDS) */}
          <div className="space-y-6 pt-4">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">Why Participate?</h3>
              <p className="text-xs text-slate-400">Your registration directly empowers community development across four pillars.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
                <div className="text-3xl">👨‍👩‍👧‍👦</div>
                <h4 className="text-base font-bold text-white">Build our Community</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Help us understand our growing population and ensure every family is accounted for in unity.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
                <div className="text-3xl">🏛</div>
                <h4 className="text-base font-bold text-white">Community Planning</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Support schools, synagogues, welfare programs, and future communal infrastructure planning.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
                <div className="text-3xl">✈️</div>
                <h4 className="text-base font-bold text-white">Aliyah Preparation</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Help prepare future community migration planning with verified demographic documentation.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
                <div className="text-3xl">📚</div>
                <h4 className="text-base font-bold text-white">Historical Preservation</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Preserve our family history, ancestral lineages, and heritage for generations to come.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: COMMUNITY PROGRESS (ONE ELEGANT PROGRESS BAR + 3 KPI CARDS ONLY) */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-white/10 space-y-8 shadow-2xl">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Jubilee Cycle Registry Status</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">Community Registration Progress</h3>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Estimated completion: October 2026
                </span>
              </div>

              {/* Elegant Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-300">{kpis.registeredFamilies.toLocaleString()} households registered</span>
                  <span className="text-amber-400">74%</span>
                </div>
                <div className="w-full h-4 rounded-full bg-slate-800 border border-slate-700 overflow-hidden p-0.5 shadow-inner">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-1000" style={{ width: '74%' }} />
                </div>
              </div>
            </div>

            {/* Exactly 3 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Registered Households</span>
                <div className="text-3xl font-black text-white">{kpis.registeredFamilies.toLocaleString()}</div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span>✅ Documented in registry</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending Review</span>
                <div className="text-3xl font-black text-amber-400">{kpis.pendingReviews.toLocaleString()}</div>
                <div className="text-[11px] text-slate-400">
                  <span>Under regional verification</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Verified Households</span>
                <div className="text-3xl font-black text-emerald-400">{kpis.approvedRecords.toLocaleString()}</div>
                <div className="text-[11px] text-slate-400">
                  <span>Official certificates issued</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: LATEST COMMUNITY UPDATES (OFFICIAL ANNOUNCEMENTS) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Latest Community Updates</h3>
                <p className="text-xs text-slate-400">Official bulletins from the Bnei Menashe Council Census Office.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-amber-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Registration Deadline
                  </span>
                  <span className="text-[11px] text-slate-400">15 Tamuz 5786</span>
                </div>
                <h4 className="text-sm font-bold text-white">October 2026 Jubilee Cycle Cutoff</h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  All heads of households across Manipur, Mizoram, and Aliyah communities must submit or verify their census records before October 31, 2026, for upcoming educational and welfare allocations.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-blue-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Regional Office Schedule
                  </span>
                  <span className="text-[11px] text-slate-400">Updated Daily</span>
                </div>
                <h4 className="text-sm font-bold text-white">In-Person Verification Desks Open</h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Churachandpur, Aizawl, Kangpokpi, and Nof HaGalil regional census verification offices are open Sunday through Thursday from 10:00 AM to 4:00 PM to assist elders with manual registration.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Document Requirements
                  </span>
                  <span className="text-[11px] text-slate-400">Preparation Guide</span>
                </div>
                <h4 className="text-sm font-bold text-white">Standard Verification Checklist</h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  When applying, please have your family head contact details, family lineage confirmation (Haokip, Kipgen, Guite, etc.), and synagogue congregation affiliation ready for verification.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Council Announcements
                  </span>
                  <span className="text-[11px] text-slate-400">Official Directive</span>
                </div>
                <h4 className="text-sm font-bold text-white">New Cryptographic Census Certificates</h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Upon administrative approval, families can now download an official Census Certificate complete with a secure QR code for seamless verification with community synagogues and Aliyah coordinators.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 5: FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
          <div className="space-y-6 pb-4">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">Frequently Asked Questions</h3>
              <p className="text-xs text-slate-400">Common questions about the registration process and data privacy.</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {[
                {
                  q: 'Why is the census important?',
                  a: 'The census serves as the official demographic registry for community planning, Hebrew educational resource allocations, welfare distribution, Aliyah coordination with Israeli agencies, and historical preservation of the Bnei Menashe tribes.'
                },
                {
                  q: 'Who should register?',
                  a: 'Every Bnei Menashe head of household residing in India (Manipur, Mizoram, Assam) or Israel should submit one registration covering all immediate household members residing under their roof.'
                },
                {
                  q: 'What documents are required?',
                  a: 'You will need your primary contact details, family lineage (such as Haokip, Kipgen, Guite), current town or village of residence, synagogue affiliation, and optional Israeli Teudat Zehut number if residing in Israel.'
                },
                {
                  q: 'Can I edit my submission?',
                  a: 'Yes. You can use the "Update My Census" or "Check My Application" tool on this portal using your Application ID (e.g., CEN-2026-8401) at any time before final administrative sealing.'
                },
                {
                  q: 'How long does approval take?',
                  a: 'Regional Gabbaim and Bnei Menashe Council Census Officers typically review and verify household submissions within 5 to 7 business days.'
                }
              ].map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5 bg-slate-900/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DEMOGRAPHIC MAP (INTERACTIVE REGION EXPLORER) */}
      {/* ========================================================= */}
      {activeTab === 'map' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                <span>Demographic Distribution Map</span>
              </h2>
              <p className="text-xs text-slate-400">Select any region across India and Israel to view localized community statistics.</p>
            </div>

            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 self-start">
              {(['ALL', 'India', 'Israel'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setMapCountryFilter(c)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mapCountryFilter === c ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c === 'ALL' ? 'All Regions' : c === 'India' ? '🇮🇳 India Hills' : '🇮🇱 Israel Hubs'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Regions Selector / Map Grid */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredRegions.map((reg) => {
                  const isSelected = selectedRegionId === reg.id;
                  return (
                    <div
                      key={reg.id}
                      onClick={() => setSelectedRegionId(reg.id)}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 shadow-xl scale-[1.01]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            reg.country === 'Israel' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}>
                            {reg.country === 'Israel' ? '🇮🇱 Israel Hub' : '🇮🇳 Manipur / Mizoram'}
                          </span>
                          <h3 className="text-base font-bold text-white mt-2">{reg.name}</h3>
                          <div className="text-xs text-amber-400 font-serif">{reg.hebrewName}</div>
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 text-slate-300">
                          <MapPin className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/10 text-center">
                        <div>
                          <div className="text-sm font-bold text-white">{reg.totalPopulation}</div>
                          <div className="text-[10px] text-slate-400">Members</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-amber-400">{reg.registeredFamilies}</div>
                          <div className="text-[10px] text-slate-400">Families</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-emerald-400">{reg.synagoguesCount}</div>
                          <div className="text-[10px] text-slate-400">Synagogues</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="truncate max-w-[180px]">Lead: {reg.contactPerson}</span>
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <span>Explore</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Region Inspect Sidebar */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-[#0F172A] to-[#0A1128] border border-amber-500/40 shadow-2xl space-y-6 self-start sticky top-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Regional Dossier</span>
                <h3 className="text-xl font-black text-white mt-1">{selectedRegion.name}</h3>
                <div className="text-sm font-serif text-amber-300">{selectedRegion.hebrewName}</div>
                <div className="text-xs text-slate-400 mt-2 leading-relaxed">{selectedRegion.description}</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-slate-400">Governing Council:</span>
                  <span className="font-bold text-white text-right">{selectedRegion.councilName}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-slate-400">Regional Coordinator:</span>
                  <span className="font-bold text-amber-300">{selectedRegion.contactPerson}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-slate-400">Aliyah Completion Rate:</span>
                  <span className="font-bold text-emerald-400">{selectedRegion.aliyahPercentage}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Prominent Lineages & Families:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRegion.primaryClans.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-200">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>Verified Jurisdiction</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Data updated daily by regional gabbaim and Bnei Menashe Council census officers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: POPULATION ANALYTICS (RECHARTS) */}
      {/* ========================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Demographic & Aliyah Analytics</span>
            </h2>
            <p className="text-xs text-slate-400">Dynamically queried statistics reflecting demographic trends from 1980 through 2026.</p>
          </div>

          {/* 12 Detailed Demographic Indicators Grid for Researchers & Admins */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Comprehensive Demographic Metrics (12 Key Indicators)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Community</span>
                <div className="text-xl font-bold text-white">{kpis.totalCommunityMembers.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400">Across India & Israel</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Residing in Israel</span>
                <div className="text-xl font-bold text-white">{kpis.returnedToIsrael.count.toLocaleString()} <span className="text-xs font-normal text-emerald-400">({kpis.returnedToIsrael.percentage}%)</span></div>
                <div className="text-[10px] text-slate-400">Completed Aliyah</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Living in India</span>
                <div className="text-xl font-bold text-white">{kpis.livingInIndia.count.toLocaleString()} <span className="text-xs font-normal text-purple-400">({kpis.livingInIndia.percentage}%)</span></div>
                <div className="text-[10px] text-slate-400">Manipur & Mizoram</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Registered Households</span>
                <div className="text-xl font-bold text-white">{kpis.registeredFamilies.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">Avg size: {kpis.averageHouseholdSize}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Synagogues & Shuls</span>
                <div className="text-xl font-bold text-white">{kpis.registeredSynagogues}</div>
                <div className="text-[10px] text-slate-400">Active minyanim</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Regional Councils</span>
                <div className="text-xl font-bold text-white">{kpis.regionalCouncilsCount} Councils</div>
                <div className="text-[10px] text-slate-400">Full coverage</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Documented Centers</span>
                <div className="text-xl font-bold text-white">{kpis.documentedCommunities} Centers</div>
                <div className="text-[10px] text-slate-400">Towns & villages</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Memorial Records</span>
                <div className="text-xl font-bold text-white">{kpis.memorialRecordsCount} Souls</div>
                <div className="text-[10px] text-slate-400">Preserved heritage</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Children Under 18</span>
                <div className="text-xl font-bold text-white">{kpis.childrenUnder18.count.toLocaleString()} <span className="text-xs font-normal text-emerald-400">({kpis.childrenUnder18.percentage}%)</span></div>
                <div className="text-[10px] text-slate-400">Youth in Torah education</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Elders 65+</span>
                <div className="text-xl font-bold text-white">{kpis.elders65Plus.count.toLocaleString()} <span className="text-xs font-normal text-slate-400">({kpis.elders65Plus.percentage}%)</span></div>
                <div className="text-[10px] text-slate-400">Matriarchs & patriarchs</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Gender Ratio</span>
                <div className="text-xl font-bold text-white">{kpis.maleFemaleRatio.ratio}</div>
                <div className="text-[10px] text-slate-400">{kpis.maleFemaleRatio.malePercent}% M • {kpis.maleFemaleRatio.femalePercent}% F</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Growth</span>
                <div className="text-xl font-bold text-amber-400">+{kpis.newRegistrationsThisMonth}</div>
                <div className="text-[10px] text-slate-400">New records verified</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            {/* Chart 1: Population Growth (AreaChart) */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Population Growth (1980–2026)</h3>
                  <span className="text-[11px] text-slate-400">Total Bnei Menashe population documented over time</span>
                </div>
              </div>
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.populationGrowth}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorIsrael" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="total" name="Total Community" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                    <Area type="monotone" dataKey="israelPopulation" name="Residing in Israel" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIsrael)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Age Distribution (BarChart) */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Age Bracket Distribution</h3>
                <span className="text-[11px] text-slate-400">Demographic pyramid breakdown across generations</span>
              </div>
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.ageDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="ageGroup" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                    <Legend />
                    <Bar dataKey="males" name="Males" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="females" name="Females" fill="#EC4899" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Aliyah Progress (PieChart) */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Aliyah Status Breakdown</h3>
                <span className="text-[11px] text-slate-400">Proportion of community in Israel vs. preparing for flight</span>
              </div>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.aliyahProgress}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.aliyahProgress.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Village & Community Distribution (BarChart) */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Population by Primary Hub</h3>
                <span className="text-[11px] text-slate-400">Comparison of major population centers</span>
              </div>
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.communityDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                    <YAxis dataKey="communityName" type="category" stroke="#94A3B8" fontSize={11} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                    <Bar dataKey="population" name="Population" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SEARCH & TRANSPARENCY REGISTRY */}
      {/* ========================================================= */}
      {activeTab === 'search' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-400" />
              <span>Community Directory & Search</span>
            </h2>
            <p className="text-xs text-slate-400">
              Search by Family Name, Lineage, Village, or Application ID. {adminRoleMode === 'Public' ? 'Personal contact information is automatically redacted for privacy.' : 'Full administrative view enabled.'}
            </p>
          </div>

          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Family Lineage (Haokip, Kipgen), Village, or ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <select
              value={searchStatusFilter}
              onChange={(e) => setSearchStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review</option>
              <option value="Correction Requested">Correction Requested</option>
            </select>

            <select
              value={searchCouncilFilter}
              onChange={(e) => setSearchCouncilFilter(e.target.value)}
              className="px-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs"
            >
              <option value="ALL">All Councils</option>
              <option value="Northeast India Hills Regional Council">Northeast India Hills</option>
              <option value="Northern Galilee Regional Council">Northern Galilee Council</option>
              <option value="Judea & Samaria Regional Council">Judea & Samaria Council</option>
              <option value="Central Israel Olim Communities">Central Israel Olim</option>
            </select>
          </div>

          {/* Search Results Table */}
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900/60">
                  <th className="p-4">App ID</th>
                  <th className="p-4">Head of Household</th>
                  <th className="p-4">Family Lineage</th>
                  <th className="p-4">Village / Town</th>
                  <th className="p-4">Members</th>
                  <th className="p-4">Contact (Masked)</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {searchResults.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  searchResults.map((rec) => (
                    <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-400">{rec.id}</td>
                      <td className="p-4 font-semibold text-white">
                        {rec.headOfHousehold}
                        {rec.hebrewName && <span className="block text-[11px] text-amber-300 font-serif">{rec.hebrewName}</span>}
                      </td>
                      <td className="p-4 text-slate-300">{rec.clanName}</td>
                      <td className="p-4 text-slate-300">
                        {rec.village}
                        <span className="block text-[10px] text-slate-500">{rec.regionalCouncil.split(' ')[0]}</span>
                      </td>
                      <td className="p-4 font-bold text-white">{rec.memberCount}</td>
                      <td className="p-4 font-mono text-[11px] text-slate-400">
                        {rec.contactPhone || 'N/A'}
                        <span className="block">{rec.contactEmail || ''}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          rec.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          rec.status === 'Under Review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: ADMIN WORKFLOW PORTAL */}
      {/* ========================================================= */}
      {activeTab === 'admin' && (
        <div className="space-y-8 animate-fade-in">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#1E1B4B] to-slate-900 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Administrative Portal</span>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Active Role Mode: {adminRoleMode}</span>
              </h2>
              <p className="text-xs text-slate-300">
                {adminRoleMode === 'Public' && 'Please switch to Regional Admin or Global Admin mode in the header or switcher below to execute governance actions.'}
                {adminRoleMode === 'Regional Admin' && 'Reviewing submissions within your assigned regional jurisdiction. Approve, request corrections, or merge duplicates.'}
                {adminRoleMode === 'Global Admin' && 'Nationwide governance oversight. Compare councils, generate comprehensive exports, and review audit logs.'}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleExportReport('CSV', 'Nationwide_Census')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => handleExportReport('Excel', 'Nationwide_Census')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel/PDF</span>
              </button>
            </div>
          </div>

          {/* Admin Table of Submissions with Review Action Buttons */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Census Submission Review Queue</h3>
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900/60">
                    <th className="p-4">ID & Date</th>
                    <th className="p-4">Household & Lineage</th>
                    <th className="p-4">Jurisdiction</th>
                    <th className="p-4">Members</th>
                    <th className="p-4">Aliyah Status</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Governance Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {adminSubmissions.map((rec) => (
                    <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono">
                        <span className="font-bold text-amber-400">{rec.id}</span>
                        <span className="block text-[10px] text-slate-400">{rec.submissionDate}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{rec.headOfHousehold}</div>
                        <div className="text-[11px] text-amber-300 font-serif">{rec.hebrewName}</div>
                        <span className="inline-block px-2 py-0.5 mt-1 rounded bg-white/5 text-[10px] text-slate-300">Lineage: {rec.clanName}</span>
                      </td>
                      <td className="p-4 text-slate-300">
                        <div className="font-semibold text-white">{rec.village}</div>
                        <div className="text-[10px] text-slate-400">{rec.regionalCouncil}</div>
                      </td>
                      <td className="p-4 font-bold text-white">{rec.memberCount}</td>
                      <td className="p-4 text-[11px] text-slate-300">{rec.aliyahStatus}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          rec.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          rec.status === 'Under Review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          rec.status === 'Merged' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                          'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => { setShowReviewModal(rec); setReviewNotesInput(rec.reviewNotes || ''); }}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold text-[11px]"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => { setShowMergeModal(rec); setMergeTargetId(''); }}
                            className="px-2.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 font-semibold text-[11px]"
                          >
                            Merge
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: SUBMIT CENSUS HOUSEHOLD FORM (GUIDED GOV EXPERIENCE) */}
      {/* ========================================================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto select-none">
          <div className="w-full max-w-4xl bg-[#0B132B] border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col max-h-[94vh] my-auto overflow-hidden">
            
            {/* TOP HEADER */}
            <div className="bg-gradient-to-r from-slate-900 via-[#0F172A] to-[#1E1B4B] border-b border-white/10 p-5 sm:p-6 relative">
              <button
                onClick={() => { setShowSubmitModal(false); setSubmitSuccessRecord(null); setRegStep(0); }}
                className="absolute top-5 right-5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
              >
                Close ×
              </button>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                  🏛
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Bnei Menashe Council India</span>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">Official Community Census 2026–2027</h3>
                  <p className="text-xs text-slate-300 font-light max-w-xl">
                    Please complete your household registration. All information is kept secure and used only for official community purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* PROGRESS BAR */}
            {!submitSuccessRecord && !isSubmittingCensus && regStep > 0 && (
              <div className="bg-slate-900/90 border-b border-white/10 px-4 py-3 overflow-x-auto scrollbar-none">
                <div className="flex items-center justify-between min-w-[620px] max-w-3xl mx-auto px-2">
                  {[
                    { step: 1, label: 'Community', icon: '🏛' },
                    { step: 2, label: 'Identity', icon: '🪪' },
                    { step: 3, label: 'Personal Details', icon: '👤' },
                    { step: 4, label: 'Family', icon: '🌳' },
                    { step: 5, label: 'Documents', icon: '📁' },
                    { step: 6, label: 'Religious Info', icon: '🕎' },
                    { step: 7, label: 'Members', icon: '👨‍👩‍👧‍👦' },
                    { step: 8, label: 'Review', icon: '📋' }
                  ].map((s, idx, arr) => {
                    const isActive = regStep === s.step;
                    const isDone = regStep > s.step;
                    return (
                      <React.Fragment key={s.step}>
                        <button
                          onClick={() => setRegStep(s.step)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all ${
                            isActive
                              ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold shadow-md scale-105'
                              : isDone
                              ? 'text-emerald-400 font-medium hover:bg-white/5'
                              : 'text-slate-500 hover:text-slate-300 font-medium'
                          }`}
                        >
                          <span className="text-sm">{isDone ? '✓' : s.icon}</span>
                          <span className="text-xs whitespace-nowrap">{s.label}</span>
                        </button>
                        {idx < arr.length - 1 && (
                          <span className="text-slate-600 font-light text-xs shrink-0">↓</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
              {/* SUBMITTING STATE */}
              {isSubmittingCensus && (
                <div className="py-16 space-y-6 text-center max-w-md mx-auto">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping" />
                    <div className="w-full h-full rounded-full bg-amber-500/10 border border-amber-500 flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-extrabold text-white">Submitting your Community Census...</h4>
                    <p className="text-xs text-slate-400">
                      Cryptographically signing and registering your household with Bnei Menashe Council India registry servers.
                    </p>
                  </div>
                </div>
              )}

              {/* SUCCESS STATE */}
              {!isSubmittingCensus && submitSuccessRecord && (
                <div className="py-8 space-y-8 max-w-2xl mx-auto animate-fade-in">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto shadow-2xl">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                      <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Official Sealing Complete
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Your information has been safely recorded.</h4>
                      <p className="text-sm text-slate-300 font-light max-w-lg mx-auto leading-relaxed">
                        Thank you. Your household information helps strengthen the future of our community and preserves our sacred heritage for generations to come.
                      </p>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-2xl space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Official Reference Number</span>
                        <div className="text-lg sm:text-xl font-mono font-black text-amber-400 mt-0.5">{submitSuccessRecord.id}</div>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold self-start sm:self-center">
                        Active Verification
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-slate-400 font-medium">Assigned Regional Council</span>
                        <div className="font-bold text-white text-sm">{submitSuccessRecord.regionalCouncil}</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-slate-400 font-medium">Estimated Review Time</span>
                        <div className="font-bold text-emerald-400 text-sm">5 to 7 business days</div>
                      </div>
                    </div>

                    {/* What Happens Next Section */}
                    <div className="space-y-3 pt-2">
                      <h5 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <span>💡</span> What Happens Next?
                      </h5>
                      <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-light">
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                          <span><strong>Rabbinic & Regional Review:</strong> Your local Gabbai and Regional Council coordinator will verify your household details and lineage notes within 5–7 business days.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                          <span><strong>Official Certificate Issuance:</strong> Once approved, your cryptographic Community Certificate (with secure QR code) will be available to download right here on your dashboard.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                          <span><strong>Community & Welfare Support:</strong> Your verified record connects your family with Hebrew educational programs, holiday distributions, and Aliyah coordination desks.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button
                      onClick={() => {
                        setShowSubmitModal(false);
                        setShowReceiptModal(true);
                        setReceiptRecord(submitSuccessRecord);
                      }}
                      className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2.5 scale-105"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Official Receipt</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowSubmitModal(false);
                        setSubmitSuccessRecord(null);
                        setRegStep(0);
                      }}
                      className="flex-1 py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10 transition-all flex items-center justify-center"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 0: WELCOMING INTRODUCTION SCREEN */}
              {!isSubmittingCensus && !submitSuccessRecord && regStep === 0 && (
                <div className="py-4 space-y-8 max-w-2xl mx-auto animate-fade-in">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-500/40 flex items-center justify-center mx-auto shadow-2xl text-3xl">
                      🤝
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Guided Community Experience
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Welcome to the Community Census</h4>
                    <p className="text-sm text-slate-300 font-light max-w-lg mx-auto leading-relaxed">
                      Shalom! We are honored to welcome your family to the Bnei Menashe Council India 2026–2027 registration. This guided process is crafted to be warm, respectful, and easy for every household member.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2 shadow-xl flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="text-2xl">⏱️</div>
                        <h5 className="text-sm font-bold text-white">Quick & Guided</h5>
                        <p className="text-xs text-slate-300 font-light leading-relaxed">
                          Takes approximately <strong>5 to 10 minutes</strong>. We walk with you through 7 friendly, bite-sized steps.
                        </p>
                      </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2 shadow-xl flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="text-2xl">💾</div>
                        <h5 className="text-sm font-bold text-white">Automatically Saved</h5>
                        <p className="text-xs text-slate-300 font-light leading-relaxed">
                          Your progress is <strong>saved automatically</strong> at every step. You can pause and return at your convenience anytime.
                        </p>
                      </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2 shadow-xl flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="text-2xl">🔒</div>
                        <h5 className="text-sm font-bold text-white">Strictly Protected</h5>
                        <p className="text-xs text-slate-300 font-light leading-relaxed">
                          Personal information is <strong>securely encrypted</strong> and protected under strict council privacy standards.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/40 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                    <div className="space-y-1">
                      <h5 className="text-base font-extrabold text-white">Ready to begin your registration?</h5>
                      <p className="text-xs text-slate-300 font-light">
                        Click below when you are ready. We are here to support you every step of the way.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 shrink-0 scale-105"
                    >
                      <span>Begin Registration</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 1: YOUR COMMUNITY */}
              {!isSubmittingCensus && !submitSuccessRecord && regStep === 1 && (
                <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Step 1 of 8 • Community Home</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">Where is your community located?</h4>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-xs text-slate-200 leading-relaxed space-y-1 shadow-md">
                      <p>
                        Sharing your regional council and local synagogue helps us connect your household with nearby community leaders (Gabbaim) for local announcements, holiday distributions, and welfare programs.
                      </p>
                      <p className="text-amber-300/90 font-medium pt-1">
                        💡 Don&apos;t worry if you&apos;re between congregations—simply select the nearest synagogue or town.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-5 shadow-xl">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-200">Regional Council</label>
                      <select
                        value={formCouncil}
                        onChange={(e) => { setFormCouncil(e.target.value); handleSaveDraft(); }}
                        className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 shadow-inner"
                      >
                        <option value="Northeast India Hills Regional Council">Northeast India Hills Regional Council (Manipur / Mizoram)</option>
                        <option value="Northern Galilee Regional Council">Northern Galilee Regional Council (Nof HaGalil / Ma'alot)</option>
                        <option value="Judea & Samaria Regional Council">Judea & Samaria Regional Council (Kiryat Arba / Sderot)</option>
                        <option value="Central Israel Olim Communities">Central Israel Olim Communities (Jerusalem / Tel Aviv)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-200">Community / Town</label>
                      <select
                        value={formVillage}
                        onChange={(e) => { setFormVillage(e.target.value); setFormCommunity(`${e.target.value} Beith Shalom Congregation`); handleSaveDraft(); }}
                        className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                      >
                        <option value="Churachandpur">Churachandpur (Lamka)</option>
                        <option value="Aizawl">Aizawl</option>
                        <option value="Kangpokpi">Kangpokpi</option>
                        <option value="Moreh">Moreh Border Town</option>
                        <option value="Nof HaGalil">Nof HaGalil (Upper Nazareth)</option>
                        <option value="Kiryat Arba">Kiryat Arba</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-200">Synagogue / Congregation</label>
                      <input
                        type="text"
                        value={formSynagogue}
                        onChange={(e) => { setFormSynagogue(e.target.value); handleSaveDraft(); }}
                        placeholder="e.g. Beith Shalom Synagogue"
                        className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-200">Branch / District</label>
                      <input
                        type="text"
                        value={formBranch}
                        onChange={(e) => { setFormBranch(e.target.value); handleSaveDraft(); }}
                        placeholder="e.g. Manipur South Hill District"
                        className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: YOUR IDENTIFICATION */}
              {!isSubmittingCensus && !submitSuccessRecord && regStep === 2 && (
                <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Great! Your community jurisdiction has been saved.</strong> Let&apos;s continue with your personal identification.</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Step 2 of 8 • Personal Names</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">What is your official name?</h4>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-xs text-slate-200 leading-relaxed space-y-1 shadow-md">
                      <p>
                        We ask for your legal name exactly as it appears on official government records (such as your Aadhaar, Voter ID, or Passport). This ensures your official Community Certificate matches your legal identity for Aliyah verification.
                      </p>
                      <p className="text-amber-300/90 font-medium pt-1">
                        💡 If you have a Hebrew name, we would love to include it on your certificate below!
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-5 shadow-xl">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-200">Full Name (Primary Head of Household)</label>
                      <input
                        type="text"
                        value={formHead}
                        onChange={(e) => { setFormHead(e.target.value); handleSaveDraft(); }}
                        placeholder="e.g. Lunkholal Haokip"
                        className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                      <p className="text-[11px] text-amber-300/80 font-light">💡 Use the same spelling as your Aadhaar or Passport.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Surname / Family Name</label>
                        <input
                          type="text"
                          value={formSurname}
                          onChange={(e) => { setFormSurname(e.target.value); handleSaveDraft(); }}
                          placeholder="e.g. Haokip"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Given Name</label>
                        <input
                          type="text"
                          value={formGivenName}
                          onChange={(e) => { setFormGivenName(e.target.value); handleSaveDraft(); }}
                          placeholder="e.g. Lunkholal"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-200">Hebrew Name (If Assigned)</label>
                      <input
                        type="text"
                        value={formHebrew}
                        onChange={(e) => { setFormHebrew(e.target.value); handleSaveDraft(); }}
                        placeholder="e.g. יוסף הוקיפ"
                        className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white font-serif text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PERSONAL DETAILS */}
              {!isSubmittingCensus && !submitSuccessRecord && regStep === 3 && (
                <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>You&apos;re making good progress!</strong> Your legal names are recorded safely. Next up are demographic details.</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Step 3 of 8 • Demographic Data</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">Tell us a little about yourself</h4>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-xs text-slate-200 leading-relaxed space-y-1 shadow-md">
                      <p>
                        Demographic details like date of birth and nationality allow community coordinators to arrange age-appropriate educational support for youth, eldercare programs, and accurate Israeli Aliyah paperwork.
                      </p>
                      <p className="text-amber-300/90 font-medium pt-1">
                        💡 Your private phone number and email are kept strictly confidential and only used by official council coordinators.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-5 shadow-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Sex</label>
                        <select
                          value={formSex}
                          onChange={(e) => { setFormSex(e.target.value as any); handleSaveDraft(); }}
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-slate-200">Date of Birth</label>
                          <span className="text-[11px] font-bold text-emerald-400">Calculated Age: {calculatedAge} yrs</span>
                        </div>
                        <input
                          type="date"
                          value={formDob}
                          onChange={(e) => { setFormDob(e.target.value); handleSaveDraft(); }}
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Marital Status</label>
                        <select
                          value={formMaritalStatus}
                          onChange={(e) => { setFormMaritalStatus(e.target.value); handleSaveDraft(); }}
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        >
                          <option value="Married">Married</option>
                          <option value="Single">Single</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Divorced">Divorced</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Nationality</label>
                        <select
                          value={formNationality}
                          onChange={(e) => { setFormNationality(e.target.value); handleSaveDraft(); }}
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        >
                          <option value="Indian">Indian</option>
                          <option value="Israeli">Israeli</option>
                          <option value="Dual Indian/Israeli">Dual Indian / Israeli</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Country of Residence</label>
                        <select
                          value={formCountry}
                          onChange={(e) => { setFormCountry(e.target.value as any); handleSaveDraft(); }}
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        >
                          <option value="India">India</option>
                          <option value="Israel">Israel</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Current Residence</label>
                        <input
                          type="text"
                          value={formVillage}
                          onChange={(e) => { setFormVillage(e.target.value); handleSaveDraft(); }}
                          placeholder="e.g. Churachandpur or Nof HaGalil"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Contact Phone (Private)</label>
                        <input
                          type="text"
                          value={formPhone}
                          onChange={(e) => { setFormPhone(e.target.value); handleSaveDraft(); }}
                          placeholder="+91 or +972..."
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Contact Email (Private)</label>
                        <input
                          type="email"
                          value={formEmail}
                          onChange={(e) => { setFormEmail(e.target.value); handleSaveDraft(); }}
                          placeholder="applicant@example.com"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: FAMILY LINEAGE */}
              {!isSubmittingCensus && !submitSuccessRecord && regStep === 4 && (
                <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Wonderful! Personal details saved automatically.</strong> Now let&apos;s record your family roots and lineage.</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Step 4 of 8 • Ancestral Lineage</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">Your Family Roots & Lineage</h4>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-xs text-slate-200 leading-relaxed space-y-1 shadow-md">
                      <p>
                        Honoring our ancestors is at the heart of the Bnei Menashe identity. Recording your parents&apos; names and ancestral lineage (such as Haokip, Kipgen, Lhungdim, or Guite) preserves our shared history in official tribal archives.
                      </p>
                      <p className="text-amber-300/90 font-medium pt-1">
                        💡 Our registry can even help identify historical tribal connections based on your family lineage selection!
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-5 shadow-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Father&apos;s Name</label>
                        <input
                          type="text"
                          value={formFatherName}
                          onChange={(e) => { setFormFatherName(e.target.value); handleSaveDraft(); }}
                          placeholder="e.g. Seikhohao Haokip"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Mother&apos;s Name</label>
                        <input
                          type="text"
                          value={formMotherName}
                          onChange={(e) => { setFormMotherName(e.target.value); handleSaveDraft(); }}
                          placeholder="e.g. Lhingneihat Haokip"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Family Lineage / Surname</label>
                        <select
                          value={formClan}
                          onChange={(e) => { setFormClan(e.target.value); handleSaveDraft(); }}
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        >
                          <option value="Haokip">Haokip</option>
                          <option value="Kipgen">Kipgen</option>
                          <option value="Lhungdim">Lhungdim</option>
                          <option value="Sitlhou">Sitlhou</option>
                          <option value="Doungel">Doungel</option>
                          <option value="Singson">Singson</option>
                          <option value="Guite">Guite</option>
                          <option value="Thangjom">Thangjom</option>
                          <option value="Chhangte">Chhangte</option>
                          <option value="Ralte">Ralte</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Village of Origin</label>
                        <input
                          type="text"
                          value={formVillageOrigin}
                          onChange={(e) => { setFormVillageOrigin(e.target.value); handleSaveDraft(); }}
                          placeholder="e.g. Saikot, Churachandpur"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-200">Current Household Head</label>
                      <input
                        type="text"
                        value={formCurrentHead}
                        onChange={(e) => { setFormCurrentHead(e.target.value); handleSaveDraft(); }}
                        placeholder="Self or Father"
                        className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                      <span className="text-lg">💡</span>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-amber-300">Suggested Lineage Match Found</span>
                        <p className="text-[11px] text-slate-300">
                          Based on your lineage selection ({formClan}), our registry suggests linkage with the historical Manasseh tribal archives in Churachandpur District.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: DOCUMENTS */}
              {!isSubmittingCensus && !submitSuccessRecord && regStep === 5 && (
                <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Great job! Your family lineage is saved.</strong> Only a few more steps remain!</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Step 5 of 8 • Document Verification</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">Official Identity Verification</h4>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-xs text-slate-200 leading-relaxed space-y-1 shadow-md">
                      <p>
                        Government identification numbers help verify your household&apos;s unique identity and speed up verification by community rabbinic leaders and Aliyah coordinators.
                      </p>
                      <p className="text-amber-300 font-bold pt-1">
                        🌟 Reassurance: Document uploads are completely optional right now! If you don&apos;t have your ID or passport handy today, you can skip this step and attach documents later at any time.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-5 shadow-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Passport Number (Optional)</label>
                        <input
                          type="text"
                          value={formPassportNo}
                          onChange={(e) => { setFormPassportNo(e.target.value); handleSaveDraft(); }}
                          placeholder="Z1234567"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Issue Date</label>
                        <input
                          type="date"
                          value={formPassportIssue}
                          onChange={(e) => { setFormPassportIssue(e.target.value); handleSaveDraft(); }}
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Expiry Date</label>
                        <input
                          type="date"
                          value={formPassportExpiry}
                          onChange={(e) => { setFormPassportExpiry(e.target.value); handleSaveDraft(); }}
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Aadhaar Number (Optional)</label>
                        <input
                          type="text"
                          value={formAadhaarNo}
                          onChange={(e) => { setFormAadhaarNo(e.target.value); handleSaveDraft(); }}
                          placeholder="XXXX XXXX XXXX"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Other Government ID (Optional)</label>
                        <input
                          type="text"
                          value={formOtherId}
                          onChange={(e) => { setFormOtherId(e.target.value); handleSaveDraft(); }}
                          placeholder="Voter ID / Teudat Zehut"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-amber-500/50 bg-slate-950/40 text-center space-y-2 cursor-pointer transition-all">
                      <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="text-xs font-bold text-white">Attach Copies of Documents (Optional)</div>
                      <p className="text-[11px] text-slate-400 font-light">
                        Drag & drop copies of Passport, Aadhaar, or Teudat Zehut here, or click to attach files later.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: RELIGIOUS INFO */}
              {!isSubmittingCensus && !submitSuccessRecord && regStep === 6 && (
                <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Excellent progress!</strong> Optional documents noted. Let&apos;s look at synagogue life and Aliyah readiness.</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Step 6 of 8 • Judaism & Aliyah</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">Synagogue Life & Aliyah Journey</h4>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-xs text-slate-200 leading-relaxed space-y-1 shadow-md">
                      <p>
                        We want to support your spiritual journey and Aliyah goals. Whether you are living in Israel, approved for flights, or actively practicing in India, this helps our coordinators guide you every step of the way.
                      </p>
                      <p className="text-amber-300/90 font-medium pt-1">
                        💡 There are no wrong answers—every family&apos;s personal journey is respected and celebrated.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-5 shadow-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Hebrew Name</label>
                        <input
                          type="text"
                          value={formHebrew}
                          onChange={(e) => { setFormHebrew(e.target.value); handleSaveDraft(); }}
                          placeholder="יוסף הוקיפ"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white font-serif text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Year Began Practicing Judaism</label>
                        <input
                          type="text"
                          value={formJudaismDate}
                          onChange={(e) => { setFormJudaismDate(e.target.value); handleSaveDraft(); }}
                          placeholder="e.g. 1998 or Birth"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Synagogue</label>
                        <input
                          type="text"
                          value={formSynagogue}
                          onChange={(e) => { setFormSynagogue(e.target.value); handleSaveDraft(); }}
                          placeholder="Beith Shalom Synagogue"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-200">Rabbi / Community Leader</label>
                        <input
                          type="text"
                          value={formRabbi}
                          onChange={(e) => { setFormRabbi(e.target.value); handleSaveDraft(); }}
                          placeholder="Rabbi Yehuda Gin / Rabbi Hanoch Avichail"
                          className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-200">Aliyah Status</label>
                      <select
                        value={formAliyah}
                        onChange={(e) => { setFormAliyah(e.target.value); handleSaveDraft(); }}
                        className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold text-amber-300"
                      >
                        <option value="Residing in India Hills">Residing in India Hills (Manipur / Mizoram)</option>
                        <option value="Pending Aliyah Processing">Pending Aliyah Verification & Processing</option>
                        <option value="Approved Flight Processing">Approved Flight Processing</option>
                        <option value="Residing in Israel (Aliyah Completed)">Residing in Israel (Aliyah Completed)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-200">Community Notes</label>
                      <textarea
                        rows={2}
                        value={formReligiousNotes}
                        onChange={(e) => { setFormReligiousNotes(e.target.value); handleSaveDraft(); }}
                        placeholder="Add details regarding Hebrew education or Torah study classes..."
                        className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: HOUSEHOLD MEMBERS */}
              {!isSubmittingCensus && !submitSuccessRecord && regStep === 7 && (
                <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Almost done! Religious information saved.</strong> Only a few more steps remain! Now list your household members.</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Step 7 of 8 • Household Roster</span>
                      <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">Who lives in your household? ({householdMembersList.length} Members)</h4>
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-xs text-slate-200 leading-relaxed space-y-1 shadow-md max-w-xl">
                        <p>
                          Please list your spouse, children, parents, or other family members living under your roof. Accounting for every soul ensures no child or elder is left behind in welfare and community planning.
                        </p>
                        <p className="text-amber-300/90 font-medium pt-1">
                          💡 You can easily add newborns or update family members later whenever your household changes.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddMemberModal(true)}
                      className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2 shrink-0 transition-all self-start sm:self-center"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>+ Add Household Member</span>
                    </button>
                  </div>

                  {/* Elegant Cards List */}
                  <div className="space-y-3">
                    {householdMembersList.length === 0 ? (
                      <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/10 text-center space-y-3">
                        <Users className="w-10 h-10 text-slate-500 mx-auto" />
                        <div className="text-sm font-bold text-white">0 Additional Members Listed</div>
                        <p className="text-xs text-slate-400 font-light">
                          Click &ldquo;+ Add Household Member&rdquo; above to register family members living under your roof.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {householdMembersList.map((mem) => (
                          <div key={mem.id} className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all flex items-start justify-between gap-3 shadow-md">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                                  {mem.relationship}
                                </span>
                                <span className="text-xs text-slate-400">{mem.sex} • DOB: {mem.dob}</span>
                              </div>
                              <div className="text-sm font-bold text-white flex items-center gap-2">
                                <span>{mem.name}</span>
                                {mem.hebrewName && <span className="font-serif text-amber-400 text-xs font-normal">({mem.hebrewName})</span>}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Aliyah: <span className="text-slate-200 font-medium">{mem.aliyahStatus}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setHouseholdMembersList(l => l.filter(x => x.id !== mem.id));
                                handleSaveDraft();
                              }}
                              className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                              title="Remove member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
                    <label className="text-xs font-bold text-slate-200">Local Admin Notes (Optional)</label>
                    <textarea
                      rows={2}
                      value={formAdminNotes}
                      onChange={(e) => { setFormAdminNotes(e.target.value); handleSaveDraft(); }}
                      placeholder="Add any information that may help your Local Administrator..."
                      className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* STEP 8: REVIEW PAGE */}
              {!isSubmittingCensus && !submitSuccessRecord && regStep === 8 && (
                <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Fantastic! All 7 sections completed.</strong> Please review your household details below before final submission.</span>
                  </div>

                  <div className="space-y-3 text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Step 8 of 8 • Final Review</span>
                    <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">Let&apos;s review your registration</h4>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-xs text-slate-200 leading-relaxed space-y-1 shadow-md">
                      <p>
                        Please take a relaxed moment to review all the details below. If anything needs a quick adjustment, simply click the friendly &apos;Edit&apos; link on any section.
                      </p>
                      <p className="text-amber-300/90 font-medium pt-1">
                        💡 Once submitted, your record will be assigned an official Application ID and sent for verification by your local Gabbai.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Summary 1: Community */}
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <span>🏛</span> Community
                        </span>
                        <button type="button" onClick={() => setRegStep(1)} className="text-[11px] text-blue-400 font-bold hover:underline">
                          Edit
                        </button>
                      </div>
                      <div className="text-xs space-y-1 text-slate-300">
                        <div><span className="text-slate-500">Council:</span> <strong className="text-white">{formCouncil}</strong></div>
                        <div><span className="text-slate-500">Town:</span> <strong className="text-white">{formVillage}</strong></div>
                        <div><span className="text-slate-500">Synagogue:</span> <strong className="text-white">{formSynagogue}</strong></div>
                      </div>
                    </div>

                    {/* Summary 2: Personal Details */}
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <span>👤</span> Personal Details
                        </span>
                        <button type="button" onClick={() => setRegStep(2)} className="text-[11px] text-blue-400 font-bold hover:underline">
                          Edit
                        </button>
                      </div>
                      <div className="text-xs space-y-1 text-slate-300">
                        <div><span className="text-slate-500">Head:</span> <strong className="text-white">{formHead || `${formGivenName} ${formSurname}`}</strong> {formHebrew && <span className="font-serif text-amber-400">({formHebrew})</span>}</div>
                        <div><span className="text-slate-500">Sex / Age:</span> <strong className="text-white">{formSex} • {calculatedAge} yrs</strong></div>
                        <div><span className="text-slate-500">Contact:</span> <strong className="text-white">{formPhone}</strong></div>
                      </div>
                    </div>

                    {/* Summary 3: Family Lineage & Documents */}
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <span>🌳</span> Lineage & Documents
                        </span>
                        <button type="button" onClick={() => setRegStep(4)} className="text-[11px] text-blue-400 font-bold hover:underline">
                          Edit
                        </button>
                      </div>
                      <div className="text-xs space-y-1 text-slate-300">
                        <div><span className="text-slate-500">Lineage:</span> <strong className="text-white">{formClan}</strong></div>
                        <div><span className="text-slate-500">Father:</span> <strong className="text-white">{formFatherName || 'Not listed'}</strong></div>
                        <div><span className="text-slate-500">Passport:</span> <strong className="font-mono text-white">{formPassportNo || 'Uploaded copy'}</strong></div>
                      </div>
                    </div>

                    {/* Summary 4: Household Members */}
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <span>👨‍👩‍👧‍👦</span> Family Members
                        </span>
                        <button type="button" onClick={() => setRegStep(7)} className="text-[11px] text-blue-400 font-bold hover:underline">
                          Edit
                        </button>
                      </div>
                      <div className="text-xs space-y-1 text-slate-300">
                        <div><span className="text-slate-500">Total Roster:</span> <strong className="text-white">{householdMembersList.length + 1} Household Souls</strong></div>
                        <div><span className="text-slate-500">Aliyah Status:</span> <strong className="text-amber-400">{formAliyah}</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Warnings Card */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-xs text-slate-300">
                      By submitting this census record, you confirm all household details are accurate to support Bnei Menashe Council India governance and welfare planning.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* STICKY BOTTOM ACTION BAR */}
            {!submitSuccessRecord && !isSubmittingCensus && (
              <div className="border-t border-white/10 bg-[#0F172A]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={regStep === 0}
                    onClick={() => setRegStep(s => Math.max(0, s - 1))}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xs border border-white/10 transition-all"
                  >
                    ← Previous
                  </button>
                  {regStep > 0 && (
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 text-xs font-semibold text-emerald-300 border border-emerald-500/30 shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Great! Information saved automatically ({draftSavedText})</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {regStep === 0 ? (
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 scale-105"
                    >
                      <span>Begin Registration</span>
                      <span>→</span>
                    </button>
                  ) : regStep < 8 ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveDraft();
                        setRegStep(s => Math.min(8, s + 1));
                      }}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5"
                    >
                      <span>Save & Continue</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSubmitCensusForm()}
                      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-black text-xs shadow-xl transition-all flex items-center gap-2 scale-105"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Submit Census Application</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD HOUSEHOLD MEMBER MODAL */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#0F172A] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Add Household Member</span>
              </h4>
              <button onClick={() => setShowAddMemberModal(false)} className="text-xs text-slate-400 hover:text-white font-semibold">
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Relationship to Head</label>
                <select
                  value={newMemberRel}
                  onChange={(e) => setNewMemberRel(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent / Elder</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other Relative">Other Relative</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Boipu Haokip"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                </input>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Hebrew Name</label>
                  <input
                    type="text"
                    value={newMemberHebrew}
                    onChange={(e) => setNewMemberHebrew(e.target.value)}
                    placeholder="דוד הוקיפ"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-serif"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Sex</label>
                  <select
                    value={newMemberSex}
                    onChange={(e) => setNewMemberSex(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Date of Birth</label>
                  <input
                    type="date"
                    value={newMemberDob}
                    onChange={(e) => setNewMemberDob(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Passport Number</label>
                  <input
                    type="text"
                    value={newMemberPassport}
                    onChange={(e) => setNewMemberPassport(e.target.value)}
                    placeholder="Z0000000"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Aliyah Status</label>
                <select
                  value={newMemberAliyah}
                  onChange={(e) => setNewMemberAliyah(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="Residing in India Hills">Residing in India Hills</option>
                  <option value="Pending Aliyah Processing">Pending Aliyah Processing</option>
                  <option value="Approved Flight Processing">Approved Flight Processing</option>
                  <option value="Residing in Israel">Residing in Israel</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!newMemberName.trim()) return;
                  setHouseholdMembersList(l => [...l, {
                    id: 'm-' + Date.now(),
                    relationship: newMemberRel,
                    name: newMemberName,
                    hebrewName: newMemberHebrew,
                    sex: newMemberSex,
                    dob: newMemberDob,
                    passport: newMemberPassport || 'N/A',
                    aliyahStatus: newMemberAliyah
                  }]);
                  setNewMemberName('');
                  setNewMemberHebrew('');
                  setShowAddMemberModal(false);
                }}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 text-xs shadow-md"
              >
                Save Member to Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CHECK APPLICATION STATUS */}
      {/* ========================================================= */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#0F172A] border border-blue-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" />
                <span>Track Application Status</span>
              </h3>
              <button onClick={() => setShowStatusModal(false)} className="text-xs text-slate-400 hover:text-white font-semibold">
                Close
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setLookupSearched(true);
              const found = CensusService.lookupSubmission(statusLookupInput);
              setLookupResult(found || null);
            }} className="space-y-3">
              <label className="text-xs text-slate-300 font-medium">Enter Application ID or Head of Household Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={statusLookupInput}
                  onChange={(e) => setStatusLookupInput(e.target.value)}
                  placeholder="e.g. CEN-2026-8401 or Lunkholal"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-blue-500 font-bold text-slate-950 text-xs shadow-md"
                >
                  Lookup
                </button>
              </div>
            </form>

            {lookupSearched && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                {lookupResult ? (
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="font-mono font-bold text-amber-400">{lookupResult.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lookupResult.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {lookupResult.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Head of Household:</span>
                      <strong className="text-white ml-1">{lookupResult.headOfHousehold}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Village & Council:</span>
                      <span className="text-white ml-1">{lookupResult.village} • {lookupResult.regionalCouncil}</span>
                    </div>
                    {lookupResult.reviewNotes && (
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 italic">
                        &ldquo;{lookupResult.reviewNotes}&rdquo;
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-400 text-xs">
                    No matching application found for &ldquo;{statusLookupInput}&rdquo;. Please verify ID.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DOWNLOAD OFFICIAL CENSUS RECEIPT */}
      {/* ========================================================= */}
      {showReceiptModal && receiptRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#0F172A] border border-amber-500/50 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>Official Census Verification Receipt</span>
              </h3>
              <button onClick={() => setShowReceiptModal(false)} className="text-xs text-slate-400 hover:text-white font-semibold">
                Close
              </button>
            </div>

            {/* Glassmorphic Printable Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#1E1B4B] border-2 border-amber-500/40 space-y-4 shadow-inner relative">
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">Bnei Menashe Council India</div>
                  <div className="text-base font-black text-white mt-0.5">Jubilee Census Certificate</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-emerald-400">{receiptRecord.id}</div>
                  <div className="text-[10px] text-slate-400">{receiptRecord.submissionDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Head of Household</span>
                  <strong className="text-white">{receiptRecord.headOfHousehold}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Hebrew Name</span>
                  <strong className="text-amber-300 font-serif">{receiptRecord.hebrewName || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Family / Lineage</span>
                  <strong className="text-white">{receiptRecord.clanName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Household Size</span>
                  <strong className="text-white">{receiptRecord.memberCount} Members</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Regional Council Jurisdiction</span>
                  <strong className="text-white">{receiptRecord.regionalCouncil}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Cryptographic Verification Token</span>
                  <span className="font-mono text-xs font-bold text-amber-400">{receiptRecord.verificationToken}</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xs font-mono text-emerald-400 border border-emerald-500/30">
                  QR
                </div>
              </div>
            </div>

            <button
              onClick={() => handleExportReport('PDF', `${receiptRecord.headOfHousehold}_Receipt`)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Printable PDF Certificate</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: LEARN ABOUT THE CENSUS */}
      {/* ========================================================= */}
      {showLearnModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#0F172A] border border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>About the 2026–2027 Jubilee Census</span>
              </h3>
              <button onClick={() => setShowLearnModal(false)} className="text-xs text-slate-400 hover:text-white font-semibold">
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Why participate?</strong> The official Bnei Menashe Council census serves as the central population registry for all members residing in Manipur, Mizoram, and Israel.
              </p>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="font-bold text-amber-400">Halachic Foundations</div>
                <p>
                  In accordance with Jewish tradition (Exodus 30:12), census tracking is conducted with dignity and holy intention, utilizing individual household records as representations of community strength and unity.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="font-bold text-emerald-400">Strict Data Privacy & RLS</div>
                <p>
                  Personal contact numbers and identification details remain encrypted under Row Level Security. Public transparent dashboards display only non-identifying aggregated demographic statistics.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowLearnModal(false)}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              Understand & Continue
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: ADMIN REVIEW DIALOG */}
      {/* ========================================================= */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#0F172A] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white">Review Application: {showReviewModal.id}</h3>
              <button onClick={() => setShowReviewModal(null)} className="text-xs text-slate-400 hover:text-white">
                Cancel
              </button>
            </div>

            <div className="text-xs space-y-2 text-slate-300">
              <div>Household: <strong className="text-white">{showReviewModal.headOfHousehold}</strong></div>
              <div>Current Status: <strong className="text-amber-400">{showReviewModal.status}</strong></div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Reviewer Notes / Instructions</label>
              <textarea
                value={reviewNotesInput}
                onChange={(e) => setReviewNotesInput(e.target.value)}
                placeholder="Add verification notes..."
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => handleAdminAction(showReviewModal.id, 'Approved')}
                className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Approve
              </button>
              <button
                onClick={() => handleAdminAction(showReviewModal.id, 'Correction Requested')}
                className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Correction
              </button>
              <button
                onClick={() => handleAdminAction(showReviewModal.id, 'Rejected')}
                className="py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-bold text-xs"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: MERGE DUPLICATES DIALOG */}
      {/* ========================================================= */}
      {showMergeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#0F172A] border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-purple-400" />
                <span>Merge Duplicate Candidate</span>
              </h3>
              <button onClick={() => setShowMergeModal(null)} className="text-xs text-slate-400 hover:text-white">
                Cancel
              </button>
            </div>

            <div className="text-xs space-y-2 text-slate-300">
              <div>Source Record to Merge: <strong className="text-white">{showMergeModal.id} ({showMergeModal.headOfHousehold})</strong></div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Target Primary Application ID</label>
              <input
                type="text"
                required
                value={mergeTargetId}
                onChange={(e) => setMergeTargetId(e.target.value)}
                placeholder="e.g. CEN-2026-8401"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            <button
              onClick={handleMergeAction}
              disabled={!mergeTargetId}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-md"
            >
              Confirm Merge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
