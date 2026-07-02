import logoUrl from "@/assets/naseer-logo.png";

export function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        <path
          d="M32 4 L40 24 L60 32 L40 40 L32 60 L24 40 L4 32 L24 24 Z"
          fill="currentColor"
          fillOpacity="0.18"
        />
        <circle cx="32" cy="32" r="6" />
      </g>
    </svg>
  );
}

export function Logo({ size = 40 }: { size?: number }) {
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
