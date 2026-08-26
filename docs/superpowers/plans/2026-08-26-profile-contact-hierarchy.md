# Profile Contact Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compact the homepage and Blog headings while moving the three primary social links and a clickable email beneath the portrait.

**Architecture:** Keep identity and contact content in `_pages/about.md`, expose small semantic hooks through the existing About and Blog markup, and isolate all visual changes in `_sass/_museum-glass.scss`. Extend the existing source contract test so template and responsive styling regressions fail before deployment.

**Tech Stack:** Jekyll, Liquid, YAML frontmatter, SCSS, Node test runner, Font Awesome, Academicons

---

### Task 1: Define the profile-content contract

**Files:**

- Modify: `test/museum-glass.test.mjs`
- Test: `test/museum-glass.test.mjs`

- [ ] **Step 1: Write failing assertions**

Add tests that require `Tingyu Yang · Theo Yang`, `mailto:tyang5990@gmail.com`, the GitHub/Scholar/Bilibili URLs, `social: false`, the absence of the two location paragraphs, and the `post-title--profile` / `blog-title` hooks.

- [ ] **Step 2: Verify the tests fail**

Run `node --test test/museum-glass.test.mjs`. Expect the new profile contract tests to fail because the old email, location, duplicate social block, and heading markup remain.

### Task 2: Update homepage content and semantic hooks

**Files:**

- Modify: `_pages/about.md`
- Modify: `_data/socials.yml`
- Modify: `_layouts/about.liquid`
- Modify: `_pages/blog.md`
- Test: `test/museum-glass.test.mjs`

- [ ] **Step 1: Update the homepage frontmatter**

Add `display_name: Tingyu Yang · Theo Yang`. Replace `profile.more_info` with a clickable email and a `.profile-contact-icons` container holding accessible GitHub, Google Scholar, and Bilibili anchors. Set `social: false`, remove the location paragraphs, and update the canonical email in `_data/socials.yml`.

- [ ] **Step 2: Add targeted title hooks**

Render `page.display_name` from `<h1 class="post-title post-title--profile">` in `_layouts/about.liquid`, falling back to the existing site-name logic. Add `class="blog-title"` to the Blog masthead `<h1>`.

- [ ] **Step 3: Verify the content tests pass**

Run `node --test test/museum-glass.test.mjs`. Expect the content contract to pass while the style contract added in Task 3 is not yet present.

### Task 3: Implement responsive typography and portrait contacts

**Files:**

- Modify: `_sass/_museum-glass.scss`
- Modify: `test/museum-glass.test.mjs`
- Test: `test/museum-glass.test.mjs`

- [ ] **Step 1: Add failing style assertions**

Require `.post-title--profile`, `.header-bar .blog-title`, and `.profile-contact-icons` rules in `_sass/_museum-glass.scss`.

- [ ] **Step 2: Verify the style assertions fail**

Run `node --test test/museum-glass.test.mjs`. Expect failure because the new selectors have no styles.

- [ ] **Step 3: Add minimal scoped styles**

Use responsive `clamp()` sizes for the two headings. Center the portrait metadata, style the email with the coffee accent, and render the three icon links as a compact horizontal row with hover/focus states. Add smaller mobile values inside the existing breakpoint.

- [ ] **Step 4: Run verification**

Run `npx prettier _pages/about.md _layouts/about.liquid _pages/blog.md _sass/_museum-glass.scss test/museum-glass.test.mjs --write`, `node --test test/museum-glass.test.mjs`, `npx --yes sass --load-path=_sass _sass/_museum-glass.scss >/dev/null`, and `git diff --check`. Expect every command to pass.

- [ ] **Step 5: Commit and push**

Stage only the six implementation/test files plus the updated spec and plan, commit with `style: refine profile contact hierarchy`, and push `main` to `origin` without adding `.superpowers/` or `Blog/`.
