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
const { default: IncidentIllustration } = await vite.ssrLoadModule(
  "/src/IncidentIllustration.tsx",
);
const { HERO_MODES, HERO_TEAM, analyzeHeroSchedule } = await vite.ssrLoadModule(
  "/src/hero-puzzle-data.ts",
);

test("index.html loads Manrope and Newsreader and sets TideMark theme-color", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, /family=Manrope:wght@400\.\.800/);
  assert.match(html, /family=Newsreader:opsz,wght@6\.\.72,300\.\.500/);
  assert.doesNotMatch(html, /DM\+Sans|Instrument\+Serif/);
  assert.match(html, /name="theme-color" content="#0B131C"/);
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

test("IncidentIllustration.tsx omits decorative badges and uses explicit button types", () => {
  const tsx = fs.readFileSync(
    path.join(root, "src/IncidentIllustration.tsx"),
    "utf8",
  );
  assert.doesNotMatch(tsx, /piDemoLabel|piState|piTag|iiDemoLabel|iiBadge/);
  const buttons = tsx.match(/<button\b[^>]*>/g) ?? [];
  assert.ok(buttons.length > 0);
  for (const btn of buttons) {
    assert.match(btn, /type="button"/);
  }
});

test("FreshExperience SSR renders hero, tidal canvas, 5-person puzzle, tablist, story, form, and footer", () => {
  const html = renderToStaticMarkup(React.createElement(FreshExperience));
  assert.match(html, /<canvas class="fTidalCanvas" aria-hidden="true"><\/canvas>/);
  assert.match(html, /<h1>A better week starts here\.<\/h1>/);
  assert.match(html, /so you don’t have to\./);
  for (const label of ["Manual draft", "Balance shifts", "Morgan Sun off"]) {
    assert.match(html, new RegExp(`>${label}</button>`));
  }
  for (const person of HERO_TEAM) {
    assert.match(html, new RegExp(`>${person.name}</span>`));
  }
  assert.match(html, /id="f-tour-tab-0"[^>]*aria-selected="true"[^>]*tabindex="0"/);
  assert.match(html, /id="f-tour-tab-1"[^>]*aria-selected="false"[^>]*tabindex="-1"/);
  assert.match(html, /id="f-tour-panel"[^>]*role="tabpanel"[^>]*tabindex="0"/);
  assert.match(html, /<a href="#fshift">Shift<\/a>/);
  assert.match(html, /<a href="#fincident">Incident<\/a>/);
  assert.match(html, /<a href="#fstory">Our story<\/a>/);
  assert.match(html, /<h3>TideMark Shift<\/h3>/);
  assert.match(html, /<h3>TideMark Incident<\/h3>/);
  assert.match(html, /id="fincident"/);
  assert.match(html, /<h2>TideMark Incident<\/h2>/);
  assert.match(html, /href="https:\/\/incident\.gettidemark\.com"/);
  assert.match(html, /id="f-incident-tab-0"[^>]*aria-selected="true"[^>]*tabindex="0"/);
  assert.match(html, /id="f-incident-tab-1"[^>]*aria-selected="false"[^>]*tabindex="-1"/);
  assert.match(html, /id="f-incident-panel"[^>]*role="tabpanel"[^>]*tabindex="0"/);
  assert.match(html, /\[PERSON_1\]/);
  assert.match(html, /\[PHONE_1\]/);
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
    { view: 1, heading: "Staffing needs", text: "Busy-day rule · Front desk" },
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

test("IncidentIllustration SSR renders all 4 workflow views cleanly", () => {
  const expected = [
    {
      view: 0,
      heading: "Hide private details",
      checks: [/\[PERSON_1\]/, /\[PHONE_1\]/, /\[BUSINESS_1\]/],
    },
    {
      view: 1,
      heading: "BC checklists",
      checks: [/16 BC incident guides/, /Was a wet-floor sign up\?/],
    },
    {
      view: 2,
      heading: "Draft &amp; fact check",
      checks: [/Key details kept/, /Important refusals/],
    },
    {
      view: 3,
      heading: "Letterhead &amp; PDF",
      checks: [/Printable PDF \(Letter\)/, /Completed offline on your device/],
    },
  ];
  for (const item of expected) {
    const html = renderToStaticMarkup(
      React.createElement(IncidentIllustration, { view: item.view }),
    );
    assert.match(html, new RegExp(`<h3>${item.heading}</h3>`));
    for (const pattern of item.checks) {
      assert.match(html, pattern);
    }
  }
});

test("hero-puzzle-data schedules satisfy coverage, hard rules, and exact trade-off outcomes", () => {
  const manual = HERO_MODES.find((m: { id: string }) => m.id === "manual");
  const balanced = HERO_MODES.find((m: { id: string }) => m.id === "balanced");
  const request = HERO_MODES.find((m: { id: string }) => m.id === "request");
  assert.ok(manual && balanced && request);

  const manualStats = analyzeHeroSchedule(manual.grid);
  assert.equal(manualStats.coveredShifts, 24);
  assert.equal(manualStats.requiredShifts, 24);
  assert.equal(manualStats.hardRulesMet, true);
  assert.equal(manualStats.tightTurnarounds.length, 2);
  assert.equal(manualStats.consecutiveRestCount, 1);
  assert.equal(manualStats.shiftMismatches.length, 4);
  assert.equal(manualStats.morganSunOff, false);

  const balancedStats = analyzeHeroSchedule(balanced.grid);
  assert.equal(balancedStats.coveredShifts, 24);
  assert.equal(balancedStats.requiredShifts, 24);
  assert.equal(balancedStats.hardRulesMet, true);
  assert.equal(balancedStats.tightTurnarounds.length, 0);
  assert.equal(balancedStats.consecutiveRestCount, 5);
  assert.equal(balancedStats.shiftMismatches.length, 0);
  assert.equal(balancedStats.morganSunOff, false);

  const requestStats = analyzeHeroSchedule(request.grid);
  assert.equal(requestStats.coveredShifts, 24);
  assert.equal(requestStats.requiredShifts, 24);
  assert.equal(requestStats.hardRulesMet, true);
  assert.equal(requestStats.tightTurnarounds.length, 0);
  assert.equal(requestStats.consecutiveRestCount, 5);
  assert.equal(requestStats.shiftMismatches.length, 2);
  assert.deepEqual(
    requestStats.shiftMismatches.map((m: { row: number; day: number; shift: string }) => [
      m.row,
      m.day,
      m.shift,
    ]),
    [
      [0, 2, "Mid"],
      [0, 3, "Mid"],
    ],
  );
  assert.equal(requestStats.morganSunOff, true);

  let diffManualToBalanced = 0;
  let diffBalancedToRequest = 0;
  for (let r = 0; r < HERO_TEAM.length; r++) {
    for (let d = 0; d < 7; d++) {
      if (manual.grid[r][d] !== balanced.grid[r][d]) diffManualToBalanced++;
      if (balanced.grid[r][d] !== request.grid[r][d]) diffBalancedToRequest++;
    }
  }
  assert.equal(diffManualToBalanced, 13);
  assert.equal(diffBalancedToRequest, 12);
});
