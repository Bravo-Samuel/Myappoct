import React, { useState, useMemo } from 'react';
import { 
  HeartHandshake, Flame, Plus, User, Shield, Sparkles, Image, FileText, 
  MapPin, Search, Filter, ZoomIn, ZoomOut, Maximize2, Minimize2, 
  Calendar, Award, BookOpen, Share2, Bell, CheckCircle2, ChevronRight, ChevronDown, Layers, X, HelpCircle
} from 'lucide-react';
import { FamilyTreePerson, FamilyTimelineEvent, FamilyHeritageRecord } from '../../types';
import { FamilyService } from '../../services/data/FamilyService';
import { MemorialService } from '../../services/data/MemorialService';
import { NotificationService } from '../../services/data/NotificationService';
import { PersonProfileModal } from '../family/PersonProfileModal';
import { AIContextualInsightModal } from '../family/AIContextualInsightModal';
import confetti from 'canvas-confetti';

export const FamilyView: React.FC = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'tree' | 'living' | 'memorial' | 'timeline' | 'heritage'>('tree');
  
  // Filtering & Search
  const [selectedClan, setSelectedClan] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Tree Graph Controls
  const [zoomLevel, setZoomLevel] = useState(1);
  const [expandedGenerations, setExpandedGenerations] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  });

  // State Data
  const [persons, setPersons] = useState<FamilyTreePerson[]>(() => FamilyService.getAllPersons());
  const [timelineEvents, setTimelineEvents] = useState<FamilyTimelineEvent[]>(() => FamilyService.getTimelineEvents());
  const [heritageRecords] = useState<FamilyHeritageRecord[]>(() => FamilyService.getHeritageRecords());
  
  // Modals
  const [selectedPerson, setSelectedPerson] = useState<FamilyTreePerson | null>(null);
  const [aiModal, setAiModal] = useState<{
    isOpen: boolean;
    title: string;
    queryType: 'relationship' | 'name' | 'migration' | 'village';
    subjectName: string;
    hebrewSubject?: string;
    contextData?: string;
  }>({
    isOpen: false,
    title: '',
    queryType: 'relationship',
    subjectName: ''
  });

  // Add Member Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    hebrewName: '',
    familyClan: 'Singson' as const,
    gender: 'Male' as const,
    birthDate: '2010-01-01',
    hebrewBirthDate: '15 Tevet 5770',
    isDeceased: false,
    biography: '',
    villageOfOrigin: 'Churachandpur',
    community: 'Nof HaGalil',
    regionalCouncil: 'Northern Galilee Regional Council',
    occupation: 'Student',
    aliyahStatus: 'Born in Israel' as const,
    familyRole: 'Family Member',
    communityParticipation: 'Youth Participant',
    generation: 5
  });

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered persons list using useMemo
  const filteredPersons = useMemo(() => {
    return FamilyService.searchPersons(searchQuery, {
      clan: selectedClan
    });
  }, [persons, searchQuery, selectedClan]);

  // Grouped persons by generation
  const personsByGeneration = useMemo(() => {
    const map: Record<number, FamilyTreePerson[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    filteredPersons.forEach(p => {
      const gen = p.generation || 4;
      if (!map[gen]) map[gen] = [];
      map[gen].push(p);
    });
    return map;
  }, [filteredPersons]);

  const handleLightCandle = (person: FamilyTreePerson, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (person.memorialRecordId) {
      MemorialService.lightCandle(person.memorialRecordId);
    }
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 }
    });
    showToast(`Lit sacred yizkor candle in memory of ${person.name}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDispatchReminders = () => {
    showToast("Dispatched upcoming Birthday, Hebrew Birthday & Yahrzeit notifications to your device and calendar.");
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    const created = FamilyService.addPerson({
      ...newMember,
      achievements: ['Newly Added Family Member'],
      parentIds: ['person_gen3_1'],
      spouseIds: [],
      childIds: [],
      siblingIds: [],
      canEdit: true
    });

    setPersons(FamilyService.getAllPersons());
    setShowAddModal(false);
    showToast(`Added ${created.name} (${created.hebrewName}) to the Bnei Menashe Family Tree.`);
  };

  const handleUpdatePerson = (updated: FamilyTreePerson) => {
    setPersons(FamilyService.getAllPersons());
    setSelectedPerson(updated);
    showToast(`Updated profile for ${updated.name}.`);
  };

  const triggerAIInsight = (
    queryType: 'relationship' | 'name' | 'migration' | 'village',
    title: string,
    subjectName: string,
    hebrewSubject?: string,
    contextData?: string
  ) => {
    setAiModal({
      isOpen: true,
      title,
      queryType,
      subjectName,
      hebrewSubject,
      contextData
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900/90 border border-emerald-400 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0A1128] via-[#1E293B] to-[#0A1128] text-white shadow-xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4 text-amber-500" />
            <span>Tribe of Manasseh Genealogy & Heritage Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Bnei Menashe Family Tree & Legacy Archive
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Preserving our ancestral lineage across generations—from ancient Israel through the Silk Road to Manipur and Mizoram, and back home to Zion.
          </p>

          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs text-amber-300 font-semibold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Permission: Family Admin (Full Edit Rights)</span>
            </div>
            <button
              onClick={handleDispatchReminders}
              className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-xs text-amber-300 font-semibold flex items-center gap-1.5 transition-all"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Schedule Yahrzeit & Birthday Alerts</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Family Member</span>
          </button>
        </div>
      </div>

      {/* Phase 8: Help Everywhere ("What is this?") */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-white space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>What is the Family Tree & Legacy Archive?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Family Tree & Legacy Archive preserves the sacred lineage and migration history of Bnei Menashe families. It maps familial connections across generations, highlights key timeline events from Northeast India to Zion, and serves as an interactive genealogical registry protected by standard Row Level Security.
        </p>
      </div>

      {/* Phase 3 Banner: Our Household & Migration Story */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 shadow-lg text-white space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Our Household • Migration Journey & Family Story</span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Tribe of Manasseh Lineage
          </span>
        </div>
        <h3 className="text-lg font-black text-white tracking-tight">
          Haokip &amp; Singson Household Introduction
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          From the mountains of Northeast India (Churachandpur &amp; Aizawl) to our return to Zion, our household preserves five generations of Torah devotion, Shabbat observance, and ancestral memories. Grandparents, parents, and children united under our heritage.
        </p>
      </div>

      {/* Navigation Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'tree'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Lineage Generations ({filteredPersons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('living')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'living'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Living Members</span>
          </button>

          <button
            onClick={() => setActiveTab('memorial')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'memorial'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Memorial Archive</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'timeline'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>History Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('heritage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'heritage'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ancestral Heritage</span>
          </button>
        </div>

        {/* Search & Clan Select */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search people, families..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <select
            value={selectedClan}
            onChange={e => setSelectedClan(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Family Lineages</option>
            <option value="Haokip">Haokip Family</option>
            <option value="Singson">Singson Family</option>
            <option value="Lhungdim">Lhungdim Family</option>
            <option value="Touthang">Touthang Family</option>
            <option value="Kipgen">Kipgen Family</option>
          </select>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE TREE VISUALIZATION */}
      {activeTab === 'tree' && (
        <div className="space-y-4">
          {/* Zoom & Controls Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-bold text-amber-400">Tree Zoom & Pan Controls:</span>
              <span>Scale: {Math.round(zoomLevel * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.15))}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
              >
                Reset
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.15))}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Generational Tree Hierarchy Canvas */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F3] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto">
            <div 
              className="space-y-10 min-w-[700px] transition-transform duration-300 origin-top-left"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {filteredPersons.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-amber-500/30 text-slate-300 max-w-xl mx-auto space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Your family&apos;s story has not been added yet.</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Begin preserving your family&apos;s history for future generations. Add grandparents, parents, and children to trace our heritage from the mountains of Northeast India to Zion.
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md mt-2"
                  >
                    Add First Household Member
                  </button>
                </div>
              ) : (
                [1, 2, 3, 4, 5].map(generation => {
                  const membersInGen = personsByGeneration[generation] || [];
                  if (membersInGen.length === 0) return null;

                const isExpanded = expandedGenerations[generation];
                const genTitles: Record<number, { title: string; subtitle: string }> = {
                  1: { title: "Generation 1 • Ancestral Patriarchs & Matriarchs", subtitle: "Churachandpur & Aizawl Pioneers" },
                  2: { title: "Generation 2 • Grandparents & Elders", subtitle: "Preservers of Torah in Manipur Hills" },
                  3: { title: "Generation 3 • Parents & Household Leaders", subtitle: "Leading Aliyah Waves & Community Builders" },
                  4: { title: "Generation 4 • Current Generation (You & Siblings)", subtitle: "Uniting Israel & Northeast India" },
                  5: { title: "Generation 5 • Children & Next Generation", subtitle: "Born or Growing Up in Zion" }
                };

                return (
                  <div key={generation} className="space-y-4">
                    {/* Tier Header */}
                    <div 
                      onClick={() => setExpandedGenerations(prev => ({ ...prev, [generation]: !isExpanded }))}
                      className="flex items-center justify-between pb-2 border-b border-slate-300 dark:border-slate-800 cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-sm">
                          Gen {generation}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                            {genTitles[generation]?.title || `Generation ${generation}`}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {genTitles[generation]?.subtitle}
                          </p>
                        </div>
                      </div>
                      <button className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <span>{isExpanded ? 'Collapse Branch' : 'Expand Branch'}</span>
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Cards Grid for Tier */}
                    {isExpanded && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        {membersInGen.map(person => (
                          <div
                            key={person.id}
                            onClick={() => setSelectedPerson(person)}
                            className={`p-4 rounded-2xl transition-all cursor-pointer border flex flex-col justify-between shadow-sm hover:shadow-md ${
                              person.isDeceased
                                ? 'bg-gradient-to-b from-amber-950/40 to-slate-900/90 border-amber-500/40 text-white'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500/60'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                  {person.familyRole}
                                </span>
                                {person.isDeceased ? (
                                  <span className="flex items-center gap-1 text-amber-400 text-xs font-mono">
                                    🕯️ Memorial
                                  </span>
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                )}
                              </div>

                              <div className="mt-3">
                                <h5 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                  <span>{person.name}</span>
                                </h5>
                                <p className="text-xs font-serif text-amber-700 dark:text-amber-400">
                                  {person.hebrewName}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                                  <span>{person.villageOfOrigin} → {person.community}</span>
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                              <span className="text-[10px] font-mono text-slate-400">
                                Family: {person.familyClan}
                              </span>
                              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                <span>View Profile</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVING FAMILY MEMBERS */}
      {activeTab === 'living' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Living Bnei Menashe Family Members ({persons.filter(p => !p.isDeceased).length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Celebrating milestones, upcoming birthdays, and active community roles across Israel and Northeast India.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {persons.filter(p => !p.isDeceased).map(person => (
                <div
                  key={person.id}
                  onClick={() => setSelectedPerson(person)}
                  className="p-5 rounded-2xl bg-[#FAF8F3]/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-200 text-slate-950 font-bold text-base flex items-center justify-center shrink-0">
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {person.name} <span className="text-xs font-serif font-normal text-amber-700 dark:text-amber-400">({person.hebrewName})</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {person.familyRole} • {person.community}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {person.aliyahStatus}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Birthday:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{person.birthDate} ({person.hebrewBirthDate})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Occupation:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{person.occupation}</span>
                    </div>
                  </div>

                  {person.achievements && person.achievements.length > 0 && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">Highlight: {person.achievements[0]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MEMORIAL ARCHIVE */}
      {activeTab === 'memorial' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0A1128] text-white border-2 border-amber-500/50 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-amber-500 animate-pulse shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Virtual Yizkor Memorial Sanctuary
                  </h3>
                  <p className="text-xs text-slate-300">
                    Honor the legacy of our ancestors and elders who preserved the Tribe of Manasseh through centuries of exile.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Eternal Remembrance
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {persons.filter(p => p.isDeceased).map(person => (
                <div
                  key={person.id}
                  onClick={() => setSelectedPerson(person)}
                  className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/60 to-slate-900 border border-amber-400/60 shadow-lg cursor-pointer flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">{person.familyRole}</span>
                      <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">{person.name}</h4>
                    <p className="text-xs font-serif text-amber-300">{person.hebrewName}</p>
                    <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      <span>{person.villageOfOrigin} → {person.community}</span>
                    </p>
                    <p className="text-xs font-mono text-amber-300/90 mt-2">
                      🕯️ Passing: {person.passingDate} ({person.hebrewPassingDate})
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleLightCandle(person, e)}
                    className="w-full py-2 rounded-xl text-xs font-bold transition-all bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Light Yizkor Candle</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VISUAL HISTORY TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Bnei Menashe Family History Timeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Milestones of survival, Aliyah waves, marriage dedications, and community leadership spanning nearly a century.
              </p>
            </div>

            <div className="relative pl-6 border-l-2 border-amber-500/40 space-y-8">
              {timelineEvents.map((ev, idx) => (
                <div key={ev.id} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-500 border-4 border-white dark:border-slate-900 shadow"></div>
                  <div className="p-5 rounded-2xl bg-[#FAF8F3]/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                        {ev.year} • {ev.eventType}
                      </span>
                      <span className="text-xs font-serif text-slate-500 dark:text-slate-400">
                        {ev.hebrewDate}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ev.description}
                    </p>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 pt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{ev.location}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ANCESTRAL HERITAGE & MIGRATION EXPLORER */}
      {activeTab === 'heritage' && (
        <div className="space-y-6">
          {heritageRecords.map(record => (
            <div key={record.clanName} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                    Ancestral Lineage Archive
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    The {record.clanName} Family Branch ({record.hebrewClanName})
                  </h3>
                </div>

                <button
                  onClick={() => triggerAIInsight('migration', `History of ${record.clanName} Family`, record.clanName, record.hebrewClanName, record.villageHistory)}
                  className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI Rabbi about {record.clanName} Family</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      Village & Tribal History
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {record.villageHistory}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase block mb-1">
                      Historical Tradition
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                      "{record.historicalNotes}"
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    Ancestral Migration Path
                  </h4>
                  <div className="space-y-2">
                    {record.migrationPath.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-3 text-xs">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center shrink-0 border border-amber-500/30">
                          {sIdx + 1}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{step}</span>
                      </div>
                    ))}
                  </div>

                  {record.communityPhotographs.length > 0 && (
                    <div className="pt-4">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Archival Photos</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {record.communityPhotographs.map(photo => (
                          <div key={photo.id} className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                            <img src={photo.url} alt={photo.caption} className="w-full h-24 object-cover group-hover:scale-105 transition-all duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-end">
                              <span className="text-[10px] font-bold text-white leading-tight">{photo.caption}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0F172A] w-full max-w-xl rounded-3xl border border-amber-500/40 shadow-2xl p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Add Bnei Menashe Family Member</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Full English Name</label>
                  <input
                    type="text"
                    required
                    value={newMember.name}
                    onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Hebrew Name</label>
                  <input
                    type="text"
                    required
                    value={newMember.hebrewName}
                    onChange={e => setNewMember({ ...newMember, hebrewName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Family Lineage / Surname</label>
                  <select
                    value={newMember.familyClan}
                    onChange={e => setNewMember({ ...newMember, familyClan: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white"
                  >
                    <option value="Haokip">Haokip Family</option>
                    <option value="Singson">Singson Family</option>
                    <option value="Lhungdim">Lhungdim Family</option>
                    <option value="Touthang">Touthang Family</option>
                    <option value="Kipgen">Kipgen Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Generation Tier</label>
                  <select
                    value={newMember.generation}
                    onChange={e => setNewMember({ ...newMember, generation: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white"
                  >
                    <option value={1}>Gen 1: Great-Grandparents</option>
                    <option value={2}>Gen 2: Grandparents</option>
                    <option value={3}>Gen 3: Parents & Aunts/Uncles</option>
                    <option value={4}>Gen 4: Siblings / Spouses</option>
                    <option value={5}>Gen 5: Children</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Village of Origin</label>
                  <input
                    type="text"
                    value={newMember.villageOfOrigin}
                    onChange={e => setNewMember({ ...newMember, villageOfOrigin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Current Community</label>
                  <input
                    type="text"
                    value={newMember.community}
                    onChange={e => setNewMember({ ...newMember, community: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Biography / Notes</label>
                <textarea
                  rows={3}
                  value={newMember.biography}
                  onChange={e => setNewMember({ ...newMember, biography: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  Save to Family Tree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PERSON PROFILE MODAL */}
      <PersonProfileModal
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        onUpdatePerson={handleUpdatePerson}
        onTriggerAIInsight={triggerAIInsight}
      />

      {/* AI CONTEXTUAL INSIGHT MODAL */}
      <AIContextualInsightModal
        isOpen={aiModal.isOpen}
        onClose={() => setAiModal(prev => ({ ...prev, isOpen: false }))}
        title={aiModal.title}
        queryType={aiModal.queryType}
        subjectName={aiModal.subjectName}
        hebrewSubject={aiModal.hebrewSubject}
        contextData={aiModal.contextData}
      />
    </div>
  );
};
