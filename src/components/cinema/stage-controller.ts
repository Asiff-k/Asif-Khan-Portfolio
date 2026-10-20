// Bridge between page code (scroll triggers, sections) and the WebGL stage.
// Has no three.js import, so the main bundle stays light; the stage registers
// its implementation once it has loaded.

export type FormationKey = "cloud" | "field" | "can" | "sphere";

type Impl = {
  /** Scrub between two formations; p is 0..1. */
  scrub: (from: FormationKey, to: FormationKey, p: number) => void;
  /** Time-based morph from wherever particles are now. */
  morph: (to: FormationKey, duration?: number) => void;
};

let impl: Impl | null = null;
const pending: Array<(i: Impl) => void> = [];
const readyListeners = new Set<() => void>();

export const stage = {
  register(i: Impl | null) {
    impl = i;
    if (!i) return;
    pending.splice(0).forEach((fn) => fn(i));
    readyListeners.forEach((fn) => fn());
  },
  scrub(from: FormationKey, to: FormationKey, p: number) {
    if (impl) impl.scrub(from, to, p);
  },
  morph(to: FormationKey, duration?: number) {
    if (impl) impl.morph(to, duration);
    else pending.push((i) => i.morph(to, duration));
  },
  ready: () => impl !== null,
  /** Called each time a stage registers (it can mount after the page). */
  onReady(fn: () => void) {
    readyListeners.add(fn);
    return () => {
      readyListeners.delete(fn);
    };
  },
};
