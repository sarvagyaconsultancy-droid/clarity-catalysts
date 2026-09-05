import { Instagram, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { BRAND } from "@/lib/content";

const TOPICS = [
  { title: "Books & closing", line: "What a properly closed month actually looks like." },
  { title: "GST in practice", line: "Notices, replies and what to keep ready." },
  { title: "Cash & receivables", line: "Why profitable businesses still run short." },
  { title: "Owner reporting", line: "The few numbers worth reviewing monthly." },
];

/**
 * Instagram highlights. The live feed requires Instagram API access; until that
 * is connected this links out gracefully and never blocks the page.
 */
export function InstagramSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-eyebrow">From the Sarvagya Desk</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Practical finance notes, published regularly.
          </h2>
        </div>
        <a
          href={BRAND.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <Instagram className="h-4 w-4" aria-hidden="true" />@{BRAND.instagram}
        </a>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOPICS.map((t, i) => (
          <Reveal key={t.title} delay={i * 70}>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <span className="font-display text-lg font-semibold tracking-tight">{t.title}</span>
              <span className="mt-3 text-sm text-muted-foreground">{t.line}</span>
              <ArrowUpRight className="mt-6 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
