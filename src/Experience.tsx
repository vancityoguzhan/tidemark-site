"use client";

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

const shiftScreenshots = [
  {
    id: "overview",
    tab: "01 · Week at a glance & forecast",
    badge: "SCHEDULE · HOTEL ACTIVITY",
    title: "Daily arrivals, departures, and occupancy drive the week’s coverage",
    caption:
      "The top command band pairs the weekly Shift Brief (coverage gaps, tradeoffs, pending requests, and peak pressure day) with the 7-day Hotel Activity forecast strip and one-click schedule actions.",
    src: "/screenshots/shift-schedule-overview.png",
    alt: "TideMark Shift schedule overview showing Week at a glance, 7-day Hotel Activity forecast, and schedule controls",
    highlights: [
      "7-day Hotel Activity strip with arrivals, departures, occupancy %, and pressure badges",
      "Day status filters for Off, Requested Off, Vacation, Lieu, Extra Day Off, and Sick",
      "Compare options, Preview Changes, Plan Training, and 1–4 week build controls",
    ],
  },
  {
    id: "grid",
    tab: "02 · Weekly schedule grid",
    badge: "SCHEDULE · TEAM ASSIGNMENTS",
    title: "Role-qualified assignments with kept shifts and turnaround rest verified",
    caption:
      "Every cell shows the shift window, assigned role badge (DOO, FOM, AFO, DM, Concierge, FD/CC, Bell, Night Audit), and rest compliance—using fictional demo team members.",
    src: "/screenshots/shift-roster-grid.png",
    alt: "TideMark Shift weekly schedule grid showing fictional demo team members and colour-coded shift pills",
    highlights: [
      "Clear role key across Management, Front Desk / Command Centre, Bell, and Night Audit",
      "Keep assignment or Keep day off on any cell before rebuilding the week",
      " Enforces BC labour rules: 32-hour consecutive rest and no Graveyard-to-Morning clopens",
    ],
  },
  {
    id: "rules",
    tab: "03 · Staffing rules & needs",
    badge: "STAFFING GUIDE · DYNAMIC RULES",
    title: "Approved staffing rules adjust shifts automatically when hotel activity spikes",
    caption:
      "Instead of editing baseline targets every time occupancy climbs, approved staffing rules add MID desk coverage, trigger peak-departure bell shifts, or bridge duty manager gaps automatically.",
    src: "/screenshots/shift-staffing-needs.png",
    alt: "TideMark Shift Staffing Needs and Staffing Rules tab showing approved hotel-activity rules",
    highlights: [
      "High Demand – Front Desk MID when arrivals + departures exceed 150",
      "MID FD/CC Evening Support Bridge and Manager Gap Bridge rules",
      "Draft new rules in plain language or toggle between baseline and adjusted staffing needs",
    ],
  },
  {
    id: "leave",
    tab: "04 · Leave planner",
    badge: "ROOM TO SAY YES · LEAVE PLANNER",
    title: "Test proposed vacation and overlapping pending requests before making a promise",
    caption:
      "Managers can maintain isolated ongoing planning availability for their team and test up to 12 proposed absences together across an 8-week horizon without changing the live schedule.",
    src: "/screenshots/shift-leave-planner.png",
    alt: "TideMark Shift Leave Planner showing isolated planning availability and multi-absence coverage check",
    highlights: [
      "Separate Planning Team baseline availability and one-week exceptions",
      "Tests proposed leave alongside overlapping pending and approved requests",
      "Distinguishes core guest-facing coverage gaps from sacrificable admin hours",
    ],
  },
  {
    id: "requests",
    tab: "05 · Time off & preferences",
    badge: "REQUESTS · IMPACT PREVIEW",
    title: "Calendar and stream views for vacation, preferred days off, and shift swaps",
    caption:
      "Track pending, approved, and declined requests across the month, scan paper request forms with the camera, or click Check impact to preview coverage before approving.",
    src: "/screenshots/shift-requests-calendar.png",
    alt: "TideMark Shift Time Off and Preferences calendar view with pending and approved team requests",
    highlights: [
      "Monthly request calendar with Pending, Approved, and Declined status indicators",
      "One-click Check impact preview before approving or declining a request",
      "Syncs directly with the employee Team Portal (PIN login & iCal feed) and Scan Form tool",
    ],
  },
];

const weekDemand = [
  {
    day: "SUN",
    date: "Oct 11",
    occ: 62,
    barHeight: 42,
    signal: "120 arrivals · 115 departures · Pressure 74%",
    context: "Steady Sunday turnover; Assistant Front Office Manager and Duty Manager anchor morning desk.",
    tactic: "Base staffing guide · 2 AM FD/CC · 2 PM FD/CC · 1 Night Audit",
    rationale: "Arrivals + departures (235) trigger High Demand Front Desk MID support.",
    coverage: "All core shifts covered · 0 coverage gaps",
  },
  {
    day: "MON",
    date: "Oct 12",
    occ: 71,
    barHeight: 50,
    signal: "95 arrivals · 100 departures · Pressure 63%",
    context: "Lightest turnover day of the week; Maya Patel on approved vacation (Mon–Tue).",
    tactic: "Base staffing guide · Manager Gap Bridge active",
    rationale: "Standard 2 AM / 2 PM Front Desk coverage; full administrative leadership on AM.",
    coverage: "All core shifts covered · Vacation honoured",
  },
  {
    day: "TUE",
    date: "Oct 13",
    occ: 78,
    barHeight: 58,
    signal: "110 arrivals · 90 departures · Pressure 66%",
    context: "Midweek corporate build begins; Concierge (Elena Kowalski) returns from 2-day break.",
    tactic: "Add 1 MID Front Desk / Command Centre shift",
    rationale: "Combined movement (200) exceeds 150 threshold; MID shift bridges 11:00–19:00 window.",
    coverage: "All core shifts covered · 32h rest verified",
  },
  {
    day: "WED",
    date: "Oct 14",
    occ: 83,
    barHeight: 68,
    signal: "140 arrivals · 130 departures · Pressure 86%",
    context: "High midweek check-in and check-out overlap across afternoon arrival wave.",
    tactic: "High Demand – Front Desk MID + Bell MID active",
    rationale: "Arrivals + departures (270) exceed both 150 FD and 170 Bell MID thresholds.",
    coverage: "All core shifts covered · 2 MID shifts added",
  },
  {
    day: "THU",
    date: "Oct 15",
    occ: 81,
    barHeight: 64,
    signal: "105 arrivals · 145 departures · Pressure 77%",
    context: "Heavy morning check-out curve; Oliver Wong on approved preferred day off.",
    tactic: "Peak Departures → Bell MID-10 (10:00–18:30)",
    rationale: "145 departures trigger departure-heavy Bell MID-10 rule for luggage & valet load.",
    coverage: "All core shifts covered · Preferred day off honoured",
  },
  {
    day: "FRI",
    date: "Oct 16",
    occ: 92,
    barHeight: 84,
    signal: "160 arrivals · 100 departures · Pressure 79%",
    context: "Weekend leisure check-in wave; Zoe Marchand on approved extra day off for university exam.",
    tactic: "MID FD/CC Evening Support Bridge active",
    rationale: "160 arrivals trigger MID + EVE desk bridge to keep two-person desk coverage through PM.",
    coverage: "All core shifts covered · Senior lead kept on PM",
  },
  {
    day: "SAT",
    date: "Oct 17",
    occ: 88,
    barHeight: 78,
    signal: "145 arrivals · 165 departures · Pressure 89% (Peak)",
    context: "Peak weekly turnover (310 total movements); weekend leadership covered by Duty Managers.",
    tactic: "High Demand – Front Desk MID + Bell MID + Peak Departures",
    rationale: "Maximum hotel activity day; admin roles off while operational desk & bell are fully staffed.",
    coverage: "All core shifts covered · Ready to publish",
  },
];

const roster = [
  {
    name: "Harper Lin",
    role: "Front Desk / Command Centre",
    shifts: ["OFF", "OFF", "AM", "PM", "PM", "PM", "AM"],
    pinCol: 2,
    pinReason: "Kept assignment: Lead trainer paired with trainee on Tuesday AM",
  },
  {
    name: "Oliver Wong",
    role: "Front Desk / Command Centre",
    shifts: ["PM", "PM", "AM", "OFF", "REQ OFF", "AM", "PM"],
    pinCol: -1,
    pinReason: "",
  },
  {
    name: "Maya Patel",
    role: "Front Desk / Command Centre",
    shifts: ["AM", "VAC", "VAC", "AM", "AM", "OFF", "OFF"],
    pinCol: -1,
    pinReason: "",
  },
  {
    name: "Tariq Hassan",
    role: "Night Supervisor · Audit",
    shifts: ["GY", "GY", "GY", "OFF", "OFF", "GY", "GY"],
    pinCol: 5,
    pinReason: "Kept assignment: Anchors Friday & Saturday overnight audit desk",
  },
];

const incidentSamples = [
  {
    type: "Guest slip & fall",
    badge: "LIFE SAFETY · POOL DECK",
    time: "21:40",
    accounts: {
      note: "Guest Jane Smith in Room 814 slipped near the pool entrance at 21:40. Security Officer Patel attended and took three photos of the tile. She declined an ambulance and returned to her room.",
      voice: "“Hey, logging a slip by the indoor pool door around 9:40 PM—Jane Smith from 814. Floor had some standing water by the towel bin. Patel came down, snapped photos, she said she didn’t want EMS.”",
      handoff: "PM → GY Handoff: Rm 814 (J. Smith) slipped at pool entry 21:40. Security on scene, photos saved. Refused medical. Engineering notified to check mat/drain.",
    },
    response: "Security attended · 3 scene photos captured",
    peopleClarification: "Jane Smith (Registered Guest, Rm 814) · Officer Patel (Security)",
    question: "Was a wet-floor sign posted prior to 21:40, and how was the surface dried or cordoned off?",
    track: [
      { name: "Injury & body area reported", status: "Captured" },
      { name: "EMS / medical assistance refusal", status: "Captured" },
      { name: "Photographic & CCTV preservation", status: "Captured" },
      { name: "Floor surface & signage condition", status: "Follow-up required" },
    ],
    managerView: (
      <>
        Guest <mark>Jane Smith</mark> in <mark>Room 814</mark> slipped near the pool entrance at 21:40. Security Officer <mark>Patel</mark> attended and took photos.
      </>
    ),
    redactedView: (
      <>
        Guest <mark>[GUEST_01]</mark> in <mark>[ROOM_01]</mark> slipped near the pool entrance at 21:40. Security Officer <mark>[STAFF_01]</mark> attended and took photos.
      </>
    ),
  },
  {
    type: "In-room theft report",
    badge: "SECURITY · GUEST ROOM",
    time: "18:25",
    accounts: {
      note: "Guest Marcus Vance in Room 614 reported a work laptop missing after returning from dinner at 18:25. Security was notified and a Saflok key-card interrogation was requested.",
      voice: "“Marcus Vance in 614 just called the desk at 6:25 PM saying his MacBook Pro is gone from the desk. He left around 5:00. I paged Security to pull the door lock audit.”",
      handoff: "Rm 614 (M. Vance) reported missing laptop at 18:25. Security pulling Saflok audit log. Guest asking for police non-emergency report number.",
    },
    response: "Security dispatched · Electronic lock audit queued",
    peopleClarification: "Marcus Vance (Registered Guest, Rm 614) · Duty Manager on shift",
    question: "Did the door latch properly on exit, and has a police file number been recorded?",
    track: [
      { name: "Missing item description & serial/value", status: "Captured" },
      { name: "Electronic lock audit (Saflok/VingCard)", status: "Captured" },
      { name: "Corridor & elevator CCTV window", status: "Captured" },
      { name: "Door latch inspection & police file #", status: "Follow-up required" },
    ],
    managerView: (
      <>
        Guest <mark>Marcus Vance</mark> in <mark>Room 614</mark> reported a missing laptop at 18:25. Security pulled the lock audit for <mark>Room 614</mark>.
      </>
    ),
    redactedView: (
      <>
        Guest <mark>[GUEST_01]</mark> in <mark>[ROOM_01]</mark> reported a missing laptop at 18:25. Security pulled the lock audit for <mark>[ROOM_01]</mark>.
      </>
    ),
  },
  {
    type: "Elevator entrapment",
    badge: "ENGINEERING · LIFE SAFETY",
    time: "14:12",
    accounts: {
      note: "Service elevator #2 stopped between floors 3 and 4 at 14:12 with Room Attendant Elena Kowalski inside. Chief Engineer Miller reset the car by 14:29; Elena declined medical evaluation.",
      voice: "“Service car 2 faulted between 3 and 4 at 2:12 PM with Elena from housekeeping inside. Intercom stayed live. Miller got the doors open at 2:29 PM. She’s okay, declined medical.”",
      handoff: "14:12 Service Elevator #2 entrapment (17 mins) — Team member E. Kowalski. Released 14:29 by Engineering. Car locked out pending Otis technician inspection.",
    },
    response: "Intercom maintained · Released in 17m · Car locked out",
    peopleClarification: "Elena Kowalski (Team Member) · D. Miller (Chief Engineer)",
    question: "Was the elevator locked out of service pending licensed contractor sign-off?",
    track: [
      { name: "Entrapment duration & intercom contact", status: "Captured" },
      { name: "Team member wellness & medical refusal", status: "Captured" },
      { name: "Extraction method & witness log", status: "Captured" },
      { name: "Contractor lockout & return-to-service authorization", status: "Follow-up required" },
    ],
    managerView: (
      <>
        Service elevator stopped at 14:12 with <mark>Elena Kowalski</mark> inside. Chief Engineer <mark>Miller</mark> completed release at 14:29.
      </>
    ),
    redactedView: (
      <>
        Service elevator stopped at 14:12 with <mark>[STAFF_01]</mark> inside. Chief Engineer <mark>[STAFF_02]</mark> completed release at 14:29.
      </>
    ),
  },
];

const archiveRecords = [
  { id: "TM-2026-041", title: "Guest slip & fall · Indoor pool entrance", category: "Safety", date: "Jul 09, 2026", status: "SHA-256 verified", format: "PDF · DOCX" },
  { id: "TM-2026-038", title: "In-room property loss · Room 614 lock audit", category: "Security", date: "Jul 02, 2026", status: "SHA-256 verified", format: "PDF · DOCX" },
  { id: "TM-2026-029", title: "Service elevator #2 stoppage · Floor 3/4", category: "Engineering", date: "Jun 24, 2026", status: "SHA-256 verified", format: "PDF · DOCX" },
  { id: "TM-2026-019", title: "Pool deck glass breakage & area closure", category: "Safety", date: "Jun 11, 2026", status: "SHA-256 verified", format: "PDF · DOCX" },
  { id: "TM-2026-012", title: "After-hours noise complaint & room relocation", category: "Security", date: "May 29, 2026", status: "SHA-256 verified", format: "PDF · DOCX" },
];

export default function Experience() {
  const [activeShot, setActiveShot] = useState(0);
  const [day, setDay] = useState(5);
  const [vacation, setVacation] = useState(false);
  const [incidentSample, setIncidentSample] = useState(0);
  const [intakeMode, setIntakeMode] = useState<"note" | "voice" | "handoff">("note");
  const [privacyView, setPrivacyView] = useState<"manager" | "processing">("manager");
  const [auditDiscrepancy, setAuditDiscrepancy] = useState(false);
  const [archiveQuery, setArchiveQuery] = useState("");
  const [archiveFilter, setArchiveFilter] = useState<"All" | "Safety" | "Security" | "Engineering">("All");

  const currentShot = shiftScreenshots[activeShot];
  const activeDemand = weekDemand[day];
  const activeIncident = incidentSamples[incidentSample];

  const filteredArchive = archiveRecords.filter((rec) => {
    const matchesCategory = archiveFilter === "All" || rec.category === archiveFilter;
    const q = archiveQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      rec.title.toLowerCase().includes(q) ||
      rec.id.toLowerCase().includes(q) ||
      rec.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <main>
      <div className="ambientBg" aria-hidden="true" />

      <nav>
        <a className="brand" href="#top" aria-label="Project TideMark home">
          <Mark />
          <span>Project TideMark</span>
        </a>
        <div className="navLinks">
          <a href="#overview">Overview</a>
          <a href="#shift">Shift</a>
          <a href="#incident">Incident</a>
          <a href="#builder">About</a>
          <a className="navCta" href="#contact">
            Request early access <span>→</span>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" className="hero chapter">
        <div className="heroContainer">
          <div className="eyebrow">
            <span /> OPEN-SOURCE HOTEL OPERATIONS SOFTWARE · BRITISH COLUMBIA
          </div>
          <h1>
            Built for the two hardest workflows{" "}
            <span className="heroAccent">at the front desk.</span>
          </h1>
          <p className="heroLead">
            Hotels have enterprise software for reservations and accounting, yet managers still build weekly schedules in spreadsheets and write incident reports in blank Word files. Project TideMark is a pair of focused tools built inside hotel operations to fix both.
          </p>
          <div className="heroActions">
            <a className="primary" href="#shift">
              Explore TideMark Shift <span>↓</span>
            </a>
            <a className="secondaryBtn" href="#incident">
              Explore TideMark Incident <span>↓</span>
            </a>
          </div>

          <div className="heroMetaStrip">
            <div>
              <strong>01 · TideMark Shift (v5.5)</strong>
              <span>Hotel-activity scheduling, 3-policy option comparison, and leave planning</span>
            </div>
            <div>
              <strong>02 · TideMark Incident</strong>
              <span>Guided incident reporting with on-device PII redaction before AI</span>
            </div>
            <div>
              <strong>Built by an Operator</strong>
              <span>Designed on the floor for Front Office Managers, GMs, and Security leads</span>
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW / TWO TOOLS */}
      <section id="overview" className="branch chapter">
        <div className="sectionHeader">
          <span className="index">01 / WHERE OPERATIONS BREAK DOWN</span>
          <h2>Two daily pain points that generic software ignores</h2>
          <p>
            When a property gets busy, mistakes happen in two places: a weekly schedule that didn’t account for a 160-arrival Friday peak or an 11 PM incident report written from half-remembered radio calls. TideMark gives operators dedicated tools for each.
          </p>
        </div>

        <div className="productBranches">
          <a href="#shift" className="branchCard">
            <div className="branchTop">
              <span className="branchTag">MODULE 01 · SCHEDULE & LEAVE PLANNER</span>
              <span className="branchStatus">Live screenshots & demo below</span>
            </div>
            <b>TideMark Shift</b>
            <p>
              Turns daily hotel activity (arrivals, departures, occupancy, groups, and cruise ships), staffing rules, and BC labour rest protections into a weekly schedule you can compare and verify before publishing.
            </p>
            <ul className="branchList">
              <li>Adjusts daily staffing needs automatically from hotel activity rules</li>
              <li>Compares 3 schedule options side-by-side (Protect preferences, Strong consecutive breaks, Minimize disruption)</li>
              <li>Tests proposed vacation and overlapping pending requests in a private Leave Planner</li>
            </ul>
            <em>INSPECT SHIFT WORKFLOW ↓</em>
          </a>

          <a href="#incident" className="branchCard incident">
            <div className="branchTop">
              <span className="branchTag">MODULE 02 · RISK & DOCUMENTATION</span>
              <span className="branchStatus">Interactive demo below</span>
            </div>
            <b>TideMark Incident</b>
            <p>
              Guides managers from a quick voice or text account to a complete, defensible incident report—stripping guest names and room numbers locally on-device before any AI processing.
            </p>
            <ul className="branchList">
              <li>Prompts incident-specific follow-up questions while facts are fresh</li>
              <li>Tokenizes guest & team member PII in local memory before external AI calls</li>
              <li>Audits rewritten narratives against original notes to prevent dropped facts</li>
            </ul>
            <em>INSPECT INCIDENT WORKFLOW ↓</em>
          </a>
        </div>
      </section>

      {/* PRODUCT 01: SHIFT */}
      <section id="shift" className="product chapter shiftProduct">
        <div className="productIntro">
          <div className="productLabelRow">
            <span className="productNumber">01</span>
            <span className="index">TIDEMARK SHIFT · HOTEL SCHEDULING & LEAVE PLANNING</span>
          </div>
          <h2>Build the schedule around real hotel activity, rest rules, and team preferences</h2>
          <p>
            Instead of cross-referencing PMS forecast printouts against sticky notes, Shift connects daily arrivals, departures, and occupancy directly to your staffing rules, enforces BC turnaround and consecutive-break protections, and lets you test changes before publishing.
          </p>
          <div className="pillRow">
            <span>Hotel activity rules</span>
            <span>Compare 3 schedule options</span>
            <span>Leave planner</span>
            <span>Kept assignments</span>
            <span>BC labour compliance</span>
            <span>Team portal & form scan</span>
          </div>
        </div>

        {/* REAL APPLICATION SCREENSHOT SHOWCASE (SEEDED WITH FICTIONAL DEMO DATA) */}
        <div className="screenshotShowcase glass">
          <div className="showcaseTop">
            <div>
              <Mark /> TideMark <b>Shift · Live Application Walkthrough</b>
            </div>
            <span>Seeded with fictional demo dataset · Zero real hotel or team data</span>
            <em>REAL APP INTERFACE</em>
          </div>

          <div className="showcaseTabs" role="tablist" aria-label="Select Shift application screen">
            {shiftScreenshots.map((shot, idx) => (
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

          <div className="showcaseFrame">
            <img
              src={currentShot.src}
              alt={currentShot.alt}
              loading="lazy"
            />
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

        {/* WHAT'S NEW IN SHIFT ARCHITECTURE: 3 CORE CAPABILITIES */}
        <div className="failureGrid shiftCapabilitiesGrid">
          <div className="failureCard shiftCapCard">
            <span className="failureIndex">CAPABILITY 01 · SCHEDULE DECISION WORKSPACE</span>
            <b>Compare 3 verified schedule options side-by-side</b>
            <p>
              Generate three distinct options from the same locked inputs—<strong>Protect preferences</strong>, <strong>Strong consecutive breaks</strong>, and <strong>Minimize disruption</strong>—or ask a deterministic alternative check whether a specific team member can get consecutive days off without weakening coverage.
            </p>
          </div>
          <div className="failureCard shiftCapCard">
            <span className="failureIndex">CAPABILITY 02 · PRIVATE LEAVE PLANNER</span>
            <b>Check an absence before making a promise</b>
            <p>
              Maintain ongoing baseline availability and one-week exceptions separate from live employee records. Test up to 12 proposed absences alongside overlapping pending requests to see whether guest-facing coverage holds before approving leave.
            </p>
          </div>
          <div className="failureCard shiftCapCard">
            <span className="failureIndex">CAPABILITY 03 · MULTI-DEPARTMENT & TEAM PORTAL</span>
            <b>Built for Front Desk, Housekeeping, and Restaurant teams</b>
            <p>
              Supports department-scoped roles, trainee <code>0.5</code> headcount pairing with designated trainers, paper request form scanning via camera, and a self-serve Team Portal with PIN login and live iCalendar shift feeds.
            </p>
          </div>
        </div>

        {/* Interactive Hotel Activity & Staffing Rules Inspector */}
        <div className="shiftFlow glass">
          <div className="flowTop">
            <div>
              <Mark /> TideMark <b>Shift</b>
            </div>
            <span>Week of Oct 11 – Oct 17 · Front Desk</span>
            <em>INTERACTIVE HOTEL ACTIVITY INSPECTOR</em>
          </div>

          <div className="demandPanel">
            <header>
              <div>
                <small>7-DAY HOTEL ACTIVITY & STAFFING RULES</small>
                <b>Select any day to inspect arrivals, departures, and active staffing rules</b>
              </div>
              <span className="interactiveHint">Click a day bar below</span>
            </header>

            <div className="days" role="tablist" aria-label="Select day of week">
              {weekDemand.map((d, i) => (
                <button
                  key={d.day}
                  role="tab"
                  aria-selected={day === i}
                  className={day === i ? "selected" : ""}
                  onClick={() => setDay(i)}
                >
                  <small>{d.day}</small>
                  <span className="dayDate">{d.date}</span>
                  <b>{d.occ}%</b>
                  <i style={{ height: `${d.barHeight}px` }} />
                </button>
              ))}
            </div>
          </div>

          <div className="requirements">
            <div>
              <small>HOTEL ACTIVITY · {activeDemand.day} ({activeDemand.date})</small>
              <b>{activeDemand.signal}</b>
              <p>{activeDemand.context}</p>
            </div>
            <span className="flowArrow" aria-hidden="true">→</span>
            <div>
              <small>ACTIVE STAFFING RULE</small>
              <b>{activeDemand.tactic}</b>
              <p>{activeDemand.rationale}</p>
            </div>
            <span className="flowArrow" aria-hidden="true">→</span>
            <div>
              <small>SCHEDULE STATUS</small>
              <b>{activeDemand.coverage}</b>
              <p>Saved baseline guide stays untouched while rules adjust daily shift targets.</p>
            </div>
          </div>
        </div>

        {/* Constraint Evaluation Sequence */}
        <div className="decisionStack">
          <div className="stackCopy">
            <span className="index">BC LABOUR & HOSPITALITY GUARDRAILS</span>
            <h3>Every protection checked in sequence—no black-box scrambling</h3>
            <p>
              Auto-schedulers fail in hotels when they randomly shuffle steady shifts to close a single coverage gap. Shift enforces hard rest and qualification boundaries first, honours kept assignments, and shows every tradeoff in the Week Review drawer before you publish.
            </p>
          </div>
          <div className="stackVisual">
            {[
              { step: "01", label: "Daily hotel activity & role priority targets (Critical vs Sacrificable)", state: "LOCKED" },
              { step: "02", label: "No Graveyard → Morning/Afternoon turnarounds & 32h consecutive rest", state: "ENFORCED" },
              { step: "03", label: "Primary, secondary & backup role qualifications + trainee pairing", state: "VERIFIED" },
              { step: "04", label: "Approved vacation, lieu days, and requested days off", state: "HONOURED" },
              { step: "05", label: "8-week schedule balance & consecutive-break fairness history", state: "BALANCED" },
              { step: "06", label: "Review before publishing with chosen-draft change detection", state: "READY" },
            ].map((item) => (
              <div key={item.step}>
                <span>{item.step}</span>
                <b>{item.label}</b>
                <em>{item.state}</em>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Schedule Change Preview */}
        <div className="controlIntro">
          <span className="index">PREVIEW CHANGES BEFORE APPROVING</span>
          <h3>Test a time-off request while protecting kept assignments</h3>
          <p>
            Click the button below to preview approving Harper Lin’s Friday vacation request. Shift keeps Tuesday’s trainer assignment and weekend Night Audit locked, moves Oliver Wong to cover Friday PM, and highlights the single Thursday coverage gap.
          </p>
        </div>

        <div className="roster glass">
          <div className="rosterTop">
            <div>
              <Mark /> TideMark <b>Shift</b>
            </div>
            <span>Front Desk · Weekly Schedule Preview</span>
            <button
              type="button"
              className="actionToggleBtn"
              onClick={() => setVacation(!vacation)}
            >
              {vacation ? "↺ Reset to baseline schedule" : "⚡ Preview Harper’s Friday vacation request"}
            </button>
          </div>

          <div className={`rosterNotice ${vacation ? "warning" : ""}`}>
            <span>{vacation ? "PREVIEW CHANGES" : "CURRENT DRAFT"}</span>
            <p>
              {vacation
                ? "Approving Harper Lin’s Friday vacation reassigns Oliver Wong to Friday PM and leaves 1 coverage gap on Thursday PM. Kept assignments remain untouched."
                : "All weekly shifts covered. Overnight turnaround rest, kept assignments, and role qualifications verified."}
            </p>
            <em>{vacation ? "1 COVERAGE GAP FLAGGED" : "0 COVERAGE GAPS"}</em>
          </div>

          <div className="rosterGrid">
            <div className="row head">
              <b>TEAM MEMBER</b>
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <b key={d}>{d}</b>
              ))}
            </div>
            {roster.map((person, ri) => (
              <div className="row" key={person.name}>
                <span className="staffCell">
                  <strong>{person.name}</strong>
                  <small>{person.role}</small>
                </span>
                {person.shifts.map((shift, ci) => {
                  const isHarperFriday = vacation && ri === 0 && ci === 5;
                  const isOliverThursday = vacation && ri === 1 && ci === 3;
                  const isOliverFriday = vacation && ri === 1 && ci === 4;
                  const isPinned = person.pinCol === ci;
                  const displayShift = isHarperFriday
                    ? "VAC"
                    : isOliverThursday
                    ? "GAP ⚠"
                    : isOliverFriday
                    ? "PM"
                    : shift;

                  const isOff = displayShift === "OFF" || displayShift === "VAC" || displayShift === "REQ OFF";

                  return (
                    <span
                      key={ci}
                      title={isPinned ? person.pinReason : undefined}
                      className={[
                        !isOff ? "assigned" : "offShift",
                        isHarperFriday ? "changed" : "",
                        isOliverThursday ? "moved" : "",
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

          <div className="rosterFoot">
            <span>
              ⌁ <strong>Kept assignments</strong> (Tuesday AM Trainer, Friday Night Supervisor) stay locked when previewing schedule changes.
            </span>
            <b>
              Status: <em>{vacation ? "Review before publishing (1 Thu PM gap)" : "Ready to publish"}</em>
            </b>
          </div>
        </div>
      </section>

      {/* PRODUCT 02: INCIDENT */}
      <section id="incident" className="incidentProduct chapter">
        <div className="productIntro">
          <div className="productLabelRow">
            <span className="productNumber purple">02</span>
            <span className="index">TIDEMARK INCIDENT · PRIVACY-FIRST REPORTING</span>
          </div>
          <h2>Turn rough shift notes into complete, defensible incident records</h2>
          <p>
            When an incident happens on property, details arrive across radio calls, hasty desk notes, and shift handoffs. TideMark structures the account, prompts for missing liability details, and redacts guest PII on-device before any AI model touches the text.
          </p>
          <div className="pillRow incidentProof">
            <span>On-device PII redaction</span>
            <span>Hospitality playbooks</span>
            <span>Targeted follow-up prompts</span>
            <span>Source fact audit</span>
            <span>Word & PDF export</span>
          </div>
        </div>

        {/* Structured Failure Breakdown */}
        <div className="failureGrid">
          <div className="failureCard">
            <span className="failureIndex">PROBLEM 01 · SCATTERED FRAGMENTS</span>
            <b>Details live in five places at once</b>
            <p>
              Security has photos on a phone, the desk has a two-line pass-on note, Engineering has a maintenance ticket, and the room move is in the PMS. Without guided intake, half the timeline disappears by morning.
            </p>
          </div>
          <div className="failureCard">
            <span className="failureIndex">PROBLEM 02 · BLANK-FORM GUESSWORK</span>
            <b>Generic templates don’t ask the right questions</b>
            <p>
              A slip-and-fall by the pool, a missing laptop in Room 614, and a stalled elevator require completely different evidence. A single blank text box leaves team members guessing what to document.
            </p>
          </div>
          <div className="failureCard">
            <span className="failureIndex">PROBLEM 03 · DATA PRIVACY RISK</span>
            <b>Pasting guest names into public AI leaks PII</b>
            <p>
              Managers want help turning rough notes into professional language, but pasting guest names, room numbers, and medical details into consumer AI tools violates hospitality privacy obligations.
            </p>
          </div>
        </div>

        {/* Interactive Incident Intake & Playbook Workspace */}
        <div className="workspaceControls">
          <div className="controlGroup">
            <span className="controlLabel">1. SELECT INCIDENT SCENARIO:</span>
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
            <span className="controlLabel">2. INPUT SOURCE:</span>
            <div className="sampleTabs">
              <button
                type="button"
                className={intakeMode === "note" ? "active" : ""}
                onClick={() => setIntakeMode("note")}
              >
                Written manager note
              </button>
              <button
                type="button"
                className={intakeMode === "voice" ? "active" : ""}
                onClick={() => setIntakeMode("voice")}
              >
                Voice memo transcript
              </button>
              <button
                type="button"
                className={intakeMode === "handoff" ? "active" : ""}
                onClick={() => setIntakeMode("handoff")}
              >
                Shift handoff log
              </button>
            </div>
          </div>
        </div>

        <div className="captureFlow glass">
          <div className="captureHead">
            <div>
              <Mark /> TideMark <b>Incident</b>
            </div>
            <span>{activeIncident.badge}</span>
            <em>PLAYBOOK ACTIVE</em>
          </div>

          <div className="captureColumns">
            <div className="rawAccount">
              <small>01 · FIRST ACCOUNT ({intakeMode.toUpperCase()})</small>
              <p>{activeIncident.accounts[intakeMode]}</p>
              <div className="accountMeta">
                <span>Logged at {activeIncident.time}</span>
                <span>Source preserved verbatim</span>
              </div>
            </div>

            <div className="extraction">
              <small>02 · EXTRACTED FACTS & GAP DETECTION</small>
              <div className="fact">
                <i />
                <span>Incident classification</span>
                <b>{activeIncident.type}</b>
              </div>
              <div className="fact">
                <i />
                <span>Time of event</span>
                <b>{activeIncident.time} local property time</b>
              </div>
              <div className="fact">
                <i />
                <span>Involved parties & roles</span>
                <b>{activeIncident.peopleClarification}</b>
              </div>
              <div className="fact">
                <i />
                <span>Immediate response logged</span>
                <b>{activeIncident.response}</b>
              </div>
              <div className="fact missing">
                <i />
                <span>Targeted Playbook Follow-Up Question</span>
                <b>{activeIncident.question}</b>
              </div>
            </div>

            <div className="structuredRecord">
              <small>03 · PLAYBOOK CHECKLIST</small>
              <header>
                <b>{activeIncident.type}</b>
                <span>4-POINT VERIFICATION</span>
              </header>
              {activeIncident.track.map((item) => (
                <div key={item.name}>
                  <span>{item.name}</span>
                  <em className={item.status !== "Captured" ? "open" : ""}>
                    {item.status}
                  </em>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="privacySection">
          <div className="stackCopy">
            <span className="index">ON-DEVICE PRIVACY BOUNDARY</span>
            <h3>Guest names and room numbers never leave your device</h3>
            <p>
              Before any text is sent for AI structuring, TideMark detects personal identifiers locally in memory and replaces them with anonymous tokens (<code>[GUEST_01]</code>, <code>[ROOM_01]</code>). Toggle below to see exactly what stays on property versus what the AI model sees.
            </p>
          </div>

          <div className="privacyLens glass">
            <div className="privacyHeader">
              <div className="privacyToggle">
                <button
                  type="button"
                  className={privacyView === "manager" ? "active" : ""}
                  onClick={() => setPrivacyView("manager")}
                >
                  On-Device Manager View (Full PII)
                </button>
                <button
                  type="button"
                  className={privacyView === "processing" ? "active" : ""}
                  onClick={() => setPrivacyView("processing")}
                >
                  External AI Payload (Redacted)
                </button>
              </div>
              <span className="privacyScenarioBadge">{activeIncident.type}</span>
            </div>

            <div className="deviceBoundary">
              <small>
                {privacyView === "manager"
                  ? "LOCAL RAM · AUTHORIZED MANAGER VIEW"
                  : "OUTBOUND PAYLOAD · ZERO IDENTIFIABLE DATA"}
              </small>
              <p>
                {privacyView === "manager"
                  ? activeIncident.managerView
                  : activeIncident.redactedView}
              </p>
              <span>
                {privacyView === "manager"
                  ? "Real names and room numbers remain in local memory and final exported files."
                  : "Only anonymized tokens cross the network; real identities are re-linked locally afterward."}
              </span>
            </div>

            <div className="privacyRoute">
              <span>1. Local NLP + NER scan</span>
              <i>→</i>
              <span>2. Token replacement in RAM</span>
              <i>→</i>
              <span>3. Redacted AI structuring</span>
              <i>→</i>
              <span>4. Local identity restoration</span>
            </div>
          </div>
        </div>

        {/* Fact Audit Section */}
        <div className="accuracySection">
          <div className="controlIntro">
            <span className="index">SOURCE-TO-REPORT ACCOUNTABILITY</span>
            <h3>AI helps format the report. It cannot invent or drop a fact.</h3>
            <p>
              Every generated report stays anchored to the manager’s original statement. Click the button in step 03 below to see what happens if an edited narrative accidentally omits a critical detail like a medical refusal.
            </p>
          </div>

          <div className="recordLayers glass">
            <div>
              <small>01 · VERBATIM MANAGER STATEMENT</small>
              <p>
                “Guest slipped near the pool entrance at 21:40. Security attended and photos were taken. She stated she did not want an ambulance.”
              </p>
              <span>IMMUTABLE SOURCE LOG</span>
            </div>
            <i aria-hidden="true">→</i>
            <div>
              <small>02 · VERIFIED FACT LEDGER</small>
              <p>
                <strong>Location:</strong> Indoor pool entrance
                <br />
                <strong>Action:</strong> Security attended, photos taken
                <br />
                <strong>Medical:</strong> Guest declined EMS / ambulance
              </p>
              <span>4 ATOMIC FACTS EXTRACTED</span>
            </div>
            <i aria-hidden="true">→</i>
            <div>
              <small>03 · FORMATTED NARRATIVE</small>
              <p>
                {auditDiscrepancy ? (
                  <>
                    At 21:40, the guest reported slipping near the indoor pool entrance. Security personnel attended the scene and captured photographs of the area.
                  </>
                ) : (
                  <>
                    At 21:40, the guest reported slipping near the indoor pool entrance. Security personnel attended the scene and captured photographs. The guest declined medical assistance.
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={() => setAuditDiscrepancy(!auditDiscrepancy)}
              >
                {auditDiscrepancy
                  ? "↺ Restore medical-refusal clause"
                  : "⚠ Simulate omitting medical refusal"}
              </button>
            </div>
          </div>

          <div className={`auditWarning ${auditDiscrepancy ? "show" : ""}`}>
            <b>FACT AUDIT ALERT · MISSING SOURCE DETAIL</b>
            <span>
              The source account states the guest declined an ambulance, but this fact is missing from the edited narrative.
            </span>
            <em>Requires manager sign-off before export</em>
          </div>
        </div>

        {/* Searchable Local Archive Section */}
        <div className="archiveSection">
          <div className="stackCopy">
            <span className="index">ENCRYPTED LOCAL ARCHIVE</span>
            <h3>Searchable history when ownership, insurers, or WorkSafeBC ask</h3>
            <p>
              Completed incident reports are stored locally with SHA-256 integrity hashes so you can prove a record has not been altered since sign-off. Search or filter the sample archive to test it.
            </p>
          </div>

          <div className="archive glass">
            <header>
              <div>
                <Mark /> Local Incident Archive
              </div>
              <label className="archiveSearchLabel">
                <span>⌕</span>
                <input
                  aria-label="Search incident archive"
                  value={archiveQuery}
                  onChange={(e) => setArchiveQuery(e.target.value)}
                  placeholder="Search pool, 614, elevator..."
                />
              </label>
              <span>{filteredArchive.length} verified records</span>
            </header>

            <div className="archiveFilterBar">
              {(["All", "Safety", "Security", "Engineering"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={archiveFilter === cat ? "active" : ""}
                  onClick={() => setArchiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="archiveRows">
              {filteredArchive.length > 0 ? (
                filteredArchive.map((rec) => (
                  <div key={rec.id}>
                    <span>{rec.id}</span>
                    <div>
                      <b>{rec.title}</b>
                      <small className="archiveDate">{rec.date} · {rec.category}</small>
                    </div>
                    <em>{rec.status}</em>
                    <small>{rec.format}</small>
                  </div>
                ))
              ) : (
                <div className="archiveEmpty">
                  No matching incident records for “{archiveQuery}”.
                </div>
              )}
            </div>

            <footer>
              <span>Encrypted local SQLite storage</span>
              <span>HMAC-SHA256 tamper verification</span>
              <span>One-click DOCX & PDF export</span>
            </footer>
          </div>
        </div>
      </section>

      {/* BUILDER NOTE */}
      <section id="builder" className="builder chapter">
        <div className="builderCard glass">
          <div>
            <span className="index">WHY THIS EXISTS</span>
            <h2>Built on the hotel floor, not in a generic SaaS incubator</h2>
          </div>
          <div className="builderNote">
            <p>
              I work in hotel operations in British Columbia. I built Project TideMark because the tools we actually needed on shift—a scheduler that understands hotel arrival peaks, BC turnaround rest, and leave planning, and an incident reporter that guides team members without leaking guest PII—didn’t exist.
            </p>
            <p>
              I am preparing Project TideMark for an open-source release so independent hotels, GMs, and hospitality builders can inspect the architecture and run it directly on their own properties.
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
        <span className="index">OPEN-SOURCE EARLY ACCESS & PILOT SETUP</span>
        <h2>Try TideMark at your property</h2>
        <p>
          Whether you manage a front desk and want to test Shift or Incident, or you’re a developer interested in the open-source release, send a note below and I will personally help you get set up.
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
            <span>Role / Interest</span>
            <select name="interest" defaultValue="Hotel GM / Operations Manager">
              <option>Hotel GM / Operations Manager</option>
              <option>Front Office / Housekeeping Lead</option>
              <option>Security / Risk Management</option>
              <option>Hospitality Technologist / Contributor</option>
              <option>Other</option>
            </select>
          </label>
          <label className="wide">
            <span>Which workflow are you looking to improve?</span>
            <textarea
              name="setup_goal"
              rows={3}
              placeholder="Tell me a bit about your property size, current scheduling or incident reporting setup, and what you'd like to test."
            />
          </label>
          <button type="submit">
            Request early access <span>→</span>
          </button>
        </form>
        <small className="formNote">
          Direct response from Oguzhan · No sales cadences or automated drip emails
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
    </main>
  );
}
