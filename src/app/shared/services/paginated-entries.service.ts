import { OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
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
} from 'rxjs/operators';

import { LoadingService } from './loading-service';
import { Settings } from 'src/app/settings';
import { Paginated } from '../utils/pagination';
import { spreadTriplet } from '../utils/function';

interface ResetEntriesAction<T> {
  action: 'reset';
  entries?: ReadonlyArray<T>;
}

interface AppendEntriesAction<T> {
  action: 'append';
  entries: ReadonlyArray<T>;
}

export interface Sorting<T> {
  key: keyof T;
  ascending: boolean;
}

type EntriesAction<T> = ResetEntriesAction<T> | AppendEntriesAction<T>;

export const PAGE_LOADING_CONTEXT = 'page';

export abstract class PaginatedEntriesService<T, F> implements OnDestroy {
  loading$ = this.loadingService.loading$;
  loadingPage$ = this.loadingService.loading(PAGE_LOADING_CONTEXT);

  private filter$ = new BehaviorSubject<F>(this.getInitialFilter());
  isFilterValid$ = this.filter$.pipe(map(this.isValidFilter.bind(this)));
  validFilter$ = this.filter$.pipe(filter(this.isValidFilter.bind(this)));

  private sortingSubject$ = new BehaviorSubject<Option<Sorting<T>>>(
    this.getInitialSorting()
  );
  sorting$ = this.sortingSubject$.asObservable();

  private nextPage$ = new Subject();
  private page$ = merge(
    this.nextPage$.pipe(mapTo('next')),
    this.validFilter$.pipe(mapTo('reset')),
    this.sorting$.pipe(mapTo('reset'))
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
    concatMap(spreadTriplet(this.loadEntries.bind(this))),
    shareReplay(1)
  );

  entries$ = merge(
    // Reset list if filter or sorting changes
    merge(this.validFilter$, this.sorting$).pipe(
      debounceTime(15), // Avoid flickering of table header on sorting change
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

  queryParams$ = this.filter$.pipe(
    map(this.buildHttpParamsFromFilter.bind(this))
  );

  private destroy$ = new Subject<void>();

  constructor(
    protected location: Location,
    protected loadingService: LoadingService,
    protected settings: Settings,
    pageUrl: string
  ) {
    this.queryParams$
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) =>
        this.location.replaceState(pageUrl, params.toString())
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  setFilter(filterValue: F): void {
    this.filter$.next(filterValue);
  }

  setSorting(sorting: Option<Sorting<T>>): void {
    this.sortingSubject$.next(sorting);
  }

  toggleSorting(key: keyof T): void {
    this.sorting$.pipe(take(1)).subscribe((sorting) => {
      if (sorting && sorting.key === key) {
        this.sortingSubject$.next({ key, ascending: !sorting.ascending });
      } else {
        this.sortingSubject$.next({ key, ascending: true });
      }
    });
  }

  nextPage(): void {
    this.hasMore$.pipe(take(1)).subscribe((hasMore) => {
      if (hasMore) {
        this.nextPage$.next();
      }
    });
  }

  protected abstract getInitialFilter(): F;

  protected abstract isValidFilter(filterValue: F): boolean;

  protected getInitialSorting(): Option<Sorting<T>> {
    return null;
  }

  protected abstract loadEntries(
    filterValue: F,
    sorting: Option<Sorting<T>>,
    offset: number
  ): Observable<Paginated<ReadonlyArray<T>>>;

  protected abstract buildHttpParamsFromFilter(filterValue: F): HttpParams;

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
