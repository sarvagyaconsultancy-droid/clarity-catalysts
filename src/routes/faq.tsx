import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { FAQS } from "@/lib/content";

const TITLE = "Frequently Asked Questions | Sarvagya Consultancy";
const DESC =
  "Answers on who we work with, GST notices, virtual CFO, working with your existing accountant, the Sarvagya Business Health Check and how pricing works.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions people ask before they get in touch"
        lead="If your question isn't here, ask it directly — the contact form goes straight to us."
      />

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`q${i}`}>
                <AccordionTrigger className="text-left font-display text-base font-medium tracking-tight hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[0.95rem] leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal className="mt-14 rounded-2xl border border-border bg-secondary/50 p-8 text-center">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Still have a question?
          </h2>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="rounded-full px-7">
              <Link to="/contact" hash="book">
                Book a Free Consultation
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-7">
              <Link to="/contact">Send an enquiry</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
