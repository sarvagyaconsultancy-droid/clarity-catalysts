import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { BRAND } from "@/lib/content";

const TITLE = "Terms of Use | Sarvagya Consultancy";
const DESC = "The terms that apply to your use of the Sarvagya Consultancy website.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" />
      <section className="mx-auto max-w-3xl space-y-8 px-5 py-16 sm:px-8 lg:py-24">
        {[
          [
            "Information only",
            "The content on this website is provided for general information about Sarvagya Consultancy and its services. It does not constitute financial, tax, accounting or legal advice, and should not be relied upon as such.",
          ],
          [
            "Quick Test",
            "The Quick Test for Your Business is a general self-assessment tool. Its result is indicative only, is generated from your own answers, and is not a professional audit, opinion or assurance of any kind. It is distinct from the Sarvagya Business Health Check, which is a professional service delivered by the founder and team.",
          ],
          [
            "No engagement without agreement",
            "Submitting an enquiry, booking a consultation or completing the Quick Test does not create a professional engagement. Any engagement begins only under a separate agreed scope of work.",
          ],
          [
            "Accuracy",
            "We take care to keep this website accurate and current, but we make no warranty that it is complete or error-free, and we may change content at any time.",
          ],
          [
            "Intellectual property",
            "The Sarvagya Consultancy name, logo and website content belong to Sarvagya Consultancy and may not be reproduced without permission.",
          ],
          [
            "Contact",
            `Questions about these terms can be sent to ${BRAND.email}.`,
          ],
        ].map(([h, p]) => (
          <div key={h}>
            <h2 className="font-display text-xl font-semibold tracking-tight">{h}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{p}</p>
          </div>
        ))}
      </section>
    </>
  );
}
