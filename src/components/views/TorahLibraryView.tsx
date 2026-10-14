import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, Bookmark, Volume2, Search, Award, HelpCircle } from 'lucide-react';
import { TORAH_STUDY_TRACKERS } from '../../data/mockData';
import { TorahStudyItem } from '../../types';

export const TorahLibraryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'parashah' | 'daf' | '48ways' | 'siddur'>('all');
  const [trackers, setTrackers] = useState<TorahStudyItem[]>(() => {
    const saved = localStorage.getItem('bnei_menashe_torah_study_progress');
    return saved ? JSON.parse(saved) : TORAH_STUDY_TRACKERS;
  });
  const [selectedReading, setSelectedReading] = useState<{ title: string; hebrew: string; text: string; englishText: string } | null>({
    title: "Parashat Pinchas — The Daughters of Zelophehad",
    hebrew: "וַתִּקְרַבְנָה בְּנוֹת צְלָפְחָד, בֶּן-חֵפֶר בֶּן-גִּלְעָד בֶּן-מָכִיר בֶּן-מְנַשֶּׁה, לְמִשְׁפְּחֹת מְנַשֶּׁה bֶן-יוֹסֵף",
    text: "Vatikravna benot Tzelofchad ben Chefer ben Gilad ben Machir ben Menashe, lemishpechot Menashe ben Yosef...",
    englishText: "Then drew near the daughters of Zelophehad, the son of Hepher, the son of Gilead, the son of Machir, the son of Manasseh, of the families of Manasseh the son of Joseph: and these are the names of his daughters; Mahlah, Noah, and Hoglah, and Milcah, and Tirzah."
  });

  const incrementProgress = (id: string) => {
    setTrackers(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const next = Math.min(100, item.progress + 10);
          return { ...item, progress: next };
        }
        return item;
      });
      localStorage.setItem('bnei_menashe_torah_study_progress', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0A1128] via-[#1E293B] to-[#0A1128] text-white shadow-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Digital Beit Midrash</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Sacred Torah Library & Study Hub
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Explore Tanakh, Daf Yomi, Sefardi Siddur, and the 48 Ways to Torah Wisdom.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-black/40 border border-white/10 text-xs font-semibold">
          {[
            { id: 'all', label: 'All Trackers' },
            { id: 'parashah', label: 'Parashah' },
            { id: 'daf', label: 'Daf Yomi' },
            { id: '48ways', label: '48 Ways' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Phase 8: Help Everywhere ("What is this?") */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-white space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>What is the Digital Beit Midrash?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Digital Beit Midrash is our central study hall. Here, Bnei Menashe community members can track their progress in Parashat Hashavua (the weekly Torah reading), follow the daily Daf Yomi cycle, explore ethical guidelines, and access the daily Siddur prayers to maintain constant connection with Torah wisdom and Jewish traditions.
        </p>
      </div>

      {/* Featured Interactive Scripture Reader */}
      {selectedReading && (
        <div className="p-6 rounded-3xl bg-[#FAF8F3] dark:bg-slate-900 border-2 border-amber-400/80 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Featured Scripture
              </span>
              <span className="text-xs font-semibold text-slate-500">Numbers 27:1</span>
            </div>
            <button className="p-1.5 rounded-xl hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center gap-1 text-xs font-bold">
              <Volume2 className="w-4 h-4" />
              <span>Chant Audio</span>
            </button>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">
            {selectedReading.title}
          </h3>

          {/* Hebrew Text */}
          <p className="text-xl sm:text-2xl font-serif text-right text-amber-950 dark:text-amber-200 leading-relaxed font-bold tracking-wide my-4 p-4 rounded-2xl bg-amber-100/40 dark:bg-slate-800/80 border border-amber-300/40">
            {selectedReading.hebrew}
          </p>

          {/* Transliteration */}
          <p className="text-xs italic text-slate-600 dark:text-slate-400 font-sans leading-relaxed mb-3">
            <strong>Transliteration:</strong> {selectedReading.text}
          </p>

          {/* English Translation */}
          <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            "{selectedReading.englishText}"
          </p>
        </div>
      )}

      {/* Study Trackers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trackers.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300">
                  {item.category}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  {item.progress}% Completed
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {item.title}
              </h4>
              <p className="text-xs font-serif text-amber-800 dark:text-amber-400 font-bold mt-0.5">
                {item.hebrewTitle} — {item.subtitle}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {item.dailyGoal}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="w-2/3 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
              <button
                onClick={() => incrementProgress(item.id)}
                disabled={item.progress >= 100}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-50 transition-transform hover:scale-105 flex items-center gap-1 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{item.progress >= 100 ? 'Completed!' : 'Log Study +10%'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
