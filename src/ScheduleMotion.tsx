import { useEffect, useState } from "react";

import {
  people,
  candidateWeeks,
  settledWeek,
  tileOrder,
} from "./schedule-motion-data";

const scenes = [
  {
    label: "The everyday puzzle",
    title: "One change. A week to rethink.",
    text: "Cover the busy shifts. Honour a preference. Find two days off together. Each change affects the rest of the week.",
  },
  {
    label: "The search",
    title: "Your rules. The combinations, explored.",
    text: "Shift searches possible schedules around your business needs and priorities—including preferences, rest, and fair shifts.",
  },
  {
    label: "Your decision",
    title: "A considered week. Ready for your review.",
    text: "Here, days off come together without late-to-early turnarounds. In Shift, you review the schedule and its trade-offs before publishing.",
  },
];
const stageStarts = [0, 5000, 11000];

export default function ScheduleMotion() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(preference.matches);
      if (preference.matches) setRunning(false);
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!running || reduced) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min(now - previous, 250);
      previous = now;
      if (!document.hidden)
        setElapsed((value) => Math.min(16000, value + delta));
    }, 100);
    return () => window.clearInterval(timer);
  }, [running, reduced]);
  useEffect(() => {
    if (elapsed >= 16000) setRunning(false);
  }, [elapsed]);
  const stage = reduced ? 2 : elapsed < 5000 ? 0 : elapsed < 11000 ? 1 : 2;
  const scene = scenes[stage];
  const started = elapsed > 0;
  const finished = elapsed >= 16000;
  const shuffle = stage === 1 ? Math.floor((elapsed - 5000) / 1500) + 1 : 0;
  function toggle() {
    if (finished) setElapsed(0);
    setRunning((value) => !value);
  }
  return (
    <section
      className={`scheduleMotion ${started ? "hasStarted" : ""} ${running ? "isPlaying" : ""}`}
      aria-labelledby="motionTitle"
      id="scheduleIllustration"
    >
      <div className="motionTop">
        <span className="eyebrow">The thinking behind Shift</span>
        <span className="motionDuration">Shift uses Google OR-Tools</span>
      </div>
      <div className="motionLayout">
        <div className="motionNarrative" aria-live="polite" aria-atomic="true">
          <span className="motionStep">
            0{stage + 1} / {scene.label}
          </span>
          <h3 id="motionTitle">{scene.title}</h3>
          <p>{scene.text}</p>
        </div>
        <div className="motionVisual" aria-hidden="true">
          <div className={`motionRoster phase${stage}`}>
            <div className="motionRosterHead">
              <span>An illustrative week</span>
              <span>
                {stage === 0
                  ? "Scattered days off"
                  : stage === 1
                    ? "Exploring combinations"
                    : "Days off, together"}
              </span>
            </div>
            <div className="motionDays">
              <span />
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <span key={i}>{day}</span>
              ))}
            </div>
            {people.map((person, row) => {
              const week =
                stage >= 2
                  ? settledWeek
                  : candidateWeeks[shuffle % candidateWeeks.length];
              const positions = tileOrder(week, row);
              return (
                <div className="motionPerson" key={person.name}>
                  <span className="motionPersonName">
                    <span className="personFull">{person.name}</span>
                    <span className="personInitials">{person.initials}</span>
                  </span>
                  <div className="motionAssignments">
                    {person.shifts.map((shift, token) => (
                      <span
                        key={token}
                        className={`motionTile ${shift === "OFF" ? "tileOff" : ""}`}
                        style={{
                          left: `${(positions.indexOf(token) * 100) / 7}%`,
                        }}
                      >
                        {shift === "OFF" ? "Off" : shift}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="motionCriteria">
              <span>
                <i className="legendShift" /> AM / PM · Working shifts
              </span>
              <span>
                <i className="legendOff" /> Off · Time to recharge
              </span>
            </div>
          </div>
        </div>
      </div>
      {!reduced && (
        <div
          className="motionChapters"
          role="group"
          aria-label="Illustration chapters"
        >
          {scenes.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={stage === index}
              onClick={() => {
                setElapsed(stageStarts[index]);
                setRunning(false);
              }}
            >
              <span>0{index + 1}</span> {item.label}
            </button>
          ))}
        </div>
      )}
      <div className="motionControls">
        {reduced ? (
          <span className="motionStill">
            Still illustration · Reduced motion enabled
          </span>
        ) : (
          <button
            type="button"
            onClick={toggle}
            aria-controls="scheduleIllustration"
          >
            <span aria-hidden="true">
              {running ? "Ⅱ" : finished ? "↺" : "▷"}
            </span>
            {running
              ? "Pause"
              : finished
                ? "Watch again"
                : started
                  ? "Continue"
                  : "Watch the idea in motion"}
          </button>
        )}
        <span className="motionFootnote">
          16-second illustration. Actual results depend on your team, rules, and
          priorities.
        </span>
      </div>
      {!reduced && (
        <div className="motionProgress" aria-hidden="true">
          <span style={{ width: `${elapsed / 160}%` }} />
        </div>
      )}
    </section>
  );
}
