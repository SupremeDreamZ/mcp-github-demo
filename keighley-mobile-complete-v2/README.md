# The Keighley — Mobile Complete v2

A self-contained, mobile-first interactive website about the IMAX Keighley camera.

## Architecture

- Canvas 2D/2.5D renderer written in plain JavaScript
- No Three.js, WebGL library, CDN, build step, Base64 payload, gzip decoder, or network dependency
- Local SVG fallback appears before the first rendered frame
- Runs from a static host or directly from the extracted folder

## Interactive sections

- Scroll-driven camera framing
- Stable exploded anatomy with selectable assemblies
- Sound-blimp and periscope visualizations
- Odyssey operator scene with horizontal pan
- Visible rack-focus simulation between water and ship
- Camera tilt control
- IMAX 1.43:1 and standard 2.39:1 framing
- Film-transport animation and synthesized sound

## QA

Validated structurally for 320×568, 390×844, 430×932 portrait layouts and 844×390 landscape. JavaScript syntax, local references, duplicate IDs, offline dependencies, controls, panel collision measurements, and responsive states were reviewed. File hashes are listed in `manifest.json`.

Open `index.html` to run the experience.
