import React, { useState } from 'react';
import { Search, Bot, Calendar, BookOpen, Sun, Flame, Users, X, ArrowRight, BarChart2, Megaphone, Cpu, Award } from 'lucide-react';
import { NavSection } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (section: NavSection) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectSection
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const quickLinks: { title: string; section: NavSection; icon: React.ReactNode; desc: string }[] = [
    { title: 'Community Life Events & Lifecycle Registry', section: 'lifecycle_registry', icon: <Award className="w-4 h-4 text-amber-400" />, desc: 'Official registry for births, marriages, aliyah, bnei mitzvah & memorials' },
    { title: 'Community Infrastructure Control Room', section: 'enterprise_sysadmin', icon: <Cpu className="w-4 h-4 text-amber-400" />, desc: 'Technical governance & infrastructure monitoring for community engineers' },
    { title: 'Official Community Broadcasts & Notices', section: 'communications_center', icon: <Megaphone className="w-4 h-4 text-amber-400" />, desc: 'Official alerts, synagogue notices, regional announcements & personal inbox' },
    { title: 'Ask AI Rabbi about Parashat Pinchas', section: 'ai_rabbi', icon: <Bot className="w-4 h-4 text-amber-500" />, desc: 'Instant Halachic and Torah insight with local Bnei Menashe customs' },
    { title: "Check Today's Candle Lighting Time", section: 'zmanim', icon: <Sun className="w-4 h-4 text-amber-500" />, desc: 'Churachandpur, Aizawl, Kangpokpi, Nof HaGalil & Kiryat Arba' },
    { title: 'View Hebrew Calendar 5786', section: 'calendar', icon: <Calendar className="w-4 h-4 text-purple-500" />, desc: 'Hebrew / Gregorian dual view with community fasts' },
    { title: 'Read Daf Yomi & Daily Study', section: 'parashah', icon: <BookOpen className="w-4 h-4 text-blue-500" />, desc: 'Daily Talmud page & weekly Parashah insights' },
    { title: 'Visit the Memorial Sanctuary', section: 'memorial', icon: <Flame className="w-4 h-4 text-rose-500" />, desc: 'Honor ancestors and departed elders of Bnei Menashe' },
    { title: 'Synagogues & Regional Council Directory', section: 'community', icon: <Users className="w-4 h-4 text-emerald-500" />, desc: 'India (Lamka, Aizawl, Kangpokpi) and Israel communities' },
    { title: 'Official Community Census 5786', section: 'census_demographics', icon: <BarChart2 className="w-4 h-4 text-amber-400" />, desc: 'Bnei Menashe Council official demographic records' }
  ];

  const filteredLinks = query
    ? quickLinks.filter(l => l.title.toLowerCase().includes(query.toLowerCase()) || l.desc.toLowerCase().includes(query.toLowerCase()))
    : quickLinks;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-amber-300/40 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            type="text"
            placeholder="Search Torah teachings, Zmanim, regional councils, or ask our AI Rabbi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {query ? 'Search Results' : 'Suggested Quick Actions'}
          </div>
          {filteredLinks.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No direct matching screen. Click below to ask our Gemini AI Rabbi!
              <button
                onClick={() => {
                  onSelectSection('ai_rabbi');
                  onClose();
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2 shadow-md"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI Rabbi "{query}"</span>
              </button>
            </div>
          ) : (
            filteredLinks.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectSection(item.section);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-amber-500/10 dark:hover:bg-slate-800/80 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-500/20 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Navigate with mouse or tap</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">Powered by Google Gemini 3.5</span>
        </div>
      </div>
    </div>
  );
};
