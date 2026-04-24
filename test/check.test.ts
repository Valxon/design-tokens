import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHECK_SCRIPT = join(__dirname, "..", "src", "check.mjs");

function runCheckIn(deps: Record<string, string>): { exitCode: number; stdout: string; stderr: string } {
  const dir = mkdtempSync(join(tmpdir(), "vx-check-"));
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "fixture", dependencies: deps }));
  try {
    const stdout = execSync(`node ${CHECK_SCRIPT}`, { cwd: dir, encoding: "utf8" });
    return { exitCode: 0, stdout, stderr: "" };
  } catch (err: any) {
    return { exitCode: err.status ?? 1, stdout: err.stdout?.toString() ?? "", stderr: err.stderr?.toString() ?? "" };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("check script", () => {
  it("returns 0 when the package is not a dependency", () => {
    const { exitCode, stdout } = runCheckIn({});
    expect(exitCode).toBe(0);
    expect(stdout).toMatch(/not a dependency/);
  });

  it("parses a git-URL pin", () => {
    const { stdout } = runCheckIn({ "@valxon/design-tokens": "github:Valxon/design-tokens#v0.1.0" });
    expect(stdout).toMatch(/Pinned:\s*0\.1\.0/);
  });
});
