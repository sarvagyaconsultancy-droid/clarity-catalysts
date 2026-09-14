import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeIndianRupee, Boxes, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

const TITLE = "Illustrative Case Studies | Sarvagya Consultancy";
const DESC = "Illustrative business finance scenarios showing how Sarvagya Consultancy approaches bookkeeping, cash flow and GST challenges.";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: TITLE }, { name: "description", content: DESC },
      { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/case-studies" }],
  }),
  component: CaseStudiesPage,
});

const STUDIES = [
  {
    icon: Boxes,
    sector: "Growing trading business",
    challenge: "Sales are growing, but month-end books stay open and the owner cannot see reliable product margins.",
    approach: ["Standardise purchase and sales recording", "Create a monthly close checklist", "Build margin reporting by product group"],
    outcome: "The intended result is a dependable monthly view that makes pricing and purchasing conversations more informed.",
  },
  {
    icon: BadgeIndianRupee,
    sector: "Service business with cash pressure",
    challenge: "The profit statement looks positive, yet delayed collections make salaries and tax payments stressful.",
    approach: ["Age receivables by customer and risk", "Introduce a weekly collections rhythm", "Build a rolling cash-flow view"],
    outcome: "The intended result is earlier visibility of cash gaps and a disciplined way to follow up outstanding invoices.",
  },
  {
    icon: ReceiptText,
    sector: "Business responding to a GST notice",
    challenge: "A notice arrives, but the underlying return data and books do not reconcile cleanly enough to respond with confidence.",
    approach: ["Interpret the notice and deadlines", "Reconcile books, returns and supporting records", "Prepare a reasoned response with evidence"],
    outcome: "The intended result is a clear, documented response position rather than a rushed or unsupported reply.",
  },
] as const;

function CaseStudiesPage() {
  return (
    <>
      <PageHero eyebrow="Illustrative case studies" title={<>See the financial problem.<span className="block text-primary">Then see the structure behind the solution.</span></>} lead="These scenarios are examples created to explain our working approach. They are not client testimonials or claims of achieved results." />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-5 lg:grid-cols-3">
          {STUDIES.map((study, index) => (
            <Reveal key={study.sector} delay={index * 90} className="rounded-xl border border-border bg-card p-7 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-primary"><study.icon className="h-6 w-6" aria-hidden="true" /></span>
                <span className="rounded-full border border-border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Illustrative example</span>
              </div>
              <h2 className="mt-7 font-display text-xl font-semibold">{study.sector}</h2>
              <p className="mt-5 text-eyebrow">The challenge</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{study.challenge}</p>
              <p className="mt-6 text-eyebrow">How we would approach it</p>
              <ol className="mt-3 space-y-3">
                {study.approach.map((item, i) => <li key={item} className="flex gap-3 text-sm"><span className="font-semibold text-primary">{i + 1}.</span><span>{item}</span></li>)}
              </ol>
              <div className="mt-7 border-t border-border pt-5"><p className="text-sm leading-relaxed text-muted-foreground">{study.outcome}</p></div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16 text-center">
          <h2 className="font-display text-3xl font-semibold">Your situation will have its own facts.</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">A free consultation is where we understand those facts before recommending any work.</p>
          <Button asChild size="lg" className="mt-8 rounded-full px-8"><Link to="/contact" hash="book">Book a Free Consultation <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </Reveal>
      </section>
    </>
  );
}