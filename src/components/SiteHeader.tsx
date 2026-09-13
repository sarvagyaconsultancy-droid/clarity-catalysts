import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import logo from "@/assets/sarvagya-logo.jpg.asset.json";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/why-sarvagya", label: "Why Sarvagya" },
  { to: "/financial-health-check", label: "Financial Health Check" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-8">
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3.5"
          aria-label="Sarvagya Consultancy home"
        >
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-1 shadow-soft transition-transform duration-200 group-hover:-translate-y-0.5">
            <img
              src={logo.url}
              alt="Sarvagya Consultancy logo"
              width={56}
              height={56}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="hidden leading-none sm:block">
            <span className="block text-lg font-bold uppercase text-foreground">Sarvagya</span>
            <span className="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-primary">
              Consultancy
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="hidden rounded-full px-5 sm:inline-flex"
            onClick={() => track("cta_book_consultation", { location: "header" })}
          >
            <Link to="/contact" hash="book">
              Book a Free Consultation
            </Link>
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-20 z-50 h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border bg-background px-5 pb-10 pt-4 xl:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 font-display text-lg font-medium tracking-tight"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button asChild className="mt-6 w-full rounded-full" size="lg">
            <Link to="/contact" hash="book" onClick={() => setOpen(false)}>
              Book a Free Consultation
            </Link>
          </Button>
          <Button asChild variant="outline" className="mt-3 w-full rounded-full" size="lg">
            <Link to="/quick-test" onClick={() => setOpen(false)}>
              Take the Quick Test
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}
