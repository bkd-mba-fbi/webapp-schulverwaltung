import { Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Params } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { DropDownItemsRestService } from 'src/app/shared/services/drop-down-items-rest.service';
import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { PresenceTypesService } from 'src/app/shared/services/presence-types.service';
import { sortDropDownItemsByValue } from 'src/app/shared/utils/drop-down-items';
import { spread } from 'src/app/shared/utils/function';
import { buildParamsFromAbsenceFilter } from 'src/app/shared/utils/absences-filter';
import {
  PaginatedEntriesService,
  PAGE_LOADING_CONTEXT,
} from 'src/app/shared/services/paginated-entries.service';
import { Paginated } from 'src/app/shared/utils/pagination';
import { SETTINGS, Settings } from 'src/app/settings';
import { IConfirmAbsencesService } from 'src/app/shared/tokens/confirm-absences-service';
import { buildPresenceControlEntries } from '../../shared/utils/presence-control-entries';
import { SortService } from 'src/app/shared/services/sort.service';

export interface EditAbsencesFilter {
  student: Option<number>;
  educationalEvent: Option<number>;
  studyClass: Option<number>;
  teacher: Option<string>;
  dateFrom: Option<Date>;
  dateTo: Option<Date>;
  presenceTypes: Option<number[]>;
  confirmationStates: Option<number[]>;
  incidentTypes: Option<number[]>;
}

@Injectable()
export class EditAbsencesStateService
  extends PaginatedEntriesService<LessonPresence, EditAbsencesFilter>
  implements IConfirmAbsencesService
{
  confirmBackLinkParams?: Params;

  presenceTypes$ = this.loadPresenceTypes().pipe(shareReplay(1));
  absenceConfirmationStates$ = this.loadAbsenceConfirmationStates().pipe(
    map(sortDropDownItemsByValue),
    shareReplay(1)
  );

  presenceControlEntries$ = combineLatest([
    this.entries$,
    this.presenceTypes$,
    this.absenceConfirmationStates$,
  ]).pipe(map(spread(buildPresenceControlEntries)), shareReplay(1));

  selected: ReadonlyArray<LessonPresence> = [];

  constructor(
    location: Location,
    loadingService: LoadingService,
    sortService: SortService<LessonPresence>,
    @Inject(SETTINGS) settings: Settings,
    private lessonPresencesService: LessonPresencesRestService,
    private presenceTypesService: PresenceTypesService,
    private dropDownItemsService: DropDownItemsRestService
  ) {
    super(location, loadingService, sortService, settings, '/edit-absences');

    this.queryParamsString$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (returnparams) => (this.confirmBackLinkParams = { returnparams })
      );
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
      educationalEvent: null,
      studyClass: null,
      teacher: null,
      dateFrom: null,
      dateTo: null,
      presenceTypes: null,
      confirmationStates: null,
      incidentTypes: null,
    };
  }

  protected isValidFilter(filterValue: EditAbsencesFilter): boolean {
    return Boolean(
      filterValue.student ||
        filterValue.educationalEvent ||
        filterValue.studyClass ||
        filterValue.teacher ||
        filterValue.dateFrom ||
        filterValue.dateTo ||
        filterValue.presenceTypes ||
        filterValue.confirmationStates ||
        filterValue.incidentTypes
    );
  }

  protected loadEntries(
    filterValue: EditAbsencesFilter,
    _sorting: null,
    offset: number
  ): Observable<Paginated<ReadonlyArray<LessonPresence>>> {
    const params: Dict<string> = {
      sort: 'StudentFullName.asc,LessonDateTimeFrom.asc',
    };

    return this.loadingService.load(
      this.lessonPresencesService.getFilteredList(filterValue, offset, params),
      PAGE_LOADING_CONTEXT
    );
  }

  protected buildParamsFromFilter(filterValue: EditAbsencesFilter): Params {
    return buildParamsFromAbsenceFilter(filterValue);
  }

  private loadPresenceTypes(): Observable<ReadonlyArray<PresenceType>> {
    return this.loadingService.load(
      this.presenceTypesService.activePresenceTypes$
    );
  }

  private loadAbsenceConfirmationStates(): Observable<
    ReadonlyArray<DropDownItem>
  > {
    return this.loadingService.load(
      this.dropDownItemsService.getAbsenceConfirmationStates()
    );
  }
}
