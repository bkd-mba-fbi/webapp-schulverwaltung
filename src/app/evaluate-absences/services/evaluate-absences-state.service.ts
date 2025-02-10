import { Location } from "@angular/common";
import { Injectable, inject } from "@angular/core";
import { Params } from "@angular/router";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { LessonPresenceStatistic } from "src/app/shared/models/lesson-presence-statistic";
import { LessonPresencesRestService } from "src/app/shared/services/lesson-presences-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import {
  PAGE_LOADING_CONTEXT,
  PaginatedEntriesService,
} from "src/app/shared/services/paginated-entries.service";
import { SortService, Sorting } from "src/app/shared/services/sort.service";
import { IConfirmAbsencesService } from "src/app/shared/tokens/confirm-absences-service";
import { buildParamsFromAbsenceFilter } from "src/app/shared/utils/absences-filter";
import { Paginated } from "src/app/shared/utils/pagination";

export interface EvaluateAbsencesFilter {
  student: Option<number>;
  educationalEvent: Option<number>;
  studyClass: Option<number>;
}

@Injectable()
export class EvaluateAbsencesStateService
  extends PaginatedEntriesService<
    LessonPresenceStatistic,
    EvaluateAbsencesFilter
  >
  implements IConfirmAbsencesService
{
  private lessonPresenceService = inject(LessonPresencesRestService);

  confirmBackLinkParams?: Params;

  constructor() {
    const location = inject(Location);
    const loadingService = inject(LoadingService);
    const settings = inject<Settings>(SETTINGS);
    const sortService =
      inject<SortService<keyof LessonPresenceStatistic>>(SortService);

    super(
      location,
      loadingService,
      sortService,
      settings,
      "/evaluate-absences",
    );

    this.queryParamsString$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (returnparams) => (this.confirmBackLinkParams = { returnparams }),
      );
  }

  updateAfterConfirm(): void {
    // Reload the entries if absences have been confirmed in the dossier view of
    // a student and the user is returning to the list. To keep things easy, we
    // accept that we loose any loaded pages and just reload the first page.
    this.resetEntries();
  }

  protected getInitialFilter(): EvaluateAbsencesFilter {
    return {
      student: null,
      educationalEvent: null,
      studyClass: null,
    };
  }

  protected isValidFilter(filterValue: EvaluateAbsencesFilter): boolean {
    return Boolean(
      filterValue.student ||
        filterValue.educationalEvent ||
        filterValue.studyClass,
    );
  }

  protected override getInitialSorting(): Option<
    Sorting<keyof LessonPresenceStatistic>
  > {
    return {
      key: "StudentFullName",
      ascending: true,
    };
  }

  protected loadEntries(
    filterValue: EvaluateAbsencesFilter,
    sorting: Option<Sorting<keyof LessonPresenceStatistic>>,
    offset: number,
  ): Observable<Paginated<ReadonlyArray<LessonPresenceStatistic>>> {
    return this.loadingService.load(
      this.lessonPresenceService.getStatistics(filterValue, sorting, offset),
      PAGE_LOADING_CONTEXT,
    );
  }

  protected buildParamsFromFilter(filterValue: EvaluateAbsencesFilter): Params {
    return buildParamsFromAbsenceFilter(filterValue);
  }
}
