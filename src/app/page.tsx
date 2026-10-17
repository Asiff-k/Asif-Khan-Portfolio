import Link from "next/link";
import { DesignGallery, type GalleryEntry } from "@/components/design-gallery";
import { ArrowDown, ArrowRight, ArrowUpRight, DownloadIcon } from "@/components/icons";
import { MediaImage } from "@/components/media-image";
import { SectionHead } from "@/components/section-head";
import { aiDataWork, education, jobs, languages, toolGroups } from "@/content/experience";
import { gallery, galleryCategories } from "@/content/gallery";
import { media } from "@/content/media.generated";
import { otherProjects, projects } from "@/content/projects";
import { site, socials } from "@/content/site";

const disciplines = [
  {
    title: "Software development",
    body: "I build complete web apps in PHP, MySQL and JavaScript, with accounts, email verification, admin panels and the logic in between. I've also built Flutter apps and a Next.js company site.",
    tags: ["PHP", "MySQL", "JavaScript", "Next.js", "Flutter"],
  },
  {
    title: "UI/UX design",
    body: "I design websites and app screens in Figma, from wireframes to final screens. At NextGen Production I was the link between designers and developers.",
    tags: ["Figma", "Web", "Mobile"],
  },
  {
    title: "Graphic design",
    body: "Posters, product ads, social posts and T-shirt art. I generate imagery with AI tools, then handle the layout, type and branding myself.",
    tags: ["Posters", "Product ads", "Social posts", "Apparel"],
  },
  {
    title: "AI data work",
    body: "Short projects preparing training data for AI: video segmentation for robots, satellite image annotation and first-person video capture.",
    tags: ["Dot Lab", "Ginger 2025", "Atlas Capture"],
  },
];

const galleryEntries: GalleryEntry[] = gallery.map((g) => ({
  ...media[g.image],
  title: g.title,
  category: g.category,
  meta: `${g.category} · AI-assisted`,
}));

export default function Home() {
  return (
    <main id="main">
      {/* Intro */}
      <section className="page-x pt-10 pb-20 md:pt-16 md:pb-28" aria-labelledby="intro-title">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7 lg:col-span-8">
            <p className="t-stamp text-moss">Software · UI/UX · Graphic design · AI data</p>
            <h1 id="intro-title" className="t-display mt-6 text-balance">
              I build web apps and <span className="text-moss">design their interfaces.</span>
            </h1>
            <p className="t-body-lg mt-8 max-w-xl text-ink-soft">
              I&apos;m Asif, a final-year Computer Science and Engineering student at Leading University in
              Sylhet. I build PHP and JavaScript web apps, design interfaces in Figma, and make graphics with AI
              image tools. At NextGen Production I went from UI/UX designer to team leader.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="#work"
                className="t-stamp pressable inline-flex items-center gap-2 bg-ink px-5 py-4 text-stone hover:bg-moss"
              >
                See my work <ArrowDown />
              </Link>
              <Link
                href="#contact"
                className="t-stamp pressable inline-flex items-center gap-2 border border-ink px-5 py-4 hover:bg-ink hover:text-stone"
              >
                Contact me
              </Link>
              <a
                href={site.cv.href}
                download
                className="t-stamp pressable inline-flex items-center gap-2 border border-ink px-5 py-4 hover:bg-ink hover:text-stone"
              >
                <DownloadIcon /> {site.cv.label}
                <span className="sr-only"> ({site.cv.size})</span>
              </a>
            </div>
          </div>

          <figure className="md:col-span-5 lg:col-span-4">
            <div className="border border-ink">
              <MediaImage
                image="photos/portrait-mono"
                alt="Portrait of Asiful Hasan Khan in a grey suit"
                sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 40vw, 100vw"
                priority
                className="block h-auto w-full"
              />
            </div>
            <dl className="mt-4 divide-y divide-rule border-b border-rule">
              {[
                ["Name", site.name],
                ["Based in", site.location],
                ["Studying", "BSc CSE, Leading University (2027)"],
                ["Looking for", "Software and UI/UX roles"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2.5">
                  <dt className="t-stamp pt-0.5 text-muted">{k}</dt>
                  <dd className="t-body-sm">{v}</dd>
                </div>
              ))}
            </dl>
          </figure>
        </div>
      </section>

      {/* What I do */}
      <section className="page-x pb-24 md:pb-32" aria-labelledby="skills-title">
        <SectionHead index="01" label="Skills" title="What I do" id="skills-title" />
        <ul className="grid border-l border-rule sm:grid-cols-2 xl:grid-cols-4">
          {disciplines.map((d, i) => (
            <li key={d.title} className="flex flex-col border-r border-b border-rule p-6">
              <p className="t-stamp text-muted">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="t-subtitle mt-6">{d.title}</h3>
              <p className="t-body-sm mt-3 text-ink-soft">{d.body}</p>
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
                {d.tags.map((t) => (
                  <li key={t} className="t-stamp border border-rule bg-stone-deep px-2 py-1 text-moss">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* Selected work */}
      <section id="work" className="page-x pb-24 md:pb-32" aria-labelledby="work-title">
        <SectionHead index="02" label="Projects" title="Selected work" id="work-title">
          Two web apps I built on my own, a company website I designed and built, and interface designs for client
          websites.
        </SectionHead>
        <ol>
          {projects.map((p, i) => (
            <li key={p.slug} className="border-b border-rule">
              <Link
                href={`/work/${p.slug}`}
                className="group grid gap-5 py-7 transition-colors duration-100 active:bg-stone-deep md:grid-cols-12 md:items-center md:gap-6"
              >
                <span className="t-stamp text-muted md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="md:col-span-6">
                  <span className="t-title block transition-colors duration-150 group-hover:text-moss">
                    {p.title}
                  </span>
                  <span className="t-body-sm mt-2 block text-ink-soft">{p.summary}</span>
                </span>
                <span className="flex flex-wrap gap-x-4 gap-y-1 md:col-span-2 md:flex-col">
                  <span className="t-stamp text-moss">{p.kind}</span>
                  {p.year && <span className="t-stamp text-muted">{p.year}</span>}
                </span>
                <span className="relative md:col-span-3">
                  <span className="block overflow-hidden border border-rule transition-colors duration-150 group-hover:border-ink">
                    <MediaImage
                      image={p.cover}
                      alt=""
                      sizes="(min-width: 48rem) 25vw, 100vw"
                      className="block aspect-[16/10] h-auto w-full object-cover object-top"
                    />
                  </span>
                  <span className="t-stamp mt-2 inline-flex items-center gap-1.5 md:hidden">
                    View project <ArrowRight />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <p className="t-stamp text-muted">Also on GitHub</p>
          <ul className="mt-3 border-t border-rule">
            {otherProjects.map((p) => (
              <li key={p.title} className="border-b border-rule">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-3 py-5 active:bg-stone-deep md:grid-cols-12 md:items-baseline md:gap-6"
                >
                  <span className="t-subtitle md:col-span-3 group-hover:text-moss">{p.title}</span>
                  <span className="t-body-sm text-ink-soft md:col-span-6">{p.summary}</span>
                  <span className="t-stamp inline-flex items-center gap-1.5 text-muted md:col-span-3 md:justify-end">
                    {p.stack.join(" · ")} · {p.year} <ArrowUpRight />
                    <span className="sr-only">(opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Graphic design */}
      <section id="design" className="page-x pb-24 md:pb-32" aria-labelledby="design-title">
        <SectionHead index="03" label="Graphic design" title="Posters, ads and social posts" id="design-title">
          I generate the imagery with AI tools, then do the composition, type and branding myself. Tap any piece to see
          it larger.
        </SectionHead>
        <div className="mt-8">
          <DesignGallery entries={galleryEntries} categories={galleryCategories} />
        </div>
      </section>

      {/* AI data work */}
      <section id="ai-data" className="bg-carbon text-carbon-text" aria-labelledby="ai-title">
        <div className="page-x py-24 md:py-32">
          <SectionHead index="04" label="AI data work" title="Training data projects" id="ai-title" inverted>
            Short-term, project-based work preparing data used to train AI models. All three projects are finished.
          </SectionHead>
          <ol className="grid md:grid-cols-3">
            {aiDataWork.map((w) => (
              <li
                key={w.org}
                className="flex flex-col border-b border-carbon-rule py-8 md:border-r md:border-b-0 md:px-6 md:first:pl-0 md:last:border-r-0"
              >
                <p className="t-stamp text-mint">{w.period}</p>
                <h3 className="t-title mt-5">{w.title}</h3>
                <p className="t-label mt-2 text-carbon-muted">{w.org}</p>
                <p className="t-body-sm mt-5 text-carbon-muted">{w.body}</p>
                <dl className="mt-auto grid grid-cols-[6rem_1fr] gap-y-2 pt-8">
                  <dt className="t-stamp text-carbon-muted">Platform</dt>
                  <dd className="t-stamp">{w.platform}</dd>
                  <dt className="t-stamp text-carbon-muted">Status</dt>
                  <dd className="t-stamp">{w.status}</dd>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="page-x py-24 md:py-32" aria-labelledby="experience-title">
        <SectionHead index="05" label="Background" title="Experience and education" id="experience-title" />
        <div className="grid gap-16 pt-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h3 className="t-stamp text-muted">Work</h3>
            <ol className="mt-4">
              {jobs.map((j) => (
                <li key={j.org} className="border-t border-rule py-8">
                  <p className="t-stamp text-moss">{j.period}</p>
                  <h4 className="t-title mt-3">{j.title}</h4>
                  <p className="t-label mt-2 text-ink-soft">{j.org}</p>
                  <ul className="mt-5 space-y-2.5">
                    {j.points.map((pt) => (
                      <li key={pt} className="t-body-sm grid grid-cols-[1rem_1fr] text-ink-soft">
                        <span aria-hidden className="text-muted">
                          –
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-14 lg:col-span-4 lg:col-start-9">
            <div>
              <h3 className="t-stamp text-muted">Education</h3>
              <ol className="mt-4">
                {education.map((e) => (
                  <li key={e.title} className="border-t border-rule py-5">
                    <p className="t-stamp text-moss">{e.period}</p>
                    <p className="t-subtitle mt-2">{e.title}</p>
                    <p className="t-body-sm mt-1 text-ink-soft">
                      {e.org} · {e.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="t-stamp text-muted">Tools</h3>
              <dl className="mt-4 border-b border-rule">
                {toolGroups.map((g) => (
                  <div key={g.label} className="grid grid-cols-[7.5rem_1fr] gap-3 border-t border-rule py-3">
                    <dt className="t-stamp pt-0.5 text-muted">{g.label}</dt>
                    <dd className="t-body-sm">{g.items.join(", ")}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/ai-tools" className="t-stamp group mt-4 inline-flex items-center gap-1.5 hover:text-moss">
                See the AI tools page
                <ArrowRight className="transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
            </div>
            <div>
              <h3 className="t-stamp text-muted">Languages</h3>
              <p className="t-body-sm mt-4 border-t border-rule pt-3">{languages.join(", ")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-carbon text-carbon-text" aria-labelledby="contact-title">
        <div className="page-x grid gap-14 py-24 md:py-32 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="t-stamp text-mint">06 · Contact</p>
            <h2 id="contact-title" className="t-display-lg mt-4">
              Let&apos;s talk.
            </h2>
            <p className="t-body-lg mt-6 max-w-lg text-carbon-muted">
              If you&apos;d like to talk about a role or a project, send me an email or a message. I&apos;m based in
              Sylhet, Bangladesh (GMT+6).
            </p>
            <a
              href={`mailto:${site.email}`}
              className="t-headline mt-10 inline-block break-all underline decoration-carbon-rule decoration-1 underline-offset-8 transition-colors duration-150 hover:text-mint hover:decoration-mint"
            >
              {site.email}
            </a>
            <div className="mt-10">
              <a
                href={site.cv.href}
                download
                className="t-stamp pressable inline-flex items-center gap-2 bg-stone px-5 py-4 text-ink hover:bg-mint"
              >
                <DownloadIcon /> {site.cv.label}
              </a>
              <span className="t-stamp ml-4 text-carbon-muted">{site.cv.size}</span>
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <dl className="border-b border-carbon-rule">
              <div className="grid grid-cols-[7.5rem_1fr] gap-3 border-t border-carbon-rule py-3">
                <dt className="t-stamp pt-0.5 text-carbon-muted">Phone</dt>
                <dd>
                  <a href={site.phone.href} className="t-body-sm hover:text-mint">
                    {site.phone.display}
                  </a>
                </dd>
              </div>
              <div className="grid grid-cols-[7.5rem_1fr] gap-3 border-t border-carbon-rule py-3">
                <dt className="t-stamp pt-0.5 text-carbon-muted">WhatsApp</dt>
                <dd>
                  <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="t-body-sm hover:text-mint">
                    Message me
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
              {socials.map((s) => (
                <div key={s.label} className="grid grid-cols-[7.5rem_1fr] gap-3 border-t border-carbon-rule py-3">
                  <dt className="t-stamp pt-0.5 text-carbon-muted">{s.label}</dt>
                  <dd>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-body-sm inline-flex items-center gap-1.5 hover:text-mint"
                    >
                      {s.handle} <ArrowUpRight />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
}
