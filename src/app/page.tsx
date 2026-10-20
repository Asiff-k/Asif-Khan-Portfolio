import Link from "next/link";
import { AboutStatement } from "@/components/about-statement";
import { DesignGallery, type GalleryEntry } from "@/components/design-gallery";
import { DesignShowcase } from "@/components/design-showcase";
import { ArrowDown, DownloadIcon } from "@/components/icons";
import { PageMotion } from "@/components/cinema/page-motion";
import { LogoMark } from "@/components/logo-mark";
import { MediaImage } from "@/components/media-image";
import { SectionHead } from "@/components/section-head";
import { ServicePanels, type Panel } from "@/components/service-panels";
import { StatsRow } from "@/components/stats-row";
import { ToolWall } from "@/components/tool-wall";
import { WorkCarousel } from "@/components/work-carousel";
import { aiDataWork, education, jobs, languages, skills, toolGroups } from "@/content/experience";
import { gallery, galleryCategories } from "@/content/gallery";
import { media } from "@/content/media.generated";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { tools } from "@/content/tools";

const toolByName = (name: string) => tools.find((t) => t.name === name);

// "What I do" as four stacked service panels. Images are Asif's own work only.
const panels: Panel[] = [
  {
    title: "Software development",
    line: "Fullstack web apps, frontend and backend, built from scratch.",
    detail:
      "Chol Ghuri matches university students into travel groups and splits the costs; CareerNavigator recommends careers from a student's skills and projects. Both run on PHP, MySQL and JavaScript, with accounts, email verification and admin panels. I also designed and coded incodet.com from scratch, and I build Flutter apps.",
    color: "#121316",
    button: { label: "See the projects", href: "#work" },
    links: [
      { label: "Chol Ghuri", href: "/work/chol-ghuri" },
      { label: "CareerNavigator", href: "/work/careernavigator" },
      { label: "incodet.com", href: "/work/incodet" },
    ],
    images: [
      { image: "apps/chol-ghuri-matching", alt: "Chol Ghuri: group matching with the score explained", href: "/work/chol-ghuri" },
      { image: "apps/careernavigator-matches", alt: "CareerNavigator: career matches with weighted scores", href: "/work/careernavigator" },
      { image: "apps/incodet-home", alt: "incodet.com home page", href: "/work/incodet" },
      { image: "apps/careernavigator-roadmap", alt: "CareerNavigator: skill gap and roadmap", href: "/work/careernavigator" },
    ],
  },
  {
    title: "UI/UX design",
    line: "Web and app interfaces in Figma, from wireframes to final screens.",
    detail:
      "With Incodet I designed the UI for two client projects, the Cipher Shield and KI Training websites. At NextGen Production I worked as a Product Designer, on graphics and UI/UX, moved up to Team Leader, and designed the NextGen Production website.",
    color: "#1f3a5f",
    button: { label: "View the designs", href: "/work/cipher-shield" },
    links: [
      { label: "Cipher Shield", href: "/work/cipher-shield" },
      { label: "KI Training", href: "/work/ki-training" },
      { label: "BRHEX Studio", href: "/work/brhex-studio" },
      { label: "NextGen Production", href: "/work/nextgen-production" },
    ],
    images: [
      { image: "ui/cipher-shield-cover", alt: "Cipher Shield home page design", href: "/work/cipher-shield" },
      { image: "ui/ki-training-cover", alt: "KI Training home page design", href: "/work/ki-training" },
      { image: "ui/brhex-hero", alt: "BRHEX Studio home page design", href: "/work/brhex-studio" },
      { image: "ui/nextgen-production-cover", alt: "NextGen Production home page design", href: "/work/nextgen-production" },
    ],
  },
  {
    title: "Graphic design",
    line: "Posters, product ads, social posts and T-shirt art.",
    detail: `Composition, type and branding, designed in Canva. All ${gallery.length} pieces are in the gallery below, filterable by category.`,
    color: "#d9481f",
    innerDark: true,
    button: { label: `See all ${gallery.length} pieces`, href: "#design" },
    links: [],
    images: [
      { image: "graphics/pasta-yum", alt: "Pasta poster: Yum!", href: "#design", tall: true },
      { image: "graphics/can-blueberry-fusion", alt: "Can design: Blueberry Fusion", href: "#design", tall: true },
      { image: "graphics/watch-hour-unit", alt: "Watch product ad", href: "#design", tall: true },
      { image: "graphics/tee-wild", alt: "T-shirt art: Wild", href: "#design", tall: true },
    ],
  },
  {
    title: "AI data and models",
    line: "Hands-on AI/ML work: preparing the data AI models are trained on.",
    detail:
      "Three completed AI training data projects: robot video segmentation, satellite image annotation and first-person video capture.",
    color: "#3f2bb8",
    button: { label: "The data projects", href: "#ai-data" },
    links: [{ label: "AI tools page", href: "/ai-tools" }],
    cards: aiDataWork.map((w) => ({ title: w.title, meta: `${w.org} · ${w.period}`, logo: toolByName(w.platform)?.logo })),
  },
];

const carousel = projects.map((p) => ({
  href: `/work/${p.slug}`,
  title: p.title,
  line: p.summary,
  kind: [p.kind, p.year].filter(Boolean).join(" · "),
  image: `/_next/image?url=${encodeURIComponent(media[p.cover].src)}&w=828&q=75`,
  alt: "",
}));

// Every number is counted from the content data.
const stats = [
  { value: gallery.length, label: "Design pieces in the gallery", icon: "grid" as const },
  { value: projects.length, label: "Projects on this site", icon: "folder" as const },
  { value: projects.filter((p) => p.kind === "UI design").length, label: "Website interfaces designed", icon: "browser" as const },
  { value: aiDataWork.length, label: "AI training data projects", icon: "spark" as const },
];

// The tool wall: the tools Asif uses plus the AI data platforms with a verified logo.
const wall = [...tools.filter((t) => t.status === "used"), ...tools.filter((t) => t.status === "platform" && t.logo)].map((t) => ({
  name: t.name,
  logo: t.logo,
  href: t.href.startsWith("http") ? t.href : undefined,
}));

const galleryEntries: GalleryEntry[] = gallery.map((g) => ({
  ...media[g.image],
  title: g.title,
  category: g.category,
  meta: g.category,
}));

const job = (org: string) => jobs.find((j) => j.org === org)!;

export default function Home() {
  const incodet = job("Incodet");
  const nextgen = job("NextGen Production");
  const codesoft = job("CodeSoft");
  return (
    <main id="main" data-home>
      {/* Intro */}
      <section className="page-x pt-10 pb-10 md:pt-16 md:pb-12" aria-labelledby="intro-title">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7 lg:col-span-8">
            <p className="pill-badge">Software · UI/UX · Graphic design</p>
            <h1 id="intro-title" data-hero-title className="t-hero mt-6 text-balance">
              I build the software and design the screens.
            </h1>
            <p className="t-body-lg mt-8 max-w-xl text-fg-soft">
              Fullstack developer (web and app) and UI/UX designer with hands-on AI/ML experience.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="#work" className="btn-primary">
                See my work <ArrowDown />
              </Link>
              <Link href="#contact" className="btn-secondary">
                Contact me
              </Link>
              <a href={site.cv.href} download className="btn-secondary">
                <DownloadIcon /> {site.cv.label}
                <span className="sr-only"> ({site.cv.size})</span>
              </a>
            </div>
          </div>

          <figure className="md:col-span-5 lg:col-span-4">
            <div className="overflow-hidden rounded-card border border-line shadow-[0_10px_30px_rgb(18_19_22/0.06)]">
              <MediaImage
                image="photos/asif-portrait"
                alt="Portrait of Asiful Hasan Khan in a sage green three-piece suit, outdoors"
                sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 40vw, 100vw"
                priority
                className="block h-auto w-full"
              />
            </div>
            <dl className="card mt-4 divide-y divide-line px-5 py-1">
              {[
                ["Name", site.name],
                ["Based in", site.location],
                ["Studying", "BSc CSE, Leading University (2027)"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 py-2.5">
                  <dt className="pt-0.5 text-[0.8125rem] text-fg-muted">{k}</dt>
                  <dd className="t-body-sm">{v}</dd>
                </div>
              ))}
            </dl>
          </figure>
        </div>
      </section>

      {/* What I do */}
      <section className="page-x pt-10 pb-16 md:pt-12 md:pb-24" aria-labelledby="skills-title">
        <SectionHead index="01" label="Skills" title="What I do" id="skills-title">
          I use AI for ideas and to save time; the design and the build are my own work.
        </SectionHead>
        <ServicePanels panels={panels} />
      </section>

      {/* Selected work */}
      <section id="work" className="page-x py-16 md:py-24" aria-labelledby="work-title">
        <div className="mx-auto max-w-2xl text-center">
          <p className="pill-badge" data-reveal="fade">
            <span className="font-mono text-[0.6875rem] text-fg-muted">02</span> Projects
          </p>
          <h2 id="work-title" data-reveal="heading" className="t-display-lg mt-5">
            Selected work
          </h2>
          <p className="t-body-lg mt-5 text-fg-soft" data-reveal="fade">
            Two web apps I built on my own, a company website I designed and coded from scratch, and interface designs
            for client websites.
          </p>
        </div>
        <div className="mt-10">
          <WorkCarousel items={carousel} />
        </div>
      </section>

      {/* About statement and numbers */}
      <section className="page-x py-16 md:py-24" aria-label="About me">
        <AboutStatement
          text="I'm a fullstack developer and UI/UX designer. I interned in web development at CodeSoft, then worked on product design, graphics and interfaces at NextGen Production, where I became Team Leader. I designed and built Incodet's website end to end, and designed websites for Cipher Shield, KI Training and NextGen. I also train AI models and work with AI/ML."
          stickers={[
            { text: "Product design", color: "#cf4419", tilt: -6, cue: "product design", side: "left", at: 0.42 },
            { text: "UI/UX design", color: "#1f3a5f", tilt: 5, cue: "UI/UX designer", side: "right", at: 0.3 },
            { text: "Web developer", color: "#121316", tilt: 7, cue: "fullstack developer", side: "left", at: 0.02 },
            { text: "App developer", color: "#3f2bb8", tilt: -5, cue: "fullstack developer", side: "right", at: 0.06 },
            { text: "AI/ML", color: "#121316", tilt: -8, cue: "AI/ML", side: "right", at: 0.84 },
            { text: "AI training", color: "#cf4419", tilt: 6, cue: "train AI models", side: "left", at: 0.8 },
          ]}
        />
        <div className="mt-16 md:mt-24">
          <StatsRow stats={stats} />
        </div>
      </section>

      {/* Graphic design */}
      <section id="design" className="page-x py-16 md:py-24" aria-labelledby="design-title">
        <SectionHead index="03" label="Graphic design" title="Posters, ads and social posts" id="design-title">
          Drag the dome, or browse every piece in the grid below. Tap any piece to see it whole.
        </SectionHead>
        <div className="mt-2">
          <DesignShowcase
            pieces={galleryEntries.map((e) => ({ src: e.src, title: e.title }))}
            grid={<DesignGallery entries={galleryEntries} categories={galleryCategories} />}
          />
        </div>
      </section>

      {/* AI tools and data */}
      <section id="ai-data" className="page-x py-16 md:py-24" aria-labelledby="ai-title">
        <div className="mx-auto max-w-2xl text-center">
          <p className="pill-badge" data-reveal="fade">
            <span className="font-mono text-[0.6875rem] text-fg-muted">04</span> AI tools and data
          </p>
          <h2 id="ai-title" data-reveal="heading" className="t-display-lg mt-5">
            The tools I work with
          </h2>
        </div>
        <div className="mt-24">
          <ToolWall tools={wall} caption="Tools I use every week" />
        </div>

        <h3 className="t-headline mt-24 text-center" data-reveal="fade">
          Training data projects
        </h3>
        <p className="t-body-lg mx-auto mt-3 max-w-xl text-center text-fg-soft" data-reveal="fade">
          Short-term, project-based work preparing data used to train AI models. All three projects are finished.
        </p>
        <ol data-reveal-group className="mt-10 grid gap-4 md:grid-cols-3">
          {aiDataWork.map((w) => {
            const logo = toolByName(w.platform)?.logo;
            return (
              <li key={w.org} data-reveal="item" className="card card-lift flex flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="pill-badge !text-[0.75rem]">{w.period}</span>
                  {logo && <LogoMark logo={logo} name={w.platform} size="sm" />}
                </div>
                <h4 className="t-title mt-6">{w.title}</h4>
                <p className="mt-1 text-[0.875rem] text-fg-muted">{w.org}</p>
                <p className="t-body-sm mt-4 text-fg-soft">{w.body}</p>
                <dl className="mt-auto grid grid-cols-[5.5rem_1fr] gap-y-1.5 pt-6 text-[0.8125rem]">
                  <dt className="text-fg-muted">Platform</dt>
                  <dd>{w.platform}</dd>
                  <dt className="text-fg-muted">Status</dt>
                  <dd>{w.status}</dd>
                </dl>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Experience: bento */}
      <section id="experience" className="page-x py-16 md:py-24" aria-labelledby="experience-title">
        <SectionHead index="05" label="Background" title="Experience and education" id="experience-title" />
        <ul data-reveal-group className="grid gap-4 md:grid-cols-6">
          <li data-reveal="item" className="rounded-card bg-[#e7eef7] p-7 md:order-1 md:col-span-4 md:p-9">
            <p className="text-[0.8125rem] font-medium text-[#3d3e42]">{nextgen.period}</p>
            <h3 className="t-headline mt-4">{nextgen.title}</h3>
            <p className="mt-2 font-medium">{nextgen.org}</p>
            <ul className="mt-6 space-y-2.5">
              {nextgen.points.slice(0, 2).map((pt) => (
                <li key={pt} className="t-body-sm text-[#3d3e42]">
                  {pt}
                </li>
              ))}
            </ul>
          </li>
          <li data-reveal="item" className="rounded-card bg-[#f1e9de] p-7 md:col-span-3 md:order-3">
            <p className="text-[0.8125rem] font-medium text-[#3d3e42]">{incodet.period}</p>
            <h3 className="t-title mt-3">{incodet.title}</h3>
            <p className="mt-1 font-medium">{incodet.org}</p>
            <ul className="mt-4 space-y-2">
              {incodet.points.slice(0, 2).map((pt) => (
                <li key={pt} className="t-body-sm text-[#3d3e42]">
                  {pt}
                </li>
              ))}
            </ul>
          </li>
          <li data-reveal="item" className="rounded-card bg-[#ebe8fb] p-7 md:order-2 md:col-span-2">
            <p className="text-[0.8125rem] font-medium text-[#3d3e42]">{codesoft.period}</p>
            <h3 className="t-title mt-3">{codesoft.title}</h3>
            <p className="mt-1 font-medium">{codesoft.org}</p>
            <ul className="mt-4 space-y-2">
              {codesoft.points.slice(0, 2).map((pt) => (
                <li key={pt} className="t-body-sm text-[#3d3e42]">
                  {pt}
                </li>
              ))}
            </ul>
          </li>
          <li data-reveal="item" className="card p-7 md:order-4 md:col-span-3">
            <h3 className="text-[0.8125rem] font-medium text-fg-muted">Education</h3>
            <ol className="mt-4 space-y-4">
              {education.map((e) => (
                <li key={e.title}>
                  <p className="font-medium">{e.title}</p>
                  <p className="t-body-sm mt-0.5 text-fg-soft">
                    {e.org} · {e.detail} · {e.period}
                  </p>
                </li>
              ))}
            </ol>
          </li>
          <li data-reveal="item" className="card p-7 md:order-5 md:col-span-2">
            <h3 className="text-[0.8125rem] font-medium text-fg-muted">Skills</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {skills.map((sk) => (
                <li key={sk} className="rounded-full bg-[#f2f2ef] px-3 py-1.5 text-[0.875rem]">
                  {sk}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-[0.8125rem] font-medium text-fg-muted">Languages</h3>
            <p className="t-body-sm mt-2">{languages.join(", ")}</p>
          </li>
          <li data-reveal="item" className="card p-7 md:order-6 md:col-span-4">
            <h3 className="text-[0.8125rem] font-medium text-fg-muted">Tools</h3>
            <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {toolGroups.map((g) => (
                <div key={g.label}>
                  <dt className="text-[0.8125rem] font-medium">{g.label}</dt>
                  <dd className="t-body-sm text-fg-soft">{g.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
            <Link href="/ai-tools" className="btn-secondary mt-5 !py-2 !text-[0.875rem]">
              See the AI tools page
            </Link>
          </li>
        </ul>
      </section>
      <PageMotion />
    </main>
  );
}
