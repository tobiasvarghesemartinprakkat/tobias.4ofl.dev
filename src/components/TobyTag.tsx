interface TobyTagProps {
  className?: string;
}

export function TobyTag({ className = "h-7 sm:h-8 w-auto text-primary" }: TobyTagProps) {
  return (
    <span
      role="img"
      aria-label="toby_01"
      className={`inline-block aspect-[151/75] bg-current transition-all duration-200 group-hover:scale-105 ${className}`}
      style={{
        WebkitMaskImage: "url('/toby-tag-white.png')",
        maskImage: "url('/toby-tag-white.png')",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
      }}
    >
      <span className="sr-only">toby_01</span>
    </span>
  );
}
