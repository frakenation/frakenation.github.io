# Museum Glass Personal-Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing al-folio site with the approved painting-backed Museum Glass design, coffee palette, local editorial fonts, forced light mode, and a figure-focused mobile composition.

**Architecture:** Keep the existing Jekyll and Liquid page structure. Add one focused SCSS partial that owns palette tokens, local font faces, background rendering, glass surfaces, typography roles, and responsive fallbacks; add only stable palette/layout hooks to the default layout. Store optimized image and font derivatives locally so the design does not depend on third-party font or image hosts.

**Tech Stack:** Jekyll 4, Liquid, SCSS, CSS custom properties, Node's built-in test runner, FontTools `pyftsubset`, and `cwebp`.

---

## File Map

- Create `_sass/_museum-glass.scss`: all Museum Glass palette, typography, surface, background, and responsive rules.
- Modify `assets/css/main.scss`: import the new focused SCSS partial.
- Modify `_layouts/default.liquid`: select the coffee palette and expose stable homepage/reading-surface classes.
- Modify `_config.yml`: disable dark mode so the theme control and dark-mode script are omitted.
- Create `assets/fonts/cormorant-garamond-variable.woff2`: local display font.
- Create `assets/fonts/courier-prime-regular.woff2`: local prose font.
- Create `assets/fonts/courier-prime-bold.woff2`: local bold prose font.
- Create `assets/img/museum-glass-background.jpg`: original JPEG fallback supplied by the user.
- Create `assets/img/museum-glass-background-desktop.webp`: optimized full-composition desktop background.
- Create `assets/img/museum-glass-background-mobile.webp`: optimized portrait crop centered on the figure.
- Create `test/museum-glass.test.mjs`: source-level regression tests for design hooks, tokens, assets, and forced light mode.

### Task 1: Add Failing Museum Glass Contract Tests

**Files:**

- Create: `test/museum-glass.test.mjs`

- [ ] **Step 1: Create the source contract test**

Use `apply_patch` to add:

```js
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
```

- [ ] **Step 2: Run the contract test and verify the expected failure**

Run:

```bash
node --test test/museum-glass.test.mjs
```

Expected: FAIL because `data-palette="coffee"`, the new stylesheet, and the new assets do not exist yet.

- [ ] **Step 3: Commit the failing test**

```bash
npx prettier test/museum-glass.test.mjs --write
git add test/museum-glass.test.mjs
git commit -m "test: define museum glass design contract"
```

### Task 2: Generate Local Font and Background Assets

**Files:**

- Create: `assets/fonts/cormorant-garamond-variable.woff2`
- Create: `assets/fonts/courier-prime-regular.woff2`
- Create: `assets/fonts/courier-prime-bold.woff2`
- Create: `assets/img/museum-glass-background.jpg`
- Create: `assets/img/museum-glass-background-desktop.webp`
- Create: `assets/img/museum-glass-background-mobile.webp`

- [ ] **Step 1: Copy the supplied JPEG into the site**

Run:

```bash
cp /Users/poplil/Downloads/image-from-rawpixel-id-2677423-jpeg.jpg assets/img/museum-glass-background.jpg
```

Expected: `file assets/img/museum-glass-background.jpg` reports a 3719 × 2735 JPEG.

- [ ] **Step 2: Generate desktop and mobile WebP derivatives**

Run:

```bash
cwebp -quiet -q 84 -resize 2400 0 assets/img/museum-glass-background.jpg -o assets/img/museum-glass-background-desktop.webp
cwebp -quiet -q 84 -crop 1945 0 1538 2735 -resize 1080 1920 assets/img/museum-glass-background.jpg -o assets/img/museum-glass-background-mobile.webp
```

Expected:

```text
assets/img/museum-glass-background-desktop.webp: Web/P image
assets/img/museum-glass-background-mobile.webp: Web/P image
```

The mobile crop is centered at approximately 73% of the source width and preserves the selected figure, sky, and meadow composition.

- [ ] **Step 3: Download the open-source font sources into a temporary directory**

Run:

```bash
font_source_dir=$(mktemp -d)
curl -L 'https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf' -o "$font_source_dir/cormorant.ttf"
curl -L 'https://raw.githubusercontent.com/google/fonts/main/ofl/courierprime/CourierPrime-Regular.ttf' -o "$font_source_dir/courier-regular.ttf"
curl -L 'https://raw.githubusercontent.com/google/fonts/main/ofl/courierprime/CourierPrime-Bold.ttf' -o "$font_source_dir/courier-bold.ttf"
```

Expected: all three downloads return HTTP 200 and contain TrueType font data.

- [ ] **Step 4: Convert the fonts to self-hosted WOFF2 files**

Run:

```bash
pyftsubset "$font_source_dir/cormorant.ttf" --output-file=assets/fonts/cormorant-garamond-variable.woff2 --flavor=woff2 --unicodes='*' --layout-features='*'
pyftsubset "$font_source_dir/courier-regular.ttf" --output-file=assets/fonts/courier-prime-regular.woff2 --flavor=woff2 --unicodes='*' --layout-features='*'
pyftsubset "$font_source_dir/courier-bold.ttf" --output-file=assets/fonts/courier-prime-bold.woff2 --flavor=woff2 --unicodes='*' --layout-features='*'
```

Expected: `file assets/fonts/*.woff2` identifies the three new files as Web Open Font Format (Version 2).

- [ ] **Step 5: Run the asset test to verify only implementation hooks remain failing**

Run:

```bash
node --test test/museum-glass.test.mjs
```

Expected: the local-assets test passes; the layout, config, and stylesheet tests still fail.

- [ ] **Step 6: Commit local assets**

```bash
git add assets/fonts/cormorant-garamond-variable.woff2 assets/fonts/courier-prime-regular.woff2 assets/fonts/courier-prime-bold.woff2 assets/img/museum-glass-background.jpg assets/img/museum-glass-background-desktop.webp assets/img/museum-glass-background-mobile.webp
git commit -m "feat: add museum glass visual assets"
```

### Task 3: Add Palette and Surface Hooks and Force Light Mode

**Files:**

- Modify: `_layouts/default.liquid`
- Modify: `_config.yml`

- [ ] **Step 1: Select the coffee palette at the document root**

Change the opening element in `_layouts/default.liquid` to:

```liquid
<!doctype html>
<html lang="{{ site.lang }}" data-palette="coffee">
```

- [ ] **Step 2: Add stable page-role and surface classes**

Change the body and primary content wrapper in `_layouts/default.liquid` to:

```liquid
<body
  class="layout-{{ page.layout | default: 'default' }} {% if page.permalink == '/' %}page-home{% else %}page-reading{% endif %} {% if site.navbar_fixed %}fixed-top-nav{% endif %} {% unless site.footer_fixed %}sticky-bottom-footer{% endunless %}"
>
```

```liquid
<div
  class="container mt-5 site-surface {% if page.permalink == '/' %}site-surface--home{% else %}site-surface--reading{% endif %}"
  role="main"
>
```

Do not change the content, table-of-contents branches, header, or footer structure inside the wrapper.

- [ ] **Step 3: Disable dark mode in configuration**

Change `_config.yml` to:

```yaml
enable_darkmode: false # force the Museum Glass light palette
```

This causes existing Liquid guards to omit the theme toggle and dark-mode script.

- [ ] **Step 4: Format and run the contract test**

Run:

```bash
npx prettier _layouts/default.liquid _config.yml --write
node --test test/museum-glass.test.mjs
```

Expected: the layout and dark-mode tests pass; the stylesheet test remains failing.

- [ ] **Step 5: Commit the structural hooks**

```bash
git add _layouts/default.liquid _config.yml
git commit -m "feat: add museum glass layout hooks"
```

### Task 4: Implement the Museum Glass Style System

**Files:**

- Create: `_sass/_museum-glass.scss`
- Modify: `assets/css/main.scss`

- [ ] **Step 1: Add the focused Museum Glass SCSS partial**

Use `apply_patch` to create `_sass/_museum-glass.scss` with:

```scss
@font-face {
  font-family: "Cormorant Garamond Local";
  src: url("../fonts/cormorant-garamond-variable.woff2") format("woff2");
  font-style: normal;
  font-weight: 300 700;
  font-display: swap;
}

@font-face {
  font-family: "Courier Prime Local";
  src: url("../fonts/courier-prime-regular.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Courier Prime Local";
  src: url("../fonts/courier-prime-bold.woff2") format("woff2");
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}

:root {
  color-scheme: light;
  --font-display: "Cormorant Garamond Local", Georgia, "Times New Roman", serif;
  --font-prose: "Courier Prime Local", "Courier New", monospace;
  --font-utility: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

html[data-palette="coffee"] {
  --ink-primary: #4a3028;
  --ink-strong: #2e211d;
  --ink-muted: #75584a;
  --accent: #8a5d3b;
  --glass-home: rgba(248, 242, 232, 0.62);
  --glass-reading: rgba(248, 242, 232, 0.84);
  --glass-mobile: rgba(248, 242, 232, 0.88);
  --glass-border: rgba(255, 255, 255, 0.62);
  --shadow-warm: rgba(54, 36, 27, 0.18);
  --background-wash: rgba(238, 227, 209, 0.2);
}

html[data-palette="forest"] {
  --ink-primary: #173f34;
  --ink-strong: #0f2b25;
  --ink-muted: #45685b;
  --accent: #557d68;
  --glass-home: rgba(237, 241, 231, 0.64);
  --glass-reading: rgba(237, 241, 231, 0.86);
  --glass-mobile: rgba(237, 241, 231, 0.9);
  --glass-border: rgba(250, 252, 245, 0.66);
  --shadow-warm: rgba(18, 52, 42, 0.18);
  --background-wash: rgba(219, 230, 215, 0.2);
}

html {
  min-height: 100%;
  background: #e8dfd1;
}

body {
  min-height: 100vh;
  isolation: isolate;
  color: var(--ink-strong);
  background: transparent;
  font-family: var(--font-utility);
}

body::before,
body::after {
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  content: "";
}

body::before {
  background-image: url("../img/museum-glass-background.jpg");
  background-image: image-set(
    url("../img/museum-glass-background-desktop.webp") type("image/webp"),
    url("../img/museum-glass-background.jpg") type("image/jpeg")
  );
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  filter: saturate(0.82) contrast(0.96);
  transform: scale(1.01);
}

body::after {
  z-index: -1;
  background: var(--background-wash);
}

body,
p,
h1,
h2,
h3,
h4,
h5,
h6,
em,
div,
li,
span,
strong {
  color: var(--ink-strong);
}

a,
table.table a {
  color: var(--accent);
}

a:hover,
table.table a:hover {
  color: var(--ink-primary);
}

.post-title,
.post h2,
.post h3,
.header-bar h1,
.publications h1,
.publications h2,
.navbar-brand,
.navbar .nav-link {
  color: var(--ink-primary);
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: 0.065em;
  text-transform: uppercase;
}

.post-title {
  font-size: clamp(2.35rem, 6vw, 4.6rem);
  line-height: 0.95;
}

.post h2,
.header-bar h1,
.publications h1 {
  font-size: clamp(1.65rem, 3.4vw, 2.45rem);
  line-height: 1;
}

.clearfix > p,
.post-content > p,
.post-content blockquote p,
.abstract.hidden p {
  font-family: var(--font-prose);
  font-size: 1rem;
  line-height: 1.72;
}

.publications,
.publications .author,
.publications .links,
.publications .badges,
.post-meta,
.post-tags,
.news,
.btn,
.badge,
input,
button,
select,
textarea {
  font-family: var(--font-utility);
}

.site-surface {
  position: relative;
  margin-bottom: 5.25rem;
  padding: clamp(1.45rem, 4vw, 3rem);
  overflow: hidden;
  border: 1px solid var(--glass-border);
  border-radius: 0.7rem;
  box-shadow: 0 1.4rem 3.8rem var(--shadow-warm);
  backdrop-filter: blur(20px) saturate(0.8);
  -webkit-backdrop-filter: blur(20px) saturate(0.8);
}

.site-surface--home {
  background: var(--glass-home);
}

.site-surface--reading {
  background: var(--glass-reading);
}

.navbar {
  border-bottom: 1px solid var(--glass-border);
  background: rgba(248, 242, 232, 0.72);
  opacity: 1;
  box-shadow: 0 0.65rem 2.2rem rgba(54, 36, 27, 0.08);
  backdrop-filter: blur(18px) saturate(0.82);
  -webkit-backdrop-filter: blur(18px) saturate(0.82);
}

.navbar.navbar-light .navbar-brand,
.navbar.navbar-light .navbar-nav .nav-item .nav-link,
#search-toggle {
  color: var(--ink-primary);
}

.navbar.navbar-light .navbar-nav .nav-item.active > .nav-link,
.navbar.navbar-light .navbar-nav .nav-item .nav-link:hover,
#search-toggle:hover {
  color: var(--accent);
}

.navbar .dropdown-menu,
.btn-group.dropdown .dropdown-menu,
footer.fixed-bottom,
footer.sticky-bottom {
  border-color: var(--glass-border);
  background: rgba(248, 242, 232, 0.86);
  backdrop-filter: blur(18px) saturate(0.82);
  -webkit-backdrop-filter: blur(18px) saturate(0.82);
}

footer.fixed-bottom .container,
footer.fixed-bottom a,
footer.sticky-bottom .container {
  color: var(--ink-muted);
}

.card,
.news table,
blockquote {
  border-color: rgba(74, 48, 40, 0.12);
  background: rgba(255, 252, 246, 0.36);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

@supports not (backdrop-filter: blur(1px)) {
  .site-surface,
  .navbar,
  .navbar .dropdown-menu,
  footer.fixed-bottom,
  footer.sticky-bottom {
    background: rgba(248, 242, 232, 0.94);
  }
}

@media (max-width: 767.98px) {
  body::before {
    background-image: url("../img/museum-glass-background.jpg");
    background-image: image-set(
      url("../img/museum-glass-background-mobile.webp") type("image/webp"),
      url("../img/museum-glass-background.jpg") type("image/jpeg")
    );
    background-position: 73% center;
    filter: saturate(0.76) contrast(0.94);
    transform: none;
  }

  .site-surface {
    width: calc(100% - 1.25rem);
    margin-top: 1.6rem !important;
    margin-bottom: 4.75rem;
    padding: 1.25rem 1rem 1.6rem;
    border-radius: 0.45rem;
    background: var(--glass-mobile);
    box-shadow: 0 1rem 2.7rem rgba(54, 36, 27, 0.14);
    backdrop-filter: blur(15px) saturate(0.8);
    -webkit-backdrop-filter: blur(15px) saturate(0.8);
  }

  .post-title {
    overflow-wrap: anywhere;
    font-size: clamp(2rem, 12vw, 3.1rem);
  }

  .post h2,
  .header-bar h1,
  .publications h1 {
    overflow-wrap: anywhere;
    font-size: clamp(1.5rem, 8vw, 2rem);
  }

  .clearfix > p,
  .post-content > p,
  .post-content blockquote p,
  .abstract.hidden p {
    font-size: 0.96rem;
    line-height: 1.68;
  }

  .navbar .container {
    padding-right: max(15px, env(safe-area-inset-right));
    padding-left: max(15px, env(safe-area-inset-left));
  }
}
```

- [ ] **Step 2: Import the partial after the base theme and layout rules**

Add this line to `assets/css/main.scss` after `@use "typography";` so the focused overrides load after the base layout and theme tokens:

```scss
@use "museum-glass";
```

- [ ] **Step 3: Format and run all contract tests**

Run:

```bash
npx prettier _sass/_museum-glass.scss assets/css/main.scss --write
node --test test/museum-glass.test.mjs
```

Expected: 4 tests pass and 0 tests fail.

- [ ] **Step 4: Commit the complete style system**

```bash
git add _sass/_museum-glass.scss assets/css/main.scss
git commit -m "feat: apply museum glass visual system"
```

### Task 5: Build and Verify the Site

**Files:**

- Verify: `_config.yml`
- Verify: `_layouts/default.liquid`
- Verify: `_sass/_museum-glass.scss`
- Verify: `assets/css/main.scss`
- Verify: `assets/fonts/*.woff2`
- Verify: `assets/img/museum-glass-background*`

- [ ] **Step 1: Run focused formatting and static tests**

Run:

```bash
npx prettier _config.yml _layouts/default.liquid _sass/_museum-glass.scss assets/css/main.scss test/museum-glass.test.mjs --write
npx prettier _config.yml _layouts/default.liquid _sass/_museum-glass.scss assets/css/main.scss test/museum-glass.test.mjs --check
node --test test/museum-glass.test.mjs
git diff --check
```

Expected: Prettier reports all files formatted, all 4 Node tests pass, and `git diff --check` emits no errors.

- [ ] **Step 2: Build and start the Jekyll site with Docker**

Run:

```bash
docker compose up --build
```

Expected: Jekyll completes without Sass, Liquid, YAML, or missing-asset errors and serves the site at `http://localhost:8080`.

- [ ] **Step 3: Verify generated markup and assets**

In another terminal, run:

```bash
curl -fsS http://localhost:8080/ | rg 'data-palette="coffee"|site-surface--home'
curl -fsS http://localhost:8080/publications/ | rg 'site-surface--reading'
curl -fsSI http://localhost:8080/assets/img/museum-glass-background-mobile.webp | rg '200|content-type: image/webp'
curl -fsSI http://localhost:8080/assets/fonts/cormorant-garamond-variable.woff2 | rg '200|content-type:'
```

Expected: the homepage contains the coffee/home hooks, publications contains the reading hook, and both asset requests return HTTP 200.

- [ ] **Step 4: Perform responsive visual checks**

Inspect the homepage, publications, CV, projects, blog listing, and one long article at 1440, 1024, 768, 430, 390, and 320 pixels. Confirm:

- Desktop preserves the painting's full composition.
- Mobile shows the selected figure-focused crop.
- The homepage surface is more transparent than reading pages.
- No viewport has horizontal overflow.
- Cormorant Garamond is used for navigation and headings.
- Courier Prime is used for long prose only.
- Dense publication metadata remains in the utility sans-serif.
- The dark-mode toggle is absent and system dark preference has no effect.
- Focus outlines, links, buttons, badges, and the collapsed mobile menu remain readable and operable.

- [ ] **Step 5: Review repository scope and commit any verification-only fixes**

Run:

```bash
git status --short
git diff --check
```

Expected: the pre-existing untracked `Blog/` directory and `.superpowers/` mockups remain untouched and uncommitted. If visual verification required scoped fixes, commit only the files listed in this plan with:

```bash
git add _config.yml _layouts/default.liquid _sass/_museum-glass.scss assets/css/main.scss test/museum-glass.test.mjs assets/fonts/cormorant-garamond-variable.woff2 assets/fonts/courier-prime-regular.woff2 assets/fonts/courier-prime-bold.woff2 assets/img/museum-glass-background.jpg assets/img/museum-glass-background-desktop.webp assets/img/museum-glass-background-mobile.webp
git commit -m "fix: polish museum glass responsive styling"
```
