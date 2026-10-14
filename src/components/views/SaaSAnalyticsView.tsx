import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, ShieldCheck, Sparkles, Check, Crown, CreditCard, Building2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { SUBSCRIPTION_PLANS } from '../../data/mockData';
import { SubscriptionTier } from '../../types';

export const SaaSAnalyticsView: React.FC = () => {
  const [metrics, setMetrics] = useState({
    dailyActiveUsers: 14280,
    monthlyActiveUsers: 48920,
    activeSynagogueCouncils: 42,
    totalTorahChaptersRead: 312450
  });

  const [readingStreakData] = useState([
    { day: 'Mon', studyMinutes: 1420, activeUsers: 12100 },
    { day: 'Tue', studyMinutes: 1680, activeUsers: 13400 },
    { day: 'Wed', studyMinutes: 1950, activeUsers: 14280 },
    { day: 'Thu', studyMinutes: 2100, activeUsers: 15100 },
    { day: 'Fri', studyMinutes: 2840, activeUsers: 18200 },
    { day: 'Shabbat', studyMinutes: 3450, activeUsers: 22400 },
    { day: 'Sun', studyMinutes: 1890, activeUsers: 14000 }
  ]);

  const [regionalDistribution] = useState([
    { name: 'Manipur (Churachandpur / Imphal)', users: 18450, share: '38%' },
    { name: 'Mizoram (Aizawl / Lunglei)', users: 15200, share: '31%' },
    { name: 'Israel (Nof HaGalil / Kiryat Arba)', users: 11800, share: '24%' },
    { name: 'North America / Diaspora', users: 3470, share: '7%' }
  ]);

  const [selectedPlan, setSelectedPlan] = useState('family');

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0A1128] via-[#1E293B] to-[#0A1128] text-white shadow-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            <span>Community Governance & Analytics</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Community Analytics & Support Plans
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Monitor community growth, reading streaks across regional councils, and manage workspace tiers.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>System Uptime: 99.99%</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Active Users</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {metrics.dailyActiveUsers.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs last week
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Active (MAU)</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {metrics.monthlyActiveUsers.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> Across 45 townships
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Synagogue Councils</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {metrics.activeSynagogueCouncils}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-2 block">
            Enterprise Tier Synagogues
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Torah Chapters Read</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {metrics.totalTorahChaptersRead.toLocaleString()}
          </div>
          <span className="text-[11px] text-indigo-500 font-bold mt-2 block">
            Daf Yomi & Parashah Streaks
          </span>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Weekly Torah Study Minutes (By Day)</h3>
              <p className="text-xs text-slate-500">Peak study engagement occurs on Shabbat and Friday preparation</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold text-xs font-mono">
              Live Aggregate
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={readingStreakData}>
                <defs>
                  <linearGradient id="studyColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} fontWeight={600} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#F59E0B', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="studyMinutes" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#studyColor)" name="Study Minutes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Breakdown Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Regional Councils Breakdown</h3>
            <p className="text-xs text-slate-500 mb-4">Active subscriber distribution across global Bnei Menashe hubs</p>
            <div className="space-y-4">
              {regionalDistribution.map((reg, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>{reg.name}</span>
                    <span className="font-mono text-amber-600">{reg.share}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600" style={{ width: reg.share }}></div>
                  </div>
                  <span className="text-[11px] text-slate-400">{reg.users.toLocaleString()} registered members</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise SaaS Pricing Cards */}
      <div className="space-y-6 pt-4">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Community Support Tiers
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Choose Community Governance Tier
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            From free individual access in Manipur to full synagogue broadcast management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan: SubscriptionTier) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`p-6 rounded-3xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden border-2 ${
                plan.isPopular
                  ? 'bg-gradient-to-br from-[#0A1128] to-[#1E293B] text-white border-amber-400 shadow-2xl scale-[1.03]'
                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-amber-300 shadow-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div>
                <span className={`text-xs font-bold uppercase tracking-wider ${plan.isPopular ? 'text-amber-400' : 'text-slate-400'}`}>
                  {plan.name}
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black">{plan.price}</span>
                  <span className="text-xs font-semibold opacity-80">/{plan.billingCycle}</span>
                </div>
                <p className="text-xs mt-3 leading-relaxed opacity-90">
                  {plan.description}
                </p>

                <div className="mt-6 space-y-2.5 pt-6 border-t border-slate-200/20">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.isPopular ? 'text-amber-400' : 'text-emerald-500'}`} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`mt-8 w-full py-3 rounded-2xl text-xs font-bold transition-transform hover:scale-105 shadow-md flex items-center justify-center gap-2 ${
                  plan.isPopular
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-[#0A1128] text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>{selectedPlan === plan.id ? 'Active Workspace Tier' : `Upgrade to ${plan.name}`}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
