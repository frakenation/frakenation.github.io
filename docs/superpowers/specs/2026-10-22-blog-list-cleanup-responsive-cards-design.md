# Blog List Cleanup and Responsive Cards Design

## Goal

Keep only the author's native posts on the Blog page and make each listing title and cover scale cleanly from desktop to mobile.

## Root cause and deletion scope

The two unwanted entries are generated during every Jekyll build from the template `external_sources` configuration. They are not local Markdown files. Replace the sample source list with an empty list so the generator produces neither the al-folio Medium entry nor the Google Blog entry. Keep the external-post plugin available for future intentional use.

## Listing structure

Give each list item stable, purpose-specific hooks:

- `.post-list-item` for the article row.
- `.post-list-item--with-thumbnail` for the responsive two-column state.
- `.post-list-copy` for title, description, date, and tags.
- `.post-list-title` for a Blog-only title size that does not change article-page titles.
- `.post-list-media` and `.post-list-thumbnail` for the cover container and image.

Desktop listings place text on the left and a bounded cover on the right. Mobile listings collapse to one column and move the cover above the text. Covers use `object-fit: contain` so wide architecture figures are not cropped.

## Responsive sizing

- Desktop/list title: `clamp(1.35rem, 2.6vw, 1.9rem)`.
- Mobile/list title: `clamp(1.25rem, 6.5vw, 1.65rem)`.
- Desktop cover column: `clamp(8.5rem, 22vw, 13rem)` with a `16 / 10` ratio.
- Mobile cover: full row width with a `16 / 9` ratio.

## Verification

Add a Node contract test that rejects the two sample URLs, requires an empty `external_sources` list, verifies the new Liquid hooks and accessible image attributes, and checks desktop/mobile CSS. Run all tests, Sass, Prettier, production Pages deployment, and live Blog HTML/CSS checks.
