import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { to: "/content", label: "Content" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between border-b border-border/50 bg-background/80 px-6 py-4 backdrop-blur-md md:px-12">
      <Link to="/" className="text-sm font-semibold tracking-widest text-primary transition-opacity hover:opacity-80">
        _t0by_01
      </Link>
      <nav className="flex items-center gap-5 text-xs font-semibold uppercase tracking-widest md:gap-8">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="text-foreground/70 transition-colors hover:text-primary"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: true }}
          >
            {l.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
