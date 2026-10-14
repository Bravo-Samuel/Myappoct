import React, { useState } from 'react';
import {
  Layers,
  Box,
  FolderTree,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Sparkles,
  Zap,
  LayoutGrid,
  Activity,
  AlertTriangle,
  ArrowRight,
  Database,
  Terminal,
  Cpu
} from 'lucide-react';
import { ScalableCard } from '../common/ScalableCard';
import { StatusBadge } from '../common/StatusBadge';

export const ScalableAppArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topology' | 'ui_primitives' | 'state_flow' | 'checklists'>('topology');
  const [triggerTestError, setTriggerTestError] = useState(false);

  if (triggerTestError) {
    throw new Error('Simulated UI Rendering Exception caught by Enterprise ErrorBoundary!');
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge variant="purple" pulse icon={<Sparkles className="w-3.5 h-3.5" />}>
              Official Enterprise Blueprint v4.2
            </StatusBadge>
            <StatusBadge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
              Strict Type Safety (TS 5.x)
            </StatusBadge>
            <StatusBadge variant="amber" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              Atomic UI & Error Boundaries
            </StatusBadge>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Officially Scalable Web App Code & UI Structure
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            A comprehensive architectural framework designed for enterprise scale. Explore our domain-driven directory topology, atomic design system primitives, state isolation boundaries, and production resilience patterns.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-indigo-500/20">
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'topology'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4 text-indigo-300" />
            <span>Folder & Code Topology</span>
          </button>
          <button
            onClick={() => setActiveTab('ui_primitives')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'ui_primitives'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-purple-300" />
            <span>Atomic UI Primitives</span>
          </button>
          <button
            onClick={() => setActiveTab('state_flow')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'state_flow'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-300" />
            <span>State Management & Scaling</span>
          </button>
          <button
            onClick={() => setActiveTab('checklists')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'checklists'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>Enterprise Scale Checklist</span>
          </button>
        </div>
      </div>

      {/* Tab Content 1: Topology */}
      {activeTab === 'topology' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 space-y-6">
            <ScalableCard
              title="Official Domain-Driven Directory Architecture"
              subtitle="Clear separation of concerns preventing code coupling as teams grow"
              icon={<FolderTree className="w-5 h-5 text-indigo-500" />}
              variant="highlight"
            >
              <div className="space-y-3 font-mono text-xs bg-slate-950 p-5 rounded-2xl border border-slate-800 text-slate-300 overflow-x-auto">
                <div className="text-indigo-400 font-bold">/src</div>
                <div className="pl-4 border-l-2 border-indigo-500/30 space-y-2.5">
                  <div>
                    <span className="text-emerald-400 font-bold">├── components/</span>
                    <span className="text-slate-500 ml-2"># UI Layer split by semantic boundaries</span>
                    <div className="pl-4 border-l border-slate-800 mt-1 space-y-1">
                      <div><span className="text-amber-400">├── common/</span> <span className="text-slate-500"># Reusable atomic design primitives (ScalableCard, StatusBadge, ErrorBoundary)</span></div>
                      <div><span className="text-purple-400">├── auth/</span> <span className="text-slate-500"># Isolated authentication UI suite (SignIn, SignUp, VerifyEmail)</span></div>
                      <div><span className="text-blue-400">├── views/</span> <span className="text-slate-500"># High-level domain route containers (Zmanim, Enterprise Console, AuthPortal)</span></div>
                      <div><span className="text-slate-400">└── layout/</span> <span className="text-slate-500"># Shell layout scaffolding (Sidebar, TopNav, RightSidebar)</span></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold">├── providers/</span>
                    <span className="text-slate-500 ml-2"># React Context State boundaries (SupabaseAuthProvider, DatabaseProvider)</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold">├── services/</span>
                    <span className="text-slate-500 ml-2"># Stateless backend integration layer (AI Rabbi, Kosher verification, Supabase RPC)</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold">├── data/</span>
                    <span className="text-slate-500 ml-2"># Static domain repositories, fallbacks, and mock payloads</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold">├── types.ts</span>
                    <span className="text-slate-500 ml-2"># Centralized TypeScript interface contracts guaranteeing type safety</span>
                  </div>
                </div>
              </div>
            </ScalableCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ScalableCard title="1. Route Container Isolation" icon={<Box className="w-5 h-5 text-blue-500" />}>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every functional area lives in <code className="text-indigo-500 font-bold">/src/components/views/</code>. Views orchestrate data and state from providers, passing strictly typed props down to presentation components.
                </p>
              </ScalableCard>
              <ScalableCard title="2. Atomic UI Reusability" icon={<Layers className="w-5 h-5 text-purple-500" />}>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Components in <code className="text-indigo-500 font-bold">/src/components/common/</code> never make direct API calls. They accept standard props, variants, and event handlers, making them 100% testable and reusable.
                </p>
              </ScalableCard>
            </div>
          </div>

          <div className="space-y-6">
            <ScalableCard title="Architectural Rules of Scale" icon={<Terminal className="w-5 h-5 text-amber-500" />}>
              <ul className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">1</div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Strict Type Contracts</strong>
                    All component props and API responses must be typed in <code className="text-amber-500">types.ts</code>. No <code className="text-rose-500">any</code> escape hatches allowed.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">2</div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Zero Business Logic in UI Primitives</strong>
                    Atomic components (<code className="text-purple-400">StatusBadge</code>, <code className="text-purple-400">ScalableCard</code>) handle visual presentation only.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">3</div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Fault Isolation per View</strong>
                    Every high-level view is wrapped in an enterprise <code className="text-indigo-400">ErrorBoundary</code> so local crashes never crash the shell.
                  </div>
                </li>
              </ul>
            </ScalableCard>
          </div>
        </div>
      )}

      {/* Tab Content 2: UI Primitives */}
      {activeTab === 'ui_primitives' && (
        <div className="space-y-6 animate-fade-in">
          <ScalableCard
            title="Live Design System Primitives (/src/components/common)"
            subtitle="These standardized atoms guarantee UI consistency across all 15+ platform modules"
            icon={<LayoutGrid className="w-5 h-5 text-purple-500" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Component Demo: StatusBadges */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">StatusBadge Variants</h4>
                  <code className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">&lt;StatusBadge variant="..." /&gt;</code>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <StatusBadge variant="success">Operational (Success)</StatusBadge>
                  <StatusBadge variant="warning">Sync Pending (Warning)</StatusBadge>
                  <StatusBadge variant="error">Connection Failed (Error)</StatusBadge>
                  <StatusBadge variant="info">Information (Info)</StatusBadge>
                  <StatusBadge variant="purple" pulse>AI Model Active (Purple)</StatusBadge>
                  <StatusBadge variant="amber">Enterprise CTO (Amber)</StatusBadge>
                </div>
              </div>

              {/* Component Demo: ErrorBoundary Test */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Enterprise ErrorBoundary</h4>
                  <code className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">&lt;ErrorBoundary&gt;...&lt;/ErrorBoundary&gt;</code>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Try triggering a live runtime component exception to verify how our official architecture contains failures without crashing the application shell.
                </p>
                <button
                  onClick={() => setTriggerTestError(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Simulate Component Rendering Crash</span>
                </button>
              </div>
            </div>
          </ScalableCard>
        </div>
      )}

      {/* Tab Content 3: State Management Flow */}
      {activeTab === 'state_flow' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <ScalableCard
            title="1. Global Application State"
            subtitle="React Context Providers"
            icon={<Cpu className="w-5 h-5 text-indigo-500" />}
            className="h-full"
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Cross-cutting concerns like User Authentication, Dark Mode, and Offline Database Caching live in <code className="text-indigo-500 font-bold">/src/providers/</code>.
            </p>
            <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl font-mono text-[11px] space-y-1.5 text-slate-700 dark:text-slate-300">
              <div>&bull; <span className="text-amber-500 font-bold">SupabaseAuthProvider</span></div>
              <div>&bull; <span className="text-emerald-500 font-bold">DatabaseProvider</span></div>
              <div>&bull; <span className="text-blue-500 font-bold">Theme & Language State</span></div>
            </div>
          </ScalableCard>

          <ScalableCard
            title="2. Server & API State"
            subtitle="Stateless Service Modules"
            icon={<Database className="w-5 h-5 text-emerald-500" />}
            className="h-full"
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              All REST API calls, Supabase queries, and AI generation prompts are encapsulated inside <code className="text-emerald-500 font-bold">/src/services/</code> or custom hooks.
            </p>
            <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl font-mono text-[11px] space-y-1.5 text-slate-700 dark:text-slate-300">
              <div>&bull; <span className="text-purple-500 font-bold">aiRabbiService.ts</span></div>
              <div>&bull; <span className="text-blue-500 font-bold">supabaseClient.ts</span></div>
              <div>&bull; <span className="text-amber-500 font-bold">zmanimCalculator.ts</span></div>
            </div>
          </ScalableCard>

          <ScalableCard
            title="3. Local View UI State"
            subtitle="Scoped Component State"
            icon={<Box className="w-5 h-5 text-amber-500" />}
            className="h-full"
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Transient UI interactions (tab switching, modal toggles, search filter text) stay strictly within the local component via <code className="text-amber-500 font-bold">useState</code> and <code className="text-amber-500 font-bold">useReducer</code>.
            </p>
            <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl font-mono text-[11px] space-y-1.5 text-slate-700 dark:text-slate-300">
              <div>&bull; Modal Open/Close</div>
              <div>&bull; Active Tab Index</div>
              <div>&bull; Form Draft Buffers</div>
            </div>
          </ScalableCard>
        </div>
      )}

      {/* Tab Content 4: Checklists */}
      {activeTab === 'checklists' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <ScalableCard
            title="Frontend Scaling Standards"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          >
            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>Responsive Mobile-First Tailwind Grid (<code className="text-indigo-400">sm:, md:, lg:</code>)</span>
                <StatusBadge variant="success">Verified</StatusBadge>
              </li>
              <li className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>High-Contrast WCAG Accessible Colors in Dark & Light Modes</span>
                <StatusBadge variant="success">Verified</StatusBadge>
              </li>
              <li className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>Lazy Component Loading & Code Splitting via Vite Bundle</span>
                <StatusBadge variant="success">Ready</StatusBadge>
              </li>
              <li className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>Lucide React Vector Icons (Zero heavy PNG/SVG bloat)</span>
                <StatusBadge variant="success">100% Vector</StatusBadge>
              </li>
            </ul>
          </ScalableCard>

          <ScalableCard
            title="Backend & Security Scaling Standards"
            icon={<ShieldCheck className="w-5 h-5 text-amber-500" />}
          >
            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>Supabase Row Level Security (RLS) policies per table</span>
                <StatusBadge variant="success">Enforced</StatusBadge>
              </li>
              <li className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>Zero client-side secrets (API Keys protected server-side)</span>
                <StatusBadge variant="success">Encrypted</StatusBadge>
              </li>
              <li className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>JWT Token Lifecycle & MFA 2-Step Readiness</span>
                <StatusBadge variant="success">Auth Suite v4</StatusBadge>
              </li>
              <li className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>Offline IndexedDB / LocalStorage Sync Resiliency</span>
                <StatusBadge variant="success">Active</StatusBadge>
              </li>
            </ul>
          </ScalableCard>
        </div>
      )}
    </div>
  );
};
