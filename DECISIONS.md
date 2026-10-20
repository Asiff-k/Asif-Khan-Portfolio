# Decisions (cinematic branch)

One line each: what was chosen and why.

## Setup
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

- Flowing Menu shows only with a mouse at 768px and up (CSS media query reserves its space, so no layout shift; P6 made the menu itself client-only). Touch and narrow screens keep the plain list: tap goes straight to the project page, with a one-line summary.
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
- The dome is one tab stop: arrow keys turn it, Enter or Space opens the piece in front, Escape closes. Its tiles (120 since P6) repeat the 54 pieces, so they are not individual tab stops; screen readers get the grid, which lists each piece once with filters.
- Dome by default with a mouse at 768px and up; grid by default on touch, under 768px and with reduced motion. The button under the dome switches views on every screen size.
- The dome is full-bleed, viewport-high and pinned for half a screen of scrolling on desktop only (pinning a drag surface on touch would trap the page).
- The dome component (and @use-gesture) is not in the first load. (P6: on desktop it mounts once the page is idle after load; elsewhere when the section is within 800px.)

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

## Performance and accessibility (P6)

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

## Monochrome redesign (black and white)

- One black palette for the whole site: page #0a0a0a, surface #141414, rules #262626, strong rules #8a8a8a, text #f5f5f5, secondary text #c4c4c4 and #a3a3a3, accent white. No green anywhere (UI, particles, favicon, social share image, theme colour).
- The old token names (stone, ink, moss, mint, carbon) are kept with new values so every page turned black at once: "stone" is now the black page colour, "ink" the white text colour, moss and mint are white. A comment in globals.css explains this.
- Light/dark scene switching is removed completely (scene director, fade layer, per-section light/dark markers). Every page, including project pages, the AI tools page and 404, is black.
- Links that used to turn green on hover now underline (white on white would show no change). White buttons hover to light grey; pressed filter buttons are white with black text.
- Content images stay in colour: your portrait, project screenshots and design pieces are the work itself, not interface colour.
- Particles are white and grey (additive, 50% opacity). With reduced motion there is no stage and no poster (the old poster was a capture of the green ASIF formation).
- The "ASIF" particle wordmark and the letterbox intro are gone. The hero headline fades and rises in with CSS only (0.9s), so it never waits for JavaScript; reduced motion shows it at once. On load the particles gather into the quiet field.
- The sphere (AI data) and the can (Design) turn about their own vertical axis continuously, one full turn about every 18 seconds, including while they form.
- The contact orb is now a thin white ring of particles that pulses slowly (about 7% in size) and drifts half way toward the cursor.
- The progressive edge blur is limited to the home page: with every page black, it would otherwise blur the top of project pages at rest.
- Dome drag: the pointer, momentum and arrow keys now move a target rotation, and the dome glides toward it every frame (exponential ease, about 110ms behind). After a flick it keeps turning and slows with time-based friction (about 2.5s to rest), so it never stops abruptly. Grabbing it mid-glide catches it where it is, without a jump.
- What I do: the software, UI/UX and graphic design visuals are neutral monochrome illustrations drawn in code (an editor and a terminal; a page wireframe and a design canvas; four abstract posters), not pictures from the internet. Real-world examples found online would be other people's apps and designs placed next to "I build complete web apps…" and links to Asif's projects, which would present their work as his. The brief allowed neutral placeholders when good examples were not available; these are those placeholders. Asif's own screenshots remain on the project pages and in the Selected work menu.
- Dev Journey is removed (with the "Also on GitHub" block it was the only item in): its repository has no screenshots (only the app logo and Flutter's default README), and it is not on the Play Store (the app id is still com.example.dev_journey; the Play listing returns 404).
- The grey panel behind the AI tool logos in What I do is removed; the logos sit directly on the black page.
- All brand logos (AI tools, platforms, contact icons) are shown in greyscale to keep the site black and white. On hover (the logo, its card or its link) and on keyboard focus they scale up 12% and brighten; with reduced motion they only brighten.
- AI bragging removed: the headline is now "I build the software and design the screens." (no "use AI in both"); the hero stamp drops "AI"; "AI tools are part of my daily work" is gone from the intro; the AI tools page headline is "Tools for research, code, design and video."; the footer tagline "with AI in the workflow" is gone; Google Stitch's note "Designing this portfolio." is now "Designing web interfaces."; the UI/UX text names Figma only. The AI tool lists, the AI data projects and your own contact sentence ("works with AI tools every day") stay.
- The "AI-assisted" label on all 54 gallery pieces and the AI sentence in What I do are removed. One factual line stays in the Design section ("The imagery is AI-generated; the composition, type and branding are mine."), so posters with generated imagery are not presented as fully hand-made. Delete that sentence if you prefer; it is the only one left.
- Contact copy replaced with your text (no "final-year", no "in Sylhet").
- One contact area: the footer, on every page, holds "Let's talk", the email, and one list (phone and WhatsApp, GitHub, LinkedIn, Instagram, Facebook, CV). The separate home Contact section, the footer's "Elsewhere" list and the mobile menu's social links are removed, so each social link and the email appear once per page. Header and hero "Contact" links go to #contact on the current page.
- Dome lightened for frame rate: 20 segments (100 tiles, was 120) and 384px tile images (tiles show at about 150px; the opened piece still loads at 1080px). With the scene switching gone, this brought desktop scrolling to about 57fps average with the slowest 5% of frames at 17ms on the test laptop.
- The contact ring is dimmed to 40% brightness when fully formed (every particle packed into one thin circle is otherwise glaring).

## White theme redesign

- The whole site is white with black text: page #ffffff, text #0a0a0a, secondary text #3d3d3d and #5c5c5c (at least 6:1 on white), rules #e3e3e3, strong rules and accents black. Heading rules keep their thickness. The token names stay; their values flipped again.
- Particles are black and grey with normal blending (additive black would not show on white), at 24% opacity so text over them stays easy to read.
- The film grain, the dark vignette and the progressive edge blur are removed. On white the grain read as dirt, and the bottom edge blur is what made the footer name look blurry and glitchy; the name is now sharp.
- The sphere (AI data) and the can (Design) now turn on two axes, like a planet: about one turn every 18 seconds side to side and every 29 seconds top to bottom. The Dome Gallery is unchanged (tilting it further up and down would show its open edges).
- The contact ring is removed; the particles stay as the quiet field through Experience and Contact.
- What I do uses real stock photos from Unsplash (Unsplash License: free to use, no attribution required), chosen to be generic with no visible brands or other companies' products: a laptop with a dashboard and a laptop with code (software), wireframes on a tablet and on paper (UI/UX), and posters and a magazine mockup (graphic design). A small credit line names the photographers so visitors can see these are illustrative stock photos, not Asif's projects. Rejected: a Shopify dashboard, an iMac with the Apple logo, a branded paper sample, a real company's brand identity, real band posters, and one poster with profanity.
- AI tool logos link to each tool's official page and open in a new tab: Perplexity, Gemini Notebook, Claude, Google Stitch (stitch.google.com, as asked), Figma, HeyGen, Synthesia, Colossyan and Atlas Capture.
- Gemini Notebook links to notebook.google.com, its own home, not gemini.google.com (that is the general Gemini chat, a different product). atlascapture.com is a parked domain for sale, so Atlas Capture keeps its official App Store page. Ginger 2025 has no public page and gets no link.
- Logo hover is a gentle float (5px up) with a soft shadow instead of the scale-up.
- Contact is redesigned for white: "Let's talk." with a thin square-in-square line figure that turns slowly, a hairline that draws across the page as it scrolls into view (CSS scroll timeline; drawn at once where unsupported or with reduced motion), then three plain text columns (about, write or call, elsewhere). No icons and no particles behind it; each link still appears once.
- Copy: the hero text is your new introduction. The new facts are placed in What I do (fullstack, Incodet, project-based client work, Product Designer then Team Leader at NextGen, AI/ML and training AI models, daily AI use), in Experience (Incodet, Product Designer at NextGen, the completed CodeSoft internship, project-based client work) and in a new Skills list. Your process sentence leads What I do, and the Design section uses your sentence about AI as inspiration and efficiency.
- "Final-year" is removed everywhere: hero, site description, and Chol Ghuri's role (now "University CSE project").
- Incodet (corrected): it is not Asif's agency. He designed and coded the Incodet website from scratch and designed the UI for two of its client projects, Cipher Shield and KI Training. Experience lists this as project-based work for Incodet, and the NextGen Production website is listed under his NextGen role.
- The Flowing Menu's index and meta labels are raised from 50% to 72% opacity, so they read on white.

## Orbix-style redesign, Part 1 (fixes)

- Dome vertical drag: maxVerticalRotationDeg 35 (was 5). Tested with the real dome: dragging down and up reaches every one of the 10 tile rows. Momentum and the glide already run on both axes.
- Dome idle drift: turns slowly sideways (4 degrees a second) and sways gently up and down (up to 35% of the vertical range). Paused while the pointer is over the dome, while dragging, while it has keyboard focus or a piece is open; off with reduced motion.
- Dome fades lighter: the round edge fade starts at 82% (was 65%) and the top and bottom fades are 40px (were 120px), so more tiles show in full. Tiles are rounded (14px), the opened piece 20px, still shown whole (object-fit contain).
- The full design grid is always visible directly below the dome (no button). On phones the dome is still optional behind a "View as a 3D dome" button, because dragging it fights page scrolling on touch.
- Particles: #121316 and a slightly lighter grey, 60% opacity, 1.6x larger (point size 8, was 5), normal blending. The quiet "field" is now a wide gridded sheet low in the frame that rolls as a slow swell (two crossing sine waves), so it reads as an intentional effect, not dust.
- Readability over particles: paragraphs and list items get a soft halo in the page colour, and once you scroll past the hero the wave eases to 60% of its strength behind the text-heavy sections. The sphere and can keep full strength.
- AI tool logos: the greyscale filter is removed everywhere. All 10 were checked one by one and are the official full-colour marks (App Store icons or the tools' own site icons, 160px, sharp at card size); none needed replacing. Ginger 2025's mark is the app's own icon.
- Gap after the hero: the hero's bottom padding (128px) plus the Skills section's top padding (128px), under a tall portrait, left a near-empty screen. Both are now 48px.
- Hero subline: "Fullstack developer (web and app) and UI/UX designer with hands-on AI/ML experience."

## Orbix-style redesign, Part 2 (global look)

- Page #f7f7f5 everywhere, text #121316, secondary text #3d3e42 and #5d5e62, hairlines #e6e6e3; white is now the card colour. No scene switching.
- Rounded shape system: the sharp-corner reset is removed; tokens --radius-card 22px, --radius-tile 15px, --radius-chip 12px; buttons, badges and chips are full pills.
- Buttons: primary is a black pill with a long, layered soft shadow down and to the left (the Orbix pattern, written from scratch); secondary is a white pill with a hairline border. Filter chips are white pills, black when pressed.
- Headings: Manrope 600 for the hero and display, 500 for section titles, letter-spacing -0.03em, line-height 1.05 to 1.08.
- Section headings sit under a small white pill badge with the section number and name. The hero stamp is a pill badge too. Nav labels are plain sentence case instead of mono capitals.
- Cards: white, 1px border of ink at 6%, very soft shadow, lift 4px on hover (utility classes card and card-lift).
- Motion: headings, items and the new [data-reveal="fade"] elements fade up from an 8px blur to sharp, staggered, expo ease. Nothing bounces. Reduced motion skips them.
- Portrait, project screenshot frames and phone frames are rounded.

## Orbix-style redesign, Part 3 (sections)

Patterns studied from orbix.studio in a browser; nothing of theirs (code, text, images, brand) is used.

- Section order: hero, 01 What I do (stacked panels), 02 Selected work (curved carousel), About statement and numbers, 03 Graphic design (dome and masonry grid), 04 AI tools and data (logo wall and data project cards), 05 Experience (bento), Contact. Routes and anchors (#work, #design, #ai-data, #experience, #contact) are unchanged.
- What I do: four stacked service panels that stick below the header and slide over each other (#121316, #1f3a5f, #d9481f, #3f2bb8, white text). Each has the big title, "/01" style number, one short line, a white pill button, the fuller description and project links, and a row of image cards from Asif's own work: app screenshots (Software), the four client site designs (UI/UX), four posters (Graphic design). There are no AI task screenshots, so the AI panel shows the three data projects as small cards with their platform logos instead of images. The code-drawn illustrations and all stock photos are deleted.
- Selected work: a curved carousel written from scratch. The centre card stands upright and large; neighbours tilt and drop along an arc over a dotted arc line. It loops endlessly so the first project sits in the centre with neighbours on both sides. Drag or swipe with momentum and a soft snap, arrow buttons, Left/Right keys; only the centre card's "View project" link is a tab stop (focusing it brings it to the centre). Pointer capture starts only after a real drag, so a click still opens the project. Replaces the Flowing Menu (deleted).
- About statement: your text, each word turning from light grey to near-black as it scrolls through (scrubbed), with two tilted stickers ("Team Leader at NextGen", "Built Incodet end to end") that pop in at about 30% and 60%. Words are split on the server, so the text is complete without JavaScript and fully dark with reduced motion.
- Numbers row: 54 design pieces, 7 projects, 4 website interfaces designed, 3 AI training data projects. Each is computed from the content data (gallery, projects, projects of kind "UI design", aiDataWork), never typed in. "Website interfaces designed" is used rather than "client websites", because one of the four is NextGen Production's own site, designed while Asif worked there.
- AI tools logo wall: 5 x 2 white rounded cards with the full-colour logos and names, a large soft pastel glow above, and the caption "Tools I use every week" with a soft yellow marker highlight. Cards fade and sharpen in one after another, lift on hover, and the logo grows to 1.05. Links checked one by one: Perplexity, Gemini Notebook (notebook.google.com, the official address; notebooklm.google.com redirects there), Claude, Google Stitch (stitch.withgoogle.com), Figma, HeyGen, Synthesia, Colossyan, and Atlas Capture (atlascapture.io, its official site, which links to the same App Store app; atlascapture.com is a parked domain). Ginger 2025 has no public site and stays unlinked. Dot Lab has no verified logo and is not on the wall (it stays on the AI tools page and in the data projects).
- The Curved Loop band of tool names is removed: the logo wall now shows the same tools, and repeating them read as AI emphasis.
- Experience bento: NextGen Production (large, blue tint), CodeSoft (lavender), Incodet (beige), then white cards for Education, Skills and Languages, and Tools. Each role shows dates and two lines. Education, skills, tools and languages are kept, not removed.
- Design: the full masonry grid (3 columns desktop, 2 tablet, 1 mobile, rounded tiles) is always visible under the dome; each tile goes from blurred to sharp as it scrolls in (IntersectionObserver plus CSS, so filtering keeps working). Filters are white pills. Clicking a tile opens the whole piece.
- Contact: one block at the bottom of every page with clean white rounded cards, one per way to reach you, each with its full-colour icon (Gmail, WhatsApp, GitHub, LinkedIn, Instagram, Facebook; line icons for phone and CV). Every link appears once. The turning line figure and scroll-drawn hairline from the white theme are removed.
- AI mentions: only one line remains, under What I do: "I use AI for ideas and to save time; the design and the build are my own work." Removed: the Design section's AI sentence, "works with AI tools every day" from the contact note, and the AI lines in the What I do copy. Your hero subline (hands-on AI/ML experience) and the About text are your own wording and stay. Factual AI data work stays.
- No testimonials, ratings, awards, client logos or invented numbers.
- Stacked panels stick and slide over each other only where a whole panel fits on screen (768px wide and 820px tall or more). On phones and short laptop screens a panel is taller than the space left under the header, so the next panel would cover its images before you could see them; there they scroll normally.
- Carousel spacing on phones is 80% of the width, so the centre card is clear and the neighbours peek in from the sides.
- Performance: the three nearest carousel screenshots no longer load eagerly (they competed with the portrait for bandwidth); the paragraph halo applies only once the particle stage exists; srcset lists stop at 1920px (deviceSizes 640, 828, 1080, 1440, 1920; imageSizes 96, 192, 384), which cut the home page HTML from 418KB to 381KB.
- Contrast: in the orange panel the inner area is darkened (black at 25%) instead of lightened, so white text there passes 4.5:1. The grey words of the scroll-reveal statement are the intended effect and are the only contrast items Lighthouse still flags (score 96).
