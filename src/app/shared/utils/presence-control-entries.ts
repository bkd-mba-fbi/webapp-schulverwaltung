import { LessonPresence } from "../models/lesson-presence.model";
import { PresenceType } from "../models/presence-type.model";
import { DropDownItem } from "../models/drop-down-item.model";
import { PresenceControlEntry } from "../../presence-control/models/presence-control-entry.model";
import { GroupOptions } from "../../presence-control/components/presence-control-group-dialog/presence-control-group-dialog.component";

export function buildPresenceControlEntries(
  lessonPresences: ReadonlyArray<LessonPresence>,
  presenceTypes: ReadonlyArray<PresenceType>,
  confirmationStates: ReadonlyArray<DropDownItem>,
): ReadonlyArray<PresenceControlEntry> {
  return lessonPresences.map((lessonPresence) => {
    let presenceType = null;
    if (lessonPresence.TypeRef.Id) {
      presenceType =
        presenceTypes.find((t) => t.Id === lessonPresence.TypeRef.Id) || null;
    }
    let confirmationState: DropDownItem | undefined;
    if (lessonPresence.ConfirmationStateId) {
      confirmationState = confirmationStates.find(
        (s) => s.Key === lessonPresence.ConfirmationStateId,
      );
    }
    return new PresenceControlEntry(
      lessonPresence,
      presenceType,
      null,
      confirmationState,
    );
  });
}

export function filterByGroup(
  group: GroupOptions["id"],
  entries: ReadonlyArray<PresenceControlEntry>,
  personIds: ReadonlyArray<number>,
): ReadonlyArray<PresenceControlEntry> {
  if (group) {
    return entries.filter((e) =>
      personIds.find((id) => id === e.lessonPresence.StudentRef.Id),
    );
  }

  return entries;
}
