import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export type PrimarySortKey = 'name' | 'group';

export interface SortCriteria {
  primarySortKey: PrimarySortKey;
  ascending: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PresenceControlGroupService {
  private sortCriteriaSubject$ = new BehaviorSubject<SortCriteria>({
    primarySortKey: 'name',
    ascending: false,
  });

  sortCriteria$ = this.sortCriteriaSubject$.asObservable();

  constructor() {}

  /**
   * Switches primary sort key or toggles sort direction, if already
   * sorted by given key.
   */
  toggleSort(primarySortKey: PrimarySortKey): void {
    this.sortCriteriaSubject$.pipe(take(1)).subscribe((criteria) => {
      if (criteria.primarySortKey === primarySortKey) {
        // Change sort direction
        this.sortCriteriaSubject$.next({
          primarySortKey,
          ascending: !criteria.ascending,
        });
      } else {
        // Change sort key
        this.sortCriteriaSubject$.next({
          primarySortKey,
          ascending: primarySortKey === 'name',
        });
      }
    });
  }
}
