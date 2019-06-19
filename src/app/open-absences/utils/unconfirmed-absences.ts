import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';

export function sortUnconfirmedAbsences(
  lessonPresences: ReadonlyArray<LessonPresence>
): ReadonlyArray<LessonPresence> {
  return lessonPresences.slice().sort(unconfirmedAbsencesComparator);
}

/**
 * Sorts by LessonDateTimeFrom, LessonDateTimeTo, StudentFullName.
 */
function unconfirmedAbsencesComparator(
  a: LessonPresence,
  b: LessonPresence
): number {
  const aFromTime = a.LessonDateTimeFrom.getTime();
  const bFromTime = b.LessonDateTimeFrom.getTime();
  if (aFromTime - bFromTime === 0) {
    const aToTime = a.LessonDateTimeTo.getTime();
    const bToTime = b.LessonDateTimeTo.getTime();
    if (aToTime - bToTime === 0) {
      a.StudentFullName.localeCompare(b.StudentFullName);
    }
    return aToTime - bToTime;
  }
  return aFromTime - bFromTime;
}
