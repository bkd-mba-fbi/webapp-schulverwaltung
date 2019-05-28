import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { Settings } from 'src/app/shared/services/settings.service';

export type PresenceCategory = 'present' | 'absent' | 'late';

export class PresenceControlEntry {
  constructor(
    public lessonPresence: LessonPresence,
    public presenceType: Option<PresenceType>
  ) {}

  get presenceCategory(): PresenceCategory {
    if (this.presenceType && this.presenceType.IsAbsence === 1) {
      return 'absent';
    }

    if (
      this.settings &&
      this.presenceType &&
      this.settings.latePresenceTypeId === this.presenceType.Id
    ) {
      return 'late';
    }

    return 'present';
  }

  private get settings(): Option<Settings> {
    return (
      ((window as any).absenzenmanagement &&
        (window as any).absenzenmanagement.settings) ||
      null
    );
  }
}
