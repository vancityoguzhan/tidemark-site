import { useEffect, useRef, useState } from "react";
import "./fresh.css";
import ProductIllustration from "./ProductIllustration";

const screens = [
  {
    name: "The weekly schedule",
    title: "See the week. See the people.",
    text: "Review assignments, days off and the compromises that need your attention. Keep important decisions, make adjustments, and publish when you’re ready.",
  },
  {
    name: "Staffing needs",
    title: "Start with what the hotel needs.",
    text: "Set your usual coverage, then account for busier arrival and departure days with staffing rules.",
  },
  {
    name: "Team requests",
    title: "Keep the requests in the picture.",
    text: "Bring pending and approved time off into view alongside the week you’re planning.",
  },
  {
    name: "Leave planning",
    title: "Explore before you promise.",
    text: "Consider time-off requests together and check the effect on coverage. Your live schedule stays untouched.",
  },
];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const names = ["Alex", "Morgan", "Jamie"];
const scattered = [
  [0, 3],
  [1, 5],
  [2, 6],
];
const together = [
  [0, 1],
  [3, 4],
  [5, 6],
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
  const [rest, setRest] = useState(false);
  const [screen, setScreen] = useState(0);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
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
  const shot = screens[screen];
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
      <header className="fHeader fWidth">
        <a className="fBrand" href="#ftop" aria-label="TideMark home">
          <Brand />
        </a>
        <nav aria-label="Main navigation">
          <a href="#fshift">Shift</a>
          <a href="#fapproach">How it works</a>
          <a href="#fstory">Our story</a>
        </nav>
        <a className="fHeaderAction" href="#fcontact">
          Let’s talk <Arrow />
        </a>
      </header>
      <main id="fmain">
        <section className="fHero fWidth" id="ftop">
          <div className="fHeroCopy">
            <h1>A better week starts here.</h1>
            <p>
              TideMark Shift tests scheduling combinations against your staffing
              rules, days off, and team preferences so you don’t have to.
            </p>
            <a className="fButton" href="#fcontact">
              Request a walkthrough <Arrow />
            </a>
          </div>
          <div className="fWeekStage">
            <div className="fWeekIntro">
              <span>A week, reconsidered.</span>
              <svg viewBox="0 0 64 32" aria-hidden="true">
                <path
                  d="M2 24C16 5 28 7 32 17s16 7 30-11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="fWeekPaper">
              <div className="fWeekTop">
                <strong>The team’s week</strong>
              </div>
              <table className="fRoster">
                <caption className="fSr">
                  Fictional week showing {rest ? "consecutive" : "scattered"}{" "}
                  days off. Each person works five days.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="fSr">Team member</span>
                    </th>
                    {weekdays.map((day) => (
                      <th key={day} scope="col">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {names.map((name, row) => (
                    <tr key={name}>
                      <th scope="row">{name}</th>
                      {weekdays.map((day, col) => (
                        <td key={day}>
                          <span
                            className={
                              (rest ? together : scattered)[row].includes(col)
                                ? "fOff"
                                : "fWork"
                            }
                          >
                            {(rest ? together : scattered)[row].includes(
                              col,
                            ) ? (
                              "Off"
                            ) : (
                              <>
                                <span className="fSr">Working</span>
                                <span aria-hidden="true">—</span>
                              </>
                            )}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="fWeekLegend">
                <span>
                  <i /> Days off
                </span>
                <span>Same people. Five workdays each.</span>
              </div>
            </div>
            <div className="fWeekResult" aria-live="polite" aria-atomic="true">
              <strong>
                {rest
                  ? "A little more room to switch off."
                  : "A day off. Then back again."}
              </strong>
              <p>
                {rest
                  ? "Days off sit together in this example. In Shift, your staffing rules and priorities guide the search."
                  : "Scattered breaks can make a week feel longer. Explore a different arrangement."}
              </p>
            </div>
            <div
              className="fWeekChoices"
              role="group"
              aria-label="Compare illustrative weeks"
            >
              <button
                type="button"
                aria-pressed={!rest}
                onClick={() => setRest(false)}
              >
                Scattered breaks
              </button>
              <button
                type="button"
                aria-pressed={rest}
                onClick={() => setRest(true)}
              >
                Days off together <Arrow />
              </button>
            </div>
            <p className="fIllustrationNote">
              A simple illustration, not a live scheduling calculation.
            </p>
          </div>
        </section>
        <div className="fPrinciple fWidth">
          <p>
            Built around your rules and your team’s rest, with the final call
            always yours.
          </p>
          <a href="#fshift">
            Explore Shift <Arrow />
          </a>
        </div>
        <section className="fProduct" id="fshift">
          <div className="fWidth">
            <div className="fSectionHead">
              <h2>The real week. All in view.</h2>
              <p>
                From staffing needs to the schedule you publish, keep the
                decisions close to the people they affect.
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
        <section className="fApproach fWidth" id="fapproach">
          <div className="fSectionHead">
            <h2>You know your team. Shift helps with the week.</h2>
            <p>
              A schedule is more than filled cells. It is a set of decisions
              about coverage, rest and competing preferences.
            </p>
          </div>
          <ol className="fSteps">
            <li>
              <div>
                <h3>Set your staffing rules and preferences.</h3>
                <p>
                  Set coverage, qualifications and availability. Bring in
                  approved leave, requests and your team’s preferences.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h3>Let it work through the combinations.</h3>
                <p>
                  Build around your rules and priorities, including consecutive
                  breaks, preferred shifts and difficult turnarounds.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h3>Review the people, then the plan.</h3>
                <p>
                  Check each person’s week and the remaining compromises. Keep
                  assignments or make changes. Publish when you’re ready.
                </p>
              </div>
            </li>
          </ol>
          <details className="fDetails">
            <summary>
              Does Shift always find the best possible schedule?
            </summary>
            <p>
              Shift searches for a schedule under your configured rules and
              priorities. A time-limited search can return a workable result
              without proving it is the best possible one. Availability and
              competing needs can mean not every preference is met. You review
              the result before publishing.
            </p>
          </details>
        </section>
        <section className="fIncident">
          <div className="fWidth fIncidentGrid">
            <div>
              <h2>After the unexpected, a clearer record.</h2>
              <p>
                TideMark Incident is a separate companion for incident
                reporting. Turn shift notes into a structured draft, with
                follow-up questions to help fill the gaps. Review the facts
                before signing off.
              </p>
              <a className="fTextLink" href="#fcontact">
                Ask about Incident <Arrow />
              </a>
            </div>
            <div className="fIncidentExample">
              <h3>Sample follow-up question</h3>
              <blockquote>“There was water near the pool entrance.”</blockquote>
              <p>
                Was a wet-floor sign in place, and what action was taken
                afterward?
              </p>
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
              I work in hotel operations in British Columbia. The hardest part
              of scheduling wasn’t filling the cells. It was wondering whether
              one more change could give someone a better week without leaving
              the hotel short.
            </p>
            <p>
              I built Shift to carry that mental workload, so I could spend more
              time on the team and the hotel.
            </p>
            <a
              className="fFounder"
              href="https://www.linkedin.com/in/oguzhangur"
              target="_blank"
              rel="noreferrer"
            >
              <strong>Oguzhan Gur</strong>
              <span>Hotel operator & TideMark creator</span>
              <span className="fSr">LinkedIn, opens in a new tab</span>
            </a>
          </div>
        </section>
        <section className="fContact" id="fcontact">
          <div className="fWidth fContactGrid">
            <div>
              <h2>Let’s look at your week.</h2>
              <p>
                Tell me about your team and what makes scheduling hard. I’ll
                reply personally to arrange a walkthrough and discuss whether a
                pilot fits your property.
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
                  <h3>Your request is on its way.</h3>
                  <p>
                    Thank you. Oguzhan will reply to the email you provided to
                    discuss a walkthrough.
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
                      placeholder="Your team, your property, or the part of scheduling you’d like to make easier."
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
                    Sent directly to Oguzhan. No automated marketing emails.
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
        <p>Built in British Columbia for hotel operations teams.</p>
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
