# @valxon/design-tokens

Valxon design primitives — one source of truth for colors, typography, spacing, motion, and UI tokens used across all Valxon internal apps.

## Installation

This package is distributed via git-URL — no npm registry involved. Pin to an exact tag:

```json
{
  "dependencies": {
    "@valxon/design-tokens": "github:Valxon/design-tokens#v0.1.0"
  }
}
```

`npm`, `bun`, and `pnpm` all natively resolve git URLs. The package's `prepare` script runs the Style Dictionary build on install, so you get fresh outputs every time.

### Vercel deploys

No extra configuration needed. Vercel's GitHub integration already authenticates the clone for private-repo dependencies that live in the same GitHub organization.

## Usage

### TypeScript constants

```ts
import { color, font, spacing } from "@valxon/design-tokens";

const style = {
  background: color.antracit,
  fontFamily: font.family.sans.join(","),
  padding: spacing["card-padding"],
};
```

### CSS custom properties

```css
@import "@valxon/design-tokens/css";

.card {
  background: var(--color-white);
  border: 1px solid var(--color-seda);
  border-radius: var(--radius-card);
}
```

### Tailwind CSS (v3)

```ts
// tailwind.config.ts
import preset from "@valxon/design-tokens/tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx}"],
};

export default config;
```

### Email templates (react-email)

**Do NOT use the `/css` subpath in email templates.** Email clients (Gmail, Outlook, iOS Mail) strip CSS custom properties. Use the plain-hex `/email` export instead:

```tsx
import { colors, tones } from "@valxon/design-tokens/email";

export function OrderConfirmation() {
  return (
    <Body style={{ background: colors.svSeda, color: colors.antracit }}>
      <Section style={{ background: tones.success.bg, color: tones.success.fg }}>
        Order confirmed.
      </Section>
    </Body>
  );
}
```

### Next.js fonts

```ts
// app/layout.tsx
import { sans, mono } from "@valxon/design-tokens/fonts/next";

export default function RootLayout({ children }) {
  return (
    <html lang="cs" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

## What's inside

- **colors** — brand palette, surfaces, text aliases
- **typography** — font families, weights, sizes, line-heights
- **spacing** — card padding, section gaps, content paddings
- **layout** — sidebar width, content max-widths, min-width breakpoint
- **surfaces** — border radii, shadows, border styles
- **motion** — `duration` (fast/base/slow) + `easing` (standard/emphasized/decelerate)
- **breakpoints** — sm/md/lg/xl
- **z-index** — base/dropdown/sticky/overlay/modal/toast/popover
- **opacity** — 6/8/10/16/24/40/60/80
- **tones** — semantic `{ fg, bg }` pairs for success/attention/neutral/danger/warning
- **content-width** — narrow/default/wide/full

Domain-specific tokens (e.g. vmp's `OrderStatus`, Caflou document types) **do not** live here. Keep those in the consuming app and wire their `bg`/`color` values through the `tone.*` tokens.

## Semantic versioning

- **Major** — rename an exported token, remove a token, change a CSS variable name, change the shape of any exported object, drop or rename a subpath export.
- **Minor** — add a new token, add a new subpath, **adjust a hex value within the same semantic intent** (e.g., malina refresh `#e84248` → `#e7414a`).
- **Patch** — internal refactors producing identical output, doc/comment fixes, build-config tweaks.

Use `^` caret ranges so minor hex refreshes land on next install. Pin exactly only if you need a specific snapshot for a demo.

To check whether your pin is stale, add to your CI:

```bash
npx @valxon/design-tokens check
```

Exits non-zero if pinned version is more than 2 minor versions behind latest.

## Contributing

Tokens are authored as W3C Design Tokens Community Group (DTCG) JSON under `tokens/*.json`. Edits go through a PR against `main`; Changesets generates the version bump and release notes.

1. Edit JSON under `tokens/`.
2. Run `npm run build && npm test` locally.
3. Run `npm run preview` and open `docs/preview.html` to eyeball the change.
4. `npx changeset` to record the intent (patch/minor/major + summary).
5. Open a PR. CODEOWNERS review is required.

## License

UNLICENSED — for internal Valxon use only.
