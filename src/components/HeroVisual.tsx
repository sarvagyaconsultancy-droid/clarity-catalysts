import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, IndianRupee, TrendingUp, WalletCards } from "lucide-react";

/**
 * Abstract financial visual: scattered figures settle into a structured ledger
 * and a rising trend as the visitor scrolls. No stock photography.
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const travelled = Math.min(Math.max(-rect.top / (rect.height * 0.9), 0), 1);
        setProgress(travelled);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const settle = window.setTimeout(() => setProgress((p) => Math.max(p, 0.22)), 700);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, []);

  const bars = [42, 54, 49, 66, 61, 78, 88];

  return (
    <div ref={ref} className="relative isolate mx-auto w-full max-w-xl" aria-hidden="true">
      <div className="absolute inset-8 -z-10 bg-accent/60 blur-3xl" />
      <div
        className="relative min-h-[29rem] overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-lift sm:p-7"
        style={{
          opacity: 0.82 + progress * 0.18,
          transform: `translateY(${(1 - progress) * 8}px)`,
          transition: "transform 0.9s var(--ease-out-soft), opacity 0.9s var(--ease-out-soft)",
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-eyebrow">Financial command view</p>
            <p className="mt-2 font-display text-xl font-semibold">Business pulse</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Books current
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-secondary p-4">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Cash position</span>
              <WalletCards className="h-4 w-4" />
            </div>
            <p className="mt-3 font-display text-2xl font-semibold">₹12.8L</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-success">
              <TrendingUp className="h-3.5 w-3.5" /> Healthy buffer
            </p>
          </div>
          <div className="rounded-2xl bg-navy p-4 text-navy-foreground">
            <div className="flex items-center justify-between opacity-70">
              <span className="text-xs font-medium">Receivables</span>
              <IndianRupee className="h-4 w-4" />
            </div>
            <p className="mt-3 font-display text-2xl font-semibold">₹4.2L</p>
            <p className="mt-1 text-xs opacity-70">3 follow-ups due</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-border p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Revenue trend</p>
              <p className="mt-1 font-display text-lg font-semibold">Clear upward momentum</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-success">
              +18.4% <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-4 flex h-24 items-end gap-2">
            {bars.map((height, index) => (
              <div key={height + index} className="flex h-full flex-1 items-end rounded-t bg-secondary">
                <div
                  className="w-full rounded-t bg-primary"
                  style={{
                    height: `${height * (0.45 + progress * 0.55)}%`,
                    transition: `height 0.9s var(--ease-out-soft) ${index * 55}ms`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {["GST reconciled", "MIS ready", "Payroll closed"].map((item) => (
            <div key={item} className="flex min-h-14 items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <Check className="h-3 w-3" />
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
