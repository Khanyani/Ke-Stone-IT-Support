# Changelog

All notable changes to the Ke'Stone IT Support website are recorded here, newest first.
Each entry says what the problem or need was, what changed and why. Versions follow the
project parts: v1 = Part 1 (proposal), v2 = Part 2 (build), v3+ = Part 3 and later improvements.
Commit history on GitHub has the exact code changes for each entry.

## [5.9] - 2026-11-01
### Added
- Language switch (English / isiXhosa): an `XH` / `EN` button in the main menu on every page, saved in the browser so the chosen language follows the visitor from page to page.
- `assets/js/i18n.js` (switching engine) and `assets/js/lang-xh.js` (isiXhosa dictionary). Content built by scripts (tips, price estimate, search results, open-now status, form messages) is translated as it appears.
### Changed
- The page `lang` attribute switches between `en` and `xh`; the browser tab title is translated.
- Privacy Policy and Terms keep their full legal text in English, with a short notice, so the legal meaning is not altered.
### Notes
- Text without a translation stays in English instead of showing blanks. The isiXhosa wording should be reviewed by a first-language speaker before the business relies on it.

## [5.8] - 2026-11-01
### Added
- `CHANGELOG.md` with every version grouped as Added, Changed and Fixed.

## [5.7] - 2026-10-31
### Fixed
- Search showed no price for the first five services: the index used the shorter Home page cards. It now takes service details from `pages/services.html` only.
### Changed
- Service search results are full cards: picture, full description, starting price and unit, "Request this service" and "View on Services page" buttons.
- Search matches plurals ("services" finds "service") and prices ("450", "R1200"), and scrolls to the results after a search.

## [5.6] - 2026-10-30
### Added
- Site search page (`pages/search.html`), generated index (`assets/data/search-index.js`) and build script (`tools/build_search_index.py`).
- Search icon in the main menu, "Search the site" footer link and a search box on the 404 page.
- `id`s on service cards so search results link to the exact card.

## [5.5] - 2026-10-30
### Added
- A picture on every service card (11 on Services, 4 on Home), stored in `assets/images/services/`, opening in the lightbox.
### Changed
- The lightbox follows the active Services filter instead of stepping through hidden cards.

## [5.4] - 2026-10-30
### Added
- Service cards are clickable and open the enquiry form with that service pre-selected (`enquiry.html?service=backup`).

## [5.3] - 2026-10-30
### Added
- Instagram, X (Twitter), TikTok and YouTube links in the footer of every page and in the script fallback footer.
### Fixed
- The fallback footer's social list overflowed the page on the thank-you page; it now wraps.

## [5.2] - 2026-10-30
### Changed
- README documents the new services, branch, tests and SEO keywords.

## [5.1] - 2026-10-30
### Added
- Gqeberha (Port Elizabeth) branch: address card with Google map, Leaflet marker, 20 km service-area circle, "Gqeberha Branch", "Gauteng area" and "Show both regions" map buttons.
### Changed
- Footer text, FAQ answer, structured data (`areaServed`) and Privacy Policy mention Gqeberha.

## [5.0] - 2026-10-30
### Added
- Six services with starting prices: Data Backup & Recovery, Printer & Peripheral Setup, Email & Microsoft 365 Setup, Software Installation & Upgrades, Hardware Upgrades & Custom PC Builds, CCTV & Smart Home Setup.
- Backup, Setup and Upgrades filter chips; new options and estimates on the enquiry form; two rows in the Repairs turnaround table.

## [4.4] - 2026-10-22
### Changed
- README documents the new pages, structure, changelog and tests.

## [4.3] - 2026-10-22
### Added
- Unique titles, descriptions and canonical tags for the new pages, sitemap entries, and `noindex` on the 404 page.

## [4.2] - 2026-10-22
### Added
- Request tracker on the Repairs page: enquiry references are saved in the visitor's browser and can be looked up with format validation.

## [4.1] - 2026-10-22
### Changed
- Repairs added to the main menu; Repairs, Privacy Policy and Terms links added to every footer.

## [4.0] - 2026-10-22
### Added
- `404.html` (branded error page that works from any depth on GitHub Pages), `pages/repairs.html` (process, tabbed diagnostics, turnaround table), `pages/privacy.html` (POPIA-based) and `pages/terms.html`.

## [3.7] - 2026-10-16
### Changed
- README updated with features, structure, how to run, deployment, testing summary and references.

## [3.6] - 2026-10-16
### Fixed
- The map called `fitBounds` on a circle that was not on the map yet, which stopped later features (including the contact form) from starting. Replaced with `L.latLng().toBounds()` and wrapped each feature in `try/catch`.

## [3.5] - 2026-10-15
### Changed
- Added `defer` to script tags so pages render sooner.

## [3.4] - 2026-10-15
### Added
- SEO: descriptions for pages that lacked them, Open Graph tags, canonical links, JSON-LD (business and FAQ), `sitemap.xml`, `robots.txt`, favicon, `noindex` on the thank-you page.

## [3.3] - 2026-10-15
### Added
- Accordion FAQ, Leaflet map, image gallery with lightbox, sort control, "open now" status from business hours, IT tips loaded from JSON, and a live estimate on the enquiry form (`assets/js/features.js`).

## [3.2] - 2026-10-15
### Changed
- Enquiry and contact forms now serve different purposes: enquiry shows an in-page response (estimate, reference, expected reply) using `fetch`; contact compiles the message into an email to the recipient.
- New fields: preferred date, service location, consent (enquiry); message type, subject, optional phone (contact).

## [3.1] - 2026-10-15
### Added
- Validation for South African phone numbers, dates (not past, not Sunday, within 6 months), minimum lengths and required checkboxes.

## [3.0] - 2026-10-15
### Fixed
- The home page showed two footers (a static footer plus an empty include that `script.js` filled with a copy). The empty slot was removed.

## [2.1] - 2026-09-04 to 2026-10-09
### Added
- Dark "Night Workshop" theme, responsive styling, maintenance plan pricing section with monthly/yearly switch, thank-you page, scroll effects, toasts, back-to-top button and sitewide interaction enhancements.
### Changed
- Footer and branding adjustments across pages.

## [2.0] - 2026-08-11
### Added
- Sitemap and file/folder structure documentation.
- `index.html`, `about.html`, `services.html`, `enquiry.html` and `contact.html` with shared header and footer.

## [1.0] - 2026-08-05
### Added
- Part 1 written proposal with a Harvard-referenced reference list.
