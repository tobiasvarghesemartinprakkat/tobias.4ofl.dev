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

function Index() {
  const [progress, setProgress] = useState(0);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const h = heroRef.current?.offsetHeight ?? window.innerHeight;
      setProgress(Math.min(1, Math.max(0, window.scrollY / (h * 0.8))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main>
      <section ref={heroRef} className="relative h-screen overflow-hidden">
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
          className="absolute bottom-0 left-1/2 w-[min(90vw,620px)]"
          style={{
            transform: `translateX(calc(-50% - ${progress * 80}vw))`,
            opacity: 1 - progress,
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
        >
          <img src={photo} alt="Tobias Varghese" className="img-mono block w-full" />
          <img
            src={photo}
            alt=""
            aria-hidden
            className="reveal-color absolute inset-0 block w-full"
            style={
              {
                "--mx": `${pos.x}%`,
                "--my": `${pos.y}%`,
                "--r": hover ? "170px" : "0px",
                "--ring-o": hover ? "1" : "0",
              } as React.CSSProperties
            }
          />
          <div
            aria-hidden
            className="reveal-ring"
            style={
              {
                "--mx": `${pos.x}%`,
                "--my": `${pos.y}%`,
                "--r": hover ? "170px" : "0px",
                "--ring-o": hover ? "1" : "0",
              } as React.CSSProperties
            }
          />
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
