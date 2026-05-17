CREATE TABLE IF NOT EXISTS public.promo_codes (
  code         text PRIMARY KEY,
  discount_pct decimal(5,4) NOT NULL,
  label        text NOT NULL,
  max_uses     integer DEFAULT NULL,
  used_count   integer NOT NULL DEFAULT 0,
  expires_at   timestamptz DEFAULT NULL,
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- No client-side access. Only service role (used by edge functions) can read/write.
CREATE POLICY "service_only_promo_codes"
  ON public.promo_codes
  FOR ALL
  USING (false)
  WITH CHECK (false);

INSERT INTO public.promo_codes (code, discount_pct, label, max_uses) VALUES
  ('MOMGLOW30', 0.30, 'Mother''s Day — 30% off', 500),
  ('WELCOME15', 0.15, 'Welcome — 15% off',       NULL),
  ('REALART20', 0.20, 'REAL ART — 20% off',      1000),
  ('PETS15',    0.15, 'Pet Portrait — 15% off',  NULL)
ON CONFLICT (code) DO NOTHING;