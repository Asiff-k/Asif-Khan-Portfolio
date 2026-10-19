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

## Design (screening room)

- CAN is a procedural lathe profile (domed base, body, tapered neck, lid rim) sampled by surface area in plain JS, not MeshSurfaceSampler: same result without building a mesh, and three.js stays inside the lazy stage chunk. It sits right of centre so the heading stays clear.
- Solid can skipped: there are no label files in public/design/labels. TODO(asset) in src/components/cinema/formations.ts.
- Before/after diff sliders skipped: there are no pairs in public/design/process. TODO(asset) in src/components/design-showcase.tsx. daisyUI is set up (include: mockup, diff; prefix d-; themes false); those are the file names in daisyUI 5.7.47's components folder, and its classes ship only when used.
- Dome Gallery: tile and opened radius 0 (site is sharp everywhere), grayscale off, 640px optimized thumbnails, 1080px for the opened piece. An opened piece is shown whole (object-fit contain, no drop shadow) instead of cropped to the portrait frame.
- The dome's backdrop is transparent so the CAN particles stay visible around it; its edge fades still blend into carbon.
- The dome is one tab stop: arrow keys turn it, Enter or Space opens the piece in front, Escape closes. Its 175 tiles repeat the 54 pieces, so they are not individual tab stops; screen readers get the grid, which lists each piece once with filters.
- Dome by default with a mouse at 768px and up; grid by default on touch, under 768px and with reduced motion. The button under the dome switches views on every screen size.
- The dome is full-bleed, viewport-high and pinned for half a screen of scrolling on desktop only (pinning a drag surface on touch would trap the page).
- The dome component (and @use-gesture) loads only when the section is within 800px of the viewport.

## AI data, Experience, Contact, footer, nav, cursor, project pages

- Curved Loop tools come from the CV tool groups, in the brief's order (design tools first); Atlas Capture and Ginger 2025 are platforms and left out. The band is aria-hidden and the same list is a visually hidden list under the section heading.
- Curved Loop fontSize is in SVG units (the band is 1440 units wide and scales with the screen), so "72 desktop / 40 mobile" is read as on-screen size: 72 on desktop, 120 units on phones (about 30px on screen). scrollBoost 0.2 and edgeFade 0.25: scrolling clearly speeds the loop and the ends fade, without the text blurring past.
- The vendored Curved Loop drops its min-h-screen wrapper (it would add a full empty screen) and colours every star, not only the one between repeats.
- AI data cards and Experience entries use the shared item reveal; the finished clip-path is cleared so tilted cards are not clipped.
- The Experience line is an SVG path with pathLength 1, so the dash scrub works at any height; with reduced motion or no JavaScript it is simply drawn.
- Contact orb drifts half way toward the cursor and dims as the particles gather (one small orb of every particle is very bright), so links under it stay readable. Pointer repel fades out while the orb forms. On touch the orb stays centred.
- Phone and WhatsApp are one row: the number links to a call, with a WhatsApp button beside it. Full-colour brand icons stay (owner's call over the brief's monochrome icons). Values wrap instead of truncating.
- Footer name rises letter by letter, written from scratch (no Vengeance UI code or next-themes). It is aria-hidden because the name is already in the footer as text. One line from 768px, three lines on phones.
- Nav text roll is CSS only, written from scratch (no Skiper UI): letters roll to a second copy with a 22ms stagger on hover and keyboard focus; off on touch and with reduced motion. The Contact button keeps its existing style.
- Custom cursor: mouse only, off with reduced motion. The system cursor stays visible (precise clicks, OS cursor settings); the dot trails it. The dot uses difference blending; the labelled circle is solid scene ink or stone, because a blended circle turns pink over the moss band. Labels: View (work menu), Drag (dome), Open (gallery and project screenshots).
- Project pages: a moss panel wipes up off the page in 0.6s, from work/[slug]/template.tsx with a CSS animation. It runs when a project page mounts (client navigation or load), never blocks the router, and is off with reduced motion.
- Project screenshots sit in daisyUI browser frames (the bar shows the project name, not an invented URL) and phone frames, both square. The phone camera notch is left out: with square corners it reads as a bar covering the screenshot.
- Full-page screenshot regions get data-lenis-prevent so the wheel scrolls inside them.
