# PixelDiT Blog Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the supplied PixelDiT seminar HTML body into a native, responsive Museum Glass blog post and deploy it.

**Architecture:** The post uses the existing `post` layout and keeps only the five semantic content sections. Embedded data-URI images become local static assets, while a single scoped SCSS block adapts the source content hierarchy to the site's visual tokens.

**Tech Stack:** Jekyll, Markdown with semantic HTML, SCSS, Node test runner, Prettier, GitHub Pages.

---

### Task 1: Add the migration contract

**Files:**

- Create: `test/pixeldit-blog.test.mjs`

- [ ] Assert the post exists with the expected front matter and section IDs.
- [ ] Assert source-only page chrome and Base64 image payloads are absent.
- [ ] Assert all 19 local image references resolve to files.
- [ ] Assert the article has scoped desktop and mobile styling.
- [ ] Run `node --test test/pixeldit-blog.test.mjs` and confirm it fails because the post is not present.

### Task 2: Extract the source body and media

**Files:**

- Create: `_posts/2026-10-22-pixeldit-pixeldit2-iris-3b.md`
- Create: `assets/img/blog/pixeldit-seminar/*`

- [ ] Parse only the five `main > section` elements from the supplied HTML.
- [ ] Decode the 19 data-URI images losslessly into descriptive local files.
- [ ] Replace embedded image URLs with Jekyll `relative_url` references.
- [ ] Add post front matter, description, tags, and thumbnail.
- [ ] Run the content contract and confirm only the styling assertion remains failing.

### Task 3: Adapt the content to Museum Glass

**Files:**

- Modify: `_sass/_museum-glass.scss`

- [ ] Add `.pixeldit-article` typography, section, callout, figure, table, and metric styles using existing palette variables.
- [ ] Add mobile rules that collapse grids, allow horizontal table scrolling, and reduce figure padding.
- [ ] Run the contract test and confirm it passes.

### Task 4: Verify and deploy

**Files:**

- Verify all files above.

- [ ] Run `node --test test/*.test.mjs`.
- [ ] Run Sass compilation and Prettier checks.
- [ ] Run `git diff --check` and inspect the staged file list so `Blog/` and `.superpowers/` remain excluded.
- [ ] Commit the migration on `main`, push it, and wait for the `Deploy site` workflow.
- [ ] Verify the live post contains the five sections, local image URLs, and responsive CSS.
