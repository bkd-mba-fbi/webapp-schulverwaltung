import { LessonPresence } from '../models/lesson-presence.model';
import { PresenceType } from '../models/presence-type.model';
import { DropDownItem } from '../models/drop-down-item.model';
import { PresenceControlEntry } from '../../presence-control/models/presence-control-entry.model';
import { SubscriptionDetail } from '../models/subscription-detail.model';
import { GroupViewType } from '../models/user-setting.model';
import { LessonEntry } from '../../presence-control/models/lesson-entry.model';

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

export function filterByGroup(
  groupView: Option<GroupViewType>,
  entries: ReadonlyArray<PresenceControlEntry>,
  details: ReadonlyArray<SubscriptionDetail>,
  lesson: Option<LessonEntry>
): ReadonlyArray<PresenceControlEntry> {
  if (groupView?.group && groupView?.lessonId === lesson?.id) {
    const personIds = details
      .filter((d) => d.Value === groupView?.group)
      .map((d) => d.IdPerson);
    return entries.filter((e) =>
      personIds.find((id) => id === e.lessonPresence.StudentRef.Id)
    );
  }

  return entries;
}
