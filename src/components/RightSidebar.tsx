import React, { useState, useEffect } from 'react';
import { Sun, Moon, CloudSun, Clock, Flame, ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';
import { ZmanItem } from '../types';
import { CURRENT_ZMANIM } from '../data/mockData';

interface RightSidebarProps {
  locationName: string;
  onNavigateToZmanim: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  locationName,
  onNavigateToZmanim
}) => {
  // Simple countdown ticker simulation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 18,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 14, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="w-80 border-l border-amber-200/40 dark:border-slate-800 bg-[#FAF8F3] dark:bg-[#0F172A] p-5 flex flex-col gap-6 overflow-y-auto shrink-0 z-10 shadow-sm">
      {/* Location GPS & Weather Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/20 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
            <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
            <span>GPS Auto-Calibrated</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-200 font-bold">
            IST
          </span>
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">
          {locationName}
        </h4>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-500/10 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CloudSun className="w-4 h-4 text-amber-500" />
            <span>26°C Clear Hills</span>
          </span>
          <span className="flex items-center gap-1">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Waning 92%</span>
          </span>
        </div>
      </div>

      {/* Live Next Zman Countdown */}
      <div className="p-4 rounded-2xl bg-[#0A1128] text-white shadow-xl relative overflow-hidden border border-amber-500/30">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-amber-500/10 blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between text-xs text-amber-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Next Zman: Sunset (Shkiah)
          </span>
          <span className="font-bold">6:08 PM</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="bg-white/10 rounded-xl py-2 backdrop-blur-sm border border-white/10">
            <div className="text-xl font-black font-mono tracking-tight text-amber-300">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Hours</div>
          </div>
          <div className="bg-white/10 rounded-xl py-2 backdrop-blur-sm border border-white/10">
            <div className="text-xl font-black font-mono tracking-tight text-amber-300">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Mins</div>
          </div>
          <div className="bg-white/10 rounded-xl py-2 backdrop-blur-sm border border-white/10">
            <div className="text-xl font-black font-mono tracking-tight text-amber-400">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Secs</div>
          </div>
        </div>
      </div>

      {/* Today's Zmanim Schedule List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Today's Zmanim</span>
          </h3>
          <button
            onClick={onNavigateToZmanim}
            className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline font-semibold flex items-center gap-0.5"
          >
            <span>Full List</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-1.5">
          {CURRENT_ZMANIM.slice(0, 8).map((zman) => (
            <div
              key={zman.key}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                zman.isKeyEvent
                  ? 'bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300/40 font-semibold text-slate-900 dark:text-slate-100'
                  : 'bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {zman.key === 'candle' && <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />}
                <span>{zman.label}</span>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{zman.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Halachic Reminder / Note */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Halachic Reminder</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          Recite Tikkun Chatzot or afternoon Tehillim for the well-being and Aliyah of our brothers and sisters in Manipur, Mizoram, and Zion.
        </p>
      </div>
    </aside>
  );
};
