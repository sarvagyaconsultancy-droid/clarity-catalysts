import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookConsultation, getAvailableSlots } from "@/lib/site.functions";
import { track } from "@/lib/analytics";

function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const hour = h ?? 0;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hr = hour % 12 === 0 ? 12 : hour % 12;
  return `${hr}:${String(m ?? 0).padStart(2, "0")} ${suffix}`;
}

export function BookingWidget() {
  const fetchSlots = useServerFn(getAvailableSlots);
  const book = useServerFn(bookConsultation);
  const { data, isLoading } = useQuery({
    queryKey: ["slots"],
    queryFn: () => fetchSlots(),
  });

  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const days = data?.days ?? [];
  const activeDay = days.find((d) => d.date === date) ?? days[0];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activeDay || !time) {
      toast.error("Please pick a date and time first.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const res = await book({
        data: {
          name: String(fd.get("name") ?? ""),
          businessName: String(fd.get("businessName") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          requirement: String(fd.get("requirement") ?? ""),
          company: String(fd.get("company") ?? ""),
          slotDate: activeDay.date,
          slotTime: time,
        },
      });
      if (res.ok) {
        setDone(true);
        track("consultation_booked");
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-[1.5rem] border border-border bg-card p-10 text-center">
        <CalendarCheck2 className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
        <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
          Your consultation request is in
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          We&apos;ve recorded your preferred slot
          {activeDay && time ? ` — ${formatDate(activeDay.date)} at ${formatTime(time)}` : ""}. We
          will confirm it with you directly before the call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[1.5rem] border border-border bg-card p-6 sm:p-9">
      <h3 className="font-display text-xl font-semibold tracking-tight">
        Book a Free Consultation
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick a slot that suits you. The call is free and there is no obligation.
      </p>

      {isLoading ? (
        <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading available slots…
        </div>
      ) : days.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          No slots are open at the moment. Please send an enquiry and we&apos;ll arrange a time.
        </p>
      ) : (
        <>
          <div className="mt-7">
            <p className="text-eyebrow">Choose a date</p>
            <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2">
              {days.map((d) => {
                const active = (date ?? days[0]?.date) === d.date;
                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => {
                      setDate(d.date);
                      setTime(null);
                    }}
                    aria-pressed={active}
                    className={`shrink-0 snap-start rounded-xl border px-4 py-3 text-sm transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    {formatDate(d.date)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-eyebrow">Choose a time</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(activeDay?.times ?? []).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  aria-pressed={time === t}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    time === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {formatTime(t)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="b-name">Your name *</Label>
          <Input id="b-name" name="name" required maxLength={100} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="b-business">Business name</Label>
          <Input id="b-business" name="businessName" maxLength={120} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="b-email">Email *</Label>
          <Input id="b-email" name="email" type="email" required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="b-phone">Phone</Label>
          <Input id="b-phone" name="phone" type="tel" maxLength={30} className="mt-2" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="b-req">What would you like to discuss?</Label>
          <Textarea id="b-req" name="requirement" rows={3} maxLength={2000} className="mt-2" />
        </div>
      </div>

      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <Button type="submit" size="lg" disabled={busy} className="mt-7 w-full rounded-full sm:w-auto sm:px-10">
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Request this slot
      </Button>
    </form>
  );
}
