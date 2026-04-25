# Growing the design system

Default answer to "should we add X?" is **no.** The burden of proof is on the person proposing the addition. This document makes that burden concrete.

## Why this exists

Every Valxon product (vmp, sales-coach, prototypes, future apps) consumes this package. Each addition here ripples to every consumer; each consumer-side variant ripples to every reviewer who has to remember which one to use. Both kinds of growth feel individually justified — but compound into bloat that defeats the unification the design system exists to provide.

Real cases that informed this discipline:

- ✓ **`radius-hero` token added** ([#5](https://github.com/Valxon/design-tokens/issues/5)). vmp and sales-coach independently reached for `rounded-2xl` (raw Tailwind, 16px) on hero brand surfaces. Two products, no token to express the need. Passed the test.
- ✓ **`brand-assets/*` subpath shipped** ([#7](https://github.com/Valxon/design-tokens/issues/7)). Brand-mandated catalog. Both products had been inventing their own bubble shapes. Passed the test.
- ✗ **`Button size="lg"` rejected** in sales-coach. Only 1 callsite (login CTA, slightly smaller than vmp's). No second use case existed. Failed the test → live with the visual delta until evidence accumulates.

## The reuse-first principle

Before proposing an addition, the proposer must show they considered:

1. **Can the existing tokens/variants/assets express this?** Including via composition, opacity modifiers (`text-malina/40`), or arbitrary values backed by *existing* package tokens (`pl-[var(--layout-sidebar-width)]`).
2. **Can a documented rule cover this case?** A new pattern in `docs/` is cheaper than a new variant in code. Documentation has zero ongoing maintenance cost; variants do.
3. **Is the perceived gap actually a brand requirement, or a personal preference?** Aesthetic discrepancies between products are sometimes acceptable for an internal tool vs a customer-facing one. Not every visual difference needs to be eliminated.

Default to documenting rather than codifying.

## When to add a new VARIANT to a consumer UI kit

E.g. a new `Button size="lg"` in `app/components/ui/Button.tsx`, a new `Card tone`, a new `Chip` shape.

A new variant earns its place only if **all four** are true:

1. **≥2 actual callsites** (not "anticipated"). One callsite is a justified one-off override; the second callsite is the pattern.
2. **Composes existing tokens** — no new typography sizes, radii, shadows, or colors introduced solely to support this variant. If you need a new token to make the variant work, the new token itself must pass the upstream test below.
3. **Solves a SCALE or EMPHASIS need**, not a layout fix dressed up as a component variant. "This needs to be wider here" → fix the layout. "This needs to be visually more prominent" → variant might be justified.
4. **Survives the inverted question:** "if we had this variant from day 1, would we delete the existing variant in favor of it?" If yes, you're really debating whether the default should change — different conversation. If no, the variant is genuinely additive.

Failing #1 is the most common reason to defer. Live with the override or the cosmetic delta until a second callsite proves the pattern.

## When to add a new TOKEN to `@valxon/design-tokens`

E.g. a new color, type size, radius, motion duration, z-index slot.

Stricter — every token here changes the API surface for every consumer. **All four variant criteria above PLUS a fifth:**

5. **The need is brand-team-mandated, OR the gap actively blocks a brand-mandated pattern from being expressible across consumers.**
   - "I think this color would look nice" — fails.
   - "vmp and sales-coach both ship `rounded-2xl` because the package has no 16px radius and the brand calls for chunkier hero surfaces" — passes.
   - "The brand manual specifies a new tone for status indicators" — passes.

For tokens, the bar is: **at least one downstream consumer has already worked around the gap with a raw value AND is willing to swap to the new token once it ships.** Anything looser is speculative.

## When to add a new ASSET to `brand-assets/`

E.g. a new SVG silhouette, a new logo variant.

Brand-team decision only. Engineers do not add brand assets — they file an issue against this repo describing the use case, and the brand team decides whether the asset enters the catalog.

The catalog is intentionally small (4 silhouettes today) and stable. Growing it requires brand-strategy justification, not just "I needed something different on this screen." If a downstream app needs a one-off graphic that doesn't exist in the catalog, that's a sign the screen probably shouldn't be using a brand silhouette there at all — use plain typography or layout instead.

## Workflow

| Type of addition | Where to start |
|---|---|
| Variant in a consumer UI kit | PR description in the consumer repo. Reviewer applies the 4-criteria test. Merge or defer. |
| Token in `@valxon/design-tokens` | Open an issue here, label `proposed-token`. Brand + engineering review. PR only after the issue is approved. |
| Brand asset in `brand-assets/` | Open an issue here, label `proposed-asset`. Brand-team only. PR only after the issue is approved. |

## Pruning (the inverse case)

Growth without removal is bloat. Once a year (or whenever the catalog feels heavy):

- Variants in consumer UI kits with **fewer than 2 callsites** after 6 months of being merged — candidate for removal. Reviewer asks: "if we removed this, would the one callsite that uses it survive with an existing variant + a small override?" If yes, remove.
- Tokens in this package with **zero callsites across all consumers** — candidate for removal. Bump major version (or minor with a deprecation period if consumers are pinned via tag).
- Brand assets with no usage — same: brand-team review, then remove.

A design system that only grows is a design system that's failing.

## Out-of-scope (don't apply this doc to)

- Bug fixes (typos, broken classes, wrong color value) — just fix them.
- Documentation improvements — just write them.
- Accessibility fixes — just fix them.

The criteria above are about **expanding the API surface**, not about repairing it. Don't let governance get in the way of obviously-correct fixes.
