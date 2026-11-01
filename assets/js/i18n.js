/* =========================================================
   Language switch: English <-> isiXhosa
   - Dictionary lives in assets/js/lang-xh.js (window.KESTONE_LANG.xh)
   - Walks text nodes and a few attributes, remembers the English
     original so switching back is lossless
   - A MutationObserver translates content built by other scripts
     (tips, estimates, search results, toasts, open status)
   - Choice is saved in localStorage ("kestone.lang")
   - Anything without a translation simply stays in English
   ========================================================= */
(function () {
  "use strict";

  var KEY = "kestone.lang";
  var ATTRS = ["placeholder", "aria-label", "alt", "title"];
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, SVG: 1 };

  var dict = (window.KESTONE_LANG && window.KESTONE_LANG.xh) || null;
  if (!dict) return;

  var lang = "en";
  var observer = null;
  var nodeMap = new WeakMap();   // text node -> { orig, tr }
  var attrMap = new WeakMap();   // element -> { attr: { orig, tr } }
  var titleOrig = document.title;
  var patterns = (dict.patterns || []).map(function (p) { return [new RegExp(p[0]), p[1]]; });

  function norm(s) { return s.replace(/\s+/g, " ").trim(); }

  function translate(str) {
    var key = norm(str);
    if (!key) return null;
    if (Object.prototype.hasOwnProperty.call(dict.text, key)) return dict.text[key];
    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i][0].test(key)) {
        return key.replace(patterns[i][0], patterns[i][1]).replace(/\{\{(.*?)\}\}/g, function (_, inner) {
          if (inner.indexOf("day:") === 0) return dict.days[inner.slice(4)] || inner.slice(4);
          return translate(inner) || inner;
        });
      }
    }
    return null;
  }

  function skipped(el) {
    for (var n = el; n && n.nodeType === 1; n = n.parentNode) {
      if (SKIP[n.tagName.toUpperCase()] || n.hasAttribute("data-no-i18n")) return true;
    }
    return false;
  }

  var markMap = new WeakMap();   // element with <mark> highlights -> { html, tr }

  /* Search highlights split one sentence into several nodes; translate the whole element instead */
  function markHost(node) {
    var host = node.parentNode;
    if (host && host.tagName === "MARK") host = host.parentNode;
    return host && host.querySelector && host.querySelector(":scope > mark") ? host : null;
  }
  function doMarked(el) {
    if (skipped(el)) return;
    var rec = markMap.get(el);
    if (rec && el.textContent === rec.tr) return;
    var tr = translate(el.textContent);
    if (tr === null) return;
    tr = el.textContent.match(/^\s*/)[0] + tr + el.textContent.match(/\s*$/)[0];
    markMap.set(el, { html: el.innerHTML, tr: tr });
    el.textContent = tr;
  }

  function doText(node) {
    var parent = node.parentNode;
    if (!parent || skipped(parent)) return;
    var host = markHost(node);
    if (host) { doMarked(host); return; }
    var rec = nodeMap.get(node);
    if (rec && node.data === rec.tr) return;              // already ours
    var tr = translate(node.data);
    if (tr === null) { nodeMap.delete(node); return; }
    var lead = node.data.match(/^\s*/)[0], trail = node.data.match(/\s*$/)[0];
    var out = lead + tr + trail;
    nodeMap.set(node, { orig: node.data, tr: out });
    node.data = out;
  }

  function doAttrs(el) {
    if (skipped(el)) return;
    var rec = attrMap.get(el) || {};
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      var cur = el.getAttribute(a);
      if (rec[a] && cur === rec[a].tr) return;
      var tr = translate(cur);
      if (tr === null) { delete rec[a]; return; }
      rec[a] = { orig: cur, tr: tr };
      el.setAttribute(a, tr);
    });
    attrMap.set(el, rec);
  }

  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1) return;
    if (skipped(root)) return;
    doAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null);
    var list = [], n;
    while ((n = w.nextNode())) list.push(n);   /* collect first: translating may replace nodes */
    list.forEach(function (x) {
      if (x.nodeType === 3) doText(x); else doAttrs(x);
    });
  }

  function revert(root) {
    var hosts = root.querySelectorAll("*");
    for (var i = 0; i < hosts.length; i++) {
      var mr = markMap.get(hosts[i]);
      if (mr && hosts[i].textContent === mr.tr) hosts[i].innerHTML = mr.html;
      markMap.delete(hosts[i]);
    }
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) {
        var r = nodeMap.get(n);
        if (r && n.data === r.tr) n.data = r.orig;
        nodeMap.delete(n);
      } else {
        var ar = attrMap.get(n);
        if (ar) {
          Object.keys(ar).forEach(function (a) {
            if (n.getAttribute(a) === ar[a].tr) n.setAttribute(a, ar[a].orig);
          });
          attrMap.delete(n);
        }
      }
    }
  }

  function setTitle() {
    var meta = document.querySelector('meta[name="description"]');
    if (lang === "xh") {
      titleOrig = document.title;
      var t = translate(titleOrig);
      if (t) document.title = t;
    } else {
      document.title = titleOrig;
    }
    return meta;
  }

  function updateButtons() {
    var btns = document.querySelectorAll("[data-lang-switch]");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      b.textContent = lang === "xh" ? "EN" : "XH";
      b.setAttribute("aria-pressed", lang === "xh" ? "true" : "false");
      b.setAttribute("lang", lang === "xh" ? "en" : "xh");
      b.setAttribute("aria-label", lang === "xh" ? "Switch to English" : "Tshintshela kwi-isiXhosa (Switch to isiXhosa)");
      b.title = lang === "xh" ? "English" : "isiXhosa";
    }
  }

  var NOTICE_ID = "langNotice";
  function legalNotice() {
    var existing = document.getElementById(NOTICE_ID);
    var isLegal = /(privacy|terms)\.html$/.test(location.pathname);
    if (lang !== "xh" || !isLegal) { if (existing) existing.remove(); return; }
    if (existing) return;
    var main = document.querySelector("main");
    if (!main) return;
    var d = document.createElement("p");
    d.id = NOTICE_ID;
    d.className = "lang-notice";
    d.setAttribute("role", "note");
    d.setAttribute("data-no-i18n", "");
    d.innerHTML = "Isicatshulwa semigaqo esemthethweni siseSingesi kuphela ukuze kugcinwe intsingiselo echanekileyo. " +
      "<span lang=\"en\">The full legal text is available in English only so the exact meaning is preserved.</span>";
    main.insertBefore(d, main.firstChild);
  }

  function startObserver() {
    if (observer || !window.MutationObserver) return;
    observer = new MutationObserver(function (muts) {
      observer.disconnect();
      try {
        muts.forEach(function (m) {
          if (m.type === "characterData") doText(m.target);
          else if (m.type === "attributes") doAttrs(m.target);
          else m.addedNodes.forEach(function (n) { walk(n); });
        });
      } finally { attach(); }
    });
    attach();
  }
  function attach() {
    if (lang !== "xh" || !observer) return;
    observer.observe(document.body, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS
    });
  }

  function apply(next, save) {
    var wasObserving = !!observer;
    if (observer) observer.disconnect();
    lang = next;
    if (lang === "xh") {
      document.documentElement.setAttribute("lang", "xh");
      walk(document.body);
      setTitle();
      startObserver();
      attach();
    } else {
      document.documentElement.setAttribute("lang", "en");
      revert(document.body);
      setTitle();
    }
    legalNotice();
    updateButtons();
    if (save) { try { localStorage.setItem(KEY, lang); } catch (e) {} }
    if (window.KeStone && wasObserving !== undefined && save && window.KeStone.toast) {
      window.KeStone.toast(lang === "xh" ? "Ulwimi: isiXhosa" : "Language: English");
    }
  }

  function injectButton() {
    if (document.querySelector("[data-lang-switch]")) return;
    var ul = document.querySelector("#primaryNav ul, .primary-nav ul");
    if (!ul) return;
    var li = document.createElement("li");
    li.innerHTML = '<button class="lang-switch" type="button" data-lang-switch data-no-i18n>XH</button>';
    var cta = ul.querySelector(".btn");
    var anchor = cta ? cta.closest("li") : null;
    ul.insertBefore(li, anchor);
  }

  function init() {
    injectButton();
    updateButtons();
    if (!document.querySelector("[data-lang-switch]") && window.MutationObserver) {
      /* header is loaded asynchronously on some pages */
      var waiter = new MutationObserver(function () {
        injectButton();
        if (document.querySelector("[data-lang-switch]")) { waiter.disconnect(); updateButtons(); }
      });
      waiter.observe(document.body, { childList: true, subtree: true });
    }
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-lang-switch]");
      if (b) { e.preventDefault(); apply(lang === "xh" ? "en" : "xh", true); }
    });
    var saved = "en";
    try { saved = localStorage.getItem(KEY) || "en"; } catch (e) {}
    if (saved === "xh") apply("xh", false);
  }

  /* run after script.js / features.js have built their markup */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(init, 0); });
  } else {
    setTimeout(init, 0);
  }

  window.KeStoneLang = { set: function (l) { apply(l === "xh" ? "xh" : "en", true); }, get: function () { return lang; } };
})();
