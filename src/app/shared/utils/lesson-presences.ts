import { LessonPresence } from '../models/lesson-presence.model';

export function getIdsGroupedByPerson(
  lessonPresences: ReadonlyArray<LessonPresence>
): ReadonlyArray<{
  personIds: ReadonlyArray<number>;
  lessonIds: ReadonlyArray<number>;
}> {
  const grouped = lessonPresences.reduce((acc, p) => {
    if (!acc[p.StudentRef.Id]) {
      acc[p.StudentRef.Id] = [];
    }
    acc[p.StudentRef.Id].push(p.LessonRef.Id);
    return acc;
  }, {} as Dict<number[]>);
  return Object.keys(grouped).map((personId) => {
    return {
      personIds: [Number(personId)],
      lessonIds: grouped[personId],
    };
  });
}

export function getIdsGroupedByLesson(
  lessonPresences: ReadonlyArray<LessonPresence>
): ReadonlyArray<{
  lessonIds: ReadonlyArray<number>;
  personIds: ReadonlyArray<number>;
}> {
  const grouped = lessonPresences.reduce((acc, p) => {
    if (!acc[p.LessonRef.Id]) {
      acc[p.LessonRef.Id] = [];
    }
    acc[p.LessonRef.Id].push(p.StudentRef.Id);
    return acc;
  }, {} as Dict<number[]>);
  return Object.keys(grouped).map((lessonId) => {
    return {
      lessonIds: [Number(lessonId)],
      personIds: grouped[lessonId],
    };
  });
}
