import { useState } from "react";

function Mark({ large = false }: { large?: boolean }) {
  return (
    <span className={`mark ${large ? "markLarge" : ""}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

const shiftSteps = [
  {
    id: "solver",
    stepNumber: "Step 1",
    tab: "1. Mathematical schedule builder",
    badge: "GOOGLE OR-TOOLS OPTIMIZATION",
    title: "Tests thousands of shift combinations in seconds so you stop second-guessing",
    caption:
      "When you build a schedule by hand, moving one shift sets off a chain reaction across the whole week. Shift uses Google OR-Tools to evaluate thousands of valid schedules at once. It locks in your business coverage and BC rest rules first, then finds the mathematical combination that gives your team the most preferred shifts, the most back-to-back days off, and the fairest rotation.",
    src: "/screenshots/shift-roster-grid.png",
    alt: "TideMark Shift weekly schedule grid built with Google OR-Tools using fictional demo team members",
    highlights: [
      "Maximizes consecutive days off so team members get real rest instead of split days off",
      "Balances unpopular shifts and weekend work fairly across an 8-week history",
      "Lets you lock any shift or day off ('Keep assignment') before rebuilding the rest of the week",
    ],
  },
  {
    id: "activity",
    stepNumber: "Step 2",
    tab: "2. Arrivals, occupancy & options",
    badge: "BUSINESS NEEDS + TEAM SATISFACTION",
    title: "Enter the week's hotel activity and compare 3 complete schedule options",
    caption:
      "Put in your daily arrivals, departures, and occupancy at the top of the week. Shift shows your busiest check-in days right above the schedule and lets you compare three distinct mathematical solutions side by side: one focused on protecting team preferences, one focused on strong consecutive breaks, and one focused on minimizing disruption.",
    src: "/screenshots/shift-schedule-overview.png",
    alt: "TideMark Shift top command band showing 7-day Hotel Activity forecast, Shift Brief, and Compare Options",
    highlights: [
      "7-day Hotel Activity strip shows arrivals, departures, and occupancy right above the grid",
      "Compare 3 complete solver options side by side before choosing the week's winner",
      "Highlights any open shift or tradeoff in plain language before you publish",
    ],
  },
  {
    id: "rules",
    stepNumber: "Step 3",
    tab: "3. Automatic busy-day rules",
    badge: "DYNAMIC STAFFING NEEDS",
    title: "Automatically adds extra coverage when arrivals or departures spike",
    caption:
      "You should not have to remember every busy day from memory. Set simple rules once, like adding a midday Front Desk shift when combined arrivals and departures pass 150. Shift adjusts that day's staffing needs automatically while keeping your normal baseline template untouched.",
    src: "/screenshots/shift-staffing-needs.png",
    alt: "TideMark Shift Staffing Needs and Staffing Rules screen showing automatic busy-day rules",
    highlights: [
      "Adds midday desk or bell coverage automatically when arrivals + departures cross your threshold",
      "Bridges Duty Manager gaps so the floor always has leadership coverage",
      "Toggle between your normal baseline guide and busy-day adjusted targets with one click",
    ],
  },
  {
    id: "leave",
    stepNumber: "Step 4",
    tab: "4. Leave planner ('Room to say yes')",
    badge: "STRESS-FREE VACATION APPROVALS",
    title: "Know in five seconds if you can approve a time-off request",
    caption:
      "When someone asks for Friday and Saturday off, you want to say yes if the schedule allows it. The Leave Planner runs the math in a private test workspace alongside overlapping requests, showing you immediately whether the desk stays covered before you make a promise.",
    src: "/screenshots/shift-leave-planner.png",
    alt: "TideMark Shift Leave Planner showing private vacation impact testing",
    highlights: [
      "Tests up to 12 proposed vacation or day-off requests together without touching the live schedule",
      "Shows clearly whether guest-facing desk shifts stay covered",
      "Gives you a clear, fair answer for your team member in seconds",
    ],
  },
  {
    id: "requests",
    stepNumber: "Step 5",
    tab: "5. Team requests & portal",
    badge: "TIME OFF & PREFERENCES",
    title: "All vacation requests, preferred days off, and shift swaps in one calendar",
    caption:
      "Instead of tracking requests across sticky notes, text messages, and emails, view every pending and approved request on a monthly calendar. Team members can submit requests from their phone via PIN login, or you can scan a paper request form with your camera.",
    src: "/screenshots/shift-requests-calendar.png",
    alt: "TideMark Shift Time Off and Preferences monthly calendar view",
    highlights: [
      "Monthly calendar of pending and approved requests with one-click 'Check impact'",
      "Self-serve Team Portal with PIN login and live calendar sync for employees' phones",
      "Built for Front Desk, Housekeeping, and Restaurant teams",
    ],
  },
];

const roster = [
  {
    name: "Harper Lin",
    role: "Front Desk / Command Centre",
    baselineNote: "Sun-Mon consecutive days off · Trainer locked Tue AM",
    vacationNote: "Fri vacation approved · Keeps Sun-Mon consecutive off + Tue AM Trainer",
    shifts: ["OFF", "OFF", "AM", "PM", "PM", "PM", "AM"],
    pinCol: 2,
    pinReason: "Kept assignment: Paired with trainee on Tuesday AM",
  },
  {
    name: "Oliver Wong",
    role: "Front Desk / Command Centre",
    baselineNote: "Tue-Wed consecutive days off · Covers Thu PM & Sat PM",
    vacationNote: "Shifted to cover Fri PM check-in peak · Keeps Tue-Wed consecutive off",
    shifts: ["PM", "AM", "OFF", "OFF", "PM", "OFF", "PM"],
    pinCol: -1,
    pinReason: "",
  },
  {
    name: "Maya Patel",
    role: "Front Desk / Command Centre",
    baselineNote: "Approved Mon-Tue vacation + Fri-Sat off",
    vacationNote: "Schedule untouched · Zero ripple disruption to her week",
    shifts: ["AM", "VAC", "VAC", "AM", "AM", "OFF", "OFF"],
    pinCol: -1,
    pinReason: "",
  },
  {
    name: "Marcus Reid",
    role: "Night Audit · Overnight Desk",
    baselineNote: "Wed-Thu consecutive days off · Anchors Fri-Sat audit",
    vacationNote: "Locked Fri-Sat Night Audit untouched · Zero clopen turnarounds",
    shifts: ["GY", "GY", "GY", "OFF", "OFF", "GY", "GY"],
    pinCol: 5,
    pinReason: "Kept assignment: Anchors Friday & Saturday overnight audit desk",
  },
];

const incidentSamples = [
  {
    type: "Pool slip & fall",
    badge: "SAFETY · POOL ENTRANCE",
    time: "9:40 PM",
    rawNote:
      "“Guest Jane Smith from Room 814 slipped by the indoor pool door around 9:40 PM. There was some water near the towel bin. Security Officer Patel came down and took three photos. She said she felt okay and didn’t want an ambulance.”",
    redactedNote: (
      <>
        “Guest <mark>[GUEST_01]</mark> from <mark>[ROOM_01]</mark> slipped by the indoor pool door around 9:40 PM. There was some water near the towel bin. Security Officer <mark>[STAFF_01]</mark> came down and took three photos. She said she felt okay and didn’t want an ambulance.”
      </>
    ),
    missingQuestion:
      "Was a wet-floor sign already in place before 9:40 PM, and who mopped or cordoned off the entrance afterward?",
    finalReport:
      "At approximately 21:40, registered guest Jane Smith (Room 814) slipped near the indoor pool entrance where standing water was observed beside the towel bin. Security Officer Patel attended the scene, documented the floor condition with three photographs, and offered emergency medical assistance, which the guest declined before returning to her room.",
    checklist: [
      "Exact time & location recorded (21:40, indoor pool entrance)",
      "Medical / ambulance offer and guest refusal documented",
      "3 scene photographs linked to the report",
      "Wet-floor signage & housekeeping cleanup prompted before sign-off",
    ],
  },
  {
    type: "Missing laptop in guest room",
    badge: "SECURITY · GUEST ROOM",
    time: "6:25 PM",
    rawNote:
      "“Marcus Vance in Room 614 called the front desk at 6:25 PM saying his work MacBook Pro was missing from the desk when he got back from dinner. He left around 5:00 PM. I asked Security to pull the Saflok door lock audit.”",
    redactedNote: (
      <>
        “<mark>[GUEST_01]</mark> in <mark>[ROOM_01]</mark> called the front desk at 6:25 PM saying his work MacBook Pro was missing from the desk when he got back from dinner. He left around 5:00 PM. I asked Security to pull the Saflok door lock audit.”
      </>
    ),
    missingQuestion:
      "Did Security confirm whether the guest room door latched fully at 5:00 PM, and was a police non-emergency file number provided?",
    finalReport:
      "At 18:25, registered guest Marcus Vance (Room 614) contacted the Front Desk to report a work MacBook Pro missing from his room desk upon returning from dinner (absent approximately 17:00 to 18:20). Front Desk dispatched Security to conduct an electronic Saflok key-card interrogation and inspect the door latch mechanism.",
    checklist: [
      "Time window of absence recorded (17:00 to 18:20)",
      "Missing item description logged",
      "Electronic door lock audit queued with Security",
      "Door latch check & police report number prompted before sign-off",
    ],
  },
  {
    type: "Stalled service elevator",
    badge: "ENGINEERING · TEAM SAFETY",
    time: "2:12 PM",
    rawNote:
      "“Service car 2 stopped between floors 3 and 4 at 2:12 PM with Room Attendant Elena Kowalski inside. Intercom worked the whole time. Chief Engineer Miller reset the car and got the doors open at 2:29 PM. Elena was fine, didn’t need medical, and we locked the elevator out for Otis.”",
    redactedNote: (
      <>
        “Service car 2 stopped between floors 3 and 4 at 2:12 PM with Room Attendant <mark>[STAFF_01]</mark> inside. Intercom worked the whole time. Chief Engineer <mark>[STAFF_02]</mark> reset the car and got the doors open at 2:29 PM. <mark>[STAFF_01]</mark> was fine, didn’t need medical, and we locked the elevator out for Otis.”
      </>
    ),
    missingQuestion:
      "Has the elevator contractor service ticket number been logged before returning the car to service?",
    finalReport:
      "At 14:12, Service Elevator #2 halted between the 3rd and 4th floors with Room Attendant Elena Kowalski aboard. Continuous two-way intercom contact was maintained until Chief Engineer Miller completed a controlled release at 14:29 (17-minute duration). Ms. Kowalski declined medical evaluation, and the elevator was locked out of service pending licensed Otis technician inspection.",
    checklist: [
      "Entrapment duration (17 mins) & continuous intercom contact logged",
      "Team member wellness check & medical refusal recorded",
      "Equipment lockout confirmed by Engineering",
      "Licensed contractor sign-off tracked before return to service",
    ],
  },
];

export default function Experience() {
  const [activeShot, setActiveShot] = useState(0);
  const [screenshotPanMode, setScreenshotPanMode] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [vacation, setVacation] = useState(false);
  const [incidentSample, setIncidentSample] = useState(0);
  const [showPrivacyTokens, setShowPrivacyTokens] = useState(false);

  const currentShot = shiftSteps[activeShot];
  const activeIncident = incidentSamples[incidentSample];

  const prevShot = () =>
    setActiveShot((prev) => (prev - 1 + shiftSteps.length) % shiftSteps.length);
  const nextShot = () =>
    setActiveShot((prev) => (prev + 1) % shiftSteps.length);

  return (
    <main>
      <div className="ambientBg" aria-hidden="true" />

      <nav>
        <a className="brand" href="#top" aria-label="Project TideMark home">
          <Mark />
          <span>Project TideMark</span>
        </a>
        <div className="navLinks">
          <a href="#why-shift">Why OR-Tools</a>
          <a href="#shift-tour">Shift Walkthrough</a>
          <a href="#incident">Incident Reports</a>
          <a href="#builder">About</a>
          <a className="navCta" href="#contact">
            Request early access <span>→</span>
          </a>
        </div>
      </nav>

      {/* MOBILE STICKY BOTTOM DOCK */}
      <div className="mobileNavDock" role="navigation" aria-label="Quick section navigation">
        <a href="#why-shift">Why Shift</a>
        <a href="#shift-tour">Tour</a>
        <a href="#incident">Incident</a>
        <a href="#builder">About</a>
        <a href="#contact" className="dockCta">
          Early Access
        </a>
      </div>

      {/* HERO */}
      <section id="top" className="hero chapter">
        <div className="heroContainer">
          <div className="eyebrow">
            <span /> BUILT BY A BC HOTEL OPERATOR · POWERED BY GOOGLE OR-TOOLS
          </div>
          <h1>
            Stop second-guessing <span className="heroAccent">next week’s schedule.</span>
          </h1>
          <p className="heroLead">
            Every hotel manager knows the stress of staring at a spreadsheet for hours, wondering if moving two more shifts could give someone back-to-back days off without leaving a busy Friday check-in short. Project TideMark is a pair of practical tools built inside hotel operations to take that mental load off your shoulders.
          </p>
          <div className="heroActions">
            <a className="primary" href="#why-shift">
              See how TideMark Shift works <span>↓</span>
            </a>
            <a className="secondaryBtn" href="#incident">
              See TideMark Incident <span>↓</span>
            </a>
          </div>

          {/* TWO SIMPLE PILLARS RIGHT IN THE HERO */}
          <div className="productBranches heroBranches">
            <a href="#why-shift" className="branchCard">
              <div className="branchTop">
                <span className="branchTag">01 · TIDEMARK SHIFT</span>
                <span className="branchStatus">Google OR-Tools Scheduling</span>
              </div>
              <b>The best mathematical schedule in seconds</b>
              <p>
                Instead of shuffling shifts in your head, Shift uses Google OR-Tools to test thousands of combinations at once. It covers your busiest arrival days and overnight rest rules while maximizing team preferences, consecutive days off, and fairness.
              </p>
              <em>EXPLORE SHIFT & REAL SCREENSHOTS ↓</em>
            </a>

            <a href="#incident" className="branchCard incident">
              <div className="branchTop">
                <span className="branchTag">02 · TIDEMARK INCIDENT</span>
                <span className="branchStatus">Private Incident Reporting</span>
              </div>
              <b>Rough shift notes to finished reports in 2 minutes</b>
              <p>
                Instead of writing an 11 PM incident report in a blank Word file, type a quick note or voice memo. Incident asks the follow-up question you might forget and hides guest names on your computer before AI formats the report.
              </p>
              <em>EXPLORE INCIDENT REPORTING ↓</em>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 01: THE REAL PAIN OF MANUAL SCHEDULING VS GOOGLE OR-TOOLS */}
      <section id="why-shift" className="branch chapter">
        <div className="sectionHeader">
          <span className="index">TIDEMARK SHIFT · WHY MATHEMATICAL SCHEDULING MATTERS</span>
          <h2>The hardest part of scheduling isn’t filling boxes. It’s wondering if you missed a better combination.</h2>
          <p>
            When you build a schedule by hand, you can hold three or four shift swaps in your head before everything starts colliding. TideMark Shift hands that puzzle to <strong>Google OR-Tools</strong>, the same mathematical optimization engine used to schedule airline crews, so you get a calm, provably fair week in seconds.
          </p>
        </div>

        <div className="comparisonColumns">
          <div className="compareBox manualBox">
            <span className="compareLabel">BUILDING THE SCHEDULE BY HAND</span>
            <h3>2 hours of mental gymnastics and guilt</h3>
            <ul className="compareList">
              <li>
                <strong>The domino effect:</strong> You move one shift so someone can have Saturday off, and suddenly Friday evening is short or someone has a graveyard-to-morning turnaround.
              </li>
              <li>
                <strong>Split days off:</strong> Because it is too hard to untangle the whole grid, people end up with Tuesday and Friday off instead of two real days off in a row to rest.
              </li>
              <li>
                <strong>Constant second-guessing:</strong> Even after you publish the schedule, you wonder if a cleverer shuffle could have made the team happier or distributed weekend shifts more fairly.
              </li>
            </ul>
          </div>

          <div className="compareBox solverBox">
            <span className="compareLabel">BUILDING WITH GOOGLE OR-TOOLS IN SHIFT</span>
            <h3>Thousands of combinations tested in one click</h3>
            <ul className="compareList">
              <li>
                <strong>Business coverage locked first:</strong> Daily hotel arrivals, role qualifications, trainer pairings, and 32-hour rest rules are treated as unbreakable boundaries.
              </li>
              <li>
                <strong>Maximizes team happiness automatically:</strong> Within those boundaries, the math engine scores thousands of schedules to maximize preferred shifts, back-to-back days off, and 8-week fairness.
              </li>
              <li>
                <strong>Complete peace of mind:</strong> You know the schedule on your screen is the strongest combination possible. If a request cannot fit, Shift shows you the exact reason why.
              </li>
            </ul>
          </div>
        </div>

        {/* REAL ANONYMIZED PRODUCTION METRICS FROM LIVE HOTEL DEPLOYMENT */}
        <div className="liveProofPanel">
          <div className="liveProofHeader">
            <div>
              <span className="liveProofBadge">
                <i /> REAL PRODUCTION DATA · ACTIVE BC HOTEL DEPLOYMENT
              </span>
              <h3>What happens when Google OR-Tools runs a real 42-person hotel roster</h3>
            </div>
            <p>
              Anonymized live metrics from an active coastal hotel running TideMark Shift across 3 departments, 23 roles, 90.0% average occupancy, and up to 277 daily arrivals and departures.
            </p>
          </div>

          <div className="liveProofGrid">
            <div className="liveProofStat">
              <small>BACK-TO-BACK DAYS OFF</small>
              <strong>97.5%</strong>
              <span>Up from 74.0% baseline</span>
              <p>
                Across 689 employee-weeks (24,128 scheduled hours), the Strong Consecutive Breaks solver grouped single days off into real two-day breaks 97.5% of the time.
              </p>
            </div>

            <div className="liveProofStat">
              <small>REQUESTS APPROVED</small>
              <strong>95.8%</strong>
              <span>183 of 191 requests</span>
              <p>
                Real team vacation, lieu day, and shift requests honoured without leaving busy check-in waves short, including 111 of 112 preferred days off (99.1%).
              </p>
            </div>

            <div className="liveProofStat">
              <small>AVERAGE SOLVE TIME</small>
              <strong>4.2 sec</strong>
              <span>101 full-schedule builds</span>
              <p>
                Generates and compares four complete schedule strategies in seconds while cutting rough evening-to-morning turnarounds by 47%.
              </p>
            </div>

            <div className="liveProofStat">
              <small>PUBLISHED SATISFACTION</small>
              <strong>96.7%</strong>
              <span>27 published weeks</span>
              <p>
                Average team preference and fairness score across 27 published weekly schedules and 15,900+ logged scheduling events.
              </p>
            </div>
          </div>
        </div>

        <div className="mobileSwipeHint" aria-hidden="true">
          <span>⇄ Swipe cards to see what Google OR-Tools balances</span>
        </div>

        <div className="failureGrid shiftCapabilitiesGrid">
          <div className="failureCard shiftCapCard">
            <span className="failureIndex">WHAT THE SOLVER PROTECTS · 01</span>
            <b>More back-to-back days off, zero clopens</b>
            <p>
              Working five days with split single days off wears hotel teams down. Shift actively searches for combinations that group days off together into real two-day breaks and blocks exhausting Graveyard-to-Morning turnarounds.
            </p>
          </div>
          <div className="failureCard shiftCapCard">
            <span className="failureIndex">WHAT THE SOLVER PROTECTS · 02</span>
            <b>Fairness across the whole team over 8 weeks</b>
            <p>
              It is easy to accidentally give your most flexible employee all the tough shifts. Shift tracks 8 weeks of schedule history so weekend work, evening shifts, and consecutive breaks stay balanced across everyone.
            </p>
          </div>
          <div className="failureCard shiftCapCard">
            <span className="failureIndex">WHAT THE SOLVER PROTECTS · 03</span>
            <b>Busy check-in waves are never left short</b>
            <p>
              When Friday climbs to 160 arrivals, Shift automatically raises midday Front Desk and Bell coverage targets first, then builds the happiest possible team schedule around that busy-day demand.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 02: LIVE APPLICATION WALKTHROUGH (REAL SCREENSHOTS) */}
      <section id="shift-tour" className="product chapter shiftProduct">
        <div className="productIntro">
          <span className="index">INSIDE TIDEMARK SHIFT · REAL APPLICATION TOUR</span>
          <h2>See how a week comes together in five simple steps</h2>
          <p>
            Click through the real TideMark Shift screens below (seeded with fictional demo team members). You can tap any screenshot to inspect it full screen.
          </p>
        </div>

        <div className="screenshotShowcase glass">
          <div className="showcaseTop">
            <div>
              <Mark /> TideMark <b>Shift · Real Application Screens</b>
            </div>
            <span>Fictional demo dataset · Zero real hotel or employee data</span>
            <em>GOOGLE OR-TOOLS ENGINE</em>
          </div>

          <div className="showcaseTabs" role="tablist" aria-label="Select Shift workflow step">
            {shiftSteps.map((shot, idx) => (
              <button
                key={shot.id}
                type="button"
                role="tab"
                aria-selected={activeShot === idx}
                className={activeShot === idx ? "active" : ""}
                onClick={() => setActiveShot(idx)}
              >
                {shot.tab}
              </button>
            ))}
          </div>

          <div className="showcaseViewportBar">
            <div className="showcaseStepNav">
              <button type="button" onClick={prevShot} aria-label="Previous step">
                ←
              </button>
              <span>
                {currentShot.stepNumber} of {shiftSteps.length}
              </span>
              <button type="button" onClick={nextShot} aria-label="Next step">
                →
              </button>
            </div>
            <div className="showcaseZoomActions">
              <button
                type="button"
                className={`panToggleBtn ${screenshotPanMode ? "active" : ""}`}
                onClick={() => setScreenshotPanMode(!screenshotPanMode)}
              >
                {screenshotPanMode ? "⊡ Fit width" : "⇄ Pan HD"}
              </button>
              <button
                type="button"
                className="expandLightboxBtn"
                onClick={() => setLightboxOpen(true)}
              >
                ⛶ Inspect
              </button>
            </div>
          </div>

          <div className={`showcaseFrame ${screenshotPanMode ? "panMode" : ""}`}>
            <img
              src={currentShot.src}
              alt={currentShot.alt}
              loading="lazy"
              onClick={() => setLightboxOpen(true)}
            />
            {screenshotPanMode ? (
              <div className="panHintBanner">
                ⇄ Swipe horizontally to inspect full-resolution interface details
              </div>
            ) : null}
          </div>

          <div className="showcaseFooter">
            <div className="showcaseCopy">
              <small>{currentShot.badge}</small>
              <h3>{currentShot.title}</h3>
              <p>{currentShot.caption}</p>
            </div>
            <ul className="showcaseBullets">
              {currentShot.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* SIMPLE INTERACTIVE DEMO: TESTING A LAST-MINUTE VACATION REQUEST */}
        <div className="controlIntro">
          <span className="index">TRY IT YOURSELF · INTERACTIVE SCHEDULE PREVIEW</span>
          <h3>What happens when Harper asks for Friday off?</h3>
          <p>
            Normally, a Friday vacation request means erasing half your schedule. Click the button below to see how Shift keeps locked shifts in place, protects everyone else’s consecutive days off, and shows you the exact impact before you approve it.
          </p>
        </div>

        <div className="roster glass">
          <div className="rosterTop">
            <div>
              <Mark /> TideMark <b>Shift · Impact Preview</b>
            </div>
            <span>Front Desk · Oct 11 to Oct 17</span>
            <button
              type="button"
              className="actionToggleBtn"
              onClick={() => setVacation(!vacation)}
            >
              {vacation
                ? "↺ Back to original schedule"
                : "⚡ Test giving Harper Lin Friday off"}
            </button>
          </div>

          <div className={`rosterNotice ${vacation ? "warning" : ""}`}>
            <span>{vacation ? "IF YOU APPROVE HARPER'S REQUEST" : "BASELINE OPTIMIZED SCHEDULE"}</span>
            <p>
              {vacation
                ? "Shift moves Oliver Wong to cover Harper’s busy Friday PM check-in shift while keeping Oliver’s Tue-Wed consecutive days off intact. It flags 1 open Thursday PM shift so you can decide before approving."
                : "Every shift is covered. All four team members have consecutive days off, trainer and Night Audit shifts are locked, and zero turnaround rules are broken."}
            </p>
            <em>{vacation ? "1 THU PM SHIFT NEEDS COVERAGE" : "100% COVERED · 4/4 CONSECUTIVE BREAKS"}</em>
          </div>

          <div className="rosterGrid">
            <div className="row head">
              <b>TEAM MEMBER & SOLVER RESULT</b>
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <b key={d}>{d}</b>
              ))}
            </div>
            {roster.map((person, ri) => (
              <div className="row" key={person.name}>
                <span className="staffCell">
                  <strong>{person.name}</strong>
                  <small>{vacation ? person.vacationNote : person.baselineNote}</small>
                </span>
                {person.shifts.map((shift, ci) => {
                  const isHarperFriday = vacation && ri === 0 && ci === 5;
                  const isOliverThursday = vacation && ri === 1 && ci === 4;
                  const isOliverFriday = vacation && ri === 1 && ci === 5;
                  const isPinned = person.pinCol === ci;
                  const displayShift = isHarperFriday
                    ? "VAC"
                    : isOliverThursday
                    ? "OPEN ⚠"
                    : isOliverFriday
                    ? "PM"
                    : shift;

                  const isOff =
                    displayShift === "OFF" ||
                    displayShift === "VAC" ||
                    displayShift === "REQ OFF";

                  return (
                    <span
                      key={ci}
                      title={isPinned ? person.pinReason : undefined}
                      className={[
                        !isOff ? "assigned" : "offShift",
                        isHarperFriday ? "changed" : "",
                        isOliverThursday ? "moved" : "",
                        isOliverFriday ? "changed" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {displayShift}
                      {isPinned ? <i title={person.pinReason}>⌁ Kept</i> : null}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          {/* PURPOSE-BUILT MOBILE 7-DAY SCHEDULE CARDS */}
          <div className="mobileRosterCards">
            {roster.map((person, ri) => (
              <div className="mobileStaffCard" key={person.name}>
                <div className="mobileStaffHeader">
                  <div>
                    <strong>{person.name}</strong>
                    <small>{vacation ? person.vacationNote : person.baselineNote}</small>
                  </div>
                  {person.pinCol >= 0 ? (
                    <span className="mobilePinBadge">⌁ Kept shift</span>
                  ) : null}
                </div>
                <div className="mobileWeekStrip">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((dayLabel, ci) => {
                    const shift = person.shifts[ci];
                    const isHarperFriday = vacation && ri === 0 && ci === 5;
                    const isOliverThursday = vacation && ri === 1 && ci === 4;
                    const isOliverFriday = vacation && ri === 1 && ci === 5;
                    const isPinned = person.pinCol === ci;
                    const displayShift = isHarperFriday
                      ? "VAC"
                      : isOliverThursday
                      ? "OPEN"
                      : isOliverFriday
                      ? "PM"
                      : shift;
                    const isOff =
                      displayShift === "OFF" ||
                      displayShift === "VAC" ||
                      displayShift === "REQ OFF";

                    return (
                      <div
                        key={dayLabel}
                        className={[
                          "mobileDayCell",
                          !isOff ? "assigned" : "offShift",
                          isHarperFriday || isOliverFriday ? "changed" : "",
                          isOliverThursday ? "moved" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <small>{dayLabel}</small>
                        <b>{displayShift}</b>
                        {isPinned ? <i>⌁</i> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="rosterFoot">
            <span>
              ⌁ <strong>Kept assignments</strong> stay locked while Google OR-Tools re-evaluates the rest of the week.
            </span>
            <b>
              Result: <em>{vacation ? "Clear answer in 2 seconds (no guesswork)" : "Optimal week ready to publish"}</em>
            </b>
          </div>
        </div>
      </section>

      {/* SECTION 03: TIDEMARK INCIDENT (SIMPLIFIED & CRYSTAL CLEAR) */}
      <section id="incident" className="incidentProduct chapter">
        <div className="productIntro">
          <div className="productLabelRow">
            <span className="productNumber purple">02</span>
            <span className="index">TIDEMARK INCIDENT · FAST, PRIVATE INCIDENT REPORTS</span>
          </div>
          <h2>Turn a quick shift note into a complete incident report in two minutes</h2>
          <p>
            After a busy shift, nobody wants to stare at a blank Word document trying to sound formal. TideMark Incident takes a quick note or voice memo, asks the one follow-up question you might forget, and formats a clean report while keeping guest names and room numbers private on your own computer.
          </p>
        </div>

        <div className="mobileSwipeHint purpleHint" aria-hidden="true">
          <span>⇄ Swipe cards to see how Incident protects your property</span>
        </div>

        <div className="failureGrid">
          <div className="failureCard">
            <span className="failureIndex">1. ASKS WHAT YOU MIGHT FORGET</span>
            <b>Prompts the right follow-up question while details are fresh</b>
            <p>
              A slip by the pool and a missing laptop in Room 614 need completely different facts. Incident checks your note and asks for missing details (like whether a wet-floor sign was out) before you go home.
            </p>
          </div>
          <div className="failureCard">
            <span className="failureIndex">2. GUEST PRIVACY STAYS ON PROPERTY</span>
            <b>Guest names and room numbers never go to public AI</b>
            <p>
              Pasting guest names into public AI tools is a privacy risk. TideMark automatically swaps names and room numbers with private placeholders on your computer before AI formats the writing, then restores them locally.
            </p>
          </div>
          <div className="failureCard">
            <span className="failureIndex">3. ZERO INVENTED OR DROPPED FACTS</span>
            <b>Checks the finished report against your original note</b>
            <p>
              AI is only used to organize the writing, never to make up details. TideMark double-checks that every fact from your note (like a guest declining an ambulance) stays in the final PDF or Word report.
            </p>
          </div>
        </div>

        {/* ONE UNIFIED BEFORE-AND-AFTER INTERACTIVE DEMO */}
        <div className="workspaceControls">
          <div className="controlGroup">
            <span className="controlLabel">CHOOSE A REAL HOTEL SCENARIO:</span>
            <div className="sampleTabs">
              {incidentSamples.map((s, i) => (
                <button
                  key={s.type}
                  type="button"
                  className={incidentSample === i ? "active" : ""}
                  onClick={() => setIncidentSample(i)}
                >
                  {s.type}
                </button>
              ))}
            </div>
          </div>

          <div className="controlGroup">
            <span className="controlLabel">PRIVACY VIEW:</span>
            <div className="privacyToggle">
              <button
                type="button"
                className={!showPrivacyTokens ? "active" : ""}
                onClick={() => setShowPrivacyTokens(false)}
              >
                What you see on property
              </button>
              <button
                type="button"
                className={showPrivacyTokens ? "active" : ""}
                onClick={() => setShowPrivacyTokens(true)}
              >
                What AI sees (names hidden)
              </button>
            </div>
          </div>
        </div>

        <div className="captureFlow glass">
          <div className="captureHead">
            <div>
              <Mark /> TideMark <b>Incident · Before & After</b>
            </div>
            <span>{activeIncident.badge} · {activeIncident.time}</span>
            <em>ON-DEVICE PRIVACY ACTIVE</em>
          </div>

          <div className="incidentSimpleGrid">
            <div className="incidentColumn rawNoteCol">
              <small>
                1. WHAT YOU TYPE OR SAY ON SHIFT{" "}
                {showPrivacyTokens ? "(NAMES HIDDEN BEFORE AI)" : "(YOUR ROUGH NOTE)"}
              </small>
              <div className="deviceBoundary">
                <p>
                  {showPrivacyTokens
                    ? activeIncident.redactedNote
                    : activeIncident.rawNote}
                </p>
                <span>
                  {showPrivacyTokens
                    ? "Guest names, staff names, and room numbers are replaced on your computer before AI touches the text."
                    : "Click 'What AI sees (names hidden)' above to see how guest privacy is protected automatically."}
                </span>
              </div>

              <div className="fact missing">
                <i />
                <span>2. THE FOLLOW-UP QUESTION TIDEMARK ASKS YOU</span>
                <b>{activeIncident.missingQuestion}</b>
              </div>
            </div>

            <div className="incidentColumn finalReportCol">
              <small>3. THE FINISHED REPORT READY FOR GM & INSURER</small>
              <div className="finalNarrativeCard">
                <p>{activeIncident.finalReport}</p>
                <div className="accountMeta">
                  <span>Export to Word (.docx) or PDF</span>
                  <span>Saved in searchable local archive</span>
                </div>
              </div>

              <div className="structuredRecord compactChecklist">
                <small>VERIFIED BEFORE SIGN-OFF</small>
                {activeIncident.checklist.map((item) => (
                  <div key={item}>
                    <span>✓ {item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BUILDER NOTE */}
      <section id="builder" className="builder chapter">
        <div className="builderCard glass">
          <div>
            <span className="index">BUILT BY AN OPERATOR</span>
            <h2>Why I built Project TideMark</h2>
          </div>
          <div className="builderNote">
            <p>
              I work in hotel operations in British Columbia. When I was building weekly schedules by hand, the hardest part was the constant stress of wondering if I had found the best combination: could I move a few shifts around to give one more person two days off in a row, avoid a rough turnaround, and keep the team happy while still covering a busy check-in day?
            </p>
            <p>
              I built <strong>TideMark Shift</strong> with Google OR-Tools so the computer does those thousands of shuffles for you in seconds, and I built <strong>TideMark Incident</strong> so managers can turn rough shift notes into complete, private incident reports before heading home.
            </p>
            <div className="builderIdentity">
              <span>OG</span>
              <div>
                <b>Oguzhan Gur</b>
                <small>Hospitality Operations · Creator of Project TideMark · British Columbia, Canada</small>
              </div>
            </div>
            <a
              href="https://www.linkedin.com/in/oguzhangur"
              target="_blank"
              rel="noreferrer"
            >
              Connect on LinkedIn <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT / EARLY ACCESS */}
      <section id="contact" className="final chapter">
        <div className="halo" aria-hidden="true" />
        <Mark large />
        <span className="index">EARLY ACCESS & HOTEL PILOTS</span>
        <h2>Try TideMark at your property</h2>
        <p>
          If you manage a hotel team and want to see how Shift handles your weekly schedule or how Incident works at the desk, send a quick note below and I will personally help you try it.
        </p>

        <form
          className="accessForm"
          action="https://formspree.io/f/xlgadqyd"
          method="POST"
        >
          <input
            type="hidden"
            name="_subject"
            value="Project TideMark early access request"
          />
          <label>
            <span>Your name</span>
            <input name="name" autoComplete="name" required placeholder="Alex Rivera" />
          </label>
          <label>
            <span>Work email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="alex@harbourhotel.com"
            />
          </label>
          <label>
            <span>Your role</span>
            <select name="interest" defaultValue="Front Office / Operations Manager">
              <option>Front Office / Operations Manager</option>
              <option>Hotel General Manager</option>
              <option>Housekeeping / F&B Manager</option>
              <option>Security / Risk Lead</option>
              <option>Hospitality Technologist / Other</option>
            </select>
          </label>
          <label className="wide">
            <span>What would you like to test first?</span>
            <textarea
              name="setup_goal"
              rows={3}
              placeholder="Tell me a little about your team size or what takes the most time in your weekly scheduling or incident reporting."
            />
          </label>
          <button type="submit">
            Request early access <span>→</span>
          </button>
        </form>
        <small className="formNote">
          Direct reply from Oguzhan · No sales calls or automated marketing emails
        </small>
      </section>

      <footer>
        <div className="brand">
          <Mark />
          <span>Project TideMark</span>
        </div>
        <span>Built by Oguzhan Gur in British Columbia · Open-source hospitality software</span>
        <a
          href="https://www.linkedin.com/in/oguzhangur"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn ↗
        </a>
      </footer>

      {lightboxOpen ? (
        <div
          className="lightboxOverlay"
          role="dialog"
          aria-modal="true"
          aria-label={currentShot.title}
          onClick={() => setLightboxOpen(false)}
        >
          <div className="lightboxDialog" onClick={(e) => e.stopPropagation()}>
            <div className="lightboxHeader">
              <div>
                <small>{currentShot.badge}</small>
                <strong>{currentShot.title}</strong>
              </div>
              <div className="lightboxActions">
                <button type="button" onClick={prevShot}>
                  ← Prev
                </button>
                <span>
                  {currentShot.stepNumber} of {shiftSteps.length}
                </span>
                <button type="button" onClick={nextShot}>
                  Next →
                </button>
                <button
                  type="button"
                  className="lightboxClose"
                  onClick={() => setLightboxOpen(false)}
                  aria-label="Close fullscreen preview"
                >
                  ✕ Close
                </button>
              </div>
            </div>
            <div className="lightboxBody">
              <img src={currentShot.src} alt={currentShot.alt} />
            </div>
            <div className="lightboxFoot">
              <span>⇄ Drag or pinch to inspect full-resolution interface</span>
              <span>Fictional demo dataset · Zero real hotel data</span>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
