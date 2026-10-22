import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const postPath = new URL("_posts/2026-10-22-pixeldit-pixeldit2-iris-3b.md", root);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("the PixelDiT seminar is a native blog post containing only article content", () => {
  assert.equal(existsSync(postPath), true, "PixelDiT post should exist");

  const post = read("_posts/2026-10-22-pixeldit-pixeldit2-iris-3b.md");
  assert.match(post, /^layout: post$/m);
  assert.match(post, /^title: "PixelDiT → PixelDiT2 → Iris-3B"$/m);
  assert.match(post, /^description: /m);
  assert.match(post, /class="pixeldit-article"/);

  for (const id of ["question", "pixeldit", "pixeldit2", "iris", "evidence"]) {
    assert.match(post, new RegExp(`<section[^>]+id="${id}"`));
  }

  assert.doesNotMatch(post, /<header\b|<footer\b|<nav\b|data:image\//i);
  assert.match(post, /怎样在计算可控的前提下，对像素做足够细的建模？/);
  assert.match(post, /预训练像素模型并没有自动带来更好的保真度。/);
});

test("the migrated post uses exactly 19 local, deployable image assets", () => {
  assert.equal(existsSync(postPath), true, "PixelDiT post should exist");
  const post = read("_posts/2026-10-22-pixeldit-pixeldit2-iris-3b.md");
  const paths = [...post.matchAll(/['"](\/assets\/img\/blog\/pixeldit-seminar\/[^'"]+)['"]/g)].map((match) => match[1]);

  assert.equal(paths.length, 19);
  assert.equal(new Set(paths).size, 19);
  for (const path of paths) {
    assert.equal(existsSync(new URL(path.slice(1), root)), true, path);
  }
});

test("the PixelDiT article has scoped Museum Glass and mobile styles", () => {
  const styles = read("_sass/_museum-glass.scss");

  assert.match(styles, /\.pixeldit-article\s*{/);
  assert.match(styles, /\.pixeldit-article[\s\S]*font-family:\s*var\(--font-prose\);/);
  assert.match(styles, /\.pixeldit-article[\s\S]*\.comparison[\s\S]*overflow-x:\s*auto;/);
  assert.match(styles, /@media \(max-width: 767\.98px\)[\s\S]*\.pixeldit-article/);
});
