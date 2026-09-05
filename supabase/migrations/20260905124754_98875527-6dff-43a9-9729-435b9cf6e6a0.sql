
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ENQUIRIES
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business_name text,
  email text NOT NULL,
  phone text,
  topic text,
  message text NOT NULL,
  source text,
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read enquiries" ON public.enquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update enquiries" ON public.enquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete enquiries" ON public.enquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER enquiries_updated BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CONSULTATIONS
CREATE TABLE public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business_name text,
  email text NOT NULL,
  phone text,
  slot_date date NOT NULL,
  slot_time time NOT NULL,
  requirement text,
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (slot_date, slot_time)
);
GRANT SELECT, UPDATE, DELETE ON public.consultations TO authenticated;
GRANT ALL ON public.consultations TO service_role;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read consultations" ON public.consultations FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update consultations" ON public.consultations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete consultations" ON public.consultations FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER consultations_updated BEFORE UPDATE ON public.consultations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- AVAILABILITY
CREATE TABLE public.availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday smallint NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_minutes smallint NOT NULL DEFAULT 30,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.availability_rules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability_rules TO authenticated;
GRANT ALL ON public.availability_rules TO service_role;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "availability public read" ON public.availability_rules FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY "admins manage availability" ON public.availability_rules FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.availability_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_date date NOT NULL UNIQUE,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.availability_blocks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability_blocks TO authenticated;
GRANT ALL ON public.availability_blocks TO service_role;
ALTER TABLE public.availability_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blocks public read" ON public.availability_blocks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage blocks" ON public.availability_blocks FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.availability_rules (weekday, start_time, end_time, slot_minutes) VALUES
  (1,'10:00','17:00',30),(2,'10:00','17:00',30),(3,'10:00','17:00',30),(4,'10:00','17:00',30),(5,'10:00','17:00',30),(6,'10:00','13:00',30);

-- QUICK TEST
CREATE TABLE public.quick_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  score smallint NOT NULL DEFAULT 0,
  band text NOT NULL,
  name text,
  email text,
  business_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.quick_tests TO authenticated;
GRANT ALL ON public.quick_tests TO service_role;
ALTER TABLE public.quick_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read quick tests" ON public.quick_tests FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete quick tests" ON public.quick_tests FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- REVIEWS
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business_name text,
  rating smallint NOT NULL,
  feedback text NOT NULL,
  recommend boolean,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "approved reviews public" ON public.reviews FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "admins read all reviews" ON public.reviews FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update reviews" ON public.reviews FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete reviews" ON public.reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER reviews_updated BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ANALYTICS
CREATE TABLE public.analytics_events (
  id bigserial PRIMARY KEY,
  event_type text NOT NULL,
  path text,
  referrer_source text,
  visitor_hash text,
  is_new_visitor boolean,
  device text,
  country text,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX analytics_events_created_idx ON public.analytics_events (created_at DESC);
CREATE INDEX analytics_events_type_idx ON public.analytics_events (event_type);
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read analytics" ON public.analytics_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- CMS CONTENT
CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content public read" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage content" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
