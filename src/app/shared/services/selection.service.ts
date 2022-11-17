import {
  Subject,
  Observable,
  ReplaySubject,
  Subscription,
  connectable,
} from 'rxjs';
import { scan, map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';

enum SelectionActionTypes {
  ToggleSelection = 'TOGGLE',
  ClearSelection = 'CLEAR',
}

interface ToggleSelectionAction<T> {
  type: SelectionActionTypes.ToggleSelection;
  payload: T;
}

interface ClearSelectionAction<T> {
  type: SelectionActionTypes.ClearSelection;
  payload: Option<ReadonlyArray<T>>;
}

type SelectionAction<T> = ToggleSelectionAction<T> | ClearSelectionAction<T>;

@Injectable()
export abstract class SelectionService<T> implements OnDestroy {
  protected action$ = new Subject<SelectionAction<T>>();
  selection$ = connectable(
    this.action$.pipe(
      scan(this.reduceSelection.bind(this), [] as ReadonlyArray<T>),
      startWith([] as ReadonlyArray<T>)
    ),
    { connector: () => new ReplaySubject<ReadonlyArray<T>>(1) } // Make it hot
  );

  private selectionSub: Subscription;

  constructor() {
    this.selectionSub = this.selection$.connect();
  }

  ngOnDestroy(): void {
    this.selectionSub.unsubscribe();
  }

  toggle(entry: T): void {
    this.action$.next({
      type: SelectionActionTypes.ToggleSelection,
      payload: entry,
    });
  }

  clear(entries: Option<ReadonlyArray<T>> = null): void {
    this.action$.next({
      type: SelectionActionTypes.ClearSelection,
      payload: entries,
    });
  }

  isSelected$(entry: T): Observable<boolean> {
    return this.selection$.pipe(
      map((selection) => selection.includes(entry)),
      distinctUntilChanged()
    );
  }

  private reduceSelection(
    selection: ReadonlyArray<T>,
    action: SelectionAction<T>
  ): ReadonlyArray<T> {
    switch (action.type) {
      case SelectionActionTypes.ToggleSelection:
        if (!selection.includes(action.payload)) {
          return [...selection, action.payload];
        }
        return selection.filter((e) => e !== action.payload);
      case SelectionActionTypes.ClearSelection:
        return action.payload || [];
      default:
        return selection;
    }
  }
}
