import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the document selects coffee palette and stable surface classes", () => {
  const layout = read("_layouts/default.liquid");
  assert.match(layout, /data-palette="coffee"/);
  assert.match(layout, /site-surface/);
  assert.match(layout, /site-surface--home/);
  assert.match(layout, /site-surface--reading/);
});

test("dark mode is disabled", () => {
  assert.match(read("_config.yml"), /^enable_darkmode: false\b/m);
});

test("the Museum Glass stylesheet is imported and defines both palettes", () => {
  assert.match(read("assets/css/main.scss"), /@use "museum-glass";/);
  const styles = read("_sass/_museum-glass.scss");
  assert.match(styles, /html\[data-palette="coffee"\]/);
  assert.match(styles, /html\[data-palette="forest"\]/);
  assert.match(styles, /--glass-home:/);
  assert.match(styles, /--glass-reading:/);
  assert.match(styles, /museum-glass-background-mobile\.webp/);
  assert.match(styles, /@supports not \(backdrop-filter: blur\(1px\)\)/);
});

test("local fonts and optimized backgrounds exist", () => {
  const assets = [
    "assets/fonts/cormorant-garamond-variable.woff2",
    "assets/fonts/courier-prime-regular.woff2",
    "assets/fonts/courier-prime-bold.woff2",
    "assets/img/museum-glass-background.jpg",
    "assets/img/museum-glass-background-desktop.webp",
    "assets/img/museum-glass-background-mobile.webp",
  ];

  for (const asset of assets) {
    assert.equal(existsSync(new URL(`../${asset}`, import.meta.url)), true, asset);
  }
});

test("publication badges and editorial metadata follow the active palette", () => {
  const styles = read("_sass/_museum-glass.scss");

  assert.match(styles, /\.publications ol\.bibliography li \.abbr abbr\s*{[^}]*background-color:\s*var\(--ink-primary\)\s*!important;/s);
  assert.match(styles, /\.publications ol\.bibliography li \.periodical[\s\S]*?font-family:\s*var\(--font-display\);/);
  assert.match(styles, /\.news table th[\s\S]*?font-family:\s*var\(--font-display\);/);
});
