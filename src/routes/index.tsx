import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileWarning, Clock3, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { HeroVisual } from "@/components/HeroVisual";
import { InstagramSection } from "@/components/InstagramSection";
import { HOME_CATEGORIES, BRAND } from "@/lib/content";
import { track } from "@/lib/analytics";
import founder from "@/assets/siddhanth-bothra.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sarvagya Consultancy — Financial clarity for growing businesses" },
      {
        name: "description",
        content:
          "Your business is growing. Are your finances keeping up? Accounting, GST, virtual CFO and business advisory from Chennai, led by CMA Siddhanth Bothra.",
      },
      {
        property: "og:title",
        content: "Sarvagya Consultancy — Financial clarity for growing businesses",
      },
      {
        property: "og:description",
        content:
          "Financial clarity, control and structure for businesses ready to grow. Book a free consultation.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[36rem] bg-[radial-gradient(60%_60%_at_50%_0%,var(--mist),transparent)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
          <div>
            <p className="text-eyebrow">{BRAND.tagline}</p>
            <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Your business is growing.
              <span className="mt-2 block text-primary">Are your finances keeping up?</span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Financial clarity, control and structure for businesses ready to grow.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 text-base"
                onClick={() => track("cta_book_consultation", { location: "hero" })}
              >
                <Link to="/contact" hash="book">
                  Book a Free Consultation
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-base"
                onClick={() => track("cta_quick_test", { location: "hero" })}
              >
                <Link to="/quick-test">Take the Quick Test for Your Business</Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Led by {BRAND.founder} · 10+ years in finance &amp; accounts · {BRAND.city}
            </p>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <Reveal>
            <h2 className="max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-[2.75rem]">
              You started a business to grow it.
              <span className="block text-muted-foreground">
                Not to spend your time fixing its finances.
              </span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: FileWarning,
                title: "Messy Books",
                line: "Entries pending, records incomplete, history you can't rely on.",
              },
              {
                icon: LineChart,
                title: "Unclear Numbers",
                line: "Reports that are technically correct and practically useless.",
              },
              {
                icon: Clock3,
                title: "Lost Time",
                line: "Your attention going to follow-ups instead of sales and growth.",
              },
            ].map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 110}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="font-display text-3xl font-semibold text-border">0{i + 1}</span>
                </div>
                <h3 className="mt-8 font-display text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.line}</p>
                <div className="mt-7 h-1 w-12 rounded-full bg-primary/70" />
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-14 max-w-2xl">
            <p className="text-lg leading-relaxed">
              Sarvagya brings financial structure and clarity so business owners can focus on what
              they do best.
            </p>
            <Link
              to="/why-sarvagya"
              className="mt-6 inline-flex items-center gap-2 font-medium text-primary hover:gap-3 transition-all"
            >
              Discover How Sarvagya Helps <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* QUICK TEST */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="surface-navy relative overflow-hidden rounded-[2rem] px-7 py-14 sm:px-14 lg:px-20 lg:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-navy-foreground/5 blur-2xl" />
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">
                Quick Test for Your Business
              </p>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-[2.6rem]">
                How well is your business really managing its finances?
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed opacity-80">
                Take our quick test and identify areas that may deserve a closer look. Seven
                questions, about a minute.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="mt-9 rounded-full px-8 text-base"
                onClick={() => track("cta_quick_test", { location: "home_section" })}
              >
                <Link to="/quick-test">
                  Take the Quick Test <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <p className="mt-6 max-w-md text-xs leading-relaxed opacity-60">
                A general self-assessment, not a professional audit — and not the same as the
                founder-led Sarvagya Business Health Check.
              </p>
            </Reveal>

            <Reveal delay={140}>
              <ul className="space-y-3">
                {[
                  "Are your books updated regularly?",
                  "Do you know your monthly profitability?",
                  "Do you have visibility over receivables?",
                  "Do you know what your accountant is working on?",
                ].map((q) => (
                  <li
                    key={q}
                    className="rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 px-5 py-4 text-sm"
                  >
                    {q}
                  </li>
                ))}
                <li className="px-5 pt-1 text-sm opacity-60">…and three more.</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-16">
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-accent/50 blur-2xl" />
              <img
                src={founder.url}
                alt="CMA Siddhanth Bothra, Founder of Sarvagya Consultancy"
                width={860}
                height={1040}
                loading="lazy"
                className="w-full rounded-[1.75rem] object-cover shadow-lift"
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-[2.6rem]">
              Financial expertise.
              <span className="block">Business understanding.</span>
              <span className="block text-primary">One partner.</span>
            </h2>
            <p className="mt-7 font-display text-xl font-semibold">{BRAND.founder}</p>
            <p className="text-sm text-muted-foreground">Founder, Sarvagya Consultancy</p>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "10+ years in finance & accounts",
                "4+ years running Sarvagya Consultancy",
                "Corporate exposure",
                "Local business management experience",
                "CMA — ICMAI",
              ].map((point) => (
                <li key={point} className="rule-hairline pt-3 text-sm text-muted-foreground">
                  {point}
                </li>
              ))}
            </ul>

            <blockquote className="mt-8 border-l-2 border-primary pl-5 text-lg leading-relaxed">
              Bringing the right corporate financial structure to businesses without unnecessary
              corporate complexity.
            </blockquote>

            <Link
              to="/why-sarvagya"
              className="mt-7 inline-flex items-center gap-2 font-medium text-primary transition-all hover:gap-3"
            >
              Why Sarvagya <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SERVICES TEASER */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-[2.6rem]">
            Whatever your financial challenge, we&apos;re here to help.
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {HOME_CATEGORIES.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <Link
                to="/services"
                className="group flex flex-col gap-2 py-7 transition-colors hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-4"
              >
                <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  {c.title}
                </span>
                <span className="flex items-center gap-4 text-sm text-muted-foreground">
                  {c.line}
                  <ArrowRight className="hidden h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 sm:block" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <Link
            to="/services"
            className="mt-10 inline-flex items-center gap-2 font-medium text-primary transition-all hover:gap-3"
          >
            Explore All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      <InstagramSection />

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
        <div className="surface-sheen relative overflow-hidden rounded-[2rem] border border-border px-7 py-20 text-center sm:px-14 lg:py-28">
          <TrendBackdrop />
          <Reveal>
            <h2 className="relative mx-auto max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-[2.9rem]">
              Your numbers should help you grow.
              <span className="block text-muted-foreground">Not hold you back.</span>
            </h2>
            <div className="relative mt-11 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 text-base"
                onClick={() => track("cta_book_consultation", { location: "home_final" })}
              >
                <Link to="/contact" hash="book">
                  Book a Free Consultation
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-base">
                <Link to="/quick-test">Take the Quick Test for Your Business</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function TrendBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
      viewBox="0 0 800 300"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 250 L120 220 L240 235 L360 175 L480 190 L600 110 L720 70 L800 40"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeDasharray="6 8"
        style={{ animation: "dash-flow 12s linear infinite" }}
      />
      <path
        d="M0 280 L120 265 L240 270 L360 240 L480 250 L600 205 L720 185 L800 165"
        fill="none"
        stroke="var(--steel)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
