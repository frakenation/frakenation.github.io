import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the Blog generates no template external posts", () => {
  const config = read("_config.yml");

  assert.match(config, /^external_sources:\s*\[\]\s*$/m);
  assert.doesNotMatch(config, /medium\.com\/@al-folio\/feed/);
  assert.doesNotMatch(config, /google-gemini-update-flash-ai-assistant/);
});

test("the Blog listing exposes responsive title and cover hooks", () => {
  const page = read("_pages/blog.md");

  assert.match(page, /class="post-list-item{% if post\.thumbnail %} post-list-item--with-thumbnail{% endif %}"/);
  assert.match(page, /class="post-list-copy"/);
  assert.match(page, /class="post-title post-list-title"/);
  assert.match(page, /class="post-list-media"/);
  assert.match(page, /class="post-list-thumbnail"/);
  assert.match(page, /loading="lazy"/);
  assert.match(page, /decoding="async"/);
  assert.doesNotMatch(page, /style="object-fit:\s*cover;\s*height:\s*90%"/);
});

test("Blog titles and covers scale without affecting article pages", () => {
  const styles = read("_sass/_blog.scss");

  assert.match(styles, /\.post-list \.post-list-title\s*{[^}]*font-size:\s*clamp\(1\.35rem, 2\.6vw, 1\.9rem\);/s);
  assert.match(styles, /\.post-list-item--with-thumbnail\s*{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) clamp\(8\.5rem, 22vw, 13rem\);/s);
  assert.match(styles, /\.post-list-thumbnail\s*{[^}]*object-fit:\s*contain;/s);
  assert.match(styles, /@media \(max-width: 575\.98px\)[\s\S]*\.post-list-item--with-thumbnail\s*{[^}]*grid-template-columns:\s*1fr;/s);
  assert.match(
    styles,
    /@media \(max-width: 575\.98px\)[\s\S]*\.post-list \.post-list-title\s*{[^}]*font-size:\s*clamp\(1\.25rem, 6\.5vw, 1\.65rem\);/s
  );
});
