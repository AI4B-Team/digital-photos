
-- Sessions table: one row per portrait creation session
CREATE TABLE public.sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz DEFAULT now(),
  category      text,
  styles        text[],
  photo_url     text,
  status        text DEFAULT 'pending',
  order_id      text,
  order_product text,
  stripe_session_id text,
  user_email    text
);

-- Portraits table: AI-generated images per session
CREATE TABLE public.portraits (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    uuid REFERENCES public.sessions(id) ON DELETE CASCADE,
  style         text,
  url           text,
  url_hd        text,
  created_at    timestamptz DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portraits ENABLE ROW LEVEL SECURITY;

-- Sessions: allow anonymous inserts and reads (no auth required for this app)
CREATE POLICY "Anyone can create sessions" ON public.sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read sessions" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can update sessions" ON public.sessions FOR UPDATE USING (true);

-- Portraits: allow inserts from edge functions and reads
CREATE POLICY "Anyone can insert portraits" ON public.portraits FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read portraits" ON public.portraits FOR SELECT USING (true);

-- Storage bucket for uploaded photos
INSERT INTO storage.buckets (id, name, public) VALUES ('portraits', 'portraits', true);

-- Storage policies: allow anyone to upload and read photos
CREATE POLICY "Anyone can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portraits');
CREATE POLICY "Anyone can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'portraits');
