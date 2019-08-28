import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { LessonPresenceStatistic } from 'src/app/shared/models/lesson-presence-statistic';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';

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

  queryParams$ = this.filter$.pipe(
    map(f =>
      buildHttpParamsForFilter([
        [f.student, 'student'],
        [f.moduleInstance, 'moduleInstance'],
        [f.studyClass, 'studyClass']
      ])
    )
  );

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

function isValidFilter(absencesFilter: EvaluateAbsencesFilter): boolean {
  return Boolean(
    absencesFilter.student ||
      absencesFilter.moduleInstance ||
      absencesFilter.studyClass
  );
}

function buildHttpParamsForFilter(
  filterValues: ReadonlyArray<[Option<number>, string]>
): HttpParams {
  return filterValues.reduce((acc, [id, field]) => {
    if (id && field) {
      return acc.set(`${field}`, `${id}`);
    }
    return acc;
  }, new HttpParams());
}
