import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  merge,
} from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { spreadTuple } from 'src/app/shared/utils/function';
import { searchEntries } from 'src/app/shared/utils/search';
import {
  buildOpenAbsencesEntries,
  sortOpenAbsencesEntries,
  removeOpenAbsences,
} from '../utils/open-absences-entries';
import { IConfirmAbsencesService } from 'src/app/shared/tokens/confirm-absences-service';
import { ConfirmAbsencesSelectionService } from 'src/app/shared/services/confirm-absences-selection.service';

export type PrimarySortKey = 'date' | 'name';

export interface SortCriteria {
  primarySortKey: PrimarySortKey;
  ascending: boolean;
}

@Injectable()
export class OpenAbsencesService implements IConfirmAbsencesService {
  loading$ = this.loadingService.loading$;
  search$ = new BehaviorSubject<string>('');

  private updateUnconfirmedAbsences$ = new Subject<
    ReadonlyArray<LessonPresence>
  >();
  private unconfirmedAbsences$ = merge(
    this.loadUnconfirmedAbsences(),
    this.updateUnconfirmedAbsences$
  ).pipe(shareReplay(1));
  private entries$ = this.unconfirmedAbsences$.pipe(
    map(buildOpenAbsencesEntries),
    shareReplay(1)
  );

  private sortCriteriaSubject$ = new BehaviorSubject<SortCriteria>({
    primarySortKey: 'date',
    ascending: false,
  });

  sortCriteria$ = this.sortCriteriaSubject$.asObservable();
  sortedEntries$ = combineLatest([this.entries$, this.sortCriteria$]).pipe(
    map(spreadTuple(sortOpenAbsencesEntries))
  );

  filteredEntries$ = combineLatest([this.sortedEntries$, this.search$]).pipe(
    map(spreadTuple(searchEntries)),
    shareReplay(1)
  );

  currentDetail: Option<{ date: string; personId: number }> = null;

  constructor(
    private lessonPresencesService: LessonPresencesRestService,
    private selectionService: ConfirmAbsencesSelectionService,
    private loadingService: LoadingService
  ) {}

  getUnconfirmedAbsences(
    dateString: string,
    studentId: number
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.entries$.pipe(
      map((entries) => {
        const entry = entries.find(
          (e) => e.dateString === dateString && e.studentId === studentId
        );
        return entry ? entry.absences : [];
      })
    );
  }

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

  get confirmBackLink(): any[] {
    if (this.currentDetail) {
      return [
        '/open-absences/detail',
        this.currentDetail.personId,
        this.currentDetail.date,
      ];
    }
    return ['/open-absences'];
  }

  /**
   * Removes selected entries from unconfirmed absences and cleans
   * selection.
   */
  updateAfterConfirm(): void {
    combineLatest([
      this.unconfirmedAbsences$.pipe(take(1)),
      this.selectionService.selectedIds$.pipe(take(1)),
    ])
      .pipe(map(spreadTuple(removeOpenAbsences)))
      .subscribe((unconfirmedAbsences) => {
        this.selectionService.clear();
        this.updateUnconfirmedAbsences$.next(unconfirmedAbsences);
      });
  }

  private loadUnconfirmedAbsences(): Observable<ReadonlyArray<LessonPresence>> {
    return this.loadingService.load(
      this.lessonPresencesService.getListOfUnconfirmed()
    );
  }
}
