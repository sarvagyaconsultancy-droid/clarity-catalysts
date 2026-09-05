import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

const TITLE = "Why Sarvagya — Corporate expertise, practical business thinking";
const DESC =
  "Corporate financial exposure combined with local business management and cost & management accounting expertise — practical financial structure for growing businesses.";

export const Route = createFileRoute("/why-sarvagya")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/why-sarvagya" },
    ],
    links: [{ rel: "canonical", href: "/why-sarvagya" }],
  }),
  component: WhyPage,
});

const PILLARS = [
  {
    title: "We understand the business first",
    body: "Numbers only mean something in context. We start by understanding how your business actually runs — then decide what the finance function should look like.",
  },
  {
    title: "Clarity over complexity",
    body: "Reports are written to be understood by the owner, not to impress another accountant. If it doesn't change a decision, it doesn't belong in the pack.",
  },
  {
    title: "Personal involvement",
    body: "The founder is directly involved in the work. The team is small, trained in-house, and accountable to one standard.",
  },
  {
    title: "Structured processes",
    body: "Closing calendars, reconciliations, compliance tracking and reporting cadence — the discipline that keeps books reliable month after month.",
  },
  {
    title: "Practical recommendations",
    body: "Advice you can act on this quarter, sized to your business — not a corporate framework bolted onto a company that doesn't need it.",
  },
  {
    title: "Your focus stays on growth",
    body: "The point of good financial management is that you stop thinking about it. We take the administration so you can stay on sales and growth.",
  },
];

function WhyPage() {
  return (
    <>
      <PageHero
        eyebrow="Why Sarvagya"
        title={
          <>
            Corporate expertise.
            <span className="block text-primary">Practical business thinking.</span>
          </>
        }
        lead="Most firms give you one or the other: corporate rigour that doesn't fit, or practical help without structure. The combination is the point."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <Reveal className="surface-navy rounded-[2rem] px-7 py-14 sm:px-14">
          <div className="grid items-center gap-6 text-center sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <div>
              <p className="font-display text-xl font-semibold">Corporate exposure</p>
              <p className="mt-2 text-sm opacity-70">How larger organisations run finance</p>
            </div>
            <span className="font-display text-2xl opacity-50">+</span>
            <div>
              <p className="font-display text-xl font-semibold">Local business management</p>
              <p className="mt-2 text-sm opacity-70">How owner-run businesses actually operate</p>
            </div>
            <span className="font-display text-2xl opacity-50">+</span>
            <div>
              <p className="font-display text-xl font-semibold">Cost &amp; Management Accounting</p>
              <p className="mt-2 text-sm opacity-70">Where cost, margin and decisions meet</p>
            </div>
          </div>
          <div className="mt-10 border-t border-navy-foreground/15 pt-8 text-center">
            <p className="font-display text-2xl font-semibold sm:text-3xl">
              Practical financial structure for growing businesses
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 90}>
              <p className="font-display text-4xl font-semibold text-accent-foreground/25">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 font-display text-xl font-semibold tracking-tight">{p.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{p.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 rounded-2xl border border-border bg-secondary/50 p-8">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            What we will not tell you
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            That we are the best, the number one, or that results are guaranteed. What we will do is
            look at your business honestly, tell you what we think, and be clear about what we can
            and cannot help with.
          </p>
        </Reveal>

        <Reveal className="mt-16 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/contact" hash="book">
              Book a Free Consultation
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link to="/financial-health-check">Financial Health Check</Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
