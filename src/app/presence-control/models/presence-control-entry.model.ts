import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { Settings } from 'src/app/settings';
import { Searchable } from 'src/app/shared/utils/search';
import {
  isAbsent,
  isDefaultAbsence,
  canChangePresenceType,
  isUnapprovedAbsence,
} from '../utils/presence-types';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';

export enum PresenceCategory {
  Present = 'present',
  Unapproved = 'unapproved',
  Absent = 'absent',
}

export class PresenceControlEntry implements Searchable {
  readonly studentFullName: string;
  constructor(
    public lessonPresence: LessonPresence,
    public presenceType: Option<PresenceType>,
    public confirmationState?: DropDownItem
  ) {
    this.studentFullName = lessonPresence.StudentFullName;
  }

  get presenceCategory(): PresenceCategory {
    if (isUnapprovedAbsence(this.settings, this.confirmationState?.Key)) {
      return PresenceCategory.Unapproved;
    }

    if (isAbsent(this.presenceType)) {
      return PresenceCategory.Absent;
    }

    return PresenceCategory.Present;
  }

  get nextPresenceCategory(): PresenceCategory {
    return this.presenceCategory === PresenceCategory.Absent
      ? PresenceCategory.Present
      : PresenceCategory.Absent;
  }

  getNextPresenceType(
    presenceTypes: ReadonlyArray<PresenceType>
  ): Option<PresenceType> {
    switch (this.nextPresenceCategory) {
      case PresenceCategory.Absent:
        return this.presenceCategory === PresenceCategory.Unapproved
          ? this.presenceType
          : presenceTypes.find((type) =>
              isDefaultAbsence(type, this.settings)
            ) || null;
      default:
        return null;
    }
  }

  get canChangePresenceType(): boolean {
    return canChangePresenceType(
      this.lessonPresence,
      this.presenceType,
      this.settings
    );
  }

  get canChangeIncident(): boolean {
    return !isAbsent(this.presenceType);
  }

  get showDesignation(): boolean {
    return (
      !this.canChangePresenceType ||
      this.presenceCategory === PresenceCategory.Unapproved
    );
  }

  get presenceCategoryIcon(): string {
    switch (this.presenceCategory) {
      case 'absent':
        return 'cancel';
      case 'unapproved':
        return 'help';
      default:
        return 'check_circle';
    }
  }

  private get settings(): Settings {
    return window.absenzenmanagement.settings;
  }
}
