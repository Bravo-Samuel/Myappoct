import React, { useState } from 'react';
import { 
  Sparkles, 
  Globe2, 
  MapPin, 
  Heart, 
  Bell, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  Moon, 
  Sun,
  Building2,
  BookOpen,
  Calendar,
  Clock,
  MessageSquare,
  Users,
  Flame,
  Languages
} from 'lucide-react';
import { UserProfile } from '../../providers/SupabaseAuthProvider';
import { SupportedLanguage } from '../../types';

export interface OnboardingData {
  language: SupportedLanguage;
  location: {
    country: string;
    state: string;
    district: string;
    community: string;
    regionalCouncil: string;
    synagogue: string;
  };
  interests: string[];
  notifications: {
    prayerReminders: boolean;
    shabbatReminders: boolean;
    holidayAlerts: boolean;
    yahrzeitReminders: boolean;
    communityAnnouncements: boolean;
  };
}

interface UserOnboardingWizardProps {
  profile: UserProfile | null;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onComplete: (data: OnboardingData) => void;
}

const LANGUAGES: { id: SupportedLanguage; label: string; sub: string }[] = [
  { id: 'English', label: 'English', sub: 'Universal Global' },
  { id: 'Hebrew', label: 'עברית', sub: 'Hebrew / Lashon Hakodesh' },
  { id: 'Thadou', label: 'Thadou', sub: 'Kuki-Chin Dialect' },
  { id: 'Kuki', label: 'Kuki', sub: 'Manipur Hills Dialect' },
  { id: 'Mizo', label: 'Mizo', sub: 'Mizoram Duhlian Dialect' }
];

const INTEREST_OPTIONS: { id: string; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'Sacred Calendar', label: 'Sacred Calendar', desc: 'Jewish holidays, Rosh Chodesh & fast days', icon: Calendar },
  { id: 'Daily Zmanim', label: 'Daily Zmanim', desc: 'Exact astronomical Halachic prayer times', icon: Clock },
  { id: 'Torah Study', label: 'Torah Study', desc: 'Weekly Parashah, Daf Yomi & commentaries', icon: BookOpen },
  { id: 'AI Rabbi', label: 'AI Rabbi', desc: 'Halachic Q&A, voice chanting & translation', icon: MessageSquare },
  { id: 'Prayer Times', label: 'Prayer Times', desc: 'Minyan schedules & synagogue alerts', icon: Bell },
  { id: 'Community Events', label: 'Community Events', desc: 'Simchas, gatherings & volunteer rosters', icon: Users },
  { id: 'Memorial Board', label: 'Memorial Board', desc: 'Yahrzeit dates, Kaddish & family trees', icon: Flame },
  { id: 'Hebrew Learning', label: 'Hebrew Learning', desc: 'Interactive lessons & prayer pronunciation', icon: Languages }
];

export const UserOnboardingWizard: React.FC<UserOnboardingWizardProps> = ({
  profile,
  isDarkMode = false,
  onToggleDarkMode,
  onComplete
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 2 State
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    (profile?.preferred_dialect as SupportedLanguage) || 'English'
  );

  // Step 3 State
  const [country, setCountry] = useState<string>('India');
  const [stateName, setStateName] = useState<string>('Manipur');
  const [district, setDistrict] = useState<string>('Churachandpur');
  const [community, setCommunity] = useState<string>('Bnei Menashe Manipur Council');
  const [regionalCouncil, setRegionalCouncil] = useState<string>('Beit Shalom District Council');
  const [synagogue, setSynagogue] = useState<string>('Beit Shalom Synagogue - Churachandpur');

  // Step 4 State
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Sacred Calendar',
    'Daily Zmanim',
    'Torah Study'
  ]);

  // Step 5 State
  const [notifications, setNotifications] = useState({
    prayerReminders: true,
    shabbatReminders: true,
    holidayAlerts: true,
    yahrzeitReminders: true,
    communityAnnouncements: true
  });

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    if (newCountry === 'India') {
      setStateName('Manipur');
      setDistrict('Churachandpur');
      setCommunity('Bnei Menashe Manipur Council');
      setRegionalCouncil('Beit Shalom District Council');
      setSynagogue('Beit Shalom Synagogue - Churachandpur');
    } else if (newCountry === 'Israel') {
      setStateName('Northern District');
      setDistrict('Nof HaGalil');
      setCommunity('Shavei Israel Aliyah Community');
      setRegionalCouncil('Nof HaGalil Regional Council');
      setSynagogue('Tiferet Menashe Synagogue - Nof HaGalil');
    } else {
      setStateName('Global Diaspora');
      setDistrict('International Hub');
      setCommunity('International Bnei Menashe Network');
      setRegionalCouncil('Global Virtual Assembly');
      setSynagogue('Virtual Beit Shalom');
    }
  };

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    if (newDistrict === 'Churachandpur') {
      setStateName('Manipur');
      setCommunity('Bnei Menashe Manipur Council');
      setRegionalCouncil('Beit Shalom District Council');
      setSynagogue('Beit Shalom Synagogue - Churachandpur');
    } else if (newDistrict === 'Aizawl') {
      setStateName('Mizoram');
      setCommunity('Bnei Menashe Mizoram Council');
      setRegionalCouncil('Shaarei Zion Regional Council');
      setSynagogue('Shaarei Zion Synagogue - Aizawl');
    } else if (newDistrict === 'Kangpokpi') {
      setStateName('Manipur');
      setCommunity('Kangpokpi District Council');
      setRegionalCouncil('North Manipur Council');
      setSynagogue('Kehilat Menashe - Kangpokpi');
    } else if (newDistrict === 'Nof HaGalil') {
      setCountry('Israel');
      setStateName('Northern District');
      setCommunity('Shavei Israel Aliyah Community');
      setRegionalCouncil('Nof HaGalil Regional Council');
      setSynagogue('Tiferet Menashe Synagogue - Nof HaGalil');
    }
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const finalizeOnboarding = () => {
    onComplete({
      language: selectedLanguage,
      location: {
        country,
        state: stateName,
        district,
        community,
        regionalCouncil,
        synagogue
      },
      interests: selectedInterests,
      notifications
    });
  };

  const userName = profile?.full_name || profile?.email?.split('@')[0] || 'Member';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0F172A] text-slate-100' : 'bg-[#FDFBF7] text-slate-900'} font-sans flex flex-col justify-center py-10 px-4 sm:px-6 relative`}>
      {/* Top Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors shadow-sm cursor-pointer"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}
      </div>

      <div className="w-full max-w-xl mx-auto animate-fade-in">
        {/* Step Progress Indicators */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                  s === step
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-lg scale-110'
                    : s < step
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {s < step ? <Check className="w-4 h-4 stroke-[3]" /> : s}
              </div>
              {s < 6 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-300 ${
                    s < step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl transition-all duration-300 relative overflow-hidden">
          {/* STEP 1 — WELCOME */}
          {step === 1 && (
            <div className="text-center space-y-6 py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30 shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  Welcome, {userName}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  Welcome to the BNEI MENASHE Digital Platform. Let&apos;s personalize your experience.
                </p>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="w-full sm:flex-1 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={finalizeOnboarding}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — LANGUAGE */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Step 2 of 6</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Select Preferred Language
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose the primary language and dialect for prayer interfaces, Torah lessons, and notifications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 text-slate-900 dark:text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-extrabold text-sm">{lang.label}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{lang.sub}</div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-amber-500 text-slate-950' : 'border border-slate-300 dark:border-slate-600'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — LOCATION */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Step 3 of 6</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Confirm Community & Synagogue
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automatically calibrating local Zmanim, Shabbat candle lighting times, and synagogue announcements.
                </p>
              </div>

              <div className="space-y-3.5 pt-1 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">Country</label>
                    <select
                      value={country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="India">India</option>
                      <option value="Israel">Israel</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">District / City</label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Churachandpur">Churachandpur (Manipur)</option>
                      <option value="Aizawl">Aizawl (Mizoram)</option>
                      <option value="Kangpokpi">Kangpokpi (Manipur)</option>
                      <option value="Nof HaGalil">Nof HaGalil (Israel)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">State / Region</label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">Regional Council</label>
                    <input
                      type="text"
                      value={regionalCouncil}
                      onChange={(e) => setRegionalCouncil(e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Community Council</label>
                  <input
                    type="text"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Primary Synagogue</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-amber-500" />
                    <input
                      type="text"
                      value={synagogue}
                      onChange={(e) => setSynagogue(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Interests</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — INTERESTS */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Step 4 of 6</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Personalize Your Interests
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select the topics that matter most to you. You can select multiple.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-h-[320px] overflow-y-auto pr-1">
                {INTEREST_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 text-slate-900 dark:text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-xs">{item.label}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">{item.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-1 ${
                        isSelected ? 'bg-amber-500 text-slate-950' : 'border border-slate-300 dark:border-slate-600'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Notifications</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5 — NOTIFICATIONS */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Step 5 of 6</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Configure Community Alerts
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Stay connected to prayer times, Shabbat transitions, and synagogue announcements.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { key: 'prayerReminders' as const, label: 'Prayer Reminders', desc: 'Alerts 15 mins before Shacharit, Mincha, and Maariv' },
                  { key: 'shabbatReminders' as const, label: 'Shabbat Reminders', desc: 'Candle lighting countdown & Havdalah alerts' },
                  { key: 'holidayAlerts' as const, label: 'Holiday Alerts', desc: 'Upcoming Yom Tov & Rosh Chodesh reminders' },
                  { key: 'yahrzeitReminders' as const, label: 'Yahrzeit Reminders', desc: 'Annual family memorial & Kaddish date alerts' },
                  { key: 'communityAnnouncements' as const, label: 'Community Announcements', desc: 'Minyan calls, simchas, and synagogue bulletins' }
                ].map((item) => {
                  const isEnabled = notifications[item.key];
                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleNotification(item.key)}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                    >
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white">{item.label}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                      <button
                        type="button"
                        className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                          isEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-1 ${
                            isEnabled ? 'right-1 translate-x-0' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(6)}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Review & Complete</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6 — FINISH */}
          {step === 6 && (
            <div className="text-center space-y-6 py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                  Your community is ready.
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Everything is configured for <strong className="text-slate-900 dark:text-white">{synagogue}</strong> in <strong className="text-slate-900 dark:text-white">{selectedLanguage}</strong>.
                </p>
              </div>

              {/* Summary Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Language:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{selectedLanguage}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Community:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white truncate max-w-[180px]">{community}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Active Interests:</span>
                  <span className="font-extrabold text-amber-600 dark:text-amber-400">{selectedInterests.length} selected</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep(5)}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={finalizeOnboarding}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
