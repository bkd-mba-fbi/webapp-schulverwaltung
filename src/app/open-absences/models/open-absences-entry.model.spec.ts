import { OpenAbsencesEntry } from "./open-absences-entry.model";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { buildLessonPresenceWithIds } from "src/spec-builders";

describe("OpenAbsencesEntry", () => {
  let presenceA: LessonPresence;
  let presenceB: LessonPresence;

  beforeEach(() => {
    presenceA = buildLessonPresenceWithIds(
      10,
      21,
      11,
      new Date(2000, 0, 23, 12),
    );
    presenceB = buildLessonPresenceWithIds(
      11,
      21,
      11,
      new Date(2000, 0, 23, 13),
    );
    [presenceA, presenceB].forEach(
      (p) => (p.StudentFullName = "Albert Einstein"),
    );

    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2000, 0, 23, 8, 30));
  });

  afterEach(() => jasmine.clock().uninstall());

  it("throws an execption if initialized with an empty array", () => {
    expect(() => new OpenAbsencesEntry([])).toThrow(
      new Error("Absences array is empty"),
    );
  });
});
