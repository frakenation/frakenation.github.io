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

test("the homepage identity and portrait contacts are compact and actionable", () => {
  const about = read("_pages/about.md");
  const moreInfo = about.match(/more_info:\s*>\s*([\s\S]*?)\n\nselected_papers:/)?.[1] ?? "";

  assert.match(about, /display_name:\s*Tingyu Yang · Theo Yang/);
  assert.match(moreInfo, /href="mailto:tyang5990@gmail\.com">📧 tyang5990@gmail\.com<\/a>/);
  assert.match(moreInfo, /href="https:\/\/github\.com\/frakenation"/);
  assert.match(moreInfo, /href="https:\/\/scholar\.google\.com\/citations\?user=qpXj0YIAAAAJ"/);
  assert.match(moreInfo, /href="https:\/\/space\.bilibili\.com\/433206981\/upload\/video"/);
  assert.doesNotMatch(moreInfo, /Shanghai Jiao Tong University|Shanghai, China/);
  assert.match(about, /^social:\s*false$/m);
  assert.match(read("_data/socials.yml"), /^email:\s*tyang5990@gmail\.com$/m);
});

test("the profile and Blog headings expose scoped typography hooks", () => {
  const aboutLayout = read("_layouts/about.liquid");
  const blog = read("_pages/blog.md");

  assert.match(aboutLayout, /post-title post-title--profile/);
  assert.match(aboutLayout, /page\.display_name/);
  assert.match(blog, /<h1 class="blog-title">/);
});

test("profile contacts and compact headings have responsive Museum Glass styles", () => {
  const styles = read("_sass/_museum-glass.scss");

  assert.match(styles, /\.post-title--profile\s*{[^}]*font-size:\s*clamp\(/s);
  assert.match(styles, /\.header-bar \.blog-title\s*{[^}]*font-size:\s*clamp\(/s);
  assert.match(styles, /\.profile-contact-icons\s*{[^}]*display:\s*flex;/s);
  assert.match(styles, /\.profile-email a\s*{[^}]*color:\s*var\(--accent\);/s);
});
