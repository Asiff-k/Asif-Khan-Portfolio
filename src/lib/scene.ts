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
