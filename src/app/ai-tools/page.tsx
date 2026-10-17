import type { Metadata } from "next";
import {
  siClaude,
  siCursor,
  siElevenlabs,
  siFigma,
  siFramer,
  siGithubcopilot,
  siGooglegemini,
  siHubspot,
  siMake,
  siN8n,
  siNotebooklm,
  siNotion,
  siPerplexity,
  siSemrush,
  siWindsurf,
  siZapier,
} from "simple-icons";
import { ToolDirectory, type ToolEntry } from "@/components/tool-directory";
import { toolCategories, tools } from "@/content/tools";

export const metadata: Metadata = {
  title: "AI tools",
  description:
    "The AI tools Asiful Hasan Khan uses, the platforms from his AI data projects, and a wider list of AI tools worth knowing.",
};

const icons: Record<string, { path: string }> = {
  siClaude,
  siCursor,
  siElevenlabs,
  siFigma,
  siFramer,
  siGithubcopilot,
  siGooglegemini,
  siHubspot,
  siMake,
  siN8n,
  siNotebooklm,
  siNotion,
  siPerplexity,
  siSemrush,
  siWindsurf,
  siZapier,
};

const entries: ToolEntry[] = tools.map(({ icon, ...t }) => ({
  ...t,
  logo: icon ? icons[icon]?.path : undefined,
}));

export default function AiToolsPage() {
  const used = tools.filter((t) => t.status === "used").length;
  return (
    <main id="main">
      <header className="page-x pt-10 pb-12 md:pt-16 md:pb-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="t-stamp text-moss">AI tools</p>
            <h1 className="t-display-lg mt-4 text-balance">The AI tools I use, and others worth knowing.</h1>
          </div>
          <div className="t-body-sm space-y-3 text-ink-soft md:col-span-4 md:self-end">
            <p>
              The first {used} are tools I use in my own work. Next come the platforms from my AI data projects. The
              rest is a wider list by area, from writing and video to SEO and automation.
            </p>
            <p>I&apos;ve kept these groups separate so it&apos;s clear which tools I actually use.</p>
          </div>
        </div>
      </header>
      <div className="page-x pb-24 md:pb-32">
        <ToolDirectory tools={entries} categories={toolCategories} />
      </div>
    </main>
  );
}
