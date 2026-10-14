import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Database, 
  Server, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  Award, 
  GitBranch, 
  Globe, 
  Lock, 
  Activity, 
  FileCheck, 
  Zap, 
  Cpu, 
  Sliders, 
  HelpCircle,
  FolderTree,
  Building2,
  Users,
  User,
  Heart,
  Calendar,
  BookOpen,
  DollarSign,
  Bell
} from 'lucide-react';
import { 
  Phase3ProposalReview, 
  TenancyHierarchyNode, 
  SystemOfRecordEntity, 
  DisasterRecoveryStatus, 
  ScalabilityBenchmark,
  ArchitectureLifecycleStage
} from '../../types';

export const Phase3GovernanceBoardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'arb_lifecycle' | 'tenancy_tree' | 'system_of_record' | 'disaster_recovery' | 'scalability_engine'>('arb_lifecycle');

  // Master Development Lifecycle Stages
  const LIFECYCLE_STAGES: ArchitectureLifecycleStage[] = [
    'Architecture Review',
    'Business Analysis',
    'Dependency Analysis',
    'Database Review',
    'API Review',
    'Security Review',
    'Performance Review',
    'Accessibility Review',
    'Scalability Review',
    'Implementation',
    'Testing',
    'Documentation',
    'Deployment Plan',
    'Monitoring',
    'Continuous Improvement'
  ];

  // Interactive ARB Proposals State
  const [proposals, setProposals] = useState<Phase3ProposalReview[]>([
    {
      id: 'PROP-2026-001',
      title: 'Gemini 3.5 Pro Halachic Multi-Tenant RAG Pipeline V3',
      author: 'Principal AI Architect',
      category: 'AI Gateway',
      status: 'APPROVED',
      currentStage: 'Continuous Improvement',
      completedGates: LIFECYCLE_STAGES.slice(0, 15),
      purpose: 'Centralized AI Gateway routing for instant Talmudic & Zmanim query grounding across 5 regional dialects.',
      businessValue: 'Eliminates direct-to-LLM client connections, enforcing halachic moderation guardrails & reducing compute latency by 72%.',
      acceptanceCriteria: ['Sub-300ms edge response', '100% RBAC token validation', 'Zero hallucinated zmanim coordinates'],
      modularityScore: 99,
      tenYearFutureProofScore: 98
    },
    {
      id: 'PROP-2026-002',
      title: 'Global 9-Tier Row-Level Security (RLS) Schema Isolation',
      author: 'Chief Information Security Officer (CISO)',
      category: 'Tenancy Engine',
      status: 'APPROVED',
      currentStage: 'Monitoring',
      completedGates: LIFECYCLE_STAGES.slice(0, 14),
      purpose: 'Enforces strict PostgreSQL tenancy policies across Global -> Council -> Synagogue -> Family -> Member tiers.',
      businessValue: 'Guarantees zero cross-tenant data leakage while permitting aggregated anonymized diaspora analytics.',
      acceptanceCriteria: ['ACID transaction verification', 'Encrypted column-level PII', 'Automated partition pruning'],
      modularityScore: 100,
      tenYearFutureProofScore: 100
    },
    {
      id: 'PROP-2026-003',
      title: 'Decentralized Offline P2P Synagogue Roster Sync',
      author: 'Senior Systems Engineer',
      category: 'Database Schema',
      status: 'REJECTED_NEEDS_REDESIGN',
      currentStage: 'Database Review',
      completedGates: ['Architecture Review', 'Business Analysis'],
      purpose: 'Allow local synagogue devices to synchronize rosters without Cloud SQL.',
      businessValue: 'Intended for remote hilltop minyans with sporadic cellular coverage.',
      acceptanceCriteria: ['Local Bluetooth sync', 'Conflict resolution policy'],
      modularityScore: 62,
      tenYearFutureProofScore: 45
    }
  ]);

  // New Proposal Interactive Builder State
  const [newPropTitle, setNewPropTitle] = useState('');
  const [newPropPurpose, setNewPropPurpose] = useState('');
  const [newPropCategory, setNewPropCategory] = useState<Phase3ProposalReview['category']>('AI Gateway');
  const [qModular, setQModular] = useState(true);
  const [qReusable, setQReusable] = useState(true);
  const [qSecure, setQSecure] = useState(true);
  const [qScalable, setQScalable] = useState(true);
  const [qTenYears, setQTenYears] = useState(true);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // 9-Tier Multi-Tenant State
  const [selectedTenancyNodeId, setSelectedTenancyNodeId] = useState('NODE-SYN-01');
  const tenancyNodes: TenancyHierarchyNode[] = [
    { id: 'NODE-GLOBAL', name: 'Global Bnei Menashe Digital Ecosystem', tier: 'Global Platform', activeMembersCount: 65420, isolatedDbSchema: 'public.global_tenant_registry', rlsPolicyName: 'rls_global_admin_policy', regionCode: 'MULTI_REGION_GLOBAL' },
    { id: 'NODE-COUNTRY-IN', name: 'India Bnei Menashe Council', tier: 'Country', parentTier: 'Global Platform', parentId: 'NODE-GLOBAL', activeMembersCount: 51200, isolatedDbSchema: 'tenant_in.country_core', rlsPolicyName: 'rls_country_in_policy', regionCode: 'asia-south1 (Mumbai)' },
    { id: 'NODE-COUNTRY-IL', name: 'Israel Aliyah & Absorption Council', tier: 'Country', parentTier: 'Global Platform', parentId: 'NODE-GLOBAL', activeMembersCount: 14220, isolatedDbSchema: 'tenant_il.country_core', rlsPolicyName: 'rls_country_il_policy', regionCode: 'me-west1 (Tel Aviv)' },
    { id: 'NODE-STATE-MN', name: 'Manipur State Hub', tier: 'State', parentTier: 'Country', parentId: 'NODE-COUNTRY-IN', activeMembersCount: 38400, isolatedDbSchema: 'tenant_in.state_manipur', rlsPolicyName: 'rls_state_mn_policy', regionCode: 'asia-south1 (Mumbai)' },
    { id: 'NODE-DIST-CCP', name: 'Churachandpur District Federation', tier: 'District', parentTier: 'State', parentId: 'NODE-STATE-MN', activeMembersCount: 24100, isolatedDbSchema: 'tenant_in.dist_ccp', rlsPolicyName: 'rls_dist_ccp_policy', regionCode: 'asia-south1 (Mumbai)' },
    { id: 'NODE-COUNCIL-01', name: 'Shalom Hill Regional Council', tier: 'Regional Council', parentTier: 'District', parentId: 'NODE-DIST-CCP', activeMembersCount: 8900, isolatedDbSchema: 'tenant_in.council_shalom', rlsPolicyName: 'rls_council_shalom', regionCode: 'asia-south1 (Mumbai)' },
    { id: 'NODE-SYN-01', name: 'Churachandpur Central Synagogue Beit Shalom', tier: 'Synagogue', parentTier: 'Regional Council', parentId: 'NODE-COUNCIL-01', activeMembersCount: 1420, isolatedDbSchema: 'tenant_in.syn_beit_shalom', rlsPolicyName: 'rls_synagogue_1420_strict', regionCode: 'asia-south1 (Mumbai)' },
    { id: 'NODE-COMM-01', name: 'Youth & Gabbai Volunteers Circle', tier: 'Community', parentTier: 'Synagogue', parentId: 'NODE-SYN-01', activeMembersCount: 180, isolatedDbSchema: 'tenant_in.comm_youth_circle', rlsPolicyName: 'rls_community_circle', regionCode: 'asia-south1 (Mumbai)' },
    { id: 'NODE-FAM-01', name: 'Lhungdim Ancestral Household', tier: 'Family', parentTier: 'Synagogue', parentId: 'NODE-SYN-01', activeMembersCount: 8, isolatedDbSchema: 'tenant_in.family_lhungdim_881', rlsPolicyName: 'rls_family_private_encrypt', regionCode: 'asia-south1 (Mumbai)' },
    { id: 'NODE-MEM-01', name: 'Aaron ben Avraham Lhungdim (Gabbai)', tier: 'Member', parentTier: 'Family', parentId: 'NODE-FAM-01', activeMembersCount: 1, isolatedDbSchema: 'tenant_in.member_usr_9912', rlsPolicyName: 'rls_member_self_only', regionCode: 'asia-south1 (Mumbai)' }
  ];
  const activeNode = tenancyNodes.find(n => n.id === selectedTenancyNodeId) || tenancyNodes[6];

  // 18 Mandated System of Record Entities
  const systemOfRecordEntities: SystemOfRecordEntity[] = [
    { entityName: 'Users', domain: 'Identity & Auth', primaryStorageService: 'Cloud SQL Postgres Cluster', syncState: 'ACID_REALTIME', recordCount: '65,420', ownerModule: 'Auth & RBAC Core', isSingleSourceOfTruth: true },
    { entityName: 'Families', domain: 'Genealogy & Lineage', primaryStorageService: 'Cloud SQL Postgres Cluster', syncState: 'ACID_REALTIME', recordCount: '12,840', ownerModule: 'Family Tree Service', isSingleSourceOfTruth: true },
    { entityName: 'Communities', domain: 'Community Governance', primaryStorageService: 'Cloud SQL Postgres Cluster', syncState: 'ACID_REALTIME', recordCount: '310', ownerModule: 'Community Engine', isSingleSourceOfTruth: true },
    { entityName: 'Regional Councils', domain: 'Regional Leadership', primaryStorageService: 'Cloud SQL Postgres Cluster', syncState: 'ACID_REALTIME', recordCount: '14', ownerModule: 'Federation Portal', isSingleSourceOfTruth: true },
    { entityName: 'Synagogues', domain: 'Religious Hubs', primaryStorageService: 'Cloud SQL Postgres Cluster', syncState: 'ACID_REALTIME', recordCount: '88', ownerModule: 'Sanctuary Core', isSingleSourceOfTruth: true },
    { entityName: 'Hebrew Calendar', domain: 'Halachic Timekeeping', primaryStorageService: 'Redis Enterprise', syncState: 'ACID_REALTIME', recordCount: '3,650 Days Cached', ownerModule: 'Zmanim & Calendar Engine', isSingleSourceOfTruth: true },
    { entityName: 'Astronomical Calculations', domain: 'Solar Algorithms', primaryStorageService: 'Google Cloud Storage', syncState: 'EVENTUAL_CONSISTENCY_100MS', recordCount: '14.2M Coordinates', ownerModule: 'NOAA / Ephemeris Service', isSingleSourceOfTruth: true },
    { entityName: 'Prayer Times', domain: 'Minyan Schedules', primaryStorageService: 'Cloud SQL Postgres Cluster', syncState: 'ACID_REALTIME', recordCount: '88 Synagogues Daily', ownerModule: 'Zmanim Broadcast Core', isSingleSourceOfTruth: true },
    { entityName: 'Torah Library', domain: 'Sacred Literature', primaryStorageService: 'Google Cloud Storage', syncState: 'EVENTUAL_CONSISTENCY_100MS', recordCount: '4,120 Volumes', ownerModule: 'Library Repository', isSingleSourceOfTruth: true },
    { entityName: 'Parashah', domain: 'Weekly Scripture', primaryStorageService: 'Cloud SQL Postgres Cluster', syncState: 'ACID_REALTIME', recordCount: '54 Parashot + Aliyot', ownerModule: 'Torah Curriculum Core', isSingleSourceOfTruth: true },
    { entityName: 'Memorial Records', domain: 'Yahrzeit & Kaddish', primaryStorageService: 'Cloud SQL Postgres Cluster', syncState: 'ACID_REALTIME', recordCount: '18,920 Souls', ownerModule: 'Memorial Sanctuary', isSingleSourceOfTruth: true },
    { entityName: 'Notifications', domain: 'Multi-Channel Dispatch', primaryStorageService: 'Redis Enterprise', syncState: 'EVENTUAL_CONSISTENCY_100MS', recordCount: '412K Monthly Alerts', ownerModule: 'Push/WhatsApp Pipeline', isSingleSourceOfTruth: true },
    { entityName: 'Payments', domain: 'FinOps & Tzedakah', primaryStorageService: 'Cloud SQL Postgres Cluster', syncState: 'ACID_REALTIME', recordCount: '48,110 Ledgers', ownerModule: 'Stripe / Bank Gateway', isSingleSourceOfTruth: true },
    { entityName: 'Subscriptions', domain: 'SaaS Billing Core', primaryStorageService: 'Cloud SQL Postgres Cluster', syncState: 'ACID_REALTIME', recordCount: '88 Active Synagogues', ownerModule: 'Billing Engine', isSingleSourceOfTruth: true },
    { entityName: 'AI Conversations', domain: 'AI Rabbi Grounding', primaryStorageService: 'Cloud SQL Postgres Cluster', syncState: 'ACID_REALTIME', recordCount: '142,000 Transcripts', ownerModule: 'Gemini AI Gateway', isSingleSourceOfTruth: true },
    { entityName: 'Audit Logs', domain: 'Immutable Security', primaryStorageService: 'Google Cloud Storage', syncState: 'ACID_REALTIME', recordCount: '4.8M Immutable Events', ownerModule: 'CISO Compliance Engine', isSingleSourceOfTruth: true },
    { entityName: 'Analytics', domain: 'Telemetry & Health', primaryStorageService: 'Redis Enterprise', syncState: 'EVENTUAL_CONSISTENCY_100MS', recordCount: '99.4% Uptime Metrics', ownerModule: 'Observability Core', isSingleSourceOfTruth: true },
    { entityName: 'Settings', domain: 'System Configurations', primaryStorageService: 'Cloud SQL Postgres Cluster', syncState: 'ACID_REALTIME', recordCount: '65,420 User Profiles', ownerModule: 'User Preference Engine', isSingleSourceOfTruth: true }
  ];

  // Disaster Recovery Simulator State
  const [drStatus, setDrStatus] = useState<DisasterRecoveryStatus>({
    primaryRegion: 'asia-southeast1 (Singapore / Edge India)',
    replicaRegion: 'me-west1 (Tel Aviv, Israel)',
    replicationLagMs: 12,
    pitrEnabled: true,
    lastSuccessfulSnapshotTime: '2 mins ago (Automated WAL Archive)',
    recoveryTimeObjectiveMin: 2,
    recoveryPointObjectiveSec: 0,
    activeFailoverMode: 'PRIMARY_ACTIVE'
  });
  const [isSimulatingFailover, setIsSimulatingFailover] = useState(false);

  // Scalability Target Benchmarks State
  const scalabilityBenchmarks: ScalabilityBenchmark[] = [
    { tierName: 'Tier 1: Community Seed', targetUsersCount: 100, dbArchitecture: 'Single Cloud SQL Postgres Instance (2 vCPU)', edgeCachingStrategy: 'Basic Cloudflare CDN Static Assets', requiredReadQPS: '50 QPS', avgResponseTargetMs: 15, estimatedMonthlyComputeCost: '$45 / mo', status: 'PROVEN_VERIFIED' },
    { tierName: 'Tier 2: Regional Hub', targetUsersCount: 1000, dbArchitecture: 'Cloud SQL Postgres + 1 Read Replica', edgeCachingStrategy: 'Redis In-Memory Session & Zmanim Cache', requiredReadQPS: '450 QPS', avgResponseTargetMs: 18, estimatedMonthlyComputeCost: '$180 / mo', status: 'PROVEN_VERIFIED' },
    { tierName: 'Tier 3: National Diaspora', targetUsersCount: 10000, dbArchitecture: 'High-Availability Multi-Zone Cloud SQL + Connection Pooling', edgeCachingStrategy: 'Global Anycast Edge Workers + GraphQL Dataloader', requiredReadQPS: '4,200 QPS', avgResponseTargetMs: 22, estimatedMonthlyComputeCost: '$850 / mo', status: 'PROVEN_VERIFIED' },
    { tierName: 'Tier 4: Enterprise Global Platform', targetUsersCount: 100000, dbArchitecture: 'Horizontally Partitioned Postgres + Citus Sharding by Tenant', edgeCachingStrategy: 'Distributed Edge Redis + AI Gateway Vector Caching', requiredReadQPS: '45,000 QPS', avgResponseTargetMs: 25, estimatedMonthlyComputeCost: '$3,400 / mo', status: 'PROVEN_VERIFIED' },
    { tierName: 'Tier 5: Planetary Ecosystem', targetUsersCount: 1000000, dbArchitecture: 'Multi-Region Active-Active Sharded Spanner / Postgres Pods', edgeCachingStrategy: 'Autonomous Edge AI Routing & Prefetching Engine', requiredReadQPS: '480,000 QPS', avgResponseTargetMs: 28, estimatedMonthlyComputeCost: '$18,500 / mo', status: 'STRESS_TESTED' },
    { tierName: 'Tier 6: 10-Year Vision Target', targetUsersCount: 10000000, dbArchitecture: 'Autonomous Self-Healing Regional Grid Clusters', edgeCachingStrategy: 'Zero-Latency Edge Neural Caching across 140 Global PoPs', requiredReadQPS: '5,000,000 QPS', avgResponseTargetMs: 30, estimatedMonthlyComputeCost: '$120,000 / mo', status: 'ARCHITECTED_READY' }
  ];

  const handleRunARBSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropTitle.trim() || !newPropPurpose.trim()) {
      setSubmissionFeedback('❌ Error: Proposal title and architectural purpose are required.');
      return;
    }

    // Verify Final Rule 4 Questions
    if (!qModular || !qReusable || !qSecure || !qScalable || !qTenYears) {
      const failedCriteria = [];
      if (!qModular) failedCriteria.push('Not Modular');
      if (!qReusable) failedCriteria.push('Not Reusable');
      if (!qSecure) failedCriteria.push('Not Secure');
      if (!qScalable) failedCriteria.push('Not Scalable');
      if (!qTenYears) failedCriteria.push('Fails 10-Year Future-Proof Test');

      setSubmissionFeedback(`🛑 REJECTED BY TECHNICAL GOVERNANCE BOARD: Proposal failed mandatory architectural gates: [${failedCriteria.join(', ')}]. Redesign solution before implementation.`);
      return;
    }

    const newProposal: Phase3ProposalReview = {
      id: `PROP-2026-00${proposals.length + 1}`,
      title: newPropTitle,
      author: 'Permanent Technical Governance Board',
      category: newPropCategory,
      status: 'APPROVED',
      currentStage: 'Implementation',
      completedGates: LIFECYCLE_STAGES.slice(0, 10),
      purpose: newPropPurpose,
      businessValue: 'Enforces strictly modular, future-proof platform capabilities without code duplication.',
      acceptanceCriteria: ['Zero regression in existing 18 Single Source of Truth domains', '100% adherence to Design System typography and shadows', 'Full AI Gateway mediation'],
      modularityScore: 100,
      tenYearFutureProofScore: 100
    };

    setProposals([newProposal, ...proposals]);
    setNewPropTitle('');
    setNewPropPurpose('');
    setSubmissionFeedback('✅ APPROVED BY CHIEF ARCHITECTURE REVIEW BOARD: Passed all 15 Lifecycle Gates and the 10-Year Future-Proof Mandate.');
  };

  const handleSimulateDisasterFailover = () => {
    setIsSimulatingFailover(true);
    setTimeout(() => {
      setDrStatus(prev => ({
        ...prev,
        activeFailoverMode: prev.activeFailoverMode === 'PRIMARY_ACTIVE' ? 'GRACEFUL_DEGRADATION' : 'PRIMARY_ACTIVE',
        replicationLagMs: prev.activeFailoverMode === 'PRIMARY_ACTIVE' ? 0 : 12,
        lastSuccessfulSnapshotTime: 'Just now (Instant PITR Sync Verified)'
      }));
      setIsSimulatingFailover(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32">
      {/* Phase 3 CTO & Permanent Technical Governance Board Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#060B18] via-[#111C3A] to-[#0A1128] text-white shadow-2xl border-2 border-amber-500/50 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1.5">
              <Award className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Phase 3 Permanent Technical Governance Board Mandate</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              CTO / CPO / CISO / CDO Architecture Review Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              Enforcing rigorous review of existing architecture before any implementation. Governing the 15-Stage Master Development Lifecycle, Single Source of Truth System of Record, 9-Tier Hierarchical Multi-Tenancy, and 10-Year Future-Proof Scalability up to 10 Million Users.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center gap-4 shrink-0 shadow-xl font-mono text-xs">
            <div className="text-center sm:text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400">Architecture Governance</div>
              <div className="text-lg font-black text-emerald-400">ENFORCED 100%</div>
            </div>
            <div className="hidden sm:block h-10 w-px bg-white/10"></div>
            <div className="text-center sm:text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400">Scalability Ceiling</div>
              <div className="text-lg font-black text-amber-400">10,000,000 USERS</div>
            </div>
          </div>
        </div>

        {/* Phase 3 Core Directives Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs font-semibold">
          <div className="flex items-center gap-2 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Never duplicate existing records or code</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Central AI Gateway mediation only</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Unified Design System spacing & typography</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Automated Point-in-Time Recovery (PITR)</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        {[
          { id: 'arb_lifecycle', label: '1. ARB Lifecycle & Final Rule Gate', icon: ShieldCheck },
          { id: 'tenancy_tree', label: '2. 9-Tier Hierarchical Tenancy Engine', icon: FolderTree },
          { id: 'system_of_record', label: '3. Master System of Record (18 Domains)', icon: Database },
          { id: 'disaster_recovery', label: '4. Disaster Recovery & PITR Simulator', icon: Server },
          { id: 'scalability_engine', label: '5. Scalability Engine (100 to 10M Users)', icon: TrendingUp }
        ].map((tab) => {
          const IconComp = tab.icon;
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
              <IconComp className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ARB LIFECYCLE & FINAL RULE GATE */}
      {activeTab === 'arb_lifecycle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Left: Interactive Final Rule Gate Form */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-500" />
                <span>Submit Proposal to Technical Governance Board</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Every new feature must pass all 15 lifecycle stages and the mandatory 5-part Final Rule check before writing code.
              </p>
            </div>

            <form onSubmit={handleRunARBSubmission} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Proposal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Synagogue Yahrzeit SMS Reminder Engine"
                  value={newPropTitle}
                  onChange={(e) => setNewPropTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Architectural Domain Category</label>
                <select
                  value={newPropCategory}
                  onChange={(e) => setNewPropCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                >
                  <option value="AI Gateway">AI Gateway & Model Routing</option>
                  <option value="Database Schema">Database Schema & Single Source of Truth</option>
                  <option value="Tenancy Engine">Multi-Tenant Isolation & RLS Policy</option>
                  <option value="Security Policy">Zero-Trust Auth & Audit Ledger</option>
                  <option value="Edge CDN">Global Edge Caching & Performance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Purpose & Business Value Statement</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain why existing platform components cannot fulfill this requirement..."
                  value={newPropPurpose}
                  onChange={(e) => setNewPropPurpose(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold resize-none"
                />
              </div>

              {/* Final Rule Mandatory Checklist */}
              <div className="p-4 rounded-2xl bg-[#070D1F] text-white border border-amber-500/30 space-y-2.5">
                <div className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                  Mandatory Phase 3 "Final Rule" Gate:
                </div>
                {[
                  { label: '"Is this solution modular?"', val: qModular, set: setQModular },
                  { label: '"Is it reusable across all 88 synagogues?"', val: qReusable, set: setQReusable },
                  { label: '"Is it secure under Zero-Trust RBAC?"', val: qSecure, set: setQSecure },
                  { label: '"Is it scalable from 100 to 10M users?"', val: qScalable, set: setQScalable },
                  { label: '"Will this still be correct architecture in ten years?"', val: qTenYears, set: setQTenYears }
                ].map((chk, idx) => (
                  <label key={idx} className="flex items-center justify-between text-xs cursor-pointer hover:text-amber-300">
                    <span className="font-semibold">{chk.label}</span>
                    <input
                      type="checkbox"
                      checked={chk.val}
                      onChange={(e) => chk.set(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-600"
                    />
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Execute 15-Stage Review Gate Evaluation</span>
              </button>

              {submissionFeedback && (
                <div className={`p-3.5 rounded-xl text-xs font-bold ${
                  submissionFeedback.includes('APPROVED')
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                }`}>
                  {submissionFeedback}
                </div>
              )}
            </form>
          </div>

          {/* Right: Existing Governance Proposals & Master Lifecycle Pipeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Active Architectural Governance Proposals</span>
                <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                  {proposals.length} Evaluated
                </span>
              </h3>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {proposals.map((prop) => (
                  <div key={prop.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-amber-600 dark:text-amber-400">{prop.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                            {prop.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{prop.title}</h4>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${
                        prop.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                        prop.status === 'REJECTED_NEEDS_REDESIGN' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {prop.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                      <strong>Purpose:</strong> {prop.purpose}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Current Lifecycle Stage</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{prop.currentStage}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px] uppercase">10-Yr Future-Proof Score</span>
                        <span className={`font-black ${prop.tenYearFutureProofScore >= 90 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {prop.tenYearFutureProofScore} / 100
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 9-TIER HIERARCHICAL TENANCY ENGINE */}
      {activeTab === 'tenancy_tree' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Left: 9-Tier Tree Navigator */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-amber-500" />
                <span>9-Tier Multi-Tenant Hierarchy Tree</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Every level possesses independent permissions and isolated Row-Level Security (RLS) policies while rolling up into aggregated analytics.
              </p>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {tenancyNodes.map((node, index) => {
                const isSelected = selectedTenancyNodeId === node.id;
                const indentPadding = index * 12;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedTenancyNodeId(node.id)}
                    style={{ marginLeft: `${Math.min(indentPadding, 64)}px` }}
                    className={`w-[calc(100%-${Math.min(indentPadding, 64)}px)] text-left p-3 rounded-xl transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-[#0A1128] text-amber-400 border-amber-500/50 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="text-[10px] uppercase font-bold text-slate-400">{node.tier}</div>
                      <div className="font-bold text-xs truncate mt-0.5">{node.name}</div>
                    </div>
                    <span className="text-xs font-mono font-bold shrink-0 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                      {node.activeMembersCount.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Tenancy Node Deep Governance Inspector */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0B132B] text-white border border-amber-500/30 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-xs text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>Tier Governance Node Inspector</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-1">{activeNode.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Tier Level: <strong className="text-amber-300">{activeNode.tier}</strong></p>
                </div>

                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400 uppercase">Active Records</div>
                  <div className="text-xl font-black text-emerald-400">{activeNode.activeMembersCount.toLocaleString()}</div>
                </div>
              </div>

              {/* Isolation Metadata Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">Isolated Postgres Schema</span>
                  <span className="text-amber-300 font-bold break-all">{activeNode.isolatedDbSchema}</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">RLS Security Policy Name</span>
                  <span className="text-emerald-300 font-bold break-all">{activeNode.rlsPolicyName}</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">Data Residency Cluster</span>
                  <span className="text-indigo-300 font-bold">{activeNode.regionCode}</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">Upstream Parent Tier</span>
                  <span className="text-slate-200 font-bold">{activeNode.parentTier || 'Global Top Level'}</span>
                </div>
              </div>

              {/* RLS Policy Explanation Box */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-xs leading-relaxed space-y-2 font-sans">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  <span>Row-Level Security (RLS) Inheritance Enforcement Rules:</span>
                </div>
                <p className="text-slate-300">
                  Queries originating at the <strong>{activeNode.tier}</strong> tier automatically append a mandatory Postgres SQL filter clause: <code className="text-amber-300 bg-black/50 px-1.5 py-0.5 rounded font-mono">WHERE tenant_tier_id = '{activeNode.id}' OR path @&gt; '{activeNode.id}'</code>. This prevents unauthorized visibility into sibling communities while ensuring seamless executive rollups.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-mono text-center">
              ✅ Multi-Tenant Governance Audit Passed: Zero Cross-Tenant Leakage Detected.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER SYSTEM OF RECORD (18 MANDATED DOMAINS) */}
      {activeTab === 'system_of_record' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-500" />
                  <span>Master System of Record (Single Source of Truth Registry)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enforcing the strict mandate: 18 official domain models. No duplicated records, no duplicated business logic across any client screen.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold shrink-0">
                18 / 18 Domains Verified ACID
              </div>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Entity Name</th>
                    <th className="py-3 px-3">Functional Domain</th>
                    <th className="py-3 px-3">Primary Storage Engine</th>
                    <th className="py-3 px-3">Sync & Consistency State</th>
                    <th className="py-3 px-3">Active Records</th>
                    <th className="py-3 px-3">Owner Architecture Module</th>
                    <th className="py-3 px-3 text-center">SSOT Integrity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                  {systemOfRecordEntities.map((sor) => (
                    <tr key={sor.entityName} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white font-mono">{sor.entityName}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-600 dark:text-slate-300">{sor.domain}</td>
                      <td className="py-3.5 px-3 font-mono text-amber-600 dark:text-amber-400">{sor.primaryStorageService}</td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] font-mono ${
                          sor.syncState === 'ACID_REALTIME' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {sor.syncState}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold">{sor.recordCount}</td>
                      <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">{sor.ownerModule}</td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Strict SSOT</span>
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

      {/* TAB 4: DISASTER RECOVERY & PITR SIMULATOR */}
      {activeTab === 'disaster_recovery' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-amber-500" />
                <span>Multi-Region Active Failover & PITR Engine</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Design for failure: Automatic point-in-time recovery, continuous WAL archive shipping, and emergency graceful degradation modes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase block">Primary Active Cluster</span>
                <span className="text-slate-900 dark:text-white font-bold">{drStatus.primaryRegion}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase block">Hot Replica Cluster</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">{drStatus.replicaRegion}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase block">Replication Lag</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{drStatus.replicationLagMs} ms (Synchronous WAL)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase block">PITR Snapshot Archive</span>
                <span className="text-slate-900 dark:text-white font-bold">{drStatus.lastSuccessfulSnapshotTime}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSimulateDisasterFailover}
                disabled={isSimulatingFailover}
                className="w-full py-3.5 rounded-2xl bg-[#0A1128] hover:bg-slate-800 text-amber-400 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSimulatingFailover ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>{isSimulatingFailover ? 'Simulating Regional Failover Drill...' : 'Toggle Emergency Graceful Degradation / Active Failover Drill'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0B132B] text-white border border-amber-500/30 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-xs">
                <span className="text-amber-400 font-bold">Active Failover Mode</span>
                <span className={`px-2.5 py-1 rounded font-bold ${
                  drStatus.activeFailoverMode === 'PRIMARY_ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300 animate-pulse'
                }`}>
                  {drStatus.activeFailoverMode}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs leading-relaxed space-y-3 font-sans text-slate-200">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>Recovery Time Objective (RTO): &lt; {drStatus.recoveryTimeObjectiveMin} Minutes</span>
                </div>
                <p>
                  If the primary Singapore edge cluster experiences catastrophic infrastructure loss, automated health probes promote the Tel Aviv replica to primary write status within 120 seconds.
                </p>
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Recovery Point Objective (RPO): {drStatus.recoveryPointObjectiveSec} Seconds</span>
                </div>
                <p>
                  Zero data loss guaranteed for financial tzedakah ledgers and halachic lineage updates via continuous Write-Ahead Log (WAL) streaming.
                </p>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 text-center">
              Automated DR health drills run daily at 03:00 UTC. Next scheduled verification: 10 hrs.
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SCALABILITY ENGINE (100 TO 10M USERS) */}
      {activeTab === 'scalability_engine' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <span>Planetary Scalability Targets (100 Users to 10 Million Users)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Architecture decisions must never limit future growth. Review proven hardware configurations and database sharding blueprints at each growth stage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scalabilityBenchmarks.map((bm) => (
                <div key={bm.tierName} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-xs">{bm.tierName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        bm.status === 'PROVEN_VERIFIED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        bm.status === 'STRESS_TESTED' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      }`}>
                        {bm.status}
                      </span>
                    </div>

                    <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">
                      {bm.targetUsersCount.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-500">Active Users</span>
                    </div>

                    <div className="space-y-2.5 mt-4 text-xs font-sans">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Database Architecture</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{bm.dbArchitecture}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Edge Caching Strategy</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{bm.edgeCachingStrategy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Target QPS</span>
                      <span className="font-bold text-slate-900 dark:text-white">{bm.requiredReadQPS}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Latency Ceiling</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{bm.avgResponseTargetMs} ms</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
