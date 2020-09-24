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

export function getIdsGroupedByPersonAndPresenceType(
  lessonPresences: ReadonlyArray<LessonPresence>
): ReadonlyArray<{
  personId: number;
  presenceTypeId: Option<number>;
  lessonIds: ReadonlyArray<number>;
}> {
  const grouped: Dict<Dict<number[]>> = {};

  lessonPresences.forEach((lp) => {
    if (!grouped[lp.StudentRef.Id]) {
      grouped[lp.StudentRef.Id] = {};
    }
    if (!grouped[lp.StudentRef.Id][String(lp.TypeRef.Id)]) {
      grouped[lp.StudentRef.Id][String(lp.TypeRef.Id)] = [];
    }
    grouped[lp.StudentRef.Id][String(lp.TypeRef.Id)].push(lp.LessonRef.Id);
  });

  return Object.keys(grouped).reduce(
    (acc, personId) => [
      ...acc,
      ...Object.keys(grouped[personId]).map((presenceTypeId) => {
        return {
          personId: Number(personId),
          presenceTypeId:
            presenceTypeId === 'null' ? null : Number(presenceTypeId),
          lessonIds: grouped[personId][String(presenceTypeId)],
        };
      }),
    ],
    [] as ReadonlyArray<{
      personId: number;
      presenceTypeId: Option<number>;
      lessonIds: ReadonlyArray<number>;
    }>
  );
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

export function sortLessonPresencesByDate(
  lessonPresences: ReadonlyArray<LessonPresence>
): ReadonlyArray<LessonPresence> {
  return lessonPresences
    .slice()
    .sort(
      (a, b) => a.LessonDateTimeFrom.getTime() - b.LessonDateTimeFrom.getTime()
    );
}
