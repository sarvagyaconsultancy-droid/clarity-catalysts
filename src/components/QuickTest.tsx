import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QUICK_TEST_QUESTIONS, ANSWER_OPTIONS, bandForScore, BAND_COPY } from "@/lib/content";
import { saveQuickTest } from "@/lib/site.functions";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const MAX = QUICK_TEST_QUESTIONS.length * 2;

export function QuickTest() {
  const save = useServerFn(saveQuickTest);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [details, setDetails] = useState({ name: "", email: "", businessName: "" });
  const [saved, setSaved] = useState(false);
  const [started, setStarted] = useState(false);

  const score = useMemo(
    () => Object.values(answers).reduce((a, b) => a + b, 0),
    [answers],
  );
  const band = bandForScore(score, MAX);
  const pct = Math.round((score / MAX) * 100);
  const current = QUICK_TEST_QUESTIONS[step] ?? QUICK_TEST_QUESTIONS[0]!;
  const progress = done ? 100 : Math.round((step / QUICK_TEST_QUESTIONS.length) * 100);

  function choose(value: number) {
    if (!started) {
      setStarted(true);
      track("quick_test_start");
    }
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    if (step + 1 < QUICK_TEST_QUESTIONS.length) {
      setStep(step + 1);
      return;
    }
    const total = Object.values(next).reduce((a, b) => a + b, 0);
    const finalBand = bandForScore(total, MAX);
    setDone(true);
    track("quick_test_complete", { band: finalBand, score: total });
    void save({ data: { answers: next, score: total, band: finalBand } }).catch(() => undefined);
  }

  function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    void save({
      data: {
        answers,
        score,
        band,
        name: details.name.slice(0, 100),
        email: details.email.slice(0, 255),
        businessName: details.businessName.slice(0, 120),
      },
    }).catch(() => undefined);
  }

  if (done) {
    const copy = BAND_COPY[band]!;
    return (
      <div className="rounded-3xl border border-border bg-card p-7 shadow-lift sm:p-10">
        <p className="text-eyebrow">Your Business Finance Snapshot</p>
        <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-center">
          <Dial pct={pct} />
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {band}
            </h3>
            <p className="mt-2 font-medium text-foreground">{copy.headline}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {copy.body}
            </p>
          </div>
        </div>

        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {QUICK_TEST_QUESTIONS.map((q) => {
            const v = answers[q.id] ?? 0;
            return (
              <li
                key={q.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm"
              >
                <span
                  className={cn(
                    "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                    v === 2 ? "bg-success" : v === 1 ? "bg-warning" : "bg-destructive",
                  )}
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">{q.question}</span>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 rounded-xl bg-muted px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          This result is a general self-assessment based on your own answers. It is not a
          professional audit, a financial diagnosis or a substitute for professional advice, and it
          is not the Sarvagya Business Health Check.
        </p>

        {!saved ? (
          <form onSubmit={saveDetails} className="mt-8 rounded-2xl border border-border p-5">
            <p className="font-display text-lg font-semibold">Want a closer look?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Leave your details and we&apos;ll pick this up in a free consultation. Optional.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <Label htmlFor="qt-name">Name</Label>
                <Input
                  id="qt-name"
                  value={details.name}
                  maxLength={100}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="qt-business">Business name</Label>
                <Input
                  id="qt-business"
                  value={details.businessName}
                  maxLength={120}
                  onChange={(e) => setDetails({ ...details, businessName: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="qt-email">Email</Label>
                <Input
                  id="qt-email"
                  type="email"
                  value={details.email}
                  maxLength={255}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>
            <Button type="submit" variant="secondary" className="mt-4 rounded-full">
              Save my snapshot
            </Button>
          </form>
        ) : (
          <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground">
            <Check className="h-4 w-4" aria-hidden="true" /> Saved. We&apos;ll have this ready for
            your consultation.
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full px-7"
            onClick={() => track("cta_book_consultation", { location: "quick_test_result" })}
          >
            <Link to="/contact" hash="book">
              Book a Free Consultation
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-7">
            <Link to="/financial-health-check">About the Business Health Check</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-7 shadow-lift sm:p-10">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {step + 1} of {QUICK_TEST_QUESTIONS.length}
        </span>
        <span>{progress}%</span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${Math.max(progress, 4)}%` }}
        />
      </div>

      <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        {current.question}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{current.hint}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {ANSWER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => choose(opt.value)}
            className="group rounded-2xl border border-border bg-background px-5 py-6 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-soft focus-visible:border-primary"
          >
            <span className="font-display text-lg font-semibold">{opt.label}</span>
            <ArrowRight className="mt-3 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Previous question
        </button>
      )}
    </div>
  );
}

function Dial({ pct }: { pct: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 128 128" className="h-32 w-32 shrink-0" role="img" aria-label={`${pct}%`}>
      <circle cx="64" cy="64" r={r} fill="none" stroke="var(--muted)" strokeWidth="10" />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * pct) / 100}
        transform="rotate(-90 64 64)"
        style={{ transition: "stroke-dashoffset 1.2s var(--ease-out-soft)" }}
      />
      <text
        x="64"
        y="70"
        textAnchor="middle"
        className="fill-foreground font-display text-2xl font-semibold"
      >
        {pct}%
      </text>
    </svg>
  );
}
