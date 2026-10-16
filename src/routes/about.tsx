import { createFileRoute } from "@tanstack/react-router";
import photo from "@/assets/tobias-cutout.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Tobias Varghese" },
      { name: "description", content: "The story behind Tobias Varghese's reels and creative work." },
      { property: "og:title", content: "About — Tobias Varghese" },
      { property: "og:description", content: "The story behind Tobias Varghese's reels and creative work." },
    ],
  }),
  component: () => (
    <main className="grid min-h-screen items-end gap-10 px-6 pt-32 md:grid-cols-2 md:px-12">
      <div className="pb-24">
        <h1 className="mb-8 font-display text-7xl text-primary md:text-9xl">ABOUT</h1>
        <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
          I'm Tobias — a reel creator turning everyday moments into short, scroll-stopping stories.
          From café corners to city streets, I shoot, edit and share it all from my phone.
        </p>
      </div>
      <img src={photo} alt="Tobias Varghese" className="img-mono w-full max-w-lg justify-self-center" />
    </main>
  ),
});
