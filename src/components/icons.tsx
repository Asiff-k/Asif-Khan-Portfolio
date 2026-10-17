type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "square" as const,
  "aria-hidden": true,
  focusable: false,
};

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={className} {...base}>
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowLeft({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={className} {...base}>
      <path d="M14 8H3M7 4L3 8l4 4" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={className} {...base}>
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
  );
}

export function ArrowDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={className} {...base}>
      <path d="M8 2v11M4 9l4 4 4-4" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={className} {...base}>
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={className} {...base}>
      <path d="M2 5h12M2 11h12" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={className} {...base}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={className} {...base}>
      <path d="M8 2v8M4.5 6.5L8 10l3.5-3.5M2.5 13.5h11" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="18" height="18" className={className} {...base}>
      <path d="M5.5 2.5H3.2a.7.7 0 0 0-.7.75c.4 5.6 4.7 9.9 10.3 10.3a.7.7 0 0 0 .7-.7v-2.3l-2.8-1-1.3 1.3a7.6 7.6 0 0 1-3.8-3.8L6.9 5.8 5.5 2.5z" />
    </svg>
  );
}
