# Blog List Cleanup and Responsive Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the two generated sample posts and make Blog listing titles and covers responsive without changing article-page typography.

**Architecture:** Disable only the configured external sources, then replace the listing's Bootstrap thumbnail row with scoped semantic hooks. Add high-specificity Blog-list CSS so the global Museum Glass article title remains untouched.

**Tech Stack:** Jekyll, Liquid, YAML, SCSS, Node test runner, Prettier, GitHub Pages.

---

### Task 1: Add the Blog listing contract

**Files:**

- Create: `test/blog-listing.test.mjs`

- [ ] Assert `_config.yml` has `external_sources: []` and contains neither sample URL.
- [ ] Assert `_pages/blog.md` provides scoped title, copy, media, and thumbnail hooks without inline sizing.
- [ ] Assert `_sass/_blog.scss` defines clamped title sizing, contained covers, and a mobile one-column layout.
- [ ] Run `node --test test/blog-listing.test.mjs` and confirm it fails against the existing configuration and template.

### Task 2: Remove generated sample posts

**Files:**

- Modify: `_config.yml`

- [ ] Replace the template external source entries with `external_sources: []`.
- [ ] Run the contract and confirm the external-source assertions pass.

### Task 3: Implement responsive Blog cards

**Files:**

- Modify: `_pages/blog.md`
- Modify: `_sass/_blog.scss`

- [ ] Add semantic list classes and remove the thumbnail's inline style.
- [ ] Add clamped desktop title sizing and a bounded, uncropped cover.
- [ ] Add a mobile breakpoint that uses one column, moves the cover above the copy, and reduces title size.
- [ ] Run the contract and all repository tests.

### Task 4: Verify and deploy

**Files:**

- Verify all files above.

- [ ] Run Sass compilation, Prettier, and `git diff --check`.
- [ ] Ensure `Blog/` and `.superpowers/` remain outside the commit.
- [ ] Commit and push to `main`.
- [ ] Wait for the `Deploy site` workflow and verify the live Blog lists only the PixelDiT article with responsive production CSS.
