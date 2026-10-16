import { reels } from "@/lib/reels";

export function ReelGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
      {reels.map((r, i) => (
        <article
          key={r.title}
          className="group relative aspect-[9/16] overflow-hidden rounded-md bg-foreground"
        >
          {r.video ? (
            <video
              src={r.video}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-8xl text-primary/30 transition-colors group-hover:text-primary">
              {String(i + 1).padStart(2, "0")}
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
              {r.category}
            </p>
            <h3 className="font-display text-xl tracking-wide text-background">{r.title}</h3>
          </div>
        </article>
      ))}
    </div>
  );
}
