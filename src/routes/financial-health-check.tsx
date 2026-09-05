import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

const TITLE = "Sarvagya Business Health Check — founder-led financial review";
const DESC =
  "A human-led review of your business finances by CMA Siddhanth Bothra and team: books, compliance, cash, reporting and control. Begins with a free consultation.";

export const Route = createFileRoute("/financial-health-check")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/financial-health-check" },
    ],
    links: [{ rel: "canonical", href: "/financial-health-check" }],
  }),
  component: HealthCheckPage,
});

const AREAS = [
  ["Books & records", "Are transactions complete, current and correctly classified?"],
  ["Compliance", "GST, TDS and statutory filings — status, gaps and open exposure."],
  ["Cash & receivables", "Where cash is stuck, what is owed, and how long it takes to arrive."],
  ["Profitability", "What actually earns and what quietly costs you."],
  ["Reporting", "Whether the reports you receive support a decision."],
  ["Controls & process", "Who does what, when, and what happens if they don't."],
];

const STEPS = [
  ["Free consultation", "We understand your business, structure and current concerns."],
  ["Review", "We examine the financial areas relevant to your business."],
  ["Findings", "You get an honest picture of what's working and what isn't."],
  ["Recommendations", "A prioritised, practical plan — starting with what matters most."],
];

function HealthCheckPage() {
  return (
    <>
      <PageHero
        eyebrow="Sarvagya Business Health Check"
        title={
          <>
            A proper look at your finances,
            <span className="block text-primary">done by people, not software.</span>
          </>
        }
        lead="The Sarvagya Business Health Check is a founder-led review of how your business handles money — carried out after we understand how your business works."
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/contact" hash="book">
              Book a Free Consultation
            </Link>
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            What we look at
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map(([t, d], i) => (
            <Reveal key={t} delay={(i % 3) * 80}>
              <h3 className="rule-hairline pt-4 font-display text-lg font-semibold tracking-tight">
                {t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              How it works
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([t, d], i) => (
              <Reveal key={t} delay={i * 90}>
                <li className="list-none">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <Reveal className="rounded-[1.75rem] border border-border p-8 sm:p-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            This is not the Quick Test
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-eyebrow">Quick Test for Your Business</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A free, automated seven-question self-assessment on this website. It gives you a
                general indication of areas worth a closer look. It is not a professional audit.
              </p>
              <Link
                to="/quick-test"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3"
              >
                Take the Quick Test <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div>
              <p className="text-eyebrow">Sarvagya Business Health Check</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A professional, human-led review conducted by the founder and team, based on your
                actual business and records. It begins with a free consultation.
              </p>
              <Link
                to="/contact"
                hash="book"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3"
              >
                Book a Free Consultation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
