import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { Settings } from 'src/app/settings';
import { Searchable } from 'src/app/shared/utils/search';
import {
  isAbsent,
  isLate,
  isDefaultAbsence,
  canChangePresenceType,
} from '../utils/presence-types';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';

export enum PresenceCategory {
  Present = 'present',
  Absent = 'absent',
  Late = 'late',
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
    if (isAbsent(this.presenceType)) {
      return PresenceCategory.Absent;
    }

    if (isLate(this.presenceType, this.settings)) {
      return PresenceCategory.Late;
    }

    return PresenceCategory.Present;
  }

  get nextPresenceCategory(): PresenceCategory {
    const categories = Object.keys(PresenceCategory).map(
      (c) => PresenceCategory[c as keyof typeof PresenceCategory]
    );
    const currentCategory = this.presenceCategory;
    const index = categories.findIndex((c) => c === currentCategory);
    return categories[(index + 1) % categories.length] as PresenceCategory;
  }

  getNextPresenceType(
    presenceTypes: ReadonlyArray<PresenceType>
  ): Option<PresenceType> {
    switch (this.nextPresenceCategory) {
      case PresenceCategory.Absent:
        return (
          presenceTypes.find((type) => isDefaultAbsence(type, this.settings)) ||
          null
        );
      case PresenceCategory.Late:
        return (
          presenceTypes.find((type) => isLate(type, this.settings)) || null
        );
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

  get presenceCategoryIcon(): string {
    switch (this.presenceCategory) {
      case 'absent':
        return 'cancel';
      case 'late':
        return 'watch_later';
      default:
        return 'check_circle';
    }
  }

  private get settings(): Settings {
    return window.absenzenmanagement.settings;
  }
}
