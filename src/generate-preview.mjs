import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

async function main() {
  const mod = await import(`file://${join(DIST, "index.js")}`);
  const { color, surface, font, tone } = mod;

  const html = render({ color, surface, font, tone });
  mkdirSync(join(ROOT, "docs"), { recursive: true });
  writeFileSync(join(ROOT, "docs", "preview.html"), html);
  console.log("✓ preview written to docs/preview.html");
}

function render({ color, surface, font, tone }) {
  const swatch = (name, value) => `
    <div style="display:flex;align-items:center;gap:12px;margin:4px 0;">
      <div style="width:40px;height:40px;border-radius:6px;background:${value};border:1px solid #ddd;"></div>
      <code style="font-family:monospace;font-size:12px;">${name}</code>
      <code style="font-family:monospace;font-size:12px;color:#666;">${value}</code>
    </div>`;

  const colorSwatches = Object.entries(color).map(([k, v]) => swatch(`color.${k}`, v)).join("");
  const surfaceSwatches = Object.entries(surface).map(([k, v]) => swatch(`surface.${k}`, v)).join("");
  const toneRows = Object.entries(tone).map(([k, v]) => `
    <div style="display:flex;align-items:center;gap:12px;margin:8px 0;">
      <div style="padding:8px 16px;border-radius:8px;background:${v.bg};color:${v.fg};font-weight:600;">${k}</div>
      <code>${k}.bg = ${v.bg}</code>
      <code>${k}.fg = ${v.fg}</code>
    </div>`).join("");

  const sizes = Object.entries(font.size).map(([k, v]) => `
    <p style="font-family:${font.family.sans.join(",")};font-size:${v};margin:6px 0;">
      <code style="font-size:10px;color:#888;">font.size.${k} (${v})</code><br/>
      The quick brown fox jumps over the lazy dog 01234
    </p>`).join("");

  const sha = process.env.GITHUB_SHA?.slice(0, 7) || "local";

  return `<!doctype html><html><head><meta charset="utf-8"><title>Valxon Design Tokens — preview</title>
<style>body{font-family:system-ui,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;color:#222;}
h1{font-size:28px;}h2{margin-top:40px;border-bottom:1px solid #eee;padding-bottom:8px;}
code{background:#f6f8f9;padding:2px 6px;border-radius:4px;}</style>
</head><body>
<h1>Valxon Design Tokens</h1>
<p>Auto-generated from <code>tokens/*.json</code>. Commit <code>${sha}</code>.</p>
<h2>Colors</h2>${colorSwatches}
<h2>Surfaces</h2>${surfaceSwatches}
<h2>Tones</h2>${toneRows}
<h2>Typography</h2>${sizes}
</body></html>`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
