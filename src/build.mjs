import StyleDictionary from "style-dictionary";
import { mkdirSync, writeFileSync, copyFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

async function main() {
  mkdirSync(DIST, { recursive: true });

  const sd = new StyleDictionary("style-dictionary.config.mjs");
  await sd.buildAllPlatforms();

  // Generate .d.ts for the TS entry (Style Dictionary doesn't emit types).
  writeTypesStub();

  // Copy the static fonts/next helper — hand-written, not generated.
  copyFonts();

  // Copy raw brand-asset SVGs + manifest into dist/brand-assets/.
  copyBrandAssets();

  console.log("✓ build complete");
}

function writeTypesStub() {
  const dts = `/* Auto-generated companion types for dist/index.js. */

export declare const color: Readonly<{ [k: string]: string }>;
export declare const surface: Readonly<{ [k: string]: string }>;
export declare const text: Readonly<{ [k: string]: string }>;
export declare const font: Readonly<{
  family: Readonly<{ [k: string]: readonly string[] }>;
  weight: Readonly<{ [k: string]: number }>;
  size: Readonly<{ [k: string]: string }>;
  "line-height": Readonly<{ [k: string]: number }>;
}>;
export declare const spacing: Readonly<{ [k: string]: string }>;
export declare const layout: Readonly<{ [k: string]: string }>;
export declare const radius: Readonly<{ [k: string]: string }>;
export declare const shadow: Readonly<{ [k: string]: { offsetX: string; offsetY: string; blur: string; spread: string; color: string } }>;
export declare const border: Readonly<{ [k: string]: { width: string; style: string; color: string } }>;
export declare const duration: Readonly<{ [k: string]: string }>;
export declare const easing: Readonly<{ [k: string]: readonly number[] }>;
export declare const breakpoint: Readonly<{ [k: string]: string }>;
export declare const zIndex: Readonly<{ [k: string]: number }>;
export declare const opacity: Readonly<{ [k: string]: number }>;
export declare const tone: Readonly<{ [k: string]: { fg: string; bg: string } }>;
export declare const contentWidth: Readonly<{ [k: string]: string }>;
`;
  writeFileSync(join(DIST, "index.d.ts"), dts);

  const emailDts = `export declare const colors: Readonly<{ [k: string]: string }>;
export declare const tones: Readonly<{ [k: string]: { fg: string; bg: string } }>;
`;
  writeFileSync(join(DIST, "email.d.ts"), emailDts);

  const tailwindDts = `/* Auto-generated companion types for dist/tailwind.(cjs|mjs). */
import type { Config } from "tailwindcss";

declare const preset: Pick<Config, "theme">;
export default preset;
`;
  writeFileSync(join(DIST, "tailwind.d.ts"), tailwindDts);
}

function copyFonts() {
  const src = join(ROOT, "src", "fonts", "next.ts");
  const dst = join(DIST, "fonts-next.js");
  const dstDts = join(DIST, "fonts-next.d.ts");
  if (!existsSync(src)) {
    throw new Error(`Expected ${src} to exist.`);
  }
  // For simplicity in v0.1.0 we ship the .ts file transpiled by consumers.
  // Copy as-is; consumers running Next.js will transpile it in their build.
  copyFileSync(src, dst);
  writeFileSync(dstDts, `export declare const sans: import("next/font").NextFontWithVariable;\nexport declare const mono: import("next/font").NextFontWithVariable;\n`);
}

function copyBrandAssets() {
  const srcDir = join(ROOT, "src", "brand-assets");
  const dstDir = join(DIST, "brand-assets");
  if (!existsSync(srcDir)) {
    throw new Error(`Expected ${srcDir} to exist.`);
  }
  mkdirSync(dstDir, { recursive: true });
  for (const file of readdirSync(srcDir)) {
    if (!file.endsWith(".svg") && !file.endsWith(".json") && !file.endsWith(".md")) continue;
    copyFileSync(join(srcDir, file), join(dstDir, file));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
