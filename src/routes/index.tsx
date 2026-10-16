import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import photo from "@/assets/tobias-cutout.png";
import { ReelGrid } from "@/components/ReelGrid";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tobias Varghese — Reel Creator" },
      { name: "description", content: "Reels, vlogs and short-form stories by Tobias Varghese." },
      { property: "og:title", content: "Tobias Varghese — Reel Creator" },
      { property: "og:description", content: "Reels, vlogs and short-form stories by Tobias Varghese." },
    ],
  }),
  component: Index,
});

function playShutterSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // First mechanical click: curtain opens
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(100, now + 0.035);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.035);

    // Second mechanical click: curtain closes
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1100, now + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(80, now + 0.11);
    gain2.gain.setValueAtTime(0.2, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.11);
  } catch {}
}

function Index() {
  const [progress, setProgress] = useState(0);
  const [hover, setHover] = useState(false);
  const [isSnapped, setIsSnapped] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: 50, y: 50 });
  const currentPos = useRef({ x: 50, y: 50 });
  const targetR = useRef(0);
  const currentR = useRef(0);
  const hoverRef = useRef(false);
  const isSnappedRef = useRef(false);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync hover with target radius
  useEffect(() => {
    hoverRef.current = hover;
    if (!isSnappedRef.current) {
      targetR.current = hover ? 115 : 0;
    }
  }, [hover]);

  // Scroll parallax progress
  useEffect(() => {
    const onScroll = () => {
      const h = heroRef.current?.offsetHeight ?? window.innerHeight;
      setProgress(Math.min(1, Math.max(0, window.scrollY / (h * 0.8))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 60fps/120fps Gimbal Physics / Smooth Spring Lag Loop
  useEffect(() => {
    let rafId: number;

    const animate = () => {
      // Fluid head gimbal physics: lerp position with inertia
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;
      currentPos.current.x += dx * 0.085;
      currentPos.current.y += dy * 0.085;

      // Smooth radius expansion & contraction
      const dr = targetR.current - currentR.current;
      currentR.current += dr * 0.11;

      if (imageContainerRef.current) {
        imageContainerRef.current.style.setProperty("--mx", `${currentPos.current.x.toFixed(2)}%`);
        imageContainerRef.current.style.setProperty("--my", `${currentPos.current.y.toFixed(2)}%`);
        imageContainerRef.current.style.setProperty("--r", `${currentR.current.toFixed(1)}px`);
        imageContainerRef.current.style.setProperty(
          "--ring-o",
          currentR.current > 4 && !isSnappedRef.current ? "1" : "0"
        );
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Camera Shutter Snap on Click
  const handleSnap = () => {
    playShutterSound();

    // Trigger quick 150ms screen shutter flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 160);

    // Temporarily unlock full-color snapshot frame
    setIsSnapped(true);
    isSnappedRef.current = true;
    targetR.current = 1500; // Expands outward to reveal full color

    if (snapTimerRef.current) {
      clearTimeout(snapTimerRef.current);
    }

    // Reset back to normal lens after 2.5s
    snapTimerRef.current = setTimeout(() => {
      setIsSnapped(false);
      isSnappedRef.current = false;
      targetR.current = hoverRef.current ? 115 : 0;
    }, 2500);
  };

  return (
    <main>
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Full-screen 150ms shutter flash overlay */}
        {isFlashing && (
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[200] bg-white"
            style={{ animation: "shutterFlash 160ms cubic-bezier(0.1, 0.9, 0.2, 1) forwards" }}
          />
        )}

        <div className="absolute right-6 top-20 text-sm font-semibold uppercase tracking-widest text-primary md:right-12">
          Kerala · India
        </div>

        <h1
          className="text-giant absolute inset-x-0 top-[55%] -translate-y-1/2 select-none text-center text-primary"
          style={{ transform: `translate(${progress * 15}%, -50%)` }}
        >
          TOBIAS
        </h1>

        <div
          ref={imageContainerRef}
          role="button"
          tabIndex={0}
          aria-label="Tobias Varghese interactive portrait. Click to snap shutter."
          className="group absolute bottom-0 left-1/2 w-[min(90vw,620px)] cursor-pointer select-none"
          style={{
            transform: `translateX(calc(-50% - ${progress * 80}vw))`,
            opacity: 1 - progress,
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            targetPos.current = {
              x: ((e.clientX - r.left) / r.width) * 100,
              y: ((e.clientY - r.top) / r.height) * 100,
            };
          }}
          onClick={handleSnap}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSnap();
            }
          }}
        >
          {/* Grayscale base photo */}
          <img src={photo} alt="Tobias Varghese" className="img-mono pointer-events-none block w-full" />

          {/* Dynamic color reveal photo with gimbal lerp */}
          <img
            src={photo}
            alt=""
            aria-hidden
            className="reveal-color pointer-events-none absolute inset-0 block w-full"
          />

          {/* Gimbal tracking lens ring */}
          <div aria-hidden className="reveal-ring" />
        </div>

        <div className="absolute bottom-10 left-6 md:left-12">
          <p className="text-lg font-extrabold uppercase text-primary">Creative</p>
          <p className="text-lg font-extrabold uppercase">Reel Creator</p>
        </div>
        <div className="absolute bottom-24 right-6 text-right md:right-12">
          <p className="text-lg font-extrabold uppercase text-primary">Tobias</p>
          <p className="text-lg uppercase text-primary">Varghese</p>
        </div>
        <div className="absolute bottom-10 right-6 h-8 w-8 bg-primary md:right-12" />
      </section>

      <section className="px-6 py-24 md:px-12">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-6xl text-primary md:text-8xl">CONTENT</h2>
          <Link to="/content" className="text-xs font-semibold uppercase tracking-widest hover:text-primary">
            View all →
          </Link>
        </div>
        <ReelGrid />
      </section>
    </main>
  );
}
