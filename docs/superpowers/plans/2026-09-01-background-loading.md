# Background Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Start the correct high-resolution background request before CSS parsing and show a tiny painting-derived placeholder while retaining the existing high-resolution files unchanged.

**Architecture:** `_includes/head.liquid` owns responsive preload discovery, `_sass/_museum-glass.scss` owns the layered placeholder/high-resolution presentation, and `test/museum-glass.test.mjs` enforces the request and asset contract. A generated low-resolution WebP is the only new runtime asset.

**Tech Stack:** Jekyll Liquid, SCSS, WebP, Node test runner

---

### Task 1: Define the preload and placeholder contract

**Files:**

- Modify: `test/museum-glass.test.mjs`

- [ ] **Step 1: Write a failing test**

Require desktop and mobile image preload links with `fetchpriority="high"`, mutually exclusive `min-width` and `max-width` media queries, a placeholder reference in `_sass/_museum-glass.scss`, and an existing placeholder file under 10 KB.

- [ ] **Step 2: Verify the test fails**

Run `node --test test/museum-glass.test.mjs`. Expect failure because no background preload or placeholder exists yet.

### Task 2: Add early discovery and layered presentation

**Files:**

- Create: `assets/img/museum-glass-background-placeholder.webp`
- Modify: `_includes/head.liquid`
- Modify: `_sass/_museum-glass.scss`
- Test: `test/museum-glass.test.mjs`

- [ ] **Step 1: Record high-resolution checksums**

Run `shasum -a 256 assets/img/museum-glass-background-desktop.webp assets/img/museum-glass-background-mobile.webp` and retain the output for the final comparison.

- [ ] **Step 2: Generate the placeholder**

Create a painting-derived WebP no larger than 10 KB and approximately 96 pixels wide. Do not modify either high-resolution WebP.

- [ ] **Step 3: Add responsive preload hints**

Insert two preload links before the main stylesheet. Use `(min-width: 768px)` for the desktop asset and `(max-width: 767.98px)` for the mobile asset, both with `as="image"`, `type="image/webp"`, and `fetchpriority="high"`.

- [ ] **Step 4: Add the placeholder layer**

Use the placeholder as the `body` background with the same cover/position behavior. Keep `body::before` as the unchanged high-resolution layer so it naturally paints over the placeholder after decoding.

- [ ] **Step 5: Verify behavior and integrity**

Run `node --test test/museum-glass.test.mjs`, compile `_sass/_museum-glass.scss`, check the placeholder size, and rerun the high-resolution checksums. Expect all tests to pass, placeholder size below 10 KB, and identical before/after checksums.

### Task 3: Format, commit, and deploy

**Files:**

- Modify: `_includes/head.liquid`
- Modify: `_sass/_museum-glass.scss`
- Modify: `test/museum-glass.test.mjs`
- Create: `assets/img/museum-glass-background-placeholder.webp`

- [ ] **Step 1: Run final verification**

Run Prettier checks, the Node contract suite, Sass compilation, `git diff --check`, and high-resolution checksum comparison.

- [ ] **Step 2: Commit and push**

Stage only the background-loading implementation, tests, spec, and plan. Commit with `perf: prioritize museum glass background` and push `main`, leaving `.superpowers/` and `Blog/` untouched.
