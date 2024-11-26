import { TimetableEntry } from "src/app/shared/models/timetable-entry.model";
import { convertTimetableEntry } from "./dashboard-timetable-entry";

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
        studyClass: "27a",
        room: "1.01",
        teacher: "Doe Jane",
      });
    });
  });
});
