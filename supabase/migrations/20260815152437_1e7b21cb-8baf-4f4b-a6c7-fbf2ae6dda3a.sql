-- SESSIONS -----------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.sessions;

CREATE POLICY "Users can read own sessions"
  ON public.sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all sessions"
  ON public.sessions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own sessions"
  ON public.sessions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

REVOKE ALL ON public.sessions FROM anon;
GRANT INSERT ON public.sessions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.sessions TO authenticated;
GRANT ALL ON public.sessions TO service_role;

-- CLIENT PREVIEWS -----------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can read previews" ON public.client_previews;
DROP POLICY IF EXISTS "Anyone can update previews" ON public.client_previews;
DROP POLICY IF EXISTS "Anyone can insert previews" ON public.client_previews;

CREATE POLICY "Admins can read previews"
  ON public.client_previews FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON public.client_previews FROM anon;
REVOKE ALL ON public.client_previews FROM authenticated;
GRANT SELECT ON public.client_previews TO authenticated;
GRANT ALL ON public.client_previews TO service_role;

-- PREVIEW REMINDER LOG ------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can read reminder log" ON public.preview_reminder_log;
DROP POLICY IF EXISTS "Anyone can insert reminder log" ON public.preview_reminder_log;

CREATE POLICY "Admins can read reminder log"
  ON public.preview_reminder_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON public.preview_reminder_log FROM anon;
REVOKE ALL ON public.preview_reminder_log FROM authenticated;
GRANT SELECT ON public.preview_reminder_log TO authenticated;
GRANT ALL ON public.preview_reminder_log TO service_role;

-- PORTRAITS -----------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can insert portraits" ON public.portraits;
REVOKE INSERT, UPDATE, DELETE ON public.portraits FROM anon, authenticated;
GRANT SELECT ON public.portraits TO anon, authenticated;
GRANT ALL ON public.portraits TO service_role;