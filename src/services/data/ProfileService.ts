import { getBrowserSupabaseClient } from '../../lib/supabase/client';
import { UserProfile, UserRole } from '../../providers/SupabaseAuthProvider';
import { RoleService } from './RoleService';
import { OrganizationService } from './OrganizationService';

export class ProfileService {
  /**
   * Fetches the complete synthesized UserProfile coordinating with RoleService and OrganizationService.
   */
  static async fetchUserProfile(
    userId: string,
    userEmail?: string,
    metadata?: Record<string, any>
  ): Promise<UserProfile | null> {
    const client = getBrowserSupabaseClient();
    if (!client || !userId) return null;

    try {
      // 1. Fetch native profile columns
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('ProfileService.fetchUserProfile warning:', error.message);
      }

      // 2. Resolve role via RoleService
      const fallbackRole: UserRole = (metadata?.role as UserRole) || 'MEMBER';
      const resolvedRole = await RoleService.getUserRole(userId, fallbackRole);

      // 3. Resolve organizational hierarchy via OrganizationService
      const synId = data?.synagogue_id || metadata?.synagogueId || null;
      const resolvedOrgId = await OrganizationService.resolveOrganizationId(synId, metadata?.org_id || null);

      const isDoneLocal = localStorage.getItem(`bnei_menashe_onboarding_completed_${userId}`) === 'true';

      if (data) {
        return {
          id: data.id,
          email: data.email || userEmail || '',
          full_name: data.full_name || metadata?.full_name || metadata?.name || 'Samuel Haokip',
          hebrew_name: data.hebrew_name || metadata?.hebrew_name || 'שְׁמוּאֵל',
          role: resolvedRole,
          synagogue_id: data.synagogue_id || synId || null,
          organization_id: resolvedOrgId || null,
          family_id: data.family_id || null,
          preferred_dialect: data.preferred_dialect || metadata?.preferred_dialect || 'English',
          avatar_url: data.avatar_url || null,
          created_at: data.created_at,
          updated_at: data.updated_at,
          onboarding_completed: data.onboarding_completed ?? metadata?.onboarding_completed ?? isDoneLocal,
          onboarding_location: data.onboarding_location || metadata?.onboarding_location,
          onboarding_interests: data.onboarding_interests || metadata?.onboarding_interests,
          onboarding_notifications: data.onboarding_notifications || metadata?.onboarding_notifications
        };
      }

      // Fallback profile if table record is not seeded yet
      return {
        id: userId,
        email: userEmail || '',
        full_name: metadata?.full_name || metadata?.name || 'Samuel Haokip',
        hebrew_name: metadata?.hebrew_name || 'שְׁמוּאֵל',
        role: resolvedRole,
        synagogue_id: synId || null,
        organization_id: resolvedOrgId || null,
        family_id: metadata?.family_id || null,
        preferred_dialect: metadata?.preferred_dialect || 'English',
        onboarding_completed: metadata?.onboarding_completed ?? isDoneLocal,
        onboarding_location: metadata?.onboarding_location,
        onboarding_interests: metadata?.onboarding_interests,
        onboarding_notifications: metadata?.onboarding_notifications
      };
    } catch (err: any) {
      console.error('ProfileService.fetchUserProfile error:', err);
      throw err;
    }
  }

  /**
   * Updates user profile columns and synchronizes role changes with RoleService.
   */
  static async updateProfile(
    currentProfile: UserProfile,
    updates: Partial<UserProfile>
  ): Promise<{ data: UserProfile | null; error: any }> {
    const client = getBrowserSupabaseClient();
    if (!client) {
      const updated = { ...currentProfile, ...updates };
      return { data: updated, error: null };
    }

    try {
      const { 
        role: updateRole, 
        organization_id, 
        id, 
        created_at, 
        updated_at, 
        onboarding_completed,
        onboarding_location,
        onboarding_interests,
        onboarding_notifications,
        ...tableColumns 
      } = updates;

      let updatedProfileObj = { ...currentProfile, ...updates } as UserProfile;

      if (onboarding_completed !== undefined && currentProfile.id) {
        localStorage.setItem(`bnei_menashe_onboarding_completed_${currentProfile.id}`, String(onboarding_completed));
      }

      // Sync onboarding and preference metadata to Supabase Auth user_metadata
      if (client.auth) {
        await client.auth.updateUser({
          data: {
            preferred_dialect: updates.preferred_dialect || currentProfile.preferred_dialect,
            onboarding_completed: updates.onboarding_completed ?? currentProfile.onboarding_completed,
            onboarding_location: updates.onboarding_location || currentProfile.onboarding_location,
            onboarding_interests: updates.onboarding_interests || currentProfile.onboarding_interests,
            onboarding_notifications: updates.onboarding_notifications || currentProfile.onboarding_notifications
          }
        }).catch(e => console.warn('Could not sync user_metadata:', e));
      }

      if (Object.keys(tableColumns).length > 0) {
        const { data, error } = await client
          .from('profiles')
          .update({ ...tableColumns, updated_at: new Date().toISOString() })
          .eq('id', currentProfile.id)
          .select()
          .single();

        if (error && !error.message?.includes('column')) {
          console.warn('ProfileService update warning:', error);
        } else if (data) {
          updatedProfileObj = {
            ...updatedProfileObj,
            id: data.id,
            email: data.email,
            full_name: data.full_name,
            hebrew_name: data.hebrew_name,
            family_id: data.family_id,
            synagogue_id: data.synagogue_id || updatedProfileObj.synagogue_id,
            preferred_dialect: data.preferred_dialect || updatedProfileObj.preferred_dialect,
            avatar_url: data.avatar_url,
            created_at: data.created_at,
            updated_at: data.updated_at
          };
        }
      }

      if (updateRole && updateRole !== currentProfile.role) {
        await RoleService.assignRole(currentProfile.id, updateRole);
        updatedProfileObj.role = updateRole;
      }

      return { data: updatedProfileObj, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }
}
