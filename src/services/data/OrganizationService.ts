import { getBrowserSupabaseClient } from '../../lib/supabase/client';

export class OrganizationService {
  /**
   * Resolves the top-level organization ID (regional council or community ID) given a synagogue ID.
   */
  static async resolveOrganizationId(synagogueId?: string | null, fallbackOrgId?: string | null): Promise<string | null> {
    const client = getBrowserSupabaseClient();
    if (!client || !synagogueId) return fallbackOrgId || null;

    try {
      const { data: synData } = await client
        .from('synagogues')
        .select('id, community_id, communities(id, regional_council_id)')
        .eq('id', synagogueId)
        .maybeSingle();

      if (synData) {
        return (synData.communities as any)?.regional_council_id || synData.community_id || synagogueId;
      }
    } catch (err) {
      console.warn('OrganizationService.resolveOrganizationId warning:', err);
    }

    return fallbackOrgId || synagogueId;
  }
}
