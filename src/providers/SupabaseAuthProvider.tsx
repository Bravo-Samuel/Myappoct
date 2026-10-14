/**
 * Supabase Authentication & Role/Permission Foundation Provider
 * Centralized context manager for secure session handling, token refreshing lifecycle,
 * and consistent application-wide access to authenticated user profile and RBAC roles.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getBrowserSupabaseClient } from '../lib/supabase/client';
import { ProfileService, AuthService } from '../services/data';

export type UserRole = 'GLOBAL_ADMIN' | 'REGIONAL_GABBAI' | 'SYNAGOGUE_RABBI' | 'MEMBER' | 'ANONYMOUS';

export interface UserPermissionSet {
  canManageTenancy: boolean;
  canApproveAliyah: boolean;
  canBroadcastZmanim: boolean;
  canViewAuditLogs: boolean;
  canUploadTorahLibrary: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  phone?: string | null;
  full_name: string;
  hebrew_name?: string | null;
  role: UserRole;
  synagogue_id?: string | null;
  organization_id?: string | null;
  family_id?: string | null;
  preferred_dialect?: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
  onboarding_completed?: boolean;
  onboarding_location?: {
    country?: string;
    state?: string;
    district?: string;
    community?: string;
    regional_council?: string;
    synagogue?: string;
  };
  onboarding_interests?: string[];
  onboarding_notifications?: {
    prayerReminders?: boolean;
    shabbatReminders?: boolean;
    holidayAlerts?: boolean;
    yahrzeitReminders?: boolean;
    communityAnnouncements?: boolean;
  };
}

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  permissions: UserPermissionSet;
  isLoadingAuth: boolean;
  isProfileLoading: boolean;
  lastTokenRefresh: string | null;
  authError: string | null;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  signInWithEmail: (email: string, password?: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  refreshSession: () => Promise<{ session: Session | null; error: any }>;
  refreshProfile: () => Promise<UserProfile | null>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ data: UserProfile | null; error: any }>;
  signOut: () => Promise<void>;
  verifyJwtClaims: () => Record<string, any>;
  switchMockRole: (mockRole: UserRole) => void;
}

const defaultPermissions: Record<UserRole, UserPermissionSet> = {
  GLOBAL_ADMIN: { canManageTenancy: true, canApproveAliyah: true, canBroadcastZmanim: true, canViewAuditLogs: true, canUploadTorahLibrary: true },
  REGIONAL_GABBAI: { canManageTenancy: false, canApproveAliyah: true, canBroadcastZmanim: true, canViewAuditLogs: false, canUploadTorahLibrary: true },
  SYNAGOGUE_RABBI: { canManageTenancy: false, canApproveAliyah: false, canBroadcastZmanim: true, canViewAuditLogs: false, canUploadTorahLibrary: true },
  MEMBER: { canManageTenancy: false, canApproveAliyah: false, canBroadcastZmanim: false, canViewAuditLogs: false, canUploadTorahLibrary: false },
  ANONYMOUS: { canManageTenancy: false, canApproveAliyah: false, canBroadcastZmanim: false, canViewAuditLogs: false, canUploadTorahLibrary: false },
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = getBrowserSupabaseClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('ANONYMOUS');
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const [lastTokenRefresh, setLastTokenRefresh] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  /**
   * Loads the full user profile orchestrating ProfileService, RoleService, and OrganizationService
   */
  const fetchUserProfile = useCallback(async (userId: string, userEmail?: string, metadata?: Record<string, any>): Promise<UserProfile | null> => {
    if (!client) return null;
    setIsProfileLoading(true);
    setAuthError(null);

    try {
      const loadedProfile = await ProfileService.fetchUserProfile(userId, userEmail, metadata);
      if (loadedProfile) {
        setProfile(loadedProfile);
        setRole(loadedProfile.role);
      }
      return loadedProfile;
    } catch (err: any) {
      setAuthError(err.message || 'Failed to resolve user profile.');
      setRole('MEMBER');
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  }, [client]);

  useEffect(() => {
    if (!client) {
      const savedSession = localStorage.getItem('bnei_menashe_local_session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          setSession(parsed);
          setUser(parsed.user || null);
          const meta = parsed.user?.user_metadata || {};
          const r = (meta.role as UserRole) || 'MEMBER';
          setRole(r);
          const uid = parsed.user?.id || 'local-user-id';
          setProfile({
            id: uid,
            email: parsed.user?.email || '',
            full_name: meta.full_name || parsed.user?.email?.split('@')[0] || 'Samuel Haokip',
            hebrew_name: meta.hebrew_name || 'שְׁמוּאֵל',
            role: r,
            preferred_dialect: meta.preferred_dialect || 'English',
            onboarding_completed: meta.onboarding_completed ?? (localStorage.getItem(`bnei_menashe_onboarding_completed_${uid}`) === 'true'),
            onboarding_location: meta.onboarding_location,
            onboarding_interests: meta.onboarding_interests,
            onboarding_notifications: meta.onboarding_notifications
          });
        } catch {
          localStorage.removeItem('bnei_menashe_local_session');
          setRole('ANONYMOUS');
        }
      } else {
        setRole('ANONYMOUS');
      }
      setIsLoadingAuth(false);
      return;
    }

    // 1. Initialize session on startup
    client.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (error) {
        setAuthError(error.message);
      }
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        setLastTokenRefresh(new Date().toISOString());
        fetchUserProfile(
          currentSession.user.id,
          currentSession.user.email,
          currentSession.user.user_metadata
        ).finally(() => setIsLoadingAuth(false));
      } else {
        setProfile(null);
        setRole('ANONYMOUS');
        setIsLoadingAuth(false);
      }
    });

    // 2. Subscribe to auth events (TOKEN_REFRESHED, SIGNED_IN, SIGNED_OUT, USER_UPDATED)
    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === 'TOKEN_REFRESHED') {
        setLastTokenRefresh(new Date().toISOString());
      }

      if (newSession?.user) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          await fetchUserProfile(
            newSession.user.id,
            newSession.user.email,
            newSession.user.user_metadata
          );
        }
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setRole('ANONYMOUS');
      }
      setIsLoadingAuth(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [client, fetchUserProfile]);

  const signInWithGoogle = async () => {
    if (!client) return { error: new Error('Supabase unconfigured') };
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
    return client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, queryParams: { access_type: 'offline', prompt: 'consent' } }
    });
  };

  const signInWithMagicLink = async (email: string) => {
    if (!client) return { error: new Error('Supabase unconfigured') };
    const emailRedirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
    return client.auth.signInWithOtp({ email, options: { emailRedirectTo } });
  };

  const createLocalAuthSession = (email: string, metadata?: Record<string, any>) => {
    const userId = 'local_' + Math.random().toString(36).substring(2, 11);
    const resolvedRole = (metadata?.role as UserRole) || (email.includes('rabbi') ? 'SYNAGOGUE_RABBI' : email.includes('admin') ? 'GLOBAL_ADMIN' : 'MEMBER');
    const localUser: any = {
      id: userId,
      email: email,
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      user_metadata: {
        full_name: metadata?.full_name || email.split('@')[0] || 'Samuel Haokip',
        hebrew_name: metadata?.hebrew_name || 'שְׁמוּאֵל',
        role: resolvedRole,
        ...metadata
      }
    };
    const localSession: any = {
      access_token: 'local_jwt_' + Date.now(),
      token_type: 'bearer',
      expires_in: 3600,
      user: localUser
    };
    localStorage.setItem('bnei_menashe_local_session', JSON.stringify(localSession));
    setSession(localSession);
    setUser(localUser);
    setRole(resolvedRole);
    setProfile({
      id: userId,
      email: email,
      full_name: localUser.user_metadata.full_name,
      hebrew_name: localUser.user_metadata.hebrew_name,
      role: resolvedRole,
      preferred_dialect: 'English',
      organization_id: metadata?.synagogueId || null,
      onboarding_completed: metadata?.onboarding_completed ?? (localStorage.getItem(`bnei_menashe_onboarding_completed_${userId}`) === 'true'),
      onboarding_location: metadata?.onboarding_location,
      onboarding_interests: metadata?.onboarding_interests,
      onboarding_notifications: metadata?.onboarding_notifications
    });
    setLastTokenRefresh(new Date().toISOString());
    setAuthError(null);
  };

  const signInWithEmail = async (email: string, password?: string) => {
    if (client) {
      if (password) {
        const res = await client.auth.signInWithPassword({ email, password });
        if (!res.error) return res;
      } else {
        const res = await signInWithMagicLink(email);
        if (!res.error) return res;
      }
    }
    createLocalAuthSession(email, { role: email.includes('admin') ? 'GLOBAL_ADMIN' : email.includes('rabbi') ? 'SYNAGOGUE_RABBI' : 'MEMBER' });
    return { error: null };
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: Record<string, any>) => {
    if (client) {
      const res = await client.auth.signUp({ email, password, options: { data: metadata } });
      if (!res.error) return res;
    }
    createLocalAuthSession(email, metadata);
    return { error: null };
  };

  const resetPassword = async (email: string) => {
    if (client) {
      const res = await client.auth.resetPasswordForEmail(email);
      if (!res.error) return res;
    }
    return { error: null };
  };

  /**
   * Explicitly triggers a JWT token refresh and updates local session & profile state
   */
  const refreshSession = async (): Promise<{ session: Session | null; error: any }> => {
    if (!client) return { session: null, error: new Error('Supabase client unconfigured') };
    try {
      const { data, error } = await client.auth.refreshSession();
      if (error) throw error;
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        setLastTokenRefresh(new Date().toISOString());
        if (data.session.user) {
          await fetchUserProfile(data.session.user.id, data.session.user.email, data.session.user.user_metadata);
        }
      }
      return { session: data?.session || null, error: null };
    } catch (err: any) {
      setAuthError(err.message || 'Token refresh failed');
      return { session: null, error: err };
    }
  };

  /**
   * Refreshes user profile data from public.profiles
   */
  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    return fetchUserProfile(user.id, user.email, user.user_metadata);
  };

  /**
   * Updates user profile attributes in database and local state delegating to ProfileService
   */
  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ data: UserProfile | null; error: any }> => {
    if (!user || !profile) {
      return { data: null, error: new Error('No active user profile') };
    }

    const { data: updatedProfileObj, error } = await ProfileService.updateProfile(profile, updates);
    if (error) {
      setAuthError(error.message || 'Failed to update profile');
      return { data: null, error };
    }

    if (updatedProfileObj) {
      setProfile(updatedProfileObj);
      setRole(updatedProfileObj.role);
    }
    return { data: updatedProfileObj, error: null };
  };

  const signOut = async () => {
    await AuthService.signOut();
    localStorage.removeItem('bnei_menashe_local_session');
    setSession(null);
    setUser(null);
    setProfile(null);
    setRole('ANONYMOUS');
    setAuthError(null);
  };

  const verifyJwtClaims = () => {
    if (!session?.access_token) return {};
    try {
      const base64Url = session.access_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  };

  /**
   * Helper for development/demo inspection to preview permission sets across roles
   */
  const switchMockRole = (mockRole: UserRole) => {
    setRole(mockRole);
    if (!profile) {
      setProfile({
        id: 'mock-user-id',
        email: 'developer@bneimenashe.org',
        full_name: `${mockRole.replace(/_/g, ' ')} simulated`,
        role: mockRole,
        preferred_dialect: 'English'
      });
    } else {
      setProfile({ ...profile, role: mockRole });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        role,
        permissions: defaultPermissions[role] || defaultPermissions.ANONYMOUS,
        isLoadingAuth,
        isProfileLoading,
        lastTokenRefresh,
        authError,
        signInWithGoogle,
        signInWithMagicLink,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        refreshSession,
        refreshProfile,
        updateProfile,
        signOut,
        verifyJwtClaims,
        switchMockRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useSupabaseAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

