import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Server, 
  Terminal, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  Lock, 
  Globe, 
  Sliders, 
  Search, 
  Clock, 
  HardDrive, 
  FileText, 
  RotateCcw, 
  Zap, 
  AlertOctagon, 
  Key, 
  Layers, 
  Eye, 
  Check, 
  X, 
  Download, 
  Power, 
  UserCheck, 
  Flame, 
  TrendingUp, 
  Radio, 
  Bot, 
  Calendar, 
  Sun, 
  Megaphone, 
  FolderLock, 
  Building2, 
  Filter
} from 'lucide-react';
import { NavSection, EnterpriseRole } from '../../types';

interface EnterpriseSystemAdminCenterViewProps {
  onNavigate?: (section: NavSection) => void;
}

interface ServiceHealthCard {
  id: string;
  name: string;
  status: 'Healthy' | 'Warning' | 'Critical' | 'Offline';
  latencyMs: number;
  uptimePercentage: string;
  activeConnections: number;
  lastChecked: string;
  description: string;
}

interface DbTableStat {
  tableName: string;
  rowsCount: number;
  indexesCount: number;
  rlsStatus: 'Enabled & Active' | 'Warning' | 'Disabled';
  storageUsedMB: number;
  description: string;
}

interface DbMigrationRecord {
  id: string;
  version: string;
  name: string;
  appliedAt: string;
  executionTimeMs: number;
  status: 'Success' | 'Failed';
}

interface ApiEndpointMetric {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  reqPerMinute: number;
  avgLatencyMs: number;
  errorRatePercentage: number;
  lastError?: string;
}

interface BackgroundJob {
  id: string;
  name: string;
  queue: 'high' | 'default' | 'low';
  status: 'Running' | 'Completed' | 'Failed' | 'Queued';
  runtimeSeconds: number;
  lastRun: string;
  retriesCount: number;
}

interface SecurityEventItem {
  id: string;
  timestamp: string;
  eventType: 'Failed Login' | 'Locked Account' | 'Prompt Injection' | 'Rate Limit' | 'API Abuse' | '2FA Verification';
  severity: 'Info' | 'Warning' | 'High' | 'Critical';
  sourceIp: string;
  targetAccountOrEndpoint: string;
  details: string;
}

interface BackupRestorePoint {
  id: string;
  timestamp: string;
  type: 'Automated Daily' | 'Pre-Migration Snapshot' | 'Weekly Deep Archive';
  sizeGB: number;
  verificationStatus: 'Verified SHA-256' | 'Pending' | 'Corrupted';
  checksum: string;
}

interface UnifiedLogEntry {
  id: string;
  timestamp: string;
  category: 'Authentication' | 'Database' | 'API' | 'Notifications' | 'Documents' | 'AI Rabbi' | 'Calendar' | 'Communications' | 'Operations';
  severity: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  service: string;
  message: string;
  metadata: Record<string, any>;
}

interface ScheduledTaskItem {
  id: string;
  name: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Cron' | 'Report' | 'Cleanup';
  cronExpression: string;
  lastExecution: string;
  nextExecution: string;
  status: 'Active' | 'Paused';
}

export const EnterpriseSystemAdminCenterView: React.FC<EnterpriseSystemAdminCenterViewProps> = ({ onNavigate }) => {
  // Role Access Gate State
  const [currentRole, setCurrentRole] = useState<EnterpriseRole>('Super Admin');
  const [activeTab, setActiveTab] = useState<
    'system_status' | 'database_center' | 'api_monitor' | 'background_jobs' | 'security_center' | 'backup_center' | 'log_viewer' | 'configuration' | 'scheduled_tasks' | 'audit' | 'search'
  >('system_status');

  // Interactive notification state
  const [systemAlert, setSystemAlert] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // 1. SYSTEM STATUS STATE
  const [serviceHealth, setServiceHealth] = useState<ServiceHealthCard[]>([
    { id: 'auth', name: 'Authentication (Supabase Auth / JWT)', status: 'Healthy', latencyMs: 14, uptimePercentage: '99.99%', activeConnections: 1420, lastChecked: 'Just now', description: 'Zero-trust JWT verification & Magic Link dispatch engine.' },
    { id: 'db', name: 'Database (PostgreSQL 16 Cluster)', status: 'Healthy', latencyMs: 6, uptimePercentage: '99.99%', activeConnections: 312, lastChecked: 'Just now', description: 'Master relational store with strict Row-Level Security (RLS).' },
    { id: 'realtime', name: 'Realtime (WebSockets & SSE Channels)', status: 'Healthy', latencyMs: 22, uptimePercentage: '99.95%', activeConnections: 840, lastChecked: 'Just now', description: 'Sub-second event bus for minyan calls & operational alerts.' },
    { id: 'storage', name: 'Storage (Encrypted Document Vault)', status: 'Healthy', latencyMs: 38, uptimePercentage: '99.98%', activeConnections: 64, lastChecked: 'Just now', description: 'AES-256 object buckets storing citizen passports & ketubahs.' },
    { id: 'notif', name: 'Notifications (Push / WhatsApp / SMS Gateway)', status: 'Healthy', latencyMs: 110, uptimePercentage: '99.91%', activeConnections: 45, lastChecked: 'Just now', description: 'Omnichannel communication queue via Twilio & Firebase FCM.' },
    { id: 'docs', name: 'Document Verification (OCR & Halachic Check)', status: 'Healthy', latencyMs: 245, uptimePercentage: '99.89%', activeConnections: 18, lastChecked: 'Just now', description: 'Automated verification pipeline for lineage & aliyah dossiers.' },
    { id: 'airabbi', name: 'AI Rabbi (Gemini 2.5 Pro Inference Cluster)', status: 'Healthy', latencyMs: 410, uptimePercentage: '99.94%', activeConnections: 126, lastChecked: 'Just now', description: 'Halachic reasoning engine with Mizo & Thadou translation.' },
    { id: 'calendar', name: 'Calendar Engine (5786 Dual Epoch)', status: 'Healthy', latencyMs: 8, uptimePercentage: '100.0%', activeConnections: 540, lastChecked: 'Just now', description: 'Hebrew/Gregorian synchronization & yahrzeit calculation daemon.' },
    { id: 'zmanim', name: 'Zmanim Engine (High-Precision GPS Solar)', status: 'Healthy', latencyMs: 11, uptimePercentage: '100.0%', activeConnections: 680, lastChecked: 'Just now', description: 'Elevation & atmospheric refraction astronomical calculator.' },
    { id: 'comm', name: 'Communications (Official Broadcast Hub)', status: 'Healthy', latencyMs: 19, uptimePercentage: '99.97%', activeConnections: 210, lastChecked: 'Just now', description: 'Synagogue announcements & regional council notice dispatcher.' },
    { id: 'ops', name: 'Operations Center (Command & Control)', status: 'Warning', latencyMs: 82, uptimePercentage: '99.85%', activeConnections: 310, lastChecked: '2m ago', description: 'Emergency incident response & Sabbath patrol coordinator.' },
    { id: 'apigw', name: 'API Gateway (Edge Nginx Ingress)', status: 'Healthy', latencyMs: 4, uptimePercentage: '99.99%', activeConnections: 2150, lastChecked: 'Just now', description: 'Rate-limiting, SSL termination, and DDoS protection layer.' },
  ]);

  // 2. DATABASE CENTER DATA
  const [dbTables] = useState<DbTableStat[]>([
    { tableName: 'public.profiles', rowsCount: 5786, indexesCount: 4, rlsStatus: 'Enabled & Active', storageUsedMB: 18.4, description: 'Citizen identity records, tribe affiliation, digital ID hashes.' },
    { tableName: 'public.halachic_zmanim_cache', rowsCount: 84200, indexesCount: 3, rlsStatus: 'Enabled & Active', storageUsedMB: 142.1, description: 'Precalculated solar times for NE India & Israel townships.' },
    { tableName: 'public.document_vault', rowsCount: 12450, indexesCount: 5, rlsStatus: 'Enabled & Active', storageUsedMB: 1240.8, description: 'Encrypted citizen files, ketubahs, aliyah dossiers.' },
    { tableName: 'public.announcements', rowsCount: 940, indexesCount: 2, rlsStatus: 'Enabled & Active', storageUsedMB: 4.2, description: 'Synagogue notices, burial broadcasts, regional alerts.' },
    { tableName: 'public.audit_logs', rowsCount: 489210, indexesCount: 6, rlsStatus: 'Enabled & Active', storageUsedMB: 810.5, description: 'Immutable system access logs and security event records.' },
    { tableName: 'public.family_memorial_tree', rowsCount: 18400, indexesCount: 4, rlsStatus: 'Enabled & Active', storageUsedMB: 32.6, description: 'Intergenerational Bnei Menashe ancestral nodes and yahrzeits.' },
    { tableName: 'public.operations_incidents', rowsCount: 312, indexesCount: 3, rlsStatus: 'Enabled & Active', storageUsedMB: 8.9, description: 'Command center emergency dispatches and patrol logs.' }
  ]);

  const [dbMigrations] = useState<DbMigrationRecord[]>([
    { id: 'mig_20260705_04', version: 'v1.0.4', name: 'add_operations_center_rls_policies', appliedAt: '2026-07-05 18:30 UTC', executionTimeMs: 142, status: 'Success' },
    { id: 'mig_20260704_03', version: 'v1.0.3', name: 'index_zmanim_coordinates_gin', appliedAt: '2026-07-04 12:15 UTC', executionTimeMs: 389, status: 'Success' },
    { id: 'mig_20260702_02', version: 'v1.0.2', name: 'create_encrypted_document_vault_table', appliedAt: '2026-07-02 09:00 UTC', executionTimeMs: 512, status: 'Success' },
    { id: 'mig_20260628_01', version: 'v1.0.1', name: 'init_bnei_menashe_core_schema', appliedAt: '2026-06-28 14:00 UTC', executionTimeMs: 1840, status: 'Success' }
  ]);

  // 3. API MONITOR DATA
  const [apiEndpoints] = useState<ApiEndpointMetric[]>([
    { path: '/api/v1/zmanim/calculate', method: 'GET', reqPerMinute: 840, avgLatencyMs: 11, errorRatePercentage: 0.01 },
    { path: '/api/v1/gemini/rabbi-query', method: 'POST', reqPerMinute: 195, avgLatencyMs: 412, errorRatePercentage: 0.45 },
    { path: '/api/v1/auth/verify-session', method: 'GET', reqPerMinute: 1420, avgLatencyMs: 8, errorRatePercentage: 0.00 },
    { path: '/api/v1/documents/vault-upload', method: 'POST', reqPerMinute: 42, avgLatencyMs: 310, errorRatePercentage: 0.12 },
    { path: '/api/v1/communications/broadcast', method: 'POST', reqPerMinute: 18, avgLatencyMs: 95, errorRatePercentage: 0.00 },
    { path: '/api/v1/operations/dispatch', method: 'POST', reqPerMinute: 12, avgLatencyMs: 145, errorRatePercentage: 1.20, lastError: 'RateLimitExceeded on secondary Twilio channel' }
  ]);

  // 4. BACKGROUND JOBS STATE
  const [backgroundJobs, setBackgroundJobs] = useState<BackgroundJob[]>([
    { id: 'job-1', name: 'Zmanim Daily Solar Cache Warmup (Churachandpur & Aizawl)', queue: 'high', status: 'Completed', runtimeSeconds: 4.2, lastRun: 'Today at 00:01 UTC', retriesCount: 0 },
    { id: 'job-2', name: 'Document Vault OCR & Halachic Indexer Daemon', queue: 'default', status: 'Running', runtimeSeconds: 18.5, lastRun: 'In progress...', retriesCount: 0 },
    { id: 'job-3', name: 'Shabbat Boundary Pre-calculation & Auto-Lock Scheduler', queue: 'high', status: 'Completed', runtimeSeconds: 1.8, lastRun: 'Friday 12:00 UTC', retriesCount: 0 },
    { id: 'job-4', name: 'Push Notification Dispatcher (Synagogue Minyan Call)', queue: 'high', status: 'Completed', runtimeSeconds: 0.9, lastRun: '14m ago', retriesCount: 0 },
    { id: 'job-5', name: 'Offline Storage Snapshot Synchronization Worker', queue: 'low', status: 'Failed', runtimeSeconds: 12.4, lastRun: '35m ago', retriesCount: 2 },
    { id: 'job-6', name: 'Expired JWT Token & Temp Session Cleanup Job', queue: 'low', status: 'Queued', runtimeSeconds: 0.0, lastRun: 'Scheduled for 23:59 UTC', retriesCount: 0 }
  ]);

  // 5. SECURITY CENTER STATE
  const [securityEvents] = useState<SecurityEventItem[]>([
    { id: 'sec-101', timestamp: '2026-07-05 20:45:12', eventType: 'Prompt Injection', severity: 'High', sourceIp: '185.220.101.45', targetAccountOrEndpoint: '/api/v1/gemini/rabbi-query', details: 'Detected jailbreak attempt requesting non-halachic system prompt override. Blocked automatically.' },
    { id: 'sec-102', timestamp: '2026-07-05 19:12:04', eventType: 'Failed Login', severity: 'Warning', sourceIp: '103.15.240.12', targetAccountOrEndpoint: 'admin@bneimenashe.org', details: '3 consecutive invalid password attempts. Account temporarily throttled.' },
    { id: 'sec-103', timestamp: '2026-07-05 16:30:55', eventType: 'Rate Limit', severity: 'Info', sourceIp: '45.143.200.88', targetAccountOrEndpoint: '/api/v1/zmanim/calculate', details: 'Exceeded 600 req/min quota from single IP cluster. Throttling applied for 15 minutes.' },
    { id: 'sec-104', timestamp: '2026-07-05 14:10:00', eventType: '2FA Verification', severity: 'Info', sourceIp: '117.211.140.22', targetAccountOrEndpoint: 'rabbi.mizo@bneimenashe.org', details: 'Successful TOTP hardware key verification for Regional Council Portal access.' },
    { id: 'sec-105', timestamp: '2026-07-04 22:05:11', eventType: 'Locked Account', severity: 'Critical', sourceIp: '194.165.16.10', targetAccountOrEndpoint: 'gabbai.beitsalom@gmail.com', details: 'Account locked after 10 failed login attempts from unrecognized ASN.' }
  ]);

  // 6. BACKUP CENTER STATE
  const [backups, setBackups] = useState<BackupRestorePoint[]>([
    { id: 'bk-5786-0705', timestamp: '2026-07-05 03:00:00 UTC', type: 'Automated Daily', sizeGB: 2.14, verificationStatus: 'Verified SHA-256', checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { id: 'bk-5786-0704', timestamp: '2026-07-04 03:00:00 UTC', type: 'Automated Daily', sizeGB: 2.12, verificationStatus: 'Verified SHA-256', checksum: '4d86b8c4d7f5c091f2a38c9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b' },
    { id: 'bk-5786-premif', timestamp: '2026-07-01 18:00:00 UTC', type: 'Pre-Migration Snapshot', sizeGB: 1.98, verificationStatus: 'Verified SHA-256', checksum: 'f6e5d4c3b2a10987654321fedcba0987654321fedcba0987654321fedcba0987' },
    { id: 'bk-5786-weekly', timestamp: '2026-06-28 00:00:00 UTC', type: 'Weekly Deep Archive', sizeGB: 1.91, verificationStatus: 'Verified SHA-256', checksum: 'a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e' }
  ]);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  // 7. UNIFIED LOGS STATE
  const [logFilterCategory, setLogFilterCategory] = useState<string>('All');
  const [logFilterSeverity, setLogFilterSeverity] = useState<string>('All');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [unifiedLogs] = useState<UnifiedLogEntry[]>([
    { id: 'log-1', timestamp: '20:56:40', category: 'Authentication', severity: 'INFO', service: 'SupabaseAuth', message: 'Token refresh successful for citizen ID #5786-9042', metadata: { ip: '117.211.140.22', user_role: 'Synagogue Admin' } },
    { id: 'log-2', timestamp: '20:55:12', category: 'Database', severity: 'INFO', service: 'PostgresPool', message: 'Query completed in 4ms on table public.halachic_zmanim_cache', metadata: { query_hash: '0x9a8f11b', rows_returned: 14 } },
    { id: 'log-3', timestamp: '20:52:05', category: 'AI Rabbi', severity: 'INFO', service: 'Gemini-2.5-Pro', message: 'Halachic query processed regarding Shabbat preparation in monsoon season', metadata: { prompt_tokens: 412, completion_tokens: 389, latency_ms: 410 } },
    { id: 'log-4', timestamp: '20:49:18', category: 'Operations', severity: 'WARN', service: 'OpsCommandCenter', message: 'High network latency reported on secondary satellite link (Churachandpur North)', metadata: { latency_ms: 184, threshold_ms: 150 } },
    { id: 'log-5', timestamp: '20:45:12', category: 'Security', severity: 'ERROR', service: 'AIGuardrail', message: 'Prompt injection trigger intercepted and dropped', metadata: { client_ip: '185.220.101.45', rule_triggered: 'JAILBREAK_TORAH_OVERRIDE' } },
    { id: 'log-6', timestamp: '20:40:00', category: 'Communications', severity: 'INFO', service: 'TwilioGateway', message: 'Broadcast dispatched to 340 subscribers for Beit Shalom Mincha call', metadata: { channel: 'WhatsApp', delivery_rate: '99.7%' } },
    { id: 'log-7', timestamp: '20:35:10', category: 'Documents', severity: 'INFO', service: 'VaultOCR', message: 'Ketubah verification index generated for document #DOC-8821', metadata: { ocr_confidence: 0.985, encrypted_bucket: 'vault-ap-southeast-1' } },
    { id: 'log-8', timestamp: '20:30:00', category: 'Calendar', severity: 'INFO', service: 'EpochEngine', message: 'Synchronized sunset boundary for 17 Tamuz fast commencement', metadata: { sunset_utc: '12:34:00', local_time: '18:04 IDT' } }
  ]);

  // 8. CONFIGURATION STATE
  const [featureFlags, setFeatureFlags] = useState({
    aiRabbiStreaming: true,
    offlineStorageSync: true,
    highPrecisionAstronomicalZmanim: true,
    operationsCommandBroadcasts: true,
    strictRlsEnforcement: true,
    maintenanceMode: false
  });
  const [publicBannerText, setPublicBannerText] = useState('Welcome to the Bnei Menashe Digital Platform v1.0. All systems operating normally.');
  const [bannerEnabled, setBannerEnabled] = useState(true);

  // 9. SCHEDULED TASKS STATE
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTaskItem[]>([
    { id: 'tsk-1', name: 'Daily Zmanim Cache Warmup (NE India & Israel)', frequency: 'Daily', cronExpression: '1 0 * * *', lastExecution: '2026-07-05 00:01:00 UTC', nextExecution: '2026-07-06 00:01:00 UTC', status: 'Active' },
    { id: 'tsk-2', name: 'Shabbat Boundary Calculation & Auto-Lock Daemon', frequency: 'Weekly', cronExpression: '0 12 * * 5', lastExecution: '2026-07-03 12:00:00 UTC', nextExecution: '2026-07-10 12:00:00 UTC', status: 'Active' },
    { id: 'tsk-3', name: 'Rosh Chodesh & Molad Astronomical Synchronization', frequency: 'Monthly', cronExpression: '0 0 1 * *', lastExecution: '2026-06-16 00:00:00 UTC', nextExecution: '2026-07-15 00:00:00 UTC', status: 'Active' },
    { id: 'tsk-4', name: 'Weekly Demographics & Aliyah Pipeline Digest Report', frequency: 'Report', cronExpression: '0 8 * * 0', lastExecution: '2026-07-05 08:00:00 UTC', nextExecution: '2026-07-12 08:00:00 UTC', status: 'Active' },
    { id: 'tsk-5', name: 'Expired JWT Token & Temp Session Pruning Job', frequency: 'Cleanup', cronExpression: '59 23 * * *', lastExecution: '2026-07-04 23:59:00 UTC', nextExecution: '2026-07-05 23:59:00 UTC', status: 'Active' }
  ]);

  // 10. AUDIT TRAIL STATE
  const [auditStream, setAuditStream] = useState<Array<{ id: string; time: string; operator: string; action: string; target: string }>>([
    { id: 'aud-1', time: '20:55:00', operator: 'Super Admin (Chochon)', action: 'System Console Session Opened', target: 'Enterprise System Admin Center v1.0' },
    { id: 'aud-2', time: '20:12:30', operator: 'DevOps Lead', action: 'Verified SHA-256 Checksum', target: 'Snapshot #bk-5786-0705' },
    { id: 'aud-3', time: '18:30:00', operator: 'System Administrator', action: 'Applied Database Migration', target: 'mig_20260705_04 (RLS Policies)' }
  ]);

  // Global Search state
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const showNotification = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setSystemAlert({ message, type });
    setTimeout(() => setSystemAlert(null), 4500);
  };

  const addAuditEntry = (action: string, target: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAuditStream(prev => [
      { id: `aud-${Date.now()}`, time: timeStr, operator: `${currentRole} Operator`, action, target },
      ...prev
    ]);
  };

  const handleManualBackup = () => {
    if (isBackupRunning) return;
    setIsBackupRunning(true);
    setBackupProgress(10);
    showNotification('Manual enterprise cryptographic snapshot initiated...', 'info');
    addAuditEntry('Triggered Manual Backup Snapshot', 'PostgreSQL Cluster & Document Vault');

    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setIsBackupRunning(false);
          const newBkId = `bk-5786-live-${Math.floor(Math.random()*1000)}`;
          setBackups(current => [
            {
              id: newBkId,
              timestamp: `${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`,
              type: 'Automated Daily',
              sizeGB: 2.15,
              verificationStatus: 'Verified SHA-256',
              checksum: '8f9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b'
            },
            ...current
          ]);
          showNotification('Backup completed & SHA-256 verified successfully!', 'success');
          return 100;
        }
        return prev + 25;
      });
    }, 600);
  };

  const handlePingServices = () => {
    showNotification('Pinging all 12 platform microservices...', 'info');
    addAuditEntry('Executed Health Diagnostic Ping', 'All 12 Microservices');
    setTimeout(() => {
      setServiceHealth(prev => prev.map(s => {
        if (s.id === 'ops') return { ...s, status: 'Healthy', latencyMs: 24, lastChecked: 'Just now' };
        return { ...s, latencyMs: Math.max(3, s.latencyMs + Math.floor(Math.random() * 8 - 4)), lastChecked: 'Just now' };
      }));
      showNotification('All 12 microservices responded with HTTP 200 OK.', 'success');
    }, 800);
  };

  // RBAC Access Check
  const isAuthorizedEngineer = currentRole === 'Super Admin' || currentRole === 'System Administrator' || currentRole === 'DevOps';

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans pb-24 selection:bg-amber-500/30">
      {/* Top Banner Alert notification */}
      {systemAlert && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-4 ${
          systemAlert.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' :
          systemAlert.type === 'warning' ? 'bg-amber-950/90 border-amber-500/50 text-amber-200' :
          'bg-blue-950/90 border-blue-500/50 text-blue-200'
        }`}>
          {systemAlert.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {systemAlert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
          {systemAlert.type === 'info' && <Zap className="w-5 h-5 text-blue-400 shrink-0" />}
          <span className="text-sm font-medium">{systemAlert.message}</span>
          <button onClick={() => setSystemAlert(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Engineering Header */}
      <div className="sticky top-0 z-40 bg-[#0B1120]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/30">
              <Cpu className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Enterprise System Administration Center
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Version 1.0 Feature Complete
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  Frozen Architecture
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Internal platform management & operational command room for engineers, DevOps & database administrators.
              </p>
            </div>
          </div>

          {/* Role Access Simulation Bar */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl shrink-0">
            <ShieldCheck className={`w-4 h-4 ${isAuthorizedEngineer ? 'text-amber-400' : 'text-red-400'}`} />
            <span className="text-xs text-slate-400 font-medium">Operator Role Gate:</span>
            <select
              value={currentRole}
              onChange={(e) => {
                const newRole = e.target.value as EnterpriseRole;
                setCurrentRole(newRole);
                addAuditEntry(`Simulated Role Switch to ${newRole}`, 'Security Role Gate');
              }}
              className="bg-slate-950 border border-slate-700 text-amber-400 text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-500"
            >
              <option value="Super Admin">Super Admin (Authorized)</option>
              <option value="System Administrator">System Administrator (Authorized)</option>
              <option value="DevOps">DevOps Engineer (Authorized)</option>
              <option value="Member">Citizen Member (Unauthorized Test)</option>
              <option value="Guest">Guest (Unauthorized Test)</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        {isAuthorizedEngineer && (
          <div className="max-w-7xl mx-auto mt-4 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'system_status', label: 'System Status', icon: <Activity className="w-4 h-4" />, badge: '12 Live' },
              { id: 'database_center', label: 'Database Center', icon: <Database className="w-4 h-4" />, badge: 'Read Only' },
              { id: 'api_monitor', label: 'API Monitor', icon: <Server className="w-4 h-4" /> },
              { id: 'background_jobs', label: 'Background Jobs', icon: <Cpu className="w-4 h-4" />, badge: '1 Run' },
              { id: 'security_center', label: 'Security Center', icon: <ShieldCheck className="w-4 h-4" /> },
              { id: 'backup_center', label: 'Backup Center', icon: <HardDrive className="w-4 h-4" /> },
              { id: 'log_viewer', label: 'Log Viewer', icon: <Terminal className="w-4 h-4" /> },
              { id: 'configuration', label: 'Configuration', icon: <Sliders className="w-4 h-4" /> },
              { id: 'scheduled_tasks', label: 'Scheduled Tasks', icon: <Clock className="w-4 h-4" /> },
              { id: 'audit', label: 'Audit Trail', icon: <FileText className="w-4 h-4" /> },
              { id: 'search', label: 'Search Platform', icon: <Search className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    tab.id === 'database_center' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* UNAUTHORIZED ROLE GATE */}
        {!isAuthorizedEngineer && (
          <div className="my-12 p-8 md:p-12 rounded-3xl bg-slate-900/80 border border-red-500/30 backdrop-blur-md text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-400">
              <Lock className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Access Restricted to Engineering Console</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              You are currently viewing under the citizen role <span className="text-amber-400 font-semibold">{currentRole}</span>. 
              According to the strict frozen platform architecture, this workspace is strictly accessible only to authorized <span className="text-white font-semibold">Super Admin</span>, <span className="text-white font-semibold">System Administrator</span>, and <span className="text-white font-semibold">DevOps Engineers</span>.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs text-slate-300 space-y-2 mb-6">
              <div className="flex items-center gap-2 text-red-400 font-semibold">
                <AlertOctagon className="w-4 h-4" />
                <span>Security Enforcement Policy:</span>
              </div>
              <p>• Zero citizen access permitted to database internals, raw logs, or feature flags.</p>
              <p>• Unauthorized attempts are logged in immutable security audit trails.</p>
            </div>
            <button
              onClick={() => setCurrentRole('Super Admin')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
            >
              Switch Role to Super Admin (Inspection Mode)
            </button>
          </div>
        )}

        {/* AUTHORIZED CONTENT */}
        {isAuthorizedEngineer && (
          <div>
            {/* 1. SYSTEM STATUS TAB */}
            {activeTab === 'system_status' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-amber-400" />
                      Live Platform Microservice Health
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Monitoring all 12 core platform engines across Cloud Run Asia-Southeast1 infrastructure.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePingServices}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Ping All 12 Engines</span>
                    </button>
                    <div className="px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Overall System: HEALTHY</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {serviceHealth.map(service => (
                    <div
                      key={service.id}
                      className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all backdrop-blur-sm flex flex-col justify-between shadow-lg group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                            {service.name}
                          </h3>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5 ${
                            service.status === 'Healthy' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                            service.status === 'Warning' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                            service.status === 'Critical' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                            'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              service.status === 'Healthy' ? 'bg-emerald-400' :
                              service.status === 'Warning' ? 'bg-amber-400 animate-pulse' :
                              service.status === 'Critical' ? 'bg-red-400 animate-ping' :
                              'bg-slate-500'
                            }`} />
                            {service.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                          <span className="block text-[10px] text-slate-500 uppercase font-mono">Latency</span>
                          <span className={`text-xs font-bold font-mono ${service.latencyMs > 150 ? 'text-amber-400' : 'text-slate-200'}`}>
                            {service.latencyMs} ms
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                          <span className="block text-[10px] text-slate-500 uppercase font-mono">Uptime</span>
                          <span className="text-xs font-bold text-emerald-400 font-mono">
                            {service.uptimePercentage}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                          <span className="block text-[10px] text-slate-500 uppercase font-mono">Conns</span>
                          <span className="text-xs font-bold text-slate-200 font-mono">
                            {service.activeConnections}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. DATABASE CENTER TAB */}
            {activeTab === 'database_center' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Database className="w-5 h-5 text-amber-400" />
                        PostgreSQL 16 Enterprise Database Center
                      </h2>
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        READ ONLY MODE ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Inspection console for schema structures, Row Level Security (RLS) enforcement, and migration logs. Direct write mutations disabled by architecture policy.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block">Total Storage</span>
                      <span className="font-bold font-mono text-amber-400">1.44 GB / 50 GB</span>
                    </div>
                    <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block">Replication Lag</span>
                      <span className="font-bold font-mono text-emerald-400">0.4 ms (Sync)</span>
                    </div>
                  </div>
                </div>

                {/* Table Registry */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
                  <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Schema Table Registry & RLS Enforcement</h3>
                    <span className="text-xs text-slate-400">{dbTables.length} Active Tables</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                          <th className="py-3 px-5">Table Name</th>
                          <th className="py-3 px-4 text-right">Rows</th>
                          <th className="py-3 px-4 text-right">Indexes</th>
                          <th className="py-3 px-4">RLS Policy Status</th>
                          <th className="py-3 px-4 text-right">Storage Used</th>
                          <th className="py-3 px-5">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-xs">
                        {dbTables.map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-5 font-mono font-bold text-amber-400">{t.tableName}</td>
                            <td className="py-3.5 px-4 font-mono text-right text-slate-200">{t.rowsCount.toLocaleString()}</td>
                            <td className="py-3.5 px-4 font-mono text-right text-slate-300">{t.indexesCount}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                {t.rlsStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-right text-slate-300">{t.storageUsedMB} MB</td>
                            <td className="py-3.5 px-5 text-slate-400">{t.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Query Performance & Migrations Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Query Performance */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        Live Query Performance & Cache Metrics
                      </h3>
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[11px] text-slate-500 block">Avg Query Time</span>
                          <span className="text-sm font-bold font-mono text-emerald-400">4.12 ms</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[11px] text-slate-500 block">p95 Latency</span>
                          <span className="text-sm font-bold font-mono text-slate-200">14.80 ms</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[11px] text-slate-500 block">Buffer Cache Hit</span>
                          <span className="text-sm font-bold font-mono text-amber-400">99.94%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-300 block">Slowest Query Sample (Last 24h):</span>
                        <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800/80 leading-relaxed overflow-x-auto">
                          <span className="text-amber-400">SELECT</span> * <span className="text-amber-400">FROM</span> document_vault <span className="text-amber-400">WHERE</span> tribe_verified = true <span className="text-amber-400">ORDER BY</span> uploaded_at <span className="text-amber-400">DESC LIMIT</span> 50;<br />
                          <span className="text-slate-500">// Executed in 48ms (GIN Index scan active)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Migration History */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                      <RotateCcw className="w-4 h-4 text-amber-400" />
                      Immutable Migration Log (Read-Only)
                    </h3>
                    <div className="space-y-3">
                      {dbMigrations.map(m => (
                        <div key={m.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-amber-400">{m.version}</span>
                              <span className="text-xs font-semibold text-white">{m.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Applied: {m.appliedAt}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              {m.status} ({m.executionTimeMs}ms)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. API MONITOR TAB */}
            {activeTab === 'api_monitor' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Global Request Rate</span>
                    <div className="text-2xl font-bold font-mono text-white">2,547 <span className="text-xs text-amber-400 font-normal">req/min</span></div>
                    <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +12% vs last hour (Mincha traffic)
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Average Latency</span>
                    <div className="text-2xl font-bold font-mono text-emerald-400">18.4 <span className="text-xs text-slate-400 font-normal">ms</span></div>
                    <div className="text-[11px] text-slate-400 mt-2">p99 edge latency: 85 ms</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Gateway Error Rate</span>
                    <div className="text-2xl font-bold font-mono text-white">0.03%</div>
                    <div className="text-[11px] text-emerald-400 mt-2">Well below 0.5% SLA threshold</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Realtime SSE/WS Connections</span>
                    <div className="text-2xl font-bold font-mono text-amber-400">1,418</div>
                    <div className="text-[11px] text-slate-400 mt-2">Active citizen telemetry clients</div>
                  </div>
                </div>

                {/* Endpoints Table */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
                  <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Top API Endpoints & Throughput Inspection</h3>
                    <span className="text-xs text-slate-400">Real-time sampling</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                          <th className="py-3 px-5">Method</th>
                          <th className="py-3 px-4">Endpoint Path</th>
                          <th className="py-3 px-4 text-right">Throughput</th>
                          <th className="py-3 px-4 text-right">Avg Latency</th>
                          <th className="py-3 px-4 text-right">Error Rate</th>
                          <th className="py-3 px-5">Diagnostic Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-xs">
                        {apiEndpoints.map((ep, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-5">
                              <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                                ep.method === 'GET' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                                ep.method === 'POST' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                                'bg-amber-500/15 text-amber-400'
                              }`}>
                                {ep.method}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{ep.path}</td>
                            <td className="py-3.5 px-4 font-mono text-right text-slate-300">{ep.reqPerMinute} req/min</td>
                            <td className="py-3.5 px-4 font-mono text-right">
                              <span className={ep.avgLatencyMs > 200 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-semibold'}>
                                {ep.avgLatencyMs} ms
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-right">
                              <span className={ep.errorRatePercentage > 0.5 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                                {ep.errorRatePercentage}%
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-slate-400 text-[11px]">
                              {ep.lastError ? <span className="text-amber-400">{ep.lastError}</span> : 'Operating normally'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. BACKGROUND JOBS TAB */}
            {activeTab === 'background_jobs' && (
              <div className="space-y-6">
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
                  <div className="px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-amber-400" />
                        Asynchronous Platform Background Jobs & Retry Queue
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Automated daemons for astronomical calculations, OCR processing, and alerts.</p>
                    </div>
                    <button
                      onClick={() => {
                        showNotification('Triggered retry queue dispatch for failed background jobs.', 'success');
                        addAuditEntry('Manual Trigger of Failed Background Retry Queue', 'Background Worker Engine');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-2 shrink-0 transition-all"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Dispatch Retry Queue</span>
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                          <th className="py-3 px-5">Job Name</th>
                          <th className="py-3 px-4">Priority Queue</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Avg Runtime</th>
                          <th className="py-3 px-4 text-right">Retries</th>
                          <th className="py-3 px-5">Last Execution</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-xs">
                        {backgroundJobs.map(job => (
                          <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-5 font-bold text-white">{job.name}</td>
                            <td className="py-3.5 px-4 uppercase font-mono text-[10px]">
                              <span className={`px-2 py-0.5 rounded font-bold ${
                                job.queue === 'high' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                                'bg-slate-800 text-slate-400'
                              }`}>
                                {job.queue}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1.5 w-fit ${
                                job.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                                job.status === 'Running' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 animate-pulse' :
                                job.status === 'Failed' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                                'bg-slate-800 text-slate-300'
                              }`}>
                                {job.status === 'Running' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />}
                                {job.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-right text-slate-200">{job.runtimeSeconds}s</td>
                            <td className="py-3.5 px-4 font-mono text-right text-slate-300">{job.retriesCount}</td>
                            <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">{job.lastRun}</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  showNotification(`Manual execution triggered for worker: ${job.name}`, 'info');
                                  addAuditEntry(`Triggered Background Worker: ${job.name}`, 'Background Job Scheduler');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition-all"
                              >
                                Run Now
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. SECURITY CENTER TAB */}
            {activeTab === 'security_center' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Failed Logins (24h)</span>
                    <div className="text-2xl font-bold font-mono text-amber-400">14 attempts</div>
                    <div className="text-[11px] text-slate-400 mt-2">Throttled by rate limiting guardrails</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Locked Citizen Accounts</span>
                    <div className="text-2xl font-bold font-mono text-white">2 accounts</div>
                    <div className="text-[11px] text-red-400 mt-2">Requires administrator verification unlock</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">2FA Hardware Adoption</span>
                    <div className="text-2xl font-bold font-mono text-emerald-400">100%</div>
                    <div className="text-[11px] text-slate-400 mt-2">Enforced for all Council & Admin roles</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">AI Prompt Injection Guard</span>
                    <div className="text-2xl font-bold font-mono text-emerald-400">4 blocked</div>
                    <div className="text-[11px] text-slate-400 mt-2">0 breaches on AI Rabbi inference</div>
                  </div>
                </div>

                {/* Security Feed */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Real-Time Security Feed & Threat Telemetry
                  </h3>
                  <div className="space-y-3">
                    {securityEvents.map(ev => (
                      <div key={ev.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                            ev.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                            ev.severity === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                            ev.severity === 'Warning' ? 'bg-amber-500/10 text-amber-300' :
                            'bg-blue-500/10 text-blue-300'
                          }`}>
                            {ev.severity}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-white">{ev.eventType}</span>
                              <span className="text-xs font-mono text-amber-400 font-semibold">{ev.targetAccountOrEndpoint}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ev.details}</p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <span className="text-xs font-mono text-slate-400 block">IP: {ev.sourceIp}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{ev.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. BACKUP CENTER TAB */}
            {activeTab === 'backup_center' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 p-6 rounded-2xl backdrop-blur-md shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-amber-400" />
                        Platform Cryptographic Backup Snapshot Console
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                        Automated AES-256 snapshots of the master PostgreSQL relational database and document storage buckets. Every backup is verified via SHA-256 hash checksums.
                      </p>
                      <div className="flex items-center gap-6 mt-4 text-xs">
                        <div>
                          <span className="text-slate-500 block">Last Verified Snapshot:</span>
                          <span className="font-mono font-bold text-emerald-400">Today at 03:00 UTC (2.14 GB)</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Next Scheduled Snapshot:</span>
                          <span className="font-mono font-bold text-amber-400">Tomorrow at 03:00 UTC</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                      <button
                        onClick={handleManualBackup}
                        disabled={isBackupRunning}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        <HardDrive className="w-4 h-4" />
                        <span>{isBackupRunning ? 'Snapshot Running...' : 'Trigger Manual Snapshot'}</span>
                      </button>
                      <button
                        onClick={() => {
                          showNotification('Simulating dry-run database restore verification...', 'info');
                          addAuditEntry('Executed Dry-Run Restore Simulation Check', 'Database Cluster Snapshot #bk-5786-0705');
                          setTimeout(() => showNotification('Restore dry-run simulation successful! 100% table consistency.', 'success'), 1200);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-400" />
                        <span>Simulate Dry-Run Restore</span>
                      </button>
                    </div>
                  </div>

                  {isBackupRunning && (
                    <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-amber-500/40">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-semibold text-amber-400">Creating Encrypted Archive Snapshot...</span>
                        <span className="font-mono text-white">{backupProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300" style={{ width: `${backupProgress}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Restore Points Table */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
                  <div className="px-5 py-4 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white">Available Cryptographic Restore Points</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                          <th className="py-3 px-5">Snapshot ID</th>
                          <th className="py-3 px-4">Timestamp</th>
                          <th className="py-3 px-4">Type</th>
                          <th className="py-3 px-4 text-right">Size</th>
                          <th className="py-3 px-4">SHA-256 Checksum Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-xs">
                        {backups.map(bk => (
                          <tr key={bk.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-5 font-mono font-bold text-amber-400">{bk.id}</td>
                            <td className="py-3.5 px-4 font-mono text-slate-200">{bk.timestamp}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                                {bk.type}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-right text-slate-300">{bk.sizeGB} GB</td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {bk.verificationStatus}
                                </span>
                                <span className="font-mono text-[10px] text-slate-500 truncate max-w-[180px]">{bk.checksum}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 7. LOG VIEWER TAB */}
            {activeTab === 'log_viewer' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
                    {['All', 'Authentication', 'Database', 'API', 'Notifications', 'Documents', 'AI Rabbi', 'Calendar', 'Communications', 'Operations'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setLogFilterCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                          logFilterCategory === cat ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={logFilterSeverity}
                      onChange={e => setLogFilterSeverity(e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                    >
                      <option value="All">All Severities</option>
                      <option value="INFO">INFO</option>
                      <option value="WARN">WARN</option>
                      <option value="ERROR">ERROR</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs space-y-2 shadow-2xl">
                  {unifiedLogs
                    .filter(log => logFilterCategory === 'All' || log.category === logFilterCategory)
                    .filter(log => logFilterSeverity === 'All' || log.severity === logFilterSeverity)
                    .map(log => (
                      <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <span className="text-slate-500 shrink-0 mt-0.5">{log.timestamp}</span>
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase shrink-0 mt-0.5 ${
                            log.severity === 'ERROR' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                            log.severity === 'WARN' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {log.severity}
                          </span>
                          <div>
                            <span className="text-amber-400 font-bold mr-2">[{log.service}]</span>
                            <span className="text-slate-200">{log.message}</span>
                          </div>
                        </div>
                        <div className="text-slate-500 text-[11px] bg-slate-950 px-2.5 py-1 rounded border border-slate-800/80 shrink-0">
                          {JSON.stringify(log.metadata)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 8. CONFIGURATION TAB */}
            {activeTab === 'configuration' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-400" />
                      Platform Feature Flags & Runtime Switches
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Instant hot-swappable flags controlling platform behavior.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'aiRabbiStreaming', label: 'AI Rabbi Streaming Inference', desc: 'Enable token-by-token GenAI response streaming via SSE.' },
                      { key: 'offlineStorageSync', label: 'Offline Storage Snapshot Sync', desc: 'Allow citizen browsers to cache 5786 calendar offline in IndexedDB.' },
                      { key: 'highPrecisionAstronomicalZmanim', label: 'High-Precision GPS Solar Zmanim', desc: 'Compute refraction & elevation offsets for Churachandpur coordinates.' },
                      { key: 'operationsCommandBroadcasts', label: 'Operations Command Siren Broadcasts', desc: 'Allow emergency push notification override across all townships.' }
                    ].map(flag => (
                      <div key={flag.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <div>
                          <span className="text-xs font-bold text-white block">{flag.label}</span>
                          <span className="text-[11px] text-slate-400">{flag.desc}</span>
                        </div>
                        <button
                          onClick={() => {
                            const currentVal = (featureFlags as any)[flag.key];
                            setFeatureFlags(prev => ({ ...prev, [flag.key]: !currentVal }));
                            showNotification(`Feature flag "${flag.label}" toggled to ${!currentVal ? 'ENABLED' : 'DISABLED'}.`, 'info');
                            addAuditEntry(`Toggled Feature Flag: ${flag.label} (${!currentVal})`, 'Configuration Engine');
                          }}
                          className={`w-11 h-6 rounded-full p-1 transition-colors relative ${
                            (featureFlags as any)[flag.key] ? 'bg-amber-500' : 'bg-slate-800'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            (featureFlags as any)[flag.key] ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Maintenance & Banner */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-amber-400" />
                      Public Banner & Environment Maintenance Control
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Global platform broadcasts and emergency lockdown switches.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <label className="text-xs font-semibold text-slate-300 block mb-2">Platform Public Broadcast Banner</label>
                      <textarea
                        value={publicBannerText}
                        onChange={e => setPublicBannerText(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 mb-2"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            showNotification('Public system broadcast banner updated across all client sessions.', 'success');
                            addAuditEntry('Updated Public Broadcast Banner Text', 'System Banner Hub');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                        >
                          Publish Banner
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-red-300 block">System Maintenance Mode</span>
                        <span className="text-[11px] text-red-400/80">Locks out non-engineering sessions during upgrades.</span>
                      </div>
                      <button
                        onClick={() => {
                          const nextVal = !featureFlags.maintenanceMode;
                          setFeatureFlags(prev => ({ ...prev, maintenanceMode: nextVal }));
                          showNotification(nextVal ? 'CRITICAL: Maintenance mode activated.' : 'Maintenance mode deactivated.', nextVal ? 'warning' : 'success');
                          addAuditEntry(`Maintenance Mode Switched to ${nextVal ? 'ACTIVE' : 'OFF'}`, 'System Master Gate');
                        }}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                          featureFlags.maintenanceMode ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {featureFlags.maintenanceMode ? 'LOCKDOWN ACTIVE (Click to Turn Off)' : 'Enable Maintenance Lock'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 9. SCHEDULED TASKS TAB */}
            {activeTab === 'scheduled_tasks' && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
                <div className="px-5 py-4 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white">Automated Scheduled Tasks & Cron Registry</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                        <th className="py-3 px-5">Task Name</th>
                        <th className="py-3 px-4">Frequency</th>
                        <th className="py-3 px-4">Cron Expression</th>
                        <th className="py-3 px-4">Last Execution</th>
                        <th className="py-3 px-4">Next Execution</th>
                        <th className="py-3 px-5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {scheduledTasks.map(t => (
                        <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-5 font-bold text-white">{t.name}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              {t.frequency}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300 font-bold">{t.cronExpression}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-400">{t.lastExecution}</td>
                          <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">{t.nextExecution}</td>
                          <td className="py-3.5 px-5 text-right">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 10. AUDIT TRAIL TAB */}
            {activeTab === 'audit' && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Immutable Engineering Audit Trail (No Hidden Actions)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Every administrative action, backup trigger, and configuration change is logged strictly.</p>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  {auditStream.map(item => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 shrink-0">{item.time}</span>
                        <span className="text-amber-400 font-bold">[{item.operator}]</span>
                        <span className="text-white font-semibold">{item.action}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] bg-slate-900 px-3 py-1 rounded border border-slate-800">
                        Target: {item.target}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. SEARCH TAB */}
            {activeTab === 'search' && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-400" />
                    Global Platform Administration Search Engine
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Search across Logs, Users, API Requests, Documents, Cases, and Microservices.</p>
                </div>

                <div className="relative">
                  <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={globalSearchQuery}
                    onChange={e => setGlobalSearchQuery(e.target.value)}
                    placeholder="Search logs, citizen records (#5786), endpoints (/api/v1/...), or backup snapshots..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs font-bold text-amber-400 block mb-2">Indexed Search Scopes Active:</span>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                      <li>489,210 Immutable Audit Log Records</li>
                      <li>12,450 Document Vault Hashes</li>
                      <li>5,786 Citizen Identity Profiles</li>
                      <li>12 Microservice Telemetry Streams</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-center text-xs text-slate-400">
                    {globalSearchQuery ? (
                      <div>Surfacing instant matches for <span className="text-amber-400 font-bold">"{globalSearchQuery}"</span> across platform indices...</div>
                    ) : (
                      <div>Type above to query cross-platform records instantaneously.</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
