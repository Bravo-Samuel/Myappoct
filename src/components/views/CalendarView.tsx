import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShieldCheck,
  Sparkles,
  Flame,
  Moon,
  RefreshCw,
  BookOpen,
  Globe,
  CalendarDays,
  Clock,
  HelpCircle,
  Printer,
  FileText
} from 'lucide-react';
import { LunarPhaseTracker } from '../LunarPhaseTracker';
import { HebrewCalendarService, HebrewDateInfo } from '../../services/data/HebrewCalendarService';
import { CalendarService, UnifiedDayItem } from '../../services/data/CalendarService';

export const CalendarView: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 1-indexed (July)
  const [localeMode, setLocaleMode] = useState<'en' | 'he'>('en');
  const [diaspora, setDiaspora] = useState<boolean>(true);
  const [offlineSync, setOfflineSync] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'calendar' | 'lunar' | 'converter'>('calendar');
  const [monthlyDays, setMonthlyDays] = useState<UnifiedDayItem[]>([]);
  const [selectedDayInfo, setSelectedDayInfo] = useState<UnifiedDayItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Date Converter State
  const [gregInput, setGregInput] = useState<string>('2026-07-02');
  const [convertedHebrew, setConvertedHebrew] = useState<any>(null);
  const [hebrewYearInput, setHebrewYearInput] = useState<number>(5786);
  const [hebrewMonthInput, setHebrewMonthInput] = useState<string>('Tamuz');
  const [hebrewDayInput, setHebrewDayInput] = useState<number>(16);
  const [convertedGregorian, setConvertedGregorian] = useState<string>('');

  useEffect(() => {
    loadMonthData(currentYear, currentMonth, diaspora);
  }, [currentYear, currentMonth, diaspora]);

  useEffect(() => {
    // Initial date converter calculation
    try {
      const hResult = HebrewCalendarService.gregorianToHebrew(new Date(gregInput));
      setConvertedHebrew(hResult);
    } catch {
      // ignore
    }
  }, [gregInput]);

  const loadMonthData = async (year: number, month: number, isDiaspora: boolean) => {
    setLoading(true);
    try {
      const days = await CalendarService.getUnifiedMonthlyCalendar(year, month, undefined, isDiaspora);
      setMonthlyDays(days);
      if (days.length > 0 && !selectedDayInfo) {
        // Default select today or 1st of month
        const todayStr = new Date().toISOString().split('T')[0];
        const foundToday = days.find(d => d.gregorianDate === todayStr);
        setSelectedDayInfo(foundToday || days[0]);
      } else if (selectedDayInfo) {
        // Keep selected day or match new month
        const dayNum = parseInt(selectedDayInfo.gregorianDate.split('-')[2], 10);
        const match = days[dayNum - 1] || days[0];
        setSelectedDayInfo(match);
      }
    } catch (e) {
      console.error('Failed loading unified monthly calendar:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleJumpToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
  };

  const handleConvertHebrewToGregorian = () => {
    try {
      const gDate = HebrewCalendarService.hebrewToGregorian(hebrewYearInput, hebrewMonthInput, hebrewDayInput);
      setConvertedGregorian(gDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    } catch (err: any) {
      setConvertedGregorian(`Invalid Hebrew date combination: ${err?.message}`);
    }
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Gregorian Date,Hebrew Date,Holidays,Parashah,Omer Day,Synagogue Events\n';
    
    monthlyDays.forEach(day => {
      const gDate = day.gregorianDate;
      const hDate = localeMode === 'he' ? day.hebrewDateFormattedHe : day.hebrewDateFormattedEn;
      const holidays = day.holidays.map(h => localeMode === 'he' ? h.nameHe : h.nameEn).join('; ');
      const parashah = day.isShabbat && day.parashah ? (localeMode === 'he' ? day.parashah.nameHe : day.parashah.nameEn) : '';
      const omerNum = day.omer ? day.omer.dayNumber : '';
      const events = day.synagogueEvents.map(e => e.title).join('; ');
      
      const row = `"${gDate}","${hDate}","${holidays.replace(/"/g, '""')}","${parashah}","${omerNum}","${events.replace(/"/g, '""')}"`;
      csvContent += row + '\n';
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bnei_Menashe_Calendar_${currentMonthNameEn}_${currentYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportICS = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Bnei Menashe Sacred Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    monthlyDays.forEach(day => {
      // Holidays
      day.holidays.forEach(h => {
        const dateStr = day.gregorianDate.replace(/-/g, ''); // YYYYMMDD
        icsContent.push('BEGIN:VEVENT');
        icsContent.push(`UID:holiday-${dateStr}-${h.nameEn.replace(/\s+/g, '-')}`);
        icsContent.push(`DTSTART;VALUE=DATE:${dateStr}`);
        icsContent.push(`DTEND;VALUE=DATE:${dateStr}`);
        icsContent.push(`SUMMARY:${h.nameEn} (${h.nameHe})`);
        icsContent.push(`DESCRIPTION:Category: ${h.category}`);
        icsContent.push('END:VEVENT');
      });

      // Synagogue events
      day.synagogueEvents.forEach(e => {
        const dateStr = day.gregorianDate.replace(/-/g, ''); // YYYYMMDD
        icsContent.push('BEGIN:VEVENT');
        icsContent.push(`UID:event-${e.id}`);
        icsContent.push(`DTSTART;VALUE=DATE:${dateStr}`);
        icsContent.push(`DTEND;VALUE=DATE:${dateStr}`);
        icsContent.push(`SUMMARY:${e.title}`);
        icsContent.push(`DESCRIPTION:${e.description || ''}`);
        if (e.location) {
          icsContent.push(`LOCATION:${e.location}`);
        }
        icsContent.push('END:VEVENT');
      });

      // Shabbat Parashah
      if (day.isShabbat && day.parashah) {
        const dateStr = day.gregorianDate.replace(/-/g, ''); // YYYYMMDD
        icsContent.push('BEGIN:VEVENT');
        icsContent.push(`UID:shabbat-${dateStr}`);
        icsContent.push(`DTSTART;VALUE=DATE:${dateStr}`);
        icsContent.push(`DTEND;VALUE=DATE:${dateStr}`);
        icsContent.push(`SUMMARY:Shabbat - Parashat ${day.parashah.nameEn}`);
        icsContent.push(`DESCRIPTION:Torah Reading: Parashat ${day.parashah.nameEn} (${day.parashah.nameHe})`);
        icsContent.push('END:VEVENT');
      }
    });

    icsContent.push('END:VCALENDAR');
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bnei_Menashe_Events_${currentMonthNameEn}_${currentYear}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Determine starting weekday offset for empty padding cells
  const firstDayOfWeek = monthlyDays.length > 0 ? new Date(currentYear, currentMonth - 1, 1).getDay() : 0;
  const paddingCells = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthNameEn = monthNamesEn[currentMonth - 1];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      {/* Dynamic Print-Only Header */}
      {monthlyDays.length > 0 && (
        <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-2xl font-black text-slate-950 font-sans tracking-tight">
            {localeMode === 'he' ? 'לוּחַ שָׁנָה עִבְרִי וּלְעוֹזִי בְּנֵי מְנַשֶּׁה' : 'Bnei Menashe Dual Sacred Calendar'}
          </h1>
          <p className="text-xs text-slate-600 font-serif mt-1">
            {diaspora ? 'Diaspora Custom' : 'Eretz Yisrael Custom'} • Precise Halachic Zmanim & Holidays
          </p>
          <h2 className="text-xl font-bold text-amber-800 mt-2">
            {localeMode === 'he'
              ? `${monthlyDays[0]?.hebrewMonthNameHe || ''} - ${monthlyDays[monthlyDays.length - 1]?.hebrewMonthNameHe || ''} ${monthlyDays[0]?.hebrewYear || 5786}`
              : `${currentMonthNameEn} ${currentYear} — ${monthlyDays[0]?.hebrewMonthNameEn || 'Tamuz'}/${monthlyDays[monthlyDays.length - 1]?.hebrewMonthNameEn || 'Av'} ${monthlyDays[0]?.hebrewYear || 5786}`}
          </h2>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-800 shadow-md print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black text-[10px] uppercase tracking-wider">
              Halachic Engine v2.0
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            <CalendarIcon className="w-6 h-6 text-amber-500 shrink-0" />
            <span>{localeMode === 'he' ? 'לוּחַ שָׁנָה עִבְרִי וּלְעוֹזִי בְּנֵי מְנַשֶּׁה' : 'Dual Hebrew & Gregorian Sacred Calendar'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {localeMode === 'he'
              ? 'מְחֻשָּׁב עִם זְמַנֵּי הֲלָכָה מְדֻיָּקִים, פָּרָשַׁת הַשָּׁבוּעַ וּסְפִירַת הָעוֹמֶר'
              : 'Real-time astronomical & halachic calculations supporting Bnei Menashe Diaspora and Eretz Yisrael traditions'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Localization Mode Switcher */}
          <button
            onClick={() => setLocaleMode(l => l === 'en' ? 'he' : 'en')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-slate-300/50 dark:border-slate-700"
          >
            <Globe className="w-4 h-4 text-amber-500" />
            <span>{localeMode === 'en' ? '🇮🇱 עברית' : '🇺🇸 English'}</span>
          </button>

          {/* Diaspora vs Israel Toggle */}
          <button
            onClick={() => setDiaspora(!diaspora)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold text-xs hover:bg-amber-500/20 transition-all flex items-center gap-1.5 border border-amber-500/30"
          >
            <span>{diaspora ? '🌍 Diaspora Custom' : '🇮🇱 Eretz Yisrael Custom'}</span>
          </button>

          <button
            onClick={() => setOfflineSync(!offlineSync)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              offlineSync
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{offlineSync ? 'Offline PWA Ready' : 'Enable Offline'}</span>
          </button>

          <button className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:scale-105 transition-transform flex items-center gap-1.5 shadow-md">
            <Plus className="w-4 h-4" />
            <span>Add Family Memorial</span>
          </button>
        </div>
      </div>

      {/* Phase 8: Help Everywhere ("What is this?") */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-white space-y-2 shadow-lg print:hidden">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>What is the Dual Hebrew & Gregorian Calendar?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Dual Calendar bridges the Jewish calendar (tracking Shabbat, biblical holidays, fast days, and Rosh Chodesh lunar cycles) and the civil Gregorian calendar. It computes precise localized Halachic times (Zmanim) and provides a date converter, enabling families to coordinate lifecycle events, observe holidays, and track daily prayers seamlessly.
        </p>
      </div>

      {/* View Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-fit print:hidden">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'calendar'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>{localeMode === 'he' ? 'לוּחַ חָדְשִׁי מְשֻׁלָּב' : 'Dual Monthly Grid'}</span>
        </button>

        <button
          onClick={() => setActiveTab('lunar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'lunar'
              ? 'bg-[#0A1128] text-amber-400 shadow-md border border-amber-500/40'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Moon className="w-4 h-4 text-amber-400" />
          <span>{localeMode === 'he' ? 'מוֹלָד וּמַחְזוֹר הַיָּרֵחַ' : 'Visual Lunar Phase & Molad'}</span>
        </button>

        <button
          onClick={() => setActiveTab('converter')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'converter'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>{localeMode === 'he' ? 'מֵמִיר תַּאֲרִיכִים' : 'Date Converter'}</span>
        </button>
      </div>

      {activeTab === 'lunar' && <LunarPhaseTracker />}

      {activeTab === 'converter' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gregorian to Hebrew */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-amber-200/60 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <RefreshCw className="w-4 h-4" />
              <span>Convert Gregorian to Hebrew Date</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any civil Gregorian date to calculate its exact Hebrew calendar equivalent, weekly Torah reading, and holiday status.
            </p>
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Gregorian Date</label>
              <input
                type="date"
                value={gregInput}
                onChange={e => setGregInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {convertedHebrew && (
              <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-slate-800/80 border border-amber-300/50 dark:border-slate-700 space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Calculated Hebrew Date</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs">
                    Year {convertedHebrew.year}
                  </span>
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white font-sans">
                  {convertedHebrew.formattedEn}
                </div>
                <div className="text-base font-bold text-amber-700 dark:text-amber-400 text-right">
                  {convertedHebrew.formattedHe}
                </div>
              </div>
            )}
          </div>

          {/* Hebrew to Gregorian */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-amber-200/60 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <CalendarIcon className="w-4 h-4" />
              <span>Convert Hebrew Date to Gregorian</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Specify the Hebrew Year, Month name, and Day number to discover the corresponding civil date.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hebrew Day</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={hebrewDayInput}
                  onChange={e => setHebrewDayInput(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hebrew Month</label>
                <select
                  value={hebrewMonthInput}
                  onChange={e => setHebrewMonthInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {['Nisan', 'Iyyar', 'Sivan', 'Tamuz', 'Av', 'Elul', 'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Sh\'vat', 'Adar', 'Adar I', 'Adar II'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hebrew Year</label>
                <input
                  type="number"
                  min="5700"
                  max="5900"
                  value={hebrewYearInput}
                  onChange={e => setHebrewYearInput(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              onClick={handleConvertHebrewToGregorian}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md mt-2"
            >
              Calculate Civil Date
            </button>

            {convertedGregorian && (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mt-4">
                <div className="text-xs font-bold text-slate-500 uppercase">Corresponding Gregorian Date</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {convertedGregorian}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <>
          {/* Month Navigator */}
          <div className="flex items-center justify-between p-4.5 rounded-2xl bg-[#0A1128] text-white shadow-xl border border-amber-500/30 print:hidden">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-300 transition-colors flex items-center gap-1"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleJumpToday}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-colors"
              >
                {localeMode === 'he' ? 'הַיּוֹם' : 'Today'}
              </button>
            </div>

            <div className="text-center">
              <h3 className="text-base sm:text-xl font-bold text-amber-400 font-sans tracking-tight">
                {localeMode === 'he'
                  ? `${monthlyDays[0]?.hebrewMonthNameHe || ''} - ${monthlyDays[monthlyDays.length - 1]?.hebrewMonthNameHe || ''} ${monthlyDays[0]?.hebrewYear || 5786}`
                  : `${currentMonthNameEn} ${currentYear}`}
              </h3>
              <span className="text-[11px] text-slate-300 font-serif block mt-0.5">
                {monthlyDays[0]?.hebrewMonthNameEn || 'Tamuz'} — {monthlyDays[monthlyDays.length - 1]?.hebrewMonthNameEn || 'Av'} {monthlyDays[0]?.hebrewYear || 5786}
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-amber-200/60 dark:border-slate-800 shadow-xl overflow-hidden print:border-none print:shadow-none print:p-0">
            {/* Export & Print Toolbelt */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 print:hidden">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Active Month: <strong>{currentMonthNameEn} {currentYear}</strong></span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4 text-amber-500" />
                  <span>Print Month</span>
                </button>

                <button
                  onClick={handleExportICS}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Export highlighted holidays & community events to iCalendar (.ics)"
                >
                  <CalendarIcon className="w-4 h-4 text-indigo-500" />
                  <span>Export to Google/Apple Cal</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Export monthly days and events to CSV Spreadsheet"
                >
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Export Month (CSV)</span>
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              {localeMode === 'he' ? (
                <>
                  <div>א׳</div>
                  <div>ב׳</div>
                  <div>ג׳</div>
                  <div>ד׳</div>
                  <div>ה׳</div>
                  <div>ו׳</div>
                  <div className="text-amber-600 dark:text-amber-400 font-black">שַׁבָּת</div>
                </>
              ) : (
                <>
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div className="text-amber-600 dark:text-amber-400 font-black">Shabbat</div>
                </>
              )}
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-400 font-medium flex flex-col items-center justify-center gap-2">
                <Clock className="w-6 h-6 animate-spin text-amber-500" />
                <span>Calculating Halachic Calendar Grid...</span>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2 sm:gap-3 pt-4">
                {paddingCells.map(p => (
                  <div key={`pad-${p}`} className="min-h-[85px] sm:min-h-[105px] p-2.5 rounded-2xl bg-slate-50/40 dark:bg-slate-800/20 border border-transparent opacity-40 pointer-events-none" />
                ))}

                {monthlyDays.map((d) => {
                  const dayNum = parseInt(d.gregorianDate.split('-')[2], 10);
                  const isTodayStr = new Date().toISOString().split('T')[0] === d.gregorianDate;
                  const isSelected = selectedDayInfo?.gregorianDate === d.gregorianDate;

                  return (
                    <div
                      key={d.gregorianDate}
                      onClick={() => setSelectedDayInfo(d)}
                      className={`min-h-[90px] sm:min-h-[115px] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group print:min-h-[110px] print:rounded-none print:border-slate-300 print:bg-white print:text-black print:shadow-none print:break-inside-avoid ${
                        isTodayStr
                          ? 'bg-amber-500/15 border-2 border-amber-500 text-slate-900 dark:text-white shadow-md print:border-slate-400 print:border-2'
                          : isSelected
                          ? 'bg-slate-100 dark:bg-slate-800 border-amber-400 shadow-sm print:bg-white print:border-slate-300'
                          : 'bg-[#FAF8F3]/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-amber-300 print:bg-white print:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${isTodayStr ? 'text-amber-700 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'} print:text-slate-950`}>
                          {dayNum}
                        </span>
                        <span className="text-[11px] font-serif font-bold text-amber-800 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded print:text-amber-900 print:border print:border-amber-300 print:bg-amber-50/50">
                          {localeMode === 'he' ? d.hebrewDayHe : `${d.hebrewDay} ${d.hebrewMonthNameEn.slice(0, 3)}`}
                        </span>
                      </div>

                      <div className="space-y-1 mt-1">
                        {d.isRoshChodesh && (
                          <div className="p-1 rounded bg-indigo-500/15 border border-indigo-500/30 text-[9px] font-black text-indigo-700 dark:text-indigo-300 truncate print:border-l-2 print:border-indigo-600 print:text-indigo-950 print:bg-indigo-50/50 print:border-indigo-200 print:pl-1">
                            🌙 {localeMode === 'he' ? d.roshChodeshDetails?.monthNameHe : 'Rosh Chodesh'}
                          </div>
                        )}

                        {d.holidays.map((h, i) => (
                          <div
                            key={i}
                            className={`p-1 rounded text-[9px] font-bold truncate flex items-center gap-1 print:border-l-2 print:text-rose-950 print:bg-rose-50/50 print:pl-1 ${
                              h.category === 'FAST_DAY'
                                ? 'bg-rose-500/20 border border-rose-500/30 text-rose-800 dark:text-rose-300 print:border-rose-500'
                                : 'bg-amber-500/20 border border-amber-500/30 text-amber-900 dark:text-amber-300 print:border-amber-500'
                            }`}
                          >
                            <Flame className="w-2.5 h-2.5 shrink-0 print:hidden" />
                            <span className="truncate">{localeMode === 'he' ? h.nameHe : h.nameEn}</span>
                          </div>
                        ))}

                        {d.isShabbat && d.parashah && (
                          <div className="p-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-bold text-emerald-800 dark:text-emerald-300 truncate flex items-center gap-1 print:border-l-2 print:border-emerald-600 print:text-emerald-950 print:bg-emerald-50/50 print:border-emerald-200 print:pl-1">
                            <BookOpen className="w-2.5 h-2.5 shrink-0 print:hidden" />
                            <span className="truncate">{localeMode === 'he' ? d.parashah.nameHe : d.parashah.nameEn}</span>
                          </div>
                        )}

                        {d.omer && (
                          <div className="text-[9px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-500/10 px-1 py-0.5 rounded truncate print:border-l-2 print:border-purple-600 print:text-purple-950 print:bg-purple-50/50 print:border-purple-200 print:pl-1">
                            Omer Day {d.omer.dayNumber}
                          </div>
                        )}

                        {d.synagogueEvents.length > 0 && (
                          <div className="p-1 rounded bg-blue-500/15 border border-blue-500/30 text-[9px] font-bold text-blue-800 dark:text-blue-300 truncate print:border-l-2 print:border-blue-600 print:text-blue-950 print:bg-blue-50/50 print:border-blue-200 print:pl-1">
                            🕍 {d.synagogueEvents.length} Event{d.synagogueEvents.length > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Day Detail Panel */}
          {selectedDayInfo && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FAF8F3] to-amber-50/40 dark:from-slate-900 dark:to-slate-800 border border-amber-300/60 dark:border-slate-700 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/50 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{localeMode === 'he' ? 'פֵּרוּט הַיּוֹם וּזְמַנֵּי תּוֹרָה' : 'Day Detail & Halachic Framework'}</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedDayInfo.gregorianFormatted} • <span className="text-amber-700 dark:text-amber-400">{localeMode === 'he' ? selectedDayInfo.hebrewDateFormattedHe : selectedDayInfo.hebrewDateFormattedEn}</span>
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {diaspora ? 'Diaspora Schedule' : 'Israel Schedule'}
                  </span>
                </div>
              </div>

              {/* Rosh Chodesh / Holiday / Omer Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedDayInfo.isRoshChodesh && (
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-900 dark:text-indigo-200">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">New Month Announcement</div>
                    <div className="text-base font-bold mt-1">Rosh Chodesh {selectedDayInfo.roshChodeshDetails?.monthNameEn}</div>
                    <div className="text-sm font-serif">{selectedDayInfo.roshChodeshDetails?.monthNameHe}</div>
                  </div>
                )}

                {selectedDayInfo.holidays.map((h, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">{h.category.replace('_', ' ')}</div>
                    <div className="text-base font-bold mt-1">{h.nameEn}</div>
                    <div className="text-sm font-serif">{h.nameHe}</div>
                  </div>
                ))}

                {selectedDayInfo.omer && (
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-950 dark:text-purple-200">
                    <div className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Sefirat HaOmer</div>
                    <div className="text-base font-bold mt-1">Day {selectedDayInfo.omer.dayNumber} ({selectedDayInfo.omer.weeks}w & {selectedDayInfo.omer.days}d)</div>
                    {selectedDayInfo.omer.sefirahEn && (
                      <div className="text-xs text-purple-700 dark:text-purple-300 mt-1 italic">{selectedDayInfo.omer.sefirahEn}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Torah Reading Schedule */}
              {selectedDayInfo.torahReadingSchedule ? (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <h5 className="font-bold text-slate-900 dark:text-white text-base">
                        Parashat {localeMode === 'he' ? selectedDayInfo.torahReadingSchedule.parashahNameHe : selectedDayInfo.torahReadingSchedule.parashahNameEn}
                      </h5>
                    </div>
                    {selectedDayInfo.torahReadingSchedule.haftarah && (
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                        Haftarah: {selectedDayInfo.torahReadingSchedule.haftarah}
                      </span>
                    )}
                  </div>

                  {selectedDayInfo.torahReadingSchedule.summary && (
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {selectedDayInfo.torahReadingSchedule.summary}
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    {selectedDayInfo.torahReadingSchedule.aliyot.map((al, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                        <div className="font-black text-slate-700 dark:text-slate-300">{al.aliyah}</div>
                        <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">{al.verses}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{al.verseCount} verses</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedDayInfo.parashah ? (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Upcoming Shabbat Torah Reading</div>
                      <div className="font-bold text-slate-900 dark:text-white">{localeMode === 'he' ? selectedDayInfo.parashah.nameHe : selectedDayInfo.parashah.nameEn}</div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Community Assemblies & Gatherings */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Synagogue &amp; Community Assemblies</h5>
                {selectedDayInfo.synagogueEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedDayInfo.synagogueEvents.map(ev => (
                      <div key={ev.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{ev.title}</div>
                        {ev.start_time && <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">⏰ {ev.start_time}</div>}
                        {ev.location && <div className="text-xs text-slate-500 mt-0.5">📍 {ev.location}</div>}
                        {ev.description && <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{ev.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 italic flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>No scheduled Community Assemblies or Torah Study Groups for this date. Check synagogue announcements for upcoming gatherings.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Print-Only Legend and Event Directory */}
          <div className="hidden print:block mt-8 pt-6 border-t-2 border-slate-300 page-break-before-avoid">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Month Highlights & Synagogue Assembly Directory
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Holidays & Shabbat Parashiot Column */}
              <div className="space-y-2 border-r border-slate-200 pr-4">
                <h4 className="font-bold text-amber-800">Sacred Days & Weekly Torah Portions</h4>
                <div className="space-y-1.5">
                  {monthlyDays.filter(d => d.holidays.length > 0 || (d.isShabbat && d.parashah)).map((d, i) => (
                    <div key={i} className="flex gap-2 text-[11px]">
                      <span className="font-bold text-slate-700 shrink-0 min-w-[50px]">
                        {d.gregorianDate.split('-')[2]} {currentMonthNameEn.slice(0, 3)}:
                      </span>
                      <div>
                        {d.isShabbat && d.parashah && (
                          <div className="font-semibold text-emerald-800">
                            Shabbat — Parashat {d.parashah.nameEn} ({d.parashah.nameHe})
                          </div>
                        )}
                        {d.holidays.map((h, hi) => (
                          <div key={hi} className="text-amber-900 font-semibold">
                            ★ {h.nameEn} ({h.nameHe}) - {h.category.replace('_', ' ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {monthlyDays.filter(d => d.holidays.length > 0 || (d.isShabbat && d.parashah)).length === 0 && (
                    <div className="text-slate-400 italic">No public holidays or Shabbat portions listed.</div>
                  )}
                </div>
              </div>

              {/* Synagogue Assemblies Column */}
              <div className="space-y-2">
                <h4 className="font-bold text-blue-800">Synagogue Assemblies & Community Events</h4>
                <div className="space-y-2 text-[11px]">
                  {monthlyDays.filter(d => d.synagogueEvents.length > 0).map((d) => (
                    <div key={d.gregorianDate} className="space-y-1">
                      <div className="font-bold text-slate-700">
                        {d.gregorianDate.split('-')[2]} {currentMonthNameEn.slice(0, 3)}:
                      </div>
                      {d.synagogueEvents.map((ev, evi) => (
                        <div key={evi} className="pl-2 border-l-2 border-blue-500">
                          <div className="font-semibold text-slate-900">{ev.title}</div>
                          {ev.start_time && <span className="text-[10px] text-amber-700 font-bold block">Time: {ev.start_time}</span>}
                          {ev.description && <p className="text-[10px] text-slate-600 leading-normal">{ev.description}</p>}
                        </div>
                      ))}
                    </div>
                  ))}
                  {monthlyDays.filter(d => d.synagogueEvents.length > 0).length === 0 && (
                    <div className="text-slate-400 italic">No scheduled community assemblies for this month.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
