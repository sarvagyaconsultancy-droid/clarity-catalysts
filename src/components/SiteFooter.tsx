import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";
import { BRAND } from "@/lib/content";
import logo from "@/assets/sarvagya-logo.jpg.asset.json";

export function SiteFooter() {
  return (
    <footer className="surface-navy mt-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logo.url}
              alt="Sarvagya Consultancy logo"
              width={48}
              height={48}
              loading="lazy"
              className="h-12 w-12 rounded-lg object-cover"
            />
            <span className="font-display text-lg font-semibold">Sarvagya Consultancy</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed opacity-80">
            Finance, accounting and business advisory for growing Indian businesses. Based in{" "}
            {BRAND.city}.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.24em] opacity-60">{BRAND.tagline}</p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Navigate</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { to: "/services", label: "Services" },
              { to: "/about", label: "About" },
              { to: "/why-sarvagya", label: "Why Sarvagya" },
              { to: "/financial-health-check", label: "Financial Health Check" },
              { to: "/quick-test", label: "Quick Test for Your Business" },
              { to: "/reviews", label: "Reviews" },
              { to: "/faq", label: "FAQ" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="opacity-80 transition-opacity hover:opacity-100">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Contact</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${BRAND.email}`}
                className="inline-flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {BRAND.email}
              </a>
            </li>
            <li>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />@{BRAND.instagram}
              </a>
            </li>
            <li className="opacity-80">{BRAND.city}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs opacity-70 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Sarvagya Consultancy. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:opacity-100">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:opacity-100">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
