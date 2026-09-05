import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const trimmed = (max: number) => z.string().trim().max(max);

const enquirySchema = z.object({
  name: trimmed(100).min(1, "Please enter your name"),
  businessName: trimmed(120).optional().default(""),
  email: trimmed(255).email("Please enter a valid email"),
  phone: trimmed(30).optional().default(""),
  topic: trimmed(120).optional().default(""),
  message: trimmed(2000).min(5, "Please tell us a little more"),
  source: trimmed(120).optional().default(""),
  company: trimmed(200).optional().default(""), // honeypot
});

const bookingSchema = z.object({
  name: trimmed(100).min(1),
  businessName: trimmed(120).optional().default(""),
  email: trimmed(255).email(),
  phone: trimmed(30).optional().default(""),
  slotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotTime: z.string().regex(/^\d{2}:\d{2}$/),
  requirement: trimmed(2000).optional().default(""),
  company: trimmed(200).optional().default(""),
});

const reviewSchema = z.object({
  name: trimmed(100).min(1),
  businessName: trimmed(120).optional().default(""),
  rating: z.number().int().min(1).max(5),
  feedback: trimmed(2000).min(5),
  recommend: z.boolean().optional().default(true),
  company: trimmed(200).optional().default(""),
});

const quickTestSchema = z.object({
  answers: z.record(z.string().max(40), z.number().int().min(0).max(2)),
  score: z.number().int().min(0).max(100),
  band: trimmed(40),
  name: trimmed(100).optional().default(""),
  email: trimmed(255).optional().default(""),
  businessName: trimmed(120).optional().default(""),
});

const eventSchema = z.object({
  eventType: trimmed(60),
  path: trimmed(300).optional().default(""),
  referrer: trimmed(400).optional().default(""),
  device: trimmed(20).optional().default(""),
  visitorId: trimmed(64).optional().default(""),
  isNewVisitor: z.boolean().optional().default(false),
  meta: z.record(z.string().max(40), z.union([z.string().max(200), z.number()])).optional(),
});

function clientIp() {
  return (
    getRequestHeader("cf-connecting-ip") ??
    getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

async function hashValue(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function referrerSource(referrer: string) {
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host.includes("instagram")) return "instagram";
    if (host.includes("google")) return "google";
    if (host.includes("bing") || host.includes("duckduckgo")) return "search";
    if (host.includes("facebook") || host.includes("linkedin") || host.includes("t.co"))
      return "social";
    return host;
  } catch {
    return "direct";
  }
}

/** Simple per-IP rate limit backed by the analytics table. */
async function withinRateLimit(kind: string, ipHash: string, maxPerHour: number) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("event_type", `submit:${kind}`)
    .eq("visitor_hash", ipHash)
    .gte("created_at", since);
  return (count ?? 0) < maxPerHour;
}

async function logSubmission(kind: string, ipHash: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin
    .from("analytics_events")
    .insert({ event_type: `submit:${kind}`, visitor_hash: ipHash });
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => enquirySchema.parse(data))
  .handler(async ({ data }) => {
    if (data.company) return { ok: true as const };
    const ipHash = await hashValue(clientIp());
    if (!(await withinRateLimit("enquiry", ipHash, 5))) {
      return { ok: false as const, error: "Too many submissions. Please try again later." };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("enquiries").insert({
      name: data.name,
      business_name: data.businessName || null,
      email: data.email,
      phone: data.phone || null,
      topic: data.topic || null,
      message: data.message,
      source: data.source || null,
    });
    if (error) {
      console.error("enquiry insert failed", error.message);
      return { ok: false as const, error: "We couldn't send that just now. Please try again." };
    }
    await logSubmission("enquiry", ipHash);
    return { ok: true as const };
  });

export const bookConsultation = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.company) return { ok: true as const };
    const ipHash = await hashValue(clientIp());
    if (!(await withinRateLimit("booking", ipHash, 5))) {
      return { ok: false as const, error: "Too many requests. Please try again later." };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("consultations").insert({
      name: data.name,
      business_name: data.businessName || null,
      email: data.email,
      phone: data.phone || null,
      slot_date: data.slotDate,
      slot_time: data.slotTime,
      requirement: data.requirement || null,
    });
    if (error) {
      if (error.code === "23505") {
        return { ok: false as const, error: "That slot was just taken. Please pick another." };
      }
      console.error("booking insert failed", error.message);
      return { ok: false as const, error: "We couldn't confirm that slot. Please try again." };
    }
    await logSubmission("booking", ipHash);
    return { ok: true as const };
  });

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => reviewSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.company) return { ok: true as const };
    const ipHash = await hashValue(clientIp());
    if (!(await withinRateLimit("review", ipHash, 3))) {
      return { ok: false as const, error: "Too many submissions. Please try again later." };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("reviews").insert({
      name: data.name,
      business_name: data.businessName || null,
      rating: data.rating,
      feedback: data.feedback,
      recommend: data.recommend,
    });
    if (error) {
      console.error("review insert failed", error.message);
      return { ok: false as const, error: "We couldn't submit that. Please try again." };
    }
    await logSubmission("review", ipHash);
    return { ok: true as const };
  });

export const saveQuickTest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => quickTestSchema.parse(data))
  .handler(async ({ data }) => {
    const ipHash = await hashValue(clientIp());
    if (!(await withinRateLimit("quicktest", ipHash, 10))) return { ok: true as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("quick_tests").insert({
      answers: data.answers,
      score: data.score,
      band: data.band,
      name: data.name || null,
      email: data.email || null,
      business_name: data.businessName || null,
    });
    await logSubmission("quicktest", ipHash);
    return { ok: true as const };
  });

export const trackEvent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => eventSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const ip = clientIp();
      const country = getRequestHeader("cf-ipcountry") ?? null;
      const visitorHash = await hashValue(`${data.visitorId}:${ip}`);
      await supabaseAdmin.from("analytics_events").insert({
        event_type: data.eventType,
        path: data.path || null,
        referrer_source: referrerSource(data.referrer),
        visitor_hash: visitorHash,
        is_new_visitor: data.isNewVisitor,
        device: data.device || null,
        country,
        meta: data.meta ?? null,
      });
    } catch (err) {
      console.error("analytics failed", err);
    }
    return { ok: true as const };
  });

export const getApprovedReviews = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await client
    .from("reviews")
    .select("id,name,business_name,rating,feedback,recommend,created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(24);
  if (error) return { reviews: [] as NonNullable<typeof data> };
  return { reviews: data ?? [] };
});

/** Available consultation slots for the next 21 days. */
export const getAvailableSlots = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const today = new Date();
  const start = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const end = new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const [rules, blocks, booked] = await Promise.all([
    client.from("availability_rules").select("weekday,start_time,end_time,slot_minutes"),
    client.from("availability_blocks").select("block_date"),
    client
      .from("consultations")
      .select("slot_date,slot_time")
      .gte("slot_date", iso(start))
      .lte("slot_date", iso(end)),
  ]);

  const blocked = new Set((blocks.data ?? []).map((b) => b.block_date));
  const taken = new Set(
    (booked.data ?? []).map((b) => `${b.slot_date}T${String(b.slot_time).slice(0, 5)}`),
  );

  const days: { date: string; times: string[] }[] = [];
  for (let i = 0; i < 21; i++) {
    const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const date = iso(d);
    if (blocked.has(date)) continue;
    const weekday = d.getUTCDay();
    const times: string[] = [];
    for (const rule of rules.data ?? []) {
      if (rule.weekday !== weekday) continue;
      const [sh, sm] = String(rule.start_time).split(":").map(Number);
      const [eh, em] = String(rule.end_time).split(":").map(Number);
      const step = rule.slot_minutes || 30;
      for (let m = sh * 60 + sm; m + step <= eh * 60 + em; m += step) {
        const t = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
        if (!taken.has(`${date}T${t}`)) times.push(t);
      }
    }
    if (times.length) days.push({ date, times: times.sort() });
  }
  return { days };
});

export const getRequestPath = createServerFn({ method: "GET" }).handler(async () => {
  return { path: new URL(getRequest().url).pathname };
});
