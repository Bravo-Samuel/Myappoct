import { getBrowserSupabaseClient } from '../../lib/supabase/client';
import { UserRole } from '../../providers/SupabaseAuthProvider';

export class RoleService {
  /**
   * Resolves the user's primary role by querying `user_roles` joined with `roles`.
   * Returns fallbackRole if no database record exists.
   */
  static async getUserRole(userId: string, fallbackRole: UserRole = 'MEMBER'): Promise<UserRole> {
    const client = getBrowserSupabaseClient();
    if (!client || !userId) return fallbackRole;

    try {
      const { data: roleRows } = await client
        .from('user_roles')
        .select('role_id, roles(name)')
        .eq('user_id', userId);

      if (roleRows && roleRows.length > 0 && roleRows[0].roles) {
        const fetchedRoleName = (roleRows[0].roles as any).name as UserRole;
        if (fetchedRoleName) return fetchedRoleName;
      }
    } catch (err) {
      console.warn('RoleService.getUserRole RBAC warning:', err);
    }

    return fallbackRole;
  }

  /**
   * Assigns or updates a role for a user in the `user_roles` table.
   */
  static async assignRole(userId: string, targetRole: UserRole): Promise<void> {
    const client = getBrowserSupabaseClient();
    if (!client || !userId) return;

    try {
      const { data: roleDef } = await client
        .from('roles')
        .select('id')
        .eq('name', targetRole)
        .maybeSingle();

      if (roleDef?.id) {
        await client
          .from('user_roles')
          .upsert({ user_id: userId, role_id: roleDef.id }, { onConflict: 'user_id,role_id' });
      }
    } catch (err) {
      console.warn('RoleService.assignRole update warning:', err);
    }
  }
}
