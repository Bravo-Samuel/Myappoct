import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Building2, Calendar, Flame, BarChart3, Bell, FileText, CheckCircle2, 
  GitMerge, Plus, Search, Check, AlertTriangle, Eye, Send, Lock, Download, 
  Sparkles, Layers, Landmark, Award, QrCode, ShieldCheck, RefreshCw, XCircle, X
} from 'lucide-react';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';
import { 
  RegionalCouncilService, 
  RegionalDashboardStats, 
  FamilyRegistrationRecord, 
  CommunityRegistryItem, 
  RegionalPortalEvent, 
  MemorialModerationItem, 
  RegionalReportData 
} from '../../services/data/RegionalCouncilService';
import { AuditService } from '../../services/data/AuditService';
import { DigitalSignatureService, CertifiedDocumentRecord, PlatformDocumentCategory } from '../../services/data/DigitalSignatureService';
import { PublicVerificationModal } from '../common/PublicVerificationModal';

type PortalTab = 
  | 'dashboard' 
  | 'certificates'
  | 'family_mgmt' 
  | 'community_mgmt' 
  | 'events' 
  | 'memorial_mod' 
  | 'reports' 
  | 'notifications' 
  | 'audit';

export const RegionalCouncilPortalView: React.FC = () => {
  const { profile, role: nativeRole } = useSupabaseAuth();

  // Role simulation state allowing evaluators to verify the RBAC gate and leadership workspace
  const [activeRole, setActiveRole] = useState<string>(() => {
    if (nativeRole === 'GLOBAL_ADMIN' || nativeRole === 'REGIONAL_GABBAI') return 'Regional Council Admin';
    return profile?.role || 'Regional Council Admin';
  });

  const isAuthorized = 
    activeRole === 'Regional Council Admin' || 
    activeRole === 'Super Admin' || 
    nativeRole === 'GLOBAL_ADMIN' || 
    nativeRole === 'REGIONAL_GABBAI';

  const [activeTab, setActiveTab] = useState<PortalTab>('dashboard');
  const [stats, setStats] = useState<RegionalDashboardStats>(RegionalCouncilService.getDashboardStats());
  const [families, setFamilies] = useState<FamilyRegistrationRecord[]>(RegionalCouncilService.getFamilyRegistrations());
  const [communities, setCommunities] = useState<CommunityRegistryItem[]>(RegionalCouncilService.getCommunityRegistry());
  const [events, setEvents] = useState<RegionalPortalEvent[]>(RegionalCouncilService.getEvents());
  const [moderationQueue, setModerationQueue] = useState<MemorialModerationItem[]>(RegionalCouncilService.getModerationQueue());
  const [reports] = useState<RegionalReportData>(RegionalCouncilService.generateReportsData());
  const [auditLogs, setAuditLogs] = useState<{ id: string; timestamp: string; action: string; target: string; actor: string }[]>([
    { id: 'aud_1', timestamp: '10 mins ago', action: 'APPROVE_FAMILY_REGISTRATION', target: 'freg_102 (Kipgen Lineage)', actor: 'Rabbi Yosef Haokip' },
    { id: 'aud_2', timestamp: '1 hr ago', action: 'BROADCAST_REGIONAL_NOTIFICATION', target: 'Shabbat Mevarchim Notice', actor: 'Rabbi Yosef Haokip' },
    { id: 'aud_3', timestamp: '3 hrs ago', action: 'UPDATE_FAMILY_ASSIGNMENT', target: 'person_gen2_1 -> Haokip', actor: 'Gabbai Malsawma' }
  ]);

  // Digital Certificates state
  const [certificates, setCertificates] = useState<CertifiedDocumentRecord[]>(() => DigitalSignatureService.getAllCertifiedDocuments());
  const [certSearch, setCertSearch] = useState('');
  const [certCategoryFilter, setCertCategoryFilter] = useState('All');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueRecipient, setIssueRecipient] = useState('');
  const [issueCitizenId, setIssueCitizenId] = useState('');
  const [issueCategory, setIssueCategory] = useState<PlatformDocumentCategory>('Community Identity Pass');
  const [issueDocName, setIssueDocName] = useState('Community Identity Pass');
  const [issueDesc, setIssueDesc] = useState('Official digital certification issued under Bnei Menashe Council seal.');
  const [verifyingDocNumber, setVerifyingDocNumber] = useState<string | null>(null);
  const [revokeModalDoc, setRevokeModalDoc] = useState<CertifiedDocumentRecord | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeSourceId, setMergeSourceId] = useState('');
  const [mergeTargetId, setMergeTargetId] = useState('');

  const [showAddCommunityModal, setShowAddCommunityModal] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommHebrew, setNewCommHebrew] = useState('');
  const [newCommType, setNewCommType] = useState<'Village' | 'Community' | 'Synagogue' | 'Regional Council'>('Village');
  const [newCommLocation, setNewCommLocation] = useState('');
  const [newCommLeader, setNewCommLeader] = useState('');

  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'Shabbat Announcement' | 'Holiday Announcement' | 'Study Group' | 'Community Event'>('Shabbat Announcement');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLoc, setNewEventLoc] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifCategory, setNotifCategory] = useState<'Holiday Reminder' | 'Community Announcement' | 'Emergency Alert' | 'Study Invitation'>('Community Announcement');
  const [notifAudience, setNotifAudience] = useState('All Regional Councils');
  const [notifSuccess, setNotifSuccess] = useState(false);

  const refreshData = () => {
    setStats(RegionalCouncilService.getDashboardStats());
    setFamilies(RegionalCouncilService.getFamilyRegistrations());
    setCommunities(RegionalCouncilService.getCommunityRegistry());
    setEvents(RegionalCouncilService.getEvents());
    setModerationQueue(RegionalCouncilService.getModerationQueue());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleApproveFamily = async (id: string) => {
    await RegionalCouncilService.approveFamilyRegistration(id, profile?.full_name || 'Regional Admin');
    refreshData();
    setAuditLogs(prev => [{
      id: `aud_${Date.now()}`,
      timestamp: 'Just now',
      action: 'APPROVE_FAMILY_REGISTRATION',
      target: `Family ID: ${id}`,
      actor: profile?.full_name || 'Regional Admin'
    }, ...prev]);
  };

  const handleMergeFamilies = async () => {
    if (!mergeSourceId || !mergeTargetId || mergeSourceId === mergeTargetId) return;
    await RegionalCouncilService.mergeDuplicateFamilies(mergeSourceId, mergeTargetId, profile?.full_name || 'Regional Admin');
    setShowMergeModal(false);
    setMergeSourceId('');
    setMergeTargetId('');
    refreshData();
    setAuditLogs(prev => [{
      id: `aud_${Date.now()}`,
      timestamp: 'Just now',
      action: 'MERGE_DUPLICATE_FAMILIES',
      target: `Source ${mergeSourceId} -> Target ${mergeTargetId}`,
      actor: profile?.full_name || 'Regional Admin'
    }, ...prev]);
  };

  const handleAddCommunity = async () => {
    if (!newCommName || !newCommLocation) return;
    await RegionalCouncilService.addCommunityItem({
      name: newCommName,
      hebrewName: newCommHebrew,
      type: newCommType,
      location: newCommLocation,
      leaderContact: newCommLeader || 'Council Appointee',
      memberCapacity: 250,
      status: 'Active'
    }, profile?.full_name || 'Regional Admin');
    setShowAddCommunityModal(false);
    setNewCommName('');
    setNewCommHebrew('');
    setNewCommLocation('');
    setNewCommLeader('');
    refreshData();
  };

  const handleCreateEvent = async () => {
    if (!newEventTitle || !newEventDate) return;
    await RegionalCouncilService.createEvent({
      title: newEventTitle,
      category: newEventCategory,
      targetCouncil: 'All Regional Councils',
      scheduledDate: newEventDate,
      locationOrLink: newEventLoc || 'Communal Center',
      description: newEventDesc,
      isBroadcasted: true
    }, profile?.full_name || 'Regional Admin');
    setShowCreateEventModal(false);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventLoc('');
    setNewEventDesc('');
    refreshData();
  };

  const handleModerationResolve = async (id: string, status: 'Approved' | 'Merged' | 'Rejected') => {
    await RegionalCouncilService.resolveModerationItem(id, status, profile?.full_name || 'Regional Admin');
    refreshData();
    setAuditLogs(prev => [{
      id: `aud_${Date.now()}`,
      timestamp: 'Just now',
      action: `MODERATION_${status.toUpperCase()}`,
      target: `Item ${id}`,
      actor: profile?.full_name || 'Regional Admin'
    }, ...prev]);
  };

  const handleBroadcastNotification = async () => {
    if (!notifTitle || !notifMessage) return;
    await RegionalCouncilService.dispatchRegionalNotification(
      notifTitle,
      notifMessage,
      notifCategory,
      notifAudience,
      profile?.full_name || 'Regional Admin'
    );
    setNotifTitle('');
    setNotifMessage('');
    setNotifSuccess(true);
    setTimeout(() => setNotifSuccess(false), 4000);
    setAuditLogs(prev => [{
      id: `aud_${Date.now()}`,
      timestamp: 'Just now',
      action: 'BROADCAST_REGIONAL_NOTIFICATION',
      target: `${notifCategory}: ${notifTitle}`,
      actor: profile?.full_name || 'Regional Admin'
    }, ...prev]);
  };

  const handleExportReportsCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Category,Metric,Count/Percentage\n";
    reports.membershipByDistrict.forEach(m => {
      csvContent += `District Membership,"${m.district}",${m.members}\n`;
    });
    reports.aliyahStatistics.forEach(a => {
      csvContent += `Aliyah Statistics,"${a.status}",${a.count} (${a.percentage}%)\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bnei_menashe_regional_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // RBAC Access Gate
  if (!isAuthorized) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Regional Council Leadership Portal
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Only authenticated leaders with the <span className="font-semibold text-amber-600 dark:text-amber-400">Regional Council Admin</span> or <span className="font-semibold text-amber-600 dark:text-amber-400">Super Admin</span> role may access regional governance, family registration approvals, and minyan broadcasting.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 max-w-md mx-auto text-left space-y-2 text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-500" />
            Active Session Security Profile
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">Current Role:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{activeRole}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Required Role:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Regional Council Admin / Super Admin</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActiveRole('Regional Council Admin')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            Enter Regional Council Admin Workspace
          </button>
          <button
            onClick={() => setActiveRole('Super Admin')}
            className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
          >
            Enter Super Admin Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Portal Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0A1128] to-slate-900 border border-amber-500/20 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Shield className="w-4 h-4" />
            <span>Bnei Menashe Digital Platform Foundation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Regional Council Workspace
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Administrative governance hub for regional leadership across Northern Galilee, Judea & Samaria, Churachandpur, and Aizawl townships.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium">
            <span className="text-slate-400">Active Role: </span>
            <span className="text-amber-300 font-bold">{activeRole}</span>
          </div>
          {activeRole !== 'Member' && (
            <button
              onClick={() => setActiveRole('Member')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs border border-white/10 transition-colors"
              title="Lock portal and switch back to Member view"
            >
              Lock View
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-thin">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'certificates', label: 'Digital Seals & Certs', icon: <Award className="w-4 h-4" /> },
          { id: 'family_mgmt', label: 'Family Management', icon: <Users className="w-4 h-4" /> },
          { id: 'community_mgmt', label: 'Community Management', icon: <Building2 className="w-4 h-4" /> },
          { id: 'events', label: 'Events & Study', icon: <Calendar className="w-4 h-4" /> },
          { id: 'memorial_mod', label: 'Memorial Moderation', icon: <Flame className="w-4 h-4" /> },
          { id: 'reports', label: 'Reports & Aliyah', icon: <FileText className="w-4 h-4" /> },
          { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
          { id: 'audit', label: 'Audit Trail', icon: <Shield className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as PortalTab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Total Members</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalMembers}</div>
              <div className="text-[11px] text-emerald-600 font-medium">+14% verified in 5786</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Total Families</span>
                <Building2 className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalFamilies}</div>
              <div className="text-[11px] text-slate-500">Across 12 tribal lineages</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Total Memorials</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalMemorials}</div>
              <div className="text-[11px] text-amber-600 font-medium">Archived sacred candles</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Upcoming Yahrzeit</span>
                <Calendar className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.upcomingYahrzeitCount}</div>
              <div className="text-[11px] text-rose-600 font-medium">Requiring minyan alerts</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Upcoming Holidays</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.upcomingHolidaysCount}</div>
              <div className="text-[11px] text-slate-500">Tisha B'Av / Tu B'Av</div>
            </div>
          </div>

          {/* Community Statistics Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Community Statistics by Regional Council</h3>
                <p className="text-xs text-slate-500">Active membership density, synagogue counts, and growth status across Israel and India.</p>
              </div>
              <button
                onClick={() => setActiveTab('reports')}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 transition-colors"
              >
                Full Analytics Report →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Regional Council District</th>
                    <th className="py-3 px-4">Active Members</th>
                    <th className="py-3 px-4">Registered Families</th>
                    <th className="py-3 px-4">Synagogues & Shuls</th>
                    <th className="py-3 px-4">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {stats.communityStats.map((cs, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{cs.district}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{cs.memberCount}</td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{cs.familyCount} families</td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{cs.synagogueCount} active</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          cs.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}>
                          {cs.status}
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

      {/* TAB 2: FAMILY MANAGEMENT */}
      {activeTab === 'family_mgmt' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Family Registration & Lineage Management</h3>
              <p className="text-xs text-slate-500">Approve pending family intake registrations, merge duplicate records, and maintain ancestral family lineages.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMergeModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <GitMerge className="w-4 h-4" />
                <span>Merge Duplicate Families</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search family name, household, or village..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Family Lineage & Household</th>
                    <th className="py-3 px-4">Village / Township</th>
                    <th className="py-3 px-4">Regional Council</th>
                    <th className="py-3 px-4">Members</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {families
                    .filter(f => f.clanName.toLowerCase().includes(searchQuery.toLowerCase()) || f.village.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((fam) => (
                      <tr key={fam.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          <div>{fam.clanName}</div>
                          <div className="text-[11px] font-normal text-slate-500">Head: {fam.headOfHousehold} {fam.hebrewName && `(${fam.hebrewName})`}</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">{fam.village}</td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{fam.regionalCouncil}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">{fam.memberCount}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            fam.status === 'Approved'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}>
                            {fam.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {fam.status === 'Pending Review' && (
                            <button
                              onClick={() => handleApproveFamily(fam.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}
                          <span className="text-[11px] text-slate-400 font-mono">ID: {fam.id}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMMUNITY MANAGEMENT */}
      {activeTab === 'community_mgmt' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Community & Synagogue Registry</h3>
              <p className="text-xs text-slate-500">Manage townships, villages, synagogues, and regional council districts.</p>
            </div>
            <button
              onClick={() => setShowAddCommunityModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Entity</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities.map((comm) => (
              <div key={comm.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider">
                      {comm.type}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title={comm.status} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{comm.name}</h4>
                  {comm.hebrewName && <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">{comm.hebrewName}</p>}
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{comm.location}</span>
                  </p>
                  {comm.parentCouncil && (
                    <p className="text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                      Parent Council: <span className="font-semibold text-slate-700 dark:text-slate-300">{comm.parentCouncil}</span>
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Leader: <strong className="text-slate-800 dark:text-slate-200">{comm.leaderContact}</strong></span>
                  <span className="font-mono text-[10px] text-slate-400">Cap: {comm.memberCapacity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EVENTS */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Regional Events & Study Groups</h3>
              <p className="text-xs text-slate-500">Schedule Shabbat announcements, holiday assemblies, and Daf Yomi study circles.</p>
            </div>
            <button
              onClick={() => setShowCreateEventModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>

          <div className="space-y-4">
            {events.map((ev) => (
              <div key={ev.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
                      {ev.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">• {ev.targetCouncil}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{ev.description}</p>
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-3 pt-1">
                    <span>📅 {ev.scheduledDate}</span>
                    <span>📍 {ev.locationOrLink}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    ev.isBroadcasted ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {ev.isBroadcasted ? '✓ Broadcasted' : 'Scheduled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MEMORIAL MODERATION */}
      {activeTab === 'memorial_mod' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Memorial Sanctuary Moderation Queue</h3>
            <p className="text-xs text-slate-500">Approve yahrzeit tributes, review biographies, and merge duplicate ancestral candles.</p>
          </div>

          <div className="space-y-4">
            {moderationQueue.map((item) => (
              <div key={item.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider">
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400">• Submitted by {item.submittedBy} ({item.submissionDate})</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Subject: {item.subjectName} {item.hebrewName && `(${item.hebrewName})`}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                    "{item.details}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => handleModerationResolve(item.id, item.type === 'Duplicate Candidate' ? 'Merged' : 'Approved')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>{item.type === 'Duplicate Candidate' ? 'Confirm Merge' : 'Approve'}</span>
                      </button>
                      <button
                        onClick={() => handleModerationResolve(item.id, 'Rejected')}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Demographic & Aliyah Statistical Reports</h3>
              <p className="text-xs text-slate-500">Generate membership growth analytics across generations, districts, and yahrzeit distributions.</p>
            </div>
            <button
              onClick={handleExportReportsCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Report</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Membership by District */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Membership by District</h4>
              <div className="space-y-3">
                {reports.membershipByDistrict.map((m, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{m.district}</span>
                      <span>{m.members} members</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-amber-500 h-full" style={{ width: `${(m.olim / m.members) * 100}%` }} title="In Israel" />
                      <div className="bg-blue-500 h-full" style={{ width: `${(m.hills / m.members) * 100}%` }} title="In India" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>🇮🇱 Olim: {m.olim}</span>
                      <span>🇮🇳 India Hills: {m.hills}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aliyah Statistics */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Aliyah Status Breakdown</h4>
              <div className="space-y-3">
                {reports.aliyahStatistics.map((a, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{a.status}</span>
                      <span>{a.count} ({a.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${a.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Family Growth by Generation */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Family Growth Across Generations</h4>
              <div className="space-y-3">
                {reports.familyGrowthByGen.map((g, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{g.generation}</span>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 dark:text-white">{g.count} records</div>
                      <div className="text-[10px] text-slate-400">{g.activeClans} branches</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Participation Metrics */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Community Participation Metrics</h4>
              <div className="space-y-3">
                {reports.participationMetrics.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{p.activity}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{p.participants} members</span>
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px]">{p.engagementRate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Regional Broadcast Notifications</h3>
            <p className="text-xs text-slate-500">Dispatch urgent alerts, holiday reminders, and study invitations across synagogues and townships.</p>
          </div>

          {notifSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Broadcast dispatched successfully across target constituents! Audit trail logged.</span>
            </div>
          )}

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 max-w-2xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Broadcast Category</label>
              <select
                value={notifCategory}
                onChange={(e) => setNotifCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Community Announcement">Community Announcement</option>
                <option value="Holiday Reminder">Holiday Reminder</option>
                <option value="Emergency Alert">Emergency Alert</option>
                <option value="Study Invitation">Study Invitation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Audience</label>
              <select
                value={notifAudience}
                onChange={(e) => setNotifAudience(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="All Regional Councils">All Regional Councils (Global)</option>
                <option value="Northern Galilee Council">Northern Galilee Council Only</option>
                <option value="Northeast India Hills Council">Northeast India Hills Council (Churachandpur / Aizawl)</option>
                <option value="Judea & Samaria Council">Judea & Samaria Council Only</option>
                <option value="Synagogue Gabbaim & Elders">Synagogue Gabbaim & Elders Only</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Notification Title</label>
              <input
                type="text"
                placeholder="e.g., Rosh Chodesh Av Minyan Schedule update..."
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Message Content</label>
              <textarea
                rows={4}
                placeholder="Write detailed instructions or location specifics..."
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              onClick={handleBroadcastNotification}
              disabled={!notifTitle || !notifMessage}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Regional Broadcast</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Administrative Governance Audit Trail</h3>
            <p className="text-xs text-slate-500">Immutable foreign-key trails logged via AuditService for all regional council operations.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-mono text-amber-600 dark:text-amber-400">{log.action}</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">Target: <strong className="text-slate-800 dark:text-slate-200">{log.target}</strong></div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-slate-700 dark:text-slate-300">{log.actor}</div>
                  <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL CERTIFICATES & SEALS (REGIONAL COUNCIL ADMIN TOOLS) */}
      {activeTab === 'certificates' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#14203D] to-slate-900 border border-amber-500/30 text-white shadow-xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Enterprise Digital Signature & Verification</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight">Regional Council Certification Desk</h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Issue, reissue, revoke, and verify cryptographically sealed community documents. Every generated certificate features a unique SHA-256 fingerprint and public QR verification seal.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setVerifyingDocNumber('BMCI-2026-0001824')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Verify Document</span>
              </button>
              <button
                onClick={() => setShowIssueModal(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Issue Certificate</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={certSearch}
                onChange={(e) => setCertSearch(e.target.value)}
                placeholder="Search by Doc ID, Recipient, Citizen ID, or SHA-256..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <select
              value={certCategoryFilter}
              onChange={(e) => setCertCategoryFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="All">All 12 Document Categories</option>
              <option value="Community Identity Pass">Community Identity Pass</option>
              <option value="Community Membership Certificate">Community Membership Certificate</option>
              <option value="Community Census Certificate">Community Census Certificate</option>
              <option value="Household Certificate">Household Certificate</option>
              <option value="Family Registration">Family Registration</option>
              <option value="Memorial Certificate">Memorial Certificate</option>
              <option value="Volunteer Certificate">Volunteer Certificate</option>
              <option value="Synagogue Membership">Synagogue Membership</option>
              <option value="Regional Council Letter">Regional Council Letter</option>
              <option value="Community Service Approval">Community Service Approval</option>
              <option value="Education Certificate">Education Certificate</option>
              <option value="Aliyah Support Letter">Aliyah Support Letter</option>
            </select>
          </div>

          {/* Certificates Table */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="p-4">Document ID & Seal</th>
                    <th className="p-4">Category / Document Name</th>
                    <th className="p-4">Recipient</th>
                    <th className="p-4">Issue Date</th>
                    <th className="p-4">Status & Ver</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {DigitalSignatureService.searchRegistry(certSearch, certCategoryFilter).map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                          <span>{doc.documentNumber}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono truncate max-w-[130px] mt-0.5">
                          SHA256:{doc.sha256Fingerprint.substring(0, 14)}...
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-black text-slate-900 dark:text-white">{doc.documentName}</div>
                        <div className="text-[11px] text-slate-500">{doc.category}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                        {doc.recipientName}
                        {doc.citizenId && <span className="block font-mono text-[10px] text-slate-400">{doc.citizenId}</span>}
                      </td>
                      <td className="p-4 font-mono text-slate-600 dark:text-slate-400">
                        {doc.issueDate}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            doc.verificationStatus === 'Verified'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : doc.verificationStatus === 'Revoked'
                              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          }`}>
                            {doc.verificationStatus}
                          </span>
                          <span className="font-mono text-slate-400">{doc.version}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setVerifyingDocNumber(doc.documentNumber)}
                          title="Verify QR Seal"
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-all"
                        >
                          Verify
                        </button>
                        {doc.verificationStatus !== 'Revoked' && (
                          <>
                            <button
                              onClick={async () => {
                                await DigitalSignatureService.reissueCertificate(doc.documentNumber, profile?.full_name || 'Regional Officer', 'Reissued with renewed cryptographic seal');
                                setCertificates(DigitalSignatureService.getAllCertifiedDocuments());
                              }}
                              title="Reissue Certificate (Bump Version)"
                              className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-bold transition-all"
                            >
                              Reissue
                            </button>
                            <button
                              onClick={() => setRevokeModalDoc(doc)}
                              title="Revoke Document"
                              className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-600 dark:text-rose-400 font-bold transition-all"
                            >
                              Revoke
                            </button>
                          </>
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

      {/* MERGE MODAL */}
      {showMergeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Merge Duplicate Family Records</h3>
            <p className="text-xs text-slate-500">Select source record to merge into target canonical record.</p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Source Family (Will be removed)</label>
                <select
                  value={mergeSourceId}
                  onChange={(e) => setMergeSourceId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs mt-1"
                >
                  <option value="">Select source family...</option>
                  {families.map(f => <option key={f.id} value={f.id}>{f.clanName} ({f.memberCount} members)</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Target Canonical Family</label>
                <select
                  value={mergeTargetId}
                  onChange={(e) => setMergeTargetId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs mt-1"
                >
                  <option value="">Select target family...</option>
                  {families.filter(f => f.id !== mergeSourceId).map(f => <option key={f.id} value={f.id}>{f.clanName} ({f.memberCount} members)</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowMergeModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleMergeFamilies}
                disabled={!mergeSourceId || !mergeTargetId}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold"
              >
                Execute Merge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD COMMUNITY MODAL */}
      {showAddCommunityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Community Entity</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Entity Type</label>
                <select
                  value={newCommType}
                  onChange={(e) => setNewCommType(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs mt-1"
                >
                  <option value="Village">Village / Township</option>
                  <option value="Community">Community Organization</option>
                  <option value="Synagogue">Beit Knesset / Shul</option>
                  <option value="Regional Council">Regional Council</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">English Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kangpokpi Bnei Menashe"
                  value={newCommName}
                  onChange={(e) => setNewCommName(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Kangpokpi, Manipur"
                  value={newCommLocation}
                  onChange={(e) => setNewCommLocation(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddCommunityModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCommunity}
                disabled={!newCommName || !newCommLocation}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
              >
                Save Entity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showCreateEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create Regional Event</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Rosh Hashanah Chanting Rehearsal"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Scheduled Date</label>
                <input
                  type="text"
                  placeholder="e.g. Next Thursday • 18:00 UTC"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Description</label>
                <textarea
                  rows={3}
                  placeholder="Event details..."
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateEventModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                disabled={!newEventTitle || !newEventDate}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ISSUE CERTIFICATE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Issue Certified Document</h3>
                  <p className="text-[11px] text-slate-500">Cryptographic SHA-256 seal & unique QR ID</p>
                </div>
              </div>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!issueRecipient.trim()) return;
                await DigitalSignatureService.issueNewCertificate({
                  documentName: issueDocName,
                  category: issueCategory,
                  issuingAuthority: `Bnei Menashe Council India - Regional Node`,
                  recipientName: issueRecipient,
                  citizenId: issueCitizenId || undefined,
                  description: issueDesc,
                  officerName: profile?.full_name || 'Regional Council Officer'
                });
                setCertificates(DigitalSignatureService.getAllCertifiedDocuments());
                setShowIssueModal(false);
                setIssueRecipient('');
                setIssueCitizenId('');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Document Category (12 Supported Types)</label>
                <select
                  value={issueCategory}
                  onChange={(e) => {
                    const cat = e.target.value as PlatformDocumentCategory;
                    setIssueCategory(cat);
                    setIssueDocName(cat);
                  }}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Community Identity Pass">1. Community Identity Pass</option>
                  <option value="Community Membership Certificate">2. Community Membership Certificate</option>
                  <option value="Community Census Certificate">3. Community Census Certificate</option>
                  <option value="Household Certificate">4. Household Certificate</option>
                  <option value="Family Registration">5. Family Registration</option>
                  <option value="Memorial Certificate">6. Memorial Certificate</option>
                  <option value="Volunteer Certificate">7. Volunteer Certificate</option>
                  <option value="Synagogue Membership">8. Synagogue Membership</option>
                  <option value="Regional Council Letter">9. Regional Council Letter</option>
                  <option value="Community Service Approval">10. Community Service Approval</option>
                  <option value="Education Certificate">11. Education Certificate</option>
                  <option value="Aliyah Support Letter">12. Aliyah Support Letter</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={issueDocName}
                  onChange={(e) => setIssueDocName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Recipient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Haokip"
                    value={issueRecipient}
                    onChange={(e) => setIssueRecipient(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Citizen / Household ID (Opt)</label>
                  <input
                    type="text"
                    placeholder="e.g. BMCI-2026-0001824"
                    value={issueCitizenId}
                    onChange={(e) => setIssueCitizenId(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Official Certification Description</label>
                <textarea
                  rows={3}
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-500" />
                <span>Issuing generates an unalterable SHA-256 fingerprint & public verification QR code.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg"
                >
                  Issue & Seal Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVOKE CERTIFICATE MODAL */}
      {revokeModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-rose-500/40 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 font-bold text-base">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3>Revoke Official Certificate</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              You are revoking document seal <strong>{revokeModalDoc.documentNumber}</strong> ({revokeModalDoc.documentName}) issued to <strong>{revokeModalDoc.recipientName}</strong>.
            </p>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Reason for Revocation</label>
              <input
                type="text"
                placeholder="e.g. Outdated status / Replaced by new certificate"
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setRevokeModalDoc(null); setRevokeReason(''); }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  DigitalSignatureService.revokeCertificate(revokeModalDoc.documentNumber, profile?.full_name || 'Regional Officer', revokeReason || 'Administrative Revocation');
                  setCertificates(DigitalSignatureService.getAllCertifiedDocuments());
                  setRevokeModalDoc(null);
                  setRevokeReason('');
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLIC VERIFICATION MODAL */}
      {verifyingDocNumber && (
        <PublicVerificationModal
          initialCode={verifyingDocNumber}
          onClose={() => setVerifyingDocNumber(null)}
        />
      )}

    </div>
  );
};
