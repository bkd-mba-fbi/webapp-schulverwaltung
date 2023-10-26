import {
  getLessonEntriesForLessons,
  getCurrentLessonEntry,
} from "./lesson-entries";
import { buildLesson } from "../../../spec-builders";
import { fromLesson, LessonEntry } from "../models/lesson-entry.model";
import { Lesson } from "../../shared/models/lesson.model";

describe("lessons entries", () => {
  describe("getLessonEntriesForLessons", () => {
    it("groups the given lessons as a sorted array of lesson entries", () => {
      const lesson1 = buildLesson(
        1,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        "Mathematik",
        "Hans Lüdi",
        "9a",
      );
      const lesson2 = buildLesson(
        2,
        new Date(2000, 0, 23, 8, 0),
        new Date(2000, 0, 23, 9, 0),
        "Deutsch",
        "Hans Lüdi",
        "9a",
      );
      const lesson3 = buildLesson(
        3,
        new Date(2000, 0, 23, 8, 0),
        new Date(2000, 0, 23, 9, 0),
        "Deutsch",
        "Hans Lüdi",
        "9b",
      );
      const lesson4 = buildLesson(
        4,
        new Date(2000, 0, 23, 8, 0),
        new Date(2000, 0, 23, 9, 0),
        "Deutsch",
        "Christine Flückiger",
        "9c",
      );
      const result = getLessonEntriesForLessons([
        lesson1,
        lesson2,
        lesson3,
        lesson4,
      ]);

      expect(result).toHaveSize(3);

      const [entry1, entry2, entry3] = result;
      expect(entry1.lessons).toEqual([lesson2, lesson3]);
      expect(entry2.lessons).toEqual([lesson4]);
      expect(entry3.lessons).toEqual([lesson1]);
    });

    it("returns empty array for empty array", () => {
      expect(getLessonEntriesForLessons([])).toEqual([]);
    });
  });

  describe("getCurrentLessonEntry", () => {
    let lessons: LessonEntry[];
    let deutsch: Lesson;
    let math: Lesson;
    let singen: Lesson;
    let werken: Lesson;

    beforeEach(() => {
      deutsch = buildLesson(
        1,
        new Date(2000, 0, 23, 8, 0),
        new Date(2000, 0, 23, 9, 0),
        "Deutsch",
        `Dora Durrer`,
      );
      math = buildLesson(
        2,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        "Mathematik",
        `Monika Muster`,
      );
      singen = buildLesson(
        3,
        new Date(2000, 0, 23, 11, 0),
        new Date(2000, 0, 23, 12, 0),
        "Singen",
        "Sandra Schmid",
      );
      werken = buildLesson(
        4,
        new Date(2000, 0, 23, 13, 0),
        new Date(2000, 0, 23, 14, 0),
        "Werken",
        "Wanda Wehrli",
      );

      lessons = [
        fromLesson(deutsch),
        fromLesson(math),
        fromLesson(singen),
        fromLesson(werken),
      ];
    });

    describe("same day", () => {
      it("returns null if no lessons are present", () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 12, 0));
        expect(getCurrentLessonEntry([])).toBeNull();
      });

      it("returns first lesson if time is before its start", () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 6, 0));
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(deutsch));
      });

      it("returns last lesson if time is after its end", () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 17, 0));
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(werken));
      });

      it("returns ongoing lesson if time is within", () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 9, 30));
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(math));
      });

      it("returns ongoing lesson if the exactly equals lesson start", () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 11, 0));
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(singen));
      });

      it("returns upcoming lesson if time is after a lesson and before another", () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 10, 30));
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(singen));
      });
    });

    describe("day before", () => {
      beforeEach(() => {
        jasmine.clock().mockDate(new Date(2000, 0, 22, 12, 0));
      });

      it("returns first lesson", () => {
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(deutsch));
      });
    });

    describe("day after", () => {
      beforeEach(() => {
        jasmine.clock().mockDate(new Date(2000, 0, 24, 12, 0));
      });

      it("returns first lesson", () => {
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(deutsch));
      });
    });
  });
});
