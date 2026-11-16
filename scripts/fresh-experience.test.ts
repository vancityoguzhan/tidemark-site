import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = path.resolve(import.meta.dirname, "..");

const vite = await createServer({
  root,
  server: { middlewareMode: true, ws: false },
  appType: "custom",
  logLevel: "silent",
});

test.after(async () => {
  await vite.close();
});

const { default: FreshExperience } = await vite.ssrLoadModule(
  "/src/FreshExperience.tsx",
);
const { default: ProductIllustration } = await vite.ssrLoadModule(
  "/src/ProductIllustration.tsx",
);

test("index.html loads Manrope and sets TideMark theme-color", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, /family=Manrope:wght@400\.\.800/);
  assert.doesNotMatch(html, /DM\+Sans|Instrument\+Serif/);
  assert.match(html, /name="theme-color" content="#182741"/);
});

test("package.json keeps build tools in devDependencies", () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8"),
  );
  assert.equal(pkg.dependencies.vite, undefined);
  assert.equal(pkg.dependencies.typescript, undefined);
  assert.equal(pkg.dependencies["@vitejs/plugin-react"], undefined);
  assert.ok(pkg.devDependencies.vite);
  assert.ok(pkg.devDependencies.typescript);
  assert.ok(pkg.devDependencies["@vitejs/plugin-react"]);
});

test("fresh.css enforces overflow guard, focus contrast, and zero dead legacy rules", () => {
  const css = fs.readFileSync(path.join(root, "src/fresh.css"), "utf8");
  assert.doesNotMatch(css, /@import\s+url/);
  assert.doesNotMatch(css, /transition:\s*all/i);
  assert.match(css, /overflow-x:\s*clip/);
  assert.match(css, /\[tabindex="0"\]:focus-visible/);
  assert.match(css, /background:\s*#9e6b16/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@keyframes\s+fSlideInNext/);
  assert.match(css, /@keyframes\s+fSlideInPrev/);
  assert.doesNotMatch(
    css,
    /\.fPilot\b|\.fDesktopBreak\b|\.fLead\b|\.fContactNote\b|\.fStoryMark\b|\.piDemoLabel\b|\.piState\b|\.piTag\b/,
  );
});

test("FreshExperience.tsx uses semantic tablist/tab keyboard nav and Formspree env support", () => {
  const tsx = fs.readFileSync(
    path.join(root, "src/FreshExperience.tsx"),
    "utf8",
  );
  assert.match(tsx, /role="tablist"/);
  assert.match(tsx, /role="tab"/);
  assert.match(tsx, /role="tabpanel"/);
  assert.match(tsx, /onKeyDown=\{handleTabKeyDown\}/);
  assert.match(tsx, /Math\.abs\(dx\)\s*>=\s*40/);
  assert.match(tsx, /VITE_FORMSPREE_URL/);
  assert.match(tsx, /name="_gotcha"/);
  assert.doesNotMatch(tsx, /fPilot|fStoryMark/);
  assert.doesNotMatch(tsx, /Swipe to explore/);
});

test("ProductIllustration.tsx omits decorative badges and uses explicit button types", () => {
  const tsx = fs.readFileSync(
    path.join(root, "src/ProductIllustration.tsx"),
    "utf8",
  );
  assert.doesNotMatch(tsx, /piDemoLabel|piState|piTag/);
  assert.doesNotMatch(tsx, /arrivals \+ departures/);
  const buttons = tsx.match(/<button\b[^>]*>/g) ?? [];
  assert.ok(buttons.length > 0);
  for (const btn of buttons) {
    assert.match(btn, /type="button"/);
  }
});

test("FreshExperience SSR renders hero, tablist roving tabIndex, story, form, and footer", () => {
  const html = renderToStaticMarkup(React.createElement(FreshExperience));
  assert.match(html, /<h1>A better week starts here\.<\/h1>/);
  assert.match(html, /so you don’t have to\./);
  assert.match(html, /id="f-tour-tab-0"[^>]*aria-selected="true"[^>]*tabindex="0"/);
  assert.match(html, /id="f-tour-tab-1"[^>]*aria-selected="false"[^>]*tabindex="-1"/);
  assert.match(html, /id="f-tour-panel"[^>]*role="tabpanel"[^>]*tabindex="0"/);
  assert.match(html, /From the other side of the desk\./);
  assert.match(html, /aria-label="Request a walkthrough"/);
  assert.match(
    html,
    /<footer class="fFooter fWidth"><a class="fBrand" href="#ftop" aria-label="TideMark home">/,
  );
  // Ensure .fSwipeControls > div no longer carries a duplicate aria-live="polite"
  assert.doesNotMatch(
    html,
    /<div class="fSwipeControls"[^>]*>.*?<div aria-live="polite"/,
  );
});

test("ProductIllustration SSR renders all 4 product views cleanly", () => {
  const expected = [
    { view: 0, heading: "The weekly schedule", text: "October 18–24 · Draft" },
    { view: 1, heading: "Staffing needs", text: "High demand · Front desk · Approved rule" },
    { view: 2, heading: "Time off &amp; preferences", text: "Illustrative time-off calendar, October 18 to 31" },
    { view: 3, heading: "Leave planner", text: "Example coverage check" },
  ];
  for (const item of expected) {
    const html = renderToStaticMarkup(
      React.createElement(ProductIllustration, { view: item.view }),
    );
    assert.match(html, new RegExp(`<h3>${item.heading}</h3>`));
    assert.match(html, new RegExp(item.text));
  }
});
