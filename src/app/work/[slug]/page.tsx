import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/icons";
import { ProjectShots, type ShotEntry } from "@/components/project-shots";
import { media } from "@/content/media.generated";
import { getProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `${project.summary}. ${project.role}`,
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  const shots: ShotEntry[] = project.shots.map((s) => ({
    ...media[s.image],
    title: s.caption,
    meta: project.title,
    tall: s.tall,
    mobile: s.mobile,
  }));

  const facts: [string, React.ReactNode][] = [
    ["Type", project.kind],
    ["My role", project.role],
  ];
  if (project.year) facts.push(["Year", project.year]);
  if (project.stack) facts.push(["Built with", project.stack.join(", ")]);

  return (
    <main id="main">
      <article>
        <header className="page-x pt-8 pb-14 md:pt-12 md:pb-20">
          <Link href="/#work" className="t-stamp group inline-flex items-center gap-2 text-muted hover:text-ink">
            <ArrowLeft className="transition-transform duration-150 group-hover:-translate-x-1" />
            All work
          </Link>
          <div className="mt-10 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="t-stamp text-moss">
                {String(index + 1).padStart(2, "0")} · {project.kind}
              </p>
              <h1 className="t-display-lg mt-4">{project.title}</h1>
              <p className="t-body-lg mt-5 max-w-xl text-ink-soft">{project.summary}.</p>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:self-end">
              <dl className="border-b border-rule">
                {facts.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 border-t border-rule py-3">
                    <dt className="t-stamp pt-0.5 text-muted">{k}</dt>
                    <dd className="t-body-sm">{v}</dd>
                  </div>
                ))}
              </dl>
              {project.links.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-3">
                  {project.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t-stamp pressable inline-flex items-center gap-2 bg-ink px-4 py-3 text-stone hover:bg-ink-soft"
                      >
                        {l.label} <ArrowUpRight />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </header>

        <section className="page-x border-t border-ink py-14 md:py-20" aria-label="About the project">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="space-y-5 md:col-span-7">
              {project.intro.map((para) => (
                <p key={para} className="t-body-lg">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {project.highlights && (
            <ol className="mt-14 grid border-l border-t border-rule md:grid-cols-2">
              {project.highlights.map((h, i) => (
                <li key={h.title} className="border-b border-r border-rule p-6 md:p-8">
                  <p className="t-stamp text-muted">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="t-subtitle mt-4">{h.title}</h2>
                  <p className="t-body-sm mt-3 text-ink-soft">{h.body}</p>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="page-x pb-14 md:pb-20" aria-labelledby="screens-title">
          <h2 id="screens-title" className="t-stamp border-b border-rule pb-3 text-muted">
            Screens
          </h2>
          <div className="mt-8">
            <ProjectShots shots={shots} title={project.title} />
          </div>
          {project.note && <p className="t-body-sm mt-10 max-w-2xl text-ink-soft">{project.note}</p>}
        </section>
      </article>

      <nav aria-label="Next project" className="border-t border-ink">
        <Link
          href={`/work/${next.slug}`}
          className="page-x group flex items-center justify-between gap-6 py-10 transition-colors duration-100 active:bg-stone-deep md:py-14"
        >
          <span>
            <span className="t-stamp block text-muted">Next project</span>
            <span className="t-headline mt-2 block group-hover:text-moss">{next.title}</span>
          </span>
          <ArrowRight className="size-6 shrink-0 transition-transform duration-150 group-hover:translate-x-1" />
        </Link>
      </nav>
    </main>
  );
}
