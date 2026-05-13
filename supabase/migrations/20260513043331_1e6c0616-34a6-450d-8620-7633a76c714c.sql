CREATE TABLE IF NOT EXISTS public.lead_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  session_id text,
  category text,
  source text DEFAULT 'portrait_generation',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lead_captures_email ON public.lead_captures(email);
ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert lead" ON public.lead_captures FOR INSERT WITH CHECK (true);