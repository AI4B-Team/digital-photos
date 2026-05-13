-- Preview galleries: persistent record of generated previews per client email
CREATE TABLE public.client_previews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  session_id UUID,
  category TEXT,
  portraits JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{url, style, hd_url?}]
  source_photo_url TEXT,
  ordered BOOLEAN NOT NULL DEFAULT FALSE,
  ordered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days')
);

CREATE INDEX idx_client_previews_email ON public.client_previews(lower(email));
CREATE INDEX idx_client_previews_expires_at ON public.client_previews(expires_at) WHERE ordered = FALSE;
CREATE INDEX idx_client_previews_session ON public.client_previews(session_id);

ALTER TABLE public.client_previews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert previews"
  ON public.client_previews FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can read previews"
  ON public.client_previews FOR SELECT TO public USING (true);

CREATE POLICY "Anyone can update previews"
  ON public.client_previews FOR UPDATE TO public USING (true);

-- Reminder log: which scheduled reminder has been queued for a given preview
CREATE TABLE public.preview_reminder_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preview_id UUID NOT NULL REFERENCES public.client_previews(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- 'day1' | 'day3' | 'day6' | 'day7_expired'
  queued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued', -- 'queued' | 'sent' | 'skipped'
  UNIQUE (preview_id, reminder_type)
);

ALTER TABLE public.preview_reminder_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reminder log"
  ON public.preview_reminder_log FOR SELECT TO public USING (true);

CREATE POLICY "Anyone can insert reminder log"
  ON public.preview_reminder_log FOR INSERT TO public WITH CHECK (true);