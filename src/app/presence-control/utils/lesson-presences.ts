import { Settings } from "src/app/settings";
import { OptionalReference } from "src/app/shared/models/common-types";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { PresenceType } from "src/app/shared/models/presence-type.model";
import { LessonPresenceUpdate } from "src/app/shared/services/lesson-presences-update.service";
import { getNewConfirmationStateId } from "./presence-types";

export function updatePresenceTypeForPresences(
  allLessonPresences: ReadonlyArray<LessonPresence>,
  updates: ReadonlyArray<LessonPresenceUpdate>,
  presenceTypes: ReadonlyArray<PresenceType>,
  settings: Settings,
): ReadonlyArray<LessonPresence> {
  return allLessonPresences.map((lessonPresence) => {
    const update = updates.find((u) =>
      lessonPresenceEquals(u.presence, lessonPresence),
    );
    if (update) {
      let newPresenceType: Option<PresenceType>;
      if (!update.newPresenceTypeId && lessonPresence.Comment) {
        // Use comment type if is present and has comment
        newPresenceType = presenceTypes.find((t) => t.IsComment) || null;
      } else {
        newPresenceType =
          presenceTypes.find((t) => t.Id === update.newPresenceTypeId) || null;
      }

      return {
        ...lessonPresence,
        TypeRef: buildPresenceTypeRef(newPresenceType),
        Date: null, // TODO: where does this value come from?
        Type: newPresenceType ? newPresenceType.Designation : null,
        ConfirmationStateId: getNewConfirmationStateId(
          newPresenceType,
          settings,
        ),
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
  presenceType: Option<PresenceType>,
): OptionalReference {
  return {
    Id: presenceType ? presenceType.Id : null,
    HRef: null,
  };
}
