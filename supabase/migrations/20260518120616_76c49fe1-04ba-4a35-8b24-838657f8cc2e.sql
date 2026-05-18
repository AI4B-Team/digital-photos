CREATE TABLE IF NOT EXISTS public.room_images (
  room_id        text PRIMARY KEY,
  url            text NOT NULL,
  regenerated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.room_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read room_images"
  ON public.room_images
  FOR SELECT
  USING (true);
