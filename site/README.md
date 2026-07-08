# TELEMETREE — the site

An interactive mind-map that visualizes the telemetry research notes as a
connected, expandable tree. A play on words: **telemetry** + **tree**. The map
expands and connects — branches are device categories and ecosystems, and the
roots (Shared Infrastructure) are where different vendors quietly resolve to one
household.

The content is a faithful, condensed rendering of the research in the
repository's top-level `README.md`, which remains the single source of truth.
Every node keeps its section reference (`§`) back into those notes.

## What it does

- **Click any node** to open a detail panel with its summary, the data classes
  it uses, how much control the user actually has, and credited sources.
- **Expand / collapse branches** with the `+` / `−` toggle to drill in or zoom
  out.
- **Filter by data class or by user control.** Filtering by "opt-in" dims the
  whole map except the Linux and privacy-phone cluster — the research's central
  point, made visible.
- **Drag to pan, scroll to zoom.**

## Structure

```
src/
  data/
    types.ts   — node + metadata types
    meta.ts    — the five data classes and the optionality scale
    tree.ts    — the TELEMETREE itself (the content)
  lib/
    layout.ts     — d3-hierarchy tidy-tree layout
    usePanZoom.ts — dependency-free pan/zoom
  components/
    MindMap.tsx     — the canvas: links + node cards
    NodeCard.tsx    — a single node
    DetailPanel.tsx — the slide-in detail view
    Legend.tsx      — legend + filters
    About.tsx       — "how to read it" overlay
```

Adding to the map is just editing `src/data/tree.ts` — the layout, filtering,
and detail panel all derive from that one structure, so future research drops in
as new nodes.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build to dist/
npm run preview     # serve the production build locally
```

No database, no external services — it's a fully static single-page app; all
content ships in the bundle.
