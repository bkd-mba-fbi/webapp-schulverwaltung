import { LessonPresence } from '../../shared/models/lesson-presence.model';
import { fromLesson, LessonEntry, lessonsEntryEqual } from './lesson-entry';
import { extractLesson, lessonsComparator, lessonsEqual } from './lessons';

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
