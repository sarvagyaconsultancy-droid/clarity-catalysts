import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAdminOverview,
  getContentEntries,
  moderateReview,
  saveContentEntry,
  updateConsultationStatus,
  updateEnquiryStatus,
} from "@/lib/admin.functions";

const STATUSES = [
  "new",
  "contacted",
  "consultation",
  "health_check",
  "proposal",
  "won",
  "lost",
] as const;

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin | Sarvagya Consultancy" },
      { name: "description", content: "Private dashboard for Sarvagya Consultancy." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin | Sarvagya Consultancy" },
      { property: "og:description", content: "Private dashboard for Sarvagya Consultancy." },
    ],
  }),
  component: AdminPage,
});

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function Tally({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="font-display text-sm font-semibold tracking-tight">{title}</h3>
      <ul className="mt-4 space-y-3">
        {rows.length === 0 && <li className="text-sm text-muted-foreground">No data yet.</li>}
        {rows.map((r) => (
          <li key={r.label} className="text-sm">
            <div className="flex justify-between gap-4">
              <span className="truncate">{r.label}</span>
              <span className="text-muted-foreground">{r.count}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${(r.count / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth" });
      else setReady(true);
    });
  }, [navigate]);

  const overviewFn = useServerFn(getAdminOverview);
  const contentFn = useServerFn(getContentEntries);
  const setEnquiry = useServerFn(updateEnquiryStatus);
  const setConsultation = useServerFn(updateConsultationStatus);
  const setReview = useServerFn(moderateReview);
  const saveContent = useServerFn(saveContentEntry);

  const overview = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => overviewFn(),
    enabled: ready,
  });
  const content = useQuery({
    queryKey: ["admin-content"],
    queryFn: () => contentFn(),
    enabled: ready,
  });

  const [contentKey, setContentKey] = useState("");
  const [contentValue, setContentValue] = useState("");

  if (!ready) return <main className="p-10 text-muted-foreground">Checking access…</main>;

  if (overview.isError) {
    return (
      <main className="mx-auto max-w-xl p-10">
        <h1 className="font-display text-2xl font-semibold">No access</h1>
        <p className="mt-3 text-muted-foreground">
          This account isn&apos;t allowed to view the dashboard.
        </p>
        <Button
          className="mt-6"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/auth" });
          }}
        >
          Sign out
        </Button>
      </main>
    );
  }

  const d = overview.data;

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Private</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/auth" });
          }}
        >
          Sign out
        </Button>
      </div>

      {!d ? (
        <p className="mt-10 text-muted-foreground">Loading…</p>
      ) : (
        <Tabs defaultValue="overview" className="mt-10">
          <TabsList className="flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="quicktests">Quick Tests</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Visitors (30d)" value={d.totals.visitors} />
              <Stat label="Page views" value={d.totals.pageViews} />
              <Stat label="Enquiries" value={d.totals.enquiries} />
              <Stat label="Consultations" value={d.totals.consultations} />
              <Stat label="New visitors" value={d.totals.newVisitors} />
              <Stat label="Returning" value={d.totals.returningVisitors} />
              <Stat label="Quick Tests" value={d.totals.quickTests} />
              <Stat label="Reviews pending" value={d.totals.pendingReviews} />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-sm font-semibold tracking-tight">Funnel</h3>
              <ul className="mt-4 space-y-3">
                {d.funnel.map((f) => (
                  <li key={f.stage} className="flex justify-between text-sm">
                    <span>{f.stage}</span>
                    <span className="text-muted-foreground">{f.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Tally title="Sources" rows={d.sources} />
              <Tally title="Pages" rows={d.pages} />
              <Tally title="Devices" rows={d.devices} />
              <Tally title="Countries" rows={d.countries} />
            </div>
          </TabsContent>

          <TabsContent value="enquiries" className="mt-8">
            <ul className="space-y-4">
              {d.enquiries.length === 0 && (
                <li className="text-muted-foreground">No enquiries yet.</li>
              )}
              {d.enquiries.map((e) => (
                <li key={e.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {e.name}
                        {e.business_name ? ` — ${e.business_name}` : ""}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {e.email}
                        {e.phone ? ` · ${e.phone}` : ""}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed">{e.message}</p>
                    </div>
                    <Select
                      value={e.status ?? "new"}
                      onValueChange={async (status) => {
                        await setEnquiry({
                          data: { id: e.id, status: status as (typeof STATUSES)[number] },
                        });
                        qc.invalidateQueries({ queryKey: ["admin-overview"] });
                      }}
                    >
                      <SelectTrigger className="w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="bookings" className="mt-8">
            <ul className="space-y-4">
              {d.consultations.length === 0 && (
                <li className="text-muted-foreground">No bookings yet.</li>
              )}
              {d.consultations.map((c) => (
                <li key={c.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {c.slot_date} at {String(c.slot_time).slice(0, 5)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {c.name}
                        {c.business_name ? ` — ${c.business_name}` : ""} · {c.email}
                        {c.phone ? ` · ${c.phone}` : ""}
                      </p>
                      {c.requirement && (
                        <p className="mt-3 text-sm leading-relaxed">{c.requirement}</p>
                      )}
                    </div>
                    <Select
                      value={c.status ?? "new"}
                      onValueChange={async (status) => {
                        await setConsultation({
                          data: { id: c.id, status: status as (typeof STATUSES)[number] },
                        });
                        qc.invalidateQueries({ queryKey: ["admin-overview"] });
                      }}
                    >
                      <SelectTrigger className="w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="quicktests" className="mt-8">
            <ul className="space-y-4">
              {d.quickTests.length === 0 && (
                <li className="text-muted-foreground">No Quick Test results yet.</li>
              )}
              {d.quickTests.map((q) => (
                <li key={q.id} className="rounded-2xl border border-border bg-card p-5 text-sm">
                  <p className="font-medium">
                    Score {q.score} · {q.band}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {q.name || "Anonymous"}
                    {q.business_name ? ` — ${q.business_name}` : ""}
                    {q.email ? ` · ${q.email}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <ul className="space-y-4">
              {d.reviews.length === 0 && <li className="text-muted-foreground">No reviews yet.</li>}
              {d.reviews.map((r) => (
                <li key={r.id} className="rounded-2xl border border-border bg-card p-5">
                  <p className="font-medium">
                    {r.name}
                    {r.business_name ? ` — ${r.business_name}` : ""} · {r.rating}/5
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{r.feedback}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {r.status}
                  </p>
                  <div className="mt-4 flex gap-3">
                    {(["approved", "rejected", "pending"] as const).map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={r.status === s ? "default" : "outline"}
                        onClick={async () => {
                          await setReview({ data: { id: r.id, status: s } });
                          qc.invalidateQueries({ queryKey: ["admin-overview"] });
                        }}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="content" className="mt-8 space-y-8">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-sm font-semibold tracking-tight">
                Add or update a text block
              </h3>
              <div className="mt-4 grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ckey">Key</Label>
                  <Input
                    id="ckey"
                    value={contentKey}
                    onChange={(e) => setContentKey(e.target.value)}
                    placeholder="home.hero.title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvalue">Text</Label>
                  <Textarea
                    id="cvalue"
                    rows={4}
                    value={contentValue}
                    onChange={(e) => setContentValue(e.target.value)}
                  />
                </div>
                <div>
                  <Button
                    disabled={!contentKey.trim()}
                    onClick={async () => {
                      await saveContent({ data: { key: contentKey.trim(), value: contentValue } });
                      setContentKey("");
                      setContentValue("");
                      qc.invalidateQueries({ queryKey: ["admin-content"] });
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>

            <ul className="space-y-3">
              {(content.data?.entries ?? []).map((entry) => (
                <li
                  key={entry.key}
                  className="rounded-2xl border border-border bg-card p-5 text-sm"
                >
                  <p className="font-medium">{entry.key}</p>
                  <p className="mt-1 text-muted-foreground">
                    {typeof entry.value === "object" &&
                    entry.value !== null &&
                    "text" in (entry.value as Record<string, unknown>)
                      ? String((entry.value as { text?: unknown }).text ?? "")
                      : JSON.stringify(entry.value)}
                  </p>
                  <Button
                    className="mt-3"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setContentKey(entry.key);
                      setContentValue(
                        typeof entry.value === "object" &&
                          entry.value !== null &&
                          "text" in (entry.value as Record<string, unknown>)
                          ? String((entry.value as { text?: unknown }).text ?? "")
                          : "",
                      );
                    }}
                  >
                    Edit
                  </Button>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}
