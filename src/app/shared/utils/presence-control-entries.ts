import { LessonPresence } from '../models/lesson-presence.model';
import { PresenceType } from '../models/presence-type.model';
import { DropDownItem } from '../models/drop-down-item.model';
import { PresenceControlEntry } from '../../presence-control/models/presence-control-entry.model';
import { SubscriptionDetail } from '../models/subscription-detail.model';

export function buildPresenceControlEntries(
  lessonPresences: ReadonlyArray<LessonPresence>,
  presenceTypes: ReadonlyArray<PresenceType>,
  confirmationStates: ReadonlyArray<DropDownItem>
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
        (s) => s.Key === lessonPresence.ConfirmationStateId
      );
    }
    return new PresenceControlEntry(
      lessonPresence,
      presenceType,
      null,
      confirmationState
    );
  });
}

// TODO test
export function filterByGroup(
  group: Option<string>,
  entries: ReadonlyArray<PresenceControlEntry>,
  details: ReadonlyArray<SubscriptionDetail>,
  groupAvailability: boolean
): ReadonlyArray<PresenceControlEntry> {
  if (!groupAvailability) {
    return entries;
  }

  const personIds = details
    .filter((d) => d.Value === group)
    .map((d) => d.IdPerson);
  return entries.filter((e) =>
    personIds.find((id) => id === e.lessonPresence.StudentRef.Id)
  );
}
