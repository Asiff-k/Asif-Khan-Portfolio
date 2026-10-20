# Cinematic upgrade: report

Branch `cinematic` (not merged into `main`; production is untouched).

## Preview

- Branch preview (always the latest `cinematic` deploy):
  https://asif-khan-portfolio-git-cinematic-asiffkhanx007-4901s-projects.vercel.app
- Vercel has Deployment Protection on for previews, so the link asks for your Vercel login. Production (asiffkhan.vercel.app) still serves `main`.
- Every phase commit built and deployed on Vercel. GitHub shows no Deployment entries for this project; the Vercel commit status on each commit links to its deployment page.

| Phase | Commit | Vercel |
| --- | --- | --- |
| P0 + P1 | 52a6aa4 | Deployment completed |
| P2 | 4ebbdcf | Deployment completed |
| P3 | bb36b1b | Deployment completed |
| P4 | d12680a | Deployment completed |
| P5 | b42047b | Deployment completed |
| P6 | 161cfcc | Deployment completed |
| Report | (this commit) | Builds after push |

## What each phase built

**P0 Setup.** three, @react-three/fiber, drei, gsap and lenis at pinned versions. Lenis smooth scroll synced with GSAP ScrollTrigger. House lights: each home section is marked light or dark, and the page palette switches as sections cross the middle of the screen. Film grain, a vignette for dark scenes, and progressive edge blur (written from scratch, as you asked). Reduced-motion and device-tier hooks.

**P1 Hero.** One fixed WebGL canvas behind the page, loaded lazily after first paint. Particles assemble from a random cloud into an "ASIF" wordmark (Manrope 800) and breathe. The mouse repels them. A letterbox intro plays on the first visit in a session (768px and wider): the bars retract, then the headline rises line by line, all within 2s. The hero uses your Asif-4 photo.

**P2 Scroll world.** Particle formations scrub with scroll: name, then field (Skills, Work), can (Design), sphere (AI data), field again (Experience, so the dense sphere never sits behind reading text), then a small orb (Contact). Headings rise out of a mask. Images open with a clip-path reveal and a slow scale-down. The Skills screenshots tilt slightly under the mouse.

**P3 Work.** React Bits Flowing Menu for mouse users at 768px and up: moss band, stone text, square thumbnails, index, meta and arrow. Phones and touch screens keep a plain list that goes straight to each project, with a one-line summary. "Also on GitHub" is unchanged.

**P4 Design.** A procedural can formation in particles. React Bits Dome Gallery with your 54 pieces: square tiles, full colour, small thumbnails, and the full image only when a piece is opened (shown whole, not cropped). It works by keyboard (arrow keys turn it, Enter opens the piece in front, Escape closes) and is pinned at full viewport height on desktop. A button under the dome switches to the existing filtered grid; phones get the grid first and can choose the dome. daisyUI is set up, scoped to `mockup` and `diff` with the `d-` prefix and no themes.

**P5 AI data, Experience, Contact, footer, nav, cursor, project pages.** React Bits Curved Loop band of your tools, with the same list hidden for screen readers. The AI data cards reveal in a stagger and tilt. Experience gets a moss timeline line that draws as you scroll. At Contact the particles gather into an orb that drifts toward the cursor. Phone and WhatsApp are one row, full-colour icons are kept, and nothing truncates. The footer gets an oversized "ASIFUL HASAN KHAN" rising letter by letter. The nav links get a text-roll hover. A mouse-only cursor dot grows to a labelled circle (View, Drag, Open). Project pages get a 0.6s moss panel wipe, and screenshots sit in square browser and phone frames.

**P6 Performance and accessibility.** See the measurements below and the P6 decisions. In short:

- **House lights rebuilt.** The original approach cost about 100ms per frame during every scene change.
- **Less work on load.** The motion library is out of the first load, images no longer hydrate, the design grid renders on the server, and reveal setup moved to idle time.
- **Dome made cheaper.** Fewer tiles, hidden when off screen, no blur over it.
- **Contrast and focus fixes.** Two low-contrast labels, high-contrast mode, and a focus ring on the work menu links.

**Bugs found and fixed along the way:**

- The home page crashed when loaded already scrolled (for example `/#design`).
- Scroll-trigger refreshes could cut a nav anchor jump short.
- The dome's arrow keys produced NaN rotation (its gesture library also listens to arrow keys).
- The cursor kept a stale label after scrolling.

## Measurements

All numbers are from a local production build (`next build` + `next start`).

### Lighthouse, mobile (home page)

Before = `main` at the start of this work (median of 3 runs). After = final build (median of 6 runs, with the range).

| | Before | After (median) | After (range) | Target |
| --- | --- | --- | --- | --- |
| Performance | 68 | 85.5 | 75 to 90 | at least 80: met on the median |
| Accessibility | 96 | 100 | 100 | at least 95: met |
| Best Practices | 100 | 100 | 100 | |
| LCP (simulated) | 3.87s | 3.00s | 2.62s to 4.14s | under 2.5s: **not met** |
| TBT | 882ms | 381ms | 262ms to 434ms | |
| CLS | 0 | 0.002 | 0.002 | under 0.05: met |
| FCP | 1.22s | 1.39s | | |

About LCP:

- The LCP element is the hero intro paragraph, which is server-rendered.
- In the actual trace it paints at about 0.5s, the same moment as first contentful paint.
- Lighthouse's simulated mobile LCP counts every script requested before that paint, at a slow network and 4x CPU. The estimate therefore swings a lot between runs and depends mostly on the size of the first-load JavaScript, which is now back to its pre-cinematic size.
- It improved from 3.87s, but it is still above 2.5s.

### First-load JavaScript (home page)

| | Files | Raw | Gzipped |
| --- | --- | --- | --- |
| Before | 11 | 741 KB | 236.0 KB |
| After | 11 | 740 KB | 239.8 KB |

That is +3.8 KB gzipped against the 250 KB budget. three.js and React Three Fiber live only in the lazy stage chunk. The Dome Gallery, Flowing Menu, lightbox and motion library also load later, only where they are used.

### Frame rate while scrolling the whole home page

Test machine: this laptop, Intel HD Graphics 520 (Direct3D 11), Edge, real GPU (not headless), 1440x900, mouse-wheel scrolling from top to bottom.

| | Average FPS | Slowest 5% of frames | At 4x CPU throttle |
| --- | --- | --- | --- |
| `main` (no cinematic work) | 60 | 17 ms | not measurable (native scrolling starves the test loop) |
| Cinematic before P6 | 35.5 | 96 ms | 22.1 |
| Cinematic after P6 | 53.4 to 54.0 | 33 ms | 31.5 to 32.7 |

By section after P6:

| Hero | Skills | Work | Design | AI data | Experience | Contact | Footer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 60 | 53 | 59 | 42 | 44 | 57 | 57 | 60 |

The targets (60fps, and 45fps at 4x throttle) are **not met on this laptop**. This GPU is a 2016 integrated one, below the mid-range laptop the brief describes; I had no other machine to test on. Where the time goes:

- **Design and AI data.** The Dome Gallery's 3D image tiles are the cost while the dome is on screen. Removing the dome entirely brings those sections to about 58fps.
- **Particles.** Hiding the WebGL canvas changes FPS by under 1fps, normal or throttled, so lowering the particle count would not help. There is no solid can to drop.
- **4x throttle.** The limit is main-thread work while scrolling (smooth scroll, scroll triggers, the curved text loop).

If you want Design at 60 on this kind of laptop, the remaining option is to reduce the dome further: fewer tiles (24 segments today), or the grid by default with the dome one click away. I haven't done that; it's your call.

### Other checks

- Site QA suite: 133 of 133 checks pass. It covers:
  - every page and project page, links, images, alt text and console errors
  - layout at 320, 375, 390, 768, 1366 and 1920px
  - gallery filters and lightbox
  - mobile menu
  - reduced motion
  - CV download
  - contact links
  - focus outlines
- Keyboard: 51 tab stops on the home page on desktop, every one with a visible focus indicator. The work menu and the dome both work without a mouse.
- Nav anchor links (Work, Design, AI data, Experience, Contact) land consistently from the top of the page.
- Exactly one canvas, no console errors, and no hydration warnings.
- `npm run build`, TypeScript and ESLint pass.

## Things I need from you (TODO(asset))

| Where | What it needs |
| --- | --- |
| `src/components/cinema/formations.ts:63` | Flat can label artwork in `public/design/labels/*.png` (about 1.8:1). With these, the solid aluminium can (lathe mesh with a label sleeve, drag to rotate, click to swap labels) can cross-fade in after the particle can. |
| `src/components/design-showcase.tsx:22` | Before/after pairs in `public/design/process/<name>-raw.jpg` and `<name>-final.jpg` for the daisyUI diff sliders. |
| `DECISIONS.md` (hero) | Optional: `public/images/asif-cutout.png`, your photo with the background removed, if you want the portrait to stand in front of the particles. You asked for the Asif-4 photo, so the hero uses it as is. |

There are no TODO(content) items, and no placeholder text appears on the site.

## Skipped, and why

| Item | Why |
| --- | --- |
| Solid can | No label artwork exists yet (see above). The particle can is built. |
| Diff sliders | No before/after pairs exist yet (see above). |
| Skiper UI (progressive blur, text-roll nav) | You asked me not to use it; both effects are written from scratch. |
| Vengeance UI footer code | Its footer needs gsap plus next-themes; the letter-rise footer is written from scratch instead. |
| shadcn CLI installs | The three React Bits components were copied from their source manually, each keeping its copyright header; the full license is in `src/components/vendor/LICENSE-react-bits.md`. |
| Monochrome contact icons | You chose the full-colour brand icons. |
| 14px rounded corners (Dome Gallery, Flowing Menu) | You chose square corners everywhere. |
| Letterbox intro on phones | It would delay the largest paint on the slowest devices. |
| Particles on phones during load | They load on the first scroll or touch. On a phone the three.js chunk costs several hundred milliseconds of main thread while the page is becoming interactive. |
| Text colours tweening during scene changes | They switch once, mid-fade. Tweening them cost about 100ms per frame on the test laptop; the backdrop still fades smoothly. |

## Screenshots

Each scene is saved in `.cinematic-shots/` (gitignored, local only), captured in a real GPU browser:

- Desktop, 1440px: `hero.png`, `skills.png`, `work.png`, `design.png`, `ai-data.png`, `experience.png`, `contact.png`, `footer.png`.
- Phone, 390px: the same names with a `phone-` prefix.

## Decisions

The full list, one line each, is in `DECISIONS.md` and reproduced here:

### Setup
- Packages pinned to releases at least two weeks old (three 0.186.1, @react-three/fiber 9.8.1, @react-three/drei 10.7.9, gsap 3.15.0, lenis 1.3.26) for stability.
- The body is the single fixed backdrop: its background follows `--scene-bg`, so no extra full-screen layer is needed. (Superseded in P6: a transparent fade layer now carries the transition; see the P6 section.)
- House lights are page-wide CSS variables (`--scene-*`), so backdrop, text and rules always change together and text never sits on the wrong background. (P6: the variables now switch once mid-fade instead of being tweened every frame.)
- Scene-aware Tailwind colours (`bg`, `fg`, `fg-soft`, `fg-muted`, `line`, `line-strong`, `surface`, `accent`, `on-fg`) replace fixed tokens on the home page, header and footer; other pages keep the light palette and look unchanged.
- The home page renders dark before any script runs (`:root:has(main[data-scenes])`), matching the dark hero scene and avoiding a light-to-dark flash.
- Every home section now has the same vertical padding so each scene change happens with the section clearly in view.
- Lenis smooths wheel scrolling only; touch scrolling stays native for natural momentum on phones.
- Lenis is paused inside the image viewer and mobile menu (`data-lenis-prevent`) so their own scrolling and scroll lock keep working.
- Progressive edge blur is written from scratch (no Skiper UI, per your answer): three masked backdrop-blur layers, dark scenes only.
- Edge blur is off on screens under 768px and for reduced transparency: it costs GPU time on phones and is barely visible there.
- Film grain is an inline SVG turbulence tile (no image file), 5% opacity, stepped at about 8fps; static for reduced motion.
- The vignette sits behind the content (above the backdrop and particles), so it darkens the stage but never dims text or buttons.

### Hero and particles
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

### Scroll world

- Native `scroll-behavior: smooth` is switched off while Lenis runs (`html.lenis`); keeping both smoothed every scroll twice and made it lag. Without Lenis (reduced motion) native behaviour applies.
- Formation beats scrub from "top 85%" to "top 15%" of each section, and the particles always show the latest beat that has started, so jumping across sections or reloading mid-page lands on the right formation.
- A hero morph still waiting for its formations is cancelled if the user has already scrolled to a later beat.
- Skills pointer tilt applies only to the app and interface screenshots (two per row), not to posters or the logo grid, to keep it to one new effect.
- Image reveals use clip-path plus a slow scale-down; content stays visible without JavaScript and with reduced motion.
- Experience gets its own beat (sphere back to field) so the dense sphere never sits behind reading text; Contact then gathers the field into the orb. Light-scene particle opacity is 0.18.

### Work (Flowing Menu)

- Flowing Menu shows only with a mouse at 768px and up (CSS media query reserves its space, so no layout shift; P6 made the menu itself client-only). Touch and narrow screens keep the plain list: tap goes straight to the project page, with a one-line summary.
- Its background is transparent and its text and divider colours follow the scene variables, so the particle field shows through and the house lights still apply. The marquee band is moss with stone text.
- Thumbnails in the band use the Next image optimizer at 640px wide, not the full-size covers.
- The component's own load-in sweep (intro) is off: it runs on mount, before the section is on screen. The heading reveal covers the entrance.
- Index and meta labels in the component are aria-hidden, as shipped; the project pages carry that information.
- React Bits source is kept with its copyright header; the full license text is in src/components/vendor/LICENSE-react-bits.md.

### Design (screening room)

- CAN is a procedural lathe profile (domed base, body, tapered neck, lid rim) sampled by surface area in plain JS, not MeshSurfaceSampler: same result without building a mesh, and three.js stays inside the lazy stage chunk. It sits right of centre so the heading stays clear.
- Solid can skipped: there are no label files in public/design/labels. TODO(asset) in src/components/cinema/formations.ts.
- Before/after diff sliders skipped: there are no pairs in public/design/process. TODO(asset) in src/components/design-showcase.tsx. daisyUI is set up (include: mockup, diff; prefix d-; themes false); those are the file names in daisyUI 5.7.47's components folder, and its classes ship only when used.
- Dome Gallery: tile and opened radius 0 (site is sharp everywhere), grayscale off, 640px optimized thumbnails, 1080px for the opened piece. An opened piece is shown whole (object-fit contain, no drop shadow) instead of cropped to the portrait frame.
- The dome's backdrop is transparent so the CAN particles stay visible around it; its edge fades still blend into carbon.
- The dome is one tab stop: arrow keys turn it, Enter or Space opens the piece in front, Escape closes. Its tiles (120 since P6) repeat the 54 pieces, so they are not individual tab stops; screen readers get the grid, which lists each piece once with filters.
- Dome by default with a mouse at 768px and up; grid by default on touch, under 768px and with reduced motion. The button under the dome switches views on every screen size.
- The dome is full-bleed, viewport-high and pinned for half a screen of scrolling on desktop only (pinning a drag surface on touch would trap the page).
- The dome component (and @use-gesture) is not in the first load. (P6: on desktop it mounts once the page is idle after load; elsewhere when the section is within 800px.)

### AI data, Experience, Contact, footer, nav, cursor, project pages

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

### Performance and accessibility (P6)

- House lights no longer tween the palette variables on <html>: measured on the test laptop (Intel HD 520), that restyles and repaints the whole page at about 100ms a frame, so every scene change stalled for 0.8s. The palette now switches once at the midpoint, and a fixed layer carries a continuous 0.8s opacity fade (incoming colour over the old background, then outgoing colour over the new one). At rest the layer is transparent and the page background is the real scene colour.
- A scene trigger that fires for the scene already showing does nothing (the hero's trigger used to re-run a full fade on load).
- The motion library (used by the lightbox gestures) is out of the first load: the lightbox loads on first use, prefetched when the pointer or focus reaches the thumbnails, and the mobile menu uses CSS transitions (the closed panel is visibility hidden, out of the tab order).
- next/image is a client component, so every image hydrated. Page images and logos are now plain <img> elements from getImageProps (same srcset and sizes). The design grid's 54 thumbnails render on the server; one small client controller handles filters (data attribute plus CSS), the live count and the lightbox.
- Blur placeholders only on the priority hero image; each one is an SVG blur filter to paint, and lazy images sit on the frame's surface colour.
- Flowing Menu loads client-side only for mouse users at 768px and up. html.js (set by the inline head script) lets visitors without JavaScript see the plain project list and grid.
- Reveal setup waits for an idle moment, reads all positions before writing any style, skips anything already on screen, and splits a heading into lines only as it reaches the bottom edge.
- On touch devices the particle stage loads on the first scroll or touch (three.js evaluation costs a phone several hundred milliseconds of main thread during load). Mouse devices still load it when the browser is idle.
- JetBrains Mono (labels only) is not preloaded, so the hero text fonts get the early bandwidth.
- Dome: 24 segments (120 tiles, was 175), hidden with visibility whenever off screen, its masked backdrop-blur ring removed, and the page's edge blur switched off while the dome is on screen. Together these took the sections around it from about 25-30fps to 42-59fps on the test laptop.
- The dome mounts once the page is idle after load (desktop), and ScrollTrigger refreshes wait until scrolling stops: a refresh restores the scroll position from when it started, which cut anchor jumps short.
- Particle count was not lowered: hiding the canvas entirely changed scroll FPS by under 1fps, normal and at 4x CPU throttle, so particles are not the bottleneck. There is no solid can to drop.
- Gallery and AI tools filter counts no longer use 70% opacity (3.8:1 contrast on the dark surface).
- prefers-contrast: more applies darker secondary text and stronger rules to the scene palettes too (paletteFor in src/lib/scene.ts), not only to the static tokens.
- Flowing Menu links get an explicit focus ring: the component's outline-none class cancels its own focus outline in Tailwind 4.
- The cursor label is re-checked on scroll, so it does not keep the label of an element that scrolled away.

## Files changed against main

Added:
- `DECISIONS.md`, `CINEMATIC_REPORT.md`, `public/images/cinema-poster.webp`
- `src/app/work/[slug]/template.tsx`
- `src/components/cinema/`: cinema-root, cursor, footer-name, formations, intro, overlays, page-motion, particles, reveals, scene-director, scroll-world, smooth-scroll, stage-controller, stage-loader, stage, tilt, tool-loop
- `src/components/vendor/`: flowing-menu, dome-gallery, curved-loop, LICENSE-react-bits.md
- `src/components/`: design-showcase, gallery-controller, roll-text, work-menu
- `src/lib/`: gsap, idle, scene, use-media

Changed:
- `.gitignore`, `package.json`, `package-lock.json`
- `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`
- `src/components/`: design-gallery, lightbox, logo-mark, media-image, project-shots, section-head, site-footer, site-header, tool-directory
- `src/content/site.ts` (Phone and WhatsApp merged into one row; same number and links)

## Not done, by design

- Nothing merged into `main`, and production is not touched.
- No force-push or history rewrite, and no changes to Vercel settings or environment variables.
- None of your content was deleted; copy, data, routes and section order are unchanged except where the brief asked.
