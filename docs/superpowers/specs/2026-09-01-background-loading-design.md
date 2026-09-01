# Background Loading Design

## Goal

Make the Museum Glass background appear immediately without reducing the quality of the existing desktop or mobile high-resolution WebP assets.

## Design

- Keep `museum-glass-background-desktop.webp` and `museum-glass-background-mobile.webp` byte-for-byte unchanged.
- Add separate desktop and mobile `<link rel="preload" as="image">` hints before the main stylesheet. Media queries ensure only the image matching the current viewport is requested, and `fetchpriority="high"` promotes it above non-critical imagery.
- Add one very small blurred placeholder derived from the same painting. It sits beneath `body::before`, fills the viewport immediately after the main stylesheet arrives, and remains hidden by the high-resolution layer once that layer is decoded.
- Keep the current crop positions, palette wash, saturation, contrast, glass surfaces, and mobile breakpoint unchanged.
- Do not add JavaScript, an external image CDN, AVIF conversion, or service-worker caching.

## Performance Contract

- The high-resolution asset URLs in the preload hints and CSS must match exactly so the browser reuses one request.
- Desktop and mobile preload hints must have mutually exclusive media queries.
- The placeholder asset should be no larger than 10 KB.
- The original desktop and mobile high-resolution asset checksums must not change during implementation.

## Verification

- Add source-level tests for both preload hints, priority, media queries, placeholder presence, and the unchanged high-resolution URLs.
- Compile the Museum Glass Sass, validate formatting, and run `git diff --check`.
- Verify the placeholder size and compare pre/post checksums of both high-resolution files.
