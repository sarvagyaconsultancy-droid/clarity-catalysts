import { useEffect, useRef, useState } from "react";

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

  const chips = [
    { label: "Invoice #2841", x: -34, y: -26, r: -13 },
    { label: "₹ 4,20,000", x: 30, y: -34, r: 10 },
    { label: "GSTR-3B", x: -40, y: 20, r: 8 },
    { label: "Receivables", x: 34, y: 24, r: -9 },
    { label: "Bank recon", x: -8, y: 36, r: 6 },
    { label: "Expenses", x: 12, y: -6, r: -6 },
  ];

  const bars = [34, 46, 41, 58, 66, 78, 92];

  return (
    <div ref={ref} className="relative isolate mx-auto w-full max-w-xl" aria-hidden="true">
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-accent/40 blur-3xl" />

      <div className="relative aspect-square w-full">
        {chips.map((chip, i) => {
          const settled = progress;
          const x = chip.x * (1 - settled);
          const y = chip.y * (1 - settled) + i * 2 * settled;
          const rotate = chip.r * (1 - settled);
          const opacity = 1 - settled * 0.55;
          return (
            <div
              key={chip.label}
              className="absolute left-1/2 top-1/2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft"
              style={{
                transform: `translate(-50%,-50%) translate(${x}%, ${y}%) rotate(${rotate}deg)`,
                opacity,
                transition: "transform 0.9s var(--ease-out-soft), opacity 0.9s var(--ease-out-soft)",
              }}
            >
              {chip.label}
            </div>
          );
        })}

        <div
          className="absolute inset-x-4 bottom-6 rounded-3xl border border-border bg-card/95 p-6 shadow-lift backdrop-blur"
          style={{
            opacity: 0.35 + progress * 0.65,
            transform: `translateY(${(1 - progress) * 14}px)`,
            transition: "all 0.9s var(--ease-out-soft)",
          }}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-eyebrow">Structured view</span>
            <span className="text-xs text-muted-foreground">Last 7 periods</span>
          </div>

          <div className="mt-5 flex h-32 items-end gap-2">
            {bars.map((h, i) => (
              <div key={i} className="flex-1">
                <div
                  className="w-full rounded-t-md bg-primary/85"
                  style={{
                    height: `${h * (0.35 + progress * 0.65)}%`,
                    transition: `height 0.9s var(--ease-out-soft) ${i * 60}ms`,
                  }}
                />
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4 text-left">
            {[
              ["Books", "Closed"],
              ["Reports", "Current"],
              ["Decisions", "Informed"],
            ].map(([k, v], i) => (
              <div
                key={k}
                style={{
                  opacity: Math.min(1, Math.max(0, progress * 3 - i * 0.5)),
                  transition: "opacity 0.6s var(--ease-out-soft)",
                }}
              >
                <div className="text-[0.68rem] uppercase tracking-widest text-muted-foreground">
                  {k}
                </div>
                <div className="text-sm font-semibold text-foreground">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
