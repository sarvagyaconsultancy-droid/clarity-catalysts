import { Instagram, ArrowUpRight, Bookmark, Heart, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { BRAND } from "@/lib/content";

const TOPICS = [
  { label: "BOOKS & CLOSING", title: "What a properly closed month actually looks like.", mark: "01" },
  { label: "GST IN PRACTICE", title: "Notices, replies and what to keep ready.", mark: "02" },
  { label: "CASH & RECEIVABLES", title: "Why profitable businesses can still run short.", mark: "03" },
];

/**
 * Instagram highlights. The live feed requires Instagram API access; until that
 * is connected this links out gracefully and never blocks the page.
 */
export function InstagramSection() {
  return (
    <section className="border-y border-border bg-secondary/35">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
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
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium shadow-soft transition-colors hover:bg-accent"
        >
          <Instagram className="h-4 w-4" aria-hidden="true" />@{BRAND.instagram}
        </a>
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {TOPICS.map((t, i) => (
          <Reveal key={t.title} delay={i * 70}>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative flex aspect-square flex-col justify-between overflow-hidden bg-navy p-7 text-navy-foreground">
                <div className="flex items-center justify-between text-xs font-bold opacity-65">
                  <span>SARVAGYA NOTES</span><span>{t.mark}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-steel">{t.label}</p>
                  <p className="mt-4 max-w-xs font-display text-2xl font-semibold leading-snug">{t.title}</p>
                </div>
                <div className="h-1 w-14 rounded-full bg-primary" />
              </div>
              <div className="flex items-center justify-between px-5 py-4 text-muted-foreground">
                <div className="flex gap-4"><Heart className="h-4 w-4" /><MessageCircle className="h-4 w-4" /></div>
                <div className="flex items-center gap-3"><Bookmark className="h-4 w-4" /><ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
      <p className="mt-5 text-xs text-muted-foreground">A preview of the topics shared by Sarvagya. Open Instagram to see the latest published posts.</p>
      </div>
    </section>
  );
}
