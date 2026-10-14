import React, { useState } from 'react';
import { Search, MapPin, Globe, Moon, Sun, Bell, Sparkles, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useSupabaseAuth } from '../providers/SupabaseAuthProvider';
import { SupportedLanguage, LocationOption } from '../types';
import { LOCATIONS } from '../data/mockData';

interface TopNavProps {
  currentLocation: string;
  onLocationChange: (locId: string) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenCommandPalette: () => void;
  onOpenSubscriptionModal: () => void;
  onNavigateAuth?: () => void;
  onNavigateProfile?: () => void;
  onNavigateActivityCenter?: () => void;
  onNavigateSettings?: () => void;
  onNavigateHelp?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentLocation,
  onLocationChange,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenCommandPalette,
  onOpenSubscriptionModal,
  onNavigateAuth,
  onNavigateProfile,
  onNavigateActivityCenter,
  onNavigateSettings,
  onNavigateHelp
}) => {
  const { user, profile, signOut } = useSupabaseAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const languages: SupportedLanguage[] = ['English', 'Hebrew', 'Mizo', 'Thadou', 'Kuki'];

  return (
    <header className="h-16 px-6 border-b border-amber-200/40 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search & Command Palette Launcher */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs hover:border-amber-400 dark:hover:border-amber-500/50 transition-all shadow-xs group"
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
            <span>Search Torah, Zmanim, AI Rabbi or Shuls...</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Center Dates Display */}
      <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-2xl bg-amber-50/80 dark:bg-slate-800/80 border border-amber-200/50 dark:border-slate-700 shadow-xs">
        <div className="flex flex-col text-right">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            16th of Tamuz, 5786
          </span>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
            Wednesday, July 1, 2026
          </span>
        </div>
        <div className="h-6 w-px bg-amber-200 dark:bg-slate-700"></div>
        <div className="text-xs font-bold font-serif text-amber-800 dark:text-amber-300 tracking-wider">
          ט״ז בְּתַמּוּז תשפ״ו
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Interactive Location Selector */}
        <div className="relative flex items-center">
          <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 absolute left-3 pointer-events-none" />
          <select
            value={currentLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer appearance-none shadow-xs"
          >
            {LOCATIONS.map((loc: LocationOption) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}, {loc.region}
              </option>
            ))}
          </select>
        </div>

        {/* Subscription Upgrade Badge */}
        <button
          onClick={onOpenSubscriptionModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition-transform"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Family PRO</span>
        </button>

        {/* Language Switcher */}
        <div className="relative flex items-center">
          <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            className="pl-8 pr-6 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer appearance-none"
          >
            {languages.map((lang) => {
              const labels: Record<SupportedLanguage, string> = {
                English: 'English • אנגלית',
                Hebrew: 'Hebrew • עִבְרִית',
                Thadou: 'Thadou • Thadou Kuki',
                Kuki: 'Kuki • Kuki ṭawng',
                Mizo: 'Mizo • Mizo ṭawng'
              };
              return <option key={lang} value={lang}>{labels[lang] || lang}</option>;
            })}
          </select>
        </div>

        {/* Notifications */}
        <button 
          onClick={onNavigateActivityCenter}
          title="Notifications & Community Activity"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          title="Toggle Dark Mode"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Profile Avatar / Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            title="User Menu"
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-amber-500/30 bg-amber-500/10 cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-slate-950 font-bold text-xs">
              {profile?.full_name?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || 'SH'}
            </div>
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {profile?.full_name || 'Samuel Haokip'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {profile?.email || user?.email || 'member@bneimenashe.org'}
                </p>
              </div>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  if (onNavigateProfile) onNavigateProfile();
                }}
                className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  if (onNavigateSettings) onNavigateSettings();
                }}
                className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  if (onNavigateHelp) onNavigateHelp();
                  else onOpenCommandPalette();
                }}
                className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Help</span>
              </button>

              <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  setIsLogoutDialogOpen(true);
                }}
                className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {isLogoutDialogOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Logout</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Terminate secure active session</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to log out of the Bnei Menashe Digital Platform? Your session data will be cleared from this device and you will be returned to the Welcome screen.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsLogoutDialogOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsLogoutDialogOpen(false);
                  await signOut();
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
