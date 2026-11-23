import { useState } from "react";

function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m5 10 3 3 7-7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function IncidentIllustration({ view }: { view: number }) {
  const [maskProperty, setMaskProperty] = useState(true);
  const [showScrubbed, setShowScrubbed] = useState(true);
  const [playbook, setPlaybook] = useState<"slip" | "worksafebc">("slip");
  const [signAnswered, setSignAnswered] = useState(false);
  const [simulateDrift, setSimulateDrift] = useState(false);
  const [useLetterhead, setUseLetterhead] = useState(true);

  const titles = [
    "Hide private details",
    "BC checklists",
    "Draft & fact check",
    "Letterhead & PDF",
  ];

  const subtitles = [
    "Step 1 · Private details never leave your device",
    "Step 2 · 16 BC incident guides · Instant check",
    "Step 3 · Clean report, checked against your notes",
    "Step 4 · Finished offline right in your browser",
  ];

  return (
    <figure className="iiFigure">
      <div className="iiStage">
        <div className="iiAppBar">
          <span className="iiWordmark">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="3.5"
                y="3.5"
                width="17"
                height="17"
                rx="3.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7.5 9h9M7.5 12.5h6M7.5 16h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            TideMark Incident
          </span>
          <span>Runs in your browser</span>
        </div>

        <div className="iiCanvas">
          <div className="iiHeading">
            <div>
              <h3>{titles[view]}</h3>
              <p>{subtitles[view]}</p>
            </div>
          </div>

          {view === 0 && (
            <>
              <div
                className="iiToggle"
                role="group"
                aria-label="Preview note mode"
              >
                <button
                  type="button"
                  aria-pressed={showScrubbed}
                  onClick={() => setShowScrubbed(true)}
                >
                  Safe version
                </button>
                <button
                  type="button"
                  aria-pressed={!showScrubbed}
                  onClick={() => setShowScrubbed(false)}
                >
                  Original note
                </button>
              </div>

              <div className="iiNoteBox" aria-live="polite">
                {showScrubbed ? (
                  <p>
                    “Guest <span className="iiToken">[PERSON_1]</span> slipped
                    near the pool entrance at{" "}
                    {maskProperty ? (
                      <span className="iiToken">[BUSINESS_1]</span>
                    ) : (
                      "Harbourview Hotel"
                    )}{" "}
                    at 8:15 pm, declined an ambulance, and gave{" "}
                    <span className="iiToken">[PHONE_1]</span>.”
                  </p>
                ) : (
                  <p>
                    “Guest Sarah Patel slipped near the pool entrance at
                    Harbourview Hotel at 8:15 pm, declined an ambulance, and
                    gave 604-555-0192.”
                  </p>
                )}
              </div>

              <table className="iiTable">
                <caption className="fSr">
                  Private details saved only on your device before your report
                  is drafted.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Placeholder</th>
                    <th scope="col">Original detail</th>
                    <th scope="col">Where it stays</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="iiToken">[PERSON_1]</span>
                    </td>
                    <td>Sarah Patel</td>
                    <td>On this device</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="iiToken">[PHONE_1]</span>
                    </td>
                    <td>604-555-0192</td>
                    <td>On this device</td>
                  </tr>
                  {maskProperty && (
                    <tr>
                      <td>
                        <span className="iiToken">[BUSINESS_1]</span>
                      </td>
                      <td>Harbourview Hotel</td>
                      <td>On this device</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="iiInsight" aria-live="polite">
                <Check />
                <p>
                  <strong>Real names never leave your device.</strong>{" "}
                  {maskProperty
                    ? "Your hotel name stays hidden during drafting, too."
                    : "Tap below to hide your hotel name as well."}
                </p>
              </div>

              <button
                type="button"
                className="iiAction"
                aria-pressed={maskProperty}
                onClick={() => setMaskProperty(!maskProperty)}
              >
                {maskProperty ? "Show hotel name" : "Hide hotel name"}
              </button>
            </>
          )}

          {view === 1 && (
            <>
              <div
                className="iiToggle"
                role="group"
                aria-label="Compare BC playbooks"
              >
                <button
                  type="button"
                  aria-pressed={playbook === "slip"}
                  onClick={() => setPlaybook("slip")}
                >
                  Guest slip &amp; fall
                </button>
                <button
                  type="button"
                  aria-pressed={playbook === "worksafebc"}
                  onClick={() => setPlaybook("worksafebc")}
                >
                  Staff injury (WorkSafeBC)
                </button>
              </div>

              {playbook === "slip" ? (
                <>
                  <div className="iiConfirmed">
                    <span>
                      <strong>Time:</strong> 8:15 pm
                    </span>
                    <span>
                      <strong>Location:</strong> Pool entrance
                    </span>
                    <span>
                      <strong>Medical help:</strong> Declined ambulance
                    </span>
                  </div>

                  <ul className="iiChecklist">
                    <li>
                      <strong>Was a wet-floor sign up?</strong>
                      <span
                        className={
                          signAnswered ? "iiStatusDone" : "iiStatusOpen"
                        }
                      >
                        {signAnswered ? "Answered: No sign up" : "Still needed"}
                      </span>
                    </li>
                    <li>
                      <strong>What was done right away?</strong>
                      <span className="iiStatusDone">
                        Area dried and caution cones placed
                      </span>
                    </li>
                  </ul>

                  <div className="iiInsight" aria-live="polite">
                    <Check />
                    <p>
                      <strong>No repetitive forms.</strong> It reads what you
                      already typed and flags only missing details or conflicts
                      before drafting.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="iiAction"
                    aria-pressed={signAnswered}
                    onClick={() => setSignAnswered(!signAnswered)}
                  >
                    {signAnswered
                      ? "Reset answer"
                      : "Mark sign question answered"}
                  </button>
                </>
              ) : (
                <>
                  <div className="iiConfirmed">
                    <span>
                      <strong>Person:</strong> Staff member
                    </span>
                    <span>
                      <strong>First aid log:</strong> Started
                    </span>
                  </div>

                  <ul className="iiChecklist">
                    <li>
                      <strong>First-aid attendant and care given</strong>
                      <span className="iiStatusOpen">Needed</span>
                    </li>
                    <li>
                      <strong>
                        Missed shifts or lighter duties after today
                      </strong>
                      <span className="iiStatusOpen">Needed</span>
                    </li>
                    <li>
                      <strong>
                        WorkSafeBC Form 7 three-day reporting check
                      </strong>
                      <span className="iiStatusGuided">Guided check</span>
                    </li>
                  </ul>

                  <div className="iiInsight" aria-live="polite">
                    <Check />
                    <p>
                      <strong>Picks the right BC checklist automatically.</strong>{" "}
                      Staff injuries bring up the exact WorkSafeBC Form 7
                      details needed before drafting.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="iiAction"
                    onClick={() => setPlaybook("slip")}
                  >
                    View guest slip &amp; fall checklist
                  </button>
                </>
              )}
            </>
          )}

          {view === 2 && (
            <>
              <div className="iiNoteBox" aria-live="polite">
                {!simulateDrift ? (
                  <p>
                    At approximately 8:15 pm,{" "}
                    <span className="iiToken">[PERSON_1]</span> slipped near the
                    pool entrance at{" "}
                    <span className="iiToken">[BUSINESS_1]</span>.{" "}
                    <span className="iiToken">[PERSON_1]</span> declined an
                    ambulance at the scene and provided{" "}
                    <span className="iiToken">[PHONE_1]</span> for follow-up.
                  </p>
                ) : (
                  <p>
                    At approximately 8:15 pm,{" "}
                    <span className="iiToken">[PERSON_1]</span> slipped near the
                    pool entrance at{" "}
                    <span className="iiToken">[BUSINESS_1]</span>.{" "}
                    <span className="iiToken">[PERSON_1]</span> provided{" "}
                    <span className="iiToken">[PHONE_1]</span> for follow-up.
                  </p>
                )}
              </div>

              <dl className="iiLedger" aria-live="polite">
                <div>
                  <dt>Key details kept</dt>
                  <dd data-tone={simulateDrift ? "warn" : "ok"}>
                    {simulateDrift ? "3 of 4" : "4 of 4"}
                  </dd>
                </div>
                <div>
                  <dt>Important refusals</dt>
                  <dd data-tone={simulateDrift ? "warn" : "ok"}>
                    {simulateDrift ? "Dropped" : "Kept"}
                  </dd>
                </div>
                <div>
                  <dt>Made-up details</dt>
                  <dd data-tone="ok">0</dd>
                </div>
                <div>
                  <dt>Ready to save</dt>
                  <dd data-tone={simulateDrift ? "warn" : "ok"}>
                    {simulateDrift ? "Review needed" : "Yes"}
                  </dd>
                </div>
              </dl>

              {simulateDrift && (
                <p className="iiWarn" role="status">
                  A refusal from your notes is missing (declining an ambulance).
                  Review the draft before saving.
                </p>
              )}

              <div className="iiInsight" aria-live="polite">
                <Check />
                <p>
                  <strong>Every draft is cross-checked against your notes.</strong>{" "}
                  If a detail is dropped, added, or reworded, it is flagged
                  before saving.
                </p>
              </div>

              <button
                type="button"
                className="iiAction"
                aria-pressed={simulateDrift}
                onClick={() => setSimulateDrift(!simulateDrift)}
              >
                {simulateDrift ? "Show clean draft" : "Test a missing detail"}
              </button>
            </>
          )}

          {view === 3 && (
            <>
              <div className="iiSheet" aria-live="polite">
                <div className="iiSheetHead">
                  <strong>
                    {useLetterhead
                      ? "Harbourview Hotel · Vancouver, BC"
                      : "Standard Incident Report"}
                  </strong>
                  <span>Report #2026-104</span>
                </div>
                <p>
                  At approximately 8:15 pm,{" "}
                  <span className="iiRestored">Sarah Patel</span> slipped near
                  the pool entrance.{" "}
                  <span className="iiRestored">Sarah Patel</span> declined an
                  ambulance at the scene and provided{" "}
                  <span className="iiRestored">604-555-0192</span> for
                  follow-up.
                </p>
                <div className="iiSheetMeta">
                  <span>
                    <strong>Format:</strong> Printable PDF (Letter)
                  </span>
                  <span>
                    <strong>Record ID:</strong> 8f3a…c91e
                  </span>
                  <span>
                    <strong>Saved in:</strong> Your browser only
                  </span>
                </div>
              </div>

              <div className="iiInsight" aria-live="polite">
                <Check />
                <p>
                  <strong>Completed offline on your device.</strong> Real names
                  are restored locally, your letterhead is applied, and your PDF
                  is ready to print or file.
                </p>
              </div>

              <button
                type="button"
                className="iiAction"
                aria-pressed={useLetterhead}
                onClick={() => setUseLetterhead(!useLetterhead)}
              >
                {useLetterhead
                  ? "Hide hotel letterhead"
                  : "Show hotel letterhead"}
              </button>
            </>
          )}
        </div>
      </div>
      <figcaption>Interactive preview with sample hotel notes.</figcaption>
    </figure>
  );
}
