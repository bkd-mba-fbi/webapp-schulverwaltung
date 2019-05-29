import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { Reference } from 'src/app/shared/models/common-types';
import { LessonPresenceUpdate } from 'src/app/shared/services/lesson-presences-update.service';

export function updatePresenceTypeForPresences(
  allLessonPresences: ReadonlyArray<LessonPresence>,
  affectedLessonPresences: ReadonlyArray<LessonPresenceUpdate>,
  presenceTypes: ReadonlyArray<PresenceType>
): ReadonlyArray<LessonPresence> {
  return allLessonPresences.map(lessonPresence => {
    const update = affectedLessonPresences.find(u =>
      lessonPresenceEquals(u.presence, lessonPresence)
    );
    if (update) {
      const newPresenceType =
        presenceTypes.find(t => t.Id === update.newPresenceTypeId) || null;
      return {
        ...lessonPresence,
        PresenceTypeRef: buildPresenceTypeRef(newPresenceType),
        // PresenceComment: // TODO: remove comment in some cases?
        PresenceDate: null, // TODO: where does this value come from?
        PresenceType: newPresenceType ? newPresenceType.Designation : null
      };
    }
    return lessonPresence;
  });
}

function lessonPresenceEquals(a: LessonPresence, b: LessonPresence): boolean {
  return (
    a.LessonRef.Id === b.LessonRef.Id && a.StudentRef.Id === b.StudentRef.Id
  );
}

function buildPresenceTypeRef(
  presenceType: Option<PresenceType>
): Option<Reference> {
  if (!presenceType) {
    return null;
  }
  return {
    Id: presenceType.Id,
    Href: presenceType.Href
  };
}
