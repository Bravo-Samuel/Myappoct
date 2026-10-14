-- ==============================================================================
-- BNEI MENASHE DIGITAL PLATFORM: ROW LEVEL SECURITY (RLS) TENANCY POLICIES
-- ==============================================================================
-- Enforces zero cross-tenant leakage. Authorized users access only their tenant data.
-- ==============================================================================

-- 1. PROFILES POLICIES
CREATE POLICY "Users can view profiles within their own organization or family"
ON public.profiles FOR SELECT
USING (
  auth.uid() = id
  OR organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'GLOBAL_ADMIN'
);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- 2. ORGANIZATIONS POLICIES
CREATE POLICY "Users can view their own organization and upstream councils"
ON public.organizations FOR SELECT
USING (
  id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('GLOBAL_ADMIN', 'REGIONAL_GABBAI')
);

-- 3. REGIONAL COUNCILS POLICIES
CREATE POLICY "Public read access to regional councils for synagogue selection"
ON public.regional_councils FOR SELECT
USING (deleted_at IS NULL);

-- 4. FAMILIES POLICIES
CREATE POLICY "Members view only their own household or synagogue members"
ON public.families FOR SELECT
USING (
  id = (SELECT family_id FROM public.profiles WHERE id = auth.uid())
  OR synagogue_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

-- 5. PRAYER REQUESTS POLICIES
CREATE POLICY "Synagogue members view active community prayer requests"
ON public.prayer_requests FOR SELECT
USING (
  organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  AND deleted_at IS NULL
);

CREATE POLICY "Members can insert prayer requests for their synagogue"
ON public.prayer_requests FOR INSERT
WITH CHECK (
  requester_user_id = auth.uid()
  AND organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

-- 6. TORAH LIBRARY POLICIES
CREATE POLICY "All authenticated users view public Torah study materials"
ON public.torah_library FOR SELECT
USING (is_public = true AND deleted_at IS NULL);

-- 7. MEMORIAL RECORDS POLICIES
CREATE POLICY "Family members view ancestral Yahrzeit records"
ON public.memorial_records FOR SELECT
USING (
  family_id = (SELECT family_id FROM public.profiles WHERE id = auth.uid())
  OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('GLOBAL_ADMIN', 'SYNAGOGUE_RABBI')
);

-- 8. AI RABBI CONVERSATIONS POLICIES
CREATE POLICY "Users access strictly their own halachic AI sessions"
ON public.ai_rabbi_conversations FOR ALL
USING (user_id = auth.uid());

-- 9. NOTIFICATIONS POLICIES
CREATE POLICY "Users access only their own notifications"
ON public.notifications FOR ALL
USING (recipient_user_id = auth.uid());

-- 10. SUBSCRIPTIONS POLICIES
CREATE POLICY "Synagogue Gabbais and Admins view organization billing"
ON public.subscriptions FOR SELECT
USING (
  organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('GLOBAL_ADMIN', 'SYNAGOGUE_RABBI', 'REGIONAL_GABBAI')
);

-- 11. AUDIT LOGS POLICIES (Strictly immutable & Global Admin only)
CREATE POLICY "Only Global Admins can view immutable audit trails"
ON public.audit_logs FOR SELECT
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'GLOBAL_ADMIN');
