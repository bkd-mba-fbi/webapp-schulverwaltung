import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  Subject,
} from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { ConfirmAbsencesSelectionService } from 'src/app/shared/services/confirm-absences-selection.service';
import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { IConfirmAbsencesService } from 'src/app/shared/tokens/confirm-absences-service';
import { spread } from 'src/app/shared/utils/function';
import { searchEntries } from 'src/app/shared/utils/search';
import { SortCriteria } from 'src/app/shared/utils/sort';
import { Person } from '../../shared/models/person.model';
import { toDesignationDateTimeTypeString } from '../../shared/utils/lesson-presences';
import {
  buildOpenAbsencesEntries,
  removeOpenAbsences,
  sortOpenAbsencesEntries,
} from '../utils/open-absences-entries';

export type PrimarySortKey = 'date' | 'name';

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

  private sortCriteriaSubject$ = new BehaviorSubject<
    SortCriteria<PrimarySortKey>
  >({
    primarySortKey: 'date',
    ascending: false,
  });

  sortCriteria$ = this.sortCriteriaSubject$.asObservable();
  sortedEntries$ = combineLatest([this.entries$, this.sortCriteria$]).pipe(
    map(spread(sortOpenAbsencesEntries))
  );

  filteredEntries$ = combineLatest([this.sortedEntries$, this.search$]).pipe(
    map(spread(searchEntries)),
    shareReplay(1)
  );

  currentDetail: Option<{ date: string; personId: number }> = null;

  constructor(
    private lessonPresencesService: LessonPresencesRestService,
    private selectionService: ConfirmAbsencesSelectionService,
    private loadingService: LoadingService,
    private translate: TranslateService
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

  getAllUnconfirmedAbsencesForStudent(
    studentId: number
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.entries$.pipe(
      map((entries) => {
        return entries
          .filter((e) => e.studentId === studentId)
          .reduce((a: LessonPresence[], e) => a.concat(e.absences), []);
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
      .pipe(map(spread(removeOpenAbsences)))
      .subscribe((unconfirmedAbsences) => {
        this.selectionService.clear();
        this.updateUnconfirmedAbsences$.next(unconfirmedAbsences);
      });
  }

  /**
   * Returns a mailto string in the following format: <email>?subject=<subject>&body=<body>
   *
   * The email is addressed to the given person and contains a list of their open absences
   * in the body content. The senders's default language is used to translate the content.
   */
  buildMailToString(
    person: Person,
    absences: ReadonlyArray<LessonPresence>
  ): string {
    const address = person.Email;
    const subject = this.translate.instant('open-absences.detail.mail.subject');
    const formattedAbsences = absences
      .map((absence) => toDesignationDateTimeTypeString(absence))
      .join('%0D%0A');

    let body = `${this.translate.instant(
      'open-absences.detail.mail.body'
    )}%0D%0A${formattedAbsences}`;

    
    if (body.length >= 1800) {
      body = `${body.substring(0,1650)}%0D%0A${this.translate.instant('open-absences.detail.mail.bodyToLargeForEmailTo')}` ;
    } 
    
    return `${address}?subject=${subject}&body=${body}`;
  }

  private loadUnconfirmedAbsences(): Observable<ReadonlyArray<LessonPresence>> {
    return this.loadingService.load(
      this.lessonPresencesService.getListOfUnconfirmed()
    );
  }
}
