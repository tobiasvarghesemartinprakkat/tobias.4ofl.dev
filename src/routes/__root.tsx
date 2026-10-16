import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { SiteNav } from "../components/SiteNav";

function NotFoundComponent() {
  return (
    <main className="relative flex min-h-screen flex-col justify-center px-6 pt-20 md:px-12">
      <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span>Error 404 · Missing Sequence</span>
      </div>

      <h1 className="font-display text-7xl tracking-tight text-primary md:text-[11rem] md:leading-none">
        OUT OF FRAME
      </h1>

      <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
        The shot or page you are looking for was cut from the timeline, renamed, or never existed.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Link
          to="/"
          className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:text-primary"
        >
          <span>Return to Home</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
        <span className="text-border">/</span>
        <Link
          to="/content"
          className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          View Reels ↗
        </Link>
        <span className="text-border">/</span>
        <Link
          to="/contact"
          className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          Contact ↗
        </Link>
      </div>

      <div className="mt-16 font-mono text-[11px] uppercase tracking-widest text-muted-foreground/50">
        TC 00:04:04:00 · REEL_NOT_FOUND
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <SiteNav />
      <Outlet />
    </QueryClientProvider>
  );
}
