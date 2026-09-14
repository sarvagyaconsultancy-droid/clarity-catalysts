import { ArrowRight, BookOpenCheck, FileQuestion, Gauge, Rows3 } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  { icon: FileQuestion, number: "01", title: "Messy records", text: "Scattered entries and incomplete reconciliations." },
  { icon: Rows3, number: "02", title: "Structured books", text: "A consistent chart, close routine and clear ownership." },
  { icon: BookOpenCheck, number: "03", title: "Reliable reporting", text: "Monthly statements tied back to the underlying records." },
  { icon: Gauge, number: "04", title: "Better decisions", text: "A clear view of cash, margins, obligations and priorities." },
] as const;

export function ProcessDiagram() {
  return (
    <section className="mt-20 border-y border-border py-16 lg:py-20">
      <Reveal>
        <p className="text-eyebrow">From disorder to direction</p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight">
          A finance function that gets clearer every month.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-4">
        {STEPS.map((step, index) => (
          <Reveal key={step.title} delay={index * 90} className="relative">
            <div className="h-full rounded-xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">{step.number}</span>
              </div>
              <h3 className="mt-7 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
            {index < STEPS.length - 1 ? (
              <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-border bg-background p-1 text-primary md:block" aria-hidden="true" />
            ) : null}
          </Reveal>
        ))}
      </div>
    </section>
  );
}