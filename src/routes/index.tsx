import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import photo from "@/assets/tobias-cutout.png";
import { ReelGrid } from "@/components/ReelGrid";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tobias Varghese" },
      { name: "description", content: "Reels, vlogs and short-form stories by Tobias Varghese." },
      { property: "og:title", content: "Tobias Varghese" },
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
  const targetPos = useRef({ x: 50, y: 38 });
  const currentPos = useRef({ x: 50, y: 38 });
  const targetR = useRef(0);
  const currentR = useRef(0);
  const hoverRef = useRef(false);
  const isSnappedRef = useRef(false);
  const isInteracting = useRef(false);
  const lastInteractionTime = useRef(Date.now());
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync hover state with target radius when interacting
  useEffect(() => {
    hoverRef.current = hover;
    if (hover) {
      isInteracting.current = true;
      lastInteractionTime.current = Date.now();
      if (!isSnappedRef.current) {
        targetR.current = 115;
      }
    } else {
      isInteracting.current = false;
      lastInteractionTime.current = Date.now();
      if (!isSnappedRef.current) {
        targetR.current = 0;
      }
    }
  }, [hover]);

  // Scroll parallax progress
  useEffect(() => {
    const onScroll = () => {
      const h = heroRef.current?.offsetHeight ?? window.innerHeight;
      setProgress(Math.min(1, Math.max(0, window.scrollY / (h * 0.85))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 60fps/120fps Gimbal Physics, Spring Lag & Ambient Auto-Sweep
  useEffect(() => {
    let rafId: number;

    const animate = () => {
      const now = performance.now();
      const timeSinceInteraction = Date.now() - lastInteractionTime.current;

      // Pillar 3: Ambient Auto-Sweep / Breathing Scanner when idle (> 1.8s)
      if (!isInteracting.current && !isSnappedRef.current && timeSinceInteraction > 1800) {
        const t = now * 0.0011;
        targetPos.current.x = 50 + Math.sin(t) * 15;
        targetPos.current.y = 38 + Math.cos(t * 1.3) * 10;
        targetR.current = 90 + Math.sin(t * 1.8) * 12; // breathes between ~78px and 102px
      }

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

  // Camera Shutter Snap (Pillar 2: Shutter Flash, Sound, Haptic Vibration & Full-Color Burst)
  const handleSnap = () => {
    playShutterSound();

    // Haptic vibration on supported smartphones
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate([25, 20, 25]);
      } catch {}
    }

    // Trigger quick 150ms screen shutter flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 160);

    // Unlock full-color snapshot frame
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
      lastInteractionTime.current = Date.now();
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

        <div className="absolute right-4 top-16 text-xs font-semibold uppercase tracking-widest text-primary sm:text-sm md:right-12 md:top-20">
          Kerala · India
        </div>

        <h1
          className="text-giant absolute inset-x-0 top-[52%] -translate-y-1/2 select-none text-center text-primary"
          style={{
            transform: `translate(calc(-50% + ${progress * 10}vw), -50%)`,
            left: "50%",
            opacity: Math.max(0, 1 - progress * 0.75),
          }}
        >
          TOBIAS
        </h1>

        {/* Interactive Cutout with Concept A: Gradient Feather Dissolve & Sinking Depth Drift */}
        <div
          ref={imageContainerRef}
          role="button"
          tabIndex={0}
          aria-label="Tobias Varghese interactive portrait. Click or tap to snap shutter."
          className="group absolute bottom-0 left-1/2 w-[min(94vw,620px)] cursor-pointer select-none touch-manipulation"
          style={{
            transform: `translate(calc(-50% - ${progress * 26}vw), ${-progress * 10}vh) scale(${1 - progress * 0.16})`,
            opacity: Math.max(0, 1 - Math.pow(progress, 1.25)),
            filter: `blur(${progress * 7}px)`,
            WebkitMaskImage: `linear-gradient(to bottom, black 0%, black ${Math.max(0, 100 - progress * 135)}%, transparent 100%)`,
            maskImage: `linear-gradient(to bottom, black 0%, black ${Math.max(0, 100 - progress * 135)}%, transparent 100%)`,
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onMouseMove={(e) => {
            isInteracting.current = true;
            lastInteractionTime.current = Date.now();
            const r = e.currentTarget.getBoundingClientRect();
            targetPos.current = {
              x: ((e.clientX - r.left) / r.width) * 100,
              y: ((e.clientY - r.top) / r.height) * 100,
            };
          }}
          onTouchStart={(e) => {
            isInteracting.current = true;
            lastInteractionTime.current = Date.now();
            const touch = e.touches[0];
            if (!touch) return;
            touchStartRef.current = {
              x: touch.clientX,
              y: touch.clientY,
              time: Date.now(),
            };
            const r = e.currentTarget.getBoundingClientRect();
            targetPos.current = {
              x: Math.max(0, Math.min(100, ((touch.clientX - r.left) / r.width) * 100)),
              y: Math.max(0, Math.min(100, ((touch.clientY - r.top) / r.height) * 100)),
            };
            if (!isSnappedRef.current) {
              targetR.current = 100;
            }
          }}
          onTouchMove={(e) => {
            isInteracting.current = true;
            lastInteractionTime.current = Date.now();
            const touch = e.touches[0];
            if (!touch) return;
            const r = e.currentTarget.getBoundingClientRect();
            targetPos.current = {
              x: Math.max(0, Math.min(100, ((touch.clientX - r.left) / r.width) * 100)),
              y: Math.max(0, Math.min(100, ((touch.clientY - r.top) / r.height) * 100)),
            };
          }}
          onTouchEnd={(e) => {
            const dt = Date.now() - touchStartRef.current.time;
            const changedTouch = e.changedTouches[0];
            const dx = changedTouch ? Math.abs(changedTouch.clientX - touchStartRef.current.x) : 99;
            const dy = changedTouch ? Math.abs(changedTouch.clientY - touchStartRef.current.y) : 99;

            // Quick tap: trigger camera shutter snap
            if (dt < 300 && dx < 20 && dy < 20) {
              handleSnap();
            } else {
              isInteracting.current = false;
              lastInteractionTime.current = Date.now();
              if (!isSnappedRef.current) {
                targetR.current = 0;
              }
            }
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

        {/* Responsive Hero Corner Metadata */}
        <div className="absolute bottom-6 left-4 sm:bottom-10 sm:left-6 md:left-12">
          <p className="text-base font-extrabold uppercase text-primary sm:text-lg">Creative</p>
          <p className="text-base font-extrabold uppercase sm:text-lg">Reel Creator</p>
        </div>
        <div className="absolute bottom-16 right-4 text-right sm:bottom-24 sm:right-6 md:right-12">
          <p className="text-base font-extrabold uppercase text-primary sm:text-lg">Tobias</p>
          <p className="text-base uppercase text-primary sm:text-lg">Varghese</p>
        </div>
        <div className="absolute bottom-6 right-4 h-6 w-6 bg-primary sm:bottom-10 sm:right-6 sm:h-8 sm:w-8 md:right-12" />
      </section>

      <section className="px-4 py-20 sm:px-6 sm:py-24 md:px-12">
        <div className="mb-8 flex items-end justify-between sm:mb-10">
          <h2 className="font-display text-5xl text-primary sm:text-6xl md:text-8xl">CONTENT</h2>
          <Link to="/content" className="text-xs font-semibold uppercase tracking-widest hover:text-primary">
            View all →
          </Link>
        </div>
        <ReelGrid />
      </section>
    </main>
  );
}
