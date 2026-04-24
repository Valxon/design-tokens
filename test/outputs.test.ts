import { describe, expect, it, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const DIST = join(ROOT, "dist");
const require = createRequire(import.meta.url);

describe("build outputs", () => {
  beforeAll(() => {
    execSync("npm run build", { cwd: ROOT, stdio: "pipe" });
  });

  it("emits all expected files", () => {
    const expected = [
      "index.js",
      "index.d.ts",
      "tokens.css",
      "tailwind.cjs",
      "tailwind.mjs",
      "email.js",
      "email.d.ts",
      "fonts-next.js",
      "fonts-next.d.ts",
    ];
    for (const f of expected) {
      expect(existsSync(join(DIST, f)), `missing dist/${f}`).toBe(true);
    }
  });

  it("index.js exports color.antracit with the correct hex", async () => {
    const mod = await import(join(DIST, "index.js"));
    expect(mod.color.antracit).toBe("#35383d");
    expect(mod.color.malina).toBe("#e84248");
  });

  it("index.js surface aliases resolve to color tokens", async () => {
    const mod = await import(join(DIST, "index.js"));
    expect(mod.surface.page).toBe("#f6f8f9");
    expect(mod.surface.sidebar).toBe("#35383d");
  });

  it("index.js tone.attention has malina fg and tinted bg (hex-with-alpha)", async () => {
    const mod = await import(join(DIST, "index.js"));
    expect(mod.tone.attention.fg).toBe("#e84248");
    // Style Dictionary's js transformGroup compresses rgba to hex-with-alpha.
    // #e8424814 ≡ rgba(232, 66, 72, 0.08). Visually identical.
    expect(mod.tone.attention.bg).toMatch(/^#e84248[0-9a-f]{2}$/i);
  });

  it("tokens.css declares --color-antracit and the focus-ring utility", () => {
    const css = readFileSync(join(DIST, "tokens.css"), "utf8");
    expect(css).toMatch(/--color-antracit:\s*#35383d;/);
    expect(css).toMatch(/--color-malina:\s*#e84248;/);
    expect(css).toMatch(/\.focus-ring:focus-visible/);
    expect(css).toMatch(/prefers-reduced-motion:\s*no-preference/);
    expect(css).toMatch(/@keyframes status-pulse/);
  });

  it("tokens.css preserves rgba for tone backgrounds", () => {
    const css = readFileSync(join(DIST, "tokens.css"), "utf8");
    expect(css).toMatch(/--tone-attention-bg:\s*rgba\(232,\s*66,\s*72,\s*0\.08\)/);
  });

  it("tailwind.cjs is require-able and exports theme.extend.colors.antracit", () => {
    const preset = require(join(DIST, "tailwind.cjs"));
    expect(preset.theme.extend.colors.antracit).toBe("#35383d");
    expect(preset.theme.extend.colors.malina).toBe("#e84248");
    expect(preset.theme.extend.fontFamily.sans).toContain("Work Sans");
    expect(preset.theme.extend.screens.lg).toBe("1024px");
    expect(preset.theme.extend.zIndex.modal).toBe("1100");
  });

  it("tailwind.mjs default-exports the same shape as the CJS preset", async () => {
    const mod = await import(join(DIST, "tailwind.mjs"));
    expect(mod.default.theme.extend.colors.antracit).toBe("#35383d");
  });

  it("email.js colors are plain hex strings (no CSS vars)", async () => {
    const mod = await import(join(DIST, "email.js"));
    expect(mod.colors.antracit).toBe("#35383d");
    expect(mod.colors.malina).toBe("#e84248");
    expect(JSON.stringify(mod.colors)).not.toMatch(/var\(--/);
    expect(JSON.stringify(mod.tones)).not.toMatch(/var\(--/);
    expect(mod.tones.attention.fg).toBe("#e84248");
    // hex-with-alpha, per note above
    expect(mod.tones.attention.bg).toMatch(/^#e84248[0-9a-f]{2}$/i);
  });
});
