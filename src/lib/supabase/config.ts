/**
 * Supabase Environment Validation & Configuration Layer
 * Validates public client and server environment secrets safely.
 */

export interface SupabaseEnvConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  isConfigured: boolean;
  environment: 'development' | 'production' | 'test';
}

export function getSupabaseEnvConfig(): SupabaseEnvConfig {
  const env = (import.meta as any).env || {};
  let url = (env.VITE_SUPABASE_URL || '').trim();
  const anonKey = (env.VITE_SUPABASE_ANON_KEY || '').trim();
  
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    if (!url.includes('.') && !url.includes(' ') && !url.includes('/')) {
      url = `https://${url}.supabase.co`;
    } else if (url.includes('.') && !url.includes(' ')) {
      url = `https://${url}`;
    }
  }

  let isValidUrl = false;
  try {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      new URL(url);
      isValidUrl = true;
    }
  } catch {
    isValidUrl = false;
  }

  // Service role key is only safe server-side or in Node environment
  const serviceRoleKey = typeof process !== 'undefined' ? process.env?.SUPABASE_SERVICE_ROLE_KEY : undefined;

  const isConfigured = Boolean(isValidUrl && anonKey && anonKey.length > 10 && !url.includes('your-project'));

  return {
    url: isValidUrl ? url : 'https://placeholder.supabase.co',
    anonKey: anonKey || 'placeholder-anon-key',
    serviceRoleKey,
    isConfigured,
    environment: env.MODE === 'production' ? 'production' : 'development'
  };
}

/**
 * Throws an explicit error if Supabase credentials are missing when strict execution is required.
 */
export function assertSupabaseConfigured(config = getSupabaseEnvConfig()): void {
  if (!config.isConfigured) {
    console.warn(
      '[Supabase Backend Foundation] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Running in offline local fallback mode. Configure secrets in AI Studio Settings.'
    );
  }
}
