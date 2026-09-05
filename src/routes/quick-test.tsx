import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { QuickTest } from "@/components/QuickTest";

const TITLE = "Quick Test for Your Business — free financial self-assessment";
const DESC =
  "Seven quick questions to see how well your business is managing its finances. A free general self-assessment from Sarvagya Consultancy — not a professional audit.";

export const Route = createFileRoute("/quick-test")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/quick-test" },
    ],
    links: [{ rel: "canonical", href: "/quick-test" }],
  }),
  component: QuickTestPage,
});

function QuickTestPage() {
  return (
    <>
      <PageHero
        eyebrow="Quick Test for Your Business"
        title="How well is your business managing its finances?"
        lead="Seven questions, about a minute. You'll get a general indication of where your finances stand and which areas may deserve a closer look."
      />
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 lg:py-20">
        <QuickTest />
      </section>
    </>
  );
}
