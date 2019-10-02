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
  PaginatedFilteredEntriesService,
  PAGE_LOADING_CONTEXT
} from 'src/app/shared/services/paginated-filtered-entries.service';
import { SETTINGS, Settings } from 'src/app/settings';

export interface EvaluateAbsencesFilter {
  student: Option<number>;
  moduleInstance: Option<number>;
  studyClass: Option<number>;
}

@Injectable()
export class EvaluateAbsencesStateService extends PaginatedFilteredEntriesService<
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
      moduleInstance: null,
      studyClass: null
    };
  }

  protected isValidFilter(filterValue: EvaluateAbsencesFilter): boolean {
    return Boolean(
      filterValue.student ||
        filterValue.moduleInstance ||
        filterValue.studyClass
    );
  }

  protected loadEntries(
    filterValue: EvaluateAbsencesFilter,
    offset: number
  ): Observable<Paginated<ReadonlyArray<LessonPresenceStatistic>>> {
    return this.loadingService.load(
      this.lessonPresenceService.getStatistics(filterValue, offset),
      PAGE_LOADING_CONTEXT
    );
  }

  protected buildHttpParamsFromFilter(
    filterValue: EvaluateAbsencesFilter
  ): HttpParams {
    return buildHttpParamsFromAbsenceFilter(filterValue);
  }
}
