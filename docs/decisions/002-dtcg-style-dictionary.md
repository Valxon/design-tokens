# 002 — Author tokens as W3C DTCG JSON, build with Style Dictionary

**Date:** 2026-04-24
**Status:** accepted

## Context

We need to generate five outputs from one source: TypeScript constants, CSS custom properties, a Tailwind 3 preset (CJS + ESM), plain-hex JS for email templates, and a Next.js font helper. We also plan (Phase 3) to integrate Figma as the source of truth via Tokens Studio or Figma variables.

Hand-authoring tokens in TypeScript and generating other outputs from that would require rewriting the input layer during Phase 3, while consumers depend on the output layer. That's a hard cutover.

## Decision

Tokens are authored as W3C Design Tokens Community Group (DTCG) JSON under `tokens/*.json`. Style Dictionary v4 reads the JSON and emits all five outputs via custom format functions under `src/formats/`.

DTCG is the format Tokens Studio and Figma variables both export. Phase 3 becomes "point Style Dictionary at Figma-exported JSON" — no package reshape.

## Consequences

- **Easier:** Phase 3 Figma integration is additive, not a rewrite. Outputs change without consumer-facing breakage as long as token names and CSS variable names stay stable.
- **Harder:** contributors edit JSON, not TypeScript. Slightly less ergonomic for type-aware editors. Mitigated by the DTCG schema validation test (`test/tokens-schema.test.ts`) catching typos.
- **Tooling lock-in:** Style Dictionary v4+ is required. Minor Style Dictionary API changes may require format-function updates; major Style Dictionary upgrades may require a patch release of this package.

## Related

- Spec: `vmp/docs/superpowers/specs/2026-04-24-design-tokens-extraction-design.md`
- Issue: Valxon/vmp#136
- DTCG spec: https://www.designtokens.org/tr/drafts/format/
- Style Dictionary v4: https://styledictionary.com/
