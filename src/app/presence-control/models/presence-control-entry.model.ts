import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { Settings } from 'src/app/shared/services/settings.service';

export enum PresenceCategory {
  Present = 'present',
  Absent = 'absent',
  Late = 'late'
}

export class PresenceControlEntry {
  constructor(
    public lessonPresence: LessonPresence,
    public presenceType: Option<PresenceType>
  ) {}

  get presenceCategory(): PresenceCategory {
    if (
      this.presenceType &&
      (this.presenceType.IsAbsence === 1 ||
        this.presenceType.IsDispensation === 1 ||
        this.presenceType.IsHalfDay === 1)
    ) {
      return PresenceCategory.Absent;
    }

    if (
      this.presenceType &&
      this.settings &&
      this.presenceType.Id === this.settings.latePresenceTypeId
    ) {
      return PresenceCategory.Late;
    }

    return PresenceCategory.Present;
  }

  private get settings(): Option<Settings> {
    return (
      ((window as any).absenzenmanagement &&
        (window as any).absenzenmanagement.settings) ||
      null
    );
  }
}
