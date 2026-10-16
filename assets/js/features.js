/* =========================================================
   Ke'Stone IT Support — Part 3 features (loaded after script.js)
   1. Accordion (FAQ)                      services.html
   2. Image gallery + lightbox             about.html
   3. Interactive Leaflet map              contact.html
   4. Sort control for the services grid   services.html
   5. Dynamic content
        5a. "Open now" status (business hours)   index / contact / enquiry
        5b. IT tips loaded from JSON + filter    index.html
        5c. Live estimate panel                  enquiry.html
   6. Form handlers
        6a. Enquiry  -> AJAX-style submit + in-page response
        6b. Contact  -> compiles an email (mailto) to the recipient
   Every feature checks that its markup exists, so this file is
   safe to load on every page.
   ========================================================= */

(function () {
  "use strict";

  var ROOT = document.body.getAttribute("data-root") || "";
  var toast = (window.KeStone && window.KeStone.toast) || function () {};

  /* Recipient used by the contact form's compiled email */
  var CONTACT_RECIPIENT = "hello@kestone-it.co.za";

  /* Lets CSS hide collapsed content only when JavaScript is running */
  document.documentElement.classList.add("js");

  function qsa(sel, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  }

  /* ---------- 1. Accordion ---------- */
  function initAccordion() {
    qsa("[data-accordion]").forEach(function (acc) {
      var items = qsa(".acc-item", acc);

      function setOpen(item, open) {
        var btn = item.querySelector(".acc-trigger");
        item.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      }

      items.forEach(function (item, i) {
        var btn = item.querySelector(".acc-trigger");
        var panel = item.querySelector(".acc-panel");
        if (!btn || !panel) return;
        var id = "acc-" + (acc.id || "faq") + "-" + i;
        btn.id = id + "-btn";
        panel.id = id + "-panel";
        btn.setAttribute("aria-controls", panel.id);
        panel.setAttribute("role", "region");
        panel.setAttribute("aria-labelledby", btn.id);
        setOpen(item, item.classList.contains("is-open"));

        btn.addEventListener("click", function () {
          var willOpen = !item.classList.contains("is-open");
          /* One answer open at a time keeps the list short */
          items.forEach(function (other) {
            setOpen(other, other === item ? willOpen : false);
          });
        });
      });

      /* Expand / collapse all helper buttons are not needed: arrow keys move focus */
      acc.addEventListener("keydown", function (e) {
        var triggers = qsa(".acc-trigger", acc);
        var idx = triggers.indexOf(document.activeElement);
        if (idx < 0) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          triggers[(idx + 1) % triggers.length].focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          triggers[(idx - 1 + triggers.length) % triggers.length].focus();
        }
      });
    });
  }

