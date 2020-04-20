import { Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

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
import { buildHttpParamsFromAbsenceFilter } from 'src/app/shared/utils/absences-filter';
import {
  PaginatedFilteredEntriesService,
  PAGE_LOADING_CONTEXT,
} from 'src/app/shared/services/paginated-filtered-entries.service';
import { Paginated } from 'src/app/shared/utils/pagination';
import { SETTINGS, Settings } from 'src/app/settings';

export interface EditAbsencesFilter {
  student: Option<number>;
  moduleInstance: Option<number>;
  studyClass: Option<number>;
  dateFrom: Option<Date>;
  dateTo: Option<Date>;
  presenceType: Option<number>;
  confirmationState: Option<number>;
}

@Injectable()
export class EditAbsencesStateService extends PaginatedFilteredEntriesService<
  LessonPresence,
  EditAbsencesFilter
> {
  presenceTypes$ = this.loadPresenceTypes().pipe(
    map(this.filterAbsenceTypes.bind(this)),
    map(sortPresenceTypes),
    shareReplay(1)
  );
  absenceConfirmationStates$ = this.loadAbsenceConfirmationStates().pipe(
    map(sortDropDownItemsByValue),
    shareReplay(1)
  );

  presenceControlEntries$ = combineLatest([
    this.entries$,
    this.presenceTypes$,
    this.absenceConfirmationStates$,
  ]).pipe(map(spreadTriplet(getPresenceControlEntries)), shareReplay(1));

  selected: ReadonlyArray<{
    lessonIds: ReadonlyArray<number>;
    personIds: ReadonlyArray<number>;
  }> = [];

  constructor(
    location: Location,
    loadingService: LoadingService,
    @Inject(SETTINGS) settings: Settings,
    private lessonPresencesService: LessonPresencesRestService,
    private presenceTypesService: PresenceTypesRestService,
    private dropDownItemsService: DropDownItemsRestService
  ) {
    super(location, loadingService, settings, '/edit-absences');
  }

  /**
   * Clears the selected entries.
   */
  resetSelection(): void {
    this.selected = [];
  }

  protected getInitialFilter(): EditAbsencesFilter {
    return {
      student: null,
      moduleInstance: null,
      studyClass: null,
      dateFrom: null,
      dateTo: null,
      presenceType: null,
      confirmationState: null,
    };
  }

  protected isValidFilter(filterValue: EditAbsencesFilter): boolean {
    return Boolean(
      filterValue.student ||
        filterValue.moduleInstance ||
        filterValue.studyClass ||
        filterValue.dateFrom ||
        filterValue.dateTo ||
        filterValue.presenceType ||
        filterValue.confirmationState
    );
  }

  protected loadEntries(
    filterValue: EditAbsencesFilter,
    offset: number
  ): Observable<Paginated<ReadonlyArray<LessonPresence>>> {
    return this.loadingService.load(
      this.lessonPresencesService.getFilteredList(filterValue, offset),
      PAGE_LOADING_CONTEXT
    );
  }

  protected buildHttpParamsFromFilter(
    filterValue: EditAbsencesFilter
  ): HttpParams {
    return buildHttpParamsFromAbsenceFilter(filterValue);
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

  private filterAbsenceTypes(
    types: ReadonlyArray<PresenceType>
  ): ReadonlyArray<PresenceType> {
    return types.filter((t) => t.Active);
  }
}

function getPresenceControlEntries(
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
    let confirmationState;
    if (lessonPresence.ConfirmationStateId) {
      confirmationState = confirmationStates.find(
        (s) => s.Key === lessonPresence.ConfirmationStateId
      );
    }
    return new PresenceControlEntry(
      lessonPresence,
      presenceType,
      confirmationState
    );
  });
}
