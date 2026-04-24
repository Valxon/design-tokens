import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const TOKENS_DIR = join(import.meta.dirname, "..", "tokens");

type DtcgNode = {
  $value?: unknown;
  $type?: string;
  $description?: string;
  [k: string]: unknown;
};

function walk(node: DtcgNode, path: string[], visit: (node: DtcgNode, path: string[]) => void): void {
  if (node.$value !== undefined) {
    visit(node, path);
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    if (child && typeof child === "object") {
      walk(child as DtcgNode, [...path, key], visit);
    }
  }
}

const VALID_TYPES = new Set([
  "color",
  "dimension",
  "fontFamily",
  "fontWeight",
  "duration",
  "cubicBezier",
  "number",
  "shadow",
  "strokeStyle",
]);

describe("DTCG token files", () => {
  const files = readdirSync(TOKENS_DIR).filter((f) => f.endsWith(".json"));

  it("has at least the expected token files", () => {
    expect(files).toEqual(
      expect.arrayContaining([
        "color.json",
        "typography.json",
        "spacing.json",
        "layout.json",
        "surfaces.json",
        "motion.json",
        "breakpoints.json",
        "z-index.json",
        "tones.json",
        "opacity.json",
        "content-width.json",
      ]),
    );
  });

  it.each(files)("%s parses as valid JSON", (file) => {
    const raw = readFileSync(join(TOKENS_DIR, file), "utf8");
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  it.each(files)("%s: every leaf node has $value and resolvable $type", (file) => {
    const json = JSON.parse(readFileSync(join(TOKENS_DIR, file), "utf8")) as DtcgNode;

    function resolveType(node: DtcgNode, path: string[]): string | undefined {
      if (node.$type) return node.$type;
      // walk up the parent chain via the root
      let parent: DtcgNode = json;
      for (const segment of path.slice(0, -1)) {
        parent = parent[segment] as DtcgNode;
        if (parent?.$type) return parent.$type;
      }
      return undefined;
    }

    walk(json, [], (leaf, path) => {
      expect(leaf.$value, `${file}:${path.join(".")} missing $value`).toBeDefined();
      const type = resolveType(leaf, path);
      expect(type, `${file}:${path.join(".")} cannot resolve $type`).toBeDefined();
      if (type) {
        expect(VALID_TYPES, `${file}:${path.join(".")} has unknown $type "${type}"`).toContain(type);
      }
    });
  });
});
