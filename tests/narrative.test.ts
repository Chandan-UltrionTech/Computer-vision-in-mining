import { test } from "node:test";
import assert from "node:assert/strict";
import { narrativeAt, BEATS } from "../src/experience/core/types";
test("physical operation precedes CV observation and explanation", () => {
  assert.equal(narrativeAt(0.1, true), "normal");
  assert.equal(narrativeAt(BEATS.problem, true), "problem");
  assert.equal(narrativeAt(BEATS.observing, true), "observing");
  assert.equal(narrativeAt(BEATS.solution, true), "solution");
  assert.equal(narrativeAt(BEATS.result, true), "result");
  assert.equal(narrativeAt(BEATS.dormant, true), "normal");
});
test("physical transition scenes do not fabricate CV events", () => {
  for (const progress of [0, 0.25, 0.5, 0.75, 1])
    assert.equal(narrativeAt(progress, false), "normal");
});
test("reverse scroll restores the problem before the solution", () => {
  assert.deepEqual(
    [0.85, 0.6, 0.45, 0.3, 0.1].map((p) => narrativeAt(p, true)),
    ["result", "solution", "observing", "problem", "normal"],
  );
});
