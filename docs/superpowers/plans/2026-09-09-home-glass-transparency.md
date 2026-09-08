# Home Glass Transparency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved balanced homepage transparency on desktop and mobile without changing reading surfaces.

**Architecture:** Palette tokens define the coffee and reserved forest values. The existing desktop `.site-surface--home` consumes `--glass-home`, while a scoped mobile override consumes a new `--glass-home-mobile` token and leaves the generic mobile reading surface unchanged.

**Tech Stack:** SCSS, Node test runner, Jekyll

---

### Task 1: Define the transparency contract

**Files:**

- Modify: `test/museum-glass.test.mjs`

- [ ] **Step 1: Add failing assertions**

Require coffee `--glass-home` alpha `0.52`, coffee `--glass-home-mobile` alpha `0.80`, forest equivalents `0.54` and `0.82`, and a mobile `.site-surface--home` rule using the new token.

- [ ] **Step 2: Verify red state**

Run `node --test test/museum-glass.test.mjs`. Expect the new test to fail against the current `0.62` homepage opacity and missing mobile token.

### Task 2: Implement scoped homepage transparency

**Files:**

- Modify: `_sass/_museum-glass.scss`
- Test: `test/museum-glass.test.mjs`

- [ ] **Step 1: Update palette tokens**

Set the approved desktop values and add the approved mobile homepage tokens to both palettes. Do not change reading/mobile-reading tokens.

- [ ] **Step 2: Add the mobile homepage override**

Inside the existing mobile breakpoint, add `.site-surface--home { background: var(--glass-home-mobile); }` after the generic `.site-surface` rule.

- [ ] **Step 3: Verify green state**

Run the Node tests and Sass compilation. Expect all tests and compilation to pass.

### Task 3: Preserve content and deploy

**Files:**

- Preserve: `_pages/about.md`
- Modify: `_sass/_museum-glass.scss`
- Modify: `test/museum-glass.test.mjs`

- [ ] **Step 1: Run final checks**

Run Prettier, the complete Node test suite, Sass compilation, and `git diff --check`. Inspect the staged diff to verify the user's `_pages/about.md` edit is unchanged.

- [ ] **Step 2: Commit and push**

Commit the user copy edit, transparency implementation, tests, spec, and plan to `main` with `style: increase homepage glass transparency`. Do not add `.superpowers/` or `Blog/`.
