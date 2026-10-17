// Converts source artwork into web-ready images for the portfolio.
//
// Usage:
//   npm run images -- --template <dir with Template.zip contents> --staging <dir>
//
// The script only reads from the source folders. It writes resized WebP files
// to public/images and a typed manifest to src/content/media.generated.ts.
// Metadata (including any GPS data in photos) is stripped from every output.

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "images");
const manifestPath = path.join(root, "src", "content", "media.generated.ts");

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1 || !process.argv[i + 1]) {
    console.error(`Missing --${name} <dir>`);
    process.exit(1);
  }
  return path.resolve(process.argv[i + 1]);
}

const templateDir = arg("template");
const stagingDir = arg("staging");

// Graphic design pieces confirmed as Asif's own work.
// Excluded on purpose: Design1, Design7, Design9 (other designers' credits),
// ui1/ui2 (Moss, not his work) and drink11 (duplicate of drink3).
const graphics = [
  ["food1.jpg", "pasta-one-twirl"],
  ["food02.jpg", "pasta-yum"],
  ["food07.jpg", "pasta-twist"],
  ["food03.jpg", "croissant-red"],
  ["food04.jpg", "croissant-outline"],
  ["food05.jpg", "croissant-happiness-on"],
  ["food06.jpg", "coffee-on"],
  ["food08.jpg", "croissant-split"],
  ["food09.jpg", "croissant-cream"],
  ["food10.jpg", "croissant-splash"],
  ["drink1.jpg", "can-vine-glow"],
  ["drink2.jpg", "can-cold-coffee"],
  ["drink3.jpg", "can-fruit-squeeze-blueberry"],
  ["drink4.jpg", "can-fruit-squeeze-peach"],
  ["drink5.jpg", "can-fanta-mango"],
  ["drink6.jpg", "can-fanta-strawberry"],
  ["drink7.jpg", "can-fanta-pineapple"],
  ["drink8.jpg", "can-fanta-tropical"],
  ["drink9.jpg", "coffee-phone-pour"],
  ["drink10.jpg", "can-blueberry-fusion"],
  ["Design4.jpg", "coffee-fuel-pump"],
  ["Design8.jpg", "coffee-fuel-your-body"],
  ["design11.jpg", "ketchup-sliced"],
  ["design12.jpg", "ketchup-bottle"],
  ["Design2.jpg", "watch-hour-unit"],
  ["Design3.jpg", "watch-odyssey"],
  ["Design5.jpg", "lip-balm-squeeze"],
  ["Design6.jpg", "lip-balm-blueberry"],
  ["Design10.jpg", "ctrl-key"],
  ["game design3 .jpg", "gamehorizon-spider-man"],
  ["game design4 .jpg", "gamehorizon-uncharted"],
  ["game design5 .jpg", "gamehorizon-ac-origins"],
  ["game design6 .jpg", "gamehorizon-gta-v"],
  ["game design7 .jpg", "gamehorizon-cyberpunk"],
  ["game design8 .jpg", "gamehorizon-cod-ww2"],
  ["game design9 .jpg", "gamehorizon-god-of-war"],
  ["game design10 .jpg", "gamehorizon-la-noire"],
  ["game design11 .jpg", "gamehorizon-last-of-us"],
  ["game design12 .jpg", "gamehorizon-witcher"],
  ["game design.jpg", "game-art-odyssey"],
  ["game design13 .jpg", "game-art-odyssey-battle"],
  ["game design2 .jpg", "game-art-silhouette"],
  ["dhaka.jpg", "poster-dhaka"],
  ["Tshirt 1.jpg", "tee-ignore"],
  ["Tshirt 2.jpg", "tee-rome"],
  ["Tshirt 3.jpg", "tee-breaking-bad-vice"],
  ["Tshirt 4.jpg", "tee-breaking-bad"],
  ["Tshirt 5.jpg", "tee-fight-club"],
  ["Tshirt 6.jpg", "tee-wild"],
  ["App Development_ Learn from Asif Khan.png", "social-app-development"],
  ["marketing1.jpg", "social-marketing"],
  ["marketing2.jpg", "social-website"],
  ["seo.jpg", "social-seo"],
  ["seo2.jpg", "social-seo-banner"],
];

// Full-page website screenshots: a cover crop of the top plus the full page.
const longScreens = [
  ["cipher sheild ui.png", "cipher-shield"],
  ["ki training ui.png", "ki-training"],
  ["nextgen productions ui.png", "nextgen-production"],
];

// Single screenshots taken from incodet.com's BRHEX case study.
const screens = [
  ["brhex-hero.png", "brhex-hero"],
  ["brhex-floorplan-preview.png", "brhex-floorplan"],
];

// Screenshots of Chol Ghuri and CareerNavigator, captured locally with demo
// accounts. `crop` keeps only the top of a page (e.g. to leave out member
// phone numbers on the group page).
const appShots = [
  ["cg-groups.png", "chol-ghuri-matching"],
  ["cg-group.png", "chol-ghuri-group-pricing", { crop: 500 }],
  ["cg-expenses.png", "chol-ghuri-expenses"],
  ["cg-packages.png", "chol-ghuri-packages"],
  ["cg-home.png", "chol-ghuri-home"],
  ["cg-groups-mobile.png", "chol-ghuri-matching-mobile"],
  ["cn-recommendations.png", "careernavigator-matches"],
  ["cn-roadmap.png", "careernavigator-roadmap"],
  ["cn-dashboard.png", "careernavigator-dashboard"],
  ["cn-interview.png", "careernavigator-interview"],
  ["cn-home.png", "careernavigator-home"],
  // Top of the live incodet.com homepage only.
  ["incodet-home.png", "incodet-home"],
];

const manifest = {};
let bytesIn = 0;
let bytesOut = 0;

async function blurOf(pipeline) {
  const buf = await pipeline.clone().resize(16).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function save(key, pipeline, { quality = 82 } = {}) {
  const file = path.join(outDir, `${key}.webp`);
  await mkdir(path.dirname(file), { recursive: true });
  const info = await pipeline.clone().webp({ quality, effort: 5 }).toFile(file);
  bytesOut += info.size;
  manifest[key] = {
    src: `/images/${key}.webp`,
    width: info.width,
    height: info.height,
    blurDataURL: await blurOf(pipeline),
  };
  return info;
}

async function load(file) {
  if (!existsSync(file)) throw new Error(`Source not found: ${file}`);
  bytesIn += (await stat(file)).size;
  return readFile(file);
}

async function run() {
  const seen = new Map();

  for (const [name, slug] of graphics) {
    const input = await load(path.join(templateDir, name));
    const hash = createHash("md5").update(input).digest("hex");
    if (seen.has(hash)) throw new Error(`${name} duplicates ${seen.get(hash)}`);
    seen.set(hash, name);
    const img = sharp(input).rotate().resize({ width: 1400, withoutEnlargement: true });
    await save(`graphics/${slug}`, img);
  }

  for (const [name, slug] of longScreens) {
    const input = await load(path.join(templateDir, name));
    const { width } = await sharp(input).metadata();
    const coverHeight = Math.round(width * 0.625); // 16:10 top crop
    const cover = sharp(input)
      .extract({ left: 0, top: 0, width, height: coverHeight })
      .resize({ width: 1600, withoutEnlargement: true });
    await save(`ui/${slug}-cover`, cover);
    const full = sharp(input, { limitInputPixels: false }).resize({ width: 1280 });
    await save(`ui/${slug}-full`, full, { quality: 78 });
  }

  for (const [name, slug] of screens) {
    const input = await load(path.join(stagingDir, "ui", name));
    await save(`ui/${slug}`, sharp(input).resize({ width: 1600, withoutEnlargement: true }));
  }

  for (const [name, slug, opts = {}] of appShots) {
    const input = await load(path.join(stagingDir, "apps", name));
    let img = sharp(input);
    if (opts.crop) {
      const { width } = await img.metadata();
      img = sharp(input).extract({ left: 0, top: 0, width, height: opts.crop });
    }
    await save(`apps/${slug}`, img.resize({ width: 1440, withoutEnlargement: true }));
  }

  // Portrait: Asif-4, original colour. The photo is already 4:5, so it is only
  // trimmed to an exact 4:5 frame (no reframing) and resized.
  const portrait = await load(path.join(stagingDir, "photos", "Asif-4.jpg"));
  const { width: rawW, height: ph } = await sharp(portrait).rotate().metadata();
  // The original has a 3px light border on its right edge; trim it off.
  const pw = rawW - 6;
  const frameH = Math.min(ph, Math.round(pw * 1.25));
  const portraitCrop = sharp(portrait)
    .rotate()
    .extract({ left: 0, top: 0, width: pw, height: frameH })
    .resize({ width: 960, withoutEnlargement: true });
  await save("photos/asif-portrait", portraitCrop, { quality: 86 });

  const keys = Object.keys(manifest).sort();
  const body = keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(manifest[k])},`).join("\n");
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(
    manifestPath,
    `// Generated by scripts/process-images.mjs. Do not edit by hand.\n\n` +
      `export type MediaAsset = { src: string; width: number; height: number; blurDataURL: string };\n\n` +
      `export const media = {\n${body}\n} as const satisfies Record<string, MediaAsset>;\n\n` +
      `export type MediaKey = keyof typeof media;\n`,
  );

  const mb = (n) => (n / 1024 / 1024).toFixed(1);
  console.log(`Processed ${keys.length} images: ${mb(bytesIn)} MB in, ${mb(bytesOut)} MB out.`);
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
