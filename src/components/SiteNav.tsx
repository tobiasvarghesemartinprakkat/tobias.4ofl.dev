import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { to: "/content", label: "Content" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between border-b border-border/50 bg-background/80 px-4 py-3.5 backdrop-blur-md sm:px-6 md:px-12 md:py-4">
      <Link
        to="/"
        className="text-xs font-semibold uppercase tracking-widest text-primary transition-opacity hover:opacity-80 sm:text-sm"
      >
        Reel Creator
      </Link>
      <nav className="flex items-center gap-3.5 text-[11px] font-semibold uppercase tracking-wider sm:gap-6 sm:text-xs sm:tracking-widest md:gap-8">
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
