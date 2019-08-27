import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, filter, shareReplay } from 'rxjs/operators';

import { LoadingService } from 'src/app/shared/services/loading-service';
import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import { PresenceTypesRestService } from 'src/app/shared/services/presence-types-rest.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import { DropDownItemsRestService } from 'src/app/shared/services/drop-down-items-rest.service';

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
  entries$ = this.filter$.pipe(
    filter(isValidFilter),
    switchMap(this.loadEntries.bind(this))
  );
  presenceTypes$ = this.loadPresenceTypes().pipe(shareReplay(1));
  absenceConfirmationStates$ = this.loadAbsenceConfirmationStates().pipe(
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
    console.log(absencesFilter);
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
