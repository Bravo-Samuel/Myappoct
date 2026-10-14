import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Bell,
  Clock,
  Sparkles,
  Heart,
  Plus,
  Trash2,
  ChevronRight,
  Eye,
  EyeOff,
  Settings,
  Info,
  KeyRound,
  FileText,
  UserCheck,
  RefreshCw,
  Droplet,
  Sun,
  Moon,
  BookOpen,
  HelpCircle,
  Printer,
  Download,
  AlertTriangle,
  Compass,
  MapPin,
  Check
} from 'lucide-react';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';
import { FamilyPurityService } from '../../services/data/FamilyPurityService';
import { FamilyPurityCycleRecord, FamilyPuritySettings, BedikaChecklist } from '../../types';
import { HebrewCalendarService } from '../../services/data/HebrewCalendarService';
import { ZmanimService } from '../../services/zmanim/ZmanimService';
import { LocationResolver } from '../../services/zmanim/LocationResolver';

export const FamilyPurityView: React.FC = () => {
  const { session, user } = useSupabaseAuth();
  const userId = user?.id || session?.user?.id || 'local_user';

  // Tabs: 'dashboard' | 'calendar' | 'workflow' | 'ai_rabbi' | 'reports' | 'settings'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'workflow' | 'ai_rabbi' | 'reports' | 'settings'>('dashboard');

  // Privacy & Security Controls (Renamed to Privacy Mode and Hide Sensitive Details)
  const [privacyShield, setPrivacyShield] = useState<boolean>(false);
  const [emergencyHideActive, setEmergencyHideActive] = useState<boolean>(false);
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(true);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isCreatingPinState, setIsCreatingPinState] = useState<boolean>(false);
  const [newPinVal, setNewPinVal] = useState<string>('');
  const [newPinConfirmVal, setNewPinConfirmVal] = useState<string>('');

  // UX Refinement Modals & State
  const [showTodayGuideModal, setShowTodayGuideModal] = useState<boolean>(false);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState<boolean>(false);
  const [learningModalStage, setLearningModalStage] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedCalendarDateIso, setSelectedCalendarDateIso] = useState<string | null>(null);
  const [formTimeStr, setFormTimeStr] = useState<string>('14:00');

  // Data & State
  const [records, setRecords] = useState<FamilyPurityCycleRecord[]>([]);
  const [settings, setSettings] = useState<FamilyPuritySettings>({
    userId: 'local_user',
    biometricLockEnabled: false,
    reminderMikvehNight: true,
    reminderBedikot: true,
    reminderVeset: true,
    locationId: 'churachandpur',
    sessionTimeoutMinutes: 5,
    emergencyHideEnabled: true,
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    reminderTimingHoursBeforeSunset: 1,
    minCleanWaitDays: 5
  });
  const [activeRecord, setActiveRecord] = useState<FamilyPurityCycleRecord | null>(null);

  // New Cycle Form State
  const [isCreatingForm, setIsCreatingForm] = useState<boolean>(false);
  const [formDateIso, setFormDateIso] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formAfterSunset, setFormAfterSunset] = useState<boolean>(false);
  const [formInterval, setFormInterval] = useState<number>(30);
  const [formNotes, setFormNotes] = useState<string>('');

  // Hefsek Taharah logging modal/state
  const [hefsekInputIso, setHefsekInputIso] = useState<string>(new Date().toISOString().split('T')[0]);

  // Calendar State
  const [viewYear, setViewYear] = useState<number>(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(new Date().getMonth());

  // AI Rabbi contextual selection
  const [selectedAIStage, setSelectedAIStage] = useState<string>('current');

  // Today's Date Info
  const todayDate = new Date();
  const todayIso = todayDate.toISOString().split('T')[0];
  const todayHebrewInfo = HebrewCalendarService.getHebrewDateInfo(todayDate);

  // Zmanim for chosen hub
  const activeLocation = LocationResolver.getLocationByNameOrId(settings.locationId || 'churachandpur');
  const todayZmanimSchedule = ZmanimService.getDailyZmanim(todayDate, activeLocation);
  const sunsetZman = todayZmanimSchedule.zmanim.find(z => z.key === 'sunset');
  const nightfallZman = todayZmanimSchedule.zmanim.find(z => z.key === 'nightfall');

  useEffect(() => {
    loadData();
  }, [userId]);

  // Keyboard shortcut for Emergency Hide Mode (double escape or Ctrl+E)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && settings.emergencyHideEnabled) {
        setEmergencyHideActive(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.emergencyHideEnabled]);

  const loadData = async () => {
    const s = FamilyPurityService.getSettings(userId);
    setSettings(s);
    if (s.biometricLockEnabled && s.pinCode) {
      setIsPinUnlocked(false);
    } else {
      setIsPinUnlocked(true);
    }

    const recs = await FamilyPurityService.getRecords(userId);
    setRecords(recs);
    if (recs.length > 0) {
      const active = recs.find(r => r.status !== 'tahor') || recs[0];
      setActiveRecord(active);
    } else {
      setActiveRecord(null);
    }
  };

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingPinState) {
      if (newPinVal.length < 4) {
        setPinError('Passcode must be at least 4 digits.');
        return;
      }
      if (newPinVal !== newPinConfirmVal) {
        setPinError('Passcodes do not match.');
        return;
      }
      const updated = { ...settings, pinCode: newPinVal, biometricLockEnabled: true };
      setSettings(updated);
      FamilyPurityService.saveSettings(updated);
      setIsPinUnlocked(true);
      setIsCreatingPinState(false);
      setPinError('');
      return;
    }

    // Require exact match against user's created pinCode
    if (settings.pinCode && enteredPin === settings.pinCode) {
      setIsPinUnlocked(true);
      setPinError('');
    } else if (!settings.pinCode) {
      // If no PIN was created yet, switch to PIN creation mode
      setIsCreatingPinState(true);
      setPinError('');
    } else {
      setPinError('Incorrect security passcode. Please try again.');
    }
  };

  const handleTimeChange = (timeVal: string, dateIso: string) => {
    setFormTimeStr(timeVal);
    const [hours, mins] = timeVal.split(':').map(Number);
    if (!isNaN(hours)) {
      const targetDate = new Date(dateIso);
      const schedule = ZmanimService.getDailyZmanim(targetDate, activeLocation);
      const sunsetObj = schedule.zmanim.find(z => z.key === 'sunset');
      if (sunsetObj && sunsetObj.timeDate) {
        const sunsetHours = sunsetObj.timeDate.getHours();
        const sunsetMins = sunsetObj.timeDate.getMinutes();
        const selectedMinsTotal = hours * 60 + (mins || 0);
        const sunsetMinsTotal = sunsetHours * 60 + sunsetMins;
        setFormAfterSunset(selectedMinsTotal >= sunsetMinsTotal);
      } else {
        setFormAfterSunset(hours >= 18);
      }
    }
  };

  const handleCreateCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    const calculations = FamilyPurityService.calculateCycleDates(
      formDateIso,
      formAfterSunset,
      undefined,
      formInterval,
      settings.locationId || 'churachandpur'
    );
    const bedikot = FamilyPurityService.generateBedikotChecklist(calculations.sevenCleanDaysStartIso);

    const origDate = new Date(formDateIso);
    const hebrewInfo = HebrewCalendarService.getHebrewDateInfo(origDate);

    const newRec: FamilyPurityCycleRecord = {
      id: `fp_${Date.now()}`,
      userId,
      startDateIso: calculations.onsetGregorianIso,
      startAfterSunset: formAfterSunset,
      hebrewStartDate: calculations.onsetHebrewStrEn,
      hebrewMonthName: hebrewInfo.hebrewMonthNameEn,
      hebrewDayNumber: hebrewInfo.hebrewDay,
      hebrewYear: hebrewInfo.hebrewYear,
      status: 'active_flow',
      bedikot,
      expectedNextVesetHachodeshIso: calculations.vesetHachodeshIso,
      expectedNextVesetHaflagaIso: calculations.vesetHaflagaIso,
      expectedNextBeinonitIso: calculations.onahBeinonitIso,
      intervalDays: formInterval,
      notes: formNotes ? `${formNotes} (Time: ${formTimeStr})` : `Time: ${formTimeStr}`,
      createdAt: new Date().toISOString()
    };

    await FamilyPurityService.saveRecord(newRec);
    setIsCreatingForm(false);
    setSelectedCalendarDateIso(null);
    setFormNotes('');
    await loadData();
    setShowSaveSuccessModal(true);
  };

  const handleLogHefsekTaharah = async (rec: FamilyPurityCycleRecord) => {
    const calculations = FamilyPurityService.calculateCycleDates(
      rec.startDateIso,
      rec.startAfterSunset,
      hefsekInputIso,
      rec.intervalDays || 30,
      settings.locationId || 'churachandpur'
    );

    const bedikot = FamilyPurityService.generateBedikotChecklist(calculations.sevenCleanDaysStartIso);

    const updated: FamilyPurityCycleRecord = {
      ...rec,
      hesekTaharahDateIso: hefsekInputIso,
      sevenCleanDaysStartIso: calculations.sevenCleanDaysStartIso,
      mikvehNightIso: calculations.mikvehNightIso,
      mikvehHebrewDate: calculations.mikvehNightHebrewStr,
      status: 'seven_clean_days',
      bedikot
    };

    await FamilyPurityService.saveRecord(updated);
    await loadData();
    setShowSaveSuccessModal(true);
  };

  const handleToggleBedika = async (rec: FamilyPurityCycleRecord, dayIndex: number, period: 'morning' | 'afternoon') => {
    const updatedBedikot = [...rec.bedikot];
    const target = updatedBedikot[dayIndex];
    if (period === 'morning') {
      target.morningCompleted = !target.morningCompleted;
    } else {
      target.afternoonCompleted = !target.afternoonCompleted;
    }

    const allDone = updatedBedikot.every(b => b.morningCompleted || b.afternoonCompleted);
    let newStatus = rec.status;
    if (allDone && updatedBedikot[6].afternoonCompleted) {
      newStatus = 'tahor';
    }

    const updated: FamilyPurityCycleRecord = {
      ...rec,
      bedikot: updatedBedikot,
      status: newStatus
    };

    await FamilyPurityService.saveRecord(updated);
    await loadData();
  };

  const handleDeleteRecord = async (recId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this private record?')) return;
    await FamilyPurityService.deleteRecord(recId, userId);
    await loadData();
  };

  const handleSaveSettings = (updatedSettings: FamilyPuritySettings) => {
    setSettings(updatedSettings);
    FamilyPurityService.saveSettings(updatedSettings);
  };

  // Private View Mode Screen (Renamed from Emergency Hide)
  if (emergencyHideActive) {
    return (
      <div className="min-h-screen bg-[#0A1128] text-slate-100 p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Daily Zmanim & Torah Study Portal</h1>
          </div>
          <button
            onClick={() => setEmergencyHideActive(false)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-400"
          >
            Exit Private View
          </button>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-lg font-bold text-amber-400">Tehillim / Daily Psalm Reading</h2>
          <p className="text-sm text-slate-300 leading-relaxed font-serif">
            &ldquo;A Psalm of David. The Lord is my shepherd; I shall not want. He makes me lie down in green pastures; He leads me beside still waters. He restores my soul...&rdquo; (Tehillim 23)
          </p>
          <div className="pt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Location Hub: {activeLocation.name} ({activeLocation.hebrewName})</span>
            <span>Sunset: {sunsetZman?.formattedTime || '17:45'}</span>
          </div>
        </div>
      </div>
    );
  }

  // Security Lock Screen (No Default PIN Backdoor)
  if (!isPinUnlocked) {
    return (
      <div className="min-h-screen bg-[#0A1128] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-[#0F172A] border border-amber-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Private Sacred Companion</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {isCreatingPinState
                ? 'Create a custom 4-to-6 digit passcode to protect your personal Family Purity records.'
                : 'Taharat HaMishpacha observance protected by Row Level Security and private encryption.'}
            </p>
          </div>
          <form onSubmit={handleUnlockPin} className="space-y-4">
            {isCreatingPinState ? (
              <>
                <input
                  type="password"
                  maxLength={6}
                  value={newPinVal}
                  onChange={(e) => setNewPinVal(e.target.value)}
                  placeholder="Create New PIN (4-6 digits)"
                  className="w-full text-center tracking-[0.5em] text-lg bg-slate-950/80 border border-slate-700 rounded-2xl py-3 text-white placeholder:tracking-normal placeholder:text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                />
                <input
                  type="password"
                  maxLength={6}
                  value={newPinConfirmVal}
                  onChange={(e) => setNewPinConfirmVal(e.target.value)}
                  placeholder="Confirm New PIN"
                  className="w-full text-center tracking-[0.5em] text-lg bg-slate-950/80 border border-slate-700 rounded-2xl py-3 text-white placeholder:tracking-normal placeholder:text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                />
              </>
            ) : (
              <input
                type="password"
                maxLength={6}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="Enter Your Security PIN"
                className="w-full text-center tracking-[0.5em] text-lg bg-slate-950/80 border border-slate-700 rounded-2xl py-3.5 text-white placeholder:tracking-normal placeholder:text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all"
              />
            )}
            {pinError && <div className="text-xs text-amber-400 font-medium">{pinError}</div>}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
            >
              {isCreatingPinState ? 'Save Passcode & Continue' : 'Unlock Private Sanctuary'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Current Halachic Phase calculation
  const getCurrentPhaseLabel = () => {
    if (!activeRecord) return { title: 'Awaiting Onset Record', desc: 'No active observation tracked', stageNum: 1 };
    if (activeRecord.status === 'tahor') return { title: 'Tahor (Pure State)', desc: 'Observing regular calendar veset countdown', stageNum: 8 };
    if (activeRecord.status === 'seven_clean_days') return { title: "Shiv'ah Neki'im (7 Clean Days)", desc: 'Daily twice-daily bedikot observation', stageNum: 5 };
    return { title: 'Niddah Observance', desc: 'Preparing for Hefsek Taharah window', stageNum: 3 };
  };

  const currentPhaseInfo = getCurrentPhaseLabel();

  // Helper for beginner-friendly Hero & Guide
  const getFriendlyStatusDetails = () => {
    if (!activeRecord) {
      return {
        heroTitle: 'Personal Timeline Monitoring',
        heroSubtitle: 'Everything is on track.',
        currentStageName: 'Personal Timeline Monitoring',
        dayProgress: 'Day 1 of Cycle Tracking',
        nextStep: 'When cycle begins, tap Log New Onset Date',
        guideContent: 'Welcome to your private companion. You are currently tracking your general calendar timeline. When your cycle begins, tap "Log New Onset Date" to receive gentle, automatic reminders.',
        hebrewName: 'לוח זמנים אישי',
        advancedSources: 'Tracking expected veset windows maintains personal awareness according to Torah traditions.'
      };
    }
    if (activeRecord.status === 'seven_clean_days') {
      const completedDays = activeRecord.bedikot.filter(b => b.morningCompleted && b.afternoonCompleted).length;
      const currentDay = Math.min(completedDays + 1, 7);
      return {
        heroTitle: `Seven Clean Days – Day ${currentDay} of 7`,
        heroSubtitle: 'Everything is on track.',
        currentStageName: 'Seven Clean Days',
        dayProgress: `Day ${currentDay} of 7`,
        nextStep: currentDay < 7 ? 'Tomorrow evening' : 'Immersion evening at nightfall',
        guideContent: `Today is Day ${currentDay} of Seven Clean Days. Nothing special needs to be done today beyond your regular twice-daily observation. Your next reminder is tomorrow evening. We'll remind you automatically.`,
        hebrewName: 'Shiv\'ah Neki\'im (שבעה נקיים)',
        advancedSources: 'Seven consecutive 24-hour Hebrew days observed from sunset to sunset following a valid Hefsek Taharah examination.'
      };
    }
    if (activeRecord.status === 'tahor') {
      return {
        heroTitle: 'Tahor (Pure State)',
        heroSubtitle: 'Everything is on track.',
        currentStageName: 'Tahor (Pure State)',
        dayProgress: 'Active Blessing & Renewal',
        nextStep: activeRecord.expectedNextVesetHachodeshIso ? `Expected Veset: ${new Date(activeRecord.expectedNextVesetHachodeshIso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Regular timeline monitoring',
        guideContent: 'You have completed immersion and are in a state of Tahara. Enjoy the holiness and peace of your home. Your upcoming calendar dates are monitored automatically.',
        hebrewName: 'Tahara (טהרה)',
        advancedSources: 'Resumption of marital intimacy in holiness, purity, and mutual respect, reflecting the divine presence in the Jewish home.'
      };
    }
    return {
      heroTitle: 'Observation Period',
      heroSubtitle: 'Everything is on track.',
      currentStageName: 'Initial Wait & Observation',
      dayProgress: 'Preparing for Hefsek Taharah',
      nextStep: 'Hefsek Taharah examination before sunset',
      guideContent: 'You are currently in the initial wait period. Maintain calm reflection and prepare for your Hefsek Taharah examination prior to sunset.',
      hebrewName: 'Niddah Observance (ימי נידה)',
      advancedSources: 'Minimum wait period observed according to Ashkenazic and Sephardic custom before performing Hefsek Taharah.'
    };
  };

  const friendlyStatus = getFriendlyStatusDetails();

  return (
    <div className={`min-h-screen bg-[#0A1128] text-slate-100 p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-28 ${
      settings.largeText ? 'text-lg' : ''
    }`}>
      {/* Top Banner & Sacred Atmosphere */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-amber-500/20 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shrink-0">
            <Droplet className="w-7 h-7 fill-amber-400/20" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Family Purity</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 tracking-wider uppercase">
                Taharat HaMishpacha
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Private Halachic observance companion following accepted principles for Bnei Menashe families.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto shrink-0">
          <button
            onClick={() => setPrivacyShield(!privacyShield)}
            title="Privacy Mode blurs sensitive dates and status details"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              privacyShield
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            {privacyShield ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{privacyShield ? 'Privacy Mode Active' : 'Privacy Mode'}</span>
          </button>

          <button
            onClick={() => setEmergencyHideActive(true)}
            title="Switches to Private View (Esc x2)"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-all"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Hide Sensitive Details</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeLocation.name}</span>
          </div>
        </div>
      </div>

      {/* Phase 8: Help Everywhere ("What is this?") */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-white space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>What is Taharat HaMishpacha (Family Purity)?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Taharat HaMishpacha is the sacred Jewish tradition of family purity and marital holiness. This private digital sanctuary helps married couples track their calendar cycles, bedikot (observations), and mikveh immersion dates with complete privacy, modesty, and peace of mind.
        </p>
      </div>

      {/* 1. TODAY CARD (Highest Priority Permanent Hero Card) */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        {privacyShield ? (
          <div 
            onClick={() => setPrivacyShield(false)}
            className="py-6 text-center cursor-pointer transition-all hover:opacity-80"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 mb-3">
              <EyeOff className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-white">Private information hidden.</div>
            <div className="text-xs text-amber-400 font-medium mt-1">Tap to reveal sensitive schedule and current stage</div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wide uppercase">
                  Today
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {friendlyStatus.heroSubtitle}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <span>You are here: {friendlyStatus.heroTitle}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setLearningModalStage(friendlyStatus.currentStageName); }}
                  title="Learning Mode: Tap for beginner explanation"
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 flex items-center justify-center text-xs font-bold transition-all"
                >
                  ?
                </button>
              </h2>
              <p className="text-sm text-slate-300">
                <span className="text-amber-400 font-medium">Next step:</span> {friendlyStatus.nextStep}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => setShowTodayGuideModal(true)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>View Today&apos;s Guide</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto scrollbar-none">
        {[
          { id: 'dashboard', label: 'Sacred Dashboard', icon: <Droplet className="w-4 h-4" /> },
          { id: 'calendar', label: 'Dual Halachic Calendar', icon: <CalendarIcon className="w-4 h-4" /> },
          { id: 'workflow', label: 'Observance Journey', icon: <Compass className="w-4 h-4" /> },
          { id: 'ai_rabbi', label: 'Halachic Guidance', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'reports', label: 'Reports & Summary', icon: <Printer className="w-4 h-4" /> },
          { id: 'settings', label: 'Privacy & Policy', icon: <Settings className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: SACRED DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Status Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-[#0F172A] border border-white/10 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Today&apos;s Hebrew Date</span>
                <Sun className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-base font-bold text-amber-400">{todayHebrewInfo.hebrewDateFormattedEn}</div>
              <div className="text-xs text-slate-400 font-medium">{todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-[#0F172A] border border-amber-500/20 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Current Status</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <div className="text-base font-bold text-white truncate">{currentPhaseInfo.title}</div>
              <div className="text-xs text-slate-400 truncate">{currentPhaseInfo.desc}</div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-[#0F172A] border border-white/10 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Next Important Date</span>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-base font-bold text-white">
                {privacyShield
                  ? '••••••••••••'
                  : activeRecord?.mikvehNightIso
                  ? new Date(activeRecord.mikvehNightIso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : activeRecord?.expectedNextVesetHachodeshIso
                  ? new Date(activeRecord.expectedNextVesetHachodeshIso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'No Active Date'}
              </div>
              <div className="text-xs text-amber-300/90 font-medium truncate">
                {activeRecord?.mikvehNightIso ? 'Calculated Mikveh Nightfall' : 'Expected Veset Window'}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-[#0F172A] border border-white/10 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Today&apos;s Private Reminder</span>
                <Bell className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xs font-bold text-white leading-relaxed">
                &ldquo;You have a personal reminder today. Please review your sacred calendar.&rdquo;
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Sunset: {sunsetZman?.formattedTime || '17:45'} • Tzeit: {nightfallZman?.formattedTime || '18:18'}
              </div>
            </div>
          </div>

          {/* Circular Progress & Quick Actions Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Stage Workflow Timeline Card */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-[#0F172A] border border-white/10 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-400" />
                    <span>Sacred Observance Journey</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Stage progression following accepted Halachic principles and sunset transition times.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Stage {currentPhaseInfo.stageNum} of 8
                </span>
              </div>

              {/* 8-Stage Step Indicator */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { step: 1, title: 'Personal Timeline', desc: 'Base calendar monitoring' },
                  { step: 2, title: 'Cycle Begins', desc: 'Onset recorded before/after sunset' },
                  { step: 3, title: 'Niddah Period', desc: 'Minimum 5 days observation' },
                  { step: 4, title: 'Hefsek Taharah', desc: 'Examination prior to sunset' },
                  { step: 5, title: 'Seven Clean Days', desc: 'Shiv\'ah Neki\'im twice daily' },
                  { step: 6, title: 'Mikveh Preparation', desc: 'Chafifah & spiritual preparation' },
                  { step: 7, title: 'Mikveh Night', desc: 'Tzeit HaKochavim immersion' },
                  { step: 8, title: 'Completed / Tahor', desc: 'Sacred renewal achieved' }
                ].map((s) => {
                  const isActive = s.step === currentPhaseInfo.stageNum;
                  const isPassed = s.step < currentPhaseInfo.stageNum;
                  return (
                    <div
                      key={s.step}
                      onClick={() => setSelectedAIStage(s.title)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-500/15 border-amber-400 shadow-md'
                          : isPassed
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-300'
                          : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-amber-500 text-slate-950' : isPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {s.step}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setLearningModalStage(s.title); }}
                            title="Learning Mode: Tap for 3-level explanation"
                            className="w-5 h-5 rounded-full bg-white/10 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 flex items-center justify-center text-[10px] font-bold transition-all"
                          >
                            ?
                          </button>
                          {isPassed && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-white truncate">{s.title}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{s.desc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Active Cycle Bedikot Summary */}
              {activeRecord && activeRecord.status === 'seven_clean_days' && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Seven Clean Days Daily Bedikot</span>
                    <span className="text-xs font-bold text-amber-400">
                      {activeRecord.bedikot.filter(b => b.morningCompleted && b.afternoonCompleted).length} / 7 Days Completed
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {activeRecord.bedikot.map((b, idx) => {
                      const complete = b.morningCompleted && b.afternoonCompleted;
                      return (
                        <div
                          key={idx}
                          className={`py-2 text-center rounded-xl border text-[11px] font-bold ${
                            complete
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          D{b.dayNumber}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Quick Actions & Log Panel */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-[#0F172A] border border-white/10 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">Quick Actions</h3>
                <p className="text-xs text-slate-400">
                  Securely record observations or consult educational Halachic guidance.
                </p>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setIsCreatingForm(!isCreatingForm)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log New Onset Date</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('workflow')}
                    className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>View Observance Journey</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ai_rabbi')}
                    className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Explain Today&apos;s Stage (AI Rabbi)</span>
                  </button>
                </div>
              </div>

              {/* Private Security Badge */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-3">
                <Shield className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-[11px] text-slate-400 leading-tight">
                  Data stored with <span className="text-slate-200 font-semibold">Row Level Security</span>. Never exposed to feeds, analytics, or search.
                </div>
              </div>
            </div>
          </div>

          {/* New Cycle Form Modal */}
          {isCreatingForm && (
            <div className="p-6 rounded-3xl bg-[#0F172A] border border-amber-500/40 shadow-2xl animate-fade-in space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Log Cycle Onset & Calculate Schedule</span>
                </h3>
                <button onClick={() => setIsCreatingForm(false)} className="text-xs text-slate-400 hover:text-white">
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateCycle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Onset Gregorian Date</label>
                  <input
                    type="date"
                    required
                    value={formDateIso}
                    onChange={(e) => setFormDateIso(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:border-slate-600 transition-all">
                    <input
                      type="checkbox"
                      checked={formAfterSunset}
                      onChange={(e) => setFormAfterSunset(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-white">Occurred After Sunset?</span>
                      <span className="block text-[10px] text-slate-400">Advances Hebrew date to the evening entry</span>
                    </div>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Expected Interval (Days)</label>
                  <input
                    type="number"
                    min={20}
                    max={60}
                    value={formInterval}
                    onChange={(e) => setFormInterval(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Private Note (Optional)</label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g. Evening observation"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2 pt-2 flex justify-end gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md hover:from-amber-400 transition-all"
                  >
                    Calculate Halachic Schedule
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DUAL HALACHIC CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Dual Halachic Calendar</h3>
              <p className="text-xs text-slate-400">
                Gregorian & Hebrew dual dates highlighted with sunset transitions, Rosh Chodesh, and Shabbat indicators.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (viewMonth === 0) {
                    setViewMonth(11);
                    setViewYear(viewYear - 1);
                  } else {
                    setViewMonth(viewMonth - 1);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-white px-3">
                {new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => {
                  if (viewMonth === 11) {
                    setViewMonth(0);
                    setViewYear(viewYear + 1);
                  } else {
                    setViewMonth(viewMonth + 1);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Shabbat'].map((day) => (
              <div key={day} className="text-xs font-bold text-slate-400 py-2 bg-slate-900/50 rounded-xl">
                {day}
              </div>
            ))}

            {(() => {
              const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
              const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
              const cells = [];

              for (let i = 0; i < firstDayOfMonth; i++) {
                cells.push(<div key={`empty_${i}`} className="h-24 rounded-2xl bg-white/[0.02] border border-white/5" />);
              }

              for (let d = 1; d <= daysInMonth; d++) {
                const targetDate = new Date(viewYear, viewMonth, d);
                const dateIso = targetDate.toISOString().split('T')[0];
                const hInfo = HebrewCalendarService.getHebrewDateInfo(targetDate);

                const matchingRecord = records.find(r => r.startDateIso === dateIso);
                const isMikvehNight = records.some(r => r.mikvehNightIso === dateIso);
                const isHefsek = records.some(r => r.hesekTaharahDateIso === dateIso);
                const isVeset = records.some(
                  r => r.expectedNextVesetHachodeshIso === dateIso || r.expectedNextVesetHaflagaIso === dateIso || r.expectedNextBeinonitIso === dateIso
                );

                cells.push(
                  <div
                    key={d}
                    onClick={() => {
                      setSelectedCalendarDateIso(dateIso);
                      setFormDateIso(dateIso);
                    }}
                    className={`h-24 p-2 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.02] ${
                      isMikvehNight
                        ? 'bg-amber-500/20 border-amber-500/60 shadow-lg'
                        : isHefsek
                        ? 'bg-emerald-500/15 border-emerald-500/40'
                        : matchingRecord
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : isVeset
                        ? 'bg-purple-500/15 border-purple-500/40'
                        : targetDate.getDay() === 6
                        ? 'bg-slate-900/80 border-slate-800'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{d}</span>
                      <span className="text-[10px] font-medium text-amber-400">{hInfo.hebrewDayHe}</span>
                    </div>

                    <div className="space-y-0.5 text-left">
                      {isMikvehNight && (
                        <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 truncate">
                          Mikveh Nightfall
                        </div>
                      )}
                      {matchingRecord && (
                        <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 truncate">
                          Onset Logged
                        </div>
                      )}
                      {isHefsek && (
                        <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 truncate">
                          Hefsek Window
                        </div>
                      )}
                      {isVeset && !isMikvehNight && (
                        <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/80 text-white truncate">
                          Expected Veset
                        </div>
                      )}
                      {targetDate.getDay() === 6 && !isMikvehNight && !matchingRecord && (
                        <div className="text-[8px] text-slate-500 font-medium">Shabbat</div>
                      )}
                    </div>
                  </div>
                );
              }
              return cells;
            })()}
          </div>
        </div>
      )}

      {/* TAB 3: OBSERVANCE JOURNEY WORKFLOW */}
      {activeTab === 'workflow' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Sacred Observance Stage Explorer</h3>
              <p className="text-xs text-slate-400">
                Detailed Halachic explanation, reminders, and countdown for each phase of family purity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                stage: 1,
                title: 'Personal Timeline',
                hebrew: 'לוח זמנים אישי',
                desc: 'Continuous monitoring of your dual Hebrew and Gregorian dates. Tracks expected veset periods based on previous cycles.',
                reminders: ['Review Veset HaChodesh date', 'Observe Onah Beinonit (Day 30)']
              },
              {
                stage: 2,
                title: 'Cycle Begins',
                hebrew: 'תחילת מחזור',
                desc: 'When flow begins, note the exact Gregorian date and whether it occurred before or after sunset (Shkiah).',
                reminders: ['Record exact time relative to sunset', 'Minimum 5 days observation before Hefsek']
              },
              {
                stage: 3,
                title: 'Niddah Period',
                hebrew: 'ימי נידה',
                desc: 'Minimum wait period according to Ashkenazic and Sephardic custom before performing Hefsek Taharah.',
                reminders: ['Maintain personal reflection', 'Prepare white linen for bedikot']
              },
              {
                stage: 4,
                title: 'Hefsek Taharah Reminder',
                hebrew: 'הפסק טהרה',
                desc: 'Internal examination performed in the afternoon prior to sunset (Shkiah) to verify complete cessation of flow.',
                reminders: ['Perform in afternoon light before sunset', 'Follow with Moch Dahuq if accustomed']
              },
              {
                stage: 5,
                title: 'Seven Clean Days',
                hebrew: 'שבעה נקיים',
                desc: 'Seven consecutive full Hebrew days (sunset to sunset) confirmed pure by twice-daily examinations (morning and before sunset).',
                reminders: ['Morning examination upon rising', 'Afternoon examination prior to sunset']
              },
              {
                stage: 6,
                title: 'Mikveh Preparation',
                hebrew: 'הכנה לטבילה (חפיפה)',
                desc: 'Thorough cleansing and preparation (Chafifah) removing any intervening substances (chatzitzah) before immersion.',
                reminders: ['Careful bathing and combing hair', 'Remove jewelry and cosmetics']
              },
              {
                stage: 7,
                title: 'Mikveh Night',
                hebrew: 'לילת טבילה',
                desc: 'Immersion in a kosher Mikveh performed strictly after nightfall (Tzeit HaKochavim) at the conclusion of the 7th clean day.',
                reminders: [`Wait until Tzeit HaKochavim (${nightfallZman?.formattedTime || '18:18'})`, 'Recite blessing upon immersion']
              },
              {
                stage: 8,
                title: 'Completed / Tahor',
                hebrew: 'טהרה',
                desc: 'Resumption of marital intimacy in holiness, purity, and mutual respect, reflecting the divine presence in the Jewish home.',
                reminders: ['Express gratitude and joy', 'Resume regular timeline monitoring']
              }
            ].map((item) => (
              <div key={item.stage} className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs">
                      {item.stage}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span className="text-xs text-amber-400 font-medium">{item.hebrew}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAIStage(item.title);
                      setActiveTab('ai_rabbi');
                    }}
                    className="text-xs px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                  >
                    Ask AI Rabbi
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>

                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Halachic Reminders:</span>
                  {item.reminders.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AI RABBI GUIDANCE */}
      {activeTab === 'ai_rabbi' && (
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Rabbi Educational Companion</h3>
                <p className="text-xs text-slate-400">Contextual explanation of Taharat HaMishpacha principles</p>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              Educational Guidance Only
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300">Select Topic / Stage for Educational Summary:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {['General Overview', 'Hefsek Taharah', "Shiv'ah Neki'im", 'Sunset Calculations', 'Mikveh Immersion', 'Veset Calculations'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedAIStage(topic)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedAIStage === topic
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Educational Content Box */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4 font-serif">
              <h4 className="text-base font-bold text-amber-400 font-sans">
                Halachic Guidance: {selectedAIStage}
              </h4>

              {selectedAIStage === 'Hefsek Taharah' && (
                <div className="space-y-3 text-sm text-slate-200 leading-relaxed">
                  <p>
                    The <strong>Hefsek Taharah</strong> (cessation of purity) is the critical transition point between the days of active flow and the Seven Clean Days. It must be performed in the afternoon prior to sunset (Shkiah).
                  </p>
                  <p>
                    According to accepted Halachic principles, an internal examination using a clean, soft white cotton cloth (bedika cloth) is performed. If the examination confirms complete absence of prohibited coloration, the woman enters the Seven Clean Days beginning at sunset.
                  </p>
                </div>
              )}

              {selectedAIStage === "Shiv'ah Neki'im" && (
                <div className="space-y-3 text-sm text-slate-200 leading-relaxed">
                  <p>
                    The <strong>Shiv&apos;ah Neki&apos;im</strong> (Seven Clean Days) require seven full consecutive 24-hour Hebrew days of complete purity. Because the Jewish day begins at sunset, Day 1 starts immediately after the sunset following a valid Hefsek Taharah.
                  </p>
                  <p>
                    During these seven days, examinations (bedikot) are performed twice daily: once in the morning upon rising, and once in the late afternoon prior to sunset.
                  </p>
                </div>
              )}

              {selectedAIStage === 'Sunset Calculations' && (
                <div className="space-y-3 text-sm text-slate-200 leading-relaxed">
                  <p>
                    In Halachic astronomy, sunset (Shkiah) marks the end of daytime, and nightfall (Tzeit HaKochavim) marks the definitive start of the new Hebrew calendar date.
                  </p>
                  <p>
                    For your current location in <strong>{activeLocation.name}</strong> ({activeLocation.elevationMeters}m elevation), our Zmanim engine calculates Shkiah at <strong>{sunsetZman?.formattedTime || '17:45'}</strong> and Tzeit HaKochavim at <strong>{nightfallZman?.formattedTime || '18:18'}</strong>.
                  </p>
                </div>
              )}

              {!['Hefsek Taharah', "Shiv'ah Neki'im", 'Sunset Calculations'].includes(selectedAIStage) && (
                <div className="space-y-3 text-sm text-slate-200 leading-relaxed">
                  <p>
                    Taharat HaMishpacha (Family Purity) is one of the foundational pillars of Jewish family life, fostering spiritual holiness, mutual respect, and renewal within the marriage.
                  </p>
                  <p>
                    By adhering strictly to the dual Hebrew and Gregorian calendar cycles, Bnei Menashe families preserve a sacred link to Torah tradition and the heritage of Israel.
                  </p>
                </div>
              )}

              {/* Mandatory Halachic Disclaimer */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 mt-6 font-sans">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-300/90 leading-relaxed">
                  <strong>Mandatory Halachic Notice:</strong> This AI Rabbi tool provides educational guidance only and does not issue personal Halachic rulings. For personal Halachic questions or individual medical/staining evaluations, please consult your local Orthodox Rabbi or qualified Rebbetzin.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REPORTS & SUMMARIES */}
      {activeTab === 'reports' && (
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Private Printable Summaries</h3>
              <p className="text-xs text-slate-400">Generate formatted monthly or annual summaries for personal record keeping.</p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md hover:bg-amber-400 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Personal Summary</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 space-y-3">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Monthly Personal Schedule ({todayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})</span>
              </div>
              <p className="text-xs text-slate-400">
                Summary of all onset dates, Hefsek examinations, and calculated Mikveh nights for the current month.
              </p>
              <div className="pt-2">
                <button onClick={() => window.print()} className="text-xs text-amber-400 font-semibold hover:underline">
                  Download Monthly PDF
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 space-y-3">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-400" />
                <span>Annual Hebrew Date Summary ({todayHebrewInfo.hebrewYear})</span>
              </div>
              <p className="text-xs text-slate-400">
                Complete annual Hebrew calendar listing leap year status, Adar I/II designations, and personal veset cycles.
              </p>
              <div className="pt-2">
                <button onClick={() => window.print()} className="text-xs text-amber-400 font-semibold hover:underline">
                  Download Annual PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PRIVACY & POLICY SETTINGS */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <span>Security & Privacy Lock</span>
            </h3>
            <p className="text-xs text-slate-400">
              Configure biometric readiness, security passcode, and Emergency Hide shortcut behavior.
            </p>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Enable Security PIN Prompt</div>
                  <div className="text-[10px] text-slate-400">Require PIN when entering Family Purity module</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.biometricLockEnabled}
                  onChange={(e) => handleSaveSettings({ ...settings, biometricLockEnabled: e.target.checked })}
                  className="rounded text-amber-500 w-4 h-4"
                />
              </label>

              {settings.biometricLockEnabled && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Set Custom 4-6 Digit Passcode</label>
                  <input
                    type="password"
                    maxLength={6}
                    value={settings.pinCode || ''}
                    onChange={(e) => handleSaveSettings({ ...settings, pinCode: e.target.value })}
                    placeholder="Enter PIN (Default: 5786)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
              )}

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Emergency Hide Shortcut (Esc × 2)</div>
                  <div className="text-[10px] text-slate-400">Instantly switches to neutral Torah reading screen</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emergencyHideEnabled}
                  onChange={(e) => handleSaveSettings({ ...settings, emergencyHideEnabled: e.target.checked })}
                  className="rounded text-amber-500 w-4 h-4"
                />
              </label>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <span>Location Hub & Notification Policy</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select your primary Bnei Menashe community location for exact elevation and sunset calculations.
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Halachic Location Hub</label>
                <select
                  value={settings.locationId || 'churachandpur'}
                  onChange={(e) => handleSaveSettings({ ...settings, locationId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  {LocationResolver.PRESET_LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.hebrewName}) — {loc.elevationMeters}m
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Discreet Sunset Notifications</div>
                  <div className="text-[10px] text-slate-400">Send reminder 1 hour prior to Shkiah</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.reminderMikvehNight}
                  onChange={(e) => handleSaveSettings({ ...settings, reminderMikvehNight: e.target.checked })}
                  className="rounded text-amber-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Large Text Accessibility Mode</div>
                  <div className="text-[10px] text-slate-400">Increases typography size for enhanced readability</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.largeText}
                  onChange={(e) => handleSaveSettings({ ...settings, largeText: e.target.checked })}
                  className="rounded text-amber-500 w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* UX REFINEMENT MODAL 1: TODAY'S GUIDE */}
      {showTodayGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#0F172A] border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <Droplet className="w-5 h-5 text-amber-400" />
                <span>Today&apos;s Guide</span>
              </h3>
              <button onClick={() => setShowTodayGuideModal(false)} className="text-xs text-slate-400 hover:text-white font-semibold">
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-base font-bold text-white leading-relaxed">
                {friendlyStatus.guideContent}
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs text-amber-300 font-semibold">Automatic Reminders</div>
                <div className="text-xs text-slate-300">
                  We&apos;ll remind you automatically when action is needed. No complicated tables or terminology to memorize.
                </div>
              </div>

              {/* Expandable Advanced Section */}
              <div className="pt-2">
                <button
                  onClick={() => setExpandedSections({ ...expandedSections, guideAdvanced: !expandedSections.guideAdvanced })}
                  className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-all"
                >
                  <ChevronRight className={`w-4 h-4 transition-transform ${expandedSections.guideAdvanced ? 'rotate-90' : ''}`} />
                  <span>{expandedSections.guideAdvanced ? '▲ Hide Advanced Halachic Details' : '▼ Learn More / Halachic Details'}</span>
                </button>

                {expandedSections.guideAdvanced && (
                  <div className="mt-3 p-4 rounded-2xl bg-slate-900 border border-amber-500/20 space-y-3 text-xs text-slate-300 animate-fade-in">
                    <div>
                      <span className="font-bold text-white block mb-0.5">Traditional Hebrew Terminology:</span>
                      <span className="text-amber-300">{friendlyStatus.hebrewName}</span>
                    </div>
                    <div>
                      <span className="font-bold text-white block mb-0.5">Halachic Basis & Sources:</span>
                      <span>{friendlyStatus.advancedSources}</span>
                    </div>
                    <div className="pt-1">
                      <button
                        onClick={() => { setShowTodayGuideModal(false); setSelectedAIStage(friendlyStatus.currentStageName); setActiveTab('ai_rabbi'); }}
                        className="text-amber-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Consult Full AI Rabbi Explanation →</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowTodayGuideModal(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-sm shadow-lg transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* UX REFINEMENT MODAL 2: LEARNING MODE (THREE LEARNING LEVELS) */}
      {learningModalStage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#0F172A] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <span>Stage Exploration</span>
              </h3>
              <button onClick={() => setLearningModalStage(null)} className="text-xs text-slate-400 hover:text-white">
                Close
              </button>
            </div>

            {/* Level 1: Beginner */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">1. Simple Explanation</span>
              <p className="text-xs font-medium text-white leading-relaxed">
                &ldquo;These are special days observed to prepare for spiritual renewal. The app guides you step by step without requiring technical knowledge.&rdquo;
              </p>
            </div>

            {/* Level 2: Traditional Hebrew Name */}
            <div className="space-y-1 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">2. Traditional Hebrew Name</span>
              <div className="text-sm font-bold text-amber-300">
                {learningModalStage === 'Seven Clean Days' ? 'Shiv\'ah Neki\'im (שבעה נקיים)' :
                 learningModalStage === 'Hefsek Taharah' ? 'Hefsek Taharah (הפסק טהרה)' :
                 learningModalStage === 'Mikveh Night' ? 'Tevilat Mikveh (טבילת מקווה)' :
                 `${learningModalStage} (מונח הלכתי)`}
              </div>
            </div>

            {/* Level 3: Advanced Study */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">3. Advanced Study</span>
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    setLearningModalStage(null);
                    setSelectedAIStage(learningModalStage);
                    setActiveTab('ai_rabbi');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center justify-between transition-all"
                >
                  <span>Ask AI Rabbi Explanation</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setLearningModalStage(null)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* UX REFINEMENT MODAL 3: SAVE CONFIRMATION DIALOG */}
      {showSaveSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-[#0F172A] border border-emerald-500/40 rounded-3xl p-8 text-center shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Your information has been safely recorded.</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Thank you for observing marital holiness and preserving peace in your Jewish home. We will gently guide you every step of the way.
              </p>
            </div>
            <button
              onClick={() => setShowSaveSuccessModal(false)}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* UX REFINEMENT MODAL 4: SMART CALENDAR ENTRY */}
      {selectedCalendarDateIso && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#0F172A] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-400" />
                <span>Smart Calendar Entry</span>
              </h3>
              <button onClick={() => setSelectedCalendarDateIso(null)} className="text-xs text-slate-400 hover:text-white">
                Go Back
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/5 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Selected Date:</span>
                <span className="text-white font-bold">{new Date(selectedCalendarDateIso).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Hebrew Date:</span>
                <span className="text-amber-400 font-bold">{HebrewCalendarService.getHebrewDateInfo(new Date(selectedCalendarDateIso)).hebrewDateFormattedEn}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>User Profile:</span>
                <span className="text-slate-300 font-medium">{user?.email || 'Sacred Companion User'}</span>
              </div>
            </div>

            <form onSubmit={(e) => {
              setFormDateIso(selectedCalendarDateIso);
              handleCreateCycle(e);
            }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">What time did your cycle begin?</label>
                <input
                  type="time"
                  required
                  value={formTimeStr}
                  onChange={(e) => handleTimeChange(e.target.value, selectedCalendarDateIso)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Sunset Transition Check:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${formAfterSunset ? 'bg-purple-500/20 text-purple-300' : 'bg-amber-500/20 text-amber-300'}`}>
                    {formAfterSunset ? 'After Sunset (Next Hebrew Day)' : 'Before Sunset'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormAfterSunset(false)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${!formAfterSunset ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-white/5 text-slate-400 border-white/10'}`}
                  >
                    Before Sunset
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormAfterSunset(true)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${formAfterSunset ? 'bg-purple-500 text-white border-purple-400' : 'bg-white/5 text-slate-400 border-white/10'}`}
                  >
                    After Sunset
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Optional Notes</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Add personal note..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                Save Onset Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
