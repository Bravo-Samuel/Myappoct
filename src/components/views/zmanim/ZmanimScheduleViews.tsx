import React, { useState } from 'react';
import { DailyZmanimSchedule, ZmanDetail } from '../../../services/zmanim/ZmanimService';
import { Sun, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Mountain, ShieldCheck } from 'lucide-react';

interface TomorrowPreviewProps {
  schedule: DailyZmanimSchedule;
}

export const TomorrowPreview: React.FC<TomorrowPreviewProps> = ({ schedule }) => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px] uppercase tracking-wider block w-fit mb-2">
            Tomorrow Preview
          </span>
          <h3 className="text-xl font-black text-white">
            {schedule.dateStr} • {schedule.hebrewDateSummary}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Calculated for {schedule.locationName} ({schedule.elevationMeters}m ridge altitude)
          </p>
        </div>
        {schedule.isFastDay && (
          <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center gap-2 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Fast Day: {schedule.fastName}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedule.zmanim.map(zman => (
          <div
            key={zman.key}
            className={`p-5 rounded-2xl border transition-all ${
              zman.isKeyEvent
                ? 'bg-gradient-to-br from-amber-500/10 via-white to-amber-50/30 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border-amber-400/80 shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {zman.label}
                </span>
                <span className="text-xs font-serif text-amber-800 dark:text-amber-400 block mt-0.5 font-bold">
                  {zman.hebrewLabel}
                </span>
              </div>
              <span className="text-sm font-black font-mono px-2.5 py-1 rounded-xl bg-slate-900 dark:bg-slate-800 text-amber-300">
                {zman.formattedTime}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {zman.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface WeeklyScheduleViewProps {
  weeklySchedule: DailyZmanimSchedule[];
}

export const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({ weeklySchedule }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-amber-500" />
          <span>7-Day Halachic Matrix ({weeklySchedule[0]?.locationName})</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Side-by-side comparison of solar fluctuations across the upcoming week
        </p>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
              <th className="py-3 px-4 min-w-[140px]">Date / Day</th>
              <th className="py-3 px-3 text-amber-600 dark:text-amber-400">Alot HaShachar</th>
              <th className="py-3 px-3">Misheyakir</th>
              <th className="py-3 px-3 text-amber-600 dark:text-amber-400 font-black">Netz (Sunrise)</th>
              <th className="py-3 px-3">Shema (GRA)</th>
              <th className="py-3 px-3">Chatzot</th>
              <th className="py-3 px-3 text-indigo-600 dark:text-indigo-400 font-black">Shkiah (Sunset)</th>
              <th className="py-3 px-3 text-slate-800 dark:text-slate-200 font-bold">Tzeit (Nightfall)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {weeklySchedule.map(day => {
              const findZ = (key: string) => day.zmanim.find(z => z.key === key)?.formattedTime || '—';
              const dt = new Date(day.dateStr + 'T12:00:00');
              const dayName = dt.toLocaleDateString('en-US', { weekday: 'short' });
              return (
                <tr
                  key={day.dateStr}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                    day.isShabbatOrYomTov ? 'bg-amber-50/40 dark:bg-amber-950/20 font-bold' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {dayName}, {day.dateStr}
                    </div>
                    <div className="text-[10px] text-amber-700 dark:text-amber-400 font-serif">
                      {day.hebrewDateSummary.split('(')[0]}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{findZ('alot')}</td>
                  <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">{findZ('misheyakir')}</td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">{findZ('sunrise')}</td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{findZ('shema_gra')}</td>
                  <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">{findZ('chatzot')}</td>
                  <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{findZ('sunset')}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{findZ('nightfall')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface MonthlyScheduleViewProps {
  monthlySchedule: DailyZmanimSchedule[];
  currentMonthName: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const MonthlyScheduleView: React.FC<MonthlyScheduleViewProps> = ({
  monthlySchedule,
  currentMonthName,
  onPrevMonth,
  onNextMonth
}) => {
  const [selectedDay, setSelectedDay] = useState<DailyZmanimSchedule | null>(null);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            {currentMonthName} Halachic Overview
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select any day to inspect full 16-zman breakdown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {monthlySchedule.map(day => {
          const sunrise = day.zmanim.find(z => z.key === 'sunrise')?.formattedTime;
          const sunset = day.zmanim.find(z => z.key === 'sunset')?.formattedTime;
          return (
            <div
              key={day.dateStr}
              onClick={() => setSelectedDay(day)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedDay?.dateStr === day.dateStr
                  ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30'
                  : day.isShabbatOrYomTov
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300/60 dark:border-amber-800/60 hover:border-amber-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {day.dateStr.split('-').slice(1).join('/')}
                </span>
                {day.isFastDay && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-600 dark:text-red-400">
                    Fast Day
                  </span>
                )}
              </div>
              <div className="text-[10px] text-amber-800 dark:text-amber-400 font-serif truncate mb-2">
                {day.hebrewDateSummary.split('(')[0]}
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>☀ {sunrise}</span>
                <span>🌙 {sunset}</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white border border-amber-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-black text-amber-400">
                Full Zmanim for {selectedDay.dateStr}
              </h4>
              <p className="text-xs text-slate-400">
                {selectedDay.hebrewDateSummary} ({selectedDay.locationName})
              </p>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
            >
              Close Details
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {selectedDay.zmanim.map(z => (
              <div key={z.key} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{z.label}</span>
                  <span className="text-[10px] text-amber-300 font-serif block">{z.hebrewLabel}</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">{z.formattedTime}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
