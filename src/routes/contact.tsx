import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Tobias Varghese" },
      { name: "description", content: "Get in touch with Tobias Varghese for collaborations and brand reels." },
      { property: "og:title", content: "Contact — Tobias Varghese" },
      { property: "og:description", content: "Get in touch with Tobias Varghese for collaborations and brand reels." },
    ],
  }),
  component: () => (
    <main className="flex min-h-screen flex-col justify-center px-6 md:px-12">
      <h1 className="font-display text-7xl text-primary md:text-[12rem] md:leading-none">LET'S TALK</h1>
      <div className="mt-10 space-y-3 text-lg font-semibold">
        <a href="mailto:tobias@4ofl.dev" className="block hover:text-primary">tobias@4ofl.dev</a>
        <a
          href="https://www.instagram.com/_t0by_01/"
          target="_blank"
          rel="noreferrer"
          className="block hover:text-primary"
        >
          Instagram ↗
        </a>
      </div>
    </main>
  ),
});
