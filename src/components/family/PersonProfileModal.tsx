import React, { useState } from 'react';
import { User, Flame, MapPin, Briefcase, Award, Sparkles, Edit3, Save, X, Calendar, Shield, HeartHandshake, BookOpen } from 'lucide-react';
import { FamilyTreePerson } from '../../types';
import { FamilyService } from '../../services/data/FamilyService';
import { MemorialService } from '../../services/data/MemorialService';
import confetti from 'canvas-confetti';

interface PersonProfileModalProps {
  person: FamilyTreePerson | null;
  onClose: () => void;
  onUpdatePerson: (updated: FamilyTreePerson) => void;
  onTriggerAIInsight: (queryType: 'relationship' | 'name' | 'migration' | 'village', title: string, subject: string, hebrew?: string, context?: string) => void;
}

export const PersonProfileModal: React.FC<PersonProfileModalProps> = ({
  person,
  onClose,
  onUpdatePerson,
  onTriggerAIInsight
}) => {
  if (!person) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [isCandleLit, setIsCandleLit] = useState(false);
  const [formData, setFormData] = useState<FamilyTreePerson>(person);

  const handleLightCandle = () => {
    setIsCandleLit(true);
    if (person.memorialRecordId) {
      MemorialService.lightCandle(person.memorialRecordId);
    }
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = FamilyService.updatePerson(person.id, formData);
    if (updated) {
      onUpdatePerson(updated);
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0F172A] w-full max-w-3xl rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white">
        {/* Banner */}
        <div className="p-6 bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] border-b border-white/10 flex items-start justify-between relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-200 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shrink-0 border-2 border-white/30">
              {person.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30">
                  Gen {person.generation} • {person.familyClan} Family
                </span>
                {person.isDeceased ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[11px] border border-slate-700 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>In Sacred Memory</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 font-bold text-[11px] border border-emerald-500/30">
                    Living Member
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {person.name}
              </h2>
              <p className="text-base font-serif text-amber-400">
                {person.hebrewName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 z-10">
            {person.canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all border border-white/10"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Full English Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Hebrew Name</label>
                  <input
                    type="text"
                    value={formData.hebrewName}
                    onChange={e => setFormData({ ...formData, hebrewName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Village of Origin</label>
                  <input
                    type="text"
                    value={formData.villageOfOrigin}
                    onChange={e => setFormData({ ...formData, villageOfOrigin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Current Community / Town</label>
                  <input
                    type="text"
                    value={formData.community}
                    onChange={e => setFormData({ ...formData, community: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Regional Council</label>
                  <input
                    type="text"
                    value={formData.regionalCouncil}
                    onChange={e => setFormData({ ...formData, regionalCouncil: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Occupation / Calling</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Biography & Life Story</label>
                <textarea
                  rows={4}
                  value={formData.biography}
                  onChange={e => setFormData({ ...formData, biography: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Deceased Memorial Badge & Action */}
              {person.isDeceased && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <Flame className="w-8 h-8 text-amber-400 animate-pulse shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Sacred Yahrzeit Memorial Sanctuary
                      </h4>
                      <p className="text-xs text-amber-200/90">
                        Passing: {person.passingDate} ({person.hebrewPassingDate})
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLightCandle}
                    disabled={isCandleLit}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg shrink-0 ${
                      isCandleLit
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 cursor-default'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    <span>{isCandleLit ? '🕯️ Memorial Candle Burning' : 'Light Virtual Yizkor Candle'}</span>
                  </button>
                </div>
              )}

              {/* Grid Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Birth Date</span>
                  <p className="text-xs font-bold text-white">{person.birthDate}</p>
                  <p className="text-[11px] text-amber-300 font-serif">{person.hebrewBirthDate}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Village of Origin</span>
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{person.villageOfOrigin}</span>
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Current Community</span>
                  <p className="text-xs font-bold text-white">{person.community}</p>
                  <p className="text-[11px] text-slate-400">{person.regionalCouncil}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Calling / Occupation</span>
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    <span>{person.occupation}</span>
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Aliyah Status</span>
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {person.aliyahStatus}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Family Role</span>
                  <p className="text-xs font-bold text-white">{person.familyRole}</p>
                </div>
              </div>

              {/* Biography */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Life Biography & Legacy</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {person.biography}
                </p>
              </div>

              {/* Achievements */}
              {person.achievements && person.achievements.length > 0 && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    <span>Key Milestones & Contributions</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                    {person.achievements.map((ach, idx) => (
                      <li key={idx} className="leading-relaxed">{ach}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Contextual Actions Bar (Reusing AI Rabbi without chatbot embed) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Rabbi Contextual Heritage Insights</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => onTriggerAIInsight(
                      'relationship',
                      `Kinship Significance: ${person.name}`,
                      person.name,
                      person.hebrewName,
                      `Role: ${person.familyRole} in family ${person.familyClan}`
                    )}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-semibold text-slate-200 flex items-center justify-between transition-all"
                  >
                    <span>💡 Explain family relationship</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <button
                    onClick={() => onTriggerAIInsight(
                      'name',
                      `Hebrew Name Etymology: ${person.hebrewName}`,
                      person.name,
                      person.hebrewName,
                      person.villageOfOrigin
                    )}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-semibold text-slate-200 flex items-center justify-between transition-all"
                  >
                    <span>📜 Explain Hebrew name</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <button
                    onClick={() => onTriggerAIInsight(
                      'migration',
                      `Migration Journey: ${person.villageOfOrigin} → ${person.community}`,
                      person.name,
                      person.hebrewName,
                      `${person.villageOfOrigin} to ${person.community}`
                    )}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-semibold text-slate-200 flex items-center justify-between transition-all"
                  >
                    <span>🗺️ Explain historical migration</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <button
                    onClick={() => onTriggerAIInsight(
                      'village',
                      `Village Archives: ${person.villageOfOrigin}`,
                      person.villageOfOrigin,
                      undefined,
                      `Located in Northeast India / Israel`
                    )}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-semibold text-slate-200 flex items-center justify-between transition-all"
                  >
                    <span>🏡 Learn about village ({person.villageOfOrigin})</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>{person.canEdit ? 'Permissions: Family Admin (Editable)' : 'Permissions: Read-Only View'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
