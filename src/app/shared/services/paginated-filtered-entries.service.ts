import { OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subject,
  merge,
  combineLatest
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
  take
} from 'rxjs/operators';

import { LoadingService } from './loading-service';
import { Settings } from 'src/app/settings';
import { Paginated } from '../utils/pagination';
import { spreadTuple } from '../utils/function';

interface ResetEntriesAction {
  action: 'reset';
}

interface AppendEntriesAction<T> {
  action: 'append';
  entries: ReadonlyArray<T>;
}

type EntriesAction<T> = ResetEntriesAction | AppendEntriesAction<T>;

export const PAGE_LOADING_CONTEXT = 'page';

export abstract class PaginatedFilteredEntriesService<T, F>
  implements OnDestroy {
  loading$ = this.loadingService.loading$;
  loadingPage$ = this.loadingService.loading(PAGE_LOADING_CONTEXT);

  private filter$ = new BehaviorSubject<F>(this.getInitialFilter());
  isFilterValid$ = this.filter$.pipe(map(this.isValidFilter.bind(this)));
  validFilter$ = this.filter$.pipe(filter(this.isValidFilter.bind(this)));

  private nextPage$ = new Subject();
  private page$ = merge(
    this.nextPage$.pipe(mapTo('next')),
    this.validFilter$.pipe(mapTo('reset'))
  ).pipe(scan((page, action) => (action === 'next' ? page + 1 : 0), 0));
  private offset$ = this.page$.pipe(
    map(page => page * this.settings.paginationLimit)
  );
  private pageResult$ = combineLatest([this.validFilter$, this.offset$]).pipe(
    debounceTime(10),
    concatMap(spreadTuple(this.loadEntries.bind(this))),
    shareReplay(1)
  );

  entries$ = merge(
    // Restart with empty list if filter changes
    this.validFilter$.pipe(mapTo({ action: 'reset' } as ResetEntriesAction)),

    // Accumulate entries of loaded pages
    this.pageResult$.pipe(
      map(
        result =>
          ({ action: 'append', entries: result.entries } as AppendEntriesAction<
            T
          >)
      )
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
      .subscribe(params =>
        this.location.replaceState(pageUrl, params.toString())
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  setFilter(filterValue: F): void {
    this.filter$.next(filterValue);
  }

  nextPage(): void {
    this.hasMore$.pipe(take(1)).subscribe(hasMore => {
      if (hasMore) {
        this.nextPage$.next();
      }
    });
  }

  protected abstract getInitialFilter(): F;

  protected abstract isValidFilter(filterValue: F): boolean;

  protected abstract loadEntries(
    filterValue: F,
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
        return [];
      default:
        return entries;
    }
  }
}
