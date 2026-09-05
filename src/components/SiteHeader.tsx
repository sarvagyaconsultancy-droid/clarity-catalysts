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
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Sarvagya Consultancy home">
          <img
            src={logo.url}
            alt="Sarvagya Consultancy logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-lg object-cover"
          />
          <span className="hidden text-sm font-semibold leading-tight tracking-tight sm:block">
            Sarvagya
            <span className="block text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
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
        <div className="fixed inset-x-0 top-[4.5rem] z-50 h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-border bg-background px-5 pb-10 pt-4 xl:hidden">
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
