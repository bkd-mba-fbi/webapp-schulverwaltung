import { Location } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
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
import { Sorting, SortService } from "src/app/shared/services/sort.service";
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
  confirmBackLinkParams?: Params;

  constructor(
    location: Location,
    loadingService: LoadingService,
    @Inject(SETTINGS) settings: Settings,
    private lessonPresenceService: LessonPresencesRestService,
    sortService: SortService<keyof LessonPresenceStatistic>,
  ) {
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

  protected getInitialSorting(): Option<
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
