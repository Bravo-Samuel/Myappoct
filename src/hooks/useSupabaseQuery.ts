/**
 * Reusable Supabase Data Query & Mutation Hook
 * Supplies standardized loading, error handling, soft-delete filtering, and RLS execution.
 */

import { useState, useCallback } from 'react';
import { useDatabase } from '../providers/DatabaseProvider';

export function useSupabaseQuery<T = any>(tableName: string) {
  const { client } = useDatabase();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveRecords = useCallback(async (limit = 50) => {
    if (!client) {
      setError('Supabase client unconfigured.');
      return [];
    }
    setLoading(true);
    setError(null);
    try {
      const { data: records, error: fetchErr } = await client
        .from(tableName)
        .select('*')
        .is('deleted_at', null)
        .limit(limit);

      if (fetchErr) throw fetchErr;
      setData(records as T[]);
      return records as T[];
    } catch (err: any) {
      setError(err.message || 'Failed to query active records.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [client, tableName]);

  const insertRecord = useCallback(async (payload: Partial<T>) => {
    if (!client) throw new Error('Supabase unconfigured');
    const { data: newRecord, error: insertErr } = await client
      .from(tableName)
      .insert([payload as any])
      .select()
      .single();
    if (insertErr) throw insertErr;
    setData(prev => [newRecord as T, ...prev]);
    return newRecord as T;
  }, [client, tableName]);

  return { data, loading, error, fetchActiveRecords, insertRecord };
}
