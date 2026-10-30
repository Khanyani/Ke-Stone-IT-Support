/* =========================================================
   Ke'Stone IT Support — site scripts
   1. Header/footer includes (fetch, with inline fallback)
   2. Mobile hamburger navigation
   3. Active nav highlighting (aria-current)
   4. Form validation + redirect to thank-you page
   5. Toasts
   6. Scroll progress, sticky header, back-to-top
   7. Scroll reveal + animated stat counters
   8. Pointer spotlight + ambient background
   9. Live filter + search (services page)
   10. Form enhancements: progress, live validity, counters
   11. Pricing billing switch
   ========================================================= */

(function () {
  "use strict";

  /* Root-relative prefix: "" for index.html, "../" for files in /pages */
  var ROOT = document.body.getAttribute("data-root") || "";
  var PAGE = document.body.getAttribute("data-page") || "";

  /* ---------- 1. Shared header/footer includes ---------- */

  /* Inline fallback markup, used when fetch() is unavailable
     (e.g. opening the files directly via file://). */
  var FALLBACK = {
    header:
      '<header class="site-header"><div class="container header-inner">' +
      '<a class="logo" href="{{root}}index.html" aria-label="Ke\'Stone IT Support home">' +
      '<span class="logo-mark" aria-hidden="true">K</span>' +
      '<span class="logo-text">Ke\'Stone <em>IT Support</em></span></a>' +
      '<button class="nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="primaryNav" aria-label="Toggle navigation menu">' +
      '<span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span></button>' +
      '<nav class="primary-nav" id="primaryNav" aria-label="Primary"><ul>' +
      '<li><a href="{{root}}index.html" data-nav="home">Home</a></li>' +
      '<li><a href="{{root}}pages/about.html" data-nav="about">About Us</a></li>' +
      '<li><a href="{{root}}pages/services.html" data-nav="services">Services</a></li>' +
      '<li><a href="{{root}}pages/repairs.html" data-nav="repairs">Repairs</a></li>' +
      '<li><a href="{{root}}pages/contact.html" data-nav="contact">Contact</a></li>' +
      '<li><a class="btn btn-accent btn-sm" href="{{root}}pages/enquiry.html" data-nav="enquiry">Request Support</a></li>' +
      "</ul></nav></div></header>",
    footer:
      '<footer class="site-footer"><div class="container footer-grid">' +
      '<div><h2 class="footer-heading">Ke\'Stone IT Support</h2><p class="footer-text">Friendly, affordable IT support for small businesses and home users across Johannesburg and Gqeberha.</p></div>' +
      '<div><h2 class="footer-heading">Contact</h2><ul class="footer-list">' +
      '<li><a href="tel:+27110000000">+27 11 000 0000</a></li>' +
      '<li><a href="mailto:hello@kestone-it.co.za">hello@kestone-it.co.za</a></li>' +
      "<li>Mon–Fri: 08:00–17:30 · Sat: 09:00–13:00</li></ul></div>" +
      '<div><h2 class="footer-heading">Quick links</h2><ul class="footer-list">' +
      '<li><a href="{{root}}pages/services.html">Services</a></li>' +
      '<li><a href="{{root}}pages/about.html">About Us</a></li>' +
      '<li><a href="{{root}}pages/enquiry.html">Request Support</a></li>' +
      '<li><a href="{{root}}pages/repairs.html">Repairs &amp; Diagnostics</a></li>' +
      '<li><a href="{{root}}pages/privacy.html">Privacy Policy</a></li>' +
      '<li><a href="{{root}}pages/terms.html">Terms &amp; Conditions</a></li></ul></div>' +
      '<div><h2 class="footer-heading">Follow us</h2><ul class="footer-list footer-social">' +
      '<li><a href="https://www.facebook.com/" rel="noopener">Facebook</a></li>' +
      '<li><a href="https://www.linkedin.com/" rel="noopener">LinkedIn</a></li>' +
      '<li><a href="https://wa.me/27110000000" rel="noopener">WhatsApp</a></li>' +
      "</ul></div></div>" +
      '<div class="footer-bottom"><p>&copy; <span data-year>2026</span> Ke\'Stone IT Support. All rights reserved.</p></div></footer>',
  };

  function withRoot(html) {
    return html.replace(/\{\{root\}\}/g, ROOT);
  }

  function loadComponent(slot, name) {
    if (!slot) return Promise.resolve();
    var url = ROOT + "components/" + name + ".html";

    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Include failed: " + url);
        return res.text();
      })
      .then(function (html) {
        slot.innerHTML = withRoot(html);
      })
      .catch(function () {
        /* Fallback: identical markup rendered inline */
        slot.innerHTML = withRoot(FALLBACK[name]);
      });
  }

  /* ---------- 2 + 3. Nav behaviour after header is injected ---------- */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("primaryNav");

    if (toggle && nav) {
      var setOpen = function (open) {
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      };

      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        setOpen(!nav.classList.contains("is-open"));
      });

      /* Close on outside click, Escape, or link choice */
      document.addEventListener("click", function (e) {
        if (nav.classList.contains("is-open") && !nav.contains(e.target)) setOpen(false);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setOpen(false);
      });
      nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) setOpen(false);
      });
    }


    /* Mark the current page for screen readers and styling */
    if (PAGE) {
      var current = document.querySelector('[data-nav="' + PAGE + '"]');
      if (current) current.setAttribute("aria-current", "page");
    }
  }

  function initFooter() {
    var yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- 4. Form validation ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  /* Part 3: extra rules shared by submit-time and blur-time validation.
     Returns an error message, or "" when the value is acceptable. */
  var PHONE_RE = /^(\+27|0)[1-9][0-9]{8}$/; /* South African number, e.g. 011 234 5678 or +27 82 123 4567 */

  function extraCheck(control, value) {
    if (value === "") return "";
    if (control.type === "tel") {
      var digits = value.replace(/[\s\-()]/g, "");
      if (!PHONE_RE.test(digits)) {
        return "Enter a valid South African phone number, e.g. 082 123 4567 or +27 82 123 4567.";
      }
    }
    if (control.type === "date") {
      var picked = new Date(value + "T00:00:00");
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(picked.getTime())) return "Please choose a valid date.";
      if (picked < today) return "Please choose today or a later date.";
      if (picked.getDay() === 0) return "We are closed on Sundays — please choose another day.";
      var limit = new Date(today);
      limit.setDate(limit.getDate() + 180);
      if (picked > limit) return "Please choose a date within the next 6 months.";
    }
    var min = control.getAttribute("minlength");
    if (min && control.type !== "date" && value.length < parseInt(min, 10)) {
      return "Please enter at least " + min + " characters (you have " + value.length + ").";
    }
    return "";
  }

  function setError(field, message) {
    field.classList.add("has-error");
    var msg = field.querySelector(".error-msg");
    if (msg) msg.textContent = message;
    var input = field.querySelector("input, select, textarea");
    if (input) input.setAttribute("aria-invalid", "true");
  }

  function clearError(field) {
    field.classList.remove("has-error");
    var msg = field.querySelector(".error-msg");
    if (msg) msg.textContent = "";
    var input = field.querySelector("input, select, textarea");
    if (input) input.removeAttribute("aria-invalid");
  }

  function validateForm(form) {
    var firstInvalid = null;
    var controls = form.querySelectorAll("input, select, textarea");

    for (var i = 0; i < controls.length; i++) {
      var control = controls[i];
      var field = control.closest(".field");
      if (!field) continue;

      clearError(field);
      var value = (control.value || "").trim();
      var label = field.querySelector("label");
      var name = label ? label.textContent.replace("*", "").trim() : "This field";

      /* Required checkbox (e.g. consent) */
      if (control.type === "checkbox" && control.hasAttribute("required") && !control.checked) {
        setError(field, "Please tick the box to continue.");
        firstInvalid = firstInvalid || control;
        continue;
      }
      if (control.type === "checkbox" || control.type === "radio") continue;

      /* Required check */
      if (control.hasAttribute("required") && value === "") {
        setError(field, name + " is required.");
        firstInvalid = firstInvalid || control;
        continue;
      }

      /* Basic email format check */
      if (control.type === "email" && value !== "" && !EMAIL_RE.test(value)) {
        setError(field, "Please enter a valid email address (e.g. name@example.com).");
        firstInvalid = firstInvalid || control;
        continue;
      }

      /* Part 3: phone, date and minimum-length rules */
      var extra = extraCheck(control, value);
      if (extra) {
        setError(field, extra);
        firstInvalid = firstInvalid || control;
      }
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  function initForms() {
    var forms = document.querySelectorAll("form[data-validate]");

    Array.prototype.forEach.call(forms, function (form) {
      form.setAttribute("novalidate", "novalidate");

      form.addEventListener("submit", function (event) {
        event.preventDefault(); /* No backend: never send data anywhere */
        var submit = form.querySelector('[type="submit"]');

        if (validateForm(form)) {
          /* Part 3: forms with data-handler are completed by features.js
             (in-page response / email compile) instead of redirecting. */
          if (form.hasAttribute("data-handler")) {
            form.dispatchEvent(new CustomEvent("kestone:valid", { bubbles: true }));
            return;
          }
          if (submit) {
            submit.disabled = true;
            submit.dataset.label = submit.textContent;
            submit.textContent = "Sending…";
          }
          toast("Request captured — taking you to the confirmation page.");
          setTimeout(function () {
            window.location.href = ROOT + "pages/thank-you.html";
          }, 900);
        } else {
          var summary = form.querySelector("[data-form-summary]");
          if (summary) summary.textContent = "Please fix the highlighted fields and try again.";
          toast("Some details are missing — check the highlighted fields.", true);
        }
      });


      /* Clear a field's error as soon as the visitor edits it */
      form.addEventListener("input", function (event) {
        var field = event.target.closest(".field");
        if (field && field.classList.contains("has-error")) clearError(field);
      });
    });
  }

  /* ---------- 5. Toasts ---------- */
  var toastStack;
  function toast(message, isError) {
    if (!toastStack) {
      toastStack = document.createElement("div");
      toastStack.className = "toast-stack";
      document.body.appendChild(toastStack);
    }
    var el = document.createElement("div");
    el.className = "toast" + (isError ? " is-error" : "");
    el.setAttribute("role", "status");
    el.textContent = message;
    toastStack.appendChild(el);
    requestAnimationFrame(function () {
      el.classList.add("is-in");
    });
    setTimeout(function () {
      el.classList.remove("is-in");
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 300);
    }, 3200);
  }

  /* ---------- 6. Scroll progress, sticky header, back-to-top ---------- */
  function initScrollUI() {
    var rail = document.createElement("div");
    rail.className = "scroll-rail";
    rail.innerHTML = "<span></span>";
    document.body.appendChild(rail);
    var bar = rail.firstChild;

    var top = document.createElement("button");
    top.type = "button";
    top.className = "to-top";
    top.setAttribute("aria-label", "Back to top");
    top.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.body.appendChild(top);

    var header = document.querySelector(".site-header");

    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      if (header) header.classList.toggle("is-stuck", y > 12);
      top.classList.toggle("is-in", y > 400);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ---------- 7. Scroll reveal + animated stat counters ---------- */
  function initReveal() {
    var groups = document.querySelectorAll(
      ".section-head, .card, .stat, .cta-band, .hero .hero-actions, .info-card, .map-card, form[data-validate]"
    );
    Array.prototype.forEach.call(groups, function (el, i) {
      el.setAttribute("data-reveal", "");
      var parent = el.parentNode;
      var index = parent ? Array.prototype.indexOf.call(parent.children, el) : i;
      el.style.setProperty("--reveal-delay", Math.min(index, 5) * 80 + "ms");
    });

    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(groups, function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          countUp(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    Array.prototype.forEach.call(groups, function (el) {
      io.observe(el);
    });
  }

  function countUp(scope) {
    var target = scope.matches && scope.matches(".stat") ? scope.querySelector("strong") : null;
    if (!target || target.getAttribute("data-counted")) return;
    var raw = target.textContent.trim();
    var match = raw.match(/^(\D*)(\d+)(\D*)$/);
    if (!match) return;
    target.setAttribute("data-counted", "1");
    var prefix = match[1];
    var end = parseInt(match[2], 10);
    var suffix = match[3];
    var start = performance.now();
    var dur = 1100;
    function frame(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      target.textContent = prefix + Math.round(end * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- 8. Pointer spotlight ---------- */
  function initSpotlight() {
    if (window.matchMedia("(hover: none)").matches) return;
    var hero = document.querySelector(".hero");
    if (hero) hero.classList.add("has-glow");

    document.addEventListener("mousemove", function (e) {
      var el = e.target.closest ? e.target.closest(".card, .stat, .hero") : null;
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
  }

  /* ---------- 8b. Responsive ambient page background ---------- */
  function initAmbientBackground() {
    var root = document.documentElement;
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    var frame = 0;
    document.addEventListener(
      "pointermove",
      function (event) {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(function () {
          root.style.setProperty("--bg-x", (event.clientX / window.innerWidth) * 100 + "%");
          root.style.setProperty("--bg-y", (event.clientY / window.innerHeight) * 100 + "%");
        });
      },
      { passive: true }
    );
  }

  /* ---------- 9. Live filter + search for service/card grids ---------- */
  function initFilter() {
    if (PAGE !== "services") return;
    var grid = document.querySelector(".section .grid");
    if (!grid) return;
    var cards = grid.querySelectorAll(".card");
    if (cards.length < 3) return;

    var bar = document.createElement("div");
    bar.className = "filter-bar";
    bar.innerHTML =
      '<input type="search" aria-label="Search services" placeholder="Search services, e.g. wi-fi, backup, laptop" />' +
      '<button type="button" class="chip is-active" data-filter="all">All</button>' +
      '<button type="button" class="chip" data-filter="repair">Repairs</button>' +
      '<button type="button" class="chip" data-filter="network">Networks</button>' +
      '<button type="button" class="chip" data-filter="secur">Security</button>' +
      '<button type="button" class="chip" data-filter="remote">Remote</button>' +
      '<button type="button" class="chip" data-filter="backup">Backup</button>' +
      '<button type="button" class="chip" data-filter="setup">Setup</button>' +
      '<button type="button" class="chip" data-filter="upgrade">Upgrades</button>' +
      '<p class="filter-count" aria-live="polite"></p>';
    grid.parentNode.insertBefore(bar, grid);

    var input = bar.querySelector("input");
    var chips = bar.querySelectorAll(".chip");
    var count = bar.querySelector(".filter-count");
    var active = "all";

    function apply() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      Array.prototype.forEach.call(cards, function (card) {
        var text = card.textContent.toLowerCase();
        var ok = (active === "all" || text.indexOf(active) > -1) && (q === "" || text.indexOf(q) > -1);
        card.classList.toggle("is-filtered-out", !ok);
        if (ok) shown++;
      });
      count.textContent = shown + " of " + cards.length + " services shown";
    }

    input.addEventListener("input", apply);
    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener("click", function () {
        Array.prototype.forEach.call(chips, function (c) {
          c.classList.remove("is-active");
        });
        chip.classList.add("is-active");
        active = chip.getAttribute("data-filter");
        apply();
      });
    });
    apply();
  }

  /* ---------- 10. Form enhancements: progress, live validity, counters ---------- */
  function initFormUX() {
    var forms = document.querySelectorAll("form[data-validate]");
    Array.prototype.forEach.call(forms, function (form) {
      var required = form.querySelectorAll("[required]");
      if (required.length) {
        var wrap = document.createElement("div");
        wrap.innerHTML =
          '<p class="form-progress-label"><span data-progress-text>0% complete</span></p>' +
          '<div class="form-progress"><span></span></div>';
        form.insertBefore(wrap, form.firstChild);
        var barFill = wrap.querySelector(".form-progress span");
        var label = wrap.querySelector("[data-progress-text]");

        var update = function () {
          var done = 0;
          Array.prototype.forEach.call(required, function (c) {
            var filled = c.type === "checkbox" ? c.checked : (c.value || "").trim() !== "";
            if (filled) done++;
          });
          var pct = Math.round((done / required.length) * 100);
          barFill.style.width = pct + "%";
          label.textContent = pct + "% complete · " + done + "/" + required.length + " required fields";
        };
        form.addEventListener("input", update);
        form.addEventListener("change", update);
        update();
      }

      /* Character counters on textareas */
      Array.prototype.forEach.call(form.querySelectorAll("textarea"), function (ta) {
        var max = 600;
        ta.setAttribute("maxlength", String(max));
        var c = document.createElement("span");
        c.className = "char-count";
        ta.parentNode.appendChild(c);
        var sync = function () {
          c.textContent = ta.value.length + " / " + max + " characters";
        };
        ta.addEventListener("input", sync);
        sync();
      });

      /* Live validity feedback on blur */
      form.addEventListener(
        "blur",
        function (event) {
          var control = event.target;
          if (!control.matches || !control.matches("input, select, textarea")) return;
          var field = control.closest(".field");
          if (!field) return;
          var value = (control.value || "").trim();
          if (value === "") {
            field.classList.remove("is-valid");
            return;
          }
          var blurExtra = control.type === "email" ? "" : extraCheck(control, value);
          if (control.type === "email" && !EMAIL_RE.test(value)) {
            setError(field, "Please enter a valid email address (e.g. name@example.com).");
            field.classList.remove("is-valid");
          } else if (blurExtra) {
            setError(field, blurExtra);
            field.classList.remove("is-valid");
          } else {
            clearError(field);
            field.classList.add("is-valid");
          }
        },
        true
      );
    });
  }

  /* ---------- 11. Pricing billing switch ---------- */
  function initPricing() {
    var buttons = document.querySelectorAll("[data-billing]");
    if (!buttons.length) return;
    var amounts = document.querySelectorAll(".plan-amount");
    var periods = document.querySelectorAll(".plan-period");

    function format(value) {
      return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    function apply(mode) {
      Array.prototype.forEach.call(buttons, function (btn) {
        var on = btn.getAttribute("data-billing") === mode;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
      Array.prototype.forEach.call(amounts, function (el) {
        var next = el.getAttribute(mode === "yearly" ? "data-yearly" : "data-monthly");
        if (!next) return;
        el.classList.add("is-swapping");
        setTimeout(function () {
          el.textContent = format(next);
          el.classList.remove("is-swapping");
        }, 140);
      });
      Array.prototype.forEach.call(periods, function (el) {
        el.textContent = mode === "yearly" ? "/year" : "/month";
      });
    }

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener("click", function () {
        apply(btn.getAttribute("data-billing"));
      });
    });
  }

  /* Expose the few helpers features.js needs (toast + form errors) */
  window.KeStone = { toast: toast, setError: setError, clearError: clearError };

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var headerSlot = document.querySelector("[data-include='header']");
    var footerSlot = document.querySelector("[data-include='footer']");

    Promise.all([
      loadComponent(headerSlot, "header"),
      loadComponent(footerSlot, "footer"),
    ]).then(function () {
      initNav();
      initFooter();
      initScrollUI();
    });

    initForms();
    initFormUX();
    initFilter();
    initReveal();
    initSpotlight();
    initPricing();
    initAmbientBackground();
  });
})();