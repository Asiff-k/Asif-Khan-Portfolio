import type { Metadata } from "next";
import { ArrowUpRight } from "@/components/icons";
import { LogoMark } from "@/components/logo-mark";
import { ToolDirectory, type ToolEntry } from "@/components/tool-directory";
import { aiDataWork } from "@/content/experience";
import { toolCategories, tools, workflowTasks } from "@/content/tools";

export const metadata: Metadata = {
  title: "AI tools",
  description:
    "The AI tools Asiful Hasan Khan uses for research, coding, interface design and video, the platforms from his AI data projects, and a wider map of AI tools by task.",
};

const used = tools.filter((t) => t.status === "used");
const platforms = tools.filter((t) => t.status === "platform");
const entries: ToolEntry[] = tools.map((t) => ({ ...t }));

export default function AiToolsPage() {
  return (
    <main id="main">
      <header className="page-x pt-10 pb-14 md:pt-16 md:pb-20">
        <p className="t-stamp text-moss">AI tools</p>
        <div className="mt-4 grid gap-8 md:grid-cols-12 md:items-end">
          <h1 className="t-display-lg text-balance md:col-span-8">Tools for research, code, design and video.</h1>
          <p className="t-body-lg text-ink-soft md:col-span-4">
            The tools I work with and what for, the platforms from my AI data projects, and a catalogue of AI tools by
            task.
          </p>
        </div>
      </header>

      {/* Tools I use, grouped by task */}
      <section className="page-x pb-20 md:pb-28" aria-labelledby="workflow-title">
        <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
          <h2 id="workflow-title" className="t-headline">
            My workflow
          </h2>
          <p className="t-stamp text-muted">{used.length} tools</p>
        </div>
        <ol className="divide-y divide-rule border-b border-rule">
          {workflowTasks.map((task, i) => {
            const list = used.filter((t) => t.task === task);
            return (
              <li key={task} className="grid gap-5 py-7 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-3">
                  <p className="t-stamp text-muted">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="t-title mt-2">{task}</h3>
                </div>
                <ul className="grid sm:grid-cols-2 md:col-span-9 xl:grid-cols-3">
                  {list.map((t) => (
                    <li
                      key={t.name}
                      data-tool={t.name}
                      className="border-rule max-sm:border-b max-sm:last:border-b-0 sm:max-xl:even:border-l sm:max-xl:[&:nth-child(n+3)]:border-t xl:not-first:border-l"
                    >
                      <a
                        href={t.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-full items-start gap-4 p-4 transition-colors duration-100 hover:bg-stone-deep active:bg-stone-deep md:p-5"
                      >
                        <LogoMark logo={t.logo} name={t.name} size="lg" />
                        <span className="min-w-0">
                          <span className="t-subtitle block group-hover:text-moss">{t.name}</span>
                          {(t.maker || t.formerly) && (
                            <span className="t-stamp mt-0.5 block text-muted">
                              {[t.maker, t.formerly && `formerly ${t.formerly}`].filter(Boolean).join(" · ")}
                            </span>
                          )}
                          <span className="t-body-sm mt-2 block">{t.use}</span>
                        </span>
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </section>

      {/* AI data platforms */}
      <section className="bg-carbon text-carbon-text" aria-labelledby="platforms-title">
        <div className="page-x py-20 md:py-24">
          <div className="grid gap-6 border-b border-carbon-rule pb-6 md:grid-cols-12">
            <h2 id="platforms-title" className="t-headline md:col-span-7">
              Platforms from my AI data projects
            </h2>
            <p className="t-body-sm text-carbon-muted md:col-span-4 md:col-start-9 md:self-end">
              Short-term, completed projects preparing training data for AI models.
            </p>
          </div>
          <ul className="grid md:grid-cols-3">
            {platforms.map((t) => {
              const project = aiDataWork.find((w) => w.platform === t.name);
              return (
                <li
                  key={t.name}
                  data-tool={t.name}
                  className="flex flex-col gap-5 border-b border-carbon-rule py-8 md:border-r md:border-b-0 md:px-6 md:first:pl-0 md:last:border-r-0"
                >
                  <div className="flex min-h-14 items-center gap-4">
                    {t.logo && <LogoMark logo={t.logo} name={t.name} size="lg" />}
                    <div>
                      <h3 className="t-subtitle">{t.name}</h3>
                      {project && <p className="t-stamp mt-1 text-mint">{project.org}</p>}
                    </div>
                  </div>
                  <p className="t-body-sm text-carbon-muted">{t.about}</p>
                  <p className="t-body-sm">{t.use}</p>
                  {t.href.startsWith("http") && (
                    <a
                      href={t.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-stamp mt-auto inline-flex items-center gap-1.5 hover:text-mint"
                    >
                      App Store listing <ArrowUpRight />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Wider toolkit */}
      <section className="page-x py-20 pb-24 md:py-28" aria-labelledby="directory-title">
        <h2 id="directory-title" className="t-headline pb-8">
          AI tool catalogue
        </h2>
        <ToolDirectory tools={entries} categories={toolCategories} />
      </section>
    </main>
  );
}
