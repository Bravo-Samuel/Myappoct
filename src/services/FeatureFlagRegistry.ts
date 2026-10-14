import { FeatureFlagConfig, InstalledPluginSpec } from '../types';

class EnterpriseConfigRegistry {
  private featureFlags: FeatureFlagConfig[] = [];
  private installedPlugins: InstalledPluginSpec[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.initializeFlags();
    this.initializePlugins();
  }

  private initializeFlags() {
    this.featureFlags = [
      {
        key: 'FLAG_AI_RAG_V2',
        name: 'Gemini 3.5 RAG Halachic Engine V2',
        description: 'Next-generation retrieval augmented generation with multi-source Talmudic citations in Mizo & Kuki.',
        status: 'GLOBAL_RELEASE',
        rolloutPercentage: 100,
        targetRegions: ['MANIPUR_IN', 'MIZORAM_IN', 'ISRAEL_NORTH', 'DIASPORA'],
        minimumRole: 'Member',
        isEmergencyKillSwitchActive: false
      },
      {
        key: 'FLAG_SYNAGOGUE_MINYAN_AUTO_PAGER',
        name: 'Automated Geofenced Minyan Pager',
        description: 'Triggers SMS/WhatsApp alerts when synagogue attendees drop below 10 within 15 mins of Shkiah.',
        status: 'REGIONAL_ROLLOUT',
        rolloutPercentage: 75,
        targetRegions: ['MANIPUR_IN', 'ISRAEL_NORTH'],
        minimumRole: 'Synagogue Admin',
        isEmergencyKillSwitchActive: false
      },
      {
        key: 'FLAG_ALIYAH_DOCUMENT_OCR',
        name: 'Aliyah Lineage Verification OCR Engine',
        description: 'Automated Hebrew/English document verification against Jewish Agency ancestral requirements.',
        status: 'BETA_USERS',
        rolloutPercentage: 30,
        targetRegions: ['MANIPUR_IN', 'MIZORAM_IN'],
        minimumRole: 'Family Admin',
        isEmergencyKillSwitchActive: false
      },
      {
        key: 'FLAG_LIVE_STREAM_MINYAN_VOICE',
        name: 'Real-Time Voice Translation for Prayer Streams',
        description: 'Live audio translation bridging Hebrew tefillot to Mizo and Thadou-Kuki dialects.',
        status: 'INTERNAL_TESTING',
        rolloutPercentage: 15,
        targetRegions: ['ISRAEL_NORTH'],
        minimumRole: 'Super Admin',
        isEmergencyKillSwitchActive: false
      },
      {
        key: 'FLAG_LEGACY_CSV_IMPORT',
        name: 'Legacy CSV Community Roster Import',
        description: 'Deprecated bulk upload tool for unvalidated Excel sheets.',
        status: 'EMERGENCY_DISABLED',
        rolloutPercentage: 0,
        targetRegions: [],
        minimumRole: 'Super Admin',
        isEmergencyKillSwitchActive: true
      }
    ];
  }

  private initializePlugins() {
    this.installedPlugins = [
      {
        id: 'PLG-GENEALOGY-01',
        name: 'Bnei Menashe Ancestral Tree & Tribe Matcher',
        version: '2.4.0',
        category: 'Genealogy',
        author: 'Heritage Core Labs',
        status: 'ACTIVE',
        permissionsGranted: ['can_manage_family_tree', 'can_view_public_zmanim'],
        registeredHooks: ['onUserRegister', 'onFamilyTreeUpdate', 'onYahrzeitDailyScan'],
        description: 'Maps multi-generational lineages connecting Mizoram/Manipur clans to Menashe tribal roots.'
      },
      {
        id: 'PLG-ALIYAH-02',
        name: 'Aliyah Portal & Jewish Agency Liaison Hub',
        version: '1.8.2',
        category: 'Aliyah Portal',
        author: 'Israel Aliya Council',
        status: 'ACTIVE',
        permissionsGranted: ['can_manage_family_tree', 'can_update_regional_halacha'],
        registeredHooks: ['onAliyahStatusChange', 'onDocumentUpload'],
        description: 'Tracks visa clearances, absorption centers in Nof HaGalil, and language assimilation.'
      },
      {
        id: 'PLG-ACADEMY-03',
        name: 'Hebrew & Halacha Learning Academy',
        version: '3.1.0',
        category: 'Hebrew Learning Academy',
        author: 'Torah Education Network',
        status: 'ACTIVE',
        permissionsGranted: ['can_query_ai_rabbi', 'can_view_public_zmanim'],
        registeredHooks: ['onDafYomiComplete', 'onParashahQuizSubmit'],
        description: 'Gamified Hebrew vocabulary and Shulchan Aruch mastery modules with community leaderboards.'
      },
      {
        id: 'PLG-DONATIONS-04',
        name: 'Synagogue Tzedakah & Building Fund Engine',
        version: '2.0.1',
        category: 'Donations',
        author: 'Enterprise FinOps',
        status: 'ACTIVE',
        permissionsGranted: ['can_manage_saas_billing'],
        registeredHooks: ['onPaymentReceived', 'onInvoiceGenerate'],
        description: 'Multi-currency (INR, ILS, USD) tithe processor with transparent community ledger.'
      },
      {
        id: 'PLG-YOUTH-05',
        name: 'Bnei Menashe Youth Leadership Circle',
        version: '1.2.0',
        category: 'Youth Programs',
        author: 'Shabbat Youth Org',
        status: 'SANDBOXED',
        permissionsGranted: ['can_view_public_zmanim'],
        registeredHooks: ['onEventSchedule'],
        description: 'Manages regional Shabbat shabbaton camps and youth mentorship pairs.'
      }
    ];
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getFeatureFlags(): FeatureFlagConfig[] {
    return this.featureFlags;
  }

  public getInstalledPlugins(): InstalledPluginSpec[] {
    return this.installedPlugins;
  }

  public toggleFeatureFlag(key: string, newStatus?: FeatureFlagConfig['status']): FeatureFlagConfig | undefined {
    const flag = this.featureFlags.find(f => f.key === key);
    if (flag) {
      if (newStatus) {
        flag.status = newStatus;
        flag.isEmergencyKillSwitchActive = newStatus === 'EMERGENCY_DISABLED';
      } else {
        // Toggle kill switch
        flag.isEmergencyKillSwitchActive = !flag.isEmergencyKillSwitchActive;
        flag.status = flag.isEmergencyKillSwitchActive ? 'EMERGENCY_DISABLED' : 'GLOBAL_RELEASE';
      }
      this.notify();
    }
    return flag;
  }

  public togglePluginStatus(id: string): InstalledPluginSpec | undefined {
    const plugin = this.installedPlugins.find(p => p.id === id);
    if (plugin) {
      if (plugin.status === 'ACTIVE') plugin.status = 'SANDBOXED';
      else if (plugin.status === 'SANDBOXED') plugin.status = 'DISABLED';
      else plugin.status = 'ACTIVE';
      this.notify();
    }
    return plugin;
  }
}

export const featureFlagRegistry = new EnterpriseConfigRegistry();
