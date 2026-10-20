"use client";

import { useId, useMemo, useState } from "react";
import type { LogoKey } from "@/content/logos.generated";
import type { ToolStatus } from "@/content/tools";
import { ArrowUpRight, SearchIcon } from "./icons";
import { LogoMark } from "./logo-mark";

export type ToolEntry = {
  name: string;
  formerly?: string;
  maker?: string;
  logo?: LogoKey;
  category: string;
  status: ToolStatus;
  about: string;
  use?: string;
  href: string;
};

const ALL = "All areas";

/** Searchable, filterable list of every tool on the page. */
export function ToolDirectory({ tools, categories }: { tools: ToolEntry[]; categories: readonly string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [usedOnly, setUsedOnly] = useState(false);
  const searchId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (usedOnly && t.status === "reference") return false;
      if (category !== ALL && t.category !== category) return false;
      if (!q) return true;
      return [t.name, t.formerly, t.maker, t.category, t.about, t.use].some((f) => f?.toLowerCase().includes(q));
    });
  }, [tools, query, category, usedOnly]);

  const counts = useMemo(() => {
    const map = new Map<string, number>([[ALL, tools.length]]);
    for (const t of tools) map.set(t.category, (map.get(t.category) ?? 0) + 1);
    return map;
  }, [tools]);

  const areas = categories.filter((c) => counts.has(c));
  const groups = areas
    .map((area) => ({ area, list: filtered.filter((t) => t.category === area) }))
    .filter((g) => g.list.length > 0);

  function reset() {
    setQuery("");
    setCategory(ALL);
    setUsedOnly(false);
  }

  return (
    <div>
      <div className="space-y-5 border-y border-ink py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="w-full md:max-w-md">
            <label htmlFor={searchId} className="t-stamp block text-muted">
              Search tools
            </label>
            <div className="mt-2 flex items-center gap-3 border-b border-ink pb-2 focus-within:border-moss">
              <SearchIcon className="shrink-0 text-muted" />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name or task, e.g. voice, video, SEO"
                className="w-full bg-transparent text-base outline-none placeholder:text-muted"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-6 md:justify-end">
            <button
              type="button"
              aria-pressed={usedOnly}
              onClick={() => setUsedOnly((v) => !v)}
              className="t-label pressable inline-flex items-center gap-2 border border-rule bg-stone-deep px-3 py-2 text-moss hover:border-moss aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-stone"
            >
              <span
                aria-hidden
                className={`size-2.5 border ${usedOnly ? "border-mint bg-mint" : "border-moss"}`}
              />
              Only tools I use
            </button>
            <p className="t-stamp shrink-0 text-muted" aria-live="polite">
              {filtered.length} of {tools.length}
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <p id={`${searchId}-areas`} className="sr-only">
            Filter by area
          </p>
          <div
            role="group"
            aria-labelledby={`${searchId}-areas`}
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
          >
            {[ALL, ...areas].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className="t-label pressable shrink-0 border border-rule bg-stone-deep px-3 py-2 text-moss hover:border-moss aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-stone"
              >
                {c} <span className="tabular-nums">{counts.get(c) ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 border border-rule p-8 text-center">
          <p className="t-subtitle">No tools match that search.</p>
          <button
            type="button"
            onClick={reset}
            className="t-stamp pressable mt-5 inline-flex bg-ink px-4 py-3 text-stone hover:bg-ink-soft"
          >
            Clear filters
          </button>
        </div>
      )}

      {groups.map(({ area, list }) => (
        <section key={area} className="mt-12" aria-label={area}>
          <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-2">
            <h3 className="t-subtitle">{area}</h3>
            <p className="t-stamp text-muted">{list.length}</p>
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((t) => (
              <li key={t.name} data-tool={t.name} className="border-b border-rule">
                <a
                  href={t.href}
                  {...(t.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-start gap-4 py-4 transition-colors duration-100 active:bg-stone-deep"
                >
                  <LogoMark logo={t.logo} name={t.name} />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="t-subtitle text-[1.0625rem] group-hover:text-moss">{t.name}</span>
                      {t.status !== "reference" && (
                        <span className="t-stamp bg-moss px-1.5 py-0.5 text-stone">
                          {t.status === "used" ? "I use this" : "My project"}
                        </span>
                      )}
                    </span>
                    {(t.maker || t.formerly) && (
                      <span className="t-stamp mt-0.5 block text-muted">
                        {[t.maker, t.formerly && `formerly ${t.formerly}`].filter(Boolean).join(" · ")}
                      </span>
                    )}
                    <span className="t-body-sm mt-1.5 block text-ink-soft">{t.about}</span>
                  </span>
                  <ArrowUpRight className="mt-1 shrink-0 text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-moss" />
                  {t.href.startsWith("http") && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
