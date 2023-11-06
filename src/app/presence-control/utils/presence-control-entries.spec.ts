import { searchEntries } from "src/app/shared/utils/search";
import { buildLessonPresence } from "src/spec-builders";
import { PresenceControlEntry } from "../models/presence-control-entry.model";

describe("presence control entries utils", () => {
  let bichsel: PresenceControlEntry;
  let frisch: PresenceControlEntry;
  let jenni: PresenceControlEntry;

  beforeEach(() => {
    bichsel = buildPresenceControlEntry("Bichsel Peter");
    frisch = buildPresenceControlEntry("Frisch Max");
    jenni = buildPresenceControlEntry("Zoë Jenny");
  });

  describe("searchPresenceControlEntries", () => {
    it("returns all entries for empty term", () => {
      const result = searchEntries([bichsel, frisch, jenni], "");
      expect(result).toEqual([bichsel, frisch, jenni]);
    });

    it("returns entries where student name matches term", () => {
      const result = searchEntries([bichsel, frisch, jenni], "ch");
      expect(result).toEqual([bichsel, frisch]);
    });

    it("ignores case", () => {
      const result = searchEntries([bichsel, frisch, jenni], "fri");
      expect(result).toEqual([frisch]);
    });

    it("normalizes special characters", () => {
      const result = searchEntries([bichsel, frisch, jenni], "Zoe");
      expect(result).toEqual([jenni]);
    });
  });

  function buildPresenceControlEntry(
    studentName: string,
  ): PresenceControlEntry {
    return new PresenceControlEntry(
      buildLessonPresence(
        1,
        new Date(2000, 0, 23, 8, 0),
        new Date(2000, 0, 23, 9, 0),
        "Deutsch",
        studentName,
      ),
      null,
      null,
    );
  }
});
