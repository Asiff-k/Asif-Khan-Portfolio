// Adds the pieces from "Asif Khan Graphic Design Portfolio 2026.zip" to the site.
//
// Usage:
//   node scripts/add-graphics-2026.mjs <dir with the extracted 1.png ... 15.png>
//
// Same output as scripts/process-images.mjs: 1400px-wide WebP (quality 82) in
// public/images/graphics, a 16px blur placeholder, metadata stripped, and the
// entries merged into src/content/media.generated.ts (kept in key order).

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/add-graphics-2026.mjs <dir>");
  process.exit(1);
}

const pieces = [
  ["1.png", "sneaker-no-dead-weight"],
  ["2.png", "headphones-silence-engineered"],
  ["3.png", "phone-see-it-first"],
  ["4.png", "car-silent-running"],
  ["5.png", "watch-measured-in-decades"],
  ["6.png", "perfume-oriel"],
  ["7.png", "serum-bare-minimum"],
  ["8.png", "coffee-bag-cold-north"],
  ["9.png", "brand-cold-north"],
  ["10.png", "magazine-frame"],
  ["11.png", "poster-sub-freq"],
  ["12.png", "poster-sylhet"],
  ["13.png", "poster-nocturne"],
  ["14.png", "social-drops-friday"],
  ["15.png", "social-midseason-edit"],
];

const manifestPath = path.join(root, "src", "content", "media.generated.ts");
const text = await readFile(manifestPath, "utf8");
const start = text.indexOf("export const media = {\n") + "export const media = {\n".length;
const end = text.indexOf("\n} as const satisfies");
const lines = new Map(
  text
    .slice(start, end)
    .split("\n")
    .filter(Boolean)
    .map((l) => [l.trim().match(/^"([^"]+)"/)[1], l]),
);

for (const [file, slug] of pieces) {
  const input = sharp(path.join(src, file), { limitInputPixels: false }).rotate().resize({ width: 1400, withoutEnlargement: true });
  const key = `graphics/${slug}`;
  const info = await input.clone().webp({ quality: 82, effort: 5 }).toFile(path.join(root, "public", "images", `${key}.webp`));
  const blur = await input.clone().resize(16).webp({ quality: 40 }).toBuffer();
  const entry = { src: `/images/${key}.webp`, width: info.width, height: info.height, blurDataURL: `data:image/webp;base64,${blur.toString("base64")}` };
  lines.set(key, `  "${key}": ${JSON.stringify(entry)},`);
  console.log(key, info.width, info.height, Math.round(info.size / 1024) + "KB");
}

const body = [...lines.keys()].sort().map((k) => lines.get(k)).join("\n");
await writeFile(manifestPath, text.slice(0, start) + body + text.slice(end));
