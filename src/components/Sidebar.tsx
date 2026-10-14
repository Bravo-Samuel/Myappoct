import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Sun, 
  Sparkles, 
  BookOpen, 
  Flame, 
  Landmark, 
  Library, 
  Bot, 
  Users, 
  HeartHandshake, 
  BarChart2,
  BarChart3, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  ShieldAlert,
  Crown,
  Terminal,
  Shield,
  User,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  LogIn,
  UserPlus,
  Moon,
  Droplet,
  Fingerprint,
  Activity,
  FolderLock,
  Building2,
  Radio,
  Megaphone,
  Cpu,
  Award,
  Compass
} from 'lucide-react';
import { NavSection } from '../types';
import { useSupabaseAuth } from '../providers/SupabaseAuthProvider';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOffline: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  isOffline
}) => {
  const { session, user, profile, role, signOut } = useSupabaseAuth();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    if (isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountMenuOpen]);

  const isAuthenticated = Boolean(session?.user || (user && role !== 'ANONYMOUS'));

  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'Samuel Haokip';
  const email = profile?.email || user?.email || 'samuel.haokip@bneimenashe.org';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || null;

  const getInitials = (name?: string | null, emailAddr?: string | null) => {
    if (name) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (emailAddr) {
      return emailAddr.slice(0, 2).toUpperCase();
    }
    return 'BM';
  };

  const initials = getInitials(fullName, email);

  const formatRoleBadge = (userRole: string) => {
    switch (userRole) {
      case 'GLOBAL_ADMIN': return 'Global Admin';
      case 'REGIONAL_GABBAI': return 'Gabbai';
      case 'SYNAGOGUE_RABBI': return 'Rabbi';
      case 'MEMBER': return 'Pro Member';
      default: return 'Member';
    }
  };

  const roleBadge = formatRoleBadge(role);
  const userSubtitle = profile?.onboarding_location?.district || profile?.onboarding_location?.community || profile?.preferred_dialect || 'Bnei Menashe';
  const navItems: { id: NavSection; label: string; icon: React.ReactNode; badge?: string; isSpecial?: boolean }[] = [
    { id: 'dashboard', label: 'Community Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'my_journey', label: 'My Journey (Derech Chaim)', icon: <Compass className="w-5 h-5 text-amber-400" />, badge: 'JOURNEY' },
    { id: 'profile', label: 'Community Identity', icon: <Fingerprint className="w-5 h-5 text-amber-400" />, badge: 'ID' },
    { id: 'document_center', label: 'Community Documents', icon: <FolderLock className="w-5 h-5 text-amber-400" />, badge: 'VAULT' },
    { id: 'service_center', label: 'Community Services', icon: <Building2 className="w-5 h-5 text-amber-400" />, badge: 'SUPPORT' },
    { id: 'communications_center', label: 'Official Broadcasts', icon: <Megaphone className="w-5 h-5 text-amber-400" />, badge: 'OFFICIAL' },
    { id: 'operations_center', label: 'Community Operations', icon: <Radio className="w-5 h-5 text-amber-400 animate-pulse" />, badge: 'CONTROL', isSpecial: true },
    { id: 'activity_center', label: 'Community Records & Activity', icon: <Activity className="w-5 h-5 text-emerald-400" />, badge: 'LIVE' },
    { id: 'calendar', label: 'Community Calendar (5786)', icon: <CalendarIcon className="w-5 h-5" />, badge: '5786' },
    { id: 'zmanim', label: 'Zmanim & Local GPS', icon: <Sun className="w-5 h-5" /> },
    { id: 'holidays', label: 'Holidays & Fasts', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'parashah', label: 'Parashah & Study', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'torah_library', label: 'Torah Library & Heritage', icon: <Library className="w-5 h-5" /> },
    { id: 'ai_rabbi', label: 'AI Rabbi & Guidance', icon: <Bot className="w-5 h-5 text-amber-500" />, badge: 'AI', isSpecial: true },
    { id: 'sanctuary', label: 'Synagogues & Sanctuaries', icon: <Landmark className="w-5 h-5" /> },
    { id: 'memorial', label: 'Memorial Sanctuary', icon: <Flame className="w-5 h-5 text-amber-400" /> },
    { id: 'family_purity', label: 'Taharat HaMishpacha', icon: <Droplet className="w-5 h-5 text-amber-400 fill-amber-400/20" />, badge: 'SACRED' },
    { id: 'community', label: 'Community Members Hub', icon: <Users className="w-5 h-5" /> },
    { id: 'census_demographics', label: 'Community Census', icon: <BarChart2 className="w-5 h-5 text-amber-400" />, badge: 'CENSUS', isSpecial: true },
    { id: 'family', label: 'Lineage & Heritage Tree', icon: <HeartHandshake className="w-5 h-5" /> },
    { id: 'lifecycle_registry', label: 'Lifecycle Registry', icon: <Award className="w-5 h-5 text-amber-400" />, badge: 'REGISTRY' },
    { id: 'regional_council', label: 'Regional Council Portal', icon: <Shield className="w-5 h-5 text-purple-400" />, badge: 'GOV', isSpecial: true },
    { id: 'global_admin_console', label: 'Community Governance', icon: <Crown className="w-5 h-5 text-amber-400" />, badge: 'GOVERNMENT', isSpecial: true },
    { id: 'enterprise_sysadmin', label: 'Infrastructure Control', icon: <Cpu className="w-5 h-5 text-amber-400 animate-pulse" />, isSpecial: true },
    { id: 'analytics', label: 'Community Analytics', icon: <BarChart3 className="w-5 h-5 text-blue-500" /> },
    { id: 'admin_console', label: 'Technical Governance', icon: <Terminal className="w-5 h-5 text-emerald-400" />, isSpecial: true },
    { id: 'settings', label: 'Community Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const allowedNavItems = navItems.filter((item) => {
    // Only administrators can see administration/dev items
    if (['enterprise_sysadmin', 'admin_console', 'global_admin_console', 'analytics'].includes(item.id)) {
      return role === 'GLOBAL_ADMIN';
    }
    if (item.id === 'regional_council') {
      return role === 'GLOBAL_ADMIN' || role === 'REGIONAL_GABBAI';
    }
    if (item.id === 'operations_center') {
      return role === 'GLOBAL_ADMIN' || role === 'REGIONAL_GABBAI' || role === 'SYNAGOGUE_RABBI';
    }
    return true;
  });

  return (
    <aside 
      className={`relative flex flex-col transition-all duration-300 ease-in-out border-r border-amber-500/10 dark:border-slate-800 bg-[#0A1128] text-slate-200 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      } z-50 shadow-2xl shrink-0`}
    >
      {/* Brand Logo Header */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => onSelectSection('dashboard')}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 shadow-lg shadow-amber-500/20 shrink-0">
              <Crown className="w-6 h-6 text-slate-950" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold tracking-wider text-amber-400 uppercase truncate">
                Bnei Menashe
              </span>
              <span className="text-xs font-medium tracking-tight text-slate-300 truncate">
                Sacred Calendar
              </span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex items-center justify-center w-full cursor-pointer" onClick={() => onSelectSection('dashboard')}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md">
              <Crown className="w-6 h-6 text-slate-950" />
            </div>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Workspace Switcher */}
      {!isCollapsed && (
        <div className="p-3 mx-3 mt-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-300 font-semibold flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isOffline ? 'bg-amber-500' : 'bg-emerald-400'}`}></span>
              Family Workspace
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider">
              PRO
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">Churachandpur & Israel Hub</p>
        </div>
      )}

      {/* Offline Status Badge */}
      {isOffline && !isCollapsed && (
        <div className="mx-3 mt-2 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300 animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>Offline PWA Active</span>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        {allowedNavItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-400 border-l-2 border-amber-500 shadow-sm'
                  : item.isSpecial
                  ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 border border-amber-500/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-amber-400' : 'text-slate-400'}`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                  item.badge === 'AI' 
                    ? 'bg-amber-500 text-slate-950 animate-pulse' 
                    : 'bg-white/10 text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
              {/* Tooltip for collapsed view */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-slate-100 text-xs font-medium rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-slate-700">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile / Account Card */}
      {!isAuthenticated ? (
        <div className="p-3 border-t border-white/10 bg-[#0A1128] relative" ref={accountMenuRef}>
          {isCollapsed ? (
            <>
              {isAccountMenuOpen && (
                <div className="absolute left-full bottom-3 ml-3 w-56 p-3 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl backdrop-blur-xl z-[100] space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Guest Access</div>
                      <div className="text-[10px] text-slate-400">Sign in for cloud sync</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => { setIsAccountMenuOpen(false); onSelectSection('auth_portal'); }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => { setIsAccountMenuOpen(false); onSelectSection('auth_portal'); }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs border border-white/10 transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Create Account</span>
                    </button>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                title="Guest Access • Sign In"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-400 transition-all shadow-sm mx-auto"
              >
                <User className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">Guest Access</div>
                  <div className="text-[10px] text-slate-400 truncate">Not signed in</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => onSelectSection('auth_portal')}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold shadow-xs transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSection('auth_portal')}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-[11px] font-semibold border border-white/10 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 border-t border-white/10 relative" ref={accountMenuRef}>
          {/* Floating Account Menu */}
          {isAccountMenuOpen && (
            <div
              className={`absolute z-[100] p-2 rounded-2xl bg-[#0F172A]/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl animate-fade-in ${
                isCollapsed
                  ? 'left-full bottom-2 ml-3 w-60'
                  : 'bottom-full left-3 right-3 mb-2'
              }`}
            >
              <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white truncate">{fullName}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider shrink-0">
                    {roleBadge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{email || 'Authenticated Account'}</div>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => { onSelectSection('profile'); setIsAccountMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Fingerprint className="w-4 h-4 text-amber-400" />
                  <span>Citizen Digital ID</span>
                </button>

                <button
                  onClick={() => { onSelectSection('document_center'); setIsAccountMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <FolderLock className="w-4 h-4 text-amber-400" />
                  <span>Digital Document Center</span>
                </button>

                <button
                  onClick={() => { onSelectSection('service_center'); setIsAccountMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Community Service Center</span>
                </button>

                <button
                  onClick={() => { onSelectSection('operations_center'); setIsAccountMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-amber-300 hover:text-white hover:bg-amber-500/10 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Operations Command</span>
                  </span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">LIVE</span>
                </button>

                <button
                  onClick={() => { onSelectSection('activity_center'); setIsAccountMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-slate-400" />
                    <span>Notifications</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                </button>

                <button
                  onClick={() => { onSelectSection('analytics'); setIsAccountMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Subscription</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-300/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    {role === 'GLOBAL_ADMIN' ? 'SUPER' : 'PRO'}
                  </span>
                </button>

                <button
                  onClick={() => { onSelectSection('settings'); setIsAccountMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Community Settings</span>
                </button>

                <button
                  onClick={() => { onSelectSection('community'); setIsAccountMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Community Support</span>
                </button>
              </div>

              <div className="border-t border-white/10 my-1 pt-1">
                <button
                  onClick={async () => {
                    setIsAccountMenuOpen(false);
                    await signOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* Account Card Button */}
          {isCollapsed ? (
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              title={`${fullName} • ${roleBadge}`}
              className={`relative shrink-0 p-1 rounded-2xl transition-all mx-auto block ${
                isAccountMenuOpen ? 'ring-2 ring-amber-400 bg-white/10' : 'hover:ring-2 hover:ring-white/20'
              }`}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-9 h-9 rounded-full object-cover border border-amber-500/30 shadow-sm"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
                  {initials}
                </div>
              )}
              <span className={`absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-[#0A1128] ${isOffline ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all duration-200 group border ${
                isAccountMenuOpen
                  ? 'bg-white/10 border-amber-500/50 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 shadow-xs'
              }`}
            >
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-9 h-9 rounded-full object-cover border border-amber-500/30 shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
                    {initials}
                  </div>
                )}
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0A1128] shadow-xs ${isOffline ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                    {fullName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-medium text-slate-400 truncate max-w-[95px]">
                    {userSubtitle}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider shrink-0">
                    {roleBadge}
                  </span>
                </div>
              </div>
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
