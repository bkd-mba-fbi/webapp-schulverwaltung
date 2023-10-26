import {
  buildPresenceControlEntry,
  buildLessonPresenceWithIds,
} from "../../../spec-builders";
import { PresenceControlEntry } from "../../presence-control/models/presence-control-entry.model";
import { filterByGroup } from "./presence-control-entries";

describe("PresenceControlEntries", () => {
  describe(".filterByGroup", () => {
    let entries: ReadonlyArray<PresenceControlEntry>;
    let entry1: PresenceControlEntry;
    let entry2: PresenceControlEntry;
    let entry3: PresenceControlEntry;

    beforeEach(() => {
      entry1 = buildPresenceControlEntry(buildLessonPresenceWithIds(10, 1, 11));
      entry2 = buildPresenceControlEntry(buildLessonPresenceWithIds(10, 2, 11));
      entry3 = buildPresenceControlEntry(buildLessonPresenceWithIds(11, 3, 11));

      entries = [entry1, entry2, entry3];
    });

    it("does not filter entries if group is null", () => {
      const personIds = [1, 2, 3];

      expect(filterByGroup(null, entries, personIds)).toEqual([
        entry1,
        entry2,
        entry3,
      ]);
    });

    it("does filter entries - given all student ids", () => {
      const personIds = [1, 2, 3];

      expect(filterByGroup("A", entries, personIds)).toEqual([
        entry1,
        entry2,
        entry3,
      ]);
    });

    it("does filter entries - given one student id", () => {
      const personIds = [2];

      expect(filterByGroup("A", entries, personIds)).toEqual([entry2]);
    });

    it("does filter entries - given empty student ids", () => {
      const personIds: ReadonlyArray<number> = [];

      expect(filterByGroup("A", entries, personIds)).toEqual([]);
    });
  });
});
