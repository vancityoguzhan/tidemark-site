// Illustrative alternatives for the same week, not consecutive weeks or solver output.
export const people = [
  {
    name: "Harper",
    initials: "HL",
    shifts: ["AM", "AM", "AM", "PM", "PM", "OFF", "OFF"],
  },
  {
    name: "Oliver",
    initials: "OW",
    shifts: ["AM", "AM", "AM", "PM", "PM", "OFF", "OFF"],
  },
  {
    name: "Maya",
    initials: "MP",
    shifts: ["AM", "AM", "PM", "PM", "PM", "OFF", "OFF"],
  },
];

// Each candidate keeps five shifts per person and daily AM/PM coverage.
// PM -> AM is excluded, including Saturday -> Sunday if a week were repeated.
export const candidateWeeks = [
  [
    ["AM", "AM", "AM", "OFF", "PM", "PM", "OFF"],
    ["AM", "OFF", "PM", "PM", "OFF", "AM", "AM"],
    ["PM", "PM", "OFF", "AM", "AM", "OFF", "PM"],
  ],
  [
    ["AM", "PM", "OFF", "AM", "PM", "OFF", "AM"],
    ["OFF", "AM", "PM", "PM", "OFF", "AM", "AM"],
    ["PM", "OFF", "AM", "OFF", "AM", "PM", "PM"],
  ],
  [
    ["OFF", "AM", "PM", "PM", "OFF", "AM", "AM"],
    ["PM", "OFF", "AM", "OFF", "AM", "AM", "PM"],
    ["AM", "PM", "OFF", "AM", "PM", "PM", "OFF"],
  ],
];
export const settledWeek = [
  ["OFF", "OFF", "AM", "AM", "AM", "PM", "PM"],
  ["PM", "PM", "OFF", "OFF", "AM", "AM", "AM"],
  ["AM", "AM", "PM", "PM", "PM", "OFF", "OFF"],
];

// Keep each animated tile's identity when multiple tiles have the same label.
export function tileOrder(week: string[][], row: number) {
  const unused = people[row].shifts.map((_, token) => token);
  return week[row].map((shift) => {
    const index = unused.findIndex(
      (token) => people[row].shifts[token] === shift,
    );
    return unused.splice(index, 1)[0];
  });
}
