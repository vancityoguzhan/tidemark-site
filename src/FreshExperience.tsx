import { useEffect, useRef, useState } from "react";
import "./fresh.css";
import ProductIllustration from "./ProductIllustration";
import IncidentIllustration from "./IncidentIllustration";
import TidalField from "./TidalField";
import {
  HERO_DAYS,
  HERO_MODES,
  HERO_TEAM,
  analyzeHeroSchedule,
  getCellMeta,
  type HeroModeId,
} from "./hero-puzzle-data";

const screens = [
  {
    name: "The weekly schedule",
    title: "See the week. See the people.",
    text: "See everyone’s shifts, days off, and remaining trade-offs in one view. Lock key assignments, adjust the rest, and publish when you’re ready.",
  },
  {
    name: "Staffing needs",
    title: "Start with how busy the hotel is.",
    text: "Set your normal shift counts, then add extra coverage automatically on busy check-in and check-out days.",
  },
  {
    name: "Team requests",
    title: "Keep time-off requests in view.",
    text: "Approved and pending time off sit right alongside the week you’re planning, so nothing slips through.",
  },
  {
    name: "Leave planning",
    title: "Check coverage before you say yes.",
    text: "Test overlapping vacation requests before approving time off. Your live schedule stays untouched while you check.",
  },
];
const incidentScreens = [
  {
    name: "Hide private details",
    title: "Real names never leave your device.",
    text: "Before drafting begins, guest names, phone numbers, emails, and addresses are replaced with placeholders right in your browser. Hide your hotel name with one tap, too.",
  },
  {
    name: "BC checklists",
    title: "16 BC incident guides, built in.",
    text: "Covers 16 British Columbia hotel situations, from WorkSafeBC staff injuries to guest slips, food safety, and security. It skips what you already noted and asks only for what’s missing.",
  },
  {
    name: "Draft & fact check",
    title: "Every draft is checked against your notes.",
    text: "Turns shift notes into a calm, factual report, then checks every detail so nothing is added, dropped, or softened from what happened.",
  },
  {
    name: "Letterhead & PDF",
    title: "Finished offline. Ready to print.",
    text: "Restores real names locally without sending anything online, adds your hotel letterhead and logo, and saves a clean printable PDF.",
  },
];
function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Brand() {
  return (
    <>
      <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path
          d="M5 12c7-8 19-8 26-3M5 20c7-8 19-8 26-3M5 28c7-8 19-8 26-3"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <span>TideMark</span>
    </>
  );
}
export default function FreshExperience() {
  const [heroMode, setHeroMode] = useState<HeroModeId>("manual");
  const [screen, setScreen] = useState(0);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [incidentScreen, setIncidentScreen] = useState(0);
  const [incidentSlideDir, setIncidentSlideDir] = useState<1 | -1>(1);
  const incidentSwipeStart = useRef<{ x: number; y: number } | null>(null);
  const incidentTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const formSuccessRef = useRef<HTMLDivElement>(null);
  const formErrorRef = useRef<HTMLParagraphElement>(null);
  function moveScreen(direction: number) {
    setSlideDir(direction >= 0 ? 1 : -1);
    setScreen(
      (current) => (current + direction + screens.length) % screens.length,
    );
  }
  function handleTabKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (screen + 1) % screens.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (screen - 1 + screens.length) % screens.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = screens.length - 1;
    }
    if (nextIndex === null) return;
    event.preventDefault();
    setSlideDir(nextIndex >= screen ? 1 : -1);
    setScreen(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }
  function moveIncidentScreen(direction: number) {
    setIncidentSlideDir(direction >= 0 ? 1 : -1);
    setIncidentScreen(
      (current) =>
        (current + direction + incidentScreens.length) %
        incidentScreens.length,
    );
  }
  function handleIncidentTabKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
  ) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (incidentScreen + 1) % incidentScreens.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex =
        (incidentScreen - 1 + incidentScreens.length) % incidentScreens.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = incidentScreens.length - 1;
    }
    if (nextIndex === null) return;
    event.preventDefault();
    setIncidentSlideDir(nextIndex >= incidentScreen ? 1 : -1);
    setIncidentScreen(nextIndex);
    incidentTabRefs.current[nextIndex]?.focus();
  }
  const [formState, setFormState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  useEffect(() => {
    if (formState === "sent") {
      formSuccessRef.current?.focus();
    } else if (formState === "error") {
      formErrorRef.current?.focus();
    }
  }, [formState]);
  const activeMode =
    HERO_MODES.find((mode) => mode.id === heroMode) ?? HERO_MODES[0];
  const analysis = analyzeHeroSchedule(activeMode.grid);
  const preferenceSummary = analysis.morganSunOff
    ? `Morgan off Sun · ${analysis.shiftMismatches.length} Mid shifts for Alex`
    : analysis.shiftMismatches.length === 0
      ? "Every shift request met · Morgan works Sun"
      : `${analysis.shiftMismatches.length} off-preference shifts · Morgan works Sun`;

  const shot = screens[screen];
  const incidentShot = incidentScreens[incidentScreen];
  const formspreeUrl =
    import.meta.env?.VITE_FORMSPREE_URL ?? "https://formspree.io/f/xlgadqyd";
  async function sendRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setFormState("sending");
    try {
      const response = await fetch(formspreeUrl, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Request failed");
      setFormState("sent");
    } catch {
      setFormState("error");
    }
  }
  return (
    <div className="freshSite">
      <a className="fSkip" href="#fmain">
        Skip to content
      </a>
      <header className="fHeaderWrap" id="ftop">
        <div className="fHeader fWidth">
          <a className="fBrand" href="#ftop" aria-label="TideMark home">
            <Brand />
          </a>
          <nav aria-label="Main navigation">
            <a href="#fshift">Shift</a>
            <a href="#fincident">Incident</a>
            <a href="#fstory">Our story</a>
          </nav>
          <a className="fHeaderAction" href="#fcontact">
            Let’s talk <Arrow />
          </a>
        </div>
      </header>
      <main id="fmain">
        <section className="fHeroZone">
          <div className="fTidalLayer" aria-hidden="true">
            <TidalField harmony={activeMode.harmony} />
          </div>
          <div className="fHero fWidth">
            <div className="fHeroCopy">
              <h1>A better week starts here.</h1>
              <p>
                Spend less time untangling the weekly roster.{" "}
                <span className="fShiftInline">TideMark Shift</span> weighs
                coverage, days off, and team requests so you don’t have to.
              </p>
              <a className="fButton" href="#fcontact">
                Request a walkthrough <Arrow />
              </a>
            </div>
            <div className="fWeekStage" data-state={activeMode.dataState}>
              <div className="fWeekHeader">
                <div className="fWeekTitle">
                  <strong>Front desk · 5 team members</strong>
                  <span>
                    24 shifts · Busy Fri–Sun · Leave &amp; fixed days off locked
                  </span>
                </div>
                <div
                  className="fWeekChoices"
                  role="group"
                  aria-label="Compare illustrative schedules"
                >
                  {HERO_MODES.map((mode) => (
                    <button
                      type="button"
                      key={mode.id}
                      aria-pressed={heroMode === mode.id}
                      onClick={() => setHeroMode(mode.id)}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="fWeekRulesMobile">
                Setup: Jamie off Mon · Elena on leave Thu–Fri · Morgan wants Sun
                off · Preferred shifts set.
              </p>
              <table className="fRoster">
                <caption className="fSr">
                  Sample front-desk schedule under {activeMode.label}:{" "}
                  {analysis.coveredShifts} of {analysis.requiredShifts} shifts
                  covered, {analysis.tightTurnarounds.length} late-to-early
                  shifts, and {analysis.consecutiveRestCount} of 5 team members
                  with days off together.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Team</th>
                    {HERO_DAYS.map((day) => (
                      <th key={day.short} scope="col">
                        <span>{day.short}</span>
                        <span
                          className="fDayDemand"
                          data-peak={day.peak ? "true" : undefined}
                        >
                          {day.requiredCount} shifts
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HERO_TEAM.map((person, row) => (
                    <tr key={person.name}>
                      <th scope="row">
                        <span className="fPersonName">{person.name}</span>
                        <span className="fPersonRule">
                          {person.constraintSummary}
                        </span>
                      </th>
                      {HERO_DAYS.map((day, col) => {
                        const cell = activeMode.grid[row][col];
                        const meta = getCellMeta(activeMode.grid, row, col);
                        const baseClass =
                          cell === "AM"
                            ? "fShiftAM"
                            : cell === "Mid"
                              ? "fShiftMid"
                              : cell === "PM"
                                ? "fShiftPM"
                                : cell === "Leave"
                                  ? "fLeave"
                                  : meta.isConsecutiveRest
                                    ? "fOffConsec"
                                    : "fOffSplit";
                        const modClass =
                          meta.isTightPair || meta.isTightMorning
                            ? " fTight"
                            : meta.isPreferenceTradeoff
                              ? " fTradeoff"
                              : "";
                        return (
                          <td key={day.short}>
                            <span className={`${baseClass}${modClass}`}>
                              {cell}
                              {meta.isTightPair && (
                                <span className="fSr">
                                  {" "}
                                  (tight turnaround before morning shift)
                                </span>
                              )}
                              {meta.isTightMorning && (
                                <span className="fSr">
                                  {" "}
                                  (tight turnaround after evening shift)
                                </span>
                              )}
                              {meta.isPreferenceTradeoff && (
                                <span className="fSr">
                                  {" "}
                                  (outside preferred shift)
                                </span>
                              )}
                              {meta.isLeave && (
                                <span className="fSr"> (approved leave)</span>
                              )}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <dl className="fWeekLedger" aria-live="polite" aria-atomic="true">
                <div>
                  <dt>Coverage</dt>
                  <dd data-tone="steady">
                    {analysis.coveredShifts} / {analysis.requiredShifts} shifts
                  </dd>
                </div>
                <div>
                  <dt>Late-to-early</dt>
                  <dd
                    data-tone={
                      analysis.tightTurnarounds.length > 0 ? "tension" : "calm"
                    }
                  >
                    {analysis.tightTurnarounds.length}
                  </dd>
                </div>
                <div>
                  <dt>Days off together</dt>
                  <dd
                    data-tone={
                      analysis.consecutiveRestCount < 5 ? "tension" : "calm"
                    }
                  >
                    {analysis.consecutiveRestCount} of 5 team
                  </dd>
                </div>
                <div>
                  <dt>Team requests</dt>
                  <dd data-tone={heroMode === "manual" ? "tension" : "neutral"}>
                    {preferenceSummary}
                  </dd>
                </div>
              </dl>
              <div className="fWeekFooter">
                <div
                  className="fWeekResult"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <strong>{activeMode.heading}</strong>
                  <p>{activeMode.summary}</p>
                </div>
                <p className="fIllustrationNote">
                  Sample front-desk week for illustration.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="fSuiteBand" aria-label="TideMark products">
          <div className="fWidth fSuiteGrid">
            <div className="fSuiteItem">
              <h3>TideMark Shift</h3>
              <p>
                Weekly scheduling built for the hard parts: busy weekends, days
                off together, and staff requests, with the final call always
                yours.
              </p>
              <div className="fSuiteActions">
                <a href="#fshift">
                  Explore Shift <Arrow />
                </a>
                <span>Walkthrough &amp; pilot</span>
              </div>
            </div>
            <div className="fSuiteItem">
              <h3>TideMark Incident</h3>
              <p>
                BC incident reporting in your browser. Turn shift notes into a
                printable PDF while guest and staff names stay on your device.
              </p>
              <div className="fSuiteActions">
                <a href="#fincident">
                  Explore Incident <Arrow />
                </a>
                <span>Try it at incident.gettidemark.com</span>
              </div>
            </div>
          </div>
        </section>
        <section className="fProduct" id="fshift">
          <div className="fWidth">
            <div className="fSectionHead">
              <h2>TideMark Shift</h2>
              <p>
                Everything you balance before publishing: busy check-in days,
                time-off requests, and the people behind the schedule.
              </p>
            </div>
            <div className="fTour">
              <div className="fTourRail">
                <div
                  className="fTourButtons"
                  role="tablist"
                  aria-label="Explore Shift product views"
                  onKeyDown={handleTabKeyDown}
                >
                  {screens.map((item, i) => (
                    <button
                      type="button"
                      key={item.name}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      id={`f-tour-tab-${i}`}
                      role="tab"
                      aria-selected={screen === i}
                      aria-controls="f-tour-panel"
                      tabIndex={screen === i ? 0 : -1}
                      onClick={() => {
                        setSlideDir(i >= screen ? 1 : -1);
                        setScreen(i);
                      }}
                    >
                      {item.name}
                      <Arrow />
                    </button>
                  ))}
                </div>
                <div className="fTourText" aria-live="polite">
                  <h3>{shot.title}</h3>
                  <p>{shot.text}</p>
                </div>
              </div>
              <div
                className="fSwipeTour"
                id="f-tour-panel"
                role="tabpanel"
                aria-labelledby={`f-tour-tab-${screen}`}
                tabIndex={0}
              >
                <div
                  className="fSwipeSurface"
                  onTouchStart={(event) => {
                    swipeStart.current = null;
                    if (
                      event.touches.length !== 1 ||
                      !window.matchMedia("(max-width: 800px)").matches
                    )
                      return;
                    if (
                      (event.target as Element).closest(
                        "button, a, input, select, textarea",
                      )
                    )
                      return;
                    const touch = event.touches[0];
                    swipeStart.current = { x: touch.clientX, y: touch.clientY };
                  }}
                  onTouchMove={(event) => {
                    if (event.touches.length !== 1) swipeStart.current = null;
                  }}
                  onTouchCancel={() => {
                    swipeStart.current = null;
                  }}
                  onTouchEnd={(event) => {
                    const start = swipeStart.current;
                    swipeStart.current = null;
                    if (!start || !event.changedTouches.length) return;
                    const touch = event.changedTouches[0];
                    const dx = touch.clientX - start.x;
                    const dy = touch.clientY - start.y;
                    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.5)
                      moveScreen(dx < 0 ? 1 : -1);
                  }}
                >
                  <div
                    key={screen}
                    className="fTourViewTransition"
                    data-dir={slideDir}
                  >
                    <ProductIllustration view={screen} />
                  </div>
                </div>
                <div
                  className="fSwipeControls"
                  role="group"
                  aria-label="Product illustration navigation"
                >
                  <button
                    type="button"
                    onClick={() => moveScreen(-1)}
                    aria-label="Previous product view"
                  >
                    <span aria-hidden="true">‹</span>
                  </button>
                  <div>
                    <strong>{shot.name}</strong>
                    <span>
                      {screen + 1} of {screens.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => moveScreen(1)}
                    aria-label="Next product view"
                  >
                    <span aria-hidden="true">›</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="fApproach" id="fapproach">
          <div className="fWidth">
            <div className="fSectionHead">
              <h2>How Shift builds your week.</h2>
              <p>
                A good schedule isn’t just filled slots. It balances hotel
                coverage, real rest, and a fair week for your team.
              </p>
            </div>
            <ol className="fSteps">
              <li>
                <div>
                  <h3>Set what your week needs.</h3>
                  <p>
                    Enter how many people each shift needs, who can cover each
                    role, approved time off, and shift preferences.
                  </p>
                </div>
              </li>
              <li>
                <div>
                  <h3>Let Shift work through the puzzle.</h3>
                  <p>
                    Instead of juggling cells by hand, let Shift weigh the
                    options to keep days off together, avoid late-to-early
                    turns, and meet more requests.
                  </p>
                </div>
              </li>
              <li>
                <div>
                  <h3>Review the trade-offs, then publish.</h3>
                  <p>
                    Look over each person’s week with every trade-off clear
                    upfront. Keep what works, tweak the rest, and publish when
                    you’re ready.
                  </p>
                </div>
              </li>
            </ol>
            <details className="fDetails">
              <summary>
                Does Shift always find the best possible schedule?
              </summary>
              <p>
                No software can resolve every conflict when requests collide.
                Shift runs a fast search under your rules and priorities to
                produce a strong, practical week rather than proving no better
                plan exists. When availability is tight, some trade-offs remain,
                and you always review the week before publishing.
              </p>
            </details>
          </div>
        </section>
        <section className="fIncident" id="fincident">
          <div className="fWidth">
            <div className="fIncidentHead">
              <div className="fIncidentHeadMain">
                <h2>TideMark Incident</h2>
                <p>
                  Writing an incident report after a busy shift shouldn’t feel
                  like drafting a legal brief. Turn rough shift notes into a
                  clear, BC-ready PDF while guest and staff names stay on your
                  device.
                </p>
              </div>
              <div className="fIncidentHeadAction">
                <a
                  className="fButton fIncidentCta"
                  href="https://incident.gettidemark.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Try Incident now <Arrow />
                  <span className="fSr">, opens in a new tab</span>
                </a>
                <p className="fIncidentMeta">
                  incident.gettidemark.com · No sign-up · Runs in your browser
                </p>
              </div>
            </div>
            <div className="fTour fIncidentTour">
              <div className="fTourRail">
                <div
                  className="fTourButtons"
                  role="tablist"
                  aria-label="Explore Incident workflow steps"
                  onKeyDown={handleIncidentTabKeyDown}
                >
                  {incidentScreens.map((item, i) => (
                    <button
                      type="button"
                      key={item.name}
                      ref={(el) => {
                        incidentTabRefs.current[i] = el;
                      }}
                      id={`f-incident-tab-${i}`}
                      role="tab"
                      aria-selected={incidentScreen === i}
                      aria-controls="f-incident-panel"
                      tabIndex={incidentScreen === i ? 0 : -1}
                      onClick={() => {
                        setIncidentSlideDir(i >= incidentScreen ? 1 : -1);
                        setIncidentScreen(i);
                      }}
                    >
                      {item.name}
                      <Arrow />
                    </button>
                  ))}
                </div>
                <div className="fTourText" aria-live="polite">
                  <h3>{incidentShot.title}</h3>
                  <p>{incidentShot.text}</p>
                </div>
              </div>
              <div
                className="fSwipeTour"
                id="f-incident-panel"
                role="tabpanel"
                aria-labelledby={`f-incident-tab-${incidentScreen}`}
                tabIndex={0}
              >
                <div
                  className="fSwipeSurface"
                  onTouchStart={(event) => {
                    incidentSwipeStart.current = null;
                    if (
                      event.touches.length !== 1 ||
                      !window.matchMedia("(max-width: 800px)").matches
                    )
                      return;
                    if (
                      (event.target as Element).closest(
                        "button, a, input, select, textarea",
                      )
                    )
                      return;
                    const touch = event.touches[0];
                    incidentSwipeStart.current = {
                      x: touch.clientX,
                      y: touch.clientY,
                    };
                  }}
                  onTouchMove={(event) => {
                    if (event.touches.length !== 1)
                      incidentSwipeStart.current = null;
                  }}
                  onTouchCancel={() => {
                    incidentSwipeStart.current = null;
                  }}
                  onTouchEnd={(event) => {
                    const start = incidentSwipeStart.current;
                    incidentSwipeStart.current = null;
                    if (!start || !event.changedTouches.length) return;
                    const touch = event.changedTouches[0];
                    const dx = touch.clientX - start.x;
                    const dy = touch.clientY - start.y;
                    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.5)
                      moveIncidentScreen(dx < 0 ? 1 : -1);
                  }}
                >
                  <div
                    key={incidentScreen}
                    className="fTourViewTransition"
                    data-dir={incidentSlideDir}
                  >
                    <IncidentIllustration view={incidentScreen} />
                  </div>
                </div>
                <div
                  className="fSwipeControls"
                  role="group"
                  aria-label="Incident workflow navigation"
                >
                  <button
                    type="button"
                    onClick={() => moveIncidentScreen(-1)}
                    aria-label="Previous Incident step"
                  >
                    <span aria-hidden="true">‹</span>
                  </button>
                  <div>
                    <strong>{incidentShot.name}</strong>
                    <span>
                      {incidentScreen + 1} of {incidentScreens.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => moveIncidentScreen(1)}
                    aria-label="Next Incident step"
                  >
                    <span aria-hidden="true">›</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="fStory fWidth" id="fstory">
          <div className="fStoryMedia">
            <img
              className="fFounderPhoto"
              src="/oguzhan-gur.jpg"
              alt="Oguzhan Gur, hotel operator and TideMark creator"
              width={764}
              height={1024}
              loading="lazy"
            />
          </div>
          <div className="fStoryBody">
            <h2>From the other side of the desk.</h2>
            <p>
              I work on hotel operations and the systems behind them: studying
              how a property runs day to day, spotting where teams lose hours to
              manual work, and building straightforward tools to solve it.
            </p>
            <p>
              My goal with TideMark is simple: let software handle the
              repetitive scheduling and paperwork so managers spend less time in
              spreadsheets, teams get better weeks, and guests feel the
              difference.
            </p>
            <a
              className="fFounder"
              href="https://www.linkedin.com/in/oguzhangur"
              target="_blank"
              rel="noreferrer"
            >
              <strong>Oguzhan Gur</strong>
              <span>Founder, TideMark · British Columbia</span>
              <span className="fSr">LinkedIn, opens in a new tab</span>
            </a>
          </div>
        </section>
        <section className="fContact" id="fcontact">
          <div className="fWidth fContactGrid">
            <div>
              <h2>Let’s talk about your team.</h2>
              <p>
                Tell me about your property and what slows your week down. I’ll
                reply personally to set up a walkthrough and see whether
                TideMark fits how your team runs.
              </p>
            </div>
            <form onSubmit={sendRequest} aria-label="Request a walkthrough">
              <input
                type="hidden"
                name="_subject"
                value="TideMark fresh site walkthrough request"
              />
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                hidden
              />
              {formState === "sent" ? (
                <div
                  className="fFormSuccess"
                  role="status"
                  ref={formSuccessRef}
                  tabIndex={-1}
                >
                  <h3>Request received. I’ll be in touch soon.</h3>
                  <p>
                    Thanks for reaching out. I’ll reply to the email you shared
                    to arrange a walkthrough.
                  </p>
                </div>
              ) : (
                <>
                  <div className="fFormRow">
                    <label>
                      Your name
                      <input name="name" autoComplete="name" required />
                    </label>
                    <label>
                      Work email
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                      />
                    </label>
                  </div>
                  <label>
                    I’m interested in
                    <select name="interest" defaultValue="TideMark Shift">
                      <option>TideMark Shift</option>
                      <option>TideMark Incident</option>
                      <option>Both products</option>
                    </select>
                  </label>
                  <label>
                    A little about your property <span>(optional)</span>
                    <textarea
                      name="setup_goal"
                      rows={3}
                      placeholder="Your team size, your scheduling challenges, or how you handle incident reports today."
                    />
                  </label>
                  <button
                    className="fButton"
                    type="submit"
                    disabled={formState === "sending"}
                  >
                    {formState === "sending"
                      ? "Sending request…"
                      : "Request a walkthrough"}
                    <Arrow />
                  </button>
                  {formState === "error" && (
                    <p
                      className="fFormError"
                      role="alert"
                      ref={formErrorRef}
                      tabIndex={-1}
                    >
                      Your request couldn’t be sent. Your details are still
                      here. Please try again, or contact Oguzhan on{" "}
                      <a href="https://www.linkedin.com/in/oguzhangur">
                        LinkedIn
                      </a>
                      .
                    </p>
                  )}
                  <p className="fFormNote">
                    Goes straight to Oguzhan. No marketing emails.
                  </p>
                </>
              )}
            </form>
          </div>
        </section>
      </main>
      <footer className="fFooter fWidth">
        <a className="fBrand" href="#ftop" aria-label="TideMark home">
          <Brand />
        </a>
        <p>Built in British Columbia for hotel teams.</p>
        <a
          href="https://www.linkedin.com/in/oguzhangur"
          target="_blank"
          rel="noreferrer"
        >
          Connect on LinkedIn<span className="fSr">, opens in a new tab</span>
        </a>
      </footer>
    </div>
  );
}
