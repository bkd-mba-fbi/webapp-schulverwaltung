import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { Settings } from 'src/app/settings';
import { Searchable } from 'src/app/shared/utils/search';

export enum PresenceCategory {
  Present = 'present',
  Absent = 'absent',
  Late = 'late'
}

export class PresenceControlEntry implements Searchable {
  readonly studentFullName: string;
  constructor(
    public lessonPresence: LessonPresence,
    public presenceType: Option<PresenceType>,
    public blockLessonPresences: ReadonlyArray<LessonPresence> = []
  ) {
    this.studentFullName = lessonPresence.StudentFullName;
  }

  get presenceCategory(): PresenceCategory {
    if (this.isAbsent(this.presenceType)) {
      return PresenceCategory.Absent;
    }

    if (this.isLate(this.presenceType)) {
      return PresenceCategory.Late;
    }

    return PresenceCategory.Present;
  }

  get nextPresenceCategory(): PresenceCategory {
    const categories = Object.keys(PresenceCategory).map(
      c => PresenceCategory[c as any] as string
    );
    const currentCategory = this.presenceCategory;
    const index = categories.findIndex(c => c === currentCategory);
    return categories[(index + 1) % categories.length] as PresenceCategory;
  }

  getNextPresenceType(
    presenceTypes: ReadonlyArray<PresenceType>
  ): Option<PresenceType> {
    switch (this.nextPresenceCategory) {
      case PresenceCategory.Absent:
        return presenceTypes.find(this.isDefaultAbsence.bind(this)) || null;
      case PresenceCategory.Late:
        return presenceTypes.find(this.isLate.bind(this)) || null;
      default:
        return null;
    }
  }

  private isAbsent(presenceType: Option<PresenceType>): boolean {
    return Boolean(
      presenceType &&
        (presenceType.IsAbsence === 1 ||
          presenceType.IsDispensation === 1 ||
          presenceType.IsHalfDay === 1)
    );
  }

  private isDefaultAbsence(presenceType: Option<PresenceType>): boolean {
    return Boolean(
      presenceType &&
        this.settings &&
        presenceType.Id === this.settings.absencePresenceTypeId
    );
  }

  private isLate(presenceType: Option<PresenceType>): boolean {
    return Boolean(
      presenceType &&
        this.settings &&
        presenceType.Id === this.settings.latePresenceTypeId
    );
  }

  private get settings(): Settings {
    return window.absenzenmanagement.settings;
  }
}
