import { PresenceType } from "src/app/shared/models/presence-type.model";
import { Settings } from "src/app/settings";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";

export function isPresent(presenceType: Option<PresenceType>): boolean {
  return Boolean(!presenceType);
}

export function isComment(presenceType: Option<PresenceType>): boolean {
  return Boolean(presenceType && presenceType.IsComment);
}

export function isIncident(presenceType: Option<PresenceType>): boolean {
  return Boolean(presenceType && presenceType.IsIncident);
}

export function isAbsent(presenceType: Option<PresenceType>): boolean {
  return Boolean(
    presenceType &&
      (presenceType.IsAbsence ||
        presenceType.IsDispensation ||
        presenceType.IsHalfDay),
  );
}

export function isDefaultAbsence(
  presenceType: Option<PresenceType>,
  settings: Settings,
): boolean {
  return Boolean(
    presenceType &&
      settings &&
      presenceType.Id === settings.absencePresenceTypeId,
  );
}

export function isUnapprovedAbsence(
  settings: Settings,
  confirmationStateId: Maybe<number>,
): boolean {
  return Boolean(
    settings &&
      confirmationStateId &&
      confirmationStateId === settings.checkableAbsenceStateId,
  );
}

export function isLate(
  presenceType: Option<PresenceType>,
  settings: Settings,
): boolean {
  return Boolean(
    presenceType && settings && presenceType.Id === settings.latePresenceTypeId,
  );
}

export function canChangePresenceType(
  lessonPresence: LessonPresence,
  presenceType: Option<PresenceType>,
  settings: Settings,
): boolean {
  if (
    (isPresent(presenceType) && lessonPresence.ConfirmationStateId === null) ||
    isComment(presenceType) ||
    isIncident(presenceType)
  ) {
    return true;
  }
  if (
    isAbsent(presenceType) &&
    lessonPresence.ConfirmationStateId === settings.unconfirmedAbsenceStateId
  ) {
    return true;
  }
  if (isUnapprovedAbsence(settings, lessonPresence.ConfirmationStateId)) {
    return true;
  }
  return false;
}

export function getNewConfirmationStateId(
  presenceType: Option<PresenceType>,
  settings: Settings,
): Option<number> {
  return presenceType?.IsAbsence ? settings.unconfirmedAbsenceStateId : null;
}
