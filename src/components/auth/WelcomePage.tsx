import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Sun, 
  Moon, 
  Globe, 
  Crown 
} from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface WelcomePageProps {
  onNavigate: (page: 'sign_in' | 'sign_up' | 'forgot_password' | 'reset_password' | 'verify_email') => void;
  onContinueGuest?: () => void;
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ 
  onNavigate, 
  onContinueGuest,
  language = 'English',
  onLanguageChange,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  const languages: SupportedLanguage[] = ['English', 'Hebrew', 'Mizo', 'Thadou', 'Kuki'];

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-5xl mx-auto py-6 px-4 sm:px-8 font-sans animate-fade-in">
      {/* Top Header Bar: Logo, Language Selector, Dark/Light Mode */}
      <header className="flex items-center justify-between w-full pb-8 border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
            <Crown className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Bnei Menashe
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Diaspora Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onLanguageChange && onLanguageChange(e.target.value as SupportedLanguage)}
              className="pl-9 pr-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer appearance-none transition-all"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Dark / Light Mode Toggle */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors shadow-xs"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center my-12 sm:my-16 max-w-3xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-extrabold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Unified Halachic & Community Ecosystem</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
          Sacred Heritage. <br />
          <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 dark:from-amber-300 dark:via-amber-400 dark:to-amber-200 bg-clip-text text-transparent">
            Enterprise Security.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
          Welcome to the unified digital portal for the Bnei Menashe Diaspora. Connect your regional synagogue, explore Halachic Zmanim, preserve ancestral lineages, and study Torah with verified security.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full max-w-md pt-4">
          <button
            onClick={() => onNavigate('sign_in')}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onNavigate('sign_up')}
            className="flex-1 py-4 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-sm border border-slate-800 dark:border-slate-200 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Create Account</span>
          </button>
        </div>

        {/* Optional Guest Link */}
        {onContinueGuest && (
          <div className="pt-2">
            <button
              onClick={onContinueGuest}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors underline underline-offset-4"
            >
              Continue as Guest
            </button>
          </div>
        )}
      </main>

      {/* Minimal Clean Footer */}
      <footer className="w-full pt-8 border-t border-slate-200/60 dark:border-slate-800/80 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
        © {new Date().getFullYear()} Bnei Menashe Council. All rights reserved.
      </footer>
    </div>
  );
};

