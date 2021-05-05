import { isSameDay, isBefore, isWithinInterval } from 'date-fns';

import { Lesson } from '../../shared/models/lesson.model';
import { LessonPresence } from '../../shared/models/lesson-presence.model';
import { PresenceControlEntry } from '../models/presence-control-entry.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { DropDownItem } from '../../shared/models/drop-down-item.model';
import { fromLesson, LessonEntry, lessonsEntryEqual } from './lesson-entry';

export function lessonsEqual(
  a: Option<Lesson | LessonPresence>,
  b: Option<Lesson | LessonPresence>
): boolean {
  return (
    (a === null && b === null) ||
    (a !== null &&
      b !== null &&
      a.LessonRef.Id === b.LessonRef.Id &&
      a.EventDesignation === b.EventDesignation &&
      a.StudyClassNumber === b.StudyClassNumber &&
      a.TeacherInformation === b.TeacherInformation &&
      a.LessonDateTimeFrom.getTime() === b.LessonDateTimeFrom.getTime() &&
      a.LessonDateTimeTo.getTime() === b.LessonDateTimeTo.getTime())
  );
}

/**
 * Returns the lesson from a single lesson presence.
 */
export function extractLesson(lessonPresence: LessonPresence): Lesson {
  return {
    LessonRef: lessonPresence.LessonRef,
    EventDesignation: lessonPresence.EventDesignation,
    StudyClassNumber: lessonPresence.StudyClassNumber,
    TeacherInformation: lessonPresence.TeacherInformation,
    LessonDateTimeFrom: lessonPresence.LessonDateTimeFrom,
    LessonDateTimeTo: lessonPresence.LessonDateTimeTo,
  };
}

/**
 * Operates on an array of lessons that are all on the same
 * day. Returns the currently ongoing, upcoming or the last lesson if
 * the lessons are scheduled today. Otherwise (if lessons take place
 * before or after today) it returns the first lesson.
 */
export function getCurrentLesson(
  lessons: ReadonlyArray<LessonEntry>
): Option<LessonEntry> {
  if (lessons.length === 0) {
    return null;
  }

  const currentDate = new Date();
  lessons = [...lessons].sort(lessonsComparator);
  if (isSameDay(currentDate, lessons[0].LessonDateTimeFrom)) {
    for (const lesson of lessons) {
      if (
        isBefore(currentDate, lesson.LessonDateTimeFrom) ||
        isWithinInterval(currentDate, {
          start: lesson.LessonDateTimeFrom,
          end: lesson.LessonDateTimeTo,
        })
      ) {
        return lesson;
      }
    }
    return lessons[lessons.length - 1];
  }
  return lessons[0];
}

/**
 * Returns a sorted list of lesson presences, filtered
 * by the given `lesson`.
 */
export function getLessonPresencesForLesson(
  lessonEntry: Option<LessonEntry>,
  lessonPresences: ReadonlyArray<LessonPresence>
): ReadonlyArray<LessonPresence> {
  if (!lessonEntry) {
    return [];
  }

  return lessonPresences
    .filter(
      (p) =>
        lessonEntry.lessons
          .map((l) => l.LessonRef.Id)
          .indexOf(p.LessonRef.Id) >= 0
    )
    .sort(lessonPresencesComparator);
}

export function getPresenceControlEntriesForLesson(
  lesson: Option<LessonEntry>,
  lessonPresences: ReadonlyArray<LessonPresence>,
  presenceTypes: ReadonlyArray<PresenceType>,
  confirmationStates: ReadonlyArray<DropDownItem>
): ReadonlyArray<PresenceControlEntry> {
  return getLessonPresencesForLesson(lesson, lessonPresences).map(
    (lessonPresence) => {
      let presenceType = null;
      if (lessonPresence.TypeRef.Id) {
        presenceType =
          presenceTypes.find((t) => t.Id === lessonPresence.TypeRef.Id) || null;
      }
      let confirmationState;
      if (lessonPresence.ConfirmationStateId) {
        confirmationState = confirmationStates.find(
          (s) => s.Key === lessonPresence.ConfirmationStateId
        );
      }
      return new PresenceControlEntry(
        lessonPresence,
        presenceType,
        confirmationState
      );
    }
  );
}

/**
 * Sorts by LessonDateTimeFrom, LessonDateTimeTo.
 */
export function lessonsComparator(
  a: Lesson | LessonPresence | LessonEntry,
  b: Lesson | LessonPresence | LessonEntry
): number {
  const aFromTime = a.LessonDateTimeFrom.getTime();
  const bFromTime = b.LessonDateTimeFrom.getTime();
  if (aFromTime - bFromTime === 0) {
    return a.LessonDateTimeTo.getTime() - b.LessonDateTimeTo.getTime();
  }
  return aFromTime - bFromTime;
}

/**
 * Sorts by StudentFullName.
 */
function lessonPresencesComparator(
  a: LessonPresence,
  b: LessonPresence
): number {
  return a.StudentFullName.localeCompare(b.StudentFullName);
}
