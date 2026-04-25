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

From the brand manual (`brand_manual_valxon.pdf` p.9, "Brand assets — Principy"). Same rules are encoded in `manifest.json` under `compositionRules.rules` for programmatic access.

1. **Use as background textures.** Not as foreground content.
2. **Parts of a motif may serve as section dividers** (see the header pattern in the brand manual). Fragments are OK — the whole shape isn't required.
3. **Red motifs (`malina` / `sv-malina`) occupy at most 30% of the entire format.** Most of the surface stays neutral; red is an accent.
4. **Motifs never overlap, and motifs in the same composition always share a similar scale.**
5. **Always used in a format larger than the document/surface they appear on** — they function as abstract organic shapes that replace illustrations, never as contained images of themselves.

## Tone usage (texture vs accent)

The recommended tones below are split by **role**, not just by background. Most callsites need the texture role; the accent role is rarer and rule-3-capped.

**Texture role (most common).** The motif is felt, not seen. Pick a near-invisible neutral relative to the background:

| Surface | Texture-role color | Effective opacity guideline |
|---|---|---|
| `bg-sv-seda` (light) | `text-mid-seda` | ≤ 0.10 (often the color alone is low-contrast enough; explicit opacity optional) |
| `bg-antracit` (dark) | `text-sv-antracit` or `text-white/10` | ≤ 0.15 |
| `bg-malina` (red) | `text-sv-malina` or `text-white/15` | ≤ 0.20 |

**Accent role (rare, ≤30% of any given panel — see rule 3).** A single highlight motif in `text-malina`. Use as an accent next to a texture-role motif, never as the only motif in the composition.

Never reach for `text-white` on light backgrounds or vice-versa for assets — that violates the texture role.

## Reading the example compositions

The Figma file `Firemní podklady` (node `2376:165`) ships four reference compositions. They aren't part of this catalog (you can't import them), but the numbers in them are calibration data:

- **Asset scale.** The visible motif is roughly 80–120% of the card's longer edge. The original SVG is placed at ~1.5–2× the card size, with negative offsets (path coords go to `-130` etc.) so most of the asset bleeds off-frame. **Aim for *fragment, not portrait*.**
- **Coverage.** Typically 1 motif per panel, sometimes 2. Never more.
- **Contrast.** On the dark and red examples the motif is in `sv-antracit` on `antracit` (or `sv-malina` on `malina`) — barely visible by design. On the light example it's `mid-seda` on `sv-seda`. Same intent.
- **Position.** The motif is anchored to a corner or edge with negative offsets so the curve flows in from outside the frame. **No example uses a centered placement.** Don't be the first.

## Anti-patterns — don't

These are recurring traps that future contributors (humans + LLMs) reach for. None of them are on-brand:

- ❌ **Whole motif inside the frame at small scale** — the "leaf-as-illustration" trap. It looks like a logo or icon, not a texture. Violates rule 5.
- ❌ **Inventing your own organic shapes.** Pre-codification, vmp's auth layout used a hand-drawn `BrandTexture` component (abstract bubbles) and sales-coach mirrored it verbatim. Both were off-brand. Use the four catalog assets, period — if you need a new asset, file an issue against this repo so the brand team decides.
- ❌ **Using `bg-[radial-gradient(...)]` overlays in place of brand assets.** Different visual treatment, doesn't carry the paleontological identity.
- ❌ **Stacking assets on top of each other** — violates rule 4 (no overlap).
- ❌ **Mixing wildly different scales in one composition** — also rule 4 (similar scale).
- ❌ **Treating `naturalAspect` from the manifest as a layout dimension.** It's metadata for tooling (e.g. validating that your absolute-positioned `<Image>`'s `width`/`height` props honor the asset's intrinsic aspect). Not a sizing prescription — the asset is meant to be scaled past the frame.

## Worked example: dark brand panel with one neutral fern + one red ginkgo accent

This is the canonical pattern for the auth-screen brand panel in vmp / sales-coach. Paste-ready:

```tsx
import Image from "next/image"
import fernLeaves from "@valxon/design-tokens/brand-assets/fern-leaves.svg"
import ginkgoLeaf from "@valxon/design-tokens/brand-assets/ginkgo-leaf.svg"

<div className="relative overflow-hidden bg-antracit">
  {/* Texture-role motif: large, near-invisible, anchored top-left, bleeds off-frame */}
  <Image
    src={fernLeaves}
    alt=""
    aria-hidden
    width={205}
    height={252}
    className="absolute -top-20 -left-32 w-[80%] h-auto text-sv-antracit"
  />
  {/* Accent-role motif: smaller, malina red, anchored bottom-right, also bleeds off-frame */}
  <Image
    src={ginkgoLeaf}
    alt=""
    aria-hidden
    width={244}
    height={219}
    className="absolute -bottom-24 -right-20 w-[40%] h-auto text-malina"
  />
  {/* foreground content goes here, above both motifs */}
</div>
```

Why this is on-brand:
- Fern is the texture-role motif (rule 1) in the neutral `sv-antracit` (texture-role tone)
- Ginkgo is the single red accent (rule 3 — covers ~12% of the panel, well under 30%)
- Neither motif overlaps the other (rule 4 — they're in opposite corners)
- Both bleed off-edge (rule 5 — negative `top`/`left`/`bottom`/`right` offsets, scale > frame)

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
