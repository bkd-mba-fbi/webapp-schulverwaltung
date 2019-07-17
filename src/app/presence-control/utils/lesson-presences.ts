import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { OptionalReference } from 'src/app/shared/models/common-types';
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
      if (!update.newPresenceTypeId && lessonPresence.Comment) {
        // Use comment type if is present and has comment
        newPresenceType = presenceTypes.find(t => t.IsComment) || null;
      } else {
        newPresenceType =
          presenceTypes.find(t => t.Id === update.newPresenceTypeId) || null;
      }

      return {
        ...lessonPresence,
        TypeRef: buildPresenceTypeRef(newPresenceType),
        Date: null, // TODO: where does this value come from?
        Type: newPresenceType ? newPresenceType.Designation : null
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
      let presenceTypeRef = lessonPresence.TypeRef;
      let presenceDesignation = lessonPresence.Type;
      let newPresenceType: Maybe<PresenceType>;
      if (newComment && !presenceTypeRef.Id) {
        // Set to comment presence type
        newPresenceType = presenceTypes.find(p => p.IsComment);
      } else if (!newComment && presenceTypeRef) {
        // TODO: Unset presence type if it has `IsComment=1`?
      }
      if (newPresenceType) {
        presenceTypeRef = {
          Id: newPresenceType.Id,
          HRef: null
        };
        presenceDesignation = newPresenceType.Designation;
      }
      return {
        ...lessonPresence,
        Comment: newComment,
        TypeRef: presenceTypeRef,
        Type: presenceDesignation
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
): OptionalReference {
  return {
    Id: presenceType ? presenceType.Id : null,
    HRef: null
  };
}
