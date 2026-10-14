import { 
  EnterpriseRole, 
  GranularPermission, 
  AuditLogRecord, 
  ApiEndpointSpec, 
  DbTableSpec, 
  NotificationDispatchRecord 
} from '../types';

export const ENTERPRISE_ROLES: EnterpriseRole[] = [
  'Guest',
  'Member',
  'Premium',
  'Family Admin',
  'Synagogue Admin',
  'Regional Council Admin',
  'Content Editor',
  'Moderator',
  'Support',
  'System Administrator',
  'DevOps',
  'Super Admin'
];

export const GRANULAR_PERMISSIONS_CATALOG: GranularPermission[] = [
  { key: 'can_view_public_zmanim', label: 'View Public Zmanim & Calendar', category: 'Halacha & Content', description: 'Access astronomical solar times and standard lunar phases.' },
  { key: 'can_query_ai_rabbi', label: 'Query Gemini AI Rabbi', category: 'AI Control', description: 'Invoke real-time GenAI Q&A and translation pipelines.' },
  { key: 'can_manage_family_tree', label: 'Manage Family Memorial Tree', category: 'Tenancy', description: 'Create and modify Bnei Menashe ancestral lineages and yahrzeit boards.' },
  { key: 'can_broadcast_minyan', label: 'Broadcast Synagogue Minyan Alerts', category: 'Tenancy', description: 'Push urgent minyan calls to local township subscribers.' },
  { key: 'can_update_regional_halacha', label: 'Approve Regional Council Customs', category: 'Halacha & Content', description: 'Lock halachic zmanim offsets for Churachandpur, Aizawl, or Kiryat Arba.' },
  { key: 'can_audit_security_logs', label: 'Inspect Security & Audit Logs', category: 'Security & Audit', description: 'Full read access to immutable security trails and login IP records.' },
  { key: 'can_manage_saas_billing', label: 'Manage Enterprise SaaS Billing', category: 'System', description: 'Upgrade council tiers, issue Stripe/Supabase invoices, and manage quota limits.' },
  { key: 'can_configure_cloud_engine', label: 'Modify Infrastructure & Rate Limits', category: 'System', description: 'Super Admin access to CDN caching, JWT expiration, and database migrations.' }
];

export const ROLE_PERMISSION_MAPPINGS: Record<EnterpriseRole, string[]> = {
  'Guest': ['can_view_public_zmanim'],
  'Member': ['can_view_public_zmanim', 'can_query_ai_rabbi'],
  'Premium': ['can_view_public_zmanim', 'can_query_ai_rabbi', 'can_manage_family_tree'],
  'Family Admin': ['can_view_public_zmanim', 'can_query_ai_rabbi', 'can_manage_family_tree'],
  'Synagogue Admin': ['can_view_public_zmanim', 'can_query_ai_rabbi', 'can_manage_family_tree', 'can_broadcast_minyan'],
  'Regional Council Admin': ['can_view_public_zmanim', 'can_query_ai_rabbi', 'can_manage_family_tree', 'can_broadcast_minyan', 'can_update_regional_halacha'],
  'Content Editor': ['can_view_public_zmanim', 'can_query_ai_rabbi', 'can_update_regional_halacha'],
  'Moderator': ['can_view_public_zmanim', 'can_query_ai_rabbi', 'can_broadcast_minyan'],
  'Support': ['can_view_public_zmanim', 'can_audit_security_logs'],
  'System Administrator': ['can_view_public_zmanim', 'can_query_ai_rabbi', 'can_audit_security_logs', 'can_configure_cloud_engine'],
  'DevOps': ['can_view_public_zmanim', 'can_audit_security_logs', 'can_configure_cloud_engine'],
  'Super Admin': ['can_view_public_zmanim', 'can_query_ai_rabbi', 'can_manage_family_tree', 'can_broadcast_minyan', 'can_update_regional_halacha', 'can_audit_security_logs', 'can_manage_saas_billing', 'can_configure_cloud_engine']
};

export const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'AUD-9942',
    timestamp: '2026-07-02 16:18:04 UTC',
    user: { name: 'Rabbi Yosef Haokip', email: 'yosef.haokip@bneimenashe.org', role: 'Regional Council Admin' },
    ipAddress: '103.211.54.18 (Manipur, IN)',
    device: 'Chrome / macOS Sonoma',
    action: 'BROADCAST_SHABBAT_ZMANIM',
    category: 'HALACHA',
    previousValue: 'Candle Lighting 17:42',
    newValue: 'Candle Lighting 17:42 (Locked with 18-min Churachandpur Chumra)',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-9941',
    timestamp: '2026-07-02 16:15:22 UTC',
    user: { name: 'Aaron Kipgen', email: 'aaron.k@telaviv-bnei.il', role: 'Synagogue Admin' },
    ipAddress: '84.228.19.102 (Nof HaGalil, IL)',
    device: 'Safari / iOS 18.2',
    action: 'MINYAN_PUSH_DISPATCH',
    category: 'TENANT',
    previousValue: 'Mincha Attendees: 8',
    newValue: 'Push notification sent to 142 members within 3km radius',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-9940',
    timestamp: '2026-07-02 16:12:10 UTC',
    user: { name: 'System Security Watchdog', email: 'secops@cloud.bneimenashe.org', role: 'Super Admin' },
    ipAddress: 'Internal VPC Cluster 10.0.4.12',
    device: 'Cloudflare Edge Gateway',
    action: 'RATE_LIMIT_ENFORCED',
    category: 'SECURITY',
    previousValue: '60 req/min limit',
    newValue: 'Blocked IP 185.220.101.44 after 140 attempts on /api/v1/auth/magic-link',
    status: 'BLOCKED'
  },
  {
    id: 'AUD-9939',
    timestamp: '2026-07-02 16:08:45 UTC',
    user: { name: 'Miriam Lhungdim', email: 'miriam@aizawl-community.org', role: 'Family Admin' },
    ipAddress: '49.36.128.91 (Aizawl, IN)',
    device: 'Firefox / Windows 11',
    action: 'UPGRADE_SUBSCRIPTION_TIER',
    category: 'BILLING',
    previousValue: 'Tier: Free Community Access',
    newValue: 'Tier: Family Heritage PRO ($12/mo annual billing)',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-9938',
    timestamp: '2026-07-02 15:55:19 UTC',
    user: { name: 'Gemini 3.5 AI Router', email: 'gemini-service@ai.bneimenashe.org', role: 'Super Admin' },
    ipAddress: 'us-central1-gcp-ai',
    device: 'Google DeepMind TPU v5e',
    action: 'HALACHIC_QA_INVOCATION',
    category: 'AI_QUERY',
    previousValue: 'Prompt: Daf Yomi Bava Batra 14a summary in Thadou-Kuki',
    newValue: 'Generated 420-token bilingual summary verified with Kashrut engine',
    status: 'SUCCESS'
  }
];

export const DATABASE_SCHEMA_BLUEPRINTS: DbTableSpec[] = [
  {
    tableName: 'organizations_tenants',
    description: 'Top-level enterprise tenancy table supporting regional councils, synagogues, and family clusters.',
    rowCountEstimate: '1,250+ Councils & Synagogues',
    columns: [
      { name: 'id', type: 'UUID', isPrimaryKey: true, description: 'Unique tenant identifier (UUID v4)' },
      { name: 'name', type: 'VARCHAR(255)', description: 'Official name (e.g., Churachandpur Central Synagogue Council)' },
      { name: 'region_code', type: 'VARCHAR(50)', description: 'Geographic cluster (MANIPUR_IN, MIZORAM_IN, ISRAEL_NORTH, DIASPORA)' },
      { name: 'subscription_tier', type: 'ENUM', description: 'Current active SaaS tier (FREE, FAMILY_PRO, SYNAGOGUE_ENTERPRISE)' },
      { name: 'halachic_authority', type: 'VARCHAR(100)', description: 'Designated posek or custom rule engine ID' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'ISO-8601 timestamp with timezone' }
    ],
    indexes: ['idx_org_region_code', 'idx_org_sub_tier']
  },
  {
    tableName: 'users_auth_profiles',
    description: 'Multi-auth user records with granular RBAC assignment and MFA security keys.',
    rowCountEstimate: '65,000+ Active Members',
    columns: [
      { name: 'id', type: 'UUID', isPrimaryKey: true, description: 'Global unique user identifier' },
      { name: 'email', type: 'VARCHAR(255)', description: 'Primary login email (Indexed, Unique)' },
      { name: 'password_hash', type: 'VARCHAR(255)', isNullable: true, description: 'Argon2id salted password hash (if not OAuth/Magic link)' },
      { name: 'rbac_role', type: 'ENUM', description: 'EnterpriseRole enum value' },
      { name: 'org_tenant_id', type: 'UUID', isForeignKey: true, description: 'FK to organizations_tenants.id' },
      { name: 'mfa_enabled', type: 'BOOLEAN', description: 'True if TOTP / WebAuthn 2FA is active' },
      { name: 'last_login_at', type: 'TIMESTAMPTZ', description: 'Last authentication timestamp' }
    ],
    indexes: ['idx_users_email_unique', 'idx_users_tenant_role']
  },
  {
    tableName: 'astronomical_zmanim_cache',
    description: 'High-speed precomputed solar and lunar calculation cache indexed by coordinate cell.',
    rowCountEstimate: '3.6M Daily Cached Intervals',
    columns: [
      { name: 'cell_geohash', type: 'VARCHAR(12)', isPrimaryKey: true, description: 'Geohash spatial index for township location' },
      { name: 'date_utc', type: 'DATE', isPrimaryKey: true, description: 'Calendar date in UTC' },
      { name: 'alot_hashachar', type: 'TIMESTAMPTZ', description: 'Dawn (16.1° below horizon)' },
      { name: 'netz_hachama', type: 'TIMESTAMPTZ', description: 'Exact sea-level sunrise' },
      { name: 'shkiah', type: 'TIMESTAMPTZ', description: 'Sunset (upper limb touching horizon)' },
      { name: 'tzait_hakochavim', type: 'TIMESTAMPTZ', description: 'Nightfall (3 medium stars visible)' }
    ],
    indexes: ['idx_zmanim_geohash_date']
  },
  {
    tableName: 'immutable_audit_logs',
    description: 'Append-only enterprise compliance ledger for security audits and halachic modifications.',
    rowCountEstimate: '14.8M+ Audit Records',
    columns: [
      { name: 'id', type: 'BIGSERIAL', isPrimaryKey: true, description: 'Monotonically increasing 64-bit integer' },
      { name: 'event_uuid', type: 'UUID', description: 'Traceable request correlation ID' },
      { name: 'user_id', type: 'UUID', isForeignKey: true, description: 'FK to users_auth_profiles.id' },
      { name: 'action_type', type: 'VARCHAR(100)', description: 'Event identifier (e.g., LOGIN_SUCCESS, ZMANIM_OVERRIDE)' },
      { name: 'payload_diff_jsonb', type: 'JSONB', description: 'Structured JSONB diff of previous vs new state' },
      { name: 'client_ip', type: 'INET', description: 'Client IP address verified via Cloudflare proxy' },
      { name: 'recorded_at', type: 'TIMESTAMPTZ', description: 'Immutable write timestamp' }
    ],
    indexes: ['idx_audit_user_id', 'idx_audit_action_recorded_at', 'gin_idx_audit_payload_jsonb']
  }
];

export const API_ENDPOINTS_REGISTRY: ApiEndpointSpec[] = [
  {
    method: 'GET',
    path: '/api/v1/zmanim/calculate',
    description: 'Returns real-time astronomical solar times and halachic zmanim for any global coordinate.',
    requiredRole: 'Guest',
    rateLimit: '300 requests / minute per IP',
    caching: 'Edge CDN Cached (TTL: 86400s)',
    responseSchemaPreview: '{ "lat": 24.3333, "lng": 93.6667, "alot": "04:12:00", "netz": "05:08:42", "shkiah": "18:24:10" }'
  },
  {
    method: 'POST',
    path: '/api/v1/ai/rabbi/query',
    description: 'Executes secure Gemini 3.5 Pro halachic Q&A with retrieval augmentation (RAG) and multi-language translation.',
    requiredRole: 'Member',
    rateLimit: '30 requests / minute per User Token',
    caching: 'Semantic Prompt Cache (TTL: 3600s)',
    responseSchemaPreview: '{ "answerText": "According to Shulchan Aruch...", "sources": ["Berachot 26a"], "tokensUsed": 342 }'
  },
  {
    method: 'POST',
    path: '/api/v1/councils/shabbat-broadcast',
    description: 'Dispatches urgent minyan calls or candle lighting push notifications to all township subscribers.',
    requiredRole: 'Synagogue Admin',
    rateLimit: '10 broadcasts / hour per Synagogue Tenant',
    caching: 'No Cache (Real-time Queue)',
    responseSchemaPreview: '{ "jobId": "dispatch_8819", "recipientsTargeted": 420, "channelStatus": "QUEUED" }'
  },
  {
    method: 'GET',
    path: '/api/v1/audit/logs',
    description: 'Queries paginated immutable audit logs filtered by tenant, date range, or action category.',
    requiredRole: 'Support',
    rateLimit: '60 requests / minute per Admin Token',
    caching: 'No Cache (Direct Read Replica)',
    responseSchemaPreview: '{ "totalRecords": 14820, "page": 1, "records": [ ...AuditLogRecord ] }'
  },
  {
    method: 'PUT',
    path: '/api/v1/tenants/subscription',
    description: 'Updates active SaaS subscription tier, Stripe/Supabase billing webhook handler, and seat allocations.',
    requiredRole: 'Super Admin',
    rateLimit: '20 requests / minute',
    caching: 'No Cache (Transactional Write)',
    responseSchemaPreview: '{ "tenantId": "org-3910", "newTier": "SYNAGOGUE_ENTERPRISE", "status": "ACTIVE" }'
  }
];

export const INITIAL_NOTIFICATION_DISPATCHES: NotificationDispatchRecord[] = [
  {
    id: 'NOTIF-801',
    timestamp: 'Today, 16:15',
    channel: 'Push',
    recipientGroup: 'Churachandpur Central Synagogue Members (412 Users)',
    title: '🕯️ Urgent Shabbat Candle Lighting Alert',
    message: 'Candle lighting in Churachandpur is exactly at 17:42. Mincha starts at 17:55.',
    status: 'Delivered'
  },
  {
    id: 'NOTIF-802',
    timestamp: 'Today, 15:30',
    channel: 'WhatsApp',
    recipientGroup: 'Aizawl Youth Torah Study Circle (84 Users)',
    title: '📖 Daf Yomi Reminder: Bava Batra 14a',
    message: 'Join Rabbi Isaac Lhouvum for live stream exposition in Mizo & English at 19:30 IST.',
    status: 'Delivered'
  },
  {
    id: 'NOTIF-803',
    timestamp: 'Scheduled for Tomorrow 06:00',
    channel: 'SMS',
    recipientGroup: 'Elders & Offline PWA Subscribers (1,150 Users)',
    title: '🌑 Rosh Chodesh Av Announcement',
    message: 'Next Rosh Chodesh will be celebrated on Friday & Shabbat. Kiddush Levana window opens Monday evening.',
    status: 'Scheduled'
  }
];
