import { TimetableEntry } from "src/app/shared/models/timetable-entry.model";

export type DashboardTimetableEntry = {
  id: string;
  from: Date;
  until: Date;
  eventId: number;
  subject: string;
  studyClass?: string;
  room?: string;
  teacher?: string;
};

export function convertTimetableEntry(
  entry: TimetableEntry,
): DashboardTimetableEntry {
  return {
    id: `${entry.EventId}-${entry.Id}`,
    from: entry.From,
    until: entry.To,
    eventId: entry.EventId,
    subject: entry.EventDesignation,
    studyClass: (entry.EventNumber.match(/[-_]([^-_]+)$/) ?? [])[1], // The last part of the EventNumber is the study class (e.g. "3-1-E-S3-GYMweb25-26b", the class is "26b")
    room: entry.EventLocation || undefined,
    teacher: entry.EventManagerInformation || undefined,
  };
}
