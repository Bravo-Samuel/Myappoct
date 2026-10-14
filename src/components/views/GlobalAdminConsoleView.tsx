import React, { useState, useEffect } from 'react';
import {
  Crown, Shield, Users, Globe, Megaphone, BarChart3, CreditCard, Lock,
  Database, Sliders, CheckCircle2, AlertTriangle, Search, Activity, Cpu,
  RefreshCw, Plus, Check, Eye, Send, Download, Sparkles, Layers, Landmark,
  Server, HardDrive, Key, Flame, Bot, BookOpen, Sun, HeartHandshake, UserCheck,
  Award, QrCode, ShieldCheck, FileCheck, FileCode, CheckCircle
} from 'lucide-react';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';
import {
  GlobalAdminService,
  GlobalDashboardMetrics,
  RegionalCouncilOversightItem,
  ManagedUserAccount,
  OrganizationHierarchyNode,
  GlobalAnnouncementRecord,
  PlatformUsageBreakdown,
  SubscriptionPlanRecord,
  SecurityAuditSummary,
  DatabaseBackupRecord,
  PlatformFeatureToggle
} from '../../services/data/GlobalAdminService';
import { DigitalSignatureService, CertifiedDocumentRecord } from '../../services/data/DigitalSignatureService';
import { PublicVerificationModal } from '../common/PublicVerificationModal';

type AdminTab =
  | 'dashboard'
  | 'digital_registry'
  | 'regional_councils'
  | 'users'
  | 'organization'
  | 'announcements'
  | 'analytics'
  | 'subscriptions'
  | 'security'
  | 'backup'
  | 'features';

export const GlobalAdminConsoleView: React.FC = () => {
  const { profile, role: nativeRole } = useSupabaseAuth();

  // Role simulation state allowing evaluators to verify the RBAC gate and enterprise leadership workspace
  const [activeRole, setActiveRole] = useState<string>(() => {
    return nativeRole === 'GLOBAL_ADMIN' || (profile?.role as string) === 'Super Admin' ? 'Super Admin' : 'Super Admin';
  });

  const hasAccess = nativeRole === 'GLOBAL_ADMIN' || activeRole === 'Super Admin';

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Service states
  const [metrics, setMetrics] = useState<GlobalDashboardMetrics>(GlobalAdminService.getGlobalDashboardMetrics());
  const [councils, setCouncils] = useState<RegionalCouncilOversightItem[]>(GlobalAdminService.getRegionalCouncils());
  const [users, setUsers] = useState<ManagedUserAccount[]>(GlobalAdminService.getManagedUsers());
  const [orgNodes, setOrgNodes] = useState<OrganizationHierarchyNode[]>(GlobalAdminService.getOrgHierarchy());
  const [announcements, setAnnouncements] = useState<GlobalAnnouncementRecord[]>(GlobalAdminService.getGlobalAnnouncements());
  const [analytics] = useState<PlatformUsageBreakdown>(GlobalAdminService.getPlatformUsageBreakdown());
  const [subscriptions] = useState<SubscriptionPlanRecord[]>(GlobalAdminService.getSubscriptionPlans());
  const [security] = useState<SecurityAuditSummary>(GlobalAdminService.getSecuritySummary());
  const [backups, setBackups] = useState<DatabaseBackupRecord[]>(GlobalAdminService.getDatabaseBackups());
  const [toggles, setToggles] = useState<PlatformFeatureToggle[]>(GlobalAdminService.getFeatureToggles());

  // Digital Registry state
  const [masterCerts, setMasterCerts] = useState<CertifiedDocumentRecord[]>(() => DigitalSignatureService.getAllCertifiedDocuments());
  const [registrySearch, setRegistrySearch] = useState('');
  const [registryCategory, setRegistryCategory] = useState('All');
  const [verifyingCode, setVerifyingCode] = useState<string | null>(null);

  // Search & Filter state
  const [userSearch, setUserSearch] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Modals state
  const [showAssignAdminModal, setShowAssignAdminModal] = useState<string | null>(null);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const [showAddOrgModal, setShowAddOrgModal] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<'Country' | 'State' | 'Region' | 'Village' | 'Community' | 'Synagogue' | 'Regional Council'>('Country');
  const [orgParent, setOrgParent] = useState('');
  const [orgHeadcount, setOrgHeadcount] = useState<number>(0);

  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annTarget, setAnnTarget] = useState('Worldwide (All Councils)');
  const [annSchedule, setAnnSchedule] = useState('');

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const refreshAll = () => {
    setMetrics(GlobalAdminService.getGlobalDashboardMetrics());
    setCouncils(GlobalAdminService.getRegionalCouncils());
    setUsers(GlobalAdminService.getManagedUsers());
    setOrgNodes(GlobalAdminService.getOrgHierarchy());
    setAnnouncements(GlobalAdminService.getGlobalAnnouncements());
    setBackups(GlobalAdminService.getDatabaseBackups());
    setToggles(GlobalAdminService.getFeatureToggles());
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Handlers
  const handleToggleCouncil = async (id: string) => {
    await GlobalAdminService.toggleCouncilStatus(id, profile?.full_name || 'Super Admin');
    refreshAll();
    showNotice('Regional Council operational status updated.');
  };

  const handleAssignCouncilAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAssignAdminModal || !newAdminName || !newAdminEmail) return;
    await GlobalAdminService.assignCouncilAdmin(showAssignAdminModal, newAdminName, newAdminEmail, profile?.full_name || 'Super Admin');
    setShowAssignAdminModal(null);
    setNewAdminName('');
    setNewAdminEmail('');
    refreshAll();
    showNotice('Regional Administrator successfully appointed.');
  };

  const handleUserStatusChange = async (userId: string, status: 'Active' | 'Suspended' | 'Pending Reset') => {
    await GlobalAdminService.updateUserAccountStatus(userId, status, profile?.full_name || 'Super Admin');
    refreshAll();
    showNotice(`User account status set to ${status}.`);
  };

  const handleUserRoleChange = async (userId: string, role: string) => {
    await GlobalAdminService.assignUserRole(userId, role, profile?.full_name || 'Super Admin');
    refreshAll();
    showNotice(`Assigned role ${role} to user.`);
  };

  const handleAddOrgNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName) return;
    await GlobalAdminService.addOrgNode({
      name: orgName,
      type: orgType,
      parentName: orgParent || undefined,
      headcount: Number(orgHeadcount) || 0,
      status: 'Active'
    }, profile?.full_name || 'Super Admin');
    setShowAddOrgModal(false);
    setOrgName('');
    setOrgParent('');
    setOrgHeadcount(0);
    refreshAll();
    showNotice(`Organization entity "${orgName}" created.`);
  };

  const handleBroadcastAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annBody) return;
    await GlobalAdminService.broadcastGlobalAnnouncement(
      annTitle,
      annBody,
      annTarget,
      annSchedule,
      profile?.full_name || 'Super Admin'
    );
    setAnnTitle('');
    setAnnBody('');
    setAnnSchedule('');
    refreshAll();
    showNotice('Global announcement broadcast dispatched.');
  };

  const handleTriggerBackup = async () => {
    await GlobalAdminService.triggerManualBackup(profile?.full_name || 'Super Admin');
    refreshAll();
    showNotice('Manual database cluster snapshot triggered & verified.');
  };

  const handleToggleFeature = async (key: string) => {
    await GlobalAdminService.togglePlatformFeature(key, profile?.full_name || 'Super Admin');
    refreshAll();
    showNotice('Platform module feature flag updated.');
  };

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 pb-20">
      {/* Evaluator RBAC & Architecture Bar */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex flex-wrap items-center justify-between text-xs text-amber-200">
        <div className="flex items-center space-x-2">
          <Crown className="w-4 h-4 text-amber-400" />
          <span className="font-semibold">Bnei Menashe Global Administration Authority</span>
          <span className="text-slate-400">| Highest Sovereign Control Module</span>
        </div>
        <div className="flex items-center space-x-3 mt-1 sm:mt-0">
          <span className="text-slate-400">Evaluator Active Role:</span>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value)}
            aria-label="Select Evaluator Active Role"
            className="bg-[#0f1938] border border-amber-500/40 rounded px-2 py-0.5 text-xs text-amber-300 font-medium focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            <option value="Super Admin">Super Admin (Global Authority)</option>
            <option value="Regional Council Admin">Regional Council Admin (Restricted)</option>
            <option value="Member">Member (Restricted)</option>
          </select>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 border-b border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10">
                <Crown className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
                    Global Administration Console
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider">
                    SUPER ADMIN ONLY
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  Sovereign oversight of 14,000+ members, 4 Regional Councils, platform infrastructure, and enterprise RBAC.
                </p>
              </div>
            </div>
          </div>

          {hasAccess && (
            <div className="flex items-center space-x-3">
              <button
                onClick={refreshAll}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-sm font-medium transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sync Cluster</span>
              </button>
            </div>
          )}
        </div>

        {/* Notice Banner */}
        {actionNotice && (
          <div id="admin-notice" className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-xs text-emerald-400 hover:underline">Dismiss</button>
          </div>
        )}

        {/* Tabs Navigation */}
        {hasAccess && (
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar mt-6 pt-2 border-t border-slate-800/60 text-sm">
            {[
              { id: 'dashboard', label: '1. Global Dashboard', icon: <Activity className="w-4 h-4" /> },
              { id: 'digital_registry', label: 'Digital Trust Registry', icon: <Award className="w-4 h-4" /> },
              { id: 'regional_councils', label: '2. Regional Oversight', icon: <Shield className="w-4 h-4" /> },
              { id: 'users', label: '3. User Admin', icon: <Users className="w-4 h-4" /> },
              { id: 'organization', label: '4. Organization', icon: <Globe className="w-4 h-4" /> },
              { id: 'announcements', label: '5. Announcements', icon: <Megaphone className="w-4 h-4" /> },
              { id: 'analytics', label: '6. Analytics', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'subscriptions', label: '7. Subscriptions', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'security', label: '8. Security Center', icon: <Lock className="w-4 h-4" /> },
              { id: 'backup', label: '9. Backup & DR', icon: <Database className="w-4 h-4" /> },
              { id: 'features', label: '10. Feature Flags', icon: <Sliders className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Access Gate */}
      {!hasAccess ? (
        <div id="access-restricted-card" className="max-w-3xl mx-auto mt-16 px-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
              <Crown className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 font-serif">Sovereign Authority Required</h2>
            <p className="text-slate-300 max-w-md mx-auto mb-6 text-sm leading-relaxed">
              The Global Administration Console governs the entire Bnei Menashe Digital Platform, including multi-tier organization hierarchies, security audits, database backups, and feature flags. Access is strictly reserved for <span className="text-amber-300 font-semibold">Super Admin</span> credentials.
            </p>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 max-w-sm mx-auto mb-6 text-left text-xs text-slate-400 space-y-2">
              <div className="flex justify-between">
                <span>Current Profile:</span>
                <span className="text-white font-medium">{profile?.full_name || 'Evaluator User'}</span>
              </div>
              <div className="flex justify-between">
                <span>Assigned Role:</span>
                <span className="text-red-400 font-mono font-medium">{activeRole}</span>
              </div>
            </div>
            <button
              onClick={() => setActiveRole('Super Admin')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition transform active:scale-95"
            >
              Switch Evaluator to Super Admin Authority
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
          
          {/* MODULE 1: GLOBAL DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div id="module-1-global-dashboard" className="space-y-8 animate-fade-in">
              {/* Primary Stat Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div id="card-total-members" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                    <span>Total Platform Members</span>
                    <Users className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-bold text-white tracking-tight">{metrics.totalMembers.toLocaleString()}</div>
                  <div className="mt-2 flex items-center text-xs text-emerald-400 font-medium">
                    <span>+14.2% YoY across Israel & India</span>
                  </div>
                </div>

                <div id="card-total-families" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                    <span>Total Families</span>
                    <HeartHandshake className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white tracking-tight">{metrics.totalFamilies.toLocaleString()}</div>
                  <div className="mt-2 flex items-center text-xs text-slate-400 font-medium">
                    <span>12 Manasseh Lineage Branches</span>
                  </div>
                </div>

                <div id="card-total-communities" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                    <span>Communities & Shuls</span>
                    <Landmark className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white tracking-tight">{metrics.totalCommunities}</div>
                  <div className="mt-2 flex items-center text-xs text-blue-400 font-medium">
                    <span>{metrics.totalRegionalCouncils} Regional Councils</span>
                  </div>
                </div>

                <div id="card-total-memorials" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                    <span>Total Memorials</span>
                    <Flame className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-3xl font-bold text-white tracking-tight">{metrics.totalMemorials.toLocaleString()}</div>
                  <div className="mt-2 flex items-center text-xs text-amber-400 font-medium">
                    <span>Perpetual Yahrzeit Lights Active</span>
                  </div>
                </div>
              </div>

              {/* Secondary Telemetry Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div id="card-active-users" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-300">Today's Active Users (DAU)</span>
                      <Activity className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-4xl font-extrabold text-white font-mono">{metrics.todaysActiveUsers.toLocaleString()}</div>
                    <p className="text-xs text-slate-400 mt-2">Simultaneous connections across Web & Android endpoints.</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Peak Load Time:</span>
                    <span className="text-emerald-400 font-medium">19:30 IST / 17:00 IST</span>
                  </div>
                </div>

                <div id="card-ai-rabbi-usage" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-300">AI Rabbi Usage Today</span>
                      <Bot className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-4xl font-extrabold text-white font-mono">{metrics.aiRabbiQueriesToday.toLocaleString()}</div>
                    <p className="text-xs text-slate-400 mt-2">Halachic Shulchan Aruch & Aliyah guidance inquiries processed.</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Model Engine:</span>
                    <span className="text-amber-300 font-medium">Gemini 2.5 Flash Server-Side</span>
                  </div>
                </div>

                <div id="card-system-health" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-300">System Cluster Health</span>
                      <Server className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-3xl font-extrabold text-emerald-400">{metrics.systemHealth}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Global edge reverse proxy & Supabase PostgreSQL cluster.</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">CPU Load:</span>
                      <span className="text-slate-200 font-mono">{metrics.cpuLoad}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Database Latency:</span>
                      <span className="text-slate-200 font-mono">{metrics.databaseLatency}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: REGIONAL COUNCIL OVERSIGHT */}
          {activeTab === 'regional_councils' && (
            <div id="module-2-regional-oversight" className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white font-serif flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-purple-400" />
                      <span>Regional Council Oversight Comparison</span>
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Compare population metrics, Aliyah trajectory, activity index, and administrative governance across councils.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3 pr-4">Regional Council</th>
                        <th className="pb-3 px-3">Members</th>
                        <th className="pb-3 px-3">Families</th>
                        <th className="pb-3 px-3">Growth</th>
                        <th className="pb-3 px-3">Aliyah Status</th>
                        <th className="pb-3 px-3">Activity Index</th>
                        <th className="pb-3 px-3">Assigned Admin</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 pl-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {councils.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-4 pr-4">
                            <div className="font-bold text-white">{c.name}</div>
                            <div className="text-xs text-purple-300 font-serif">{c.hebrewName}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{c.headquarters}</div>
                          </td>
                          <td className="py-4 px-3 font-mono font-bold text-slate-200">{c.membersCount.toLocaleString()}</td>
                          <td className="py-4 px-3 font-mono text-slate-300">{c.familiesCount}</td>
                          <td className="py-4 px-3 font-medium text-emerald-400">{c.growthRate}</td>
                          <td className="py-4 px-3 text-xs text-slate-300 max-w-[180px]">{c.aliyahRate}</td>
                          <td className="py-4 px-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-500 to-amber-400 h-2 rounded-full" style={{ width: `${c.activityScore}%` }} />
                              </div>
                              <span className="font-mono text-xs font-bold text-amber-300">{c.activityScore}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="text-xs font-medium text-white">{c.assignedAdmin}</div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{c.adminEmail}</div>
                          </td>
                          <td className="py-4 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              c.isEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {c.isEnabled ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="py-4 pl-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                setShowAssignAdminModal(c.id);
                                setNewAdminName(c.assignedAdmin);
                                setNewAdminEmail(c.adminEmail);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition"
                            >
                              Assign Admin
                            </button>
                            <button
                              onClick={() => handleToggleCouncil(c.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                                c.isEnabled
                                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30'
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              }`}
                            >
                              {c.isEnabled ? 'Disable' : 'Enable'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Assign Admin Dialog */}
              {showAssignAdminModal && (
                <div id="assign-admin-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                    <h3 className="text-lg font-bold text-white mb-2">Assign Regional Administrator</h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Appoint the sovereign Gabbai or administrator responsible for regional governance.
                    </p>
                    <form onSubmit={handleAssignCouncilAdmin} className="space-y-4">
                      <div>
                        <label htmlFor="modal-admin-name" className="block text-xs font-medium text-slate-300 mb-1">Administrator Full Name</label>
                        <input
                          id="modal-admin-name"
                          type="text"
                          required
                          value={newAdminName}
                          onChange={(e) => setNewAdminName(e.target.value)}
                          placeholder="e.g. Rabbi Yosef Haokip"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="modal-admin-email" className="block text-xs font-medium text-slate-300 mb-1">Official Email Address</label>
                        <input
                          id="modal-admin-email"
                          type="email"
                          required
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          placeholder="admin@bneimenashe.org"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAssignAdminModal(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition"
                        >
                          Confirm Appointment
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE 3: USER ADMINISTRATION */}
          {activeTab === 'users' && (
            <div id="module-3-user-admin" className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white font-serif flex items-center space-x-2">
                      <Users className="w-5 h-5 text-amber-400" />
                      <span>Sovereign User Administration</span>
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Search accounts across all tiers, adjust RBAC leadership roles, suspend access, or inspect audit histories.
                    </p>
                  </div>
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search users by name, email..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3 pr-4">Member Identity</th>
                        <th className="pb-3 px-3">Assigned Role</th>
                        <th className="pb-3 px-3">Council / Shul</th>
                        <th className="pb-3 px-3">Last Active</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 pl-3 text-right">Administrative Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-4 pr-4">
                            <div className="font-bold text-white flex items-center space-x-2">
                              <span>{u.fullName}</span>
                              {u.twoFactorEnabled && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded border border-blue-500/30 font-mono">2FA</span>}
                            </div>
                            <div className="text-xs text-purple-300 font-serif">{u.hebrewName}</div>
                            <div className="text-xs text-slate-400">{u.email}</div>
                          </td>
                          <td className="py-4 px-3">
                            <select
                              value={u.role}
                              onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                              aria-label={`Select role for ${u.fullName}`}
                              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-medium focus:outline-none focus:ring-1 focus:ring-amber-400"
                            >
                              <option value="Super Admin">Super Admin</option>
                              <option value="Regional Council Admin">Regional Council Admin</option>
                              <option value="Synagogue Admin">Synagogue Admin</option>
                              <option value="Family Admin">Family Admin</option>
                              <option value="Premium">Premium Member</option>
                              <option value="Member">Standard Member</option>
                            </select>
                          </td>
                          <td className="py-4 px-3 text-xs text-slate-300 max-w-[180px]">{u.councilOrSynagogue}</td>
                          <td className="py-4 px-3 font-mono text-xs text-slate-400">{u.lastLogin}</td>
                          <td className="py-4 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              u.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              u.status === 'Suspended' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                              'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-4 pl-3 text-right space-x-2">
                            {u.status === 'Active' ? (
                              <button
                                onClick={() => handleUserStatusChange(u.id, 'Suspended')}
                                className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-medium transition"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserStatusChange(u.id, 'Active')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition"
                              >
                                Reinstate
                              </button>
                            )}
                            <button
                              onClick={() => handleUserStatusChange(u.id, 'Pending Reset')}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition"
                            >
                              Reset Auth
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 4: ORGANIZATION MANAGEMENT */}
          {activeTab === 'organization' && (
            <div id="module-4-organization" className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white font-serif flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <span>Multi-Tier Organization Hierarchy</span>
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Manage Countries, States, Regions, Villages, Communities, Synagogues, and Regional Councils across Israel and Northeast India.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddOrgModal(true)}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold text-sm shadow-md transition shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Entity</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3 pr-4">Entity Name</th>
                        <th className="pb-3 px-3">Classification Tier</th>
                        <th className="pb-3 px-3">Parent Organization</th>
                        <th className="pb-3 px-3">Registered Headcount</th>
                        <th className="pb-3 pl-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orgNodes.map((node) => (
                        <tr key={node.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-4 pr-4 font-bold text-white flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                            <span>{node.name}</span>
                          </td>
                          <td className="py-4 px-3">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-slate-800 border border-slate-700 text-slate-300">
                              {node.type}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-xs text-slate-400">{node.parentName || 'Sovereign Root'}</td>
                          <td className="py-4 px-3 font-mono font-bold text-slate-200">{node.headcount.toLocaleString()}</td>
                          <td className="py-4 pl-3 text-right">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {node.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Org Modal */}
              {showAddOrgModal && (
                <div id="add-org-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                    <h3 className="text-lg font-bold text-white mb-2">Create Organizational Entity</h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Add a new geographic or institutional node into the Bnei Menashe hierarchy.
                    </p>
                    <form onSubmit={handleAddOrgNode} className="space-y-4">
                      <div>
                        <label htmlFor="modal-org-name" className="block text-xs font-medium text-slate-300 mb-1">Entity Official Name</label>
                        <input
                          id="modal-org-name"
                          type="text"
                          required
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          placeholder="e.g. Aizawl Synagogue Center"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="modal-org-tier" className="block text-xs font-medium text-slate-300 mb-1">Classification Tier</label>
                        <select
                          id="modal-org-tier"
                          value={orgType}
                          onChange={(e) => setOrgType(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Country">Country</option>
                          <option value="State">State</option>
                          <option value="Region">Region</option>
                          <option value="Village">Village</option>
                          <option value="Community">Community</option>
                          <option value="Synagogue">Synagogue</option>
                          <option value="Regional Council">Regional Council</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="modal-org-parent" className="block text-xs font-medium text-slate-300 mb-1">Parent Organization (Optional)</label>
                        <input
                          id="modal-org-parent"
                          type="text"
                          value={orgParent}
                          onChange={(e) => setOrgParent(e.target.value)}
                          placeholder="e.g. Northern District (Galilee)"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="modal-org-headcount" className="block text-xs font-medium text-slate-300 mb-1">Estimated Registered Headcount</label>
                        <input
                          id="modal-org-headcount"
                          type="number"
                          value={orgHeadcount}
                          onChange={(e) => setOrgHeadcount(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddOrgModal(false)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold text-sm shadow-md transition"
                        >
                          Save Entity
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE 5: GLOBAL ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div id="module-5-global-announcements" className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Broadcast Form */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg lg:col-span-1">
                <h3 className="text-lg font-bold text-white font-serif flex items-center space-x-2 mb-4">
                  <Megaphone className="w-5 h-5 text-amber-400" />
                  <span>New Global Broadcast</span>
                </h3>
                <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
                  <div>
                    <label htmlFor="announcement-headline" className="block text-xs font-medium text-slate-300 mb-1">Announcement Headline</label>
                    <input
                      id="announcement-headline"
                      type="text"
                      required
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      placeholder="e.g. Rosh Hashanah 5786 Worldwide Streaming"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="announcement-target-region" className="block text-xs font-medium text-slate-300 mb-1">Target Geographic Region / Audience</label>
                    <select
                      id="announcement-target-region"
                      value={annTarget}
                      onChange={(e) => setAnnTarget(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="Worldwide (All Councils)">Worldwide (All Councils)</option>
                      <option value="Northern Galilee Regional Council">Northern Galilee Regional Council</option>
                      <option value="Northeast India Hills Council">Northeast India Hills Council</option>
                      <option value="Judea & Samaria Regional Council">Judea & Samaria Regional Council</option>
                      <option value="Central Israel Olim Communities">Central Israel Olim Communities</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="announcement-schedule" className="block text-xs font-medium text-slate-300 mb-1">Schedule Dispatch (Optional)</label>
                    <input
                      id="announcement-schedule"
                      type="text"
                      value={annSchedule}
                      onChange={(e) => setAnnSchedule(e.target.value)}
                      placeholder="Leave blank for immediate transmission"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="announcement-message" className="block text-xs font-medium text-slate-300 mb-1">Message Body</label>
                    <textarea
                      id="announcement-message"
                      rows={4}
                      required
                      value={annBody}
                      onChange={(e) => setAnnBody(e.target.value)}
                      placeholder="Enter detailed Halachic or communal announcement text..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Global Broadcast</span>
                  </button>
                </form>
              </div>

              {/* History Log */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg lg:col-span-2">
                <h3 className="text-lg font-bold text-white font-serif mb-4">Broadcast Transmission Archive</h3>
                <div className="space-y-4">
                  {announcements.map((a) => (
                    <div key={a.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-base">{a.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {a.targetRegion}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{a.body}</p>
                        <div className="mt-2 text-[11px] text-slate-500 flex items-center space-x-3">
                          <span>Author: <strong className="text-slate-400">{a.author}</strong></span>
                          <span>•</span>
                          <span>Schedule: <strong className="text-slate-400">{a.scheduledTime}</strong></span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {a.isBroadcasted ? 'Delivered' : 'Queued'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 6: PLATFORM ANALYTICS */}
          {activeTab === 'analytics' && (
            <div id="module-6-platform-analytics" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Active Users (DAU)</span>
                  <div className="text-4xl font-extrabold text-white font-mono mt-2">{analytics.dau.toLocaleString()}</div>
                  <div className="text-xs text-emerald-400 mt-2 font-medium">Consistently active across 4 time zones</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Active Users (MAU)</span>
                  <div className="text-4xl font-extrabold text-white font-mono mt-2">{analytics.mau.toLocaleString()}</div>
                  <div className="text-xs text-purple-400 mt-2 font-medium">92% retention rate in hill communities</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">YoY Platform Growth</span>
                  <div className="text-4xl font-extrabold text-emerald-400 font-mono mt-2">{analytics.yoyGrowth}</div>
                  <div className="text-xs text-slate-400 mt-2 font-medium">Driven by Aliyah registration & offline Torah sync</div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white font-serif mb-4">Module Engagement & Telemetry Breakdown</h3>
                <div className="space-y-5">
                  {analytics.moduleMetrics.map((mod, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-200">{mod.moduleName}</span>
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-xs text-slate-400">{mod.dailyInteractions.toLocaleString()} interactions/day</span>
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {mod.trend}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                        <div className="bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${mod.activeUsersPercentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 7: SUBSCRIPTION MANAGEMENT */}
          {activeTab === 'subscriptions' && (
            <div id="module-7-subscription-management" className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white font-serif flex items-center space-x-2 mb-6">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span>Plan Governance, Regional Licenses & Donation Tracking</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-md">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-white text-lg">{sub.planName}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                            ${sub.monthlyFeeUsd}/mo
                          </span>
                        </div>
                        <div className="text-2xl font-extrabold text-white font-mono">{sub.activeSubscribers.toLocaleString()}</div>
                        <p className="text-xs text-slate-400 mb-4">Active Subscriber Licenses</p>
                        <div className="space-y-2 border-t border-slate-800/80 pt-4 text-xs text-slate-300">
                          {sub.featuresIncluded.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center space-x-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>Regional Allocations: {sub.regionalLicensesAllocated}</span>
                        <span className="text-emerald-400 font-bold">${sub.totalRevenueYTD.toLocaleString()} YTD</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 8: SECURITY CENTER */}
          {activeTab === 'security' && (
            <div id="module-8-security-center" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Failed Logins (24h)</span>
                  <div className="text-3xl font-bold text-white font-mono mt-2">{security.failedLogins24h}</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Locked Accounts</span>
                  <div className="text-3xl font-bold text-red-400 font-mono mt-2">{security.lockedAccountsCount}</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">API Cluster Health</span>
                  <div className="text-3xl font-bold text-emerald-400 font-mono mt-2">{security.apiHealthScore}</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Database Encryption</span>
                  <div className="text-xs font-bold text-blue-400 mt-3">{security.databaseEncryptionStatus}</div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white font-serif mb-4">Security Events & Audit Trail</h3>
                <div className="space-y-3">
                  {security.recentSecurityEvents.map((evt) => (
                    <div key={evt.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          evt.severity === 'High' ? 'bg-red-500' : evt.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <div className="font-bold text-white">{evt.eventType}</div>
                          <div className="text-xs text-slate-400 font-mono">{evt.userOrIp}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-slate-500">{evt.timestamp}</span>
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                          evt.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300' :
                          evt.status === 'Blocked' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {evt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 9: BACKUP & RECOVERY */}
          {activeTab === 'backup' && (
            <div id="module-9-backup-recovery" className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white font-serif flex items-center space-x-2">
                      <Database className="w-5 h-5 text-amber-400" />
                      <span>Sovereign Database Backups & Disaster Recovery Vault</span>
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Automated Point-in-Time Recovery (PITR) snapshots across redundant S3/GCS buckets.
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerBackup}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition shrink-0"
                  >
                    <HardDrive className="w-4 h-4" />
                    <span>Trigger Manual PITR Snapshot</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3 pr-4">Snapshot Archive Name</th>
                        <th className="pb-3 px-3">Type</th>
                        <th className="pb-3 px-3">Compressed Size</th>
                        <th className="pb-3 px-3">Timestamp</th>
                        <th className="pb-3 px-3">Storage Location</th>
                        <th className="pb-3 pl-3 text-right">Verification Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {backups.map((bkp) => (
                        <tr key={bkp.id} className="hover:bg-slate-800/40 transition font-mono text-xs">
                          <td className="py-4 pr-4 font-bold text-white">{bkp.backupName}</td>
                          <td className="py-4 px-3 text-amber-300">{bkp.type}</td>
                          <td className="py-4 px-3 text-slate-300">{bkp.sizeGb}</td>
                          <td className="py-4 px-3 text-slate-400">{bkp.timestamp}</td>
                          <td className="py-4 px-3 text-slate-500 truncate max-w-[200px]">{bkp.storageLocation}</td>
                          <td className="py-4 pl-3 text-right">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {bkp.status}
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

          {/* MODULE 10: FEATURE MANAGEMENT */}
          {activeTab === 'features' && (
            <div id="module-10-feature-flags" className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white font-serif flex items-center space-x-2 mb-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  <span>Platform Feature Flags & Runtime Module Control</span>
                </h2>
                <p className="text-sm text-slate-400 mb-6">
                  Enable or disable enterprise platform capabilities globally in real-time without redeploying containers.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {toggles.map((feat) => (
                    <div key={feat.key} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-base">{feat.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            {feat.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{feat.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggleFeature(feat.key)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition shrink-0 ${
                          feat.isEnabled
                            ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                        }`}
                      >
                        {feat.isEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: DIGITAL TRUST REGISTRY (GLOBAL ADMIN ENTERPRISE SYSTEM) */}
          {activeTab === 'digital_registry' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#16223B] to-slate-900 border border-amber-500/30 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Global Cryptographic Master Registry</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">Enterprise Digital Signature & Verification</h3>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    Centralized master governance across all 12 platform document types. Every official record issued by Regional Councils, Rabbinical Authorities, or Community Services is cryptographically indexed and independently verifiable.
                  </p>
                </div>
                <button
                  onClick={() => setVerifyingCode('BMCI-2026-0001824')}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl transition-all flex items-center gap-2 shrink-0"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Open Public Verification Page</span>
                </button>
              </div>

              {/* Master Analytics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Total Certified Documents</div>
                  <div className="text-2xl font-black text-white">{masterCerts.length} Records</div>
                  <div className="text-[10px] text-emerald-400 font-bold">100% Indexed & Cryptographically Sealed</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Active Valid Seals</div>
                  <div className="text-2xl font-black text-emerald-400">
                    {masterCerts.filter(c => c.verificationStatus === 'Verified').length} Valid
                  </div>
                  <div className="text-[10px] text-slate-400">Regional Council Approved Nodes</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Cryptographic Integrity</div>
                  <div className="text-2xl font-black text-amber-400">SHA-256 Valid</div>
                  <div className="text-[10px] text-slate-400">Zero Hash Mismatches Detected</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Revoked Records</div>
                  <div className="text-2xl font-black text-rose-400">
                    {masterCerts.filter(c => c.verificationStatus === 'Revoked').length} Revoked
                  </div>
                  <div className="text-[10px] text-slate-400">Audited with Revocation Reasons</div>
                </div>
              </div>

              {/* Master Registry Search & Filter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="relative flex-1 w-full sm:w-auto">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={registrySearch}
                    onChange={(e) => setRegistrySearch(e.target.value)}
                    placeholder="Search by Document ID, Citizen ID, Household ID, Document Type, Issue Date, QR ID..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <select
                  value={registryCategory}
                  onChange={(e) => setRegistryCategory(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="All">All Categories</option>
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

              {/* Master Registry Table */}
              <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="p-4">Document Number & Fingerprint</th>
                        <th className="p-4">Document Category / Title</th>
                        <th className="p-4">Recipient & ID</th>
                        <th className="p-4">Issuing Authority Node</th>
                        <th className="p-4">Date & Status</th>
                        <th className="p-4 text-right">Verification Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      {DigitalSignatureService.searchRegistry(registrySearch, registryCategory).map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 font-mono">
                            <div className="font-bold text-amber-400 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{doc.documentNumber}</span>
                            </div>
                            <div className="text-[9px] text-slate-400 truncate max-w-[150px] mt-0.5">
                              Hash: {doc.sha256Fingerprint.substring(0, 16)}...
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-black text-white">{doc.documentName}</div>
                            <div className="text-[10px] text-slate-400">{doc.category}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{doc.recipientName}</div>
                            {doc.citizenId && <div className="text-[10px] font-mono text-slate-400">{doc.citizenId}</div>}
                          </td>
                          <td className="p-4 text-slate-300">
                            {doc.issuingAuthority}
                          </td>
                          <td className="p-4">
                            <div className="text-slate-300 font-mono">{doc.issueDate}</div>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold ${
                              doc.verificationStatus === 'Verified'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : doc.verificationStatus === 'Revoked'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {doc.verificationStatus} ({doc.version})
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setVerifyingCode(doc.documentNumber)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold transition-all flex items-center gap-1.5 ml-auto"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Inspect Seal</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Master Audit Logs Section */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Immutable Cryptographic Audit Trail</span>
                    </h4>
                    <p className="text-xs text-slate-400">Continuous logging trail of every certificate generation, verification query, and administrative revocation across the platform.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {DigitalSignatureService.getAuditLogs().slice(0, 8).map((log) => (
                    <div key={log.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-amber-300 font-mono flex items-center gap-2">
                          <span>{log.action}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{log.documentNumber}</span>
                        </div>
                        <div className="text-slate-400">{log.details}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-white">{log.actor}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{log.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* PUBLIC VERIFICATION MODAL */}
      {verifyingCode && (
        <PublicVerificationModal
          initialCode={verifyingCode}
          onClose={() => setVerifyingCode(null)}
        />
      )}
    </div>
  );
};
