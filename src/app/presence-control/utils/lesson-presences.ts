import { deburr } from 'lodash-es';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';

export function searchLessonPresences(
  lessonPresences: ReadonlyArray<LessonPresence>,
  term: string
): ReadonlyArray<LessonPresence> {
  if (!term) {
    return lessonPresences;
  }

  return lessonPresences.filter(matchesLessonPresence(term));
}

function matchesLessonPresence(
  term: string
): (lessonPresence: LessonPresence) => boolean {
  const preparedTerm = normalizeSearchValue(term);
  return lessonPresence =>
    normalizeSearchValue(lessonPresence.StudentFullName).indexOf(preparedTerm) >
    -1;
}

function normalizeSearchValue(value: string): string {
  return deburr(value.toLowerCase());
}
