"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  ShaderMaterial,
  Vector2,
  type Points,
} from "three";
import { gsap } from "@/lib/gsap";
import { sceneStore, type SceneName } from "@/lib/scene";
import { cloud, field, name, sphere, type Formation, type View } from "./formations";
import { stage, type FormationKey } from "./stage-controller";

const vertex = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec4 aRand;
  uniform float uTime;
  uniform float uProgress;
  uniform float uNoise;
  uniform float uBreath;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uPointer;
  uniform float uPointerActive;
  uniform float uRepel;
  varying float vAlpha;
  varying float vMix;

  // Cheap divergence-light flow field: smooth, slow, no texture lookups.
  vec3 flow(vec3 p, float t) {
    return vec3(
      sin(p.y * 1.3 + t * 0.7 + aRand.x * 6.2831),
      sin(p.z * 1.1 + t * 0.6 + aRand.y * 6.2831),
      sin(p.x * 1.2 + t * 0.5 + aRand.z * 6.2831)
    );
  }

  void main() {
    // Stagger: each particle starts a little later than the last.
    float p = clamp(uProgress * 1.3 - aRand.w * 0.3, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);
    vec3 pos = mix(aFrom, aTo, p);
    float travel = sin(p * 3.14159);
    pos += flow(pos * 0.6, uTime * 0.35) * (uNoise + travel * 0.55) * (0.3 + aRand.x * 0.7);
    pos *= 1.0 + sin(uTime * 0.6 + aRand.y) * uBreath;

    // Pointer repel in screen plane; the uniform is eased on the CPU so it springs back.
    vec2 d = pos.xy - uPointer;
    float dist = length(d);
    float force = (1.0 - smoothstep(0.0, uRepel, dist)) * uPointerActive;
    pos.xy += (d / max(dist, 0.0001)) * force * uRepel * 0.55;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.6 + aRand.y * 0.8) * (10.0 / -mv.z);
    vAlpha = 0.5 + aRand.z * 0.5;
    vMix = aRand.x;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vMix;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(uColorA, uColorB, vMix), a * vAlpha * uOpacity);
  }
`;

// Dark scenes glow (mint with moss, additive). Light scenes read as ink dust.
/** Run a callback when the browser is idle (Safari has no requestIdleCallback). */
function onIdle(fn: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(fn, { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(fn, 50);
  return () => window.clearTimeout(id);
}

const look: Record<SceneName, { a: string; b: string; opacity: number; additive: boolean }> = {
  dark: { a: "#82b8a0", b: "#3e6b5c", opacity: 0.7, additive: true },
  light: { a: "#121316", b: "#46464b", opacity: 0.25, additive: false },
};

export function Particles({ count, fontFamily }: { count: number; fontFamily: string }) {
  const { size, camera, viewport, gl } = useThree();
  const points = useRef<Points>(null);
  const formations = useRef<Partial<Record<FormationKey, Formation>>>({});
  // The formation pair currently in the buffers; null after a free morph.
  const pair = useRef<[FormationKey, FormationKey] | null>(["cloud", "cloud"]);
  const lastTarget = useRef<FormationKey>("cloud");
  const ready = useRef<{ promise: Promise<void>; resolve: () => void } | null>(null);
  if (!ready.current) {
    let resolve = () => {};
    const promise = new Promise<void>((r) => (resolve = r));
    ready.current = { promise, resolve };
  }
  const pointer = useRef({ target: new Vector2(999, 999), active: 0, targetActive: 0 });

  const view: View = useMemo(() => {
    const v = viewport.getCurrentViewport(camera, [0, 0, 0]);
    return { halfW: v.width / 2, halfH: v.height / 2 };
  }, [viewport, camera]);

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const start = cloud(count, view);
    g.setAttribute("position", new BufferAttribute(start.slice(), 3));
    g.setAttribute("aFrom", new BufferAttribute(start.slice(), 3));
    g.setAttribute("aTo", new BufferAttribute(start.slice(), 3));
    const r = new Float32Array(count * 4);
    for (let i = 0; i < r.length; i++) r[i] = Math.random();
    g.setAttribute("aRand", new BufferAttribute(r, 4));
    return g;
    // Rebuilt only when the particle count changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const material = useMemo(() => {
    const scene = sceneStore.get();
    return new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: look[scene].additive ? AdditiveBlending : NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uNoise: { value: 0.08 },
        uBreath: { value: 0.012 },
        uSize: { value: 5 },
        uPixelRatio: { value: gl.getPixelRatio() },
        uPointer: { value: new Vector2(999, 999) },
        uPointerActive: { value: 0 },
        uRepel: { value: 0.5 },
        uColorA: { value: new Color(look[scene].a) },
        uColorB: { value: new Color(look[scene].b) },
        uOpacity: { value: look[scene].opacity },
      },
    });
  }, [gl]);

  // Build formation targets for the current viewport; recomputed on resize.
  useEffect(() => {
    let cancelled = false;
    const build = async () => {
      const f = formations.current;
      f.cloud = cloud(count, view);
      f.field = field(count, view);
      f.sphere = sphere(count, Math.min(view.halfH * 0.62, view.halfW * 0.5), [view.halfW * 0.35, 0, -1]);
      f.orb = sphere(count, 0.32, [0, 0, 0]);
      f.can = f.can ?? sphere(count, view.halfH * 0.5);
      f.name = await name(count, view, fontFamily);
      if (cancelled) return;
      if (pair.current) {
        setPairAttributes(pair.current[0], pair.current[1]);
      } else {
        // After a free morph, snap to the same formation rebuilt for the new size.
        const t = f[lastTarget.current];
        if (t) {
          (geometry.getAttribute("aFrom") as BufferAttribute).copyArray(t).needsUpdate = true;
          (geometry.getAttribute("aTo") as BufferAttribute).copyArray(t).needsUpdate = true;
        }
      }
      ready.current?.resolve();
    };
    const cancel = onIdle(() => void build());
    return () => {
      cancelled = true;
      cancel();
    };
    // setPairAttributes is stable for the life of the geometry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, count, fontFamily]);

  function setPairAttributes(from: FormationKey, to: FormationKey) {
    const f = formations.current;
    const a = f[from];
    const b = f[to];
    if (!a || !b) return;
    (geometry.getAttribute("aFrom") as BufferAttribute).copyArray(a).needsUpdate = true;
    (geometry.getAttribute("aTo") as BufferAttribute).copyArray(b).needsUpdate = true;
    (geometry.getAttribute("position") as BufferAttribute).copyArray(b).needsUpdate = true;
    pair.current = [from, to];
    lastTarget.current = to;
  }

  // Where the particles visibly are right now (ignoring noise), for time-based morphs.
  function snapshot(): Formation {
    const from = geometry.getAttribute("aFrom").array as Float32Array;
    const to = geometry.getAttribute("aTo").array as Float32Array;
    const p = material.uniforms.uProgress.value as number;
    const out = new Float32Array(from.length);
    for (let i = 0; i < out.length; i++) out[i] = from[i] + (to[i] - from[i]) * p;
    return out;
  }

  // Register with the page-side controller.
  useEffect(() => {
    let tween: gsap.core.Tween | null = null;
    stage.register({
      scrub(from, to, p) {
        tween?.kill();
        if (!pair.current || pair.current[0] !== from || pair.current[1] !== to) setPairAttributes(from, to);
        material.uniforms.uProgress.value = p;
      },
      morph(to, duration = 2.4) {
        tween?.kill();
        void ready.current?.promise.then(() => {
          const f = formations.current;
          const target = f[to];
          if (!target) return;
          const now = snapshot();
          (geometry.getAttribute("aFrom") as BufferAttribute).copyArray(now).needsUpdate = true;
          (geometry.getAttribute("aTo") as BufferAttribute).copyArray(target).needsUpdate = true;
          pair.current = null;
          lastTarget.current = to;
          material.uniforms.uProgress.value = 0;
          tween = gsap.to(material.uniforms.uProgress, { value: 1, duration, ease: "expo.out" });
        });
      },
    });
    return () => {
      tween?.kill();
      stage.register(null);
    };
    // material and geometry are stable for the life of the stage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // House lights: dark scenes glow, light scenes switch to soft ink.
  useEffect(() => {
    return sceneStore.subscribe((scene) => {
      const l = look[scene];
      material.blending = l.additive ? AdditiveBlending : NormalBlending;
      material.needsUpdate = true;
      const a = new Color(l.a);
      const b = new Color(l.b);
      gsap.to(material.uniforms.uColorA.value, { r: a.r, g: a.g, b: a.b, duration: 0.8, ease: "power2.inOut" });
      gsap.to(material.uniforms.uColorB.value, { r: b.r, g: b.g, b: b.b, duration: 0.8, ease: "power2.inOut" });
      gsap.to(material.uniforms.uOpacity, { value: l.opacity, duration: 0.8, ease: "power2.inOut" });
    });
  }, [material]);

  // Pointer: repel within about 120px, eased so particles spring back.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.current.target.set(x * view.halfW, y * view.halfH);
      pointer.current.targetActive = 1;
    };
    const onLeave = () => (pointer.current.targetActive = 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [view]);

  useEffect(() => {
    material.uniforms.uRepel.value = (120 / size.height) * view.halfH * 2;
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
  }, [size, view, material, gl]);

  useFrame((_, delta) => {
    const u = material.uniforms;
    u.uTime.value += Math.min(delta, 0.05);
    const ptr = pointer.current;
    const k = 1 - Math.pow(0.001, Math.min(delta, 0.05));
    (u.uPointer.value as Vector2).lerp(ptr.target, k);
    ptr.active += (ptr.targetActive - ptr.active) * k;
    u.uPointerActive.value = ptr.active;
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
