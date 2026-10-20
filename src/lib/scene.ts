// "House lights": every visible surface follows one light or dark palette at a
// time. The palette lives in CSS custom properties on <html> so a single tween
// moves the backdrop, text and rules together.

export type SceneName = "light" | "dark";

// Tokens only (globals.css @theme). Keys map to --scene-* variables.
export const palettes: Record<SceneName, Record<string, string | number>> = {
  light: {
    "--scene-bg": "#f7f6f2",
    "--scene-fg": "#121316",
    "--scene-fg-soft": "#46464b",
    "--scene-fg-muted": "#5f6359",
    "--scene-line": "#dfe1d8",
    "--scene-line-strong": "#121316",
    "--scene-surface": "#ebeae5",
    "--scene-accent": "#3e6b5c",
    "--scene-on-fg": "#f7f6f2",
    "--scene-dark": 0,
  },
  dark: {
    "--scene-bg": "#181a1d",
    "--scene-fg": "#f7f6f2",
    "--scene-fg-soft": "#a2a59f",
    "--scene-fg-muted": "#a2a59f",
    "--scene-line": "#2a2d33",
    "--scene-line-strong": "#a2a59f",
    "--scene-surface": "#2a2d33",
    "--scene-accent": "#82b8a0",
    "--scene-on-fg": "#181a1d",
    "--scene-dark": 1,
  },
};

// prefers-contrast: more. Secondary text and rules move toward full contrast
// (the same values the site used before the house lights).
const contrast: Record<SceneName, Record<string, string>> = {
  light: { "--scene-fg-soft": "#2f312c", "--scene-fg-muted": "#2f312c", "--scene-line": "#121316" },
  dark: { "--scene-fg-soft": "#d7d9d2", "--scene-fg-muted": "#d7d9d2", "--scene-line": "#a2a59f" },
};

/** The palette to apply for a scene, with the high-contrast values when asked for. */
export function paletteFor(scene: SceneName) {
  const more = typeof window !== "undefined" && window.matchMedia("(prefers-contrast: more)").matches;
  return more ? { ...palettes[scene], ...contrast[scene] } : palettes[scene];
}

type Listener = (scene: SceneName) => void;
const listeners = new Set<Listener>();
let current: SceneName = "light";

export const sceneStore = {
  get: () => current,
  set(scene: SceneName) {
    if (scene === current) return;
    current = scene;
    listeners.forEach((l) => l(scene));
  },
  subscribe(l: Listener): () => void {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
