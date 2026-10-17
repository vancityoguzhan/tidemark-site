import assert from "node:assert/strict";
import test from "node:test";
import {
  people,
  candidateWeeks,
  settledWeek,
  tileOrder,
} from "../src/schedule-motion-data.ts";

for (const [index, week] of [...candidateWeeks, settledWeek].entries()) {
  test(`illustrated week ${index + 1}: coverage, workload, and safe transitions`, () => {
    assert.equal(week.length, people.length);
    for (const [row, days] of week.entries()) {
      assert.equal(days.length, 7);
      assert.deepEqual([...days].sort(), [...people[row].shifts].sort());
      for (let day = 0; day < 7; day++) {
        assert.ok(
          !(days[day] === "PM" && days[(day + 1) % 7] === "AM"),
          `${people[row].name}: late-to-early after day ${day}`,
        );
      }
      const order = tileOrder(week, row);
      assert.equal(new Set(order).size, 7);
      assert.deepEqual(
        order.map((token) => people[row].shifts[token]),
        days,
      );
    }
    for (let day = 0; day < 7; day++) {
      const shifts = week.map((row) => row[day]);
      assert.ok(
        shifts.includes("AM") && shifts.includes("PM"),
        `missing coverage on day ${day}`,
      );
    }
  });
}
test("the final week gives everyone adjacent days off; candidates show split days", () => {
  for (const row of settledWeek)
    assert.ok(row.some((shift, i) => shift === "OFF" && row[i + 1] === "OFF"));
  for (const week of candidateWeeks)
    for (const row of week)
      assert.ok(
        !row.some((shift, i) => shift === "OFF" && row[(i + 1) % 7] === "OFF"),
      );
});
