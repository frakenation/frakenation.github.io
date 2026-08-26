# Profile Contact Hierarchy Design

## Scope

Refine the existing Museum Glass homepage without changing its background, palette, publication layout, or long-form typography. The homepage identity block becomes more compact, contact actions move next to the portrait, and the Blog masthead is reduced.

## Homepage identity

- Display the homepage name as `Tingyu Yang · Theo Yang`.
- Give this heading a homepage-specific class and a smaller responsive size than the existing general page-title scale.
- Preserve Cormorant Garamond, the coffee palette, uppercase treatment, and mobile wrapping behavior.

## Portrait contact block

- Replace the visible address with `tyang5990@gmail.com`.
- Prefix the visible address with `📧` and keep both the emoji and address inside the direct `mailto:tyang5990@gmail.com` link.
- Keep `_data/socials.yml` synchronized so metadata and search integrations use the same address.
- Remove `Shanghai Jiao Tong University` and `Shanghai, China` from the portrait metadata.
- Place exactly three icon links below the email: GitHub, Google Scholar, and Bilibili.
- Use the existing Font Awesome and Academicons fonts; do not download new icon assets.
- Open external profile links in a new tab with `rel="noopener noreferrer"` and give every icon an accessible label.
- Remove the separate bottom-of-page social block to avoid duplicate links.

## Blog masthead

- Give the Blog masthead heading its own class.
- Reduce its responsive size while retaining the existing Cormorant Garamond uppercase styling.

## Responsive behavior

- Keep the portrait metadata centered below the image.
- Keep icon hit targets comfortably separated on desktop and mobile.
- Allow the bilingual name to wrap naturally on narrow screens without overflowing.

## Verification

- Add source-level contract tests for the bilingual name, mail link, three profile URLs, removed location strings, hidden duplicate social block, and targeted heading classes.
- Run the Node contract tests, Sass compiler, Prettier, and `git diff --check` before committing.
