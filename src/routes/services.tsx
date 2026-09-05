import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SERVICE_CATEGORIES } from "@/lib/content";
import { track } from "@/lib/analytics";

const TITLE = "Services — Accounting, GST, Virtual CFO | Sarvagya Consultancy";
const DESC =
  "Bookkeeping, accounting, payroll, MIS, GST notices and order replies, virtual CFO, cash-flow management, debtors recovery and fund raising for growing businesses.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Everything your finances need,
            <span className="block text-primary">handled by people who understand business.</span>
          </>
        }
        lead="Five areas of work. Start where it hurts most — we'll tell you honestly what should come first."
      >
        <nav className="mt-10 flex flex-wrap gap-2" aria-label="Service categories">
          {SERVICE_CATEGORIES.map((c) => (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              {c.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {SERVICE_CATEGORIES.map((cat) => (
          <section key={cat.slug} id={cat.slug} className="scroll-mt-28 border-b border-border py-16 lg:py-24">
            <Reveal className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {cat.title}
                </h2>
                <p className="mt-3 text-muted-foreground">{cat.blurb}</p>
                <Button
                  asChild
                  className="mt-7 rounded-full px-6"
                  onClick={() => track("cta_book_consultation", { location: cat.slug })}
                >
                  <Link to="/contact" hash="book">
                    Book a Free Consultation
                  </Link>
                </Button>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {cat.items.map((item) => (
                  <AccordionItem key={item.slug} value={item.slug}>
                    <AccordionTrigger className="text-left font-display text-lg font-medium tracking-tight hover:no-underline">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <dl className="grid gap-4 pb-2 sm:grid-cols-3">
                        {[
                          ["What it is", item.what],
                          ["Who needs it", item.who],
                          ["How Sarvagya helps", item.how],
                        ].map(([label, text]) => (
                          <div key={label}>
                            <dt className="text-eyebrow">{label}</dt>
                            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                              {text}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </section>
        ))}
      </div>

      <section className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Not sure which of these you need?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            That is exactly what the free consultation is for.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/contact" hash="book">
                Book a Free Consultation
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/quick-test">
                Take the Quick Test <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
