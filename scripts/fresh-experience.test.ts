import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

test("index.html loads Manrope and sets TideMark theme-color", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, /family=Manrope:wght@400\.\.800/);
  assert.doesNotMatch(html, /DM\+Sans|Instrument\+Serif/);
  assert.match(html, /name="theme-color" content="#182741"/);
});

test("fresh.css does not use render-blocking @import or transition: all", () => {
  const css = fs.readFileSync(path.join(root, "src/fresh.css"), "utf8");
  assert.doesNotMatch(css, /@import\s+url/);
  assert.doesNotMatch(css, /transition:\s*all/i);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@keyframes\s+fSlideInNext/);
  assert.match(css, /@keyframes\s+fSlideInPrev/);
});

test("FreshExperience.tsx uses semantic tablist/tab and Formspree env support", () => {
  const tsx = fs.readFileSync(
    path.join(root, "src/FreshExperience.tsx"),
    "utf8",
  );
  assert.match(tsx, /role="tablist"/);
  assert.match(tsx, /role="tab"/);
  assert.match(tsx, /role="tabpanel"/);
  assert.match(tsx, /VITE_FORMSPREE_URL/);
  assert.match(tsx, /name="_gotcha"/);
  assert.doesNotMatch(tsx, /fPilot/);
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
