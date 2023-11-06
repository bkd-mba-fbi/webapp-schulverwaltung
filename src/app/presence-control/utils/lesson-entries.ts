import { isBefore, isSameDay, isWithinInterval } from "date-fns";
import { Lesson } from "src/app/shared/models/lesson.model";
import {
  LessonEntry,
  fromLesson,
  lessonsEntryEqual,
} from "../models/lesson-entry.model";
import { lessonsComparator, lessonsEqual } from "./lessons";

/**
 * Returns a sorted array of lesson entries for the given lesson presences.
 */
export function getLessonEntriesForLessons(
  lessons: ReadonlyArray<Lesson>,
): Array<LessonEntry> {
  return uniqueLessons(lessons)
    .reduce((entries, lesson) => {
      const existingEntry = entries.find((g) => lessonsEntryEqual(g, lesson));

      if (existingEntry) {
        existingEntry.addLesson(lesson);
        return entries;
      }

      const newEntry = fromLesson(lesson);
      return [...entries, newEntry];
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
  lessons: ReadonlyArray<LessonEntry>,
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

export function uniqueLessons(
  lessons: ReadonlyArray<Lesson>,
): ReadonlyArray<Lesson> {
  return lessons.reduce((acc, lesson) => {
    if (acc.some((l) => lessonsEqual(l, lesson))) {
      return acc;
    }
    return [...acc, lesson];
  }, [] as Lesson[]);
}
