import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Instagram, Loader2, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { BookingWidget } from "@/components/BookingWidget";
import { BRAND } from "@/lib/content";
import { submitEnquiry } from "@/lib/site.functions";
import { track } from "@/lib/analytics";

const TITLE = "Contact & Book a Free Consultation | Sarvagya Consultancy";
const DESC =
  "Send an enquiry or book a free consultation with Sarvagya Consultancy, Chennai. We'll understand your business and tell you plainly what should happen next.";

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

function EnquiryForm() {
  const send = useServerFn(submitEnquiry);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const res = await send({
        data: {
          name: String(fd.get("name") ?? ""),
          businessName: String(fd.get("businessName") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          topic: String(fd.get("topic") ?? ""),
          message: String(fd.get("message") ?? ""),
          source: "contact_page",
          company: String(fd.get("company") ?? ""),
        },
      });
      if (res.ok) {
        setDone(true);
        track("enquiry_submitted");
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Please check the details and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-[1.5rem] border border-border bg-secondary/50 p-10 text-center">
        <CheckCircle2 className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
        <h2 className="mt-5 font-display text-xl font-semibold tracking-tight">
          Thank you — we have your enquiry
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We&apos;ll read it properly and get back to you at the email you gave us.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[1.5rem] border border-border p-6 sm:p-9">
      <h2 className="font-display text-xl font-semibold tracking-tight">Send an enquiry</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Prefer to write first? Tell us what&apos;s going on.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="e-name">Your name *</Label>
          <Input id="e-name" name="name" required maxLength={100} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="e-business">Business name</Label>
          <Input id="e-business" name="businessName" maxLength={120} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="e-email">Email *</Label>
          <Input id="e-email" name="email" type="email" required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="e-phone">Phone</Label>
          <Input id="e-phone" name="phone" type="tel" maxLength={30} className="mt-2" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="e-topic">What is this about?</Label>
          <Input
            id="e-topic"
            name="topic"
            maxLength={120}
            placeholder="Accounting, GST notice, virtual CFO…"
            className="mt-2"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="e-message">Your message *</Label>
          <Textarea id="e-message" name="message" rows={5} required maxLength={2000} className="mt-2" />
        </div>
      </div>

      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <Button type="submit" size="lg" disabled={busy} className="mt-7 w-full rounded-full sm:w-auto sm:px-10">
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Send enquiry
      </Button>
    </form>
  );
}
