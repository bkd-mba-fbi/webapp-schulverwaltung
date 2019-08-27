import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { PresenceControlEntry } from 'src/app/presence-control/models/presence-control-entry.model';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { DropDownItemsRestService } from 'src/app/shared/services/drop-down-items-rest.service';
import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { PresenceTypesRestService } from 'src/app/shared/services/presence-types-rest.service';
import { sortDropDownItemsByValue } from 'src/app/shared/utils/drop-down-items';
import { spreadTriplet } from 'src/app/shared/utils/function';
import { sortPresenceTypes } from 'src/app/shared/utils/presence-types';

export interface EditAbsencesFilter {
  student: Option<DropDownItem>;
  moduleInstance: Option<DropDownItem>;
  studyClass: Option<DropDownItem>;
  dateFrom: Option<Date>;
  dateTo: Option<Date>;
  presenceType: Option<DropDownItem>;
  confirmationState: Option<DropDownItem>;
}

@Injectable({
  providedIn: 'root'
})
export class EditAbsencesStateService {
  private filter$ = new BehaviorSubject<EditAbsencesFilter>({
    student: null,
    moduleInstance: null,
    studyClass: null,
    dateFrom: null,
    dateTo: null,
    presenceType: null,
    confirmationState: null
  });

  loading$ = this.loadingService.loading$;
  isFilterValid$ = this.filter$.pipe(map(isValidFilter));
  lessonPresences$ = this.filter$.pipe(
    filter(isValidFilter),
    switchMap(this.loadEntries.bind(this))
  );
  presenceTypes$ = this.loadPresenceTypes().pipe(
    map(sortPresenceTypes),
    shareReplay(1)
  );
  absenceConfirmationStates$ = this.loadAbsenceConfirmationStates().pipe(
    map(sortDropDownItemsByValue),
    shareReplay(1)
  );

  presenceControlEntries$ = combineLatest(
    this.lessonPresences$,
    this.presenceTypes$,
    this.absenceConfirmationStates$
  ).pipe(
    map(spreadTriplet(getPresenceControlEntries)),
    shareReplay(1)
  );

  constructor(
    private loadingService: LoadingService,
    private lessonPresencesService: LessonPresencesRestService,
    private presenceTypesService: PresenceTypesRestService,
    private dropDownItemsService: DropDownItemsRestService
  ) {}

  setFilter(absencesFilter: EditAbsencesFilter): void {
    this.filter$.next(absencesFilter);
  }

  private loadEntries(
    absencesFilter: EditAbsencesFilter
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.loadingService.load(
      this.lessonPresencesService.getFilteredList(absencesFilter)
    );
  }

  private loadPresenceTypes(): Observable<ReadonlyArray<PresenceType>> {
    return this.loadingService.load(this.presenceTypesService.getList());
  }

  private loadAbsenceConfirmationStates(): Observable<
    ReadonlyArray<DropDownItem>
  > {
    return this.loadingService.load(
      this.dropDownItemsService.getAbsenceConfirmationStates()
    );
  }
}

function isValidFilter(absencesFilter: EditAbsencesFilter): boolean {
  return Boolean(
    absencesFilter.student ||
      absencesFilter.moduleInstance ||
      absencesFilter.studyClass ||
      absencesFilter.dateFrom ||
      absencesFilter.dateTo ||
      absencesFilter.presenceType ||
      absencesFilter.confirmationState
  );
}

function getPresenceControlEntries(
  lessonPresences: ReadonlyArray<LessonPresence>,
  presenceTypes: ReadonlyArray<PresenceType>,
  confirmationStates: ReadonlyArray<DropDownItem>
): ReadonlyArray<PresenceControlEntry> {
  return lessonPresences.map(lessonPresence => {
    let presenceType = null;
    if (lessonPresence.TypeRef.Id) {
      presenceType =
        presenceTypes.find(t => t.Id === lessonPresence.TypeRef.Id) || null;
    }
    let confirmationState;
    if (lessonPresence.ConfirmationStateId) {
      confirmationState = confirmationStates.find(
        s => s.Key === lessonPresence.ConfirmationStateId
      );
    }
    return new PresenceControlEntry(
      lessonPresence,
      presenceType,
      confirmationState
    );
  });
}
