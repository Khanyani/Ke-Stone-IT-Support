# Ke'Stone IT Support — Website Project

**Live site:** https://khanyani.github.io/Ke-Stone-IT-Support/

## Student Information
- **Student Name:** Khanyani Mnwana
- **Student Number:** ST10489373
- **Module:** WEDE5020
- **Assignment:** Portfolio Of Evidence (POE) — Website Project

## Project Overview
Ke'Stone IT Support is a newly established small business (founded 2026) providing fast, friendly, and
affordable IT support to small businesses, home-office workers, and individuals in Johannesburg — including
PC/laptop repair, network setup, cybersecurity basics, remote support, and ongoing maintenance plans. This
repository contains the full website project: the Part 1 written proposal, the Part 2 build (sitemap, file
structure, and the working HTML/CSS/JS website), and the Part 3 enhancements (interactivity, pricing plans,
accessibility and polish). The site is deployed with GitHub Pages.

## Website Goals and Objectives
- Generate qualified service enquiries and bookings from small businesses and individuals in the area.
- Clearly present service packages and indicative pricing to reduce back-and-forth phone calls.
- Enable customers to request a callout or remote support session directly through the website.
- Build credibility and trust for a brand-new business through a professional online presence, a founder
  story, and clear, honest pricing.

**Key Performance Indicators (KPIs):**
- Number of completed booking/enquiry form submissions per month.
- Contact/quote request conversion rate (enquiries ÷ website visitors).
- Page views on the Services and Pricing pages.
- Growth in newsletter or mailing list sign-ups for maintenance-plan customers.

## Pages and Content

| Page | File | What it contains |
|---|---|---|
| Home | `index.html` | Hero with "Request Support" and "View Services" calls-to-action, four featured services (PC & Laptop Repair, Network Setup, Cybersecurity Basics, Remote Support), a trust strip (Founded 2026 · 24hr typical response · 100% plain-English explanations) and a closing call-to-action band. |
| About Us | `pages/about.html` | Origin story (a 2026 start-up built on word-of-mouth), mission and vision, founder profile (Kestone — Founder & Lead Technician), and the three audiences served: small business owners, home-office/remote workers, and individuals/families. |
| Services | `pages/services.html` | Five services with indicative starting prices, a live search and category filter, and a three-tier maintenance plan section with a monthly/yearly billing switch. |
| Request Support | `pages/enquiry.html` | Booking/callout request form (see below). |
| Contact | `pages/contact.html` | Phone, WhatsApp, email, business hours, two embedded Google Maps (Sandton office and Randburg drop-off point) and a quick-question contact form. |
| Thank You | `pages/thank-you.html` | Confirmation page shown after a successful form submission. |

### Services and indicative pricing
| Service | Starting price |
|---|---|
| PC & Laptop Repair | From R450 per device, after diagnosis |
| Network Setup | From R700 per site setup |
| Cybersecurity Basics | From R600 per assessment & setup |
| Remote Support | From R250 per 30-minute session |
| Ongoing Maintenance Plans | From R900 per month, up to 5 devices |

All prices are indicative; final quotes depend on parts, travel and time and are confirmed before work begins.

### Maintenance plans
| Plan | Price (monthly) | Cover | Highlights |
|---|---|---|---|
| Home Essentials | R450 /month | Up to 2 devices | Monthly health check & updates, 1 remote session a month, antivirus upkeep, backup reminders, Wi-Fi troubleshooting, email support within 1 business day |
| **Business Care** (Popular) | R900 /month | Up to 5 devices | Monitored automated backups, unlimited remote sessions, priority response within 4 hours, one on-site visit a month, router & printer management, staff security walkthrough |
| Business Pro | R1750 /month | Up to 15 devices | Server & network monitoring, same-day on-site response, multi-site support, quarterly security review, hardware planning & advice, named support contact |

Switching to **Yearly** billing shows the yearly price (saving 20%).

## Key Features and Functionality

**Layout and navigation**
- Responsive multi-page website with semantic HTML5 (`header`, `nav`, `main`, `section`, `footer`).
- Shared header and footer loaded into every page from reusable partials by JavaScript, with an inline
  fallback so the layout still renders when the files are opened directly (`file://`).
- Sticky header that tightens and gains a shadow on scroll, with a mobile hamburger menu (closes on outside
  click, link click or the Escape key).
- Current page is highlighted in the navigation and marked with `aria-current="page"`.
- Footer on every page with contact details, quick links, social links and an auto-updating copyright year.

**Forms**
- Request Support form: Full Name, Email, Phone, Type of Issue (PC/Laptop repair, Network setup,
  Cybersecurity, Remote support, Maintenance plan, Other), Urgency (Urgent — today / Sometime this week /
  Flexible), Preferred Contact Method (Email / Phone call / WhatsApp) and a description of the issue.
- Contact form: Full Name, Email and Message.
- Client-side validation: required-field checks, email format check, inline error messages, `aria-invalid`
  on failing fields, focus moved to the first invalid field, and errors that clear as the visitor types.
- Live feedback: a form-completion progress bar, a valid-field indicator on blur, and a character counter
  (600 characters) on message boxes.
- On a valid submission a confirmation toast appears and the visitor is redirected to the Thank You page.
- This is a front-end demo: the forms are validated in the browser only and no data is stored or sent.

**Interactivity and polish**
- Live search and category chips (All / Repairs / Networks / Security / Remote) on the Services page, with a
  results counter that is announced to screen readers (`aria-live`).
- Monthly/Yearly pricing toggle for the maintenance plans, with animated price swap.
- Scroll-progress bar, back-to-top button, toast notifications, scroll-reveal animations, animated stat
  counters and a pointer-follow spotlight/ambient background on devices with a fine pointer.

**Accessibility**
- "Skip to main content" link on every page.
- Visible keyboard focus styles on links, buttons, form controls and map frames.
- Labelled form controls, `aria-label`s on icon-only buttons, `aria-expanded`/`aria-controls` on the menu toggle.
- `prefers-reduced-motion` support disables smooth scrolling and animations for users who request it.
- Descriptive page titles and meta descriptions on the content pages.

## Design
- **Visual direction:** "Night Workshop" — a deep ink background with an electric lime accent (`#c9f24d`) and a
  cyan secondary (`#55e6d0`), a faint blueprint-style grid, sharp-cornered cards with corner tick marks and
  offset-shadow buttons.
- **Typography:** Space Grotesk (headings and body) and IBM Plex Mono (labels, buttons, navigation, prices).
- **Styling approach:** one shared stylesheet using CSS custom properties (design tokens), CSS Grid and Flexbox
  with `auto-fit` columns and `clamp()` type sizing.
- **Responsive breakpoints:** 760px (tablet/mobile — collapses the nav, stacks hero buttons and stats, shrinks
  maps) and 420px (small phones — full-width buttons, tighter padding).

## Technologies Used
- HTML5
- CSS3 (custom properties, Grid, Flexbox, media queries, animations)
- Vanilla JavaScript (no frameworks or libraries)
- Google Maps embeds
- GitHub and GitHub Pages (version control and hosting)

## Timeline and Milestones
| Milestone | Description | Status |
|---|---|---|
| Weeks 1–2 | Research, service/pricing definition, and wireframing | Complete (Part 1) |
| Weeks 3–4 | Visual design and content writing | Complete (Part 1) |
| Weeks 5–6 | Development: HTML structure, CSS styling, booking form | Complete (Part 2) |
| Week 7 | Testing (form validation, mobile responsiveness, cross-browser) | Complete (Part 2) |
| Week 8 | Launch and GitHub repository handover | Complete (Part 2) — live on GitHub Pages |
| Part 3 | Further functionality, accessibility, and content refinement | Complete — see "Key Features and Functionality" |

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

## Part 2 Details
Part 2 turned the proposal into a working website: a sitemap and file structure, the shared header/footer,
the Home, About Us, Services, Request Support and Contact pages, a shared stylesheet and script, and
client-side form validation.
Refined the build with the Thank You page and post-submission redirect, the services search and filter,
the maintenance-plan pricing section with a billing switch, live form feedback (progress bar, validity
indicators, character counters), toast notifications, scroll and pointer effects, a redesigned "Night
Workshop" look, and the accessibility improvements listed above.

## Part 3
Coming soon

## Sitemap
```
Homepage (index.html)
 |-- About Us (pages/about.html)       — Story, mission, vision, founder, who we help
 |-- Services (pages/services.html)    — Services, indicative pricing, search/filter, maintenance plans
 |-- Contact (pages/contact.html)      — Contact details, two location maps, contact form
 `-- Request Support (pages/enquiry.html) — Booking / callout request form
       `-- Thank You (pages/thank-you.html) — Confirmation after a successful submission
```
All pages share a common header (logo + navigation menu) and footer (contact info, quick links, social links,
copyright).

**File and folder structure:**
```
Ke-Stone-IT-Support/
|-- index.html
|-- README.md
|-- pages/
|    |-- about.html
|    |-- services.html
|    |-- contact.html
|    |-- enquiry.html
|    `-- thank-you.html
|-- components/          (shared header and footer partials)
|-- assets/
|    |-- css/
|    |    `-- style.css
|    `-- js/
|         `-- script.js
`-- ST10489373__ICE_TASK_1_WEDE5020.docx
```

## Running the Site Locally
1. Clone the repository.
2. Open `index.html` in a browser. For the shared header/footer to load from the partial files, serve the
   folder with a simple local server (for example `python -m http.server`); opening the file directly still
   works thanks to the built-in fallback.

## Changelog
| Date | Change |
|---|---|
| 2026-08-05 | Part 1: Added Harvard-referenced Reference List to the written proposal document. |
| 2026-08-11 | Part 2: Created sitemap and file/folder structure documentation. |
| 2026-08-11 | Part 2: Built the main pages with shared header/footer navigation. |
| 2026-10-10 | Part 3: Reorganised pages into `pages/` and assets into `assets/`; added Thank You page, services search/filter, maintenance plans with monthly/yearly billing switch, live form feedback, toasts and scroll/pointer effects, "Night Workshop" redesign and accessibility improvements. |
| 2026-10-10 | Docs: Rewrote this README to reflect the live website. |

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