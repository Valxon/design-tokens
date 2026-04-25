# Valxon brand assets

Vector silhouettes from the Valxon brand manual (`brand_manual_valxon.pdf` p.8). Use them as oversized abstract motifs that nod to the company's paleontological identity.

## Catalog

| Name | Category | viewBox | Notes |
|---|---|---|---|
| `fossil-jaw` | fossil | 314×116 | Wide horizontal motif — works as a band along an edge |
| `fern-leaves` | leaf | 205×252 | Compact, organic, several internal shapes — focal motif |
| `ginkgo-leaf` | leaf | 244×219 | Single leaf, roughly square — most figurative |
| `dinosaur-footprint` | fossil | 177×213 | Three-toed theropod track — references mascot Vašek the T-Rex |

All assets use `fill="currentColor"`, so they take their color from the surrounding text color (or whatever `color`/`fill` you set on the parent).

## Composition rules

Verbatim from the brand manual (`brand_manual_valxon.pdf` p.9, "Brand assets — Principy"). Czech is the canonical text; English is a translation. The same rules are also encoded machine-readably in `manifest.json` under `compositionRules.rules` (with both `cs` and `en` keys).

1. **Slouží jako textury na pozadí.** — Used as background textures.
2. **Části motivu mohou sloužit jako rozdělovníky sekcí (viz hlavička).** — Parts of the motif may serve as section dividers (see the header). Fragments are OK — you don't have to use the whole shape.
3. **Červené motivy zabírají maximálně 30 % celého formátu.** — Red motifs occupy at most 30% of the entire format.
4. **Motivy se nikdy nepřekrývají a mají vždy podobné měřítko.** — Motifs never overlap and always have a similar scale to each other.
5. **Používají se vždy ve větším formátu než dokument/předmět, na kterém jsou a fungují tak jako abstraktní organické tvary, které zastupují ilustrace či jiné grafické prvky.** — Always used in a format larger than the document/object they appear on, functioning as abstract organic shapes that replace illustrations or other graphical elements.

## Recommended tones per surface

| Surface | Asset color (`text-*` / `fill`) |
|---|---|
| `bg-sv-seda` (light) | `text-mid-seda`, `text-antracit`, `text-malina` |
| `bg-antracit` (dark) | `text-white`, `text-sv-antracit`, `text-malina` |
| `bg-malina` (red) | `text-white`, `text-sv-malina` |

Keep the asset opacity low (≤ 0.1 on light, ≤ 0.15 on dark) so it reads as background texture, not foreground content.

## Consumption (Phase 1 — raw SVG imports)

### Next.js / Webpack / Vite

```tsx
import fernLeaves from "@valxon/design-tokens/brand-assets/fern-leaves.svg"

<Image
  src={fernLeaves}
  alt=""
  aria-hidden
  width={400}
  height={494}
  className="absolute -top-20 -left-20 w-[60%] text-white/10"
/>
```

The `width`/`height` props are required by `next/image` for layout calculation; the `viewBox` in the SVG itself preserves the aspect ratio.

### Inline `<svg>` with `dangerouslySetInnerHTML` (when you need full color control)

```tsx
import fs from "node:fs/promises"
const svg = await fs.readFile(
  require.resolve("@valxon/design-tokens/brand-assets/fern-leaves.svg"),
  "utf8"
)
// Render via dangerouslySetInnerHTML in a server component, etc.
```

### Manifest-driven enumeration

```ts
import manifest from "@valxon/design-tokens/brand-assets/manifest.json"

for (const [name, asset] of Object.entries(manifest.assets)) {
  console.log(name, asset.viewBox, asset.category)
}
```

The manifest also encodes the composition rules under `manifest.compositionRules`, so your linter / Storybook story / design-system page can surface them programmatically.

## Phase 2 (deferred — not in v0.2.0)

A `<BrandPanel>` React helper component that picks 2–3 assets from the catalog, places them per the composition rules, and exposes a small `tone="dark" | "light" | "malina"` API. Build this only when ≥2 downstream apps repeat the same composition pattern. Premature otherwise.

## When you need a new asset

The brand manual ships only the four assets in this catalog. Anything beyond that is a brand-team decision, not an engineering one. Open an issue against this repo so the team can decide whether to ship a new asset upstream — don't add one-off SVGs to your app's `public/`.
