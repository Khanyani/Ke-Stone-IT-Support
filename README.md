# Ke'Stone IT Support — Website Project

## Student Information
- **Student Name:** Khanyani Mnwana
- **Student Number:** ST10489373
- **Module:** WEDE5020
- **Assignment:** Portfolio Of Evidence (POE) — Website Project

## Project Overview
Ke'Stone IT Support is a newly established small business (founded 2026) providing fast, friendly, and
affordable IT support to small businesses, home-office workers, and individuals in the local area — including
PC/laptop repair, network setup, cybersecurity basics, remote support, and ongoing maintenance plans. This
repository contains the full website project: the Part 1 written proposal, and the Part 2 build (sitemap,
file structure, and the working HTML/CSS/JS website).

## Website Goals and Objectives
- Generate qualified service enquiries and bookings from small businesses and individuals in the area.
- Clearly present service packages and indicative pricing to reduce back-and-forth phone calls.
- Enable customers to request a callout or remote support session directly through the website.
- Build credibility and trust for a brand-new business through a professional online presence and visible
  testimonials.

**Key Performance Indicators (KPIs):**
- Number of completed booking/enquiry form submissions per month.
- Contact/quote request conversion rate (enquiries ÷ website visitors).
- Page views on the Services and Pricing pages.
- Growth in newsletter or mailing list sign-ups for maintenance-plan customers.

## Key Features and Functionality
**Part 2 (original build)**
- Responsive 5-page website: Home, About Us, Services, Enquiry, and Contact (extended in Part 3 with Repairs, Privacy, Terms and a 404 page, see below).
- Sticky header navigation with a mobile hamburger menu, skip link and `aria-current` page highlighting.
- Service cards with indicative pricing, live search + category filter, monthly/yearly pricing switch.
- Scroll reveal, animated counters, toasts, back-to-top button and scroll-progress bar.
- Semantic HTML5 (`header`, `nav`, `main`, `section`, `footer`) with a shared stylesheet and script.

**Part 3 (new)**
| Feature | Where | Files |
|---|---|---|
| Accordion FAQ (keyboard + ARIA, one answer open at a time) | `services.html` | `features.js`, `style.css` |
| Image gallery + lightbox (next/previous, Esc, backdrop click, swipe, focus trap) | `about.html` | `features.js` |
| Interactive Leaflet map: 2 markers with popups, service-area circle, "fly to" buttons, directions links | `contact.html` | `features.js`, `assets/vendor/leaflet/` |
| Sort control (name / price) added to the existing search + filter | `services.html` | `features.js` |
| Dynamic content: "Open now" status computed from business hours (SA time) | Home, Contact, Enquiry | `features.js` |
| Dynamic content: IT tips loaded from JSON with topic filter | `index.html` | `assets/data/tips.json`, `features.js` |
| Live cost/response estimate that changes with the selected issue and urgency | `enquiry.html` | `features.js` |
| Enquiry form: new fields (preferred date, service mode radios, consent checkbox), AJAX (`fetch`) submit and in-page response with reference number | `enquiry.html` | `script.js`, `features.js` |
| Contact form: message type, subject, optional phone; validated data is compiled into an email (`mailto:`) to `hello@kestone-it.co.za` | `contact.html` | `features.js` |
| SEO: unique titles/descriptions, Open Graph tags, canonical URLs, JSON-LD (`ComputerRepair` and `FAQPage`), `sitemap.xml`, `robots.txt`, favicon, descriptive image names and alt text | all pages | HTML head, root files |

**Additional pages and features (post-Part 3 extension)**
| Page / feature | File | What it does |
|---|---|---|
| Repairs & Diagnostics | `pages/repairs.html` | Six-step repair process, accessible tabbed diagnostics (hardware, software, network, data and security), turnaround and starting-price table, and a request tracker |
| Request tracker | `repairs.html`, `features.js` | Enquiry references (e.g. `KS-20261022-1234`) are saved in the visitor's browser (`localStorage`) and can be looked up on the Repairs page. The reference format is validated and unknown references get a clear message |
| Privacy Policy | `pages/privacy.html` | POPIA-based policy: what is collected through each form, purposes, browser storage, third-party maps, retention, security, user rights and the Information Regulator |
| Terms & Conditions | `pages/terms.html` | Quotes and diagnostics, bookings, backups, remote support, payment, 30-day warranty, device collection, liability and governing law (South Africa) |
| Custom 404 page | `404.html` | Branded error page with the missing address and links to the main pages. A small script sets `<base href>` so the links work from any depth on GitHub Pages (`/Ke-Stone-IT-Support/`) and on a local server. Marked `noindex` |
| Navigation and footer | all pages, `script.js` | "Repairs" added to the main menu; footer links to Repairs, Privacy Policy and Terms on every page (including the script fallback markup) |
| Six new services | `pages/services.html`, `enquiry.html`, `repairs.html` | Data Backup & Recovery (from R550), Printer & Peripheral Setup (from R350), Email & Microsoft 365 Setup (from R500), Software Installation & Upgrades (from R300), Hardware Upgrades & Custom PC Builds (from R600 labour), CCTV & Smart Home Setup (from R1200). The Services grid now has 11 services, extra filter chips (Backup, Setup, Upgrades), the enquiry form lists them with live estimates, and the Repairs table has two new rows |
| Gqeberha (Port Elizabeth) branch | `pages/contact.html`, `features.js` | Third location at 27 Cape Road, Newton Park, Gqeberha (Port Elizabeth): its own address card and Google map, a marker and 20 km service-area circle on the interactive map, a "Gqeberha Branch" button, plus "Gauteng area" and "Show both regions" buttons. Footer, structured data (`areaServed`), FAQ and Privacy Policy mention it |
| Tabs component | `features.js`, `style.css` | WAI-ARIA tabs with arrow, Home and End key support |

The Privacy Policy and Terms are written in plain language for this project. The warranty period, notice periods and similar figures are draft business rules and should be confirmed by the business owner; they are not legal advice.

### Form design
The two forms serve different purposes, as the brief requires:
- **Enquiry (`pages/enquiry.html`)** - a request about a specific service. After validation the visitor sees an indicative cost, the response they can expect for their urgency, and a reference number, without a page reload. `form action="thank-you.html" method="get"` is the no-JavaScript fallback. To send the data to a real service (e.g. Formspree), put its URL in the form's `data-endpoint` attribute; the same `fetch` code will POST to it.
- **Contact (`pages/contact.html`)** - a general message. After validation the name, email, phone, message type, subject and message are compiled into an email addressed to the recipient defined in `features.js` (`CONTACT_RECIPIENT`) and opened in the visitor's email app. `action="mailto:..."` is the fallback.

**Validation (HTML5 + JavaScript):** `required`, `type=email/tel/date`, `minlength`/`maxlength`, plus JavaScript rules in `script.js` for email format, South African phone format, dates (not in the past, not on a Sunday, within 6 months), minimum lengths and the consent checkbox. Errors appear next to the field; both valid and invalid input were tested.

### SEO keywords targeted
"IT support Johannesburg", "IT support Gqeberha", "IT support Port Elizabeth", "laptop repair Sandton", "Wi-Fi setup Randburg", "small business IT support", "remote IT support", "IT maintenance plan". These appear naturally in titles, descriptions, headings and body text. Off-page/local SEO: consistent business name, address and hours across pages and structured data; the Facebook, LinkedIn and WhatsApp footer links are the starting point for social promotion and a Google Business Profile listing once the business is live.

### Security notes
Input is validated on the client; no API keys, passwords or credentials are stored in the repository (Leaflet is vendored locally and OpenStreetMap tiles need no key). User text is inserted with `textContent`, not `innerHTML`. External links use `rel="noopener"`. GitHub Pages serves the site over HTTPS. Because the site is static, real server-side validation would be needed if a backend is added.

## Timeline and Milestones
| Milestone | Description | Status |
|---|---|---|
| Weeks 1–2 | Research, service/pricing definition, and wireframing | Complete (Part 1) |
| Weeks 3–4 | Visual design and content writing | Complete (Part 1) |
| Weeks 5–6 | Development: HTML structure, CSS styling, booking form | Complete (Part 2) |
| Week 7 | Testing (form validation, mobile responsiveness, cross-browser) | Complete (Part 2 and Part 3) |
| Week 8 | Launch and GitHub repository handover | Complete (Part 3) |
| Part 3 | Interactive features, SEO, form validation, GitHub and deployment | Complete |

## Part 1 Details
Part 1 consisted of a written Website Project Proposal covering:
1. Organisation Overview
2. Website Goals and Objectives
3. Current Website Analysis
4. Proposed Website Features and Functionality
5. Design and User Experience (colour scheme, typography, layout, low-fidelity wireframe)
6. Technical Requirements
7. Timeline and Milestones
8. Budget
9. References

The Part 1 proposal document is included in this repository as
`ST10489373__ICE_TASK_1_WEDE5020.docx`.

*(Part 2 and Part 3 details are covered in this README and the website files below.)*

## Sitemap
```
Homepage (index.html)
 |-- About Us (about.html)       — History, mission, vision, founder bio
 |-- Services (services.html)    — Service packages & indicative pricing
 |-- Repairs (repairs.html)      — Repair process, diagnostics, turnaround, request tracker
 |-- Privacy Policy (privacy.html), Terms & Conditions (terms.html) — linked from every footer
 `-- 404.html                    — Shown by the host for any missing address
 |-- Enquiry (enquiry.html)      — Booking / callout request form
 `-- Contact (contact.html)      — Contact details, two location maps, contact form
```
All pages share a common header (logo + navigation menu) and footer (contact info, social links, copyright).

**File and folder structure:**
```
Ke-Stone-IT-Support/
|-- index.html
|-- 404.html
|-- robots.txt
|-- sitemap.xml
|-- README.md
|-- pages/
|    |-- about.html
|    |-- services.html
|    |-- enquiry.html
|    |-- contact.html
|    |-- repairs.html
|    |-- privacy.html
|    |-- terms.html
|    `-- thank-you.html
`-- assets/
     |-- css/style.css
     |-- js/script.js        (shared behaviour + form validation)
     |-- js/features.js      (Part 3 features)
     |-- data/tips.json      (dynamic content)
     |-- images/             (favicon + gallery/ illustrations)
     `-- vendor/leaflet/     (Leaflet 1.9.4, BSD-2 licence)
```

## How to Run
1. Download or clone the repository: `git clone https://github.com/Khanyani/Ke-Stone-IT-Support.git`
2. Open `index.html` in a browser. For full behaviour (the IT-tips JSON is fetched), serve the folder with a local server instead, e.g. `python -m http.server 8000` and visit `http://localhost:8000/`, or use the VS Code Live Server extension.
3. The interactive map needs an internet connection for the OpenStreetMap tiles.

## Deployment
- **Repository:** https://github.com/Khanyani/Ke-Stone-IT-Support
- **Live website (GitHub Pages, branch `main`, root folder):** https://khanyani.github.io/Ke-Stone-IT-Support/ *(to be submitted on ARC; confirm the URL after enabling Pages under Settings > Pages)*
- All paths are relative, so the site works from a sub-folder URL. The canonical URLs and `sitemap.xml` use the address above; update them if a different host (e.g. Netlify) is used.

## Testing Summary
| Area | Test | Result |
|---|---|---|
| Feedback fixes | Re-tested the duplicate footer on the home page | Fixed - one footer |
| JavaScript | Accordion, lightbox (click, arrows, Esc), map markers/popups, filter, search, sort, tips filter | Pass |
| Forms | Empty, invalid phone/email, short text, unticked consent, then valid input on both forms | Errors shown beside fields; valid input follows the intended path |
| Responsive | 375 px width on all pages | No horizontal overflow; menu, map and forms usable |
| SEO | Titles, descriptions, headings, alt text, sitemap, robots | Present on every page |
| New pages | Tabs (mouse and arrow keys), tracker with valid, invalid and unknown references, legal page contents tables | Pass |
| Links | Every internal link on all pages requested and checked | No broken links, one footer per page |
| 404 | Opened `404.html` and followed its links | Styles, base path and links resolve |

## Changelog
| Date / Version | Area | Issue / Feedback | Change Made | Reason / Result |
|---|---|---|---|---|
| 2026-08-05 | Part 1 | Proposal had no reference list | Added Harvard-referenced Reference List to the written proposal | Sources are traceable |
| 2026-08-11 | Part 2 | Site structure undocumented | Created sitemap and file/folder structure documentation | Easy to navigate the project |
| 2026-08-11 | Part 2 | No website yet | Built `index.html`, `about.html`, `services.html`, `enquiry.html`, `contact.html` with shared header/footer | Working 5-page site |
| v3.0 2026-10-15 | Home page | The home page showed two footers (a static footer plus an empty include that script.js filled with a second copy) | Removed the empty `data-include="footer"` slot from `index.html` | One footer, correct layout |
| v3.1 2026-10-15 | Forms | Phone, date and text-length values were never checked, and consent could not be required | Added `extraCheck()` in `script.js`: SA phone pattern, date rules, `minlength`, required checkbox | Prevents invalid submissions |
| v3.2 2026-10-15 | Forms | Enquiry and contact forms ended the same way (redirect to the thank-you page) | Enquiry now shows an in-page response (estimate, reference, expected reply) via `fetch`; contact compiles an email to the recipient; added fields and `action`/`method` attributes | Each form serves its own purpose |
| v3.3 2026-10-15 | Interactivity | Site had no accordion, map, gallery or dynamic content | Added accordion FAQ, Leaflet map, gallery + lightbox, sort control, open-now status, JSON-loaded tips, live estimate (`features.js`) | Meets Part 3 functionality brief |
| v3.4 2026-10-15 | SEO | Missing descriptions on home, enquiry and thank-you pages; no social tags, structured data, sitemap or favicon | Added unique descriptions, Open Graph tags, canonical links, JSON-LD, `sitemap.xml`, `robots.txt`, favicon; `noindex` on the thank-you page | Better search-result relevance |
| v3.5 2026-10-15 | Performance | Scripts blocked page rendering | Added `defer` to script tags | Faster first paint |
| v3.6 2026-10-16 | Map | `fitBounds` was called on a circle not yet on the map, which stopped later features (including the contact form) from starting | Replaced it with `L.latLng().toBounds()` and isolated each feature in `try/catch` | Contact form and map both work |
| v3.7 2026-10-16 | Docs | README out of date | Updated features, structure, how to run, deployment, testing, references | Lecturer can verify the work |
| v4.0 2026-10-22 | Site completeness | No custom error page, no legal pages and no page explaining the repair process | Added `404.html`, `privacy.html`, `terms.html` and `repairs.html` | A more complete, trustworthy business website |
| v4.1 2026-10-22 | Navigation | New pages could not be reached from the menu or footer | Added Repairs to the menu and Repairs, Privacy and Terms to every footer (and the script fallback markup in `script.js`) | Every page is reachable in one click |
| v4.2 2026-10-22 | Features | Customers had no way to check on a submitted request | Enquiry references are saved to `localStorage` and looked up by a validated tracker on the Repairs page | Customer self-service without a backend |
| v4.3 2026-10-22 | SEO | New pages not listed for search engines | Added unique titles/descriptions/canonical tags and sitemap entries; 404 is `noindex` | Consistent discoverability |
| v4.4 2026-10-22 | Docs | README out of date | Documented new pages, structure, changelog and tests | Lecturer can verify the work |

## References
Baymard Institute (2025) *E-commerce checkout usability research.* Available at:
[https://baymard.com/research/checkout-usability](https://baymard.com/research/checkout-usability)
(Accessed: 5 August 2026).

Duckett, J. (2014) *JavaScript and jQuery: interactive front-end web development.* Hoboken, NJ: Wiley.
Available at:
[https://www.wiley.com/en-us/JavaScript+and+jQuery%3A+Interactive+Front-End+Web+Development-p-9781118531648](https://www.wiley.com/en-us/JavaScript+and+jQuery%3A+Interactive+Front-End+Web+Development-p-9781118531648)
(Accessed: 5 August 2026).

Mozilla Developer Network (2025) *Responsive web design.* Available at:
[https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)
(Accessed: 5 August 2026).

Sandhya, I. and Suchithra (2017) 'User interface design in e-commerce website', *Imperial Journal of
Interdisciplinary Research*, 3(5). Available at:
[https://www.semanticscholar.org/paper/User-Interface-Design-in-E-commerce-Website-Sandhya-Suchithra/b3bcf2ca4ff173c6e1a94f3d0ae6dcf6a0a0ecee](https://www.semanticscholar.org/paper/User-Interface-Design-in-E-commerce-Website-Sandhya-Suchithra/b3bcf2ca4ff173c6e1a94f3d0ae6dcf6a0a0ecee)
(Accessed: 5 August 2026).

World Wide Web Consortium (W3C) (2023) *Web content accessibility guidelines (WCAG) 2.2.* Available at:
[https://www.w3.org/TR/WCAG22/](https://www.w3.org/TR/WCAG22/) (Accessed: 5 August 2026).

WordPress.org (2025) *WordPress documentation.* Available at:
[https://wordpress.org/documentation/](https://wordpress.org/documentation/) (Accessed: 5 August 2026).

Agafonkin, V. (2023) *Leaflet: an open-source JavaScript library for interactive maps*, version 1.9.4. Available at:
[https://leafletjs.com/](https://leafletjs.com/) (Accessed: 15 October 2026).

Google (2025) *Search Engine Optimization (SEO) starter guide.* Available at:
[https://developers.google.com/search/docs/fundamentals/seo-starter-guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
(Accessed: 15 October 2026).

Mozilla Developer Network (2025) *Client-side form validation.* Available at:
[https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation)
(Accessed: 15 October 2026).

OpenStreetMap contributors (2026) *OpenStreetMap.* Available at:
[https://www.openstreetmap.org/copyright](https://www.openstreetmap.org/copyright) (Accessed: 15 October 2026).

Information Regulator (South Africa) (2026) *Protection of Personal Information Act (POPIA).* Available at:
[https://inforegulator.org.za/](https://inforegulator.org.za/) (Accessed: 22 October 2026).

GitHub (2026) *Creating a custom 404 page for your GitHub Pages site.* Available at:
[https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)
(Accessed: 22 October 2026).

Schema.org (2026) *LocalBusiness and FAQPage structured data.* Available at:
[https://schema.org/](https://schema.org/) (Accessed: 15 October 2026).

World Wide Web Consortium (W3C) (2025) *WAI-ARIA Authoring Practices Guide: Accordion and Dialog patterns.* Available at:
[https://www.w3.org/WAI/ARIA/apg/](https://www.w3.org/WAI/ARIA/apg/) (Accessed: 15 October 2026).
