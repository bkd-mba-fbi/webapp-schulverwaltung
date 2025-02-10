import { Location } from "@angular/common";
import { Injectable, inject } from "@angular/core";
import { Params } from "@angular/router";
import { Observable, combineLatest } from "rxjs";
import { map, shareReplay, takeUntil } from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { PresenceType } from "src/app/shared/models/presence-type.model";
import { DropDownItemsRestService } from "src/app/shared/services/drop-down-items-rest.service";
import { LessonPresencesRestService } from "src/app/shared/services/lesson-presences-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import {
  PAGE_LOADING_CONTEXT,
  PaginatedEntriesService,
} from "src/app/shared/services/paginated-entries.service";
import { PresenceTypesService } from "src/app/shared/services/presence-types.service";
import { SortService } from "src/app/shared/services/sort.service";
import { IConfirmAbsencesService } from "src/app/shared/tokens/confirm-absences-service";
import { buildParamsFromAbsenceFilter } from "src/app/shared/utils/absences-filter";
import { sortDropDownItemsByValue } from "src/app/shared/utils/drop-down-items";
import { spread } from "src/app/shared/utils/function";
import { Paginated } from "src/app/shared/utils/pagination";
import { buildPresenceControlEntries } from "../../shared/utils/presence-control-entries";

export interface EditAbsencesFilter {
  student: Option<number>;
  educationalEvent: Option<number>;
  studyClass: Option<number>;
  teacher: Option<string>;
  dateFrom: Option<Date>;
  dateTo: Option<Date>;
  weekdays: Option<ReadonlyArray<string>>;
  presenceTypes: Option<ReadonlyArray<number>>;
  confirmationStates: Option<ReadonlyArray<number>>;
  incidentTypes: Option<ReadonlyArray<number>>;
}

@Injectable()
export class EditAbsencesStateService
  extends PaginatedEntriesService<LessonPresence, EditAbsencesFilter>
  implements IConfirmAbsencesService
{
  private lessonPresencesService = inject(LessonPresencesRestService);
  private presenceTypesService = inject(PresenceTypesService);
  private dropDownItemsService = inject(DropDownItemsRestService);

  confirmBackLinkParams?: Params;

  weekdays$ = this.loadWeekdays().pipe(shareReplay(1));
  presenceTypes$ = this.loadPresenceTypes().pipe(shareReplay(1));
  absenceConfirmationStates$ = this.loadAbsenceConfirmationStates().pipe(
    map(sortDropDownItemsByValue),
    shareReplay(1),
  );

  presenceControlEntries$ = combineLatest([
    this.entries$,
    this.presenceTypes$,
    this.absenceConfirmationStates$,
  ]).pipe(map(spread(buildPresenceControlEntries)), shareReplay(1));

  selected: ReadonlyArray<LessonPresence> = [];

  constructor() {
    const location = inject(Location);
    const loadingService = inject(LoadingService);
    const sortService = inject<SortService<keyof LessonPresence>>(SortService);
    const settings = inject<Settings>(SETTINGS);

    super(location, loadingService, sortService, settings, "/edit-absences");

    this.queryParamsString$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (returnparams) => (this.confirmBackLinkParams = { returnparams }),
      );
  }

  /**
   * Clears the selected entries.
   */
  resetSelection(): void {
    this.selected = [];
  }

  updateAfterConfirm(): void {
    // Reload the entries if absences have been confirmed in the dossier view of
    // a student and the user is returning to the list. To keep things easy, we
    // accept that we loose any loaded pages and just reload the first page.
    this.resetEntries();
  }

  protected getInitialFilter(): EditAbsencesFilter {
    return {
      student: null,
      educationalEvent: null,
      studyClass: null,
      teacher: null,
      dateFrom: null,
      dateTo: null,
      weekdays: null,
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
        filterValue.weekdays ||
        filterValue.presenceTypes ||
        filterValue.confirmationStates ||
        filterValue.incidentTypes,
    );
  }

  protected loadEntries(
    filterValue: EditAbsencesFilter,
    _sorting: null,
    offset: number,
  ): Observable<Paginated<ReadonlyArray<LessonPresence>>> {
    const params: Dict<string> = {
      sort: "StudentFullName.asc,LessonDateTimeFrom.asc",
    };

    return this.loadingService.load(
      this.lessonPresencesService.getFilteredList(filterValue, offset, params),
      PAGE_LOADING_CONTEXT,
    );
  }

  protected buildParamsFromFilter(filterValue: EditAbsencesFilter): Params {
    return buildParamsFromAbsenceFilter(filterValue);
  }

  private loadWeekdays(): Observable<ReadonlyArray<DropDownItem>> {
    return this.loadingService.load(this.dropDownItemsService.getWeekdays());
  }

  private loadPresenceTypes(): Observable<ReadonlyArray<PresenceType>> {
    return this.loadingService.load(
      this.presenceTypesService.activePresenceTypes$,
    );
  }

  private loadAbsenceConfirmationStates(): Observable<
    ReadonlyArray<DropDownItem>
  > {
    return this.loadingService.load(
      this.dropDownItemsService.getAbsenceConfirmationStates(),
    );
  }
}
