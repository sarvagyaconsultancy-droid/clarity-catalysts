import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { BRAND } from "@/lib/content";
import founder from "@/assets/siddhanth-bothra.jpg.asset.json";

const TITLE = "About Sarvagya Consultancy — Chennai finance & accounting firm";
const DESC =
  "Sarvagya Consultancy was founded by CMA Siddhanth Bothra and has operated for over four years from Chennai with a team of five qualified and trained professionals.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Meet Sarvagya"
        lead="A finance, accounting and business advisory firm built around one idea: businesses deserve financial structure they can actually understand and use."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Founded, and still personally led, by {BRAND.founder}
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                Sarvagya Consultancy has been operating for more than four years from {BRAND.city},
                serving Indian businesses across trading, manufacturing and services — and open to
                international clients where we can genuinely add value.
              </p>
              <p>
                The team is five people: qualified, semi-qualified and trained professionals,
                personally trained by the founder. That matters, because the standard of the work is
                set in one place and carried through everything we deliver.
              </p>
              <p>
                Behind the firm is more than ten years of professional experience in finance and
                accounts — corporate exposure combined with hands-on local business management.
              </p>
            </div>

            <blockquote className="mt-10 rounded-2xl border-l-2 border-primary bg-secondary/50 py-6 pl-6 pr-6 text-lg leading-relaxed">
              Bring appropriate corporate structure and financial discipline to businesses while
              keeping the approach practical and understandable.
            </blockquote>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["10+ years", "Finance & accounts experience"],
                ["4+ years", "Sarvagya Consultancy"],
                ["CMA", "ICMAI qualified"],
              ].map(([big, small]) => (
                <div key={big} className="rounded-2xl border border-border bg-card p-6">
                  <p className="font-display text-2xl font-semibold text-primary">{big}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{small}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <img
              src={founder.url}
              alt="CMA Siddhanth Bothra, Founder of Sarvagya Consultancy"
              width={860}
              height={1040}
              loading="lazy"
              className="w-full rounded-[1.75rem] object-cover shadow-lift"
            />
            <p className="mt-5 font-display text-lg font-semibold">{BRAND.founder}</p>
            <p className="text-sm text-muted-foreground">
              Founder, Sarvagya Consultancy · {BRAND.city}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <h2 className="max-w-xl font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              The best way to understand how we work is a conversation.
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/contact" hash="book">
                  Book a Free Consultation
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/why-sarvagya">Why Sarvagya</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
