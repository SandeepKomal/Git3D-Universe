# Profile Observatory

Turns your GitHub contribution calendar into a 3D isometric terrain with your top repositories orbiting it as planets. The output is one static SVG, so it works in any README with an `<img>` tag.

- Zero dependencies (Node 18.3+ only)
- Two themes: `aurora` (dark) and `daylight` (light)
- Deterministic output, covered by tests
- Escapes all text and validates colours, so odd repo names cannot inject markup

## Try it without a token

```bash
npm run sample        # writes out/preview-dark.svg and out/preview-light.svg
npm test
```

## Use it on your profile

```bash
GITHUB_TOKEN=<pat with read:user> node src/cli.mjs --user YOUR_LOGIN --out profile/observatory.svg
```

Options: `--theme aurora|daylight`, `--no-motion`, `--sample`, `--help`.

Show both themes in your profile README so it follows the viewer's colour scheme:

```html
<picture>
  <source media="(prefers-color-scheme: light)" srcset="./profile/observatory-light.svg">
  <img alt="Contribution observatory" src="./profile/observatory-dark.svg" width="100%">
</picture>
```

For a scheduled refresh, copy `examples/profile-workflow.yml` into your profile repository.

## Layout

| File | Purpose |
| --- | --- |
| `src/stats.mjs` | Streaks, totals, peak day |
| `src/geometry.mjs` | Projection and prism face visibility |
| `src/themes.mjs` | All colour tokens |
| `src/render.mjs` | Scene composition and SVG output |
| `src/github.mjs` | GraphQL fetch (injectable `fetch` for tests) |
| `src/sample.mjs` | Fake data for previews and tests |

## Originality and licensing

All code and the visual design in this repository were written from scratch for this project. It uses no third-party packages, templates, fonts, images or icons, so there is no third-party licence to carry. It is released under the MIT licence (see `LICENSE`). It only calls GitHub's public API and does not use GitHub logos or artwork. If you add dependencies or assets later, record their licences in a `THIRD-PARTY-NOTICES.md`.

This is a statement of how the project was built, not legal advice.
