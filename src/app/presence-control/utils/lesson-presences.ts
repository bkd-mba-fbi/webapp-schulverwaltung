import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { Reference } from 'src/app/shared/models/common-types';
import { LessonPresenceUpdate } from 'src/app/shared/services/lesson-presences-update.service';

export function updatePresenceTypeForPresences(
  allLessonPresences: ReadonlyArray<LessonPresence>,
  updates: ReadonlyArray<LessonPresenceUpdate>,
  presenceTypes: ReadonlyArray<PresenceType>
): ReadonlyArray<LessonPresence> {
  return allLessonPresences.map(lessonPresence => {
    const update = updates.find(u =>
      lessonPresenceEquals(u.presence, lessonPresence)
    );
    if (update) {
      let newPresenceType: Option<PresenceType>;
      if (!update.newPresenceTypeId && lessonPresence.PresenceComment) {
        // Use comment type if is present and has comment
        newPresenceType = presenceTypes.find(t => t.IsComment) || null;
      } else {
        newPresenceType =
          presenceTypes.find(t => t.Id === update.newPresenceTypeId) || null;
      }

      return {
        ...lessonPresence,
        PresenceTypeRef: buildPresenceTypeRef(newPresenceType),
        PresenceDate: null, // TODO: where does this value come from?
        PresenceType: newPresenceType ? newPresenceType.Designation : null
      };
    }
    return lessonPresence;
  });
}

export function updateCommentForPresence(
  allLessonPresences: ReadonlyArray<LessonPresence>,
  affectedLessonPresence: LessonPresence,
  newComment: Option<string>,
  presenceTypes: ReadonlyArray<PresenceType>
): ReadonlyArray<LessonPresence> {
  return allLessonPresences.map(lessonPresence => {
    if (lessonPresenceEquals(lessonPresence, affectedLessonPresence)) {
      let presenceTypeRef = lessonPresence.PresenceTypeRef;
      let presenceDesignation = lessonPresence.PresenceType;
      let newPresenceType: Maybe<PresenceType>;
      if (newComment && !presenceTypeRef) {
        // Set to comment presence type
        newPresenceType = presenceTypes.find(p => p.IsComment);
      } else if (!newComment && presenceTypeRef) {
        // TODO: Unset presence type if it has `IsComment=1`?
      }
      if (newPresenceType) {
        presenceTypeRef = {
          Id: newPresenceType.Id,
          HRef: ''
        };
        presenceDesignation = newPresenceType.Designation;
      }
      return {
        ...lessonPresence,
        PresenceComment: newComment,
        PresenceTypeRef: presenceTypeRef,
        PresenceType: presenceDesignation
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
    HRef: presenceType.Id.toString()
  };
}
