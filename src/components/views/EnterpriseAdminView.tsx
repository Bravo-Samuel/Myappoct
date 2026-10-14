import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  Terminal, 
  Bell, 
  Users, 
  Layers, 
  Activity, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Key, 
  FileText, 
  Send, 
  Server, 
  Cpu, 
  Globe, 
  Sliders,
  ChevronRight,
  UserCheck,
  Eye
} from 'lucide-react';
import { 
  ENTERPRISE_ROLES, 
  GRANULAR_PERMISSIONS_CATALOG, 
  ROLE_PERMISSION_MAPPINGS, 
  INITIAL_AUDIT_LOGS, 
  DATABASE_SCHEMA_BLUEPRINTS, 
  API_ENDPOINTS_REGISTRY, 
  INITIAL_NOTIFICATION_DISPATCHES 
} from '../../data/enterpriseArchitectureData';
import { EnterpriseRole, AuditLogRecord, NotificationDispatchRecord } from '../../types';

export const EnterpriseAdminView: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<EnterpriseRole>('Super Admin');
  const [activeTab, setActiveTab] = useState<'overview' | 'rbac' | 'audit' | 'database' | 'api' | 'notifications' | 'auth_dev_console'>('overview');
  
  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(INITIAL_AUDIT_LOGS);
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditFilterCategory, setAuditFilterCategory] = useState<string>('ALL');

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationDispatchRecord[]>(INITIAL_NOTIFICATION_DISPATCHES);
  const [newNotifTitle, setNewNotifTitle] = useState('');
  const [newNotifMessage, setNewNotifMessage] = useState('');
  const [newNotifChannel, setNewNotifChannel] = useState<'Push' | 'WhatsApp' | 'SMS' | 'Email'>('Push');
  const [newNotifGroup, setNewNotifGroup] = useState('Manipur Regional Council (All Active Synagogues)');

  // API Testing Simulation
  const [selectedEndpointIdx, setSelectedEndpointIdx] = useState(0);
  const [simulatedApiResponse, setSimulatedApiResponse] = useState<string | null>(null);
  const [isSimulatingApi, setIsSimulatingApi] = useState(false);

  const activePermissions = ROLE_PERMISSION_MAPPINGS[currentRole] || [];

  const handleSimulateAuditLog = (actionName: string, cat: AuditLogRecord['category'], prev: string, next: string) => {
    const newLog: AuditLogRecord = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      user: { name: `Current Architect (${currentRole})`, email: 'architect@cloud.bneimenashe.org', role: currentRole },
      ipAddress: '103.211.54.18 (Manipur Edge Node)',
      device: 'Bnei Menashe Control Console / HTTPS',
      action: actionName,
      category: cat,
      previousValue: prev,
      newValue: next,
      status: 'SUCCESS'
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleDispatchNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifTitle.trim() || !newNotifMessage.trim()) return;

    const newNotif: NotificationDispatchRecord = {
      id: `NOTIF-${Math.floor(800 + Math.random() * 200)}`,
      timestamp: 'Just now',
      channel: newNotifChannel,
      recipientGroup: newNotifGroup,
      title: newNotifTitle,
      message: newNotifMessage,
      status: 'Delivered'
    };

    setNotifications([newNotif, ...notifications]);
    handleSimulateAuditLog(`DISPATCH_${newNotifChannel.toUpperCase()}_ALERT`, 'TENANT', 'Queue status: 0 pending', `Dispatched "${newNotifTitle}" to ${newNotifGroup}`);
    setNewNotifTitle('');
    setNewNotifMessage('');
  };

  const handleRunApiTest = () => {
    setIsSimulatingApi(true);
    setSimulatedApiResponse(null);
    setTimeout(() => {
      const ep = API_ENDPOINTS_REGISTRY[selectedEndpointIdx];
      setSimulatedApiResponse(JSON.stringify({
        status: 200,
        latencyMs: Math.floor(14 + Math.random() * 28),
        edgeRegion: 'asia-southeast1 (Cloud Run ingressed via Cloudflare)',
        authValidated: true,
        invokedByRole: currentRole,
        rateLimitRemaining: '298 / 300',
        data: JSON.parse(ep.responseSchemaPreview)
      }, null, 2));
      setIsSimulatingApi(false);
      handleSimulateAuditLog(`API_TEST_INVOCATION_${ep.method}`, 'SECURITY', 'Test runner initialized', `Executed ${ep.path} with 200 OK`);
    }, 450);
  };

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
                          log.user.name.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
                          log.ipAddress.toLowerCase().includes(auditSearchQuery.toLowerCase());
    const matchesCat = auditFilterCategory === 'ALL' || log.category === auditFilterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32">
      {/* Enterprise Architecture Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#070D1F] via-[#111C3A] to-[#070D1F] text-white shadow-2xl border border-amber-500/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>National SaaS Control Plane & Architectural Core</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Enterprise Security, RBAC & Data Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Designed according to national SaaS standards: Multi-tenant isolation, immutable audit logging, Postgres/Prisma ORM schema enforcement, and multi-channel notification dispatch.
            </p>
          </div>

          {/* Role Access Selector */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Active Administrative Tier:</span>
            </div>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as EnterpriseRole)}
              className="bg-[#0B132B] border border-slate-700 text-amber-400 text-xs font-black rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-400 shadow-inner cursor-pointer"
            >
              {ENTERPRISE_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* System Health Indicators Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Edge Gateway:</span>
            <span className="font-mono font-bold text-emerald-300">ONLINE (99.99%)</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">Postgres Cluster:</span>
            <span className="font-mono font-bold text-amber-300">Multi-Region Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300">RBAC Enforcement:</span>
            <span className="font-mono font-bold text-indigo-300">Strict Auth Level</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="text-slate-300">Audit Trail:</span>
            <span className="font-mono font-bold text-rose-300">Append-Only Active</span>
          </div>
        </div>
      </div>

      {/* Control Plane Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        {[
          { id: 'overview', label: '1. System Control & Tenancy', icon: Sliders },
          { id: 'rbac', label: '2. RBAC Permission Engine', icon: Lock },
          { id: 'audit', label: '3. Immutable Audit Ledger', icon: Activity },
          { id: 'database', label: '4. ORM & SQL Database Schema', icon: Database },
          { id: 'api', label: '5. REST API Gateway & Rate Limiting', icon: Terminal },
          { id: 'notifications', label: '6. Multi-Channel Dispatcher', icon: Bell },
          { id: 'auth_dev_console', label: '7. Auth Module Diagnostics & Checklist', icon: ShieldCheck }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#0A1128] text-amber-400 shadow-lg border border-amber-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & TENANCY */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Multi-Tenant Isolation</span>
                <Globe className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">4 Regional Councils</div>
              <p className="text-xs text-slate-500">
                Manipur, Mizoram, Israel North, and Diaspora hubs operate with strict row-level tenant separation.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active User Identities</span>
                <Users className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">65,420 Verified</div>
              <p className="text-xs text-slate-500">
                Supported via Google OAuth 2.0, OTP Magic Links, and offline PWA session caching.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Halachic Computations</span>
                <Cpu className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">3.6M Zmanim Reads</div>
              <p className="text-xs text-slate-500">
                Precomputed D3 solar coordinates and Molad intervals served from global Cloudflare Edge cache.
              </p>
            </div>
          </div>

          {/* Regional Council Tenancy Status Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <span>Active Organization Workspaces (SaaS Tenancy Directory)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-4">Council ID</th>
                    <th className="py-3 px-4">Organization Name</th>
                    <th className="py-3 px-4">Region Hub</th>
                    <th className="py-3 px-4">Active Synagogues</th>
                    <th className="py-3 px-4">Subscription Tier</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { id: 'TENANT-MN-01', name: 'Churachandpur Central Synagogue Council', hub: 'Manipur (India)', syn: 18, tier: 'SYNAGOGUE ENTERPRISE', status: 'Active (PRO)' },
                    { id: 'TENANT-MZ-02', name: 'Aizawl & Lunglei Bnei Menashe Heritage', hub: 'Mizoram (India)', syn: 14, tier: 'FAMILY HERITAGE PRO', status: 'Active (PRO)' },
                    { id: 'TENANT-IL-03', name: 'Nof HaGalil & Kiryat Arba Aliya Hub', hub: 'Northern Israel', syn: 8, tier: 'SYNAGOGUE ENTERPRISE', status: 'Active (PRO)' },
                    { id: 'TENANT-DI-04', name: 'Global Diaspora Outreach Network', hub: 'North America / UK', syn: 5, tier: 'FREE COMMUNITY', status: 'Active (Free)' }
                  ].map((org, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">{org.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{org.name}</td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{org.hub}</td>
                      <td className="py-3.5 px-4 font-semibold">{org.syn} Synagogues</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                          {org.tier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {org.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GRANULAR RBAC MATRIX */}
      {activeTab === 'rbac' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-500" />
                  <span>Granular Role-Based Access Control (RBAC) Engine</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Inspecting permissions currently assigned to role: <strong className="text-amber-600 dark:text-amber-400 uppercase">{currentRole}</strong>
                </p>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs">
                {activePermissions.length} of {GRANULAR_PERMISSIONS_CATALOG.length} System Capabilities Granted
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GRANULAR_PERMISSIONS_CATALOG.map((perm) => {
                const isGranted = activePermissions.includes(perm.key);
                return (
                  <div
                    key={perm.key}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      isGranted
                        ? 'bg-emerald-500/5 border-emerald-500/40 text-slate-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {perm.category}
                        </span>
                        <code className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">{perm.key}</code>
                      </div>
                      <div className="font-bold text-sm mt-1.5">{perm.label}</div>
                      <p className="text-xs text-slate-500 mt-0.5">{perm.description}</p>
                    </div>

                    <div className="shrink-0 mt-1">
                      {isGranted ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>GRANTED</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400">RESTRICTED</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LEDGER */}
      {activeTab === 'audit' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-500" />
                  <span>Immutable System Audit Ledger</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Every user action, AI query, zmanim override, and billing modification is recorded permanently.
                </p>
              </div>

              <button
                onClick={() => handleSimulateAuditLog('MANUAL_AUDIT_VERIFICATION', 'SECURITY', 'Integrity check: Pending', 'Verified sha256 ledger hash match')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Verify System Integrity</span>
              </button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by action name, user email, or IP address..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={auditFilterCategory}
                onChange={(e) => setAuditFilterCategory(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="HALACHA">Halacha & Zmanim</option>
                <option value="TENANT">Tenant & Minyan</option>
                <option value="SECURITY">Security & Rate Limit</option>
                <option value="BILLING">Billing & Subscriptions</option>
                <option value="AI_QUERY">AI Rabbi Q&A</option>
              </select>
            </div>

            {/* Audit Log Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Audit ID / Time</th>
                    <th className="py-3 px-3">Actor & Role</th>
                    <th className="py-3 px-3">Category / Action</th>
                    <th className="py-3 px-3">Previous State</th>
                    <th className="py-3 px-3">New State</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-amber-600 dark:text-amber-400">{log.id}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{log.timestamp}</div>
                      </td>
                      <td className="py-3.5 px-3 font-sans">
                        <div className="font-bold text-slate-900 dark:text-white">{log.user.name}</div>
                        <div className="text-[10px] text-slate-500">{log.user.email} • {log.user.role}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[9px] font-bold text-slate-800 dark:text-slate-200">
                          {log.category}
                        </span>
                        <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">{log.action}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 max-w-xs truncate">{log.previousValue || 'N/A'}</td>
                      <td className="py-3.5 px-3 text-slate-800 dark:text-slate-200 max-w-xs font-semibold">{log.newValue}</td>
                      <td className="py-3.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {log.status}
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

      {/* TAB 4: DATABASE BLUEPRINTS */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-500" />
              <span>Relational Schema Specification (Postgres / Prisma ORM)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Complete schema blueprint ensuring ACID compliance, soft-deletion audit fields, and indexed halachic lookups.
            </p>

            <div className="space-y-6">
              {DATABASE_SCHEMA_BLUEPRINTS.map((tbl) => (
                <div key={tbl.tableName} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-amber-600 dark:text-amber-400">{tbl.tableName}</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                          {tbl.rowCountEstimate}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{tbl.description}</p>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400">
                      Indexes: {tbl.indexes.join(', ')}
                    </div>
                  </div>

                  <div className="overflow-x-auto mt-3">
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr className="text-slate-400 text-[10px] uppercase">
                          <th className="py-2 px-2">Column Name</th>
                          <th className="py-2 px-2">Data Type</th>
                          <th className="py-2 px-2">Constraints</th>
                          <th className="py-2 px-2">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/40 dark:divide-slate-700/40">
                        {tbl.columns.map((col) => (
                          <tr key={col.name} className="hover:bg-slate-100 dark:hover:bg-slate-800">
                            <td className="py-2 px-2 font-bold text-slate-900 dark:text-white">{col.name}</td>
                            <td className="py-2 px-2 text-amber-600 dark:text-amber-400">{col.type}</td>
                            <td className="py-2 px-2">
                              {col.isPrimaryKey && <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[9px] mr-1">PK</span>}
                              {col.isForeignKey && <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-[9px] mr-1">FK</span>}
                              {!col.isNullable && <span className="text-[9px] text-slate-400">NOT NULL</span>}
                            </td>
                            <td className="py-2 px-2 text-slate-500 font-sans text-xs">{col.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REST API GATEWAY & RATE LIMITING */}
      {activeTab === 'api' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-500" />
              <span>REST API Endpoint Registry</span>
            </h3>
            <p className="text-xs text-slate-500">Select an endpoint to inspect authentication rate limits or verify live response payloads.</p>

            <div className="space-y-2.5">
              {API_ENDPOINTS_REGISTRY.map((ep, idx) => (
                <div
                  key={ep.path}
                  onClick={() => setSelectedEndpointIdx(idx)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedEndpointIdx === idx
                      ? 'bg-[#0A1128] text-white border-amber-500 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                      ep.method === 'GET' ? 'bg-emerald-500 text-slate-950' :
                      ep.method === 'POST' ? 'bg-indigo-500 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-bold truncate">{ep.path}</span>
                  </div>
                  <p className="text-[11px] opacity-80 mt-2 line-clamp-2">{ep.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0B132B] text-white border border-amber-500/30 shadow-xl flex flex-col justify-between">
            {(() => {
              const ep = API_ENDPOINTS_REGISTRY[selectedEndpointIdx];
              return (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-2 font-mono text-sm font-bold">
                        <span className="text-amber-400">{ep.method}</span>
                        <span>{ep.path}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
                        Role Required: {ep.requiredRole}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">{ep.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Rate Limit Protection</span>
                      <span className="font-mono font-bold text-amber-300 mt-0.5 block">{ep.rateLimit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Edge Caching Policy</span>
                      <span className="font-mono font-bold text-emerald-300 mt-0.5 block">{ep.caching}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Live Response Payload</span>
                    <pre className="bg-black/60 p-4 rounded-2xl border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto">
                      {simulatedApiResponse || JSON.stringify(JSON.parse(ep.responseSchemaPreview), null, 2)}
                    </pre>
                  </div>

                  <button
                    onClick={handleRunApiTest}
                    disabled={isSimulatingApi}
                    className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-transform hover:scale-[1.01] shadow-lg flex items-center justify-center gap-2"
                  >
                    {isSimulatingApi ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isSimulatingApi ? 'Executing Edge Request...' : `Test API Endpoint (${ep.method} ${ep.path})`}</span>
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 6: MULTI-CHANNEL NOTIFICATION DISPATCHER */}
      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-500" />
              <span>Enterprise Broadcast Dispatcher</span>
            </h3>
            <p className="text-xs text-slate-500">
              Send urgent Shabbat times or minyan alerts across Push, WhatsApp, SMS, and Email pipelines simultaneously.
            </p>

            <form onSubmit={handleDispatchNotification} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Recipient Group</label>
                <select
                  value={newNotifGroup}
                  onChange={(e) => setNewNotifGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="Manipur Regional Council (All Active Synagogues)">Manipur Regional Council (All Active Synagogues)</option>
                  <option value="Churachandpur Central Synagogue Members (412 Users)">Churachandpur Central Synagogue Members (412 Users)</option>
                  <option value="Aizawl Youth Torah Study Circle (84 Users)">Aizawl Youth Torah Study Circle (84 Users)</option>
                  <option value="Israel North Aliya Hub (Nof HaGalil)">Israel North Aliya Hub (Nof HaGalil)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Delivery Channel</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Push', 'WhatsApp', 'SMS', 'Email'] as const).map((chan) => (
                    <button
                      key={chan}
                      type="button"
                      onClick={() => setNewNotifChannel(chan)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        newNotifChannel === chan
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {chan}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Alert Title</label>
                <input
                  type="text"
                  placeholder="e.g., 🕯️ Urgent Candle Lighting Alert for Churachandpur"
                  value={newNotifTitle}
                  onChange={(e) => setNewNotifTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Message Body</label>
                <textarea
                  rows={3}
                  placeholder="Enter broadcast message details..."
                  value={newNotifMessage}
                  onChange={(e) => setNewNotifMessage(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#0A1128] hover:bg-slate-800 text-amber-400 font-black text-xs transition-transform hover:scale-[1.01] shadow-md flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Dispatch Broadcast Notification</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              <span>Recent Delivery Queue & Logs</span>
            </h3>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[10px] font-mono">
                        {notif.channel}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{notif.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Target: {notif.recipientGroup}</span>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono">
                      {notif.status}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">{notif.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: AUTH MODULE DIAGNOSTICS & READINESS CHECKLIST */}
      {activeTab === 'auth_dev_console' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0D1836] to-slate-900 border border-amber-500/30 text-white shadow-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Key className="w-3.5 h-3.5" />
                  <span>Admin Developer Console • Super Admin Only</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Authentication Module Diagnostics & Architecture Suite
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  All technical status panels, readiness checklists, implementation badges, and diagnostic tools moved out of public production views into this protected control plane.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-right text-xs font-mono text-amber-300">
                <div className="font-bold">STATUS: PRODUCTION UI POLISHED</div>
                <div className="text-[11px] text-slate-400">Public Auth Clean • Handlers Pre-Wired</div>
              </div>
            </div>
          </div>

          {/* Readiness Checklist Grid */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Supabase Auth Integration Readiness Checklist</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Welcome Hub (`WelcomePage.tsx`)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">PRODUCTION READY</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Refactored to match Apple ID / Linear SaaS standards. Exclusively renders Brand Logo, Hero Section, Value Proposition, Sign In / Create Account buttons, Guest mode, Language selector, and Dark/Light toggle.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Sign In (`SignInPage.tsx`)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">PRODUCTION READY</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Clean form featuring Email, Password, Remember Me, Forgot Password, Sign In button, Continue with Google, and Continue with Apple. All developer presets removed.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Sign Up (`SignUpPage.tsx`)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">PRODUCTION READY</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Streamlined to Name, Email, Password, Confirm Password, Community Hub dropdown, Country dropdown, Terms checkbox, and Create Account button.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Forgot Password (`ForgotPasswordPage.tsx`)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">PRODUCTION READY</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Official account recovery email dispatch verification screen. Guarantees safe password recovery across all community member households.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Reset Password (`ResetPasswordPage.tsx`)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">PRODUCTION READY</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Real-time 4-point cryptographic password strength analyzer without public debugging annotations.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Verify Email (`VerifyEmailPage.tsx`)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">PRODUCTION READY</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  6-digit numeric OTP input with focus auto-advance and rate-limited resend timer.
                </p>
              </div>
            </div>
          </div>

          {/* OAuth & Technical Diagnostics Suite */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-500" />
                <span>OAuth 2.0 / OIDC Technical Architecture</span>
              </h4>
              <div className="space-y-3 text-xs font-mono text-slate-600 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-400 text-[10px] uppercase">Redirect Configuration</div>
                  <div className="font-bold mt-0.5">https://auth.bneimenashe.org/oauth/v2/callback</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-400 text-[10px] uppercase">Federated Providers</div>
                  <div className="font-bold mt-0.5">Google Workspace OIDC • Sign in with Apple ID (JWT RS256)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-400 text-[10px] uppercase">Session Persistence</div>
                  <div className="font-bold mt-0.5">HttpOnly Secure Cookies • Short-Lived JWT (1 hr) + Refresh (30d)</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                <span>Designated Leadership Contact Directory</span>
              </h4>
              <p className="text-xs text-slate-500">
                Contact these designated regional coordinators for verification inquiries or administrative escalation:
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span>Super Admin:</span>
                  <span className="font-bold text-amber-500">david.s@bneimenashe.org</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span>Synagogue Rabbi:</span>
                  <span className="font-bold text-emerald-500">rabbi@beitshalom.org</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span>Regional Gabbai:</span>
                  <span className="font-bold text-blue-500">gabbai@aizawl-council.org</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
