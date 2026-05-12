ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS prodigi_order_id TEXT,
  ADD COLUMN IF NOT EXISTS prodigi_status   TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS shipping_name    TEXT,
  ADD COLUMN IF NOT EXISTS shipping_email   TEXT,
  ADD COLUMN IF NOT EXISTS shipping_line1   TEXT,
  ADD COLUMN IF NOT EXISTS shipping_city    TEXT,
  ADD COLUMN IF NOT EXISTS shipping_zip     TEXT,
  ADD COLUMN IF NOT EXISTS shipping_country TEXT DEFAULT 'US',
  ADD COLUMN IF NOT EXISTS print_sku        TEXT,
  ADD COLUMN IF NOT EXISTS print_size       TEXT,
  ADD COLUMN IF NOT EXISTS print_frame      TEXT;

CREATE INDEX IF NOT EXISTS idx_sessions_prodigi_order_id
  ON public.sessions(prodigi_order_id);