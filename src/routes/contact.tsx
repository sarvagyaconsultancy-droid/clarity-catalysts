import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { BookingWidget } from "@/components/BookingWidget";
import { BRAND } from "@/lib/content";

const TITLE = "Book a Free Consultation | Sarvagya Consultancy";
const DESC =
  "Book a free consultation with Sarvagya Consultancy, Chennai. We'll understand your business and tell you plainly what should happen next.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your business"
        lead="Book a free consultation, or send us a note and we'll come back to you."
      />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal id="book" className="scroll-mt-28">
            <BookingWidget />
          </Reveal>

          <Reveal delay={120}>
            <EnquiryForm />

            <div className="mt-10 space-y-4 text-sm">
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-primary">
                  {BRAND.email}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Instagram className="h-4 w-4 text-primary" aria-hidden="true" />
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-primary"
                >
                  {BRAND.instagram}
                </a>
              </p>
              <p className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                {BRAND.city}, India — working with businesses across India
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
