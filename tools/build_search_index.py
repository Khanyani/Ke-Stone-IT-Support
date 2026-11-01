#!/usr/bin/env python3
"""Build the site-search index for Ke'Stone IT Support.

Reads the HTML pages and writes assets/data/search-index.js, which the
search page (pages/search.html) loads as a normal script, so search works
on any static host and even when the files are opened directly.

Run from the project root after changing page content:

    python3 tools/build_search_index.py
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "data" / "search-index.js"

PAGES = [
    ("index.html", "Home"),
    ("pages/services.html", "Services"),
    ("pages/repairs.html", "Repairs"),
    ("pages/about.html", "About"),
    ("pages/contact.html", "Contact"),
    ("pages/enquiry.html", "Enquiry"),
    ("pages/privacy.html", "Privacy Policy"),
    ("pages/terms.html", "Terms"),
]
SKIP_TAGS = {"script", "style", "svg", "noscript", "head", "header", "footer", "nav", "form"}
HEADINGS = {"h1", "h2", "h3"}


def clean(text):
    return re.sub(r"\s+", " ", text).strip()


class Collector(HTMLParser):
    """Collects headings, their following text, service cards and FAQ items."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.in_main = False
        self.stack = []          # open tags (name, attrs)
        self.heading = None      # current heading text buffer
        self.heading_id = ""
        self.sections = []       # [title, id, text]
        self.cur = None
        self.services = []       # [id, title, text]
        self.cur_service = None
        self.svc = {}
        self.p_kind = ""
        self.service_depth = 0
        self.faq = []            # [question, answer]
        self.in_trigger = False
        self.in_panel = False
        self.q = ""
        self.a = ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in SKIP_TAGS and tag != "head":
            self.skip += 1
        if tag == "head":
            self.skip += 1
        if tag == "main":
            self.in_main = True
        if not self.in_main or self.skip:
            return
        self.stack.append(tag)
        cls = a.get("class", "")
        if tag == "article" and a.get("id", "").startswith("svc-"):
            self.cur_service = [a["id"], "", ""]
            self.svc = {}
            self.p_kind = ""
            self.service_depth = len(self.stack)
        if self.cur_service is not None:
            if tag == "img":
                self.svc["img"] = a.get("src", "")
                self.svc["alt"] = a.get("alt", "")
            elif tag == "p":
                self.p_kind = "price" if "price" in cls else ("" if self.svc.get("desc") else "desc")
            elif tag == "span" and self.p_kind == "price":
                self.p_kind = "unit"
        if tag in HEADINGS:
            self.heading = ""
            self.heading_id = a.get("id", "")
        if "acc-trigger" in cls:
            self.in_trigger = True
            self.q = ""
        if "acc-panel" in cls:
            self.in_panel = True
            self.a = ""

    def handle_endtag(self, tag):
        if tag in SKIP_TAGS or tag == "head":
            self.skip = max(0, self.skip - 1)
        if tag == "main":
            self.in_main = False
        if not self.in_main and tag != "main":
            return
        if self.stack and tag == self.stack[-1]:
            if tag == "article" and self.cur_service and len(self.stack) == self.service_depth:
                s = self.cur_service
                s[2] = re.sub(r"^View\s+|\s*Request this service\s*→?$", "", clean(s[2]))
                self.services.append(s + [dict(self.svc)])
                self.cur_service = None
            self.stack.pop()
        if tag in HEADINGS and self.heading is not None:
            title = clean(self.heading)
            if self.cur_service is not None and tag == "h3":
                self.cur_service[1] = title
            elif tag in ("h1", "h2"):
                self.cur = [title, self.heading_id, ""]
                self.sections.append(self.cur)
            self.heading = None
        if tag == "p" and self.cur_service is not None:
            self.p_kind = ""
        if self.in_trigger and tag == "button":
            self.in_trigger = False
        if self.in_panel and tag == "div" and self.a.strip():
            self.in_panel = False
            self.faq.append([clean(self.q), clean(self.a)])

    def handle_data(self, data):
        if not self.in_main or self.skip:
            return
        if self.heading is not None:
            self.heading += data
        if self.in_trigger:
            self.q += data
        if self.in_panel:
            self.a += data
        if self.cur_service is not None and self.heading is None:
            self.cur_service[2] += " " + data
        if self.cur is not None and self.heading is None:
            self.cur[2] += " " + data


def page_meta(html):
    t = re.search(r"<title>(.*?)</title>", html, re.S)
    d = re.search(r'<meta\s+name="description"\s+content="(.*?)"', html, re.S)
    unesc = lambda s: s.replace("&amp;", "&")
    return unesc(clean(t.group(1))) if t else "", unesc(clean(d.group(1))) if d else ""


def trim(text, n=420):
    text = clean(text)
    return text if len(text) <= n else text[:n].rsplit(" ", 1)[0] + "…"


def main():
    entries = []
    for rel, label in PAGES:
        html = (ROOT / rel).read_text(encoding="utf-8")
        title, desc = page_meta(html)
        c = Collector()
        c.feed(html)
        kind = "legal" if label in ("Privacy Policy", "Terms") else "page"
        entries.append({"t": title.split("|")[0].strip(), "u": rel, "p": label, "k": kind, "x": trim(desc)})
        for sec_title, sec_id, text in c.sections:
            if not sec_title or not clean(text):
                continue
            entries.append({
                "t": sec_title,
                "u": rel + ("#" + sec_id if sec_id else ""),
                "p": label,
                "k": kind,
                "x": trim(text),
            })
        for sid, stitle, text in c.services:
            entries.append({"t": stitle, "u": f"pages/services.html#{sid}", "p": "Service", "k": "service", "x": trim(text)})
        for q, a in c.faq:
            entries.append({"t": q, "u": rel + "#faq", "p": "FAQ", "k": "faq", "x": trim(a)})
    # Drop exact duplicates (same title + url)
    seen, unique = set(), []
    for e in entries:
        key = (e["t"], e["u"])
        if key not in seen:
            seen.add(key)
            unique.append(e)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        "/* Generated by tools/build_search_index.py - do not edit by hand */\n"
        "window.KESTONE_SEARCH = " + json.dumps(unique, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
    )
    kinds = {}
    for e in unique:
        kinds[e["k"]] = kinds.get(e["k"], 0) + 1
    print(f"Wrote {len(unique)} entries to {OUT.relative_to(ROOT)}: {kinds}")


if __name__ == "__main__":
    sys.exit(main())
