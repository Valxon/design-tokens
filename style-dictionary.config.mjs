import { typescript } from "./src/formats/typescript.mjs";
import { css } from "./src/formats/css.mjs";
import { tailwindCjs } from "./src/formats/tailwind-cjs.mjs";
import { tailwindEsm } from "./src/formats/tailwind-esm.mjs";
import { email } from "./src/formats/email.mjs";

/** @type {import("style-dictionary/types").Config} */
export default {
  source: ["tokens/**/*.json"],
  preprocessors: ["tokens-studio"],
  hooks: {
    formats: {
      "valxon/typescript":  typescript,
      "valxon/css":         css,
      "valxon/tailwind-cjs": tailwindCjs,
      "valxon/tailwind-esm": tailwindEsm,
      "valxon/email":       email,
    },
  },
  platforms: {
    ts: {
      transformGroup: "js",
      buildPath: "dist/",
      files: [{ destination: "index.js",     format: "valxon/typescript" }],
    },
    css: {
      transformGroup: "css",
      buildPath: "dist/",
      files: [{ destination: "tokens.css",   format: "valxon/css" }],
    },
    tailwindCjs: {
      transformGroup: "js",
      buildPath: "dist/",
      files: [{ destination: "tailwind.cjs", format: "valxon/tailwind-cjs" }],
    },
    tailwindEsm: {
      transformGroup: "js",
      buildPath: "dist/",
      files: [{ destination: "tailwind.mjs", format: "valxon/tailwind-esm" }],
    },
    email: {
      transformGroup: "js",
      buildPath: "dist/",
      files: [{ destination: "email.js",     format: "valxon/email" }],
    },
  },
};
