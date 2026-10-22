# PixelDiT Seminar Blog Migration Design

## Goal

Publish the body of `PixelDiT_组会串讲_含DiP_DeCo_Fig5.html` as a native Jekyll blog post that follows the site's Museum Glass visual system.

## Content boundary

- Keep the five article sections, explanatory prose, equations, figures, captions, tables, and inline source links.
- Exclude the source document's header, navigation, footer, slide-shell styling, and standalone page metadata.
- Use the Jekyll post layout for the title, date, tags, navigation, and site footer.

## Structure and assets

- Create `_posts/2026-10-22-pixeldit-pixeldit2-iris-3b.md`.
- Extract all 19 embedded data-URI images into `assets/img/blog/pixeldit-seminar/` with descriptive filenames.
- Keep images lossless and reference them through `relative_url` so deployment paths remain correct.
- Scope article-specific layout rules under `.pixeldit-article` in `_sass/_museum-glass.scss`.

## Visual treatment

- Inherit the site's coffee-colored reading glass, Cormorant Garamond display typography, and Courier Prime prose typography.
- Render section labels and technical callouts with the existing coffee palette rather than the source HTML's presentation colors.
- Preserve two-column comparisons on wide screens and collapse every grid, table, and figure safely on mobile.

## Verification

- Add a Node contract test for the post front matter, five sections, 19 local images, absence of embedded Base64/header/footer/navigation, and responsive scoped styling.
- Run the contract tests, Sass compilation, Prettier, repository diff checks, GitHub Pages deployment, and live HTML/CSS checks.
