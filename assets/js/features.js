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

  /* ---------- 3. Interactive map (Leaflet) ---------- */
  function initMap() {
    var el = document.getElementById("service-map");
    if (!el) return;
    if (!window.L) {
      el.innerHTML = '<p class="map-fallback">The interactive map could not load. Please use the address details above.</p>';
      return;
    }

    var places = qsa("[data-place]").map(function (btn) {
      return {
        btn: btn,
        name: btn.getAttribute("data-name"),
        address: btn.getAttribute("data-address"),
        note: btn.getAttribute("data-note"),
        lat: parseFloat(btn.getAttribute("data-lat")),
        lng: parseFloat(btn.getAttribute("data-lng")),
      };
    });
    if (!places.length) return;

    L.Icon.Default.imagePath = ROOT + "assets/vendor/leaflet/images/";
    var map = L.map(el, { scrollWheelZoom: false }).setView([-26.1, 28.03], 12);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    var bounds = [];
    places.forEach(function (p) {
      var marker = L.marker([p.lat, p.lng], { title: p.name, alt: p.name }).addTo(map);
      var dir =
        "https://www.google.com/maps/dir/?api=1&destination=" +
        encodeURIComponent(p.address);
      var popup = document.createElement("div");
      var h = document.createElement("strong");
      h.textContent = p.name;
      var a = document.createElement("p");
      a.textContent = p.address;
      var n = document.createElement("p");
      n.textContent = p.note;
      var link = document.createElement("a");
      link.href = dir;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Get directions";
      popup.appendChild(h);
      popup.appendChild(a);
      popup.appendChild(n);
      popup.appendChild(link);
      marker.bindPopup(popup);
      p.marker = marker;
      bounds.push([p.lat, p.lng]);

      p.btn.addEventListener("click", function () {
        places.forEach(function (o) {
          o.btn.classList.toggle("is-active", o === p);
          o.btn.setAttribute("aria-pressed", o === p ? "true" : "false");
        });
        map.flyTo([p.lat, p.lng], 15, { duration: 0.8 });
        marker.openPopup();
      });
    });

    /* Service area: call-outs within roughly 20 km of the Sandton office */
    L.circle([places[0].lat, places[0].lng], {
      radius: 20000,
      color: "#a9d130",
      weight: 2,
      fillColor: "#c9f24d",
      fillOpacity: 0.08,
    })
      .addTo(map)
      .bindTooltip("Call-out service area (about 20 km)", { sticky: true });

    map.fitBounds(L.latLng(places[0].lat, places[0].lng).toBounds(40000), { padding: [10, 10] });

    /* Scroll-wheel zoom only after the visitor clicks the map, so the page can still scroll */
    map.on("focus click", function () {
      map.scrollWheelZoom.enable();
    });
    map.on("blur", function () {
      map.scrollWheelZoom.disable();
    });

    var reset = document.querySelector("[data-map-reset]");
    if (reset) {
      reset.addEventListener("click", function () {
        map.closePopup();
        places.forEach(function (o) {
          o.btn.classList.remove("is-active");
          o.btn.setAttribute("aria-pressed", "false");
        });
        map.flyToBounds(L.latLng(places[0].lat, places[0].lng).toBounds(40000), { padding: [10, 10] });
      });
    }
  }

