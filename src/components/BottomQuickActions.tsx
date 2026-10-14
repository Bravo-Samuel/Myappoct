import React from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  BookMarked, 
  Calendar, 
  Bot, 
  HeartHandshake, 
  Flame, 
  Users, 
  DownloadCloud,
  Megaphone
} from 'lucide-react';
import { NavSection } from '../types';

interface BottomQuickActionsProps {
  onSelectSection: (section: NavSection) => void;
}

export const BottomQuickActions: React.FC<BottomQuickActionsProps> = ({ onSelectSection }) => {
  const quickActions = [
    { id: 'communications_center' as NavSection, label: 'Broadcasts', icon: <Megaphone className="w-5 h-5 text-amber-400" /> },
    { id: 'torah_library' as NavSection, label: 'Read Torah', icon: <BookOpen className="w-5 h-5 text-amber-500" /> },
    { id: 'parashah' as NavSection, label: 'Daily Study', icon: <GraduationCap className="w-5 h-5 text-blue-500" /> },
    { id: 'torah_library' as NavSection, label: 'Prayer Book', icon: <BookMarked className="w-5 h-5 text-emerald-500" /> },
    { id: 'calendar' as NavSection, label: 'Hebrew Cal', icon: <Calendar className="w-5 h-5 text-purple-500" /> },
    { id: 'ai_rabbi' as NavSection, label: 'Ask AI Rabbi', icon: <Bot className="w-5 h-5 text-amber-400" />, isHighlight: true },
    { id: 'family' as NavSection, label: 'Family Tree', icon: <HeartHandshake className="w-5 h-5 text-rose-500" /> },
    { id: 'memorial' as NavSection, label: 'Memorial', icon: <Flame className="w-5 h-5 text-amber-500" /> },
    { id: 'community' as NavSection, label: 'Community', icon: <Users className="w-5 h-5 text-cyan-500" /> },
    { id: 'calendar' as NavSection, label: 'Downloads', icon: <DownloadCloud className="w-5 h-5 text-slate-400" /> }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-5xl w-[95%] sm:w-auto px-3 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-amber-300/40 dark:border-slate-800 shadow-2xl flex items-center justify-around sm:justify-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
      {quickActions.map((action, idx) => (
        <button
          key={`${action.id}-${idx}`}
          onClick={() => onSelectSection(action.id)}
          className={`group flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 hover:scale-110 shrink-0 min-w-[62px] ${
            action.isHighlight
              ? 'bg-gradient-to-b from-amber-500/20 to-amber-500/10 border border-amber-500/40 text-amber-900 dark:text-amber-300 shadow-md'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="p-1 rounded-lg transition-transform group-hover:-translate-y-0.5">
            {action.icon}
          </div>
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight whitespace-nowrap">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};
