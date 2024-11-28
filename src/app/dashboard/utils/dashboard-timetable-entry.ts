import uniq from "lodash-es/uniq";
import { LessonStudyClass } from "src/app/shared/models/lesson-study-class.model";
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
    id: getDashboardTimetableEntryId(entry.EventId, entry.Id),
    from: entry.From,
    until: entry.To,
    eventId: entry.EventId,
    subject: entry.EventDesignation,

    // Fetched separately (workaround), see `DashboardTimetableComponent.fetchTimetableEntries`
    // studyClass: (entry.EventNumber.match(/[-_]([^-_]+)$/) ?? [])[1], // The last part of the EventNumber is the study class (e.g. "3-1-E-S3-GYMweb25-26b", the class is "26b")

    room: entry.EventLocation || undefined,
    teacher: entry.EventManagerInformation || undefined,
  };
}

export function createStudyClassesMap(
  lessonStudyClasses: ReadonlyArray<LessonStudyClass>,
): Dict<ReadonlyArray<string>> {
  // Collect classes per event/lesson (i.e. timetable entry)
  const studyClasses = lessonStudyClasses.reduce<Dict<ReadonlyArray<string>>>(
    (acc, lesson) => {
      const id = getDashboardTimetableEntryId(
        lesson.EventRef.Id,
        lesson.LessonRef.Id,
      );
      return { ...acc, [id]: [...(acc[id] ?? []), lesson.StudyClassNumber] };
    },
    {},
  );

  // Sort and remove duplicates
  return Object.keys(studyClasses).reduce(
    (acc, id) => ({
      ...acc,
      [id]: uniq([...studyClasses[id]].sort()),
    }),
    {},
  );
}

export function decorateStudyClasses(
  entries: ReadonlyArray<DashboardTimetableEntry>,
  studyClasses: Dict<ReadonlyArray<string>>,
): ReadonlyArray<DashboardTimetableEntry> {
  return entries.map((entry) => ({
    ...entry,
    studyClass: studyClasses[entry.id]?.join(", "),
  }));
}

function getDashboardTimetableEntryId(
  eventId: number,
  lessonId: number,
): string {
  return `${eventId}-${lessonId}`;
}
