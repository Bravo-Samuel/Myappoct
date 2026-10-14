import { getBrowserSupabaseClient } from '../../lib/supabase/client';

export class AuthService {
  /**
   * Get the current active session
   */
  static async getSession() {
    const client = getBrowserSupabaseClient();
    if (!client) return { data: { session: null }, error: new Error('Client unconfigured') };
    return await client.auth.getSession();
  }

  /**
   * Get the current authenticated user
   */
  static async getUser() {
    const client = getBrowserSupabaseClient();
    if (!client) return { data: { user: null }, error: new Error('Client unconfigured') };
    return await client.auth.getUser();
  }

  /**
   * Sign out the active user session
   */
  static async signOut() {
    const client = getBrowserSupabaseClient();
    if (!client) return { error: null };
    return await client.auth.signOut();
  }
}

