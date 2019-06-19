import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { shareReplay, map, take } from 'rxjs/operators';

import { spreadTuple } from 'src/app/shared/utils/function';
import { sortUnconfirmedAbsences } from '../utils/unconfirmed-absences';
import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import {
  buildOpenAbsencesEntries,
  sortOpenAbsencesEntries
} from '../utils/open-absences-entries';

export type PrimarySortKey = 'date' | 'name';

export interface SortCriteria {
  primarySortKey: PrimarySortKey;
  ascending: boolean;
}

@Injectable()
export class OpenAbsencesService {
  private unconfirmedAbsences$ = this.loadUnconfirmedAbsences().pipe(
    shareReplay(1)
  );
  private sortCriteriaSubject$ = new BehaviorSubject<SortCriteria>({
    primarySortKey: 'date',
    ascending: false
  });

  sortCriteria$ = this.sortCriteriaSubject$.asObservable();
  entries$ = combineLatest(
    this.unconfirmedAbsences$.pipe(map(buildOpenAbsencesEntries)),
    this.sortCriteria$
  ).pipe(map(spreadTuple(sortOpenAbsencesEntries)));

  constructor(private lessonPresencesService: LessonPresencesRestService) {}

  getUnconfirmedAbsences(
    dateString: string,
    studentId: number
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.entries$.pipe(
      map(entries => {
        const entry = entries.find(
          e => e.dateString === dateString && e.studentId === studentId
        );
        return entry ? entry.absences : [];
      })
    );
  }

  toggleSort(primarySortKey: PrimarySortKey): void {
    this.sortCriteriaSubject$.pipe(take(1)).subscribe(criteria => {
      if (criteria.primarySortKey === primarySortKey) {
        // Change sort direction
        this.sortCriteriaSubject$.next({
          primarySortKey,
          ascending: !criteria.ascending
        });
      } else {
        // Change sort key
        this.sortCriteriaSubject$.next({
          primarySortKey,
          ascending: primarySortKey === 'name'
        });
      }
    });
  }

  private loadUnconfirmedAbsences(): Observable<ReadonlyArray<LessonPresence>> {
    return this.lessonPresencesService
      .getListOfUnconfirmed()
      .pipe(map(sortUnconfirmedAbsences));
  }
}
