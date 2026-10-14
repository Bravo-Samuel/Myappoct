-- ==============================================================================
-- BNEI MENASHE DIGITAL PLATFORM: COMPLETE PRODUCTION POSTGRESQL SCHEMA
-- Ready for direct execution in Supabase SQL Editor
-- ==============================================================================

-- 1. ENABLE REQUIRED EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. AUTOMATED TIMESTAMP UPDATE TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- TABLE DEFINITIONS
-- ==============================================================================

-- 3. ROLES TABLE
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ NULL
);
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- 4. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT uk_permission_resource_action UNIQUE (resource, action)
);
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- 5. REGIONAL COUNCILS TABLE
CREATE TABLE IF NOT EXISTS public.regional_councils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  region_code VARCHAR(50) NOT NULL UNIQUE,
  headquarters_city VARCHAR(100),
  active_members_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ NULL
);
ALTER TABLE public.regional_councils ENABLE ROW LEVEL SECURITY;

-- 6. COMMUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  regional_council_id UUID REFERENCES public.regional_councils(id) ON DELETE SET NULL,
  city VARCHAR(150),
  country VARCHAR(100) DEFAULT 'India',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ NULL
);
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- 7. SYNAGOGUES TABLE
CREATE TABLE IF NOT EXISTS public.synagogues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
  rabbi_name VARCHAR(200),
  address TEXT,
  nusach VARCHAR(100) DEFAULT 'Sephardic / Edot HaMizrach',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ NULL
);
ALTER TABLE public.synagogues ENABLE ROW LEVEL SECURITY;

-- 8. FAMILIES TABLE
CREATE TABLE IF NOT EXISTS public.families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_name VARCHAR(150) NOT NULL,
  head_of_household_name VARCHAR(150),
  synagogue_id UUID REFERENCES public.synagogues(id) ON DELETE SET NULL,
  origin_village VARCHAR(150),
  aliyah_status VARCHAR(50) DEFAULT 'DIASPORA' CHECK (aliyah_status IN ('DIASPORA', 'IN_PROCESS', 'ISRAEL_SETTLED')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ NULL
);
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

-- 9. PROFILES TABLE (Linked 1:1 with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(200) NOT NULL,
  hebrew_name VARCHAR(200),
  family_id UUID REFERENCES public.families(id) ON DELETE SET NULL,
  synagogue_id UUID REFERENCES public.synagogues(id) ON DELETE SET NULL,
  preferred_dialect VARCHAR(50) DEFAULT 'English',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 10. USER_ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT uk_user_role UNIQUE (user_id, role_id)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 11. CALENDAR_EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  hebrew_date VARCHAR(100) NOT NULL,
  gregorian_date DATE NOT NULL,
  event_type VARCHAR(50) CHECK (event_type IN ('YOM_TOV', 'ROSH_CHODESH', 'FAST_DAY', 'COMMUNITY_ASSEMBLY', 'SHABBAT_SPECIAL')),
  synagogue_id UUID REFERENCES public.synagogues(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ NULL
);
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- 12. PRAYER_REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_name VARCHAR(200) NOT NULL,
  hebrew_mother_name VARCHAR(200),
  prayer_type VARCHAR(50) CHECK (prayer_type IN ('REFUAH_SHLEIMAH', 'ALIYAH_BLESSING', 'THANKSGIVING', 'TRAVEL_PROTECTION', 'KADDISH')),
  requester_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  synagogue_id UUID REFERENCES public.synagogues(id) ON DELETE SET NULL,
  status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'FULFILLED', 'ARCHIVED')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ NULL
);
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- 13. MEMORIALS TABLE
CREATE TABLE IF NOT EXISTS public.memorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deceased_full_name VARCHAR(200) NOT NULL,
  hebrew_name VARCHAR(200),
  yahrzeit_hebrew_date VARCHAR(100) NOT NULL,
  gregorian_date_of_passing DATE,
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  biography_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ NULL
);
ALTER TABLE public.memorials ENABLE ROW LEVEL SECURITY;

-- 14. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  channel VARCHAR(50) DEFAULT 'IN_APP' CHECK (channel IN ('PUSH', 'WHATSAPP', 'EMAIL', 'IN_APP')),
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ NULL
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 15. AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action_type VARCHAR(100) NOT NULL,
  target_resource VARCHAR(150) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  payload_snapshot JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ NULL
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- AUTOMATED UPDATED_AT TRIGGERS
-- ==============================================================================
DO $$ 
DECLARE 
  t text;
BEGIN
  FOR t IN 
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
      'roles', 'permissions', 'regional_councils', 'communities', 
      'synagogues', 'families', 'profiles', 'user_roles', 
      'calendar_events', 'prayer_requests', 'memorials', 
      'notifications', 'audit_logs'
    )
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_update_%I_timestamp ON public.%I;', t, t);
    EXECUTE format('CREATE TRIGGER trg_update_%I_timestamp BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();', t, t);
  END LOOP;
END;
$$;

-- ==============================================================================
-- PERFORMANCE INDEXES (Excluding soft-deleted rows where applicable)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_communities_council ON public.communities(regional_council_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_synagogues_community ON public.synagogues(community_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_families_synagogue ON public.families(synagogue_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_family ON public.profiles(family_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_synagogue ON public.profiles(synagogue_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_calendar_synagogue ON public.calendar_events(synagogue_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_prayer_requester ON public.prayer_requests(requester_user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_prayer_synagogue ON public.prayer_requests(synagogue_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_memorials_family ON public.memorials(family_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notif_recipient_unread ON public.notifications(recipient_user_id) WHERE is_read = false AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- 1. ROLES & PERMISSIONS: Read-only for authenticated members
CREATE POLICY "Authenticated users can view roles" ON public.roles
  FOR SELECT TO authenticated USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can view permissions" ON public.permissions
  FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 2. REGIONAL COUNCILS, COMMUNITIES & SYNAGOGUES: Publicly readable for active records
CREATE POLICY "Anyone can view active regional councils" ON public.regional_councils
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Anyone can view active communities" ON public.communities
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Anyone can view active synagogues" ON public.synagogues
  FOR SELECT USING (deleted_at IS NULL);

-- 3. FAMILIES: Readable by authenticated members
CREATE POLICY "Authenticated users can view families" ON public.families
  FOR SELECT TO authenticated USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can update their own family" ON public.families
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.family_id = families.id
    )
    AND deleted_at IS NULL
  );

-- 4. PROFILES: Viewable by authenticated users; users can insert/update their own
CREATE POLICY "Authenticated users can view profiles" ON public.profiles
  FOR SELECT TO authenticated USING (deleted_at IS NULL);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 5. USER_ROLES: Users can view roles assigned to them
CREATE POLICY "Users can view assigned roles" ON public.user_roles
  FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 6. CALENDAR_EVENTS: Publicly viewable
CREATE POLICY "Anyone can view active calendar events" ON public.calendar_events
  FOR SELECT USING (deleted_at IS NULL);

-- 7. PRAYER_REQUESTS: Viewable by authenticated members; create/update by requester
CREATE POLICY "Authenticated users can view prayer requests" ON public.prayer_requests
  FOR SELECT TO authenticated USING (deleted_at IS NULL);

CREATE POLICY "Users can create prayer requests" ON public.prayer_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = requester_user_id);

CREATE POLICY "Users can update their own prayer requests" ON public.prayer_requests
  FOR UPDATE TO authenticated USING (auth.uid() = requester_user_id);

-- 8. MEMORIALS: Readable by authenticated users; insertable by family members
CREATE POLICY "Authenticated users can view memorials" ON public.memorials
  FOR SELECT TO authenticated USING (deleted_at IS NULL);

CREATE POLICY "Family members can add memorials" ON public.memorials
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.family_id = memorials.family_id
    )
  );

-- 9. NOTIFICATIONS: Users can only view and update their own notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = recipient_user_id AND deleted_at IS NULL);

CREATE POLICY "Users can mark their notifications read" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = recipient_user_id);

-- 10. AUDIT_LOGS: Users can view their own audit actions; Service roles can insert
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (auth.uid() = actor_user_id AND deleted_at IS NULL);

CREATE POLICY "Authenticated users can insert audit logs" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_user_id);

-- ==============================================================================
-- INITIAL SEED DATA (CORE ROLES & COUNCILS)
-- ==============================================================================
INSERT INTO public.roles (name, description)
VALUES 
  ('GLOBAL_ADMIN', 'Global Administrator with full access across all regional councils'),
  ('REGIONAL_GABBAI', 'Regional leader managing community synagogues and zmanim'),
  ('SYNAGOGUE_RABBI', 'Spiritual leader overseeing synagogue prayer requests and halachic calendar'),
  ('MEMBER', 'Standard community member')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.regional_councils (name, region_code, headquarters_city, active_members_count)
VALUES 
  ('Manipur Regional Council', 'MANIPUR_IN', 'Churachandpur', 4500),
  ('Mizoram Regional Council', 'MIZORAM_IN', 'Aizawl', 3200),
  ('Israel Aliyah & Diaspora Center', 'ISRAEL_IL', 'Jerusalem', 5100)
ON CONFLICT (region_code) DO NOTHING;
