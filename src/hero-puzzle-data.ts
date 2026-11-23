export type ShiftCode = "AM" | "Mid" | "PM";
export type HeroCellValue = ShiftCode | "Off" | "Leave";
export type HeroModeId = "manual" | "balanced" | "request";
export type HeroStageState = "scattered" | "harmonic" | "tradeoff";

export interface HeroDaySpec {
  readonly short: string;
  readonly full: string;
  readonly required: Record<ShiftCode, number>;
  readonly requiredCount: number;
  readonly peak: boolean;
}

export interface HeroTeamMember {
  readonly name: string;
  readonly workDays: number;
  readonly preferredShifts: readonly ShiftCode[];
  readonly hardOffDays?: readonly number[];
  readonly leaveDays?: readonly number[];
  readonly requestedOffDay?: number;
  readonly constraintSummary: string;
}

export interface HeroModeSpec {
  readonly id: HeroModeId;
  readonly label: string;
  readonly harmony: number;
  readonly dataState: HeroStageState;
  readonly grid: readonly (readonly HeroCellValue[])[];
  readonly heading: string;
  readonly summary: string;
}

export interface TightTurnaround {
  readonly row: number;
  readonly pmDay: number;
  readonly amDay: number;
}

export interface ShiftMismatch {
  readonly row: number;
  readonly day: number;
  readonly shift: ShiftCode;
}

export interface HeroScheduleAnalysis {
  readonly coveredShifts: number;
  readonly requiredShifts: number;
  readonly hardRulesMet: boolean;
  readonly tightTurnarounds: readonly TightTurnaround[];
  readonly consecutiveRestCount: number;
  readonly shiftMismatches: readonly ShiftMismatch[];
  readonly morganSunOff: boolean;
}

export interface HeroCellMeta {
  readonly isTightPair: boolean;
  readonly isTightMorning: boolean;
  readonly isConsecutiveRest: boolean;
  readonly isSplitOff: boolean;
  readonly isLeave: boolean;
  readonly isPreferenceTradeoff: boolean;
}

export const HERO_DAYS: readonly HeroDaySpec[] = [
  {
    short: "Mon",
    full: "Monday",
    required: { AM: 1, Mid: 1, PM: 1 },
    requiredCount: 3,
    peak: false,
  },
  {
    short: "Tue",
    full: "Tuesday",
    required: { AM: 1, Mid: 1, PM: 1 },
    requiredCount: 3,
    peak: false,
  },
  {
    short: "Wed",
    full: "Wednesday",
    required: { AM: 1, Mid: 1, PM: 1 },
    requiredCount: 3,
    peak: false,
  },
  {
    short: "Thu",
    full: "Thursday",
    required: { AM: 1, Mid: 1, PM: 1 },
    requiredCount: 3,
    peak: false,
  },
  {
    short: "Fri",
    full: "Friday",
    required: { AM: 2, Mid: 1, PM: 1 },
    requiredCount: 4,
    peak: true,
  },
  {
    short: "Sat",
    full: "Saturday",
    required: { AM: 2, Mid: 1, PM: 1 },
    requiredCount: 4,
    peak: true,
  },
  {
    short: "Sun",
    full: "Sunday",
    required: { AM: 2, Mid: 1, PM: 1 },
    requiredCount: 4,
    peak: true,
  },
];

export const HERO_TEAM: readonly HeroTeamMember[] = [
  {
    name: "Alex",
    workDays: 5,
    preferredShifts: ["AM"],
    constraintSummary: "Prefers AM",
  },
  {
    name: "Morgan",
    workDays: 5,
    preferredShifts: ["AM"],
    requestedOffDay: 6,
    constraintSummary: "Prefers AM · Wants Sun off",
  },
  {
    name: "Jamie",
    workDays: 5,
    preferredShifts: ["PM"],
    hardOffDays: [0],
    constraintSummary: "No Mon · Prefers PM",
  },
  {
    name: "Sam",
    workDays: 5,
    preferredShifts: ["Mid"],
    constraintSummary: "Prefers Mid",
  },
  {
    name: "Elena",
    workDays: 4,
    preferredShifts: ["AM", "Mid", "PM"],
    leaveDays: [3, 4],
    constraintSummary: "Leave Thu–Fri",
  },
];

export const HERO_MODES: readonly HeroModeSpec[] = [
  {
    id: "manual",
    label: "Manual draft",
    harmony: 0,
    dataState: "scattered",
    grid: [
      ["AM", "Off", "AM", "Off", "PM", "AM", "AM"],
      ["PM", "AM", "Off", "AM", "AM", "Off", "AM"],
      ["Off", "Off", "PM", "PM", "Mid", "PM", "PM"],
      ["Mid", "Mid", "Off", "Mid", "AM", "Mid", "Off"],
      ["Off", "PM", "Mid", "Leave", "Leave", "AM", "Mid"],
    ],
    heading: "Coverage is filled. The week is still fragile.",
    summary:
      "Every shift is covered and hard rules hold, yet two tight PM-to-AM turnarounds, four split breaks, and four shift mismatches remain.",
  },
  {
    id: "balanced",
    label: "Balance shifts",
    harmony: 1,
    dataState: "harmonic",
    grid: [
      ["Off", "Off", "AM", "AM", "AM", "AM", "AM"],
      ["AM", "AM", "Off", "Off", "AM", "AM", "AM"],
      ["Off", "Off", "PM", "PM", "PM", "PM", "PM"],
      ["Mid", "Mid", "Mid", "Mid", "Mid", "Off", "Off"],
      ["PM", "PM", "Off", "Leave", "Leave", "Mid", "Mid"],
    ],
    heading: "Thirteen assignments shift together to settle the week.",
    summary:
      "Zero tight turnarounds, consecutive rest for all five team members, and every preferred shift met. Trade-off: Morgan works Sunday.",
  },
  {
    id: "request",
    label: "Honor Sun off",
    harmony: 0.78,
    dataState: "tradeoff",
    grid: [
      ["Off", "Off", "Mid", "Mid", "AM", "AM", "AM"],
      ["AM", "AM", "AM", "AM", "AM", "Off", "Off"],
      ["Off", "Off", "PM", "PM", "PM", "PM", "PM"],
      ["Mid", "Mid", "Off", "Off", "Mid", "Mid", "Mid"],
      ["PM", "PM", "Off", "Leave", "Leave", "AM", "AM"],
    ],
    heading: "Honoring one Sunday request reshapes four people’s weeks.",
    summary:
      "Morgan gets Saturday and Sunday off with zero tight turnarounds and full weekend coverage. Trade-off: Alex takes two midweek Mid shifts.",
  },
];

function isShiftCode(value: HeroCellValue): value is ShiftCode {
  return value === "AM" || value === "Mid" || value === "PM";
}

function hasContiguousRest(rowCells: readonly HeroCellValue[]): boolean {
  const restIndices: number[] = [];
  for (let d = 0; d < rowCells.length; d++) {
    if (rowCells[d] === "Off" || rowCells[d] === "Leave") {
      restIndices.push(d);
    }
  }
  if (restIndices.length === 0) return false;
  for (let i = 1; i < restIndices.length; i++) {
    if (restIndices[i] !== restIndices[i - 1] + 1) return false;
  }
  return true;
}

export function analyzeHeroSchedule(
  grid: readonly (readonly HeroCellValue[])[],
): HeroScheduleAnalysis {
  let coveredShifts = 0;
  let requiredShifts = 0;

  for (let d = 0; d < HERO_DAYS.length; d++) {
    const counts: Record<ShiftCode, number> = { AM: 0, Mid: 0, PM: 0 };
    for (let r = 0; r < HERO_TEAM.length; r++) {
      const cell = grid[r][d];
      if (isShiftCode(cell)) counts[cell]++;
    }
    const req = HERO_DAYS[d].required;
    coveredShifts +=
      Math.min(counts.AM, req.AM) +
      Math.min(counts.Mid, req.Mid) +
      Math.min(counts.PM, req.PM);
    requiredShifts += HERO_DAYS[d].requiredCount;
  }

  let hardRulesMet = true;
  const tightTurnarounds: TightTurnaround[] = [];
  let consecutiveRestCount = 0;
  const shiftMismatches: ShiftMismatch[] = [];

  for (let r = 0; r < HERO_TEAM.length; r++) {
    const person = HERO_TEAM[r];
    const rowCells = grid[r];

    let worked = 0;
    for (let d = 0; d < HERO_DAYS.length; d++) {
      const cell = rowCells[d];
      if (isShiftCode(cell)) {
        worked++;
        if (!person.preferredShifts.includes(cell)) {
          shiftMismatches.push({ row: r, day: d, shift: cell });
        }
      }
      if (d < HERO_DAYS.length - 1 && cell === "PM" && rowCells[d + 1] === "AM") {
        tightTurnarounds.push({ row: r, pmDay: d, amDay: d + 1 });
      }
    }

    if (worked !== person.workDays) hardRulesMet = false;
    if (person.hardOffDays?.some((d) => rowCells[d] !== "Off")) {
      hardRulesMet = false;
    }
    if (person.leaveDays?.some((d) => rowCells[d] !== "Leave")) {
      hardRulesMet = false;
    }
    if (hasContiguousRest(rowCells)) {
      consecutiveRestCount++;
    }
  }

  const morganIndex = HERO_TEAM.findIndex((p) => p.requestedOffDay !== undefined);
  const morganReqDay =
    morganIndex >= 0 ? HERO_TEAM[morganIndex].requestedOffDay : undefined;
  const morganSunOff =
    morganIndex >= 0 &&
    morganReqDay !== undefined &&
    grid[morganIndex][morganReqDay] === "Off";

  return {
    coveredShifts,
    requiredShifts,
    hardRulesMet,
    tightTurnarounds,
    consecutiveRestCount,
    shiftMismatches,
    morganSunOff,
  };
}

export function getCellMeta(
  grid: readonly (readonly HeroCellValue[])[],
  row: number,
  day: number,
): HeroCellMeta {
  const rowCells = grid[row];
  const cell = rowCells[day];
  const person = HERO_TEAM[row];
  const contiguous = hasContiguousRest(rowCells);

  const isTightPair =
    day < HERO_DAYS.length - 1 && cell === "PM" && rowCells[day + 1] === "AM";
  const isTightMorning =
    day > 0 && rowCells[day - 1] === "PM" && cell === "AM";
  const isConsecutiveRest = cell === "Off" && contiguous;
  const isSplitOff = cell === "Off" && !contiguous;
  const isLeave = cell === "Leave";
  const isPreferenceTradeoff =
    isShiftCode(cell) && !person.preferredShifts.includes(cell);

  return {
    isTightPair,
    isTightMorning,
    isConsecutiveRest,
    isSplitOff,
    isLeave,
    isPreferenceTradeoff,
  };
}
