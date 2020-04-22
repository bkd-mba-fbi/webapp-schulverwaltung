import { Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { LessonPresenceStatistic } from 'src/app/shared/models/lesson-presence-statistic';
import { buildHttpParamsFromAbsenceFilter } from 'src/app/shared/utils/absences-filter';
import { Paginated } from 'src/app/shared/utils/pagination';
import {
  PaginatedEntriesService,
  PAGE_LOADING_CONTEXT,
  Sorting,
} from 'src/app/shared/services/paginated-entries.service';
import { SETTINGS, Settings } from 'src/app/settings';

export interface EvaluateAbsencesFilter {
  student: Option<number>;
  educationalEvent: Option<number>;
  studyClass: Option<number>;
}

@Injectable()
export class EvaluateAbsencesStateService extends PaginatedEntriesService<
  LessonPresenceStatistic,
  EvaluateAbsencesFilter
> {
  constructor(
    location: Location,
    loadingService: LoadingService,
    @Inject(SETTINGS) settings: Settings,
    private lessonPresenceService: LessonPresencesRestService
  ) {
    super(location, loadingService, settings, '/evaluate-absences');
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
        filterValue.studyClass
    );
  }

  protected getInitialSorting(): Option<Sorting<LessonPresenceStatistic>> {
    return {
      key: 'StudentFullName',
      ascending: true,
    };
  }

  protected loadEntries(
    filterValue: EvaluateAbsencesFilter,
    sorting: Option<Sorting<LessonPresenceStatistic>>,
    offset: number
  ): Observable<Paginated<ReadonlyArray<LessonPresenceStatistic>>> {
    return this.loadingService.load(
      this.lessonPresenceService.getStatistics(filterValue, sorting, offset),
      PAGE_LOADING_CONTEXT
    );
  }

  protected buildHttpParamsFromFilter(
    filterValue: EvaluateAbsencesFilter
  ): HttpParams {
    return buildHttpParamsFromAbsenceFilter(filterValue);
  }
}
