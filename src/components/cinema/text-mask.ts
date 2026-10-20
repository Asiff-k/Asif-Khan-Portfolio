import { CanvasTexture, LinearFilter } from "three";

/**
 * A low-resolution screen-space mask of where text sits on the bare page
 * background. The particle shader multiplies its alpha down to about 8%
 * wherever the mask is white, so text never sits on visible particles, while
 * particles stay bold in margins and the gaps between sections.
 *
 * Text inside opaque surfaces (white cards, the coloured service panels, the
 * header) is skipped: those already cover the particles.
 *
 * Cost control: the list of text elements is rebuilt every 3s (and on
 * resize); their page-relative boxes are re-measured once a second; each
 * frame only shifts the boxes by the scroll offset and redraws a 160px-wide
 * canvas when something changed. The texture's linear filtering softens the
 * box edges, so no canvas blur is needed.
 */

const OPAQUE = ".card, .no-halo, header, [data-sticker], .btn-primary, .btn-secondary, .chip, .pill-badge, .sphere-root, img";
const PAD = 28; // css px of clear space around each text block

type Box = { x: number; y: number; w: number; h: number };

function hasOwnText(el: Element) {
  for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent && n.textContent.trim()) return true;
  return false;
}

export function createTextMask() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;

  let els: HTMLElement[] = [];
  let boxes: Box[] = [];
  let lastList = 0;
  let lastMeasure = 0;
  let lastKey = "";

  const collect = () => {
    els = [...document.querySelectorAll<HTMLElement>("main *, footer *")].filter((el) => hasOwnText(el) && !el.closest(OPAQUE));
    lastList = performance.now();
  };

  const measure = () => {
    const sy = window.scrollY;
    const out: Box[] = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) out.push({ x: r.left, y: r.top + sy, w: r.width, h: r.height });
    }
    boxes = out;
    lastMeasure = performance.now();
    lastKey = "";
  };

  const onResize = () => {
    lastList = 0;
    lastMeasure = 0;
  };
  window.addEventListener("resize", onResize);

  /** Redraw if the scroll position or the measured boxes changed. */
  const update = () => {
    const now = performance.now();
    if (now - lastList > 3000) collect();
    if (now - lastMeasure > 1000) measure();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cw = 160;
    const ch = Math.max(1, Math.round((cw * vh) / vw));
    const sy = Math.round(window.scrollY);
    const key = `${sy}|${ch}|${lastMeasure}`;
    if (key === lastKey) return;
    lastKey = key;
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    const k = cw / vw;
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = "#fff";
    for (const b of boxes) {
      const top = b.y - sy;
      if (top + b.h < -PAD || top > vh + PAD) continue;
      ctx.fillRect((b.x - PAD) * k, (top - PAD) * k, (b.w + PAD * 2) * k, (b.h + PAD * 2) * k);
    }
    texture.needsUpdate = true;
  };

  const dispose = () => {
    window.removeEventListener("resize", onResize);
    texture.dispose();
  };

  return { texture, update, dispose };
}
