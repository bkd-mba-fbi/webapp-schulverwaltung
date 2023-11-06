import { Inject, Injectable } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { PresenceType } from "src/app/shared/models/presence-type.model";
import { LessonPresencesUpdateRestService } from "src/app/shared/services/lesson-presences-update-rest.service";
import { not } from "src/app/shared/utils/filter";
import { getIdsGroupedByPerson } from "src/app/shared/utils/lesson-presences";

export enum Category {
  Absent = "absent",
  Dispensation = "dispensation",
  HalfDay = "half-day",
  Incident = "incident",
  Present = "present",
}

@Injectable({
  providedIn: "root",
})
export class EditAbsencesUpdateService {
  constructor(
    private updateService: LessonPresencesUpdateRestService,
    @Inject(SETTINGS) private settings: Settings,
  ) {}

  update(
    entries: ReadonlyArray<LessonPresence>,
    presenceTypes: ReadonlyArray<PresenceType>,
    category: Category,
    confirmationValue: Option<number>,
    absenceTypeId: Option<number>,
    incidentId: Option<number>,
  ): Observable<void> {
    let requests: ReadonlyArray<Observable<void>> = [];
    switch (category) {
      case Category.Present:
        requests = this.createResetBulkRequests(entries);
        break;
      case Category.Absent:
        requests = this.createAbsentEditBulkRequests(
          entries,
          presenceTypes,
          confirmationValue,
          absenceTypeId,
        );
        break;
      case Category.Dispensation:
        requests = this.createEditBulkRequests(
          entries,
          null,
          this.settings.dispensationPresenceTypeId,
        );
        break;
      case Category.HalfDay:
        requests = this.createEditBulkRequests(
          entries,
          null,
          this.settings.halfDayPresenceTypeId,
        );
        break;
      case Category.Incident:
        requests = this.createEditBulkRequests(entries, null, incidentId);
        break;
    }

    return combineLatest(requests).pipe(map(() => undefined));
  }

  private createAbsentEditBulkRequests(
    entries: ReadonlyArray<LessonPresence>,
    presenceTypes: ReadonlyArray<PresenceType>,
    confirmationValue: Option<number>,
    absenceTypeId: Option<number>,
  ): ReadonlyArray<Observable<void>> {
    if (confirmationValue === this.settings.excusedAbsenceStateId) {
      // Update all entries to the absence type selected by the user
      return this.createEditBulkRequests(
        entries,
        confirmationValue,
        absenceTypeId,
      );
    } else if (confirmationValue === this.settings.unexcusedAbsenceStateId) {
      // Update all entries to the default absence type (possibly
      // overriding the existing absence type)
      return this.createEditBulkRequests(
        entries,
        confirmationValue,
        this.settings.absencePresenceTypeId,
      );
    } else {
      return [
        // Update presences, dispensations, half days an incidents
        // to the default absence type
        ...this.createEditBulkRequests(
          entries.filter(overrideAbsenceType(presenceTypes, this.settings)),
          confirmationValue,
          this.settings.absencePresenceTypeId,
        ),
        // Keep the existing absence type for all other entries
        ...this.createEditBulkRequests(
          entries.filter(
            not(overrideAbsenceType(presenceTypes, this.settings)),
          ),
          confirmationValue,
          null,
        ),
      ];
    }
  }

  private createResetBulkRequests(
    entries: ReadonlyArray<LessonPresence>,
  ): ReadonlyArray<Observable<void>> {
    return getIdsGroupedByPerson(entries).map(({ lessonIds, personIds }) =>
      this.updateService.removeLessonPresences(lessonIds, personIds),
    );
  }

  private createEditBulkRequests(
    entries: ReadonlyArray<LessonPresence>,
    confirmationValue: Option<number>,
    absenceTypeId: Option<number>,
  ): ReadonlyArray<Observable<void>> {
    return getIdsGroupedByPerson(entries).map(({ lessonIds, personIds }) =>
      this.updateService.editLessonPresences(
        lessonIds,
        personIds,
        absenceTypeId || undefined,
        confirmationValue || undefined,
      ),
    );
  }
}

function overrideAbsenceType(
  presenceTypes: ReadonlyArray<PresenceType>,
  settings: Settings,
): (entry: LessonPresence) => boolean {
  return (entry) => {
    const presenceType = presenceTypes.find((t) => t.Id === entry.TypeRef.Id);
    return (
      !presenceType ||
      presenceType.Id === settings.dispensationPresenceTypeId ||
      presenceType.Id === settings.halfDayPresenceTypeId ||
      presenceType.IsIncident
    );
  };
}
