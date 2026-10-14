import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Layers, 
  Sliders, 
  Zap, 
  ShieldCheck, 
  Server, 
  Terminal, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  Pause, 
  Lock, 
  Globe, 
  Box, 
  Power, 
  Bell, 
  Sparkles,
  Search,
  ArrowUpRight,
  TrendingUp,
  Clock,
  UserCheck
} from 'lucide-react';
import { 
  SystemObservabilityHealth, 
  EnterpriseEvent, 
  BackgroundJobItem, 
  FeatureFlagConfig, 
  InstalledPluginSpec,
  EnterpriseRole
} from '../../types';
import { enterpriseBus, executeMasterWorkflow } from '../../services/MasterWorkflowEngine';
import { featureFlagRegistry } from '../../services/FeatureFlagRegistry';
import { aiGatewayService } from '../../services/AIGatewayService';

export const EnterpriseObservabilityCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'observability' | 'workflow_events' | 'job_queue' | 'feature_flags' | 'plugins' | 'ai_gateway'>('observability');

  // Live Observability Health State
  const [healthMetrics] = useState<SystemObservabilityHealth>({
    systemHealthScore: 99.4,
    apiHealth: 'HEALTHY',
    queueHealth: 'OPTIMAL',
    dbHealth: 'NORMAL_SYNC',
    cacheHitRatePercentage: 94.2,
    storageUsageGB: 412.8,
    storageCapacityGB: 2000,
    avgLatencyMs: 18.5,
    activeUsersLiveCount: 65420,
    activeTenantsCount: 45,
    monthlyRecurringRevenueUSD: 142800,
    securityThreatsBlockedToday: 142
  });

  // Live Event Bus & Jobs State
  const [events, setEvents] = useState<EnterpriseEvent[]>([]);
  const [jobs, setJobs] = useState<BackgroundJobItem[]>([]);
  const [flags, setFlags] = useState<FeatureFlagConfig[]>([]);
  const [plugins, setPlugins] = useState<InstalledPluginSpec[]>([]);

  // Master Workflow Simulation State
  const [simWorkflowRole, setSimWorkflowRole] = useState<EnterpriseRole>('Synagogue Admin');
  const [simWorkflowAction, setSimWorkflowAction] = useState('BROADCAST_SHABBAT_ZMANIM');
  const [workflowLog, setWorkflowLog] = useState<{ step: string; message: string; timestamp: string }[]>([]);
  const [isExecutingWorkflow, setIsExecutingWorkflow] = useState(false);

  // AI Gateway Tester State
  const [aiPrompt, setAiPrompt] = useState('Explain the halachic inheritance laws in Parashat Pinchas');
  const [aiLanguage, setAiLanguage] = useState<'English' | 'Mizo' | 'Hebrew'>('Mizo');
  const [aiGatewayResponse, setAiGatewayResponse] = useState<any>(null);
  const [isTestingGateway, setIsTestingGateway] = useState(false);

  useEffect(() => {
    // Sync initial state from singletons
    setEvents(enterpriseBus.getRecentEvents());
    setJobs(enterpriseBus.getBackgroundJobs());
    setFlags(featureFlagRegistry.getFeatureFlags());
    setPlugins(featureFlagRegistry.getInstalledPlugins());

    // Subscribe to updates
    const unsubEvents = enterpriseBus.subscribeToEvents(() => {
      setEvents([...enterpriseBus.getRecentEvents()]);
    });
    const unsubJobs = enterpriseBus.subscribeToJobs(() => {
      setJobs([...enterpriseBus.getBackgroundJobs()]);
    });
    const unsubRegistry = featureFlagRegistry.subscribe(() => {
      setFlags([...featureFlagRegistry.getFeatureFlags()]);
      setPlugins([...featureFlagRegistry.getInstalledPlugins()]);
    });

    return () => {
      unsubEvents();
      unsubJobs();
      unsubRegistry();
    };
  }, []);

  const handleTriggerMasterWorkflow = async () => {
    setIsExecutingWorkflow(true);
    setWorkflowLog([]);

    const logStep = (step: string, message: string) => {
      setWorkflowLog(prev => [{
        step,
        message,
        timestamp: new Date().toISOString().substring(11, 23)
      }, ...prev]);
    };

    await executeMasterWorkflow(
      {
        actionId: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
        actionName: simWorkflowAction,
        actorRole: simWorkflowRole,
        actorEmail: `sim.${simWorkflowRole.toLowerCase().replace(/\s+/g, '.')}@bneimenashe.org`,
        requiredPermission: simWorkflowAction === 'BROADCAST_SHABBAT_ZMANIM' ? 'can_broadcast_minyan' : 'can_query_ai_rabbi',
        payload: { targetSynagogue: 'Churachandpur Central', radiusKm: 5, alertPriority: 'HIGH' }
      },
      async (payload) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { status: 'DISPATCHED_TO_412_MEMBERS', payload };
      },
      (step, msg) => logStep(step, msg)
    );

    setIsExecutingWorkflow(false);
  };

  const handleQueueNewJob = (type: BackgroundJobItem['jobType'], priority: BackgroundJobItem['priority']) => {
    enterpriseBus.queueBackgroundJob({
      jobType: type,
      priority,
      maxRetries: 3,
      payloadSummary: `Manual administrator invocation of ${type} for active multi-tenant clusters.`
    });
  };

  const handleToggleFlag = (key: string) => {
    featureFlagRegistry.toggleFeatureFlag(key);
  };

  const handleTogglePlugin = (id: string) => {
    featureFlagRegistry.togglePluginStatus(id);
  };

  const handleTestAIGateway = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingGateway(true);
    try {
      const res = await aiGatewayService.invokeGatewayPipeline({
        promptText: aiPrompt,
        userRole: simWorkflowRole,
        userEmail: 'architect@cloud.bneimenashe.org',
        tenantId: 'TENANT-MN-01',
        targetLanguage: aiLanguage,
        mode: 'halachic_qa'
      });
      setAiGatewayResponse(res);
    } catch (err: any) {
      setAiGatewayResponse({ error: err.message });
    } finally {
      setIsTestingGateway(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32">
      {/* Phase 2 Enterprise Architect Control Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#070D1F] via-[#111C3A] to-[#0A1128] text-white shadow-2xl border border-amber-500/40 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Phase 2 Permanent Chief Enterprise Architect Control Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Enterprise Observability, Event Bus & Plugin Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Real-time governance over the 12-step Master Workflow Engine, scalable asynchronous job queues, dynamic feature flags, modular plugin sandboxes, and Gemini 3.5 AI Gateway guardrails.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30 flex items-center gap-4 shrink-0 shadow-xl">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">System Health Score</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">{healthMetrics.systemHealthScore}%</div>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Lighthouse Performance</div>
              <div className="text-2xl font-black text-amber-400 font-mono">99 / 100</div>
            </div>
          </div>
        </div>

        {/* Core System Vitals Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">API Gateway:</span>
            <span className="font-mono font-bold text-emerald-300">{healthMetrics.apiHealth}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">Job Queue:</span>
            <span className="font-mono font-bold text-amber-300">{healthMetrics.queueHealth}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300">Cache Hit Rate:</span>
            <span className="font-mono font-bold text-indigo-300">{healthMetrics.cacheHitRatePercentage}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300">DB Postgres:</span>
            <span className="font-mono font-bold text-cyan-300">{healthMetrics.dbHealth}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <span className="text-slate-300">Live ARR:</span>
            <span className="font-mono font-bold text-rose-300">${(healthMetrics.monthlyRecurringRevenueUSD * 12 / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </div>

      {/* Control Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        {[
          { id: 'observability', label: '1. Observability Dashboard', icon: Activity },
          { id: 'workflow_events', label: '2. Master Workflow Engine & Event Bus', icon: Layers },
          { id: 'job_queue', label: '3. Background Job Queue', icon: Cpu },
          { id: 'feature_flags', label: '4. Feature Flag Governance', icon: Sliders },
          { id: 'plugins', label: '5. Plugin Architecture Registry', icon: Box },
          { id: 'ai_gateway', label: '6. AI Service Layer Gateway', icon: Sparkles }
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

      {/* TAB 1: OBSERVABILITY DASHBOARD */}
      {activeTab === 'observability' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Concurrent Active Users</span>
                <Globe className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                {healthMetrics.activeUsersLiveCount.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+12.4% over past 30 days across 4 hubs</span>
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Average Edge Latency</span>
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                {healthMetrics.avgLatencyMs} ms
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Cloudflare CDN edge proxy to Cloud Run containers
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Postgres Storage Footprint</span>
                <Database className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                {healthMetrics.storageUsageGB} <span className="text-base text-slate-400">/ {healthMetrics.storageCapacityGB} GB</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-2">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(healthMetrics.storageUsageGB / healthMetrics.storageCapacityGB) * 100}%` }}></div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Security Shield Deflections</span>
                <ShieldCheck className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                {healthMetrics.securityThreatsBlockedToday} Blocked
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Zero Trust JWT validation & OWASP rate limiter
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER WORKFLOW ENGINE & EVENT BUS */}
      {activeTab === 'workflow_events' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Left Column: Interactive Workflow Execution Simulator */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <span>12-Step Master Workflow Engine Execution</span>
            </h3>
            <p className="text-xs text-slate-500">
              Execute live workflow verification to inspect each stage sequentially: User Action → RBAC Validation → DB Transaction → Audit Log → Telemetry Event → Notification Dispatch.
            </p>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Actor Role</label>
                  <select
                    value={simWorkflowRole}
                    onChange={(e) => setSimWorkflowRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    <option value="Synagogue Admin">Synagogue Admin</option>
                    <option value="Member">Member (Standard Tier)</option>
                    <option value="Guest">Guest (Unauthenticated)</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Action</label>
                  <select
                    value={simWorkflowAction}
                    onChange={(e) => setSimWorkflowAction(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    <option value="BROADCAST_SHABBAT_ZMANIM">BROADCAST_SHABBAT_ZMANIM</option>
                    <option value="AI_RABBI_QA_QUERY">AI_RABBI_QA_QUERY</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleTriggerMasterWorkflow}
                disabled={isExecutingWorkflow}
                className="w-full py-3.5 rounded-2xl bg-[#0A1128] hover:bg-slate-800 text-amber-400 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isExecutingWorkflow ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>{isExecutingWorkflow ? 'Executing 12-Step Master Lifecycle...' : 'Execute Full Master Workflow Lifecycle'}</span>
              </button>
            </div>

            {/* Execution Step Log */}
            {workflowLog.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-[#0B132B] text-white border border-amber-500/30 font-mono text-xs max-h-72 overflow-y-auto space-y-2.5">
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">Live Execution Pipeline Trail:</div>
                {workflowLog.map((logItem, idx) => (
                  <div key={idx} className="flex items-start gap-2 border-l-2 border-amber-500 pl-2">
                    <span className="text-[10px] text-slate-400 shrink-0">{logItem.timestamp}</span>
                    <div>
                      <span className="font-bold text-amber-300">[{logItem.step}]</span> {logItem.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Live Event Bus Stream */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-500" />
                <span>Enterprise Event Bus Stream</span>
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] font-mono animate-pulse">
                LIVE PUBLISH/SUBSCRIBE
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {events.map((evt) => (
                <div key={evt.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{evt.eventType}</span>
                    <span className="text-[10px] text-slate-400">{evt.timestamp}</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">{evt.actor}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    {JSON.stringify(evt.payload)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ASYNC BACKGROUND JOB QUEUE */}
      {activeTab === 'job_queue' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-amber-500" />
                  <span>Scalable Asynchronous Job Queue Control</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Queue non-blocking background workers for PDF generation, D3 solar zmanim caching, and WhatsApp dispatch.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQueueNewJob('ASTRONOMICAL_ZMANIM_SYNC', 'CRITICAL')}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md"
                >
                  + Queue Zmanim Sync
                </button>
                <button
                  onClick={() => handleQueueNewJob('PDF_REPORT_GENERATION', 'HIGH')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all shadow-md"
                >
                  + Queue PDF Report
                </button>
              </div>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Job ID</th>
                    <th className="py-3 px-3">Job Type</th>
                    <th className="py-3 px-3">Priority</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Attempts</th>
                    <th className="py-3 px-3">Payload / Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3.5 px-3 font-bold text-amber-600 dark:text-amber-400">{job.id}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">{job.jobType}</td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          job.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' :
                          job.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        }`}>
                          {job.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          job.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          job.status === 'PROCESSING' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold">{job.attempts} / {job.maxRetries}</td>
                      <td className="py-3.5 px-3 font-sans text-slate-600 dark:text-slate-300 max-w-md truncate">{job.payloadSummary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FEATURE FLAG GOVERNANCE */}
      {activeTab === 'feature_flags' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-500" />
              <span>Enterprise Feature Flag Governance & Kill Switches</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Toggle progressive rollouts across Development, Beta Users, Regional Rollout, or activate immediate emergency kill switches.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flags.map((f) => (
                <div key={f.key} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-amber-600 dark:text-amber-400">{f.key}</span>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        f.status === 'GLOBAL_RELEASE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        f.status === 'EMERGENCY_DISABLED' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 font-mono' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      }`}>
                        {f.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">{f.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{f.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 text-xs font-mono">
                    <span className="text-slate-400">Rollout: <strong className="text-slate-800 dark:text-slate-200">{f.rolloutPercentage}%</strong></span>
                    <button
                      onClick={() => handleToggleFlag(f.key)}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 ${
                        f.isEmergencyKillSwitchActive
                          ? 'bg-rose-500 text-white hover:bg-rose-600'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-amber-500 hover:text-slate-950'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{f.isEmergencyKillSwitchActive ? 'Kill Switch Active (Enable)' : 'Toggle Kill Switch'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PLUGIN ARCHITECTURE REGISTRY */}
      {activeTab === 'plugins' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Box className="w-5 h-5 text-amber-500" />
              <span>Modular Plugin Architecture Registry</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Future modules install cleanly without modifying core code. Each plugin registers hooks into the event bus autonomously.
            </p>

            <div className="space-y-4">
              {plugins.map((plg) => (
                <div key={plg.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black text-amber-600 dark:text-amber-400">{plg.id}</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                        {plg.category} (v{plg.version})
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">{plg.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{plg.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-slate-400">
                      <span>Hooks: {plg.registeredHooks.join(', ')}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3 self-end sm:self-center">
                    <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                      plg.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                      plg.status === 'SANDBOXED' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {plg.status}
                    </span>
                    <button
                      onClick={() => handleTogglePlugin(plg.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#0A1128] hover:bg-slate-800 text-amber-400 font-black text-xs shadow-md"
                    >
                      Cycle Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AI GATEWAY INSPECTOR */}
      {activeTab === 'ai_gateway' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>10-Stage AI Service Layer Gateway</span>
            </h3>
            <p className="text-xs text-slate-500">
              Never connect UI directly to raw models. Test our gateway routing prompt templates through safety moderation and semantic caching.
            </p>

            <form onSubmit={handleTestAIGateway} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Halachic Prompt Input</label>
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Translation Output</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['English', 'Mizo', 'Hebrew'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setAiLanguage(lang)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        aiLanguage === lang
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isTestingGateway}
                className="w-full py-3 rounded-2xl bg-[#0A1128] hover:bg-slate-800 text-amber-400 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isTestingGateway ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isTestingGateway ? 'Invoking Gateway Pipeline...' : 'Invoke AI Gateway Pipeline'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0B132B] text-white border border-amber-500/30 shadow-xl flex flex-col justify-between">
            {aiGatewayResponse ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-xs">
                  <span className="text-emerald-300 font-bold">Execution: {aiGatewayResponse.gatewayExecutionId}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    {aiGatewayResponse.cachedResult ? '⚡ CACHE HIT (0 Tokens)' : `Compute: ${aiGatewayResponse.tokensConsumed} Tokens`}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs leading-relaxed font-sans text-slate-100 whitespace-pre-wrap">
                  {aiGatewayResponse.responseText || aiGatewayResponse.error}
                </div>

                {aiGatewayResponse.sourcesCited && (
                  <div className="text-xs font-mono text-amber-300">
                    <span className="text-slate-400 block mb-1">Verified Talmudic / Halachic Citations:</span>
                    {aiGatewayResponse.sourcesCited.join(' • ')}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-xs font-mono space-y-2">
                <Sparkles className="w-8 h-8 text-amber-500/40" />
                <span>Submit a query to inspect the 10-stage AI Gateway response pipeline.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
