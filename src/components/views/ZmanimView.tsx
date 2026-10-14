import React, { useState, useEffect } from 'react';
import { Sun, MapPin, Clock, ShieldCheck, ArrowRightLeft, Bell, Sparkles, Moon, Mountain, Navigation, Home, Compass, Calendar as CalendarIcon } from 'lucide-react';
import { ZmanimService, DailyZmanimSchedule, ZmanDetail } from '../../services/zmanim/ZmanimService';
import { LocationResolver, HalachicLocation } from '../../services/zmanim/LocationResolver';
import { LocationService } from '../../services/data/LocationService';
import { LunarPhaseTracker } from '../LunarPhaseTracker';
import { ZmanimNotificationsModal } from './zmanim/ZmanimNotificationsModal';
import { TomorrowPreview, WeeklyScheduleView, MonthlyScheduleView } from './zmanim/ZmanimScheduleViews';

interface ZmanimViewProps {
  currentLocation: string;
  onLocationChange: (loc: string) => void;
}

export const ZmanimView: React.FC<ZmanimViewProps> = ({ currentLocation, onLocationChange }) => {
  const [activeLocObj, setActiveLocObj] = useState<HalachicLocation>(() =>
    LocationResolver.getLocationByNameOrId(currentLocation || 'Churachandpur')
  );
  const [homeLocObj, setHomeLocObj] = useState<HalachicLocation>(() => LocationService.getLocationState().homeLocation);
  const [isTravelMode, setIsTravelMode] = useState<boolean>(() => LocationService.getLocationState().isTravelMode);

  const [scheduleToday, setScheduleToday] = useState<DailyZmanimSchedule>(() =>
    ZmanimService.getDailyZmanim(new Date(), activeLocObj)
  );

  const [scheduleTomorrow, setScheduleTomorrow] = useState<DailyZmanimSchedule>(() =>
    ZmanimService.getTomorrowZmanim(activeLocObj)
  );

  const [viewTab, setViewTab] = useState<'today' | 'tomorrow' | 'weekly' | 'monthly' | 'lunar'>('today');
  const [compareLocQuery, setCompareLocQuery] = useState<string>('Jerusalem');
  const [compareSchedule, setCompareSchedule] = useState<DailyZmanimSchedule>(() =>
    ZmanimService.getDailyZmanim(new Date(), LocationResolver.getLocationByNameOrId('Jerusalem'))
  );

  // Live Countdown State
  const [timeRemainingStr, setTimeRemainingStr] = useState<string>('00:00:00');
  const [nextZman, setNextZman] = useState<ZmanDetail | null>(scheduleToday.nextZman);

  // Monthly Calendar Navigation State
  const [monthlyYear, setMonthlyYear] = useState<number>(() => new Date().getFullYear());
  const [monthlyMonth, setMonthlyMonth] = useState<number>(() => new Date().getMonth());

  // Notifications Modal State
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);

  // Sync active location whenever `currentLocation` prop changes
  useEffect(() => {
    const resolved = LocationResolver.getLocationByNameOrId(currentLocation);
    setActiveLocObj(resolved);
  }, [currentLocation]);

  // Recalculate schedules when activeLocObj changes
  useEffect(() => {
    const today = ZmanimService.getDailyZmanim(new Date(), activeLocObj);
    const tomorrow = ZmanimService.getTomorrowZmanim(activeLocObj);
    setScheduleToday(today);
    setScheduleTomorrow(tomorrow);
    setNextZman(today.nextZman);
  }, [activeLocObj]);

  // Update comparison schedule
  useEffect(() => {
    const compLoc = LocationResolver.getLocationByNameOrId(compareLocQuery);
    setCompareSchedule(ZmanimService.getDailyZmanim(new Date(), compLoc));
  }, [compareLocQuery]);

  // 1-second live countdown ticker
  useEffect(() => {
    const interval = setInterval(() => {
      if (!nextZman) {
        // refresh today's zmanim
        const updated = ZmanimService.getDailyZmanim(new Date(), activeLocObj);
        setNextZman(updated.nextZman);
        return;
      }

      const diffMs = nextZman.timeDate.getTime() - new Date().getTime();
      if (diffMs <= 0) {
        // Time expired! Refresh next zman
        const updated = ZmanimService.getDailyZmanim(new Date(), activeLocObj);
        setScheduleToday(updated);
        setNextZman(updated.nextZman);
      } else {
        const totalSecs = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        setTimeRemainingStr(
          `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextZman, activeLocObj]);

  // Handlers
  const handleSelectLocationPreset = (loc: HalachicLocation) => {
    LocationService.setActiveLocation(loc.name);
    onLocationChange(loc.name);
  };

  const handleToggleTravelMode = () => {
    const nextVal = !isTravelMode;
    setIsTravelMode(nextVal);
    LocationService.setTravelMode(nextVal);
    if (!nextVal) {
      onLocationChange(homeLocObj.name);
    }
  };

  const handleSetAsHomeLocation = () => {
    const updatedHome = LocationService.setHomeLocation(activeLocObj.name);
    setHomeLocObj(updatedHome);
  };

  const handleTriggerGPS = async () => {
    setIsLocatingGPS(true);
    try {
      const result = await LocationResolver.requestGPSLocation();
      const customLoc = LocationService.setCustomGPSLocation(
        result.latitude,
        result.longitude,
        result.elevationMeters,
        result.closestPreset.name
      );
      setIsTravelMode(true);
      setActiveLocObj(customLoc);
      onLocationChange(customLoc.name);
    } catch (err: any) {
      alert(`GPS Resolution Failed: ${err.message || 'Permission denied or unavailable.'}`);
    } finally {
      setIsLocatingGPS(false);
    }
  };

  const handlePrevMonth = () => {
    if (monthlyMonth === 0) {
      setMonthlyMonth(11);
      setMonthlyYear(y => y - 1);
    } else {
      setMonthlyMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (monthlyMonth === 11) {
      setMonthlyMonth(0);
      setMonthlyYear(y => y + 1);
    } else {
      setMonthlyMonth(m => m + 1);
    }
  };

  const monthlyScheduleList = ZmanimService.getMonthlySchedule(monthlyYear, monthlyMonth, activeLocObj);
  const currentMonthDisplay = new Date(monthlyYear, monthlyMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0A1128] via-[#1E293B] to-[#0A1128] text-white shadow-xl border border-amber-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Astronomical GPS Halachic Engine</span>
            {isTravelMode && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-black text-[10px] flex items-center gap-1 border border-indigo-400/40">
                <Compass className="w-3 h-3" />
                Travel Mode Active
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Halachic Zmanim & Prayer Times
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Precise solar calculations calibrated for ridge topography in {activeLocObj.name} ({activeLocObj.elevationMeters}m elevation).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleTriggerGPS}
            disabled={isLocatingGPS}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${isLocatingGPS ? 'animate-spin' : ''}`} />
            <span>{isLocatingGPS ? 'Locking GPS...' : 'Auto GPS'}</span>
          </button>

          <button
            onClick={() => setIsNotifModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md flex items-center gap-2 transition-all"
          >
            <Bell className="w-4 h-4" />
            <span>Prayer Alarms</span>
          </button>
        </div>
      </div>

      {/* Rabbinic Consultative Disclaimer */}
      <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/20 text-blue-900 dark:text-blue-300 text-xs flex items-start gap-3 shadow-sm" id="zmanim-halachic-notice">
        <Compass className="w-5 h-5 shrink-0 text-blue-500 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Important Halachic Notice:</strong> These calculations are generated using astronomical solar formulas adjusted for local elevation. While highly accurate for daily scheduling, certain practices (such as custom Shabbat candles, fast day endpoints, and regional custom adoptions) must be performed under the guidance of your local synagogue Rabbi or the Regional Rabbinical Council. Always consult local authorities for absolute guidance.
        </div>
      </div>

      {/* Prominent Next Zman Countdown Banner */}
      {nextZman && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 shadow-2xl border border-amber-300/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
              <span>Today's Next Halachic Milestone</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 flex flex-wrap items-center gap-2">
              <span>{nextZman.label}</span>
              <span className="text-amber-950 font-serif font-bold text-xl opacity-90">({nextZman.hebrewLabel})</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-900/80 font-semibold mt-1">
              {nextZman.description}
            </p>
          </div>

          <div className="flex items-center gap-6 bg-slate-950/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 w-full md:w-auto justify-between md:justify-end">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-900 block">
                Target Deadline ({activeLocObj.timeZone})
              </span>
              <span className="text-2xl font-black font-mono text-slate-950">
                {nextZman.formattedTime}
              </span>
            </div>
            <div className="h-10 w-px bg-slate-900/30"></div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-900 block">
                Countdown
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white drop-shadow-sm">
                {timeRemainingStr}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-fit">
          <button
            onClick={() => setViewTab('today')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewTab === 'today'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Daily Zmanim</span>
          </button>

          <button
            onClick={() => setViewTab('tomorrow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewTab === 'tomorrow'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Tomorrow Preview</span>
          </button>

          <button
            onClick={() => setViewTab('weekly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewTab === 'weekly'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Weekly Matrix</span>
          </button>

          <button
            onClick={() => setViewTab('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewTab === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Monthly Grid</span>
          </button>

          <button
            onClick={() => setViewTab('lunar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewTab === 'lunar'
                ? 'bg-[#0A1128] text-amber-400 shadow-md border border-amber-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4 text-amber-400" />
            <span>Lunar Phase Predictor</span>
          </button>
        </div>

        {/* Home Location & Travel Mode Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleTravelMode}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              isTravelMode
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Travel Mode: {isTravelMode ? 'ON' : 'OFF'}</span>
          </button>

          {homeLocObj.id !== activeLocObj.id && (
            <button
              onClick={handleSetAsHomeLocation}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/20 hover:text-amber-600 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Set {activeLocObj.name} as Home</span>
            </button>
          )}
        </div>
      </div>

      {viewTab === 'lunar' ? (
        <LunarPhaseTracker />
      ) : viewTab === 'tomorrow' ? (
        <TomorrowPreview schedule={scheduleTomorrow} />
      ) : viewTab === 'weekly' ? (
        <WeeklyScheduleView weeklySchedule={ZmanimService.getWeeklySchedule(new Date(), activeLocObj)} />
      ) : viewTab === 'monthly' ? (
        <MonthlyScheduleView
          monthlySchedule={monthlyScheduleList}
          currentMonthName={currentMonthDisplay}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      ) : (
        <>
          {/* Active Hub & Multi-City Quick Selector */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Bnei Menashe & Global Hubs:</span>
                {homeLocObj && (
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    (Home: {homeLocObj.name})
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {LocationResolver.PRESET_LOCATIONS.map((loc: HalachicLocation) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectLocationPreset(loc)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeLocObj.id === loc.id
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500 font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{loc.name}</span>
                    {loc.elevationMeters >= 500 && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black">
                        {loc.elevationMeters}m
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Elevation-Aware Calculations Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <Mountain className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Mountain Elevation Dip Correction ({activeLocObj.elevationMeters}m)
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Calibrated
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {scheduleToday.elevationSummary.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Dip Angle</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {scheduleToday.elevationSummary.dipAngleArcMinutes}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Horizon Shift</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  ±{scheduleToday.elevationSummary.timeShiftMinutesSeconds}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sha'ah GRA</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.round(scheduleToday.shaahZmanitGRASeconds / 60)}m {scheduleToday.shaahZmanitGRASeconds % 60}s
                </span>
              </div>
            </div>
          </div>

          {/* Full Schedule Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduleToday.zmanim.map((zman: ZmanDetail) => {
              const isNext = nextZman?.key === zman.key;
              return (
                <div
                  key={zman.key}
                  className={`p-5 rounded-2xl transition-all border relative overflow-hidden ${
                    isNext
                      ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                      : zman.isKeyEvent
                      ? 'bg-gradient-to-br from-amber-500/10 via-white to-amber-50/40 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border-amber-400/80 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300 shadow-xs'
                  }`}
                >
                  {isNext && (
                    <div className="absolute top-0 right-0 px-3 py-0.5 bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-bl-xl shadow-xs">
                      Next Up
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {zman.label}
                      </span>
                      <span className="text-xs font-serif text-amber-800 dark:text-amber-400 block mt-0.5 font-bold">
                        {zman.hebrewLabel}
                      </span>
                    </div>
                    <span
                      className={`text-base sm:text-lg font-black font-mono px-2.5 py-1 rounded-xl shadow-inner ${
                        isNext
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-[#0A1128] text-amber-300'
                      }`}
                    >
                      {zman.formattedTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {zman.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Comparison Panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-800 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-amber-500" />
                  <span>Halachic Elevation & Hub Comparison</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Comparing {activeLocObj.name} ({activeLocObj.elevationMeters}m) against {compareLocQuery}
                </p>
              </div>
              <select
                value={compareLocQuery}
                onChange={e => setCompareLocQuery(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="Jerusalem">Compare with Jerusalem (754m)</option>
                <option value="Churachandpur">Compare with Churachandpur (914m)</option>
                <option value="Shillong">Compare with Shillong (1525m)</option>
                <option value="Aizawl">Compare with Aizawl (1132m)</option>
                <option value="Haifa">Compare with Haifa (290m)</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Prayer Milestone</th>
                    <th className="py-3 px-4 text-amber-600 dark:text-amber-400">{activeLocObj.name}</th>
                    <th className="py-3 px-4 text-indigo-600 dark:text-indigo-400">{compareSchedule.locationName}</th>
                    <th className="py-3 px-4">Elevation Delta / Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">Alot HaShachar (Dawn)</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-600">
                      {scheduleToday.zmanim.find(z => z.key === 'alot')?.formattedTime}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-500">
                      {compareSchedule.zmanim.find(z => z.key === 'alot')?.formattedTime}
                    </td>
                    <td className="py-3 px-4 text-slate-500">16.1° Solar depression angle</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">Sunrise (Netz HaChamah)</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-600">
                      {scheduleToday.zmanim.find(z => z.key === 'sunrise')?.formattedTime}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-500">
                      {compareSchedule.zmanim.find(z => z.key === 'sunrise')?.formattedTime}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {activeLocObj.elevationMeters}m vs {compareSchedule.elevationMeters}m ridge elevation adjustment
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">Latest Shema (GRA)</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-600">
                      {scheduleToday.zmanim.find(z => z.key === 'shema_gra')?.formattedTime}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-500">
                      {compareSchedule.zmanim.find(z => z.key === 'shema_gra')?.formattedTime}
                    </td>
                    <td className="py-3 px-4 text-slate-500">3 Sha'ot Zmaniyot (Netz to Shkiah)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">Sunset (Shkiah)</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-600">
                      {scheduleToday.zmanim.find(z => z.key === 'sunset')?.formattedTime}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-500">
                      {compareSchedule.zmanim.find(z => z.key === 'sunset')?.formattedTime}
                    </td>
                    <td className="py-3 px-4 text-slate-500">Solar disk disappearance below western horizon</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Notifications Modal */}
      <ZmanimNotificationsModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        locationName={activeLocObj.name}
      />
    </div>
  );
};
