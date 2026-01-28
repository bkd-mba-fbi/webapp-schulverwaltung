import { LessonStudyClass } from "src/app/shared/models/lesson-study-class.model";
import { TimetableEntry } from "src/app/shared/models/timetable-entry.model";
import {
  DashboardTimetableEntry,
  convertTimetableEntry,
  createStudyClassesMap,
  decorateStudyClasses,
  groupTimetableEntries,
} from "./dashboard-timetable-entry";

describe("Dashboard timetable entry utilities", () => {
  describe("convertTimetableEntry", () => {
    it("converts a TimetableEntry to a DashboardTimetableEntry", () => {
      const entry: TimetableEntry = {
        Id: 1290,
        EventId: 9742,
        From: new Date(2023, 7, 21, 10, 5),
        To: new Date(2023, 7, 21, 10, 50),
        EventNumber: "1-1-E-S3-GYMweb24-27a",
        EventDesignation: "Englisch-S3",
        EventLocation: "1.01",
        EventManagerInformation: "Doe Jane",
      };
      const result = convertTimetableEntry(entry);
      expect(result).toEqual({
        id: "9742-1290",
        from: new Date(2023, 7, 21, 10, 5),
        until: new Date(2023, 7, 21, 10, 50),
        eventId: 9742,
        subject: "Englisch-S3",
        // studyClass: "27a",
        room: "1.01",
        teacher: "Doe Jane",
      });
    });
  });

  describe("createStudyClassesMap", () => {
    it("collects study classes per event/lesson (i.e. timetable entry)", () => {
      const lessonStudyClasses: ReadonlyArray<LessonStudyClass> = [
        {
          EventRef: { Id: 9742, HRef: "" },
          LessonRef: { Id: 1290, HRef: "" },
          StudyClassNumber: "27a",
          StudentRef: { Id: 10, HRef: "" },
        },
        {
          EventRef: { Id: 9742, HRef: "" },
          LessonRef: { Id: 1290, HRef: "" },
          StudyClassNumber: "27b",
          StudentRef: { Id: 10, HRef: "" },
        },
        {
          EventRef: { Id: 9741, HRef: "" },
          LessonRef: { Id: 1290, HRef: "" },
          StudyClassNumber: "27c",
          StudentRef: { Id: 10, HRef: "" },
        },
        {
          EventRef: { Id: 9742, HRef: "" },
          LessonRef: { Id: 1291, HRef: "" },
          StudyClassNumber: "27d",
          StudentRef: { Id: 10, HRef: "" },
        },
      ];
      const result = createStudyClassesMap(lessonStudyClasses);
      expect(result).toEqual({
        "9742-1290": ["27a", "27b"],
        "9741-1290": ["27c"],
        "9742-1291": ["27d"],
      });
    });
  });

  describe("decorateStudyClasses", () => {
    it("sets comma-separated study classes on the entry, based on the given classes map", () => {
      const entries: ReadonlyArray<DashboardTimetableEntry> = [
        {
          id: "9742-1290",
          from: new Date(),
          until: new Date(),
          eventId: 9742,
          subject: "Englisch-S3",
          room: "1.01",
          teacher: "Doe Jane",
        },
      ];
      const studyClasses: Dict<ReadonlyArray<string>> = {
        "9742-1290": ["27a", "27b"],
        "9741-1290": ["27c"],
        "9742-1291": ["27d"],
      };
      const result = decorateStudyClasses(entries, studyClasses);
      expect(result[0].studyClass).toBe("27a, 27b");
    });
  });

  describe("groupTimetableEntries", () => {
    it("creates a single group for a single entry", () => {
      const entries: ReadonlyArray<DashboardTimetableEntry> = [
        {
          id: "9742-1290",
          from: new Date(2023, 7, 21, 10, 5),
          until: new Date(2023, 7, 21, 10, 50),
          eventId: 9742,
          subject: "Englisch-S3",
          room: "1.01",
          teacher: "Doe Jane",
        },
      ];
      const result = groupTimetableEntries(entries);
      expect(result.length).toBe(1);
      expect(result[0].from).toEqual(new Date(2023, 7, 21, 10, 5));
      expect(result[0].until).toEqual(new Date(2023, 7, 21, 10, 50));
      expect(result[0].entries).toEqual(entries);
    });

    it("creates three groups: one grouped and two single entries", () => {
      const entries: ReadonlyArray<DashboardTimetableEntry> = [
        {
          id: "9742-1290",
          from: new Date(2023, 7, 21, 10, 5),
          until: new Date(2023, 7, 21, 10, 50),
          eventId: 9742,
          subject: "Englisch-S3",
          room: "1.01",
          teacher: "Doe Jane",
        },
        {
          id: "9743-1291",
          from: new Date(2023, 7, 21, 10, 5),
          until: new Date(2023, 7, 21, 10, 50),
          eventId: 9743,
          subject: "Englisch-S3",
          room: "1.01",
          teacher: "Doe Jane",
        },
        {
          id: "9744-1292",
          from: new Date(2023, 7, 21, 11, 0),
          until: new Date(2023, 7, 21, 11, 45),
          eventId: 9744,
          subject: "Deutsch-S1",
          room: "2.03",
          teacher: "Doe Jane",
        },
        {
          id: "9745-1293",
          from: new Date(2023, 7, 21, 12, 0),
          until: new Date(2023, 7, 21, 12, 45),
          eventId: 9745,
          subject: "Chemie-S2",
          room: "1.02",
          teacher: "Doe Jane",
        },
      ];
      const result = groupTimetableEntries(entries);
      expect(result.length).toBe(3);

      expect(result[0].from).toEqual(new Date(2023, 7, 21, 10, 5));
      expect(result[0].until).toEqual(new Date(2023, 7, 21, 10, 50));
      expect(result[0].entries.length).toBe(2);
      expect(result[0].entries).toEqual([entries[0], entries[1]]);

      expect(result[1].from).toEqual(new Date(2023, 7, 21, 11, 0));
      expect(result[1].until).toEqual(new Date(2023, 7, 21, 11, 45));
      expect(result[1].entries.length).toBe(1);
      expect(result[1].entries[0]).toEqual(entries[2]);

      expect(result[2].from).toEqual(new Date(2023, 7, 21, 12, 0));
      expect(result[2].until).toEqual(new Date(2023, 7, 21, 12, 45));
      expect(result[2].entries.length).toBe(1);
      expect(result[2].entries[0]).toEqual(entries[3]);
    });
  });
});
