import logoUrl from "@/assets/naseer-logo.png";

export function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth="1" fill="none" opacity="0.9">
        <path
          d="M40 4 L48 28 L72 32 L54 48 L60 72 L40 58 L20 72 L26 48 L8 32 L32 28 Z"
          fill="currentColor"
          fillOpacity="0.10"
        />
        <circle cx="40" cy="40" r="14" />
        <circle cx="40" cy="40" r="22" opacity="0.5" />
        <path d="M40 18 L40 62 M18 40 L62 40" opacity="0.35" />
      </g>
    </svg>
  );
}

export function Logo({ size = 76 }: { size?: number }) {
  return (
    <img
      src={logoUrl}
      alt="نسير | Naseer"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="object-contain shrink-0"
    />
  );
}

export { logoUrl };
