ALTER TABLE public.consultations
  ADD COLUMN calendar_event_id text,
  ADD COLUMN meet_link text;

COMMENT ON COLUMN public.consultations.calendar_event_id IS 'Google Calendar event identifier created for the consultation';
COMMENT ON COLUMN public.consultations.meet_link IS 'Google Meet joining URL created for the consultation';