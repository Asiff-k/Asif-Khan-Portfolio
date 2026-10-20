import Link from "next/link";
import { DesignGallery, type GalleryEntry } from "@/components/design-gallery";
import { DesignShowcase } from "@/components/design-showcase";
import { ArrowDown, ArrowRight, DownloadIcon } from "@/components/icons";
import { PageMotion } from "@/components/cinema/page-motion";
import { Tilt } from "@/components/cinema/tilt";
import { ToolLoop } from "@/components/cinema/tool-loop";
import { LogoMark } from "@/components/logo-mark";
import { MediaImage } from "@/components/media-image";
import { SectionHead } from "@/components/section-head";
import { StockCredit, StockImage } from "@/components/stock-image";
import { WorkMenu } from "@/components/work-menu";
import { aiDataWork, education, jobs, languages, skills, toolGroups } from "@/content/experience";
import { gallery, galleryCategories } from "@/content/gallery";
import type { LogoKey } from "@/content/logos.generated";
import { media } from "@/content/media.generated";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import type { StockKey } from "@/content/stock";
import { tools } from "@/content/tools";

type Area = {
  title: string;
  body: string[];
  evidence: { label: string; href: string }[];
  visual:
    | { kind: "screens"; photos: StockKey[] }
    | { kind: "posters"; photos: StockKey[] }
    | { kind: "logos"; logos: { logo?: LogoKey; name: string; href?: string }[] };
};

// The four areas of work. Each is backed by real projects on this site, and the
// research, communication and leadership story is told inside the areas it belongs to.
const areas: Area[] = [
  {
    title: "Software development",
    body: [
      "Fullstack development, frontend and backend. I build web apps from scratch: Chol Ghuri matches university students into travel groups and splits the costs; CareerNavigator recommends careers from a student's skills and projects. Both run on PHP, MySQL and JavaScript, with accounts, email verification and admin panels.",
      "I also designed and coded incodet.com, the website of the software company Incodet, from scratch, and I build Flutter apps.",
    ],
    evidence: [
      { label: "Chol Ghuri", href: "/work/chol-ghuri" },
      { label: "CareerNavigator", href: "/work/careernavigator" },
      { label: "incodet.com", href: "/work/incodet" },
    ],
    visual: {
      kind: "screens",
      photos: ["software-dashboard", "software-code"],
    },
  },
  {
    title: "UI/UX design",
    body: [
      "I design web and app interfaces in Figma, from wireframes to final screens. With Incodet I designed the UI for two client projects, the Cipher Shield and KI Training websites, and I designed the NextGen Production website.",
      "At NextGen Production I worked as a Product Designer, on graphics and UI/UX, and moved up to Team Leader: setting daily priorities, assigning work and keeping delivery on schedule.",
    ],
    evidence: [
      { label: "Cipher Shield", href: "/work/cipher-shield" },
      { label: "KI Training", href: "/work/ki-training" },
      { label: "NextGen Production", href: "/work/nextgen-production" },
    ],
    visual: {
      kind: "screens",
      photos: ["uiux-tablet-wireframe", "uiux-sketch-wireframes"],
    },
  },
  {
    title: "Graphic design",
    body: [
      "Posters, product ads, social posts and T-shirt art. I take ideas from AI for inspiration, then design every piece myself in Canva.",
    ],
    evidence: [{ label: "See all 54 pieces", href: "#design" }],
    visual: {
      kind: "posters",
      photos: ["graphic-framed-poster", "graphic-type-poster", "graphic-colour-posters", "graphic-magazine"],
    },
  },
  {
    title: "AI tools and data",
    body: [
      "AI/ML knowledge and hands-on work training AI models: I've completed three AI training data projects, in robot video segmentation, satellite image annotation and first-person video capture.",
      "I work with AI tools daily to save time: Perplexity and Gemini Notebook for research, Claude for code, Google Stitch for interface design, and HeyGen, Synthesia and Colossyan for video.",
    ],
    evidence: [
      { label: "AI tools", href: "/ai-tools" },
      { label: "AI data projects", href: "#ai-data" },
    ],
    visual: {
      kind: "logos",
      logos: [
        ...tools.filter((t) => t.status === "used"),
        ...tools.filter((t) => t.status === "platform" && t.logo),
      ].map((t) => ({ logo: t.logo, name: t.name, href: t.href.startsWith("http") ? t.href : undefined })),
    },
  },
];

// Tools named in the AI data band, design tools first. Only names that appear in
// the CV tool groups are used; platforms (Atlas Capture, Ginger 2025) are not tools.
const loopTools = [
  "Figma",
  "Canva",
  "Claude",
  "Google Stitch",
  "Perplexity",
  "Gemini Notebook",
  "HeyGen",
  "Synthesia",
  "Colossyan",
  "Next.js",
  "Tailwind CSS",
].filter((t) => toolGroups.some((g) => (g.items as readonly string[]).includes(t)));

const galleryEntries: GalleryEntry[] = gallery.map((g) => ({
  ...media[g.image],
  title: g.title,
  category: g.category,
  meta: g.category,
}));

export default function Home() {
  return (
    <main id="main" data-home>
      {/* Intro */}
      <section className="page-x pt-10 pb-10 md:pt-16 md:pb-12" aria-labelledby="intro-title">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7 lg:col-span-8">
            <p className="t-stamp text-accent">Software · UI/UX · Graphic design</p>
            <h1 id="intro-title" data-hero-title className="t-hero mt-6 text-balance">
              I build the software and design the screens.
            </h1>
            <p className="t-body-lg mt-8 max-w-xl text-fg-soft">
              Fullstack developer (web and app) and UI/UX designer with hands-on AI/ML experience.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="#work"
                className="t-stamp pressable inline-flex items-center gap-2 bg-fg px-5 py-4 text-on-fg hover:bg-fg-soft"
              >
                See my work <ArrowDown />
              </Link>
              <Link
                href="#contact"
                className="t-stamp pressable inline-flex items-center gap-2 border border-line-strong px-5 py-4 hover:bg-fg hover:text-on-fg"
              >
                Contact me
              </Link>
              <a
                href={site.cv.href}
                download
                className="t-stamp pressable inline-flex items-center gap-2 border border-line-strong px-5 py-4 hover:bg-fg hover:text-on-fg"
              >
                <DownloadIcon /> {site.cv.label}
                <span className="sr-only"> ({site.cv.size})</span>
              </a>
            </div>
          </div>

          <figure className="md:col-span-5 lg:col-span-4">
            <div className="overflow-hidden border border-line-strong">
              <MediaImage
                image="photos/asif-portrait"
                alt="Portrait of Asiful Hasan Khan in a sage green three-piece suit, outdoors"
                sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 40vw, 100vw"
                priority
                className="block h-auto w-full"
              />
            </div>
            <dl className="mt-4 divide-y divide-line border-b border-line">
              {[
                ["Name", site.name],
                ["Based in", site.location],
                ["Studying", "BSc CSE, Leading University (2027)"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2.5">
                  <dt className="t-stamp pt-0.5 text-fg-muted">{k}</dt>
                  <dd className="t-body-sm">{v}</dd>
                </div>
              ))}
            </dl>
          </figure>
        </div>
      </section>

      {/* What I do */}
      <section className="page-x pt-10 pb-24 md:pt-12 md:pb-32" aria-labelledby="skills-title">
        <SectionHead index="01" label="Skills" title="What I do" id="skills-title">
          My process: I use AI to save time and for design ideas, then design and build everything myself, in
          Canva and in code.
        </SectionHead>
        <ol>
          {areas.map((a, i) => (
            <li
              key={a.title}
              data-area={a.title}
              className="grid gap-8 border-b border-line py-12 md:py-14 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-4">
                <p className="t-stamp text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="t-headline mt-3">{a.title}</h3>
                <div className="mt-5 max-w-xl space-y-3">
                  {a.body.map((para) => (
                    <p key={para} className="t-body-sm text-fg-soft">
                      {para}
                    </p>
                  ))}
                </div>
                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2" aria-label={`${a.title}: related work`}>
                  {a.evidence.map((e) => (
                    <li key={e.href}>
                      <Link
                        href={e.href}
                        className="t-stamp group inline-flex items-center gap-1.5 text-fg hover:text-accent"
                      >
                        {e.label}
                        <ArrowRight className="transition-transform duration-150 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-8">
                <AreaVisual visual={a.visual} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Selected work */}
      <section id="work" className="page-x py-24 md:py-32" aria-labelledby="work-title">
        <SectionHead index="02" label="Projects" title="Selected work" id="work-title">
          Two web apps I built on my own, a company website I designed and coded from scratch, and interface designs
          for client websites.
        </SectionHead>
        {/* Mouse and wide screens: Flowing Menu. Touch and narrow screens: the list below. */}
        <div className="fm-only fm-work font-display" data-cursor="View" style={{ height: `${projects.length * 7.5}rem` }}>
          <WorkMenu
            items={projects.map((p) => ({
              text: p.title,
              link: `/work/${p.slug}`,
              image: `/_next/image?url=${encodeURIComponent(media[p.cover].src)}&w=640&q=75`,
              meta: [p.kind, p.year].filter(Boolean).join(" · "),
            }))}
          />
        </div>
        <ol className="fm-fallback">
          {projects.map((p, i) => (
            <li key={p.slug} className="border-b border-line">
              <Link
                href={`/work/${p.slug}`}
                className="group grid grid-cols-1 gap-5 py-7 transition-colors duration-100 active:bg-surface md:grid-cols-12 md:items-center md:gap-6"
              >
                <span className="t-stamp text-fg-muted md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 md:col-span-6">
                  <span className="t-title block transition-colors duration-150 group-hover:text-accent">
                    {p.title}
                  </span>
                  <span className="t-body-sm mt-2 block truncate text-fg-soft">{p.summary}</span>
                </span>
                <span className="flex flex-wrap gap-x-4 gap-y-1 md:col-span-2 md:flex-col">
                  <span className="t-stamp text-accent">{p.kind}</span>
                  {p.year && <span className="t-stamp text-fg-muted">{p.year}</span>}
                </span>
                <span className="relative md:col-span-3">
                  <span className="block overflow-hidden border border-line transition-colors duration-150 group-hover:border-line-strong">
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
      </section>

      {/* Graphic design */}
      <section id="design" className="page-x py-24 md:py-32" aria-labelledby="design-title">
        <SectionHead index="03" label="Graphic design" title="Posters, ads and social posts" id="design-title">
          I use AI as a tool for inspiration and efficiency, but every design and build is my own work. Tap any piece
          to see it larger.
        </SectionHead>
        <div className="mt-8">
          <DesignShowcase
            pieces={galleryEntries.map((e) => ({ src: e.src, title: e.title }))}
            grid={<DesignGallery entries={galleryEntries} categories={galleryCategories} />}
          />
        </div>
      </section>

      {/* AI data work */}
      <section id="ai-data" aria-labelledby="ai-title">
        <div aria-hidden className="overflow-hidden pt-16 md:pt-24">
          <ToolLoop tools={loopTools} />
        </div>
        <div className="page-x pt-10 pb-24 md:pt-16 md:pb-32">
          <SectionHead index="04" label="AI data work" title="Training data projects" id="ai-title">
            Short-term, project-based work preparing data used to train AI models. All three projects are finished.
          </SectionHead>
          <ul className="sr-only" aria-label="Tools I use">
            {loopTools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <ol data-reveal-group className="grid md:grid-cols-3">
            {aiDataWork.map((w) => (
              <li
                key={w.org}
                data-reveal="item"
                className="border-b border-line md:border-r md:border-b-0 md:last:border-r-0"
              >
                <Tilt className="flex h-full flex-col py-8 md:px-6 md:[li:first-child_&]:pl-0">
                  <p className="t-stamp text-accent">{w.period}</p>
                  <h3 className="t-title mt-5">{w.title}</h3>
                  <p className="t-label mt-2 text-fg-muted">{w.org}</p>
                  <p className="t-body-sm mt-5 text-fg-muted">{w.body}</p>
                  <dl className="mt-auto grid grid-cols-[6rem_1fr] gap-y-2 pt-8">
                    <dt className="t-stamp text-fg-muted">Platform</dt>
                    <dd className="t-stamp">{w.platform}</dd>
                    <dt className="t-stamp text-fg-muted">Status</dt>
                    <dd className="t-stamp">{w.status}</dd>
                  </dl>
                </Tilt>
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
            <h3 className="t-stamp text-fg-muted">Work</h3>
            <div data-draw-root className="relative mt-4 pl-6 md:pl-8">
              <svg
                aria-hidden
                className="absolute top-0 left-0 h-full w-0.5 overflow-visible text-accent"
                viewBox="0 0 2 100"
                preserveAspectRatio="none"
              >
                <path data-draw d="M1 0V100" pathLength={1} stroke="currentColor" strokeWidth={2} fill="none" />
              </svg>
              <ol data-reveal-group>
                {jobs.map((j) => (
                  <li key={j.org} data-reveal="item" className="border-t border-line py-8">
                    <p className="t-stamp text-accent">{j.period}</p>
                    <h4 className="t-title mt-3">{j.title}</h4>
                    <p className="t-label mt-2 text-fg-soft">{j.org}</p>
                    <ul className="mt-5 space-y-2.5">
                      {j.points.map((pt) => (
                        <li key={pt} className="t-body-sm grid grid-cols-[1rem_1fr] text-fg-soft">
                          <span aria-hidden className="text-fg-muted">
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
          </div>

          <div className="space-y-14 lg:col-span-4 lg:col-start-9">
            <div>
              <h3 className="t-stamp text-fg-muted">Skills</h3>
              <ul className="mt-4 border-t border-line">
                {skills.map((sk) => (
                  <li key={sk} className="t-body-sm border-b border-line py-2.5">
                    {sk}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="t-stamp text-fg-muted">Education</h3>
              <ol className="mt-4">
                {education.map((e) => (
                  <li key={e.title} className="border-t border-line py-5">
                    <p className="t-stamp text-accent">{e.period}</p>
                    <p className="t-subtitle mt-2">{e.title}</p>
                    <p className="t-body-sm mt-1 text-fg-soft">
                      {e.org} · {e.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="t-stamp text-fg-muted">Tools</h3>
              <dl className="mt-4 border-b border-line">
                {toolGroups.map((g) => (
                  <div key={g.label} className="grid grid-cols-[7.5rem_1fr] gap-3 border-t border-line py-3">
                    <dt className="t-stamp pt-0.5 text-fg-muted">{g.label}</dt>
                    <dd className="t-body-sm">{g.items.join(", ")}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/ai-tools" className="t-stamp group mt-4 inline-flex items-center gap-1.5 hover:text-accent">
                See the AI tools page
                <ArrowRight className="transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
            </div>
            <div>
              <h3 className="t-stamp text-fg-muted">Languages</h3>
              <p className="t-body-sm mt-4 border-t border-line pt-3">{languages.join(", ")}</p>
            </div>
          </div>
        </div>
      </section>

      <PageMotion />
    </main>
  );
}

function AreaVisual({ visual }: { visual: Area["visual"] }) {
  if (visual.kind === "screens") {
    return (
      <div>
        <div className="grid gap-4 sm:grid-cols-2">
          {visual.photos.map((ph) => (
            <Tilt key={ph}>
              <div data-reveal="image" className="aspect-[16/10] overflow-hidden border border-line bg-surface">
                <StockImage photo={ph} sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 50vw, 100vw" />
              </div>
            </Tilt>
          ))}
        </div>
        <StockCredit photos={visual.photos} />
      </div>
    );
  }
  if (visual.kind === "posters") {
    return (
      <div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {visual.photos.map((ph) => (
            <div key={ph} data-reveal="image" className="aspect-[3/4] overflow-hidden border border-line bg-surface">
              <StockImage photo={ph} sizes="(min-width: 64rem) 15vw, (min-width: 40rem) 25vw, 50vw" />
            </div>
          ))}
        </div>
        <StockCredit photos={visual.photos} />
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-3 gap-x-3 gap-y-6 py-4 sm:grid-cols-4 md:grid-cols-6" aria-label="AI tools and platforms">
      {visual.logos.map((l) => {
        const inner = (
          <>
            <LogoMark logo={l.logo} name={l.name} size="lg" />
            <span className="text-[0.75rem] leading-tight text-fg-soft">{l.name}</span>
          </>
        );
        return (
          <li key={l.name} className="flex justify-center">
            {l.href ? (
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 text-center"
              >
                {inner}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <span className="group flex flex-col items-center gap-2 text-center">{inner}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
