# Decisions (cinematic branch)

One line each: what was chosen and why.

## Setup
- Packages pinned to releases at least two weeks old (three 0.186.1, @react-three/fiber 9.8.1, @react-three/drei 10.7.9, gsap 3.15.0, lenis 1.3.26) for stability.
- The body is the single fixed backdrop: its background follows `--scene-bg`, so no extra full-screen layer is needed.
- House lights are page-wide CSS variables (`--scene-*`) tweened by GSAP, so backdrop, text and rules always change together and text never sits on the wrong background.
- Scene-aware Tailwind colours (`bg`, `fg`, `fg-soft`, `fg-muted`, `line`, `line-strong`, `surface`, `accent`, `on-fg`) replace fixed tokens on the home page, header and footer; other pages keep the light palette and look unchanged.
- The home page renders dark before any script runs (`:root:has(main[data-scenes])`), matching the dark hero scene and avoiding a light-to-dark flash.
- Every home section now has the same vertical padding so each scene change happens with the section clearly in view.
- Lenis smooths wheel scrolling only; touch scrolling stays native for natural momentum on phones.
- Lenis is paused inside the image viewer and mobile menu (`data-lenis-prevent`) so their own scrolling and scroll lock keep working.
- Progressive edge blur is written from scratch (no Skiper UI, per your answer): three masked backdrop-blur layers, dark scenes only.
- Edge blur is off on screens under 768px and for reduced transparency: it costs GPU time on phones and is barely visible there.
- Film grain is an inline SVG turbulence tile (no image file), 5% opacity, stepped at about 8fps; static for reduced motion.
- The vignette sits behind the content (above the backdrop and particles), so it darkens the stage but never dims text or buttons.

## Hero and particles
- The WebGL stage mounts only on the home page, after first paint and once the browser is idle; three.js lives in a lazy chunk. Other pages render no canvas.
- Particle counts: 16k on desktop with more than 4 CPU cores, 10k on 4 cores or fewer, 5k on mobile; DPR capped at 1.5 desktop and 1 mobile.
- Formation targets are computed on the main thread during idle time (not a Web Worker): they take a few milliseconds for 16k points, and a worker would add a second bundle and font loading inside the worker.
- The "ASIF" formation is a wide wordmark along the bottom of the hero, partly cropped by the frame, so the headline and intro text sit on clean dark background instead of over particles.
- Dark-scene particle opacity is 0.7 (not full) so the glow never competes with text.
- Curl noise is a cheap analytic sine flow field instead of simplex curl noise: same slow drifting look, much less GPU work per particle.
- The letterbox intro is decided by a tiny inline script before first paint (first visit this session, 768px and wider, motion allowed). The headline is never hidden without JavaScript, and a CSS fail-safe reveals it after 3s if a script fails.
- No intro on phones: it would delay the largest contentful paint on the slowest devices.
- `<html>` has suppressHydrationWarning because the intro script adds a class before React hydrates; this covers only that element's attributes.
- R3F 9 creates a THREE.Clock internally, which three.js deprecated in r183; three's own setConsoleFunction hook drops only that one notice and passes every other message through.
- Pointer repel works for mouse input only; touch gets no hover-style effects.
- TODO(asset) hero cut-out: the hero uses the Asif-4 photo, as you asked; `/images/asif-cutout.png` is not used.
- Components that change page DOM (intro, reveals, scroll world) render inside the page, not the layout: with partial prerendering the page hydrates after the layout, and splitting the headline earlier caused a hydration mismatch.
- Letterbox bars are ink (#121316, the darkest token) with a carbon-rule edge: carbon bars are invisible against the carbon hero.
- The reduced-motion poster (/images/cinema-poster.webp) is a capture of the site's own particle scene (the ASIF formation), not an outside image.

## Scroll world

- Native `scroll-behavior: smooth` is switched off while Lenis runs (`html.lenis`); keeping both smoothed every scroll twice and made it lag. Without Lenis (reduced motion) native behaviour applies.
- Formation beats scrub from "top 85%" to "top 15%" of each section, and the particles always show the latest beat that has started, so jumping across sections or reloading mid-page lands on the right formation.
- A hero morph still waiting for its formations is cancelled if the user has already scrolled to a later beat.
- Skills pointer tilt applies only to the app and interface screenshots (two per row), not to posters or the logo grid, to keep it to one new effect.
- Image reveals use clip-path plus a slow scale-down; content stays visible without JavaScript and with reduced motion.
- Experience gets its own beat (sphere back to field) so the dense sphere never sits behind reading text; Contact then gathers the field into the orb. Light-scene particle opacity is 0.18.

## Work (Flowing Menu)

- Flowing Menu shows only with a mouse at 768px and up (CSS media query, no JS switch, so no layout shift). Touch and narrow screens keep the plain list: tap goes straight to the project page, with a one-line summary.
- Its background is transparent and its text and divider colours follow the scene variables, so the particle field shows through and the house lights still apply. The marquee band is moss with stone text.
- Thumbnails in the band use the Next image optimizer at 640px wide, not the full-size covers.
- The component's own load-in sweep (intro) is off: it runs on mount, before the section is on screen. The heading reveal covers the entrance.
- Index and meta labels in the component are aria-hidden, as shipped; the project pages carry that information.
- React Bits source is kept with its copyright header; the full license text is in src/components/vendor/LICENSE-react-bits.md.
