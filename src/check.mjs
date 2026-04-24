#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const PACKAGE_JSON = join(process.cwd(), "package.json");
const REPO = "Valxon/design-tokens";
const SELF_VERSION = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
).version;

function parseSemver(v) {
  const m = v.replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3] };
}

function main() {
  const pkg = JSON.parse(readFileSync(PACKAGE_JSON, "utf8"));
  const spec =
    pkg.dependencies?.["@valxon/design-tokens"] ||
    pkg.devDependencies?.["@valxon/design-tokens"];
  if (!spec) {
    console.log("@valxon/design-tokens not a dependency in this package. Nothing to check.");
    process.exit(0);
  }

  const pinned = spec.match(/#v?(\d+\.\d+\.\d+)/)?.[1];
  if (!pinned) {
    console.warn(`Cannot parse pinned version from ${spec}. Expected github:${REPO}#vMAJOR.MINOR.PATCH`);
    process.exit(0);
  }

  console.log(`Pinned: ${pinned}  Self (for ref): ${SELF_VERSION}`);

  const latestTag = execSync(`git ls-remote --tags --refs https://github.com/${REPO}.git`, { encoding: "utf8" })
    .split("\n")
    .map((l) => l.match(/refs\/tags\/v?(\d+\.\d+\.\d+)$/)?.[1])
    .filter(Boolean)
    .sort(cmpSemver)
    .pop();

  if (!latestTag) {
    console.warn(`Cannot resolve latest tag from ${REPO}. Skipping check.`);
    process.exit(0);
  }

  const a = parseSemver(pinned);
  const b = parseSemver(latestTag);
  if (!a || !b) process.exit(0);

  const minorsBehind = (b.major - a.major) * 1000 + (b.minor - a.minor);
  console.log(`Latest: ${latestTag}`);

  if (minorsBehind > 2) {
    console.warn(`⚠ Pinned version is ${minorsBehind} minor versions behind latest. Consider upgrading.`);
    process.exit(1);
  }
  console.log("✓ within 2 minor versions of latest");
}

function cmpSemver(a, b) {
  const pa = parseSemver(a), pb = parseSemver(b);
  if (!pa || !pb) return 0;
  return pa.major - pb.major || pa.minor - pb.minor || pa.patch - pb.patch;
}

main();
