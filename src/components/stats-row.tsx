export type Stat = { value: number; label: string; icon: "grid" | "folder" | "browser" | "spark" };

const paths: Record<Stat["icon"], React.ReactNode> = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  browser: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
    </>
  ),
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />,
};

/**
 * Four-column stats row: icon in round brackets, big number, label. Every
 * number is counted from the site's own content data, never typed in.
 */
export function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <ul data-reveal-group className="grid grid-cols-2 border-t border-line md:grid-cols-4">
      {stats.map((s, i) => (
        <li
          key={s.label}
          data-reveal="item"
          className={`flex flex-col items-center px-4 py-10 text-center ${i % 2 ? "" : "border-r border-line"} md:border-r md:last:border-r-0 ${i < 2 ? "border-b border-line md:border-b-0" : ""}`}
        >
          <span aria-hidden className="flex items-center gap-1 text-[#9a9b97]">
            <span className="text-2xl font-light">(</span>
            <svg viewBox="0 0 24 24" className="size-6 text-[#121316]" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              {paths[s.icon]}
            </svg>
            <span className="text-2xl font-light">)</span>
          </span>
          <span className="font-display mt-4 text-[clamp(2.25rem,1.6rem+2vw,3.25rem)] leading-none font-medium tracking-[-0.03em]">
            {s.value}
          </span>
          <span className="mt-2 text-[0.875rem] text-fg-muted">{s.label}</span>
        </li>
      ))}
    </ul>
  );
}
