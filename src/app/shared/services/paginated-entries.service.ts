import { OnDestroy, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Params } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subject,
  merge,
  combineLatest,
} from 'rxjs';
import {
  map,
  filter,
  concatMap,
  shareReplay,
  takeUntil,
  mapTo,
  scan,
  debounceTime,
  pluck,
  take,
  distinctUntilChanged,
} from 'rxjs/operators';
import { isEqual, cloneDeep } from 'lodash-es';

import { LoadingService } from './loading-service';
import { Settings } from 'src/app/settings';
import { Paginated } from '../utils/pagination';
import { spread } from '../utils/function';
import { serializeParams } from '../utils/url';
import { Sorting, SortService } from './sort.service';

interface ResetEntriesAction<T> {
  action: 'reset';
  entries?: ReadonlyArray<T>;
}

interface AppendEntriesAction<T> {
  action: 'append';
  entries: ReadonlyArray<T>;
}

type EntriesAction<T> = ResetEntriesAction<T> | AppendEntriesAction<T>;

export const PAGE_LOADING_CONTEXT = 'page';

@Injectable()
export abstract class PaginatedEntriesService<T, F> implements OnDestroy {
  loading$ = this.loadingService.loading$;
  loadingPage$ = this.loadingService.loading(PAGE_LOADING_CONTEXT);
  sorting$ = this.sortService.sorting$;

  private filter$ = new BehaviorSubject<F>(this.getInitialFilter());
  isFilterValid$ = this.filter$.pipe(map(this.isValidFilter.bind(this)));
  validFilter$ = this.filter$.pipe(
    filter(this.isValidFilter.bind(this)),
    distinctUntilChanged(isEqual), // Only cause a reload if the filter changes
    shareReplay(1)
  );

  private resetEntries$ = new Subject<void>();
  private nextPage$ = new Subject<void>();
  private page$ = merge(
    this.nextPage$.pipe(mapTo('next')),
    merge(this.resetEntries$, this.validFilter$, this.sorting$).pipe(
      mapTo('reset')
    )
  ).pipe(scan((page, action) => (action === 'next' ? page + 1 : 0), 0));
  private offset$ = this.page$.pipe(
    map((page) => page * this.settings.paginationLimit)
  );
  private pageResult$ = combineLatest([
    this.validFilter$,
    this.sorting$,
    this.offset$,
  ]).pipe(
    debounceTime(10),
    concatMap(spread(this.loadEntries.bind(this))),
    shareReplay(1)
  );

  entries$ = merge(
    // Restart with empty list on reset or if filter/sorting changes
    merge(this.resetEntries$, this.validFilter$, this.sorting$).pipe(
      mapTo({ action: 'reset' } as ResetEntriesAction<T>)
    ),

    // Accumulate entries of loaded pages
    this.pageResult$.pipe(
      map((result) => {
        if (result.offset === 0) {
          return {
            action: 'reset',
            entries: result.entries,
          } as ResetEntriesAction<T>;
        }
        return {
          action: 'append',
          entries: result.entries,
        } as AppendEntriesAction<T>;
      })
    )
  ).pipe(
    scan(this.entriesActionReducer.bind(this), [] as ReadonlyArray<T>),
    shareReplay(1)
  );

  total$ = this.pageResult$.pipe(pluck('total'));
  hasMore$ = this.pageResult$.pipe(
    map(({ offset, total }) => offset < total - this.settings.paginationLimit)
  );

  queryParams$ = this.filter$.pipe(map(this.buildParamsFromFilter.bind(this)));
  queryParamsString$ = this.queryParams$.pipe(map(serializeParams));

  protected destroy$ = new Subject<void>();

  constructor(
    protected location: Location,
    protected loadingService: LoadingService,
    protected sortService: SortService<T>,
    protected settings: Settings,
    pageUrl: string
  ) {
    this.queryParamsString$
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => this.location.replaceState(pageUrl, params));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  setFilter(filterValue: F): void {
    // Make a copy of the filter object to be sure the distinct check
    // in the `validFilter$` observable works, even if the filter
    // object gets modified in place (non-immutable) in the component.
    this.filter$.next(cloneDeep(filterValue));
  }

  nextPage(): void {
    this.hasMore$.pipe(take(1)).subscribe((hasMore) => {
      if (hasMore) {
        this.nextPage$.next();
      }
    });
  }

  resetEntries(): void {
    this.resetEntries$.next();
  }

  protected abstract getInitialFilter(): F;

  protected abstract isValidFilter(filterValue: F): boolean;

  protected abstract loadEntries(
    filterValue: F,
    sorting: Option<Sorting<keyof T>>,
    offset: number
  ): Observable<Paginated<ReadonlyArray<T>>>;

  protected abstract buildParamsFromFilter(filterValue: F): Params;

  private entriesActionReducer(
    entries: ReadonlyArray<T>,
    event: EntriesAction<T>
  ): ReadonlyArray<T> {
    switch (event.action) {
      case 'append':
        return [...entries, ...event.entries];
      case 'reset':
        return event.entries ? event.entries : [];
      default:
        return entries;
    }
  }
}
