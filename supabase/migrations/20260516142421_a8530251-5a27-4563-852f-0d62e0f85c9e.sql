ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS vip_purchased  boolean      DEFAULT false,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS prodigi_status text,
  ADD COLUMN IF NOT EXISTS shipped_at     timestamptz,
  ADD COLUMN IF NOT EXISTS tracking_url   text;

CREATE TABLE IF NOT EXISTS public.webhook_events (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  source           text        NOT NULL DEFAULT 'prodigi',
  event_type       text,
  prodigi_order_id text,
  session_id       text,
  payload          jsonb,
  processed_at     timestamptz DEFAULT now(),
  email_sent       boolean     DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_webhook_prodigi_order
  ON public.webhook_events(prodigi_order_id);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service role writes to webhook_events; no public access policies needed.
-- Admins can read via has_role check.
DROP POLICY IF EXISTS "Admins can read webhook_events" ON public.webhook_events;
CREATE POLICY "Admins can read webhook_events"
  ON public.webhook_events
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));