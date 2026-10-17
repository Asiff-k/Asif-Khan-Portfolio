// Motion rules from the apple-design skill.

// Critically damped default: no overshoot. Response ~0.35s.
export const springDefault = { type: "spring", bounce: 0, visualDuration: 0.35 } as const;

// Slight bounce, used only after a gesture that carried momentum (a flick).
export const springMomentum = { type: "spring", bounce: 0.2, visualDuration: 0.35 } as const;

/**
 * Where a flick would come to rest, using the same exponential decay as
 * scroll deceleration (decelerationRate 0.998).
 */
export function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Progressive resistance past a boundary instead of a hard stop. */
export function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

type Sample = { x: number; y: number; t: number };

/** Keeps the last few pointer samples so release velocity can be measured. */
export function createVelocityTracker() {
  let samples: Sample[] = [];
  return {
    reset() {
      samples = [];
    },
    add(x: number, y: number, t: number) {
      samples.push({ x, y, t });
      if (samples.length > 6) samples.shift();
    },
    /** Velocity in px/s over the last ~100ms of movement. */
    velocity() {
      if (samples.length < 2) return { x: 0, y: 0 };
      const last = samples[samples.length - 1];
      let first = samples[0];
      for (const s of samples) {
        if (last.t - s.t <= 100) {
          first = s;
          break;
        }
      }
      const dt = (last.t - first.t) / 1000;
      if (dt <= 0) return { x: 0, y: 0 };
      return { x: (last.x - first.x) / dt, y: (last.y - first.y) / dt };
    },
  };
}
