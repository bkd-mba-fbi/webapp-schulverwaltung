import { format } from "date-fns";
import { uniqBy } from "lodash-es";
import { lessonsComparator } from "src/app/presence-control/utils/lessons";
import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { UnreachableError } from "src/app/shared/utils/error";
import { OpenAbsencesEntry } from "../models/open-absences-entry.model";
import { SortKey } from "../services/open-absences.service";

export function buildOpenAbsencesEntries(
  absences: ReadonlyArray<LessonPresence>,
): ReadonlyArray<OpenAbsencesEntry> {
  const groupedAbsences = groupAbsences(absences);
  return Object.keys(groupedAbsences).reduce((acc, day) => {
    Object.keys(groupedAbsences[day]).forEach((studentId) => {
      acc = [
        ...acc,
        new OpenAbsencesEntry(
          groupedAbsences[day][studentId].sort(lessonsComparator),
        ),
      ];
    });
    return acc;
  }, [] as OpenAbsencesEntry[]);
}

export function sortOpenAbsencesEntries(
  entries: ReadonlyArray<OpenAbsencesEntry>,
  sortCriteria: Option<SortCriteria<SortKey>>,
): ReadonlyArray<OpenAbsencesEntry> {
  if (!sortCriteria) return entries;
  return [...entries].sort(getOpenAbsencesComparator(sortCriteria));
}

export function flattenOpenAbsencesEntries(
  entries: ReadonlyArray<OpenAbsencesEntry>,
): ReadonlyArray<LessonPresence> {
  return entries.reduce((acc, e) => {
    return acc.concat(e.absences);
  }, [] as ReadonlyArray<LessonPresence>);
}

export function removeOpenAbsences(
  entries: ReadonlyArray<LessonPresence>,
  affectedIds: ReadonlyArray<{
    lessonIds: ReadonlyArray<number>;
    personId: number;
  }>,
): ReadonlyArray<LessonPresence> {
  return entries.filter(
    (e) =>
      !affectedIds.some(
        ({ lessonIds, personId }) =>
          lessonIds.includes(e.LessonRef.Id) && personId === e.StudentRef.Id,
      ),
  );
}

export function mergeUniqueLessonPresences(
  a: ReadonlyArray<LessonPresence>,
  b: ReadonlyArray<LessonPresence>,
): ReadonlyArray<LessonPresence> {
  return uniqBy([...a, ...b], "Id");
}

function getOpenAbsencesComparator(
  sortCriteria: SortCriteria<SortKey>,
): (a: OpenAbsencesEntry, b: OpenAbsencesEntry) => number {
  return (a, b) => {
    switch (sortCriteria.primarySortKey) {
      case "date": {
        // First sort by time (ascending/descending), then by name (always ascending)
        const timeA = a.date.getTime();
        const timeB = b.date.getTime();
        if (timeA === timeB) {
          return a.studentFullName.localeCompare(b.studentFullName);
        }
        return sortCriteria.ascending ? timeA - timeB : timeB - timeA;
      }

      case "name": {
        // First sort by name (ascending/descending), then by date (always descending)
        const nameDiff = sortCriteria.ascending
          ? a.studentFullName.localeCompare(b.studentFullName)
          : b.studentFullName.localeCompare(a.studentFullName);
        if (nameDiff === 0) {
          return b.date.getTime() - a.date.getTime();
        }
        return nameDiff;
      }

      default:
        throw new UnreachableError(
          sortCriteria.primarySortKey,
          "Unhandled sort criteria",
        );
    }
  };
}

/**
 * Groups lesson presences by day, then student id.
 */
function groupAbsences(
  absences: ReadonlyArray<LessonPresence>,
): Dict<Dict<LessonPresence[]>> {
  return absences.reduce(
    (acc, absence) => {
      const day = format(absence.LessonDateTimeFrom, "yyyy-MM-dd");
      const studentId = absence.StudentRef.Id;
      if (!acc[day]) {
        acc[day] = {};
      }
      if (!acc[day][studentId]) {
        acc[day][studentId] = [];
      }
      acc[day][studentId].push(absence);
      return acc;
    },
    {} as Dict<Dict<LessonPresence[]>>,
  );
}
