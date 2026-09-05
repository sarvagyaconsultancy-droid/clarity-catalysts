import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-96 bg-[radial-gradient(55%_60%_at_50%_0%,var(--mist),transparent)]" />
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 lg:pb-24 lg:pt-20">
        <p className="text-eyebrow">{eyebrow}</p>
        <h1 className="mt-6 max-w-4xl font-display text-[2.3rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl">
          {title}
        </h1>
        {lead && (
          <div className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lead}</div>
        )}
        {children}
      </div>
    </section>
  );
}
