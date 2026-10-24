import { useState } from "react";
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const people = ["Alex Chen", "Morgan Lee", "Jamie Patel", "Sam Rivera"];
const roster = [
  ["Off", "Off", "AM", "AM", "AM", "PM", "PM"],
  ["AM", "PM", "Off", "Off", "PM", "PM", "AM"],
  ["PM", "AM", "AM", "PM", "Off", "Off", "PM"],
  ["AM", "PM", "PM", "AM", "AM", "Off", "Off"],
];
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
export default function ProductIllustration({ view }: { view: number }) {
  const [busy, setBusy] = useState(true);
  const [pending, setPending] = useState(true);
  const [overlap, setOverlap] = useState(false);
  const [kept, setKept] = useState(true);
  const titles = [
    "The weekly schedule",
    "Staffing needs",
    "Time off & preferences",
    "Leave planner",
  ];
  return (
    <figure className="piFigure">
      <div className="piStage">
        <div className="piAppBar">
          <span className="piWordmark">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 8q9-9 18-3M3 14q9-9 18-3M3 20q9-9 18-3"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
            Shift
          </span>
          <span>Front desk</span>
          <span className="piDemoLabel">Product illustration</span>
        </div>
        <div className="piCanvas">
          <div className="piHeading">
            <div>
              <h3>{titles[view]}</h3>
              <p>
                {view === 3
                  ? "Explore an absence before making a promise."
                  : "October 18–24 · Example week"}
              </p>
            </div>
            <span className="piState">
              {view === 0
                ? "Draft"
                : view === 1
                  ? "Coverage guide"
                  : view === 2
                    ? "Calendar"
                    : "Preview only"}
            </span>
          </div>
          {view === 0 && (
            <>
              <div className="piToolbar">
                <span>Front desk team</span>
                <span>AM · Morning / PM · Evening</span>
              </div>
              <table className="piTable piRoster">
                <caption className="fSr">
                  Illustrative weekly roster. Four fictional employees, five
                  shifts and two consecutive days off each.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Team</th>
                    {days.map((d, i) => (
                      <th scope="col" key={d}>
                        {d}
                        <small>{18 + i}</small>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {people.map((name, row) => (
                    <tr key={name}>
                      <th scope="row">
                        <span>{name}</span>
                        <small>
                          {row === 3 ? "Guest services" : "Front desk"}
                        </small>
                      </th>
                      {roster[row].map((shift, col) => (
                        <td key={col}>
                          <span
                            className={`piShift ${shift === "Off" ? "piRest" : shift === "PM" ? "piEvening" : ""}`}
                          >
                            <strong>{shift}</strong>
                            {shift !== "Off" && (
                              <small>
                                {shift === "AM" ? "07–15" : "15–23"}
                              </small>
                            )}
                            {row === 0 && col === 2 && kept && (
                              <span
                                className="piKept"
                                aria-label="Kept assignment"
                              >
                                Kept
                              </span>
                            )}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="piInsight" aria-live="polite">
                <Check />
                <p>
                  <strong>A week to review.</strong> Days off together. Each
                  person’s shifts in view.
                </p>
              </div>
              <button
                className="piAction"
                aria-pressed={kept}
                onClick={() => setKept(!kept)}
              >
                {kept
                  ? "Release Alex’s Tuesday assignment"
                  : "Keep Alex’s Tuesday assignment"}
              </button>
            </>
          )}
          {view === 1 && (
            <>
              <div className="piRule">
                <div>
                  <span className="piRuleIcon" aria-hidden="true">
                    +1
                  </span>
                  <div>
                    <strong>High demand · Front desk</strong>
                    <p>
                      When arrivals + departures exceed 150, add a mid shift.
                    </p>
                  </div>
                </div>
                <span className="piTag">Approved rule</span>
              </div>
              <div className="piToolbar">
                <span>Required team members</span>
                <span>Base guide + staffing rules</span>
              </div>
              <table className="piTable piNeeds">
                <caption className="fSr">
                  Illustrative staffing requirements. Friday’s mid shift
                  increases from one to two when the high-demand example is
                  active.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Shift</th>
                    {days.map((d) => (
                      <th scope="col" key={d}>
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {["Morning", "Mid", "Evening"].map((label, row) => (
                    <tr key={label}>
                      <th scope="row">
                        {label}
                        <small>
                          {["07:00–15:00", "11:00–19:00", "15:00–23:00"][row]}
                        </small>
                      </th>
                      {days.map((d, col) => (
                        <td key={d}>
                          <span
                            className={
                              row === 1 && col === 5 && busy ? "piAdjusted" : ""
                            }
                          >
                            {row === 1 ? (col === 5 && busy ? "2" : "1") : "2"}
                            {row === 1 && col === 5 && busy && (
                              <small>+1</small>
                            )}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="piInsight" aria-live="polite">
                <Check />
                <p>
                  <strong>
                    {busy
                      ? "Friday’s mid shift has extra coverage."
                      : "Friday follows the base coverage guide."}
                  </strong>{" "}
                  {busy
                    ? "180 arrivals + departures in this example."
                    : "120 arrivals + departures in this example."}
                </p>
              </div>
              <button
                className="piAction"
                aria-pressed={busy}
                onClick={() => setBusy(!busy)}
              >
                {busy ? "Compare a quieter Friday" : "Explore a busier Friday"}
              </button>
            </>
          )}
          {view === 2 && (
            <>
              <div className="piRequestStats">
                <span>
                  <strong>{pending ? "3" : "1"}</strong>{" "}
                  {pending ? "requests shown" : "request shown"}
                </span>
                <span className="piPendingLabel">2 pending review</span>
                <span className="piApprovedLabel">1 approved</span>
              </div>
              <div
                className="piCalendar"
                role="table"
                aria-label="Illustrative time-off calendar, October 18 to 31"
              >
                <div className="piCalWeek" role="row">
                  {days.map((d) => (
                    <span role="columnheader" key={d}>
                      {d}
                    </span>
                  ))}
                </div>
                {[0, 1].map((week) => (
                  <div className="piCalRow" role="row" key={week}>
                    {days.map((d, col) => {
                      const date = 18 + week * 7 + col;
                      return (
                        <div role="cell" className="piCalDay" key={d}>
                          <span>{date}</span>
                          {[19, 20].includes(date) && (
                            <span className="piCalendarEvent piApproved">
                              <span>Jamie</span>
                              <small>Approved</small>
                            </span>
                          )}
                          {pending && [21, 22].includes(date) && (
                            <span className="piCalendarEvent piPending">
                              <span>Alex</span>
                              <small>Pending</small>
                            </span>
                          )}
                          {pending && date === 23 && (
                            <span className="piCalendarEvent piPending">
                              <span>Morgan</span>
                              <small>Pending</small>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <ul className="piCalendarSummary">
                <li>
                  <strong>Jamie</strong>
                  <span>Oct 19–20</span>
                  <span className="piApprovedLabel">Approved</span>
                </li>
                {pending && (
                  <>
                    <li>
                      <strong>Alex</strong>
                      <span>Oct 21–22</span>
                      <span className="piPendingLabel">Pending</span>
                    </li>
                    <li>
                      <strong>Morgan</strong>
                      <span>Oct 23</span>
                      <span className="piPendingLabel">Pending</span>
                    </li>
                  </>
                )}
              </ul>
              <div className="piInsight" aria-live="polite">
                <Check />
                <p>
                  <strong>Requests stay distinct from decisions.</strong>{" "}
                  Pending time off is still awaiting review.
                </p>
              </div>
              <button
                className="piAction"
                aria-pressed={!pending}
                onClick={() => setPending(!pending)}
              >
                {pending ? "Show approved only" : "Show all requests"}
              </button>
            </>
          )}
          {view === 3 && (
            <>
              <div className="piAbsence">
                <span className="piAvatar" aria-hidden="true">
                  AC
                </span>
                <div>
                  <strong>Alex Chen</strong>
                  <span>October 22–23</span>
                </div>
                <span className="piTag">Vacation</span>
              </div>
              <div className="piOverlap">
                <span className="piAvatar" aria-hidden="true">
                  ML
                </span>
                <div>
                  <strong>Morgan Lee</strong>
                  <span>October 23 · Pending request</span>
                </div>
                <button
                  aria-pressed={overlap}
                  onClick={() => setOverlap(!overlap)}
                >
                  {overlap ? "Included" : "Include"}
                  <span className="fSr">
                    {" "}
                    Morgan’s overlapping request in this example
                  </span>
                </button>
              </div>
              <div className="piCoverage" aria-live="polite">
                <div>
                  <strong>Example coverage check</strong>
                  <span>Thursday / Friday</span>
                </div>
                <div className="piCoverageDays">
                  <div>
                    <span>Thu 22</span>
                    <strong>Covered</strong>
                    <span className="piCoverageBar" />
                  </div>
                  <div className={overlap ? "piNeedsReview" : ""}>
                    <span>Fri 23</span>
                    <strong>{overlap ? "Review needed" : "Covered"}</strong>
                    <span className="piCoverageBar" />
                  </div>
                </div>
                <p>
                  {overlap
                    ? "With both away, this sample leaves one Friday mid shift uncovered."
                    : "In this sample, coverage is possible while Alex is away."}
                </p>
              </div>
              <div className="piInsight" aria-live="polite">
                <Check />
                <p>
                  <strong>A preview, not an approval.</strong> No requests or
                  live assignments are changed.
                </p>
              </div>
              <p className="piStaticNote">
                Try including the overlapping request above.
              </p>
            </>
          )}
        </div>
      </div>
      <figcaption>
        Illustrative product view. Fictional data and sample outcomes.
      </figcaption>
    </figure>
  );
}
