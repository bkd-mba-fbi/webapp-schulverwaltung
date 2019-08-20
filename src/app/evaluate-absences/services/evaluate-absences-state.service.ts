import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

import { TypeaheadItem } from 'src/app/shared/models/typeahead-item';

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

  isFilterValid$ = this.filter$.pipe(map(isValidFilter));
  entries$ = this.filter$.pipe(
    filter(isValidFilter),
    switchMap(this.loadEntries.bind(this))
  );

  constructor() {}

  setFilter(absencesFilter: EvaluateAbsencesFilter): void {
    this.filter$.next(absencesFilter);
  }

  private loadEntries(absencesFilter: EvaluateAbsencesFilter): Observable<any> {
    return of([]);
  }
}

function isValidFilter(absencesFilter: EvaluateAbsencesFilter): boolean {
  return Boolean(
    absencesFilter.student ||
      absencesFilter.moduleInstance ||
      absencesFilter.studyClass
  );
}
