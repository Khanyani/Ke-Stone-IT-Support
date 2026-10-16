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

  /* ---------- 2. Gallery + lightbox ---------- */
  function initLightbox() {
    var gallery = document.querySelector("[data-gallery]");
    if (!gallery) return;
    var links = qsa("a.gallery-item", gallery);
    if (!links.length) return;

    var current = 0;
    var lastFocus = null;
    var touchX = null;

    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image viewer");
    box.hidden = true;
    box.innerHTML =
      '<button type="button" class="lb-btn lb-close" aria-label="Close image viewer">&times;</button>' +
      '<button type="button" class="lb-btn lb-prev" aria-label="Previous image">&#8249;</button>' +
      '<figure class="lb-figure"><img class="lb-img" alt="" />' +
      '<figcaption class="lb-caption"></figcaption></figure>' +
      '<button type="button" class="lb-btn lb-next" aria-label="Next image">&#8250;</button>';
    document.body.appendChild(box);

    var img = box.querySelector(".lb-img");
    var cap = box.querySelector(".lb-caption");
    var closeBtn = box.querySelector(".lb-close");

    function show(i) {
      current = (i + links.length) % links.length;
      var link = links[current];
      var thumb = link.querySelector("img");
      img.src = link.getAttribute("href");
      img.alt = thumb ? thumb.alt : "";
      cap.textContent = (link.getAttribute("data-caption") || "") + "  (" + (current + 1) + " of " + links.length + ")";
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.hidden = false;
      requestAnimationFrame(function () {
        box.classList.add("is-open");
      });
      document.body.classList.add("lb-lock");
      closeBtn.focus();
    }

    function close() {
      box.classList.remove("is-open");
      box.hidden = true;
      document.body.classList.remove("lb-lock");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    links.forEach(function (link, i) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        open(i);
      });
    });

    box.querySelector(".lb-prev").addEventListener("click", function () {
      show(current - 1);
    });
    box.querySelector(".lb-next").addEventListener("click", function () {
      show(current + 1);
    });
    closeBtn.addEventListener("click", close);

    /* Click on the dark backdrop closes it (easy to dismiss on mobile) */
    box.addEventListener("click", function (e) {
      if (e.target === box) close();
    });

    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
      else if (e.key === "Tab") {
        /* Keep keyboard focus inside the dialog */
        var f = qsa("button", box);
        var first = f[0];
        var last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    /* Swipe left/right on touch screens */
    box.addEventListener(
      "touchstart",
      function (e) {
        touchX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    box.addEventListener(
      "touchend",
      function (e) {
        if (touchX === null) return;
        var dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      },
      { passive: true }
    );
  }

