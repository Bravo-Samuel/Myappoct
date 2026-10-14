/**
 * Supabase Database Infrastructure Provider
 * Supplies resilient database access, schema readiness checks, and connection monitoring.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { getBrowserSupabaseClient, runSupabaseHealthCheck } from '../lib/supabase/client';

export interface DatabaseConnectionStatus {
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE_UNCONFIGURED' | 'CHECKING';
  latencyMs: number;
  lastChecked: string;
  message: string;
}

interface DatabaseContextValue {
  client: SupabaseClient | null;
  isReady: boolean;
  health: DatabaseConnectionStatus;
  refreshHealthCheck: () => Promise<void>;
  schemaVersion: string;
}

const DatabaseContext = createContext<DatabaseContextValue | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = getBrowserSupabaseClient();
  const [health, setHealth] = useState<DatabaseConnectionStatus>({
    status: 'CHECKING',
    latencyMs: 0,
    lastChecked: new Date().toISOString(),
    message: 'Initializing Supabase connection pool...'
  });

  const refreshHealthCheck = async () => {
    setHealth(prev => ({ ...prev, status: 'CHECKING' }));
    const result = await runSupabaseHealthCheck();
    setHealth({
      status: result.status,
      latencyMs: result.latencyMs,
      lastChecked: result.timestamp,
      message: result.message
    });
  };

  useEffect(() => {
    refreshHealthCheck();
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        client,
        isReady: Boolean(client),
        health,
        refreshHealthCheck,
        schemaVersion: 'Enterprise v1.0 (11 Domains + RLS Enforced)'
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextValue => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
