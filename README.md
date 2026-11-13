# Al Manar Al Asriya — Website v4

The fourth-generation website for **Al Manar Al Asriya — General Trading & Contracting Co.**,
heavy machinery rental in Kuwait since 2002.

**Design language:** *Luxury JCB Showroom* — a dark, elegant showroom: near-black warm
charcoal, bronze / copper and JCB amber, a ring of spotlights over a dark reflective
floor. The JCB backhoe is presented like a luxury car launch on a rotating circular
platform. Crossed with a rich editorial language: huge heavy stacked display type
(Archivo Black + Playfair Display italic accents), a floating glass pill navigation
with a bronze A/M monogram, bold bronze fact blocks, and bronze-ember ambience that
reacts to the visitor's pointer.

## Highlights

- **Hero** — the real JCB 3CX backhoe loader (downloaded GLB, CC BY 4.0) on a slowly
  rotating illuminated platform: idle auto-rotate, drag to spin with inertia, scroll
  adds turntable rotation plus a camera dolly, with live HUD readouts (rotation /
  camera). The GLB is a single merged mesh; a code re-rig for loader/rear-arm
  articulation was attempted and **rejected** — test renders showed the split tearing
  the loader arm — so the machine is choreographed as a whole, and the HUD only ever
  shows motion that is really happening.
- **Fleet** — six categories (Excavators, Wheel Loaders, JCB Machines, CAT Machines,
  Cranes, Concrete Mixers) with subject-correct photography; every machine prefills
  the WhatsApp quote form. The Excavators section carries a secondary interactive 3D
  scene (textured tracked excavator, rigged in-house) on the dark showroom floor.
- **EN / AR** — full bilingual dictionary with complete RTL layout mirroring.
- **Performance** — lazy-loaded 3D, adaptive DPR step-down, render pausing when
  off-screen or the tab is hidden, `prefers-reduced-motion` respected throughout.

## Stack

Vite + React + three.js + GSAP ScrollTrigger + Lenis. Static build → GitHub Pages
(`main` = source, `gh-pages` = `dist`, base path `/Al-Manar-Al-Asriya-v3/`).

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Model provenance & licences

- **JCB backhoe (hero):** 3D model **"JCB Backhoe Loader 3CX Tractor"** by **Kyle Burton**
  (Sketchfab — https://sketchfab.com/3d-models/5b2d02e1c1c14deba0f9c8d75fff54b6),
  **CC BY 4.0** — commercial use with attribution; the site footer carries the credit
  line and `public/models/jcb-3cx.SOURCE.txt` keeps the provenance with the file.
  Shipped file `public/models/jcb-3cx.glb` is a web-optimised derivative (single merged
  mesh, 152k triangles, texture atlas baked to 1024px, material bake corrected);
  scale/orientation are normalised at load (`src/three/loadJCB.js`). The earlier
  procedural hero model was removed from the site entirely.
- **Excavator (fleet 3D scene):** textured GLB (`public/models/excavator-real.glb`,
  a Fiat-Hitachi-style tracked excavator) obtained as a public download; **no licence
  metadata accompanied the source file**, so treat its licence as unverified — replace
  with a licensed model before any commercial deployment if that matters. Its flat
  mesh layout is re-rigged into slew / boom / stick / bucket pivots in code.
- **CC0 excavator:** "Excavator" by **Iacox**, **CC0** — OpenGameArt
  (https://opengameart.org/content/excavator). Original `.blend` kept in `assets-src/`,
  exported to `public/models/excavator.glb`. **Not used on the site** (retained in the
  repo as a licence-clean fallback).
- **Fleet photography:** Wikimedia Commons / Unsplash (hotlinked, lazy-loaded).

## Facts on this site

Only verified company facts are published: since 2002; Jaleeb Al-Shuyukh,
Al-Sahli Complex, 3rd Floor, Office 47/1, Kuwait; WhatsApp/main +965 9901 5863;
second line +965 9755 8200; email Almanar.kw.jcb2012@gmail.com; hire by day / week /
project, operator included, delivered to site.
