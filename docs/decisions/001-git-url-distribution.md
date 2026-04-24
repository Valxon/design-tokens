# 001 — Distribute via git URL, not a package registry

**Date:** 2026-04-24
**Status:** accepted

## Context

Valxon has ~5 internal consumers for this package (vmp, sales-coach, valxon-ats, marketing-dashboard, merch-platform-prototype). Publishing to npm (public or GitHub Packages) adds auth, CI, and Renovate setup overhead that does not pay back at this scale.

## Decision

Consumers install via `github:Valxon/design-tokens#vX.Y.Z` — a git-URL dependency. Version pinning uses git tags. The package's `prepare` script runs the Style Dictionary build on every consumer install, so the repo ships sources + build config only; `dist/` is always fresh at install time.

No `NPM_TOKEN`, no npm scope, no GitHub Packages setup, no Renovate token configuration. Vercel's existing GitHub integration authenticates the clone during build.

## Consequences

- **Easier:** zero registry setup. Consumers add one line to `package.json`. Works identically in npm, bun, and pnpm. Private-repo access is handled by GitHub org membership.
- **Harder:** `npm outdated` doesn't surface staleness for git deps. Mitigated by the `check` script that consumers run in CI.
- **Migration path if we outgrow this:** add an npm/GitHub Packages publish workflow; update `package.json` references. No source changes.

## Related

- Spec: `vmp/docs/superpowers/specs/2026-04-24-design-tokens-extraction-design.md`
- Issue: Valxon/vmp#136
