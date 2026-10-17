"use client";

import { useId, useMemo, useState } from "react";
import type { ToolStatus } from "@/content/tools";
import { ArrowUpRight, SearchIcon } from "./icons";

export type ToolEntry = {
  name: string;
  maker?: string;
  category: string;
  status: ToolStatus;
  about: string;
  use: string;
  href: string;
  /** SVG path from Simple Icons (24x24), when a logo is available. */
  logo?: string;
};

const sections: { status: ToolStatus; title: string; note: string; useLabel: string }[] = [
  {
    status: "used",
    title: "Tools I use",
    note: "AI tools I use in my own work.",
    useLabel: "How I use it",
  },
  {
    status: "platform",
    title: "Platforms from my AI data work",
    note: "Platforms I worked on during short-term AI training data projects.",
    useLabel: "My work",
  },
  {
    status: "reference",
    title: "Other tools worth knowing",
    note: "A wider list by area. I haven't necessarily used these. They're here because they're useful to know.",
    useLabel: "Good for",
  },
];

const ALL = "All areas";

export function ToolDirectory({ tools, categories }: { tools: ToolEntry[]; categories: readonly string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const searchId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (category !== ALL && t.category !== category) return false;
      if (!q) return true;
      return [t.name, t.maker, t.category, t.about, t.use].some((f) => f?.toLowerCase().includes(q));
    });
  }, [tools, query, category]);

  const usedCategories = categories.filter((c) => tools.some((t) => t.category === c));

  function reset() {
    setQuery("");
    setCategory(ALL);
  }

  return (
    <div>
      <div className="grid gap-4 border-y border-rule py-5 md:grid-cols-12 md:items-end">
        <div className="md:col-span-5">
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
              placeholder="Name, area or task, e.g. video"
              className="w-full bg-transparent text-base outline-none placeholder:text-muted"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="min-w-0 md:col-span-7">
          <p id={`${searchId}-areas`} className="t-stamp text-muted">
            Area
          </p>
          <div
            role="group"
            aria-labelledby={`${searchId}-areas`}
            className="-mx-5 mt-2 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
          >
            {[ALL, ...usedCategories].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className="t-label pressable shrink-0 border border-rule bg-stone-deep px-3 py-2 text-moss hover:border-moss aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-mint"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="t-stamp mt-4 text-muted" aria-live="polite">
        {filtered.length} of {tools.length} tools
      </p>

      {filtered.length === 0 && (
        <div className="mt-10 border border-rule p-8 text-center">
          <p className="t-subtitle">No tools match that search.</p>
          <button
            type="button"
            onClick={reset}
            className="t-stamp pressable mt-5 inline-flex bg-ink px-4 py-3 text-stone hover:bg-moss"
          >
            Clear filters
          </button>
        </div>
      )}

      {sections.map((section) => {
        const list = filtered.filter((t) => t.status === section.status);
        if (list.length === 0) return null;
        return (
          <section key={section.status} className="mt-14" aria-labelledby={`tools-${section.status}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-3">
              <h2 id={`tools-${section.status}`} className="t-headline">
                {section.title}
              </h2>
              <p className="t-stamp text-muted">{list.length} listed</p>
            </div>
            <p className="t-body-sm mt-3 max-w-2xl text-ink-soft">{section.note}</p>
            <ul className="mt-6 grid border-l border-t border-rule sm:grid-cols-2 xl:grid-cols-3">
              {list.map((t) => (
                <li key={t.name} className="flex flex-col border-b border-r border-rule p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <Logo tool={t} />
                    <div className="min-w-0">
                      <h3 className="t-subtitle">{t.name}</h3>
                      <p className="t-stamp mt-1 text-muted">
                        {t.maker ? `${t.maker} · ` : ""}
                        {t.category}
                      </p>
                    </div>
                  </div>
                  <p className="t-body-sm mt-4 text-ink-soft">{t.about}</p>
                  <p className="t-body-sm mt-3">
                    <span className="t-stamp mr-2 text-moss">{section.useLabel}</span>
                    {t.use}
                  </p>
                  <a
                    href={t.href}
                    {...(t.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="t-stamp group mt-auto inline-flex items-center gap-1.5 pt-5 hover:text-moss"
                  >
                    {t.href.startsWith("http") ? `Visit ${t.name}` : "See the project"}
                    <ArrowUpRight className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    {t.href.startsWith("http") && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function Logo({ tool }: { tool: ToolEntry }) {
  return (
    <span aria-hidden className="flex size-10 shrink-0 items-center justify-center border border-rule bg-stone-deep">
      {tool.logo ? (
        <svg viewBox="0 0 24 24" width="20" height="20" className="fill-ink">
          <path d={tool.logo} />
        </svg>
      ) : (
        <span className="font-display text-[0.8125rem] font-bold tracking-[-0.02em]">
          {tool.name
            .replace(/[^A-Za-z0-9 ]/g, "")
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")}
        </span>
      )}
    </span>
  );
}
