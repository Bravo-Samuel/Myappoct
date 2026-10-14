import React from 'react';

interface ModuleSkeletonLoaderProps {
  title?: string;
  subtitle?: string;
}

export const ModuleSkeletonLoader: React.FC<ModuleSkeletonLoaderProps> = ({ 
  title = "Loading Module Workspace...", 
  subtitle = "Synchronizing encrypted records with Bnei Menashe Regional Council node" 
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse p-4 sm:p-6 text-slate-100 font-sans">
      {/* Header Banner Skeleton */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-slate-800 rounded-full"></div>
          <div className="h-6 w-24 bg-amber-500/20 rounded-full"></div>
        </div>
        <div className="space-y-2 max-w-xl">
          <div className="h-8 bg-slate-800 rounded-2xl w-3/4"></div>
          <div className="h-4 bg-slate-800/60 rounded-xl w-full"></div>
        </div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-slate-800"></div>
              <div className="w-16 h-5 rounded-full bg-slate-800/50"></div>
            </div>
            <div className="space-y-2">
              <div className="h-5 bg-slate-800 rounded-lg w-2/3"></div>
              <div className="h-3 bg-slate-800/60 rounded w-full"></div>
              <div className="h-3 bg-slate-800/60 rounded w-4/5"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table / Data Feed Skeleton */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="h-5 w-48 bg-slate-800 rounded-lg"></div>
          <div className="h-8 w-28 bg-slate-800 rounded-xl"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-slate-800"></div>
                <div className="space-y-1.5">
                  <div className="h-4 w-36 bg-slate-800 rounded"></div>
                  <div className="h-3 w-24 bg-slate-800/50 rounded"></div>
                </div>
              </div>
              <div className="h-6 w-20 bg-slate-800/60 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Status Message */}
      <div className="flex items-center justify-center gap-3 py-4 text-xs font-medium text-slate-400">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
        <span>{title} — {subtitle}</span>
      </div>
    </div>
  );
};
