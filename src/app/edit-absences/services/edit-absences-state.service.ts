import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TypeaheadItem } from 'src/app/shared/models/typeahead-item';
import { map, switchMap, filter } from 'rxjs/operators';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';

export interface EditAbsencesFilter {
  student: Option<TypeaheadItem>;
  moduleInstance: Option<TypeaheadItem>;
  studyClass: Option<TypeaheadItem>;
  dateFrom: Option<Date>;
  dateTo: Option<Date>;
  reason: Option<TypeaheadItem>;
  state: Option<TypeaheadItem>;
}

@Injectable({
  providedIn: 'root'
})
export class EditAbsencesStateService {
  private filter$ = new BehaviorSubject<EditAbsencesFilter>({
    student: null,
    moduleInstance: null,
    studyClass: null,
    dateFrom: null,
    dateTo: null,
    reason: null,
    state: null
  });

  loading$ = this.loadingService.loading$;
  isFilterValid$ = this.filter$.pipe(map(isValidFilter));
  entries$ = this.filter$.pipe(
    filter(isValidFilter),
    switchMap(this.loadEntries.bind(this))
  );

  constructor(
    private loadingService: LoadingService,
    private lessonPresencesService: LessonPresencesRestService
  ) {}

  setFilter(absencesFilter: EditAbsencesFilter): void {
    this.filter$.next(absencesFilter);
  }

  private loadEntries(
    absencesFilter: EditAbsencesFilter
  ): Observable<ReadonlyArray<LessonPresence>> {
    console.log(absencesFilter);
    return this.loadingService.load(
      this.lessonPresencesService.search(absencesFilter)
    );
  }
}

function isValidFilter(absencesFilter: EditAbsencesFilter): boolean {
  return Boolean(
    absencesFilter.student ||
      absencesFilter.moduleInstance ||
      absencesFilter.studyClass ||
      absencesFilter.dateFrom ||
      absencesFilter.dateTo
  );
}
