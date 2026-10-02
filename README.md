# Git3D Universe

<p align="center">
  <strong>Turn GitHub activity into a living 3D contribution universe.</strong>
</p>

Git3D Universe generates a self-contained SVG that visualizes a GitHub contribution calendar as a 3D isometric terrain with repository planets, profile telemetry, and activity statistics. It can be used locally as a Node.js CLI or directly as a reusable GitHub Action.

## GitHub Marketplace

Git3D Universe includes a root-level `action.yml` and can be distributed as a public GitHub Action.

Before publishing a stable Marketplace release, use a reviewed release tag or immutable commit SHA in consuming workflows rather than tracking `main`.

## Use as a GitHub Action

```yaml
name: Git3D Universe

on:
  schedule:
    - cron: "17 18 * * *"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Git3D Universe
        uses: SandeepKomal/Git3D-Universe@main
        with:
          username: ${{ github.repository_owner }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          theme: aurora
          output: profile/git3d-universe.svg
```

For production use, replace `@main` with a reviewed release such as `@v1.0.0` or a full immutable commit SHA after the first stable Marketplace release is published.

### Inputs

| Input | Required | Default | Description |
| --- | --- | --- | --- |
| `username` | No | Current repository owner | GitHub username to visualize |
| `github-token` | Yes | — | Token used to query GitHub's GraphQL API |
| `theme` | No | `aurora` | `aurora` or `daylight` |
| `output` | No | `profile/git3d-universe.svg` | Output SVG path |
| `no-motion` | No | `false` | Disable SVG orbit animation |

### Permissions and token handling

Start with the least privilege your workflow needs. The example grants `contents: write` because it is intended to commit the generated SVG back to a profile repository.

The Action passes the supplied token through the `GITHUB_TOKEN` environment variable. It does not place the token in command-line arguments.

The renderer requests GitHub data directly from `https://api.github.com/graphql` and does not use a hosted rendering service.

Depending on the GitHub data being requested and the token available to the workflow, additional user-level read access may be required. Store personal tokens only as encrypted GitHub Actions secrets and never commit them to the repository.

## Local CLI

```bash
npm install
npm run sample
npm test
```

Generate a profile visualization:

```bash
GITHUB_TOKEN=<token> node src/cli.mjs --user YOUR_LOGIN --out profile/git3d-universe.svg
```

Options:

```text
--theme aurora|daylight
--no-motion
--sample
--help
```

## Themes

- `aurora` — dark observatory
- `daylight` — light observatory

## Security properties

The project escapes profile and repository text before inserting it into SVG markup and validates repository language colors before using them as SVG values.

Runtime code currently declares no npm dependencies.

See [SECURITY.md](./SECURITY.md) for vulnerability reporting and the security model.

See [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md) for external Action/dependency and asset notices.

## Repository layout

| Path | Purpose |
| --- | --- |
| `action.yml` | Root GitHub Action metadata and runner wrapper |
| `src/cli.mjs` | Command-line entrypoint |
| `src/stats.mjs` | Contribution statistics |
| `src/geometry.mjs` | Isometric projection and prism geometry |
| `src/themes.mjs` | Theme color tokens |
| `src/render.mjs` | SVG scene composition |
| `src/github.mjs` | GitHub GraphQL data retrieval |
| `src/sample.mjs` | Deterministic sample data |
| `test/` | Unit and rendering tests |

## Copyright and licensing

Copyright (c) 2026 Sandeep Komal Pothu.

Git3D Universe is released under the MIT License. The complete license text is available in [LICENSE](./LICENSE).

The repository currently declares no npm runtime dependencies and does not bundle third-party fonts, images, icons, templates, or rendering libraries. The Marketplace wrapper does invoke the GitHub-maintained `actions/setup-node` action; its license is documented in [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md).

This documentation describes the project's current licensing, provenance, and security posture; it is not legal advice.
