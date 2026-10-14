import { getBrowserSupabaseClient } from '../../lib/supabase/client';

export class AuditService {
  /**
   * Log an audit event
   */
  static async logAction(
    actorUserId: string | null,
    actionType: string,
    targetResource: string,
    payloadSnapshot: Record<string, any> = {}
  ) {
    const client = getBrowserSupabaseClient();
    if (!client) return { error: null };
    try {
      return await client.from('audit_logs').insert({
        actor_user_id: actorUserId,
        action_type: actionType,
        target_resource: targetResource,
        payload_snapshot: payloadSnapshot
      });
    } catch (err) {
      console.warn('AuditService.logAction error:', err);
      return { error: err };
    }
  }
}
