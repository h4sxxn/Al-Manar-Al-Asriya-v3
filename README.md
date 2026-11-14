# Al Manar Al Asriya — Website v4

The fourth-generation website for **Al Manar Al Asriya — General Trading & Contracting Co.**,
heavy machinery rental in Kuwait since 2002.

**Design language:** *Luxury JCB Showroom* — a dark, elegant showroom: near-black warm
charcoal, bronze / copper and JCB amber, a ring of spotlights over a dark reflective
floor. The JCB backhoe is presented like a luxury car launch on its showroom platform.
Crossed with a rich editorial language: huge heavy stacked display type
(Archivo Black + Playfair Display italic accents), a floating glass pill navigation
with a bronze A/M monogram, bold bronze fact blocks, and bronze-ember ambience that
reacts to the visitor's pointer.

## Highlights

- **Hero** — a photographic JCB backhoe loader in the showroom, full-bleed on the
  stage side while the copy keeps the left column: a slow Ken Burns drift on the
  photograph, a scroll parallax while the hero pins, the ember field above it and
  the copy reveals. Static HUD dressing only (unit label + coordinates) — no 3D
  model ships in the hero.
- **Fleet** — six categories (Excavators, Wheel Loaders, JCB Machines, CAT Machines,
  Cranes, Concrete Mixers) with subject-correct photography; every machine prefills
  the WhatsApp quote form. The Excavators section opens with a full-bleed
  photographic showcase of a tracked excavator on the showroom platform, with a
  gentle scroll parallax.
- **EN / AR** — full bilingual dictionary with complete RTL layout mirroring.
- **Performance** — the hero image is a local ~340 KB WebP, preloaded with
  `fetchpriority="high"`; total production build ≈ 1.1 MB (the 3D era shipped
  ~14 MB of GLB). `prefers-reduced-motion` respected throughout.

## Stack

Vite + React + GSAP ScrollTrigger + Lenis. Static build → GitHub Pages
(`main` = source, `gh-pages` = `dist`, base path `/Al-Manar-Al-Asriya-v3/`).

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Image provenance & licences

- **Hero JCB photograph** (`public/images/hero-jcb.webp`) and **fleet excavator
  photograph** (`public/images/fleet-excavator.webp`): generated showroom imagery
  created for this site; both ship as local WebP files (~340 KB each).
- **Earlier 3D era (removed):** the site previously shipped two GLB models — a
  JCB 3CX by Kyle Burton (Sketchfab, CC BY 4.0) as hero and a textured tracked
  excavator in the fleet. Both were replaced by the photographs above on the
  owner's instruction, and the model files, the three.js code paths and the
  footer model credit were removed from the site entirely.
- **Fleet photography:** Wikimedia Commons / Unsplash (hotlinked, lazy-loaded).

## Facts on this site

Only verified company facts are published: since 2002; Jaleeb Al-Shuyukh,
Al-Sahli Complex, 3rd Floor, Office 47/1, Kuwait; WhatsApp/main +965 9901 5863;
second line +965 9755 8200; email Almanar.kw.jcb2012@gmail.com; hire by day / week /
project, operator included, delivered to site.
