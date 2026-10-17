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

const weekDemand = [
  {
    day: "MON",
    date: "Jul 13",
    occ: 86,
    barHeight: 46,
    signal: "148 arrivals · 162 departures",
    context: "Heavy corporate check-out morning; standard weekday check-in curve after 15:00.",
    tactic: "3 AM Desk · 2 PM Desk · 1 Night Audit",
    rationale: "Shift weight toward 07:00–11:00 folio settlement and late check-out coordination.",
    coverage: "6 shifts scheduled · All roles covered",
  },
  {
    day: "TUE",
    date: "Jul 14",
    occ: 89,
    barHeight: 58,
    signal: "176 arrivals · 94 departures",
    context: "Midweek corporate stayover build; airline crew block arriving at 16:30.",
    tactic: "2 AM Desk · 3 PM Desk · 1 Night Audit",
    rationale: "Pre-key crew rooms on AM shift; add third PM agent for 16:00–19:00 peak.",
    coverage: "6 shifts scheduled · Crew block pre-assigned",
  },
  {
    day: "WED",
    date: "Jul 15",
    occ: 91,
    barHeight: 68,
    signal: "211 arrivals · 118 departures",
    context: "Conference pre-reg arrivals starting at noon; high early check-in pressure.",
    tactic: "3 AM Desk · 3 PM Desk · 1 Night Audit",
    rationale: "Overlap mid-shift desk coverage with housekeeping room-release queue.",
    coverage: "7 shifts scheduled · Mid-day overlap active",
  },
  {
    day: "THU",
    date: "Jul 16",
    occ: 94,
    barHeight: 84,
    signal: "Group peak · 228 arrivals",
    context: "Harbour Ballroom conference check-in (140 rooms) between 15:00 and 18:00.",
    tactic: "Add 1 PM Guest Service Agent (4 PM total)",
    rationale: "Arrivals exceed 215-room threshold; requires dedicated group desk lane.",
    coverage: "8 shifts scheduled · Senior lead pinned on PM",
  },
  {
    day: "FRI",
    date: "Jul 17",
    occ: 92,
    barHeight: 74,
    signal: "218 arrivals · 195 departures",
    context: "Conference turnover into weekend leisure arrivals; high valet & bell volume.",
    tactic: "3 AM Desk · 4 PM Desk · 1 Night Audit",
    rationale: "Maintain 4 agents on PM desk for Friday leisure check-in wave.",
    coverage: "8 shifts scheduled · Turnaround rest verified",
  },
  {
    day: "SAT",
    date: "Jul 18",
    occ: 88,
    barHeight: 54,
    signal: "184 arrivals · 82 departures",
    context: "High stayover occupancy; wedding block guests arriving between 13:00 and 15:00.",
    tactic: "2 AM Desk · 3 PM Desk · 1 Night Audit",
    rationale: "Concentrate coverage on early afternoon check-ins and concierge requests.",
    coverage: "6 shifts scheduled · Weekend rotation balanced",
  },
  {
    day: "SUN",
    date: "Jul 19",
    occ: 83,
    barHeight: 38,
    signal: "131 arrivals · 214 departures",
    context: "Weekend departure wave before 11:00; quieter Sunday evening arrival pace.",
    tactic: "3 AM Desk · 2 PM Desk · 1 Night Audit",
    rationale: "Extra morning desk coverage for check-outs and billing disputes.",
    coverage: "6 shifts scheduled · Ready to publish",
  },
];

const roster = [
  {
    name: "Maya Chen",
    role: " Senior GSA",
    shifts: ["AM", "AM", "AM", "Off", "PM", "PM", "Off"],
    pinCol: 2,
    pinReason: "Pinned: Lead trainer for new hire on Wednesday AM",
  },
  {
    name: "Jon Bell",
    role: "GSA",
    shifts: ["PM", "PM", "Off", "PM", "PM", "Off", "AM"],
    pinCol: -1,
    pinReason: "",
  },
  {
    name: "Ari Singh",
    role: "Night Audit",
    shifts: ["NA", "NA", "NA", "Off", "Off", "NA", "NA"],
    pinCol: 5,
    pinReason: "Pinned: Fixed weekend Night Audit rotation",
  },
  {
    name: "Nora Hall",
    role: "GSA",
    shifts: ["AM", "Off", "AM", "AM", "AM", "AM", "Off"],
    pinCol: -1,
    pinReason: "",
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
      handoff: "PM → NA Handoff: Rm 814 (J. Smith) slipped at pool entry 21:40. Security on scene, photos saved. Refused medical. Engineering notified to check mat/drain.",
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
    peopleClarification: "Marcus Vance (Registered Guest, Rm 614) · MOD on duty",
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
      note: "Service elevator #2 stopped between floors 3 and 4 at 14:12 with Room Attendant Elena Rostova inside. Chief Engineer Miller reset the car by 14:29; Elena declined medical evaluation.",
      voice: "“Service car 2 faulted between 3 and 4 at 2:12 PM with Elena from housekeeping inside. Intercom stayed live. Miller got the doors open at 2:29 PM. She’s okay, declined medical.”",
      handoff: "14:12 Service Elevator #2 entrapment (17 mins) — Employee E. Rostova. Released 14:29 by Engineering. Car locked out pending Otis technician inspection.",
    },
    response: "Intercom maintained · Released in 17m · Car locked out",
    peopleClarification: "Elena Rostova (Housekeeping) · D. Miller (Chief Engineer)",
    question: "Was the elevator locked out of service pending licensed contractor sign-off?",
    track: [
      { name: "Entrapment duration & intercom contact", status: "Captured" },
      { name: "Employee wellness & medical refusal", status: "Captured" },
      { name: "Extraction method & witness log", status: "Captured" },
      { name: "Contractor lockout & return-to-service authorization", status: "Follow-up required" },
    ],
    managerView: (
      <>
        Service elevator stopped at 14:12 with <mark>Elena Rostova</mark> inside. Chief Engineer <mark>Miller</mark> completed release at 14:29.
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
  const [day, setDay] = useState(3);
  const [vacation, setVacation] = useState(false);
  const [incidentSample, setIncidentSample] = useState(0);
  const [intakeMode, setIntakeMode] = useState<"note" | "voice" | "handoff">("note");
  const [privacyView, setPrivacyView] = useState<"manager" | "processing">("manager");
  const [auditDiscrepancy, setAuditDiscrepancy] = useState(false);
  const [archiveQuery, setArchiveQuery] = useState("");
  const [archiveFilter, setArchiveFilter] = useState<"All" | "Safety" | "Security" | "Engineering">("All");

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
              <strong>01 · TideMark Shift</strong>
              <span>Demand-driven weekly scheduling with turnaround rest & pinned shifts</span>
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
            When a property gets busy, mistakes happen in two places: a schedule that didn’t account for a 220-arrival group peak or an 11 PM incident report written from half-remembered radio calls. TideMark gives operators dedicated tools for each.
          </p>
        </div>

        <div className="productBranches">
          <a href="#shift" className="branchCard">
            <div className="branchTop">
              <span className="branchTag">MODULE 01 · STAFFING & ROSTER</span>
              <span className="branchStatus">Interactive demo below</span>
            </div>
            <b>TideMark Shift</b>
            <p>
              Translates daily arrival curves, group blocks, employee availability, and overnight turnaround rules into a weekly desk schedule you can test and adjust before publishing.
            </p>
            <ul className="branchList">
              <li>Calculates shift headcount from daily arrivals & departures</li>
              <li>Flags turnaround rest violations and overtime before publishing</li>
              <li>Previews the exact ripple effect of time-off requests</li>
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
              <li>Tokenizes guest & staff PII in local memory before external AI calls</li>
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
            <span className="index">TIDEMARK SHIFT · WEEKLY SCHEDULING ENGINE</span>
          </div>
          <h2>Build the schedule around real arrival curves and rest rules</h2>
          <p>
            Instead of cross-referencing PMS forecast printouts against sticky notes, Shift maps daily arrivals and group blocks directly to role requirements, then checks availability and rest rules automatically.
          </p>
          <div className="pillRow">
            <span>PMS arrival curve</span>
            <span>Role requirements</span>
            <span>Turnaround rest check</span>
            <span>Pinned shifts</span>
            <span>Impact preview</span>
          </div>
        </div>

        {/* Interactive Demand & Coverage Panel */}
        <div className="shiftFlow glass">
          <div className="flowTop">
            <div>
              <Mark /> TideMark <b>Shift</b>
            </div>
            <span>Week of July 13 – July 19 · Front Office</span>
            <em>INTERACTIVE DEMAND INSPECTOR</em>
          </div>

          <div className="demandPanel">
            <header>
              <div>
                <small>7-DAY OCCUPANCY & ARRIVAL HORIZON</small>
                <b>Select any day to inspect operational drivers and staffing rules</b>
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
              <small>OPERATING SIGNAL · {activeDemand.day} ({activeDemand.date})</small>
              <b>{activeDemand.signal}</b>
              <p>{activeDemand.context}</p>
            </div>
            <span className="flowArrow" aria-hidden="true">→</span>
            <div>
              <small>STAFFING REQUIREMENT</small>
              <b>{activeDemand.tactic}</b>
              <p>{activeDemand.rationale}</p>
            </div>
            <span className="flowArrow" aria-hidden="true">→</span>
            <div>
              <small>ROSTER STATUS</small>
              <b>{activeDemand.coverage}</b>
              <p>Coverage targets locked prior to employee assignment.</p>
            </div>
          </div>
        </div>

        {/* Constraint Evaluation Sequence */}
        <div className="decisionStack">
          <div className="stackCopy">
            <span className="index">TRANSPARENT RULE EVALUATION</span>
            <h3>Every constraint checked in sequence—no black-box scrambling</h3>
            <p>
              Auto-schedulers fail in hotels when they randomly shuffle steady shifts to close a single gap. TideMark evaluates hard operating boundaries first, respects pinned shifts, and highlights any remaining conflict for the manager to resolve.
            </p>
          </div>
          <div className="stackVisual">
            {[
              { step: "01", label: "Daily arrival & departure coverage targets", state: "LOCKED" },
              { step: "02", label: "Minimum 11h turnaround rest between PM & AM", state: "ENFORCED" },
              { step: "03", label: "Role qualification (Night Audit / Senior Lead)", state: "VERIFIED" },
              { step: "04", label: "Approved time-off & unavailable windows", state: "HONORED" },
              { step: "05", label: "Shift consistency & max consecutive workdays", state: "BALANCED" },
              { step: "06", label: "Publishable Front Office weekly roster", state: "READY" },
            ].map((item) => (
              <div key={item.step}>
                <span>{item.step}</span>
                <b>{item.label}</b>
                <em>{item.state}</em>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Roster Change Preview */}
        <div className="controlIntro">
          <span className="index">WHAT-IF IMPACT PREVIEW</span>
          <h3>Test a time-off request before you approve it</h3>
          <p>
            Click the button below to simulate approving Maya Chen’s Friday vacation request. Shift keeps pinned assignments locked, reassigns Jon Bell to cover Friday PM, and flags the single remaining Thursday gap.
          </p>
        </div>

        <div className="roster glass">
          <div className="rosterTop">
            <div>
              <Mark /> TideMark <b>Shift</b>
            </div>
            <span>Front Office · Weekly Roster</span>
            <button
              type="button"
              className="actionToggleBtn"
              onClick={() => setVacation(!vacation)}
            >
              {vacation ? "↺ Reset to baseline roster" : "⚡ Test Maya’s Friday vacation request"}
            </button>
          </div>

          <div className={`rosterNotice ${vacation ? "warning" : ""}`}>
            <span>{vacation ? "CHANGE IMPACT PREVIEW" : "BASELINE DRAFT"}</span>
            <p>
              {vacation
                ? "Approving Maya’s Friday vacation moves Jon Bell to Friday PM and leaves 1 open PM slot on Thursday (Group peak). 25 other shifts remain untouched."
                : "All 28 weekly shifts assigned. Overnight turnaround rest (11h minimum) and role qualifications verified."}
            </p>
            <em>{vacation ? "1 THURSDAY PM GAP FLAGGED" : "0 COVERAGE GAPS"}</em>
          </div>

          <div className="rosterGrid">
            <div className="row head">
              <b>STAFF MEMBER</b>
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
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
                  const isMayaFriday = vacation && ri === 0 && ci === 4;
                  const isJonThursday = vacation && ri === 1 && ci === 3;
                  const isPinned = person.pinCol === ci;
                  const displayShift = isMayaFriday
                    ? "VAC"
                    : isJonThursday
                    ? "OPEN ⚠"
                    : shift;

                  return (
                    <span
                      key={ci}
                      title={isPinned ? person.pinReason : undefined}
                      className={[
                        shift !== "Off" ? "assigned" : "offShift",
                        isMayaFriday ? "changed" : "",
                        isJonThursday ? "moved" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {displayShift}
                      {isPinned ? <i title={person.pinReason}>⌁ Pinned</i> : null}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="rosterFoot">
            <span>
              ⌁ <strong>Pinned shifts</strong> (Wednesday AM Trainer, Saturday Night Audit) stay locked when testing schedule changes.
            </span>
            <b>
              Status: <em>{vacation ? "Requires manager approval for Thu PM" : "Ready to publish"}</em>
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

        {/* Structured Failure Breakdown (Replacing the empty floating fragments void) */}
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
              A slip-and-fall by the pool, a missing laptop in Room 614, and a stalled elevator require completely different evidence. A single blank text box leaves staff guessing what to document.
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
              Before any text is sent for AI structuring, TideMark detects personal identifiers locally in memory and replaces them with anonymous tokens (`[GUEST_01]`, `[ROOM_01]`). Toggle below to see exactly what stays on property versus what the AI model sees.
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
            <h3>Searchable history when ownership, insurers, or WorkSafe ask</h3>
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
              I work in hotel operations in British Columbia. I built Project TideMark because the tools we actually needed on shift—a scheduler that understands hotel arrival peaks and turnaround rest, and an incident reporter that guides staff without leaking guest PII—didn’t exist.
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
