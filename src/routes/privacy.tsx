import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { BRAND } from "@/lib/content";

const TITLE = "Privacy Policy | Sarvagya Consultancy";
const DESC =
  "How Sarvagya Consultancy collects, uses and protects information submitted through this website.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="prose-sarvagya mx-auto max-w-3xl space-y-8 px-5 py-16 sm:px-8 lg:py-24">
        {[
          [
            "What we collect",
            "Information you choose to submit: your name, business name, email address, phone number, the message or requirement you describe, and your answers to the Quick Test if you complete it. We also record anonymous usage information such as pages viewed, approximate device type and the general source of the visit.",
          ],
          [
            "How we use it",
            "To respond to your enquiry, arrange consultations, deliver services you request, and understand in aggregate how the website is used. We do not sell your information and we do not share it with third parties for marketing.",
          ],
          [
            "Analytics",
            "Website analytics are private to Sarvagya Consultancy and anonymous. We do not store your IP address in readable form and we do not build advertising profiles.",
          ],
          [
            "Reviews",
            "Reviews you submit are reviewed before publication. Only the name, business name, rating and feedback you provide may be published. Contact details are never published.",
          ],
          [
            "Storage and security",
            "Submissions are stored in a secured database with access restricted to authorised Sarvagya Consultancy personnel.",
          ],
          [
            "Retention",
            "We keep enquiry and client information for as long as needed to serve you and to meet professional and legal obligations.",
          ],
          [
            "Your choices",
            `You can ask us to correct or delete the information you submitted by writing to ${BRAND.email}.`,
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
