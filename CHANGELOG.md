# Changelog

All notable changes to Git3D Universe are documented here.

## [1.2.2] - 2026-10-09

### Clean white day theme
- `daylight` is now pure white, with no grey gradient, tinted clouds or pink haze under the terrain.
- Neon-pink and neon-green borders: the plate has a pink outline and a green front edge, and the cards have a pink-to-green gradient border on a solid white background.
- Light, crisp neon colours: sky blue `#3ec5ff` → fresh green `#4ee66a` → lavender `#b77cff` → bubblegum pink `#ff5fd2`, with a tangerine `#ff8a1f` peak day. Bar tops are outlined in a deeper shade of their own colour.
- New theme tokens `borderA`, `borderB` and `rim`. The night theme looks the same as before.

## [1.2.1] - 2026-10-09

### Fixed
- Planet names are never cut off. Before, the scene was split into front and back halves along a horizontal line, so a name could straddle the line and have part of it drawn behind the terrain. Now each planet and its name switch between the back and front layers together, as one unit.
- Names show only while a planet is in front of the terrain. A planet behind the terrain is drawn without its name, rather than with a name partly hidden by the bars.

## [1.2.0] - 2026-10-09

### Radium (neon) colour schemes
- `aurora` (night): fluorescent colours on a near-black sky. Activity goes neon blue `#00b7ff` → neon green `#39ff14` → neon purple `#bc13fe` → neon pink `#ff10f0`, and the peak day glows radium yellow `#e6ff00`.
- Night mode outlines each bar top in a lighter tint of its own colour, like a neon tube (new `neonEdges` theme flag).
- `daylight` (day): slightly deeper neons that stay readable on white (`#0091ff` → `#1fc700` → `#a100ff` → `#ff00b8`), with a neon-orange `#ff6a00` peak.
- Each activity level has its own colour, so busy profiles show an even mix.
- Planets always use the theme's neon palette, one distinct colour each, instead of GitHub language colours. They have a stronger neon halo at night.

### Fixed
- Planet labels now share their planet's depth layer. When a planet passes behind the terrain, its name is hidden with it instead of floating on top of the grid and bars.

## [1.1.0] - 2026-10-08

### 3D scene redesign
- Hero layout: the terrain now runs corner to corner on a 1280×760 canvas. Cells are about twice the size, the camera is lower, and bars stand up to about 185px tall.
- Colour levels follow the quartiles of active days (new `levelByRank`), so one very busy day no longer pushes every other day into the lowest colour.
- Cards moved into the corners the terrain leaves empty: identity and stats top-left, intensity and peak bottom-right.
- Stronger contrast between bar tops and sides.
- Planets are lit 3D spheres: a highlight toward the scene light, tilted cloud bands and a drifting storm spot, a terminator shadow, a specular glint, and an atmosphere rim. The lead planet has a banded ring that casts a shadow on the body. Repos without a language colour get a colour from the new `planets` theme palette.
- Orbits are much clearer: each one has a soft glow, a crisp core line and a fine highlight line (new `ringHi` theme token). The near half is brighter than the far half, the outer orbit is drawn as round dots, and in animated mode a light pulse travels along each near half.
- Empty days now take a soft colour band that drifts across the year (new `floor` theme token), so the whole year reads as a solid shape even on quiet profiles.
- Orbits now have real depth: rings are split into far and near arcs, and planets pass behind the terrain on the far side and in front of it on the near side.
- Planets scale with distance (larger when near), have a soft atmosphere and rim highlight, and the most-starred repository gets its own ring.
- Planet labels show star counts, stay above the scene, and dim on the far side instead of being clipped.
- Added a light beam and callout above the busiest day.
- Added month labels along the front edge of the plate.
- The plate now has a ground shadow, a front rim light, a gradient top, and shades only the faces that point toward the viewer. Before this, the hidden right-end face was shaded.
- Added a fading floor grid, background nebula clouds, and gently twinkling stars (animated mode only).
- Redesigned the stats card: eyebrow title, fixed the sparkline drawing over its caption, gradient area fill, and an end-point marker.
- Replaced the loose legend with a legend card: the intensity ramp drawn as small 3D prisms, the peak day, and a note on what planet size means.
- Added `<title>` and `<desc>` for screen readers.
- New theme tokens: `nebulaA`, `nebulaB`, `grid`, `shadow`.
- Regenerated the preview SVGs from the renderer.

### Fixed
- Repo fields are normalised before rendering, so a non-numeric star count or a missing repo name can no longer produce broken geometry or a crash.

## [1.0.1] - 2026-10-04

### Dark theme and documentation patch
- Improved `aurora` dark-theme terrain contrast.
- Added visible contribution-cell edges for clearer 3D grid separation.
- Improved visibility of low-activity and empty grid cells in dark mode.
- Preserved the existing daylight theme.
- Added rendering test coverage for terrain edge styling.
- Updated profile usage documentation for the `v1.0.1` Marketplace release.


## [1.0.0] - 2026-10-02

### Marketplace release
- Prepared the first stable GitHub Marketplace release.
- Added reusable composite Action metadata.
- Added security, privacy, EULA, provenance, and third-party licensing documentation.
- Added CodeQL, Dependabot, CI hardening, release automation, and structured issue/PR templates.
- Added timezone-aware profile workflow guidance with automatic daylight/aurora theme selection.
- Added deterministic sample preview guidance.

## [0.1.0]

### Initial project
- Added the 3D isometric contribution renderer.
- Added aurora and daylight themes.
- Added deterministic rendering and GitHub GraphQL profile retrieval.
- Added CLI usage and automated tests.
