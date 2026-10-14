import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { RightSidebar } from './components/RightSidebar';
import { BottomQuickActions } from './components/BottomQuickActions';
import { CommandPalette } from './components/CommandPalette';
import { DashboardView } from './components/views/DashboardView';
import { UserOnboardingWizard, OnboardingData } from './components/onboarding/UserOnboardingWizard';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ModuleSkeletonLoader } from './components/common/ModuleSkeletonLoader';
import { DatabaseProvider } from './providers/DatabaseProvider';
import { SupabaseAuthProvider, useSupabaseAuth } from './providers/SupabaseAuthProvider';
import { NavSection, SupportedLanguage } from './types';
import { X, Sparkles, Check, CreditCard, ShieldCheck } from 'lucide-react';
import { ZmanimNotificationService } from './services/zmanim/ZmanimNotificationService';

// Lazy-loaded heavy modules for optimal performance & bundle splitting
const CalendarView = lazy(() => import('./components/views/CalendarView').then(m => ({ default: m.CalendarView })));
const HolidaysAndFastsView = lazy(() => import('./components/views/HolidaysAndFastsView').then(m => ({ default: m.HolidaysAndFastsView })));
const ZmanimView = lazy(() => import('./components/views/ZmanimView').then(m => ({ default: m.ZmanimView })));
const TorahLibraryView = lazy(() => import('./components/views/TorahLibraryView').then(m => ({ default: m.TorahLibraryView })));
const AIRabbiView = lazy(() => import('./components/views/AIRabbiView').then(m => ({ default: m.AIRabbiView })));
const CommunityView = lazy(() => import('./components/views/CommunityView').then(m => ({ default: m.CommunityView })));
const FamilyView = lazy(() => import('./components/views/FamilyView').then(m => ({ default: m.FamilyView })));
const MemorialBoardView = lazy(() => import('./components/views/MemorialBoardView').then(m => ({ default: m.MemorialBoardView })));
const SaaSAnalyticsView = lazy(() => import('./components/views/SaaSAnalyticsView').then(m => ({ default: m.SaaSAnalyticsView })));
const EnterpriseAdminView = lazy(() => import('./components/views/EnterpriseAdminView').then(m => ({ default: m.EnterpriseAdminView })));
const EnterpriseObservabilityCenter = lazy(() => import('./components/views/EnterpriseObservabilityCenter').then(m => ({ default: m.EnterpriseObservabilityCenter })));
const Phase3GovernanceBoardView = lazy(() => import('./components/views/Phase3GovernanceBoardView').then(m => ({ default: m.Phase3GovernanceBoardView })));
const SupabaseFoundationConsoleView = lazy(() => import('./components/views/SupabaseFoundationConsoleView').then(m => ({ default: m.SupabaseFoundationConsoleView })));
const AuthPortalView = lazy(() => import('./components/views/AuthPortalView').then(m => ({ default: m.AuthPortalView })));
const ScalableAppArchitectureView = lazy(() => import('./components/views/ScalableAppArchitectureView').then(m => ({ default: m.ScalableAppArchitectureView })));
const RegionalCouncilPortalView = lazy(() => import('./components/views/RegionalCouncilPortalView').then(m => ({ default: m.RegionalCouncilPortalView })));
const GlobalAdminConsoleView = lazy(() => import('./components/views/GlobalAdminConsoleView').then(m => ({ default: m.GlobalAdminConsoleView })));
const ProfileView = lazy(() => import('./components/views/ProfileView').then(m => ({ default: m.ProfileView })));
const FamilyPurityView = lazy(() => import('./components/views/FamilyPurityView').then(m => ({ default: m.FamilyPurityView })));
const CensusDemographicsView = lazy(() => import('./components/views/CensusDemographicsView').then(m => ({ default: m.CensusDemographicsView })));
const ActivityCenterView = lazy(() => import('./components/views/ActivityCenterView').then(m => ({ default: m.ActivityCenterView })));
const DocumentCenterView = lazy(() => import('./components/views/DocumentCenterView').then(m => ({ default: m.DocumentCenterView })));
const ServiceCenterView = lazy(() => import('./components/views/ServiceCenterView').then(m => ({ default: m.ServiceCenterView })));
const CommunicationsCenterView = lazy(() => import('./components/views/CommunicationsCenterView').then(m => ({ default: m.CommunicationsCenterView })));
const OperationsCenterView = lazy(() => import('./components/views/OperationsCenterView').then(m => ({ default: m.OperationsCenterView })));
const EnterpriseSystemAdminCenterView = lazy(() => import('./components/views/EnterpriseSystemAdminCenterView').then(m => ({ default: m.EnterpriseSystemAdminCenterView })));
const CommunityLifeEventsRegistryView = lazy(() => import('./components/views/CommunityLifeEventsRegistryView').then(m => ({ default: m.CommunityLifeEventsRegistryView })));
const MyJourneyView = lazy(() => import('./components/views/MyJourneyView').then(m => ({ default: m.MyJourneyView })));

function MainAppContent() {
  const { session, profile, role, updateProfile, isLoadingAuth } = useSupabaseAuth();
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Churachandpur');
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Start background Halachic Notification Engine for local alerts
    if (ZmanimNotificationService.isSupported()) {
      const perm = ZmanimNotificationService.getPermissionState();
      if (perm === 'granted') {
        ZmanimNotificationService.startNotificationEngine();
      } else if (perm === 'default') {
        // Request permission on first launch/location transition to ensure seamless setup
        ZmanimNotificationService.requestPermission().then((granted) => {
          if (granted) {
            ZmanimNotificationService.startNotificationEngine();
          }
        });
      }
    }
    return () => {
      ZmanimNotificationService.stopNotificationEngine();
    };
  }, [currentLocation]);

  useEffect(() => {
    if (session && session.user) {
      const isDoneStorage = localStorage.getItem(`bnei_menashe_onboarding_completed_${session.user.id}`) === 'true';
      const isDoneProfile = profile?.onboarding_completed === true || session.user.user_metadata?.onboarding_completed === true;
      setHasCompletedOnboarding(isDoneStorage || isDoneProfile);
    } else {
      setHasCompletedOnboarding(null);
    }
  }, [session, profile]);

  // Command+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (session && activeSection === 'auth_portal') {
      setActiveSection('dashboard');
    }
  }, [session, activeSection]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-6 font-sans">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-sm font-bold tracking-wider text-slate-300 uppercase">Verifying Enterprise Identity Session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0F172A] text-slate-100' : 'bg-[#FDFBF7] text-slate-900'} font-sans antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col`}>
        <AuthPortalView 
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          language={language}
          onLanguageChange={setLanguage}
        />
      </div>
    );
  }

  if (hasCompletedOnboarding === false) {
    return (
      <UserOnboardingWizard
        profile={profile}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onComplete={async (data: OnboardingData) => {
          if (session?.user?.id) {
            localStorage.setItem(`bnei_menashe_onboarding_completed_${session.user.id}`, 'true');
          }
          setHasCompletedOnboarding(true);
          if (data.language) setLanguage(data.language);
          if (data.location?.district) setCurrentLocation(data.location.district);
          await updateProfile({
            onboarding_completed: true,
            preferred_dialect: data.language,
            onboarding_location: data.location,
            onboarding_interests: data.interests,
            onboarding_notifications: data.notifications
          });
          setActiveSection('dashboard');
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0F172A] text-slate-100' : 'bg-[#FDFBF7] text-slate-900'} font-sans antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col`}>
      <div className="flex flex-1 h-screen overflow-hidden">
        {/* Left Collapsible Navigation Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isOffline={isOffline}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Top Navigation Bar */}
          <TopNav
            currentLocation={currentLocation}
            onLocationChange={setCurrentLocation}
            language={language}
            onLanguageChange={setLanguage}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
            onNavigateAuth={() => setActiveSection('auth_portal')}
            onNavigateProfile={() => setActiveSection('profile')}
            onNavigateActivityCenter={() => setActiveSection('activity_center')}
          />

          {/* Central Workspace + Optional Right Sidebar */}
          <div className="flex flex-1 overflow-hidden relative">
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-amber-500/20 pb-28">
              <ErrorBoundary key={activeSection}>
                <Suspense fallback={<ModuleSkeletonLoader />}>
                  <div className="animate-fade-in transition-all duration-300">
                    {activeSection === 'dashboard' && (
                      <DashboardView locationName={currentLocation} onNavigate={setActiveSection} />
                    )}
                    {activeSection === 'my_journey' && (
                      <MyJourneyView onNavigate={setActiveSection} />
                    )}
                    {activeSection === 'activity_center' && (
                      <ActivityCenterView onNavigate={setActiveSection} />
                    )}
                    {activeSection === 'document_center' && (
                      <DocumentCenterView onNavigate={setActiveSection} />
                    )}
                    {activeSection === 'service_center' && (
                      <ServiceCenterView onNavigate={setActiveSection} />
                    )}
                    {activeSection === 'communications_center' && (
                      <CommunicationsCenterView onNavigate={setActiveSection} />
                    )}
                    {activeSection === 'operations_center' && (
                      (role === 'GLOBAL_ADMIN' || role === 'REGIONAL_GABBAI' || role === 'SYNAGOGUE_RABBI') ? (
                        <OperationsCenterView onNavigate={setActiveSection} />
                      ) : (
                        <DashboardView locationName={currentLocation} onNavigate={setActiveSection} />
                      )
                    )}
                    {activeSection === 'profile' && (
                      <ProfileView onNavigate={setActiveSection} />
                    )}
                    {activeSection === 'calendar' && (
                      <CalendarView />
                    )}
                    {activeSection === 'holidays' && (
                      <HolidaysAndFastsView />
                    )}
                    {activeSection === 'zmanim' && (
                      <ZmanimView currentLocation={currentLocation} onLocationChange={setCurrentLocation} />
                    )}
                    {(activeSection === 'torah_library' || activeSection === 'parashah') && (
                      <TorahLibraryView />
                    )}
                    {activeSection === 'ai_rabbi' && (
                      <AIRabbiView language={language} location={currentLocation} />
                    )}
                    {(activeSection === 'community' || activeSection === 'sanctuary') && (
                      <CommunityView onNavigate={setActiveSection} />
                    )}
                    {activeSection === 'family' && (
                      <FamilyView />
                    )}
                    {activeSection === 'family_purity' && (
                      <FamilyPurityView />
                    )}
                    {activeSection === 'census_demographics' && (
                      <CensusDemographicsView />
                    )}
                    {activeSection === 'lifecycle_registry' && (
                      <CommunityLifeEventsRegistryView onNavigate={setActiveSection} />
                    )}
                    {activeSection === 'memorial' && (
                      <MemorialBoardView />
                    )}
                    {(activeSection === 'analytics' || activeSection === 'donations' || activeSection === 'settings') && (
                      role === 'GLOBAL_ADMIN' || activeSection === 'settings' ? (
                        <SaaSAnalyticsView />
                      ) : (
                        <DashboardView locationName={currentLocation} onNavigate={setActiveSection} />
                      )
                    )}
                    {(activeSection === 'admin_console' || activeSection === 'enterprise_sysadmin' || activeSection === 'security_audit') && (
                      role === 'GLOBAL_ADMIN' ? (
                        <EnterpriseSystemAdminCenterView onNavigate={setActiveSection} />
                      ) : (
                        <DashboardView locationName={currentLocation} onNavigate={setActiveSection} />
                      )
                    )}
                    {activeSection === 'enterprise_dashboard' && (
                      role === 'GLOBAL_ADMIN' ? (
                        <EnterpriseObservabilityCenter />
                      ) : (
                        <DashboardView locationName={currentLocation} onNavigate={setActiveSection} />
                      )
                    )}
                    {activeSection === 'phase3_governance' && (
                      role === 'GLOBAL_ADMIN' ? (
                        <Phase3GovernanceBoardView />
                      ) : (
                        <DashboardView locationName={currentLocation} onNavigate={setActiveSection} />
                      )
                    )}
                    {activeSection === 'supabase_foundation' && (
                      role === 'GLOBAL_ADMIN' ? (
                        <SupabaseFoundationConsoleView />
                      ) : (
                        <DashboardView locationName={currentLocation} onNavigate={setActiveSection} />
                      )
                    )}
                    {activeSection === 'auth_portal' && (
                      <AuthPortalView 
                        isDarkMode={isDarkMode}
                        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        language={language}
                        onLanguageChange={setLanguage}
                      />
                    )}
                    {activeSection === 'scalable_architecture' && (
                      <ScalableAppArchitectureView />
                    )}
                    {activeSection === 'regional_council' && (
                      (role === 'GLOBAL_ADMIN' || role === 'REGIONAL_GABBAI') ? (
                        <RegionalCouncilPortalView />
                      ) : (
                        <DashboardView locationName={currentLocation} onNavigate={setActiveSection} />
                      )
                    )}
                    {activeSection === 'global_admin_console' && (
                      role === 'GLOBAL_ADMIN' ? (
                        <GlobalAdminConsoleView />
                      ) : (
                        <DashboardView locationName={currentLocation} onNavigate={setActiveSection} />
                      )
                    )}
                    {activeSection === 'settings' && (
                      <ProfileView onNavigate={setActiveSection} />
                    )}
                  </div>
                </Suspense>
              </ErrorBoundary>
            </main>

            {/* Right Sidebar for Astronomical Zmanim & Countdown (Visible on large screens during Dashboard/Zmanim) */}
            {(activeSection === 'dashboard' || activeSection === 'calendar') && (
              <div className="hidden xl:block">
                <RightSidebar
                  locationName={currentLocation}
                  onNavigateToZmanim={() => setActiveSection('zmanim')}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Quick Actions Dock */}
      <BottomQuickActions onSelectSection={setActiveSection} />

      {/* Command Palette Modal (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectSection={setActiveSection}
      />

      {/* Subscription Upgrade Modal */}
      {isSubscriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-300 dark:border-slate-800 relative">
            <button
              onClick={() => setIsSubscriptionModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Workspace Upgrade</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              Unlock Family & Synagogue PRO
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Empower your family and regional council with unlimited Gemini AI Rabbi queries, genealogy tree archiving, and offline PWA sync.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 space-y-2.5">
              {[
                "Unlimited Gemini 3.5 AI Rabbi Q&A & Voice Chanting",
                "Shared Bnei Menashe Genealogy Tree & Memorial Board",
                "Full Offline PWA Support for Churachandpur & Hills",
                "Synagogue Push Notifications & Minyan broadcasting"
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">$12<span className="text-xs font-normal text-slate-500">/mo</span></div>
                <div className="text-[10px] text-emerald-600 font-bold">Billed annually • 30-day trial</div>
              </div>
              <button
                onClick={() => {
                  setIsSubscriptionModalOpen(false);
                  setActiveSection('analytics');
                }}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-transform hover:scale-105 shadow-md flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Confirm Family Upgrade</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <DatabaseProvider>
      <SupabaseAuthProvider>
        <MainAppContent />
      </SupabaseAuthProvider>
    </DatabaseProvider>
  );
}
