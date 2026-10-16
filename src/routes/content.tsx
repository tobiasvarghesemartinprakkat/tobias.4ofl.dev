import { createFileRoute } from "@tanstack/react-router";
import { ReelGrid } from "@/components/ReelGrid";

export const Route = createFileRoute("/content")({
  head: () => ({
    meta: [
      { title: "Content — Tobias Varghese" },
      { name: "description", content: "Browse reels and short videos made by Tobias Varghese." },
      { property: "og:title", content: "Content — Tobias Varghese" },
      { property: "og:description", content: "Browse reels and short videos made by Tobias Varghese." },
    ],
  }),
  component: () => (
    <main className="px-6 pb-24 pt-32 md:px-12">
      <h1 className="mb-12 font-display text-7xl text-primary md:text-9xl">CONTENT</h1>
      <ReelGrid />
    </main>
  ),
});
