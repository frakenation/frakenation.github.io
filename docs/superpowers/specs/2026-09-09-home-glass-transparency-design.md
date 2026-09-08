# Home Glass Transparency Design

## Goal

Increase the visibility of the background painting through the homepage glass surface while preserving comfortable reading contrast and the stronger opacity used on content-heavy pages.

## Approved values

- Coffee homepage desktop: `rgba(248, 242, 232, 0.52)`.
- Coffee homepage mobile: `rgba(248, 242, 232, 0.80)`.
- Reserved forest homepage desktop: `rgba(237, 241, 231, 0.54)`.
- Reserved forest homepage mobile: `rgba(237, 241, 231, 0.82)`.

## Scope

- Add a dedicated `--glass-home-mobile` token so the mobile homepage can become clearer without weakening reading pages.
- Keep `--glass-reading`, `--glass-mobile`, blur strength, saturation, border, shadow, background positioning, and image assets unchanged.
- Preserve the user's current `_pages/about.md` copy edit and include it in the final commit.
- Leave the untracked `Blog/` directory untouched.

## Verification

- Add contract tests for the four approved opacity values and the mobile homepage-specific override.
- Run the complete Museum Glass tests, Sass compilation, Prettier, and `git diff --check` before committing.
