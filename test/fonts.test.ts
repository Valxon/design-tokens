import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("fonts/next helper", () => {
  it("imports Work_Sans and JetBrains_Mono from next/font/google", () => {
    const src = readFileSync(join(import.meta.dirname, "..", "src", "fonts", "next.ts"), "utf8");
    expect(src).toMatch(/from\s+["']next\/font\/google["']/);
    expect(src).toMatch(/Work_Sans\(/);
    expect(src).toMatch(/JetBrains_Mono\(/);
  });

  it("exports sans and mono as named exports", () => {
    const src = readFileSync(join(import.meta.dirname, "..", "src", "fonts", "next.ts"), "utf8");
    expect(src).toMatch(/export const sans\s*=/);
    expect(src).toMatch(/export const mono\s*=/);
  });

  it("requests canonical weight sets", () => {
    const src = readFileSync(join(import.meta.dirname, "..", "src", "fonts", "next.ts"), "utf8");
    expect(src).toMatch(/weight:\s*\["400",\s*"500",\s*"600",\s*"700",\s*"800"\]/);
  });
});
