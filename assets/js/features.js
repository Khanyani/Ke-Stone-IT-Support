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
   7. Tabs (repairs)  8. Request tracker (localStorage)  9. 404 helper
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

    /* Services page: only step through cards that the filter is currently showing */
    function visibleLinks() {
      return qsa("a.gallery-item", gallery).filter(function (l) {
        return !l.closest(".is-filtered-out");
      });
    }

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

    gallery.addEventListener("click", function (e) {
      var link = e.target.closest("a.gallery-item");
      if (!link || !gallery.contains(link)) return;
      e.preventDefault();
      e.stopPropagation();
      links = visibleLinks();
      open(Math.max(0, links.indexOf(link)));
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

    /* Service areas: call-outs within roughly 20 km of each place marked data-area-km */
    places.forEach(function (p) {
      var km = parseFloat(p.btn.getAttribute("data-area-km"));
      if (!km) return;
      L.circle([p.lat, p.lng], {
        radius: km * 1000,
        color: "#a9d130",
        weight: 2,
        fillColor: "#c9f24d",
        fillOpacity: 0.08,
      })
        .addTo(map)
        .bindTooltip("Call-out service area around " + p.name + " (about " + km + " km)", { sticky: true });
    });

    /* Start on the first region (Gauteng); the buttons below move to the others */
    var home = L.latLng(places[0].lat, places[0].lng).toBounds(40000);
    map.fitBounds(home, { padding: [10, 10] });

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
        map.flyToBounds(home, { padding: [10, 10] });
      });
    }

    var all = document.querySelector("[data-map-all]");
    if (all) {
      all.addEventListener("click", function () {
        map.closePopup();
        places.forEach(function (o) {
          o.btn.classList.remove("is-active");
          o.btn.setAttribute("aria-pressed", "false");
        });
        map.flyToBounds(
          L.latLngBounds(places.map(function (o) { return [o.lat, o.lng]; })),
          { padding: [40, 40], duration: 1.2 }
        );
      });
    }
  }

  /* ---------- 4. Sort control for the services grid ---------- */
  function initSort() {
    var bar = document.querySelector(".filter-bar");
    if (!bar) return;
    var grid = bar.nextElementSibling;
    if (!grid || !grid.classList.contains("grid")) return;
    var cards = qsa(".card", grid);
    cards.forEach(function (c, i) {
      c.setAttribute("data-order", String(i));
    });

    function price(card) {
      var p = card.querySelector(".price");
      var m = p ? p.textContent.replace(/\s/g, "").match(/R(\d+)/) : null;
      return m ? parseInt(m[1], 10) : 0;
    }
    function name(card) {
      var h = card.querySelector("h3");
      return h ? h.textContent.trim().toLowerCase() : "";
    }

    var wrap = document.createElement("label");
    wrap.className = "sort-label";
    wrap.innerHTML =
      '<span>Sort by</span><select class="sort-select" aria-label="Sort services">' +
      '<option value="default">Our order</option>' +
      '<option value="name">Name A–Z</option>' +
      '<option value="low">Price: low to high</option>' +
      '<option value="high">Price: high to low</option></select>';
    var count = bar.querySelector(".filter-count");
    bar.insertBefore(wrap, count);

    wrap.querySelector("select").addEventListener("change", function (e) {
      var mode = e.target.value;
      var sorted = cards.slice().sort(function (a, b) {
        if (mode === "name") return name(a).localeCompare(name(b));
        if (mode === "low") return price(a) - price(b);
        if (mode === "high") return price(b) - price(a);
        return parseInt(a.getAttribute("data-order"), 10) - parseInt(b.getAttribute("data-order"), 10);
      });
      sorted.forEach(function (c) {
        grid.appendChild(c);
      });
    });
  }

  /* ---------- 5a. "Open now" status from business hours ---------- */
  var HOURS = {
    1: [8, 0, 17, 30], 2: [8, 0, 17, 30], 3: [8, 0, 17, 30], 4: [8, 0, 17, 30], 5: [8, 0, 17, 30],
    6: [9, 0, 13, 0],
  };
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function johannesburgNow() {
    /* Business hours are in South African time regardless of visitor time zone */
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Johannesburg",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date());
    var out = {};
    parts.forEach(function (p) {
      out[p.type] = p.value;
    });
    return { day: DAYS.indexOf(out.weekday), mins: (parseInt(out.hour, 10) % 24) * 60 + parseInt(out.minute, 10) };
  }

  function statusText() {
    var now = johannesburgNow();
    var today = HOURS[now.day];
    if (today) {
      var open = today[0] * 60 + today[1];
      var close = today[2] * 60 + today[3];
      if (now.mins >= open && now.mins < close) {
        return { open: true, text: "Open now · closes " + pad(today[2]) + ":" + pad(today[3]) };
      }
      if (now.mins < open) {
        return { open: false, text: "Closed · opens today at " + pad(today[0]) + ":" + pad(today[1]) };
      }
    }
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      if (HOURS[d]) {
        return {
          open: false,
          text: "Closed · opens " + (i === 1 ? "tomorrow" : DAYS[d]) + " at " + pad(HOURS[d][0]) + ":" + pad(HOURS[d][1]),
        };
      }
    }
    return { open: false, text: "Closed" };
  }

  function initOpenStatus() {
    var els = qsa("[data-open-status]");
    if (!els.length) return;
    function render() {
      var s = statusText();
      els.forEach(function (el) {
        el.textContent = "";
        var dot = document.createElement("span");
        dot.className = "status-dot";
        dot.setAttribute("aria-hidden", "true");
        el.appendChild(dot);
        el.appendChild(document.createTextNode(s.text + " (SA time)"));
        el.classList.toggle("is-open", s.open);
        el.classList.toggle("is-closed", !s.open);
      });
    }
    render();
    setInterval(render, 60000);
  }

  /* ---------- 5b. IT tips loaded from JSON, with category filter ---------- */
  var TIPS_FALLBACK = [
    { category: "security", title: "Turn on two-factor authentication", text: "Add a second login step to your email and banking accounts. It blocks most password-theft attacks even when your password leaks." },
    { category: "backup", title: "Follow the 3-2-1 backup rule", text: "Keep 3 copies of important files, on 2 different types of storage, with 1 copy off-site or in the cloud." },
    { category: "wifi", title: "Place your router in the open", text: "Wi-Fi works best from a central, raised spot away from microwaves, metal cabinets and thick walls." },
    { category: "speed", title: "Restart weekly, update monthly", text: "A weekly restart clears memory leaks, and monthly updates close security holes that slow machines are often hiding." },
  ];
  var TIP_LABELS = { all: "All", security: "Security", backup: "Backup", wifi: "Wi-Fi", speed: "Speed" };

  function initTips() {
    var host = document.querySelector("[data-tips]");
    if (!host) return;

    function render(tips) {
      host.innerHTML = "";
      var cats = ["all"];
      tips.forEach(function (t) {
        if (cats.indexOf(t.category) < 0) cats.push(t.category);
      });

      var chips = document.createElement("div");
      chips.className = "filter-bar tips-chips";
      chips.setAttribute("role", "group");
      chips.setAttribute("aria-label", "Filter tips by topic");
      cats.forEach(function (c, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "chip" + (i === 0 ? " is-active" : "");
        b.setAttribute("data-cat", c);
        b.textContent = TIP_LABELS[c] || c;
        chips.appendChild(b);
      });

      var grid = document.createElement("div");
      grid.className = "grid grid-3";
      tips.forEach(function (t) {
        var card = document.createElement("article");
        card.className = "card tip-card";
        card.setAttribute("data-cat", t.category);
        var tag = document.createElement("p");
        tag.className = "tip-tag";
        tag.textContent = TIP_LABELS[t.category] || t.category;
        var h = document.createElement("h3");
        h.textContent = t.title;
        var p = document.createElement("p");
        p.textContent = t.text;
        card.appendChild(tag);
        card.appendChild(h);
        card.appendChild(p);
        grid.appendChild(card);
      });

      chips.addEventListener("click", function (e) {
        var b = e.target.closest(".chip");
        if (!b) return;
        qsa(".chip", chips).forEach(function (c) {
          c.classList.toggle("is-active", c === b);
        });
        var cat = b.getAttribute("data-cat");
        qsa(".tip-card", grid).forEach(function (c) {
          c.classList.toggle("is-filtered-out", cat !== "all" && c.getAttribute("data-cat") !== cat);
        });
      });

      host.appendChild(chips);
      host.appendChild(grid);
    }

    /* Load from JSON; fall back to built-in tips if fetch is blocked (e.g. file://) */
    fetch(ROOT + "assets/data/tips.json")
      .then(function (r) {
        if (!r.ok) throw new Error("tips.json " + r.status);
        return r.json();
      })
      .then(render)
      .catch(function () {
        render(TIPS_FALLBACK);
      });
  }

  /* ---------- 5c. Live estimate on the enquiry form ---------- */
  var ISSUES = {
    repair: { label: "PC / Laptop repair", price: "From R450 per device, after diagnosis" },
    network: { label: "Network setup", price: "From R700 per site setup" },
    security: { label: "Cybersecurity basics", price: "From R600 per assessment & setup" },
    remote: { label: "Remote support", price: "From R250 per 30-minute session" },
    backup: { label: "Data backup & recovery", price: "From R550 per backup setup" },
    printer: { label: "Printer & peripheral setup", price: "From R350 per device" },
    email: { label: "Email & Microsoft 365 setup", price: "From R500 per setup, up to 5 users" },
    software: { label: "Software installation & upgrades", price: "From R300 per device" },
    hardware: { label: "Hardware upgrade / custom PC build", price: "From R600 labour, excluding parts" },
    cctv: { label: "CCTV & smart home setup", price: "From R1200 per installation, up to 4 cameras" },
    maintenance: { label: "Maintenance plan", price: "From R450 per month (Home Essentials), R900 per month for up to 5 devices" },
    other: { label: "Other", price: "We'll quote after a free chat about the problem" },
  };
  var URGENCY = {
    urgent: "Marked urgent — we'll prioritise your request. Calling +27 11 000 0000 is the fastest way to reach us.",
    week: "We'll book you in sometime this week and confirm a time.",
    flexible: "Flexible — we'll offer the next convenient slot, usually within 24 hours of replying.",
  };

  function initEstimate() {
    var panel = document.querySelector("[data-estimate]");
    var form = document.querySelector("form[data-handler='enquiry']");
    if (!panel || !form) return;
    var issue = form.elements.issueType;
    var urgency = form.elements.urgency;

    function update() {
      var i = ISSUES[issue.value];
      panel.classList.toggle("is-ready", !!i);
      if (!i) {
        panel.innerHTML = "<strong>Your estimate</strong><p>Choose a type of issue to see an indicative price.</p>";
        return;
      }
      var html = "<strong>Your estimate</strong><p class=\"estimate-price\"></p><p class=\"estimate-note\"></p>";
      panel.innerHTML = html;
      panel.querySelector(".estimate-price").textContent = i.label + ": " + i.price;
      panel.querySelector(".estimate-note").textContent =
        (URGENCY[urgency.value] || "We usually reply within 24 hours.") + " Final quotes are always confirmed before work starts.";
    }
    /* Arriving from a service card (enquiry.html?service=backup) pre-selects that service */
    try {
      var wanted = new URLSearchParams(window.location.search).get("service");
      if (wanted && ISSUES[wanted]) issue.value = wanted;
    } catch (e) {}
    issue.addEventListener("change", update);
    urgency.addEventListener("change", update);
    update();
  }

  /* Preferred date: no past dates, within 6 months */
  function initDateLimits() {
    qsa("input[type='date']").forEach(function (d) {
      var today = new Date();
      var max = new Date();
      max.setDate(max.getDate() + 180);
      function iso(dt) {
        return dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate());
      }
      d.min = iso(today);
      d.max = iso(max);
    });
  }

  /* ---------- 6. Form handlers ---------- */
  function showResult(form, build) {
    var panel = document.createElement("div");
    panel.className = "form-result";
    panel.setAttribute("role", "status");
    panel.setAttribute("tabindex", "-1");
    build(panel);
    form.hidden = true;
    form.parentNode.insertBefore(panel, form.nextSibling);
    panel.focus();
    panel.scrollIntoView({ behavior: "smooth", block: "center" });

    var again = panel.querySelector("[data-again]");
    if (again) {
      again.addEventListener("click", function () {
        panel.parentNode.removeChild(panel);
        form.reset();
        form.hidden = false;
        qsa(".field", form).forEach(function (f) {
          f.classList.remove("is-valid", "has-error");
        });
        var submit = form.querySelector('[type="submit"]');
        if (submit) {
          submit.disabled = false;
          if (submit.dataset.label) submit.textContent = submit.dataset.label;
        }
        form.dispatchEvent(new Event("input", { bubbles: true }));
        form.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }
  }

  function reference() {
    var d = new Date();
    return "KS-" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + Math.floor(1000 + Math.random() * 9000);
  }

  function setBusy(form, busy) {
    var submit = form.querySelector('[type="submit"]');
    if (!submit) return;
    if (busy) {
      submit.dataset.label = submit.textContent;
      submit.textContent = "Sending…";
    } else if (submit.dataset.label) {
      submit.textContent = submit.dataset.label;
    }
    submit.disabled = busy;
  }

  /* 6a. Enquiry: submit with fetch (AJAX) so the page does not reload.
     If the form has a data-endpoint (e.g. a Formspree URL) the data is POSTed
     there; otherwise the request is simulated, as this site has no backend. */
  function initEnquiryForm() {
    var form = document.querySelector("form[data-handler='enquiry']");
    if (!form) return;

    form.addEventListener("kestone:valid", function () {
      setBusy(form, true);
      var data = new FormData(form);
      var endpoint = form.getAttribute("data-endpoint");

      var send = endpoint
        ? fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } }).then(function (r) {
            if (!r.ok) throw new Error("Request failed: " + r.status);
          })
        : new Promise(function (resolve) {
            setTimeout(resolve, 700);
          });

      send
        .then(function () {
          var ref = reference();
          saveRequest({
            ref: ref,
            service: (ISSUES[data.get("issueType")] || ISSUES.other).label,
            urgency: String(data.get("urgency")),
            name: String(data.get("fullName")).split(" ")[0],
            date: new Date().toISOString(),
          });
          var issue = ISSUES[data.get("issueType")] || ISSUES.other;
          var how = { email: "email", phone: "a phone call", whatsapp: "WhatsApp" }[data.get("contactMethod")] || "email";
          showResult(form, function (panel) {
            panel.innerHTML =
              '<p class="eyebrow">Request received</p><h2></h2><p class="result-ref"></p>' +
              "<ul class=\"result-list\"></ul>" +
              '<div class="result-actions"><a class="btn btn-accent" href="../index.html">Back to homepage</a>' +
              '<button type="button" class="btn btn-outline" data-again>Send another request</button></div>';
            panel.querySelector("h2").textContent = "Thanks, " + String(data.get("fullName")).split(" ")[0] + " — we've got your request.";
            panel.querySelector(".result-ref").textContent = "Reference: " + ref;
            var list = panel.querySelector(".result-list");
            var rows = [
              "Service: " + issue.label,
              "Indicative cost: " + issue.price,
              URGENCY[data.get("urgency")] || "",
              "We'll reply by " + how + (data.get("preferredDate") ? ", aiming for " + data.get("preferredDate") : "") + ".",
            ];
            rows.forEach(function (r) {
              if (!r) return;
              var li = document.createElement("li");
              li.textContent = r;
              list.appendChild(li);
            });
          });
          toast("Request sent — reference " + ref);
        })
        .catch(function () {
          setBusy(form, false);
          var summary = form.querySelector("[data-form-summary]");
          if (summary) summary.textContent = "We couldn't send your request. Please try again or call +27 11 000 0000.";
          toast("Sending failed — please try again.", true);
        });
    });
  }

  /* 6b. Contact: compile the validated fields into an email to the recipient */
  function initContactForm() {
    var form = document.querySelector("form[data-handler='contact']");
    if (!form) return;

    form.addEventListener("kestone:valid", function () {
      var f = form.elements;
      var type = f.messageType.options[f.messageType.selectedIndex].text;
      var subject = "[" + type + "] " + f.subject.value.trim();
      var body =
        "Name: " + f.contactName.value.trim() + "\n" +
        "Email: " + f.contactEmail.value.trim() + "\n" +
        (f.contactPhone.value.trim() ? "Phone: " + f.contactPhone.value.trim() + "\n" : "") +
        "Message type: " + type + "\n\n" +
        f.message.value.trim() + "\n";
      var href =
        "mailto:" + CONTACT_RECIPIENT +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      showResult(form, function (panel) {
        panel.innerHTML =
          '<p class="eyebrow">Email ready</p><h2>Your message is ready to send</h2>' +
          '<p class="result-note"></p>' +
          '<div class="result-actions"><a class="btn btn-accent" data-mailto>Open in my email app</a>' +
          '<button type="button" class="btn btn-outline" data-again>Write another message</button></div>' +
          '<p class="form-note">Nothing is sent until you press Send in your email app.</p>';
        panel.querySelector(".result-note").textContent =
          "We've compiled your details into an email addressed to " + CONTACT_RECIPIENT + " with the subject “" + subject + "”.";
        panel.querySelector("[data-mailto]").setAttribute("href", href);
      });
      window.location.href = href;
    });
  }


  /* ---------- 7. Tabs (repairs page) ---------- */
  function initTabs() {
    qsa("[data-tabs]").forEach(function (box) {
      var tabs = qsa("[role='tab']", box);
      var panels = qsa("[role='tabpanel']", box);
      tabs.forEach(function (t, i) {
        t.id = t.id || "tab-" + i;
        panels[i].setAttribute("aria-labelledby", t.id);
        t.setAttribute("tabindex", t.getAttribute("aria-selected") === "true" ? "0" : "-1");
      });
      function select(i, focus) {
        tabs.forEach(function (t, j) {
          var on = i === j;
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.setAttribute("tabindex", on ? "0" : "-1");
          panels[j].hidden = !on;
        });
        if (focus) tabs[i].focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener("click", function () {
          select(i, false);
        });
        t.addEventListener("keydown", function (e) {
          if (e.key === "ArrowRight") { e.preventDefault(); select((i + 1) % tabs.length, true); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
          else if (e.key === "Home") { e.preventDefault(); select(0, true); }
          else if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
        });
      });
    });
  }

  /* ---------- 8. Request tracker (browser storage only) ---------- */
  var STORE_KEY = "kestone.requests";

  function readRequests() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveRequest(rec) {
    try {
      var all = readRequests();
      all.push(rec);
      localStorage.setItem(STORE_KEY, JSON.stringify(all.slice(-20)));
    } catch (e) {
      /* storage unavailable (private mode): the tracker simply won't find it */
    }
  }

  function initTracker() {
    var form = document.querySelector("form[data-tracker]");
    if (!form) return;
    var out = form.querySelector("[data-tracker-result]");
    var field = form.querySelector(".field");
    var input = form.elements.trackRef;

    form.setAttribute("novalidate", "novalidate");
    input.addEventListener("input", function () {
      window.KeStone.clearError(field);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      out.innerHTML = "";
      var ref = input.value.trim().toUpperCase();
      if (!/^KS-\d{8}-\d{4}$/.test(ref)) {
        window.KeStone.setError(field, "Enter a reference like KS-20261022-1234.");
        input.focus();
        return;
      }
      window.KeStone.clearError(field);
      var rec = readRequests().filter(function (r) {
        return r.ref === ref;
      })[0];
      var box = document.createElement("div");
      box.className = "tracker-result" + (rec ? "" : " is-error");
      if (rec) {
        var when = new Date(rec.date).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
        [["Reference", rec.ref], ["Service", rec.service], ["Sent", when], ["Status", "Received — we will reply within 24 hours"]].forEach(function (row) {
          var p = document.createElement("p");
          var b = document.createElement("strong");
          b.textContent = row[0] + ": ";
          p.appendChild(b);
          p.appendChild(document.createTextNode(row[1]));
          box.appendChild(p);
        });
      } else {
        var p = document.createElement("p");
        p.textContent = "We couldn't find that reference in this browser. Check the number, or call +27 11 000 0000.";
        box.appendChild(p);
      }
      out.appendChild(box);
    });
  }

  /* ---------- 9. 404 page: show the address that was not found ---------- */
  function initNotFound() {
    var el = document.querySelector("[data-missing-path]");
    if (el) el.textContent = "Not found: " + window.location.pathname;
  }


  /* ---------- 10. Site search (client-side, uses assets/data/search-index.js) ---------- */
  function initSearch() {
    var form = document.querySelector("[data-site-search]");
    if (!form) return;
    var input = form.elements.q;
    var list = document.querySelector("[data-search-results]");
    var count = document.querySelector("[data-search-count]");
    var filters = qsa("[data-search-filters] .chip");
    var index = window.KESTONE_SEARCH || [];
    var kind = "all";
    var KIND_LABEL = { service: "Service", faq: "FAQ", page: "Page", legal: "Policy" };

    function terms(q) {
      return q.toLowerCase().split(/[^a-z0-9&+']+/).filter(function (t) {
        return t.length > 1;
      });
    }

    function wordHit(haystack, term) {
      /* prefix match on word starts, so "print" finds "printer" */
      return new RegExp("(^|[^a-z0-9])" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(haystack);
    }

    function score(entry, ts) {
      var title = entry.t.toLowerCase();
      var body = (entry.x || "").toLowerCase();
      var label = (entry.p || "").toLowerCase();
      var total = 0;
      for (var i = 0; i < ts.length; i++) {
        var t = ts[i];
        var s = 0;
        if (wordHit(title, t)) s += 6;
        if (wordHit(label, t)) s += 3;
        if (wordHit(body, t)) s += 2;
        if (!s) return 0; /* every word must match somewhere */
        total += s;
      }
      if (entry.k === "service") total += 2; /* services first when scores tie */
      return total;
    }

    function highlight(el, text, ts) {
      el.textContent = "";
      if (!ts.length) {
        el.textContent = text;
        return;
      }
      var re = new RegExp("(^|[^a-z0-9])(" + ts.map(function (t) {
        return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }).join("|") + ")", "ig");
      var last = 0;
      var m;
      while ((m = re.exec(text))) {
        var start = m.index + m[1].length;
        if (start > last) el.appendChild(document.createTextNode(text.slice(last, start)));
        var mark = document.createElement("mark");
        mark.textContent = m[2];
        el.appendChild(mark);
        last = start + m[2].length;
        if (m[0].length === 0) re.lastIndex++;
      }
      if (last < text.length) el.appendChild(document.createTextNode(text.slice(last)));
    }

    function snippet(text, ts) {
      if (text.length <= 170) return text;
      var low = text.toLowerCase();
      var pos = -1;
      for (var i = 0; i < ts.length && pos < 0; i++) pos = low.indexOf(ts[i]);
      var start = Math.max(0, pos - 50);
      var out = text.slice(start, start + 170);
      return (start > 0 ? "… " : "") + out + (start + 170 < text.length ? " …" : "");
    }

    function render() {
      var q = input.value.trim();
      var ts = terms(q);
      list.innerHTML = "";
      if (!ts.length) {
        count.textContent = q ? "Please type at least two letters." : "Start typing to search " + index.length + " items across the website.";
        return;
      }
      var hits = index
        .map(function (e) {
          return { e: e, s: score(e, ts) };
        })
        .filter(function (h) {
          return h.s > 0 && (kind === "all" || h.e.k === kind);
        })
        .sort(function (a, b) {
          return b.s - a.s;
        })
        .slice(0, 30);

      count.textContent = hits.length
        ? hits.length + (hits.length === 1 ? " result" : " results") + " for \u201c" + q + "\u201d"
        : "No results for \u201c" + q + "\u201d. Try a shorter word such as \u201cbackup\u201d, \u201cprice\u201d or \u201crepair\u201d, or ";

      if (!hits.length) {
        var a = document.createElement("a");
        a.href = "contact.html";
        a.textContent = "contact us";
        count.appendChild(a);
        count.appendChild(document.createTextNode("."));
      }

      hits.forEach(function (h) {
        var li = document.createElement("li");
        li.className = "search-result";
        var badge = document.createElement("span");
        badge.className = "search-badge badge-" + h.e.k;
        badge.textContent = KIND_LABEL[h.e.k] || "Page";
        var title = document.createElement("a");
        title.className = "search-title";
        title.href = h.e.u.indexOf("pages/") === 0 ? h.e.u.slice(6) : "../" + h.e.u;
        highlight(title, h.e.t, ts);
        var where = document.createElement("span");
        where.className = "search-where";
        where.textContent = h.e.p;
        var text = document.createElement("p");
        highlight(text, snippet(h.e.x || "", ts), ts);
        var head = document.createElement("div");
        head.className = "search-head";
        head.appendChild(badge);
        head.appendChild(title);
        head.appendChild(where);
        li.appendChild(head);
        li.appendChild(text);
        list.appendChild(li);
      });
    }

    function sync(replace) {
      try {
        var url = new URL(window.location.href);
        if (input.value.trim()) url.searchParams.set("q", input.value.trim());
        else url.searchParams.delete("q");
        window.history[replace ? "replaceState" : "pushState"](null, "", url);
      } catch (e) {}
    }

    var timer;
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        render();
        sync(true);
      }, 120);
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      render();
      sync(false);
    });
    filters.forEach(function (c) {
      c.addEventListener("click", function () {
        filters.forEach(function (o) {
          o.classList.toggle("is-active", o === c);
        });
        kind = c.getAttribute("data-kind");
        render();
      });
    });
    qsa("[data-search-suggest] .chip").forEach(function (c) {
      c.addEventListener("click", function () {
        input.value = c.getAttribute("data-q");
        render();
        sync(false);
        input.focus();
      });
    });

    try {
      var initial = new URLSearchParams(window.location.search).get("q");
      if (initial) input.value = initial.slice(0, 80);
    } catch (e) {}
    render();
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    /* Each feature is isolated so one failure cannot stop the others */
    [initAccordion, initLightbox, initMap, initSort, initOpenStatus, initTips,
      initDateLimits, initEstimate, initEnquiryForm, initContactForm, initTabs, initTracker, initSearch,
      initNotFound].forEach(function (fn) {
      try {
        fn();
      } catch (err) {
        if (window.console) console.warn("Feature failed: " + fn.name, err);
      }
    });
  });
})();
