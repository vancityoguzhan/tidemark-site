import { useRef, useState } from "react";
import ScheduleMotion from "./ScheduleMotion";

const incidentSamples = [
  {
    type: "Pool slip & fall",
    rawNote:
      "“Guest Jane Smith from Room 814 slipped by the indoor pool door around 9:40 PM. There was some water near the towel bin. Security Officer Patel came down and took three photos. She said she felt okay and didn’t want an ambulance.”",
    redactedNote: (
      <>
        “Guest <mark>[GUEST_01]</mark> from <mark>[ROOM_01]</mark> slipped by
        the indoor pool door around 9:40 PM. There was some water near the towel
        bin. Security Officer <mark>[STAFF_01]</mark> came down and took three
        photos. She said she felt okay and didn’t want an ambulance.”
      </>
    ),
    missingQuestion:
      "Was a wet-floor sign already in place before 9:40 PM, and who mopped or cordoned off the entrance afterward?",
    finalReport:
      "At approximately 21:40, guest Jane Smith (Room 814) slipped near the indoor pool entrance. Water was reported near the towel bin. Security Officer Patel attended and took three photographs. The guest said she felt okay and did not want an ambulance.",
  },
  {
    type: "Missing laptop in guest room",
    rawNote:
      "“Marcus Vance in Room 614 called the front desk at 6:25 PM saying his work MacBook Pro was missing from the desk when he got back from dinner. He left around 5:00 PM. I asked Security to pull the Saflok door lock audit.”",
    redactedNote: (
      <>
        “<mark>[GUEST_01]</mark> in <mark>[ROOM_01]</mark> called the front desk
        at 6:25 PM saying his work MacBook Pro was missing from the desk when he
        got back from dinner. He left around 5:00 PM. I asked Security to pull
        the Saflok door lock audit.”
      </>
    ),
    missingQuestion:
      "Did Security confirm whether the guest room door latched fully at 5:00 PM, and was a police non-emergency file number provided?",
    finalReport:
      "At 18:25, guest Marcus Vance (Room 614) contacted the Front Desk to report a work MacBook Pro missing from his room desk upon returning from dinner. He reported leaving at approximately 17:00. Front Desk asked Security to retrieve the Saflok door lock audit.",
  },
  {
    type: "Stalled service elevator",
    rawNote:
      "“Service car 2 stopped between floors 3 and 4 at 2:12 PM with Room Attendant Elena Kowalski inside. Intercom worked the whole time. Chief Engineer Miller reset the car and got the doors open at 2:29 PM. Elena was fine, didn’t need medical, and we locked the elevator out for Otis.”",
    redactedNote: (
      <>
        “Service car 2 stopped between floors 3 and 4 at 2:12 PM with Room
        Attendant <mark>[STAFF_01]</mark> inside. Intercom worked the whole
        time. Chief Engineer <mark>[STAFF_02]</mark> reset the car and got the
        doors open at 2:29 PM. <mark>[STAFF_01]</mark> was fine, didn’t need
        medical, and we locked the elevator out for Otis.”
      </>
    ),
    missingQuestion:
      "Has the elevator contractor service ticket number been logged before returning the car to service?",
    finalReport:
      "At 14:12, Service Elevator #2 halted between the 3rd and 4th floors with Room Attendant Elena Kowalski aboard. The intercom remained operational. Chief Engineer Miller reset the car and opened the doors at 14:29 (17 minutes later). The note states that Ms. Kowalski was fine and did not need medical assistance. The elevator was locked out for Otis.",
  },
];

const tour = [
  {
    label: "The weekly schedule",
    src: "shift-roster-grid.png",
    title: "The shuffling is done. You make the call.",
    text: "Review who is working, where the days off fall, and which assignments need your attention. Keep the decisions you want to protect, make your changes, and publish when you’re ready.",
  },
  {
    label: "Staffing needs",
    src: "shift-staffing-needs.png",
    title: "Plan for the busy days.",
    text: "Set your usual coverage and add staffing rules for busier arrival and departure days.",
  },
  {
    label: "Leave planning",
    src: "shift-leave-planner.png",
    title: "Room to say yes.",
    text: "Explore time-off requests together and check the effect on coverage before making a decision. Your live schedule stays untouched.",
  },
  {
    label: "Team requests",
    src: "shift-requests-calendar.png",
    title: "Keep requests in view.",
    text: "See pending and approved time off in one calendar, with shift preferences alongside the week you’re planning.",
  },
];

function Mark() {
  return (
    <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path
        d="M5 12c7-8 19-8 26-3M5 20c7-8 19-8 26-3M5 28c7-8 19-8 26-3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function Experience() {
  const [activeShot, setActiveShot] = useState(0);
  const imageDialog = useRef<HTMLDialogElement>(null);
  const [incidentSample, setIncidentSample] = useState(0);
  const [showPrivacyTokens, setShowPrivacyTokens] = useState(false);
  const shot = tour[activeShot];
  const incident = incidentSamples[incidentSample];
  return (
    <>
      <a className="skipLink" href="#main">
        Skip to content
      </a>
      <header className="siteHeader">
        <a className="brand" href="#top" aria-label="TideMark home">
          <Mark />
          <span>
            TideMark<span className="brandDot">.</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#shift">Shift</a>
          <a href="#incident">Incident</a>
          <a href="#builder">Our story</a>
        </nav>
        <a className="headerCta" href="#contact">
          Request a walkthrough <span aria-hidden="true">↗</span>
        </a>
      </header>
      <dialog
        ref={imageDialog}
        className="imageDialog"
        aria-labelledby="previewTitle"
      >
        <div className="previewHeader">
          <h2 id="previewTitle">{shot.label}</h2>
          <form method="dialog">
            <button autoFocus>
              Close <span aria-hidden="true">×</span>
            </button>
          </form>
        </div>
        <p className="previewInstruction">
          Scroll across the image to explore. Fictional demo data.
        </p>
        <div
          className="imageScroll"
          tabIndex={0}
          role="region"
          aria-label="Scrollable full-size product screenshot"
        >
          <img
            src={`/screenshots/${shot.src}`}
            alt={`Full-size Shift ${shot.label} screen`}
          />
        </div>
      </dialog>
      <main id="main">
        <section className="hero wrap" id="top">
          <p className="eyebrow">
            Hotel scheduling, built inside hotel operations.
          </p>
          <h1>
            Less second-guessing.
            <br />
            <em>A better week for your team.</em>
          </h1>
          <div className="heroBottom">
            <p>
              Could one more shuffle give someone two days off together?
              TideMark Shift searches the combinations around your staffing
              needs, team preferences, and priorities. You make the final call.
            </p>
            <div className="heroActions">
              <a className="button" href="#contact">
                Request a walkthrough <span aria-hidden="true">↗</span>
              </a>
              <a className="heroExplore" href="#shift">See the schedule ↓</a>
            </div>
          </div>
          <div className="heroRule">
            <span>Early access · Hotel pilots</span>
            <span>British Columbia, Canada</span>
          </div>
        </section>
        <section className="shiftSection" id="shift">
          <div className="wrap">
            <div className="productIntro">
              <h2 className="eyebrow">TideMark Shift / The weekly schedule</h2>
              <p>Your team. Your priorities. Your decision.</p>
            </div>
            <div
              className="tourTabs"
              role="group"
              aria-label="Explore Shift screenshots"
            >
              {tour.map((item, i) => (
                <button
                  key={item.label}
                  onClick={() => setActiveShot(i)}
                  aria-pressed={i === activeShot}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="mobileTourSelect">
              Explore Shift
              <select
                value={activeShot}
                onChange={(e) => setActiveShot(Number(e.target.value))}
              >
                {tour.map((item, i) => (
                  <option key={item.label} value={i}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <figure className="productWindow">
              <div className="windowBar">
                <span className="windowDots" aria-hidden="true">
                  ● ● ●
                </span>
                <span>TideMark Shift / Product preview</span>
                <a
                  href={`/screenshots/${shot.src}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View full size ↗
                </a>
              </div>
              <button
                className="screenshotButton"
                onClick={() => imageDialog.current?.showModal()}
                aria-label={`Enlarge ${shot.label} screenshot`}
              >
                <span className={`screenCrop ${activeShot === 0 ? "rosterCrop" : ""}`}>
                  <img
                    src={`/screenshots/${shot.src}`}
                    alt={`TideMark Shift: ${shot.label}, using fictional demonstration data`}
                    fetchPriority="high"
                  />
                </span>
                <span className="inspectHint">
                  Tap to inspect the screen <span aria-hidden="true">↗</span>
                </span>
              </button>
            </figure>
            <div className="shotCaption" aria-live="polite">
              <h3>{shot.title}</h3>
              <p>{shot.text}</p>
              <span>Demo data · Actual product screens</span>
            </div>
            <div className="decisionSteps" aria-label="How you work with Shift">
              <p><span>01</span><strong>Set what matters.</strong> Coverage, availability, requests, and the priorities for your team.</p>
              <p><span>02</span><strong>Review the week.</strong> See the assignments, check the trade-offs, and keep or change the result.</p>
              <p><span>03</span><strong>Publish when ready.</strong> The final decision stays with you.</p>
            </div>
            <ScheduleMotion />
            <details className="quietDetails">
              <summary>
                How does Shift find a better combination?{" "}
                <span aria-hidden="true">+</span>
              </summary>
              <div className="detailGrid">
                <p>
                  <strong>Protect the essentials.</strong> Availability,
                  approved leave, qualifications, rest rules, and kept
                  assignments define what is allowed. Coverage and weekly hours
                  are addressed before the softer preferences.
                </p>
                <p>
                  <strong>Make the trade-offs deliberately.</strong> Choose
                  whether to put stronger emphasis on consecutive breaks or
                  protecting preferences. Shift also considers difficult
                  turnarounds, past split breaks, and repeated shift
                  assignments.
                </p>
                <p>
                  <strong>Know what “best” means.</strong> Shift searches for
                  the best schedule under your rules and priorities. A
                  time-limited search can return a workable result without
                  proving that no better combination exists. Review the gaps and
                  trade-offs before publishing.
                </p>
              </div>
            </details>
          </div>
        </section>
        <section className="incidentSection wrap" id="incident">
          <div className="sectionIntro">
            <div>
              <p className="eyebrow">Also from TideMark / Incident</p>
              <h2>A clearer record.<br /><em>From a rough shift note.</em></h2>
            </div>
            <p>
              A companion tool for the other side of the desk. Turn shift
              notes into structured incident reports, with follow-up questions
              to help you fill the gaps. Review the facts before signing off.
            </p>
          </div>
          <p className="incidentPrivacy">Names and room numbers are replaced on your computer before the note is sent to AI.</p>
          <details className="quietDetails incidentExamples">
            <summary>See an example note and report <span aria-hidden="true">+</span></summary>
          <div className="incidentDemo">
            <div className="notePanel">
              <div className="panelTop">
                <span className="eyebrow">01 / The shift note</span>
                <label className="sampleSelect">
                  <span className="srOnly">Example incident</span>
                  <select
                    value={incidentSample}
                    onChange={(e) => setIncidentSample(Number(e.target.value))}
                  >
                    {incidentSamples.map((item, i) => (
                      <option value={i} key={item.type}>
                        {item.type}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="noteText">
                {showPrivacyTokens ? incident.redactedNote : incident.rawNote}
              </p>
              <button
                className="textButton"
                aria-pressed={showPrivacyTokens}
                onClick={() => setShowPrivacyTokens(!showPrivacyTokens)}
              >
                {showPrivacyTokens
                  ? "Show original note"
                  : "See the note with names hidden"}{" "}
                <span aria-hidden="true">↗</span>
              </button>
              <p className="privacyNote">
                Illustrative examples. Names and room numbers are replaced on
                your computer before the note is sent to AI.
              </p>
            </div>
            <div className="questionPanel">
              <span className="eyebrow">02 / A useful follow-up</span>
              <h3>{incident.missingQuestion}</h3>
              <p>A clearer record starts with the right question.</p>
            </div>
          </div>
          <details className="quietDetails">
            <summary>
              Read the example report <span aria-hidden="true">+</span>
            </summary>
            <div className="reportBody">
              <p>{incident.finalReport}</p>
              <p className="privacyNote">
                Illustrative draft. Confirm the facts and complete the follow-up
                before signing off.
              </p>
            </div>
          </details>
          </details>
        </section>
        <section className="storySection" id="builder">
          <div className="wrap storyGrid">
            <p className="eyebrow">From the other side of the desk</p>
            <div>
              <h2>
                Built from the work.
                <br />
                <em>And the wish for a better way.</em>
              </h2>
              <p>
                I work in hotel operations in British Columbia. The hardest part
                of scheduling wasn’t filling the cells. It was wondering whether
                one more change could give someone a better week without leaving
                the hotel short.
              </p>
              <p>
                I built Shift to carry that mental workload, so I could spend
                more time on the team and the hotel. Incident grew from the same
                wish: to make the work at the desk a little easier.
              </p>
              <a
                className="signature"
                href="https://www.linkedin.com/in/oguzhangur"
                target="_blank"
                rel="noreferrer"
              >
                <span className="avatar">OG</span>
                <span>
                  <strong>Oguzhan Gur</strong>
                  <small>Hotel operator & TideMark creator</small>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
        <section className="contactSection wrap" id="contact">
          <div>
            <p className="eyebrow">Early access / Hotel pilots</p>
            <h2>
              Let’s talk about
              <br />
              <em>your property.</em>
            </h2>
            <p>
              Tell me a little about your team and what makes scheduling hard.
              I’ll reply personally to arrange a walkthrough and discuss whether
              a pilot fits your property.
            </p>
          </div>
          <form action="https://formspree.io/f/xlgadqyd" method="POST">
            <input
              type="hidden"
              name="_subject"
              value="Project TideMark early access request"
            />
            <div className="formRow">
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
              What would you like to explore?
              <select name="interest" defaultValue="TideMark Shift">
                <option>TideMark Shift</option>
                <option>TideMark Incident</option>
                <option>Both products</option>
              </select>
            </label>
            <label>
              A little about your property{" "}
              <span className="optional">(optional)</span>
              <textarea
                name="setup_goal"
                rows={3}
                placeholder="Your team, your property, or what you’d like to make easier."
              />
            </label>
            <button className="button" type="submit">
              Request a walkthrough <span aria-hidden="true">↗</span>
            </button>
            <p className="formNote">
              Direct reply from Oguzhan. No automated marketing emails.
            </p>
          </form>
        </section>
      </main>
      <footer className="wrap">
        <a className="brand" href="#top">
          <Mark />
          <span>TideMark.</span>
        </a>
        <span>Made with care in British Columbia.</span>
        <a
          href="https://www.linkedin.com/in/oguzhangur"
          target="_blank"
          rel="noreferrer"
        >
          Say hello on LinkedIn ↗
        </a>
      </footer>
    </>
  );
}
