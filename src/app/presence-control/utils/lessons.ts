import { Lesson } from '../../shared/models/lesson.model';
import { LessonPresence } from '../../shared/models/lesson-presence.model';
import { PresenceControlEntry } from '../models/presence-control-entry.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { DropDownItem } from '../../shared/models/drop-down-item.model';
import { LessonEntry } from '../models/lesson-entry.model';
import { LessonAbsence } from '../../shared/models/lesson-absence.model';
import { uniqBy } from 'lodash-es';

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
    EventRef: lessonPresence.EventRef,
    StudyClassNumber: lessonPresence.StudyClassNumber,
    TeacherInformation: lessonPresence.TeacherInformation,
    LessonDateTimeFrom: lessonPresence.LessonDateTimeFrom,
    LessonDateTimeTo: lessonPresence.LessonDateTimeTo,
  };
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

/**
 * Returns a sorted list of unique lesson absences for the given student,
 * which take place on the same day before the given lesson.
 */
function getPrecedingAbsences(
  otherTeachersAbsences: ReadonlyArray<LessonAbsence>,
  lessonPresence: LessonPresence,
  lesson: Option<LessonEntry>
): ReadonlyArray<LessonAbsence> {
  return uniqBy(
    otherTeachersAbsences.filter(
      (absence) =>
        absence.StudentRef.Id === lessonPresence.StudentRef.Id &&
        absence.LessonRef.From &&
        absence.LessonRef.From.toDateString() ===
          lesson?.LessonDateTimeFrom.toDateString() &&
        absence.LessonRef.From < lesson?.LessonDateTimeFrom
    ),
    'Id'
  ).sort(lessonAbsenceTimeComparator);
}

export function getPresenceControlEntriesForLesson(
  lesson: Option<LessonEntry>,
  lessonPresences: ReadonlyArray<LessonPresence>,
  presenceTypes: ReadonlyArray<PresenceType>,
  confirmationStates: ReadonlyArray<DropDownItem>,
  otherTeachersAbsences: ReadonlyArray<LessonAbsence>
): ReadonlyArray<PresenceControlEntry> {
  return getLessonPresencesForLesson(lesson, lessonPresences).map(
    (lessonPresence) => {
      let presenceType = null;
      if (lessonPresence.TypeRef.Id) {
        presenceType =
          presenceTypes.find((t) => t.Id === lessonPresence.TypeRef.Id) || null;
      }

      const precedingAbsences = getPrecedingAbsences(
        otherTeachersAbsences,
        lessonPresence,
        lesson
      );

      let confirmationState;
      if (lessonPresence.ConfirmationStateId) {
        confirmationState = confirmationStates.find(
          (s) => s.Key === lessonPresence.ConfirmationStateId
        );
      }
      return new PresenceControlEntry(
        lessonPresence,
        presenceType,
        precedingAbsences,
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

/**
 * Sorts by LessonRef.From and LessonRef.To, if present.
 */
function lessonAbsenceTimeComparator(
  a: LessonAbsence,
  b: LessonAbsence
): number {
  if (
    a.LessonRef.From &&
    a.LessonRef.To &&
    b.LessonRef.From &&
    b.LessonRef.To
  ) {
    if (a.LessonRef.From.getTime() - b.LessonRef.From.getTime() === 0) {
      return a.LessonRef.To.getTime() - b.LessonRef.To.getTime();
    }
    return a.LessonRef.From.getTime() - b.LessonRef.From.getTime();
  }
  return 0;
}
