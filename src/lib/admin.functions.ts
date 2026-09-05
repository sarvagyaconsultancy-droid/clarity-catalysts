import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertAdmin(supabase: {
  from: (t: string) => {
    select: (c: string) => {
      eq: (
        c: string,
        v: string,
      ) => { eq: (c: string, v: string) => { maybeSingle: () => Promise<{ data: unknown }> } };
    };
  };
}, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Not authorised");
}

const ENQUIRY_STATUSES = [
  "new",
  "contacted",
  "consultation",
  "health_check",
  "proposal",
  "won",
  "lost",
] as const;

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [events, enquiries, consultations, quickTests, reviews] = await Promise.all([
      supabaseAdmin
        .from("analytics_events")
        .select("event_type,path,referrer_source,visitor_hash,is_new_visitor,device,country,created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000),
      supabaseAdmin.from("enquiries").select("*").order("created_at", { ascending: false }).limit(300),
      supabaseAdmin
        .from("consultations")
        .select("*")
        .order("slot_date", { ascending: true })
        .limit(300),
      supabaseAdmin.from("quick_tests").select("*").order("created_at", { ascending: false }).limit(300),
      supabaseAdmin.from("reviews").select("*").order("created_at", { ascending: false }).limit(200),
    ]);

    const ev = events.data ?? [];
    const views = ev.filter((e) => e.event_type === "page_view");
    const uniqueVisitors = new Set(views.map((v) => v.visitor_hash)).size;
    const newVisitors = new Set(
      views.filter((v) => v.is_new_visitor).map((v) => v.visitor_hash),
    ).size;

    const tally = (list: string[]) => {
      const m: Record<string, number> = {};
      for (const key of list) m[key] = (m[key] ?? 0) + 1;
      return Object.entries(m)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    };

    const countOf = (type: string) => ev.filter((e) => e.event_type === type).length;

    return {
      totals: {
        visitors: uniqueVisitors,
        newVisitors,
        returningVisitors: Math.max(uniqueVisitors - newVisitors, 0),
        pageViews: views.length,
        enquiries: (enquiries.data ?? []).length,
        consultations: (consultations.data ?? []).length,
        quickTests: (quickTests.data ?? []).length,
        pendingReviews: (reviews.data ?? []).filter((r) => r.status === "pending").length,
      },
      funnel: [
        { stage: "Visitors", value: uniqueVisitors },
        { stage: "Quick Test started", value: countOf("quick_test_start") },
        { stage: "Quick Test completed", value: countOf("quick_test_complete") },
        { stage: "Consultation clicks", value: countOf("cta_book_consultation") },
        { stage: "Consultations booked", value: (consultations.data ?? []).length },
      ],
      sources: tally(views.map((v) => v.referrer_source ?? "direct")),
      pages: tally(views.map((v) => v.path ?? "/")),
      devices: tally(views.map((v) => v.device ?? "unknown")),
      countries: tally(views.map((v) => v.country ?? "unknown")),
      enquiries: enquiries.data ?? [],
      consultations: consultations.data ?? [],
      quickTests: quickTests.data ?? [],
      reviews: reviews.data ?? [],
    };
  });

export const updateEnquiryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(ENQUIRY_STATUSES) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("enquiries").update({ status: data.status }).eq("id", data.id);
    return { ok: true as const };
  });

export const updateConsultationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(ENQUIRY_STATUSES) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("consultations").update({ status: data.status }).eq("id", data.id);
    return { ok: true as const };
  });

export const moderateReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["approved", "rejected", "pending"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("reviews").update({ status: data.status }).eq("id", data.id);
    return { ok: true as const };
  });

export const getContentEntries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("site_content").select("*").order("key");
    return { entries: data ?? [] };
  });

export const saveContentEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ key: z.string().trim().min(1).max(120), value: z.string().max(20000) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("site_content")
      .upsert({ key: data.key, value: { text: data.value } }, { onConflict: "key" });
    return { ok: true as const };
  });

export const deleteContentEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ key: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("site_content").delete().eq("key", data.key);
    return { ok: true as const };
  });

export const getMyAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: Boolean(data) };
  });

/** One-time bootstrap: the first signed-in user becomes admin when none exists. */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) return { claimed: false as const };
    await supabaseAdmin.from("user_roles").insert({ user_id: context.userId, role: "admin" });
    return { claimed: true as const };
  });
