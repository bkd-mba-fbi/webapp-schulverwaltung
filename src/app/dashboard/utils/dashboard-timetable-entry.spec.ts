import { LessonStudyClass } from "src/app/shared/models/lesson-study-class.model";
import { TimetableEntry } from "src/app/shared/models/timetable-entry.model";
import {
  DashboardTimetableEntry,
  convertTimetableEntry,
  createStudyClassesMap,
  decorateStudyClasses,
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
});
