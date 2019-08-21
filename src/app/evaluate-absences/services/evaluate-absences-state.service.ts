import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { TypeaheadItem } from 'src/app/shared/models/typeahead-item';
import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';

export interface EvaluateAbsencesFilter {
  student: Option<TypeaheadItem>;
  moduleInstance: Option<TypeaheadItem>;
  studyClass: Option<TypeaheadItem>;
}

@Injectable()
export class EvaluateAbsencesStateService {
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

  constructor(
    private lessonPresenceService: LessonPresencesRestService,
    private loadingService: LoadingService
  ) {}

  setFilter(absencesFilter: EvaluateAbsencesFilter): void {
    this.filter$.next(absencesFilter);
  }

  private loadEntries(absencesFilter: EvaluateAbsencesFilter): Observable<any> {
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
