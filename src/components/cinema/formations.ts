// Particle formation targets. Each is a Float32Array of xyz triples in world
// units (camera at z = 10, fov 35, so the z = 0 plane is about 6.3 units tall).

export type Formation = Float32Array;
export type View = { halfW: number; halfH: number };

const rand = (seed: number) => {
  // Small deterministic PRNG so formations are stable between renders.
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Loose random cloud: the starting state before anything assembles. */
export function cloud(count: number, view: View): Formation {
  const r = rand(1);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    out[i * 3] = (r() * 2 - 1) * view.halfW * 1.6;
    out[i * 3 + 1] = (r() * 2 - 1) * view.halfH * 1.6;
    out[i * 3 + 2] = (r() * 2 - 1) * 6 - 2;
  }
  return out;
}

/** Wide, shallow scattered volume: ambient texture behind reading content. */
export function field(count: number, view: View): Formation {
  const r = rand(2);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    out[i * 3] = (r() * 2 - 1) * view.halfW * 1.3;
    out[i * 3 + 1] = (r() * 2 - 1) * view.halfH * 1.3;
    out[i * 3 + 2] = -3 - r() * 5;
  }
  return out;
}

/** Fibonacci sphere. */
export function sphere(count: number, radius: number, center: [number, number, number] = [0, 0, 0]): Formation {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    out[i * 3] = center[0] + Math.cos(theta) * r * radius;
    out[i * 3 + 1] = center[1] + y * radius;
    out[i * 3 + 2] = center[2] + Math.sin(theta) * r * radius;
  }
  return out;
}

/**
 * Drinks can surface: a lathe profile (domed base, straight body, tapered neck,
 * lid rim) sampled by surface area, tilted slightly. Echoes the can designs in
 * the gallery. Sits right of centre so the section heading stays clear, and
 * turns about its own vertical axis (see SPINS in particles.tsx).
 *
 * TODO(asset): the brief's solid can (lathe mesh with a label sleeve) needs flat
 * label artwork at public/design/labels/*.png (about 1.8:1). Until then the
 * Design beat stays particles only.
 */
export function can(count: number, view: View): { points: Formation; center: [number, number, number] } {
  const r = rand(4);
  const height = view.halfH * 1.25;
  const radius = height * 0.27;
  // Profile as (y, radius) pairs from bottom to top, y in 0..1 of height.
  const profile: [number, number][] = [
    [0, 0.78], [0.02, 0.92], [0.05, 1], [0.86, 1], [0.92, 0.9], [0.96, 0.84], [0.98, 0.84], [1, 0.8],
  ];
  // Segment weights by lateral area (mean radius x slant length).
  const seg = profile.slice(1).map(([y1, r1], i) => {
    const [y0, r0] = profile[i];
    return { y0, r0, y1, r1, w: ((r0 + r1) / 2) * Math.hypot((y1 - y0) * height, (r1 - r0) * radius) };
  });
  const lid = 0.12; // share of points on the top and bottom discs
  const total = seg.reduce((a, s) => a + s.w, 0);
  const tilt = -0.2;
  const [cx, cy, cz] = [view.halfW * 0.42, -view.halfH * 0.05, -1];
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let y: number;
    let rad: number;
    if (r() < lid) {
      const top = r() < 0.5;
      y = top ? 1 : 0;
      rad = (top ? 0.8 : 0.78) * Math.sqrt(r());
    } else {
      let pick = r() * total;
      let s = seg[0];
      for (const candidate of seg) {
        s = candidate;
        if ((pick -= candidate.w) <= 0) break;
      }
      const t = r();
      y = s.y0 + (s.y1 - s.y0) * t;
      rad = s.r0 + (s.r1 - s.r0) * t;
    }
    const a = r() * Math.PI * 2;
    const x = Math.cos(a) * rad * radius;
    const z = Math.sin(a) * rad * radius;
    const yy = (y - 0.5) * height;
    out[i * 3] = cx + x * Math.cos(tilt) - yy * Math.sin(tilt);
    out[i * 3 + 1] = cy + x * Math.sin(tilt) + yy * Math.cos(tilt);
    out[i * 3 + 2] = cz + z;
  }
  return { points: out, center: [cx, cy, cz] };
}

/** Thin circle of particles at the origin: the contact "orb", pulsed in the shader. */
export function ring(count: number, radius: number): Formation {
  const r = rand(5);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = r() * Math.PI * 2;
    const rr = radius * (1 + (r() - 0.5) * 0.05);
    out[i * 3] = Math.cos(a) * rr;
    out[i * 3 + 1] = Math.sin(a) * rr;
    out[i * 3 + 2] = (r() - 0.5) * 0.03;
  }
  return out;
}
