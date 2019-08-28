import { Injectable, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { LessonPresenceStatistic } from 'src/app/shared/models/lesson-presence-statistic';
import { buildHttpParamsFromAbsenceFilter } from 'src/app/shared/utils/absences-filter';

export interface EvaluateAbsencesFilter {
  student: Option<number>;
  moduleInstance: Option<number>;
  studyClass: Option<number>;
}

@Injectable()
export class EvaluateAbsencesStateService implements OnDestroy {
  private filter$ = new BehaviorSubject<EvaluateAbsencesFilter>({
    student: null,
    moduleInstance: null,
    studyClass: null
  });

  loading$ = this.loadingService.loading$;
  isFilterValid$ = this.filter$.pipe(map(isValidFilter));
  entries$ = this.filter$.pipe(
    filter(isValidFilter),
    switchMap(this.loadEntries.bind(this))
  );

  queryParams$ = this.filter$.pipe(map(buildHttpParamsFromAbsenceFilter));

  private destroy$ = new Subject<void>();

  constructor(
    private lessonPresenceService: LessonPresencesRestService,
    private loadingService: LoadingService,
    private location: Location
  ) {
    this.queryParams$
      .pipe(takeUntil(this.destroy$))
      .subscribe(params =>
        this.location.replaceState('/evaluate-absences', params.toString())
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  setFilter(absencesFilter: EvaluateAbsencesFilter): void {
    this.filter$.next(absencesFilter);
  }

  private loadEntries(
    absencesFilter: EvaluateAbsencesFilter
  ): Observable<ReadonlyArray<LessonPresenceStatistic>> {
    return this.loadingService.load(
      this.lessonPresenceService.getStatistics(absencesFilter)
    );
  }
}

export function isValidFilter(absencesFilter: EvaluateAbsencesFilter): boolean {
  return Boolean(
    absencesFilter.student ||
      absencesFilter.moduleInstance ||
      absencesFilter.studyClass
  );
}
