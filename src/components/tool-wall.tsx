import { LogoMark } from "./logo-mark";
import type { LogoKey } from "@/content/logos.generated";

export type WallTool = { name: string; logo?: LogoKey; href?: string };

/**
 * Logo wall: a 5 x 2 grid of white rounded cards (full-colour logo and name)
 * under a large soft gradient glow, with a highlighted caption below. Cards
 * fade and sharpen in one after another; on hover a card lifts and its logo
 * grows slightly. Linked cards open the tool's official site in a new tab.
 */
export function ToolWall({ tools, caption }: { tools: WallTool[]; caption: string }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[min(90vw,900px)] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side at 30% 55%, #f6cfb4, transparent), radial-gradient(closest-side at 70% 45%, #cbc5f6, transparent), radial-gradient(closest-side at 50% 50%, #c6def3, transparent)" }}
      />
      <ul data-reveal-group className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
        {tools.map((t) => {
          const inner = (
            <>
              <LogoMark logo={t.logo} name={t.name} size="lg" />
              <span className="mt-3 text-[0.9375rem] font-medium">{t.name}</span>
            </>
          );
          return (
            <li key={t.name} data-reveal="item">
              {t.href ? (
                <a
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group card card-lift flex h-full flex-col items-center justify-center px-4 py-7 text-center"
                >
                  {inner}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <div className="group card card-lift flex h-full flex-col items-center justify-center px-4 py-7 text-center">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-center text-[0.9375rem] text-fg-soft">
        <span className="rounded-md bg-[linear-gradient(transparent_45%,#f9e48c_45%,#f9e48c_88%,transparent_88%)] px-1.5 font-medium text-fg">
          {caption}
        </span>
      </p>
    </div>
  );
}
