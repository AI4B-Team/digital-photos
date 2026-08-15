DROP POLICY IF EXISTS "Anyone can read portraits" ON public.portraits;

REVOKE SELECT ON public.portraits FROM anon;
GRANT SELECT ON public.portraits TO authenticated;
GRANT ALL ON public.portraits TO service_role;

CREATE POLICY "Users can read portraits from own sessions"
ON public.portraits FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = portraits.session_id AND s.user_id = auth.uid()));

CREATE POLICY "Admins can read all portraits"
ON public.portraits FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));