import { LessonPresence } from '../../shared/models/lesson-presence.model';
import {
  fromLesson,
  LessonEntry,
  lessonsEntryEqual,
} from '../models/lesson-entry.model';
import { extractLesson, lessonsComparator, lessonsEqual } from './lessons';
import { isBefore, isSameDay, isWithinInterval } from 'date-fns';

/**
 * Returns a sorted array of lesson entries for the given lesson presences.
 */
export function extractLessonEntries(
  lessonPresences: ReadonlyArray<LessonPresence>
): Array<LessonEntry> {
  return uniqueLessonPresences(lessonPresences)
    .reduce((entries, lessonPresence, index) => {
      const existingEntry = entries.find((g) =>
        lessonsEntryEqual(g, lessonPresence)
      );

      if (existingEntry) {
        existingEntry.addLesson(extractLesson(lessonPresence));
        return entries;
      }

      const lessonEntry = fromLesson(extractLesson(lessonPresence));
      return [...entries, lessonEntry];
    }, [] as LessonEntry[])
    .sort(lessonsComparator);
}

/**
 * Operates on an array of lesson entries that are all on the same
 * day. Returns the currently ongoing, upcoming or the last lesson if
 * the lessons are scheduled today. Otherwise (if lessons take place
 * before or after today) it returns the first lesson.
 */
export function getCurrentLessonEntry(
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

function uniqueLessonPresences(
  lessonPresences: ReadonlyArray<LessonPresence>
): ReadonlyArray<LessonPresence> {
  return lessonPresences.reduce((presences, presence) => {
    if (presences.some((l) => lessonsEqual(l, presence))) {
      return presences;
    }
    return [...presences, presence];
  }, [] as LessonPresence[]);
}
