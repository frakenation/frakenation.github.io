# Museum Glass Personal-Site Redesign

## Objective

Restyle the existing al-folio site around the supplied landscape painting. The
result should feel like a refined museum display: warm, restrained, readable,
and consistent across desktop and mobile. The initial release uses a coffee
palette. A reserved forest-green palette must be switchable later without
rewriting components.

The redesign does not change page content, navigation structure, publication
data, or information architecture.

## Approved Direction

The approved visual direction is **A — Museum Glass**:

- A fixed, full-viewport painting sits behind the site.
- A single coherent frosted surface contains the main content.
- The homepage glass is more transparent so the painting remains present.
- Long-form pages use a more opaque surface for sustained reading.
- Borders and shadows are subtle and warm; there are no glow effects,
  background animations, or exaggerated rounded corners.
- The site is forced to light mode. The theme switch is removed, and operating
  system dark-mode preferences do not change the design.

## Background Assets and Composition

The source image is
`/Users/poplil/Downloads/image-from-rawpixel-id-2677423-jpeg.jpg`, measuring
3719 × 2735 pixels.

Implementation will create optimized local derivatives in `assets/img/`:

- A desktop WebP derivative that preserves the full horizontal composition.
- A portrait mobile WebP crop focused near 73% of the image width, preserving
  the figure, sky, and meadow selected in the approved **B — Figure Focus**
  mobile mockup.
- The source JPEG remains the fallback for browsers without WebP support.

A fixed pseudo-element behind the page will render the background. This avoids
the inconsistent mobile Safari behavior of `background-attachment: fixed`.
Desktop uses centered `cover` composition; mobile uses the dedicated portrait
crop rather than relying on an unpredictable viewport crop.

The background receives slight desaturation and a warm translucent wash. The
painting itself is not permanently blurred. Blur belongs to the content
surfaces through `backdrop-filter`, which keeps the image recognizable outside
the glass.

## Color System

All visual colors are expressed as semantic CSS custom properties. Components
must consume semantic names rather than hard-coded palette values.

### Active Coffee Palette

| Token             | Value                       | Purpose                                    |
| ----------------- | --------------------------- | ------------------------------------------ |
| `--ink-primary`   | `#4a3028`                   | Headings and primary text                  |
| `--ink-strong`    | `#2e211d`                   | Dense body text and maximum contrast       |
| `--ink-muted`     | `#75584a`                   | Secondary text and metadata                |
| `--accent`        | `#8a5d3b`                   | Links, active navigation, and focus states |
| `--glass-home`    | `rgba(248, 242, 232, 0.62)` | Homepage content surface                   |
| `--glass-reading` | `rgba(248, 242, 232, 0.84)` | Long-form content surface                  |
| `--glass-border`  | `rgba(255, 255, 255, 0.62)` | Fine glass edge                            |
| `--shadow-warm`   | `rgba(54, 36, 27, 0.18)`    | Soft elevation shadow                      |

### Reserved Forest Palette

| Token             | Value                       | Purpose                                    |
| ----------------- | --------------------------- | ------------------------------------------ |
| `--ink-primary`   | `#173f34`                   | Headings and primary text                  |
| `--ink-strong`    | `#0f2b25`                   | Dense body text and maximum contrast       |
| `--ink-muted`     | `#45685b`                   | Secondary text and metadata                |
| `--accent`        | `#557d68`                   | Links, active navigation, and focus states |
| `--glass-home`    | `rgba(237, 241, 231, 0.64)` | Homepage content surface                   |
| `--glass-reading` | `rgba(237, 241, 231, 0.86)` | Long-form content surface                  |
| `--glass-border`  | `rgba(250, 252, 245, 0.66)` | Fine glass edge                            |
| `--shadow-warm`   | `rgba(18, 52, 42, 0.18)`    | Soft elevation shadow                      |

Both palettes are defined, but the document root selects only `coffee`. There
is no visitor-facing palette switch. A later change to forest green should
require changing one root palette attribute or selector.

## Typography

The site uses three deliberate typography roles:

1. `Cormorant Garamond` for the site name, page titles, section headings, and
   navigation. Section headings use uppercase styling, moderate tracking, and
   restrained medium or semibold weights. It is the licensed-safe stand-in for
   the Nous Hermes site's Sigurd Variable display face.
2. `Courier Prime` for long paragraphs, biographies, long-form post content,
   and expanded abstracts. Line height and measure are increased to prevent the
   typewriter texture from becoming tiring.
3. The existing system sans-serif stack for publication authors, dates,
   buttons, badges, captions, form controls, and other dense utility text.

Fonts are loaded as local WOFF2 assets where licensing permits. They use
`font-display: swap` and explicit fallback stacks to avoid invisible text and
layout instability.

## Layout and Components

The existing Jekyll/Liquid structure remains intact. Styling is implemented in
a focused SCSS partial imported by `assets/css/main.scss`, with minimal Liquid
changes only where a stable page or layout class is required.

### Global Background

The background layer is a non-interactive, fixed pseudo-element below all site
content. It covers viewport changes, safe areas, and long pages without
introducing scroll jank.

### Navigation

The fixed navigation becomes a narrow frosted bar using the same palette and
blur language as the main surface. Navigation labels use Cormorant Garamond in
uppercase. The dark-mode control is omitted because the site is light-only.

### Main Content Surface

The existing maximum content width remains 930 pixels. The primary container
receives a fine border, restrained corner radius, warm shadow, and blur. The
homepage uses `--glass-home`; publications, CV, blog posts, teaching, projects,
and other reading-heavy pages use `--glass-reading`.

The glass treatment must not be repeated around every paragraph. Cards already
present in al-folio may use a lighter nested surface, but the page reads as one
continuous panel rather than a stack of unrelated translucent boxes.

### Footer and Embedded Content

The footer uses a compact translucent surface compatible with its current fixed
configuration. Code blocks, tables, bibliography entries, badges, and images
retain their functional layouts and receive only the minimum color adjustments
needed for contrast.

## Responsive Behavior

At widths below 768 pixels:

- Use the portrait figure-focused background derivative.
- Reduce page margins and glass corner radius.
- Increase glass opacity slightly to protect text over the tighter crop.
- Scale headings with `clamp()` and prevent long uppercase titles from
  overflowing.
- Keep paragraph text at a minimum readable size with a relaxed line height.
- Collapse navigation through the theme's existing mobile menu behavior.
- Respect safe-area insets and avoid horizontal scrolling at 320 pixels wide.
- Reduce blur and shadow cost where necessary for stable mobile scrolling.

## Compatibility and Fallbacks

Browsers supporting `backdrop-filter` receive the full Museum Glass treatment.
Browsers without support receive a more opaque warm surface and the same border
and shadow, preserving readability and hierarchy. The page remains usable if a
font or optimized image fails to load because every asset has a local fallback.

## Verification

Implementation is complete only after the following checks pass:

- Run Prettier on the changed files.
- Build the site using the repository's Docker workflow.
- Inspect the homepage, publications, CV, projects, blog listing, and one long
  article at desktop and mobile widths.
- Check at 1440, 1024, 768, 430, 390, and 320 pixels for overflow and cropping.
- Confirm the mobile background retains the figure and that desktop retains the
  full painting composition.
- Confirm the theme switch is absent and system dark mode does not alter colors.
- Confirm headings, long prose, and dense metadata use their assigned font roles.
- Confirm keyboard focus, links, buttons, and publication badges remain clear.
- Confirm text contrast and no-content-without-style fallbacks remain readable.

## Deferred Change

The forest-green palette is defined but inactive. Activating it later is a
palette-selection change only; it does not require new layout, typography,
background, or component code.
