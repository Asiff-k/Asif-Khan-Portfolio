import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    { url: `${siteUrl}/ai-tools` },
    ...projects.map((p) => ({ url: `${siteUrl}/work/${p.slug}` })),
  ];
}
