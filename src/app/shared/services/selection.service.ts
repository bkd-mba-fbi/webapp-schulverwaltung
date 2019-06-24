import { Subject, Observable } from 'rxjs';
import {
  scan,
  map,
  startWith,
  shareReplay,
  distinctUntilChanged
} from 'rxjs/operators';

enum SelectionActionTypes {
  ToggleSelection = 'TOGGLE',
  ClearSelection = 'CLEAR'
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

export abstract class SelectionService<T> {
  private action$ = new Subject<SelectionAction<T>>();
  selection$ = this.action$.pipe(
    scan(this.reduceSelection.bind(this), [] as ReadonlyArray<T>),
    startWith([] as ReadonlyArray<T>),
    shareReplay(1)
  );

  constructor() {}

  toggle(entry: T): void {
    this.action$.next({
      type: SelectionActionTypes.ToggleSelection,
      payload: entry
    });
  }

  clear(entries: Option<ReadonlyArray<T>> = null): void {
    this.action$.next({
      type: SelectionActionTypes.ClearSelection,
      payload: entries
    });
  }

  isSelected$(entry: T): Observable<boolean> {
    return this.selection$.pipe(
      map(selection => selection.indexOf(entry) !== -1),
      distinctUntilChanged()
    );
  }

  private reduceSelection(
    selection: ReadonlyArray<T>,
    action: SelectionAction<T>
  ): ReadonlyArray<T> {
    switch (action.type) {
      case SelectionActionTypes.ToggleSelection:
        if (selection.indexOf(action.payload) === -1) {
          return [...selection, action.payload];
        }
        return selection.filter(e => e !== action.payload);
      case SelectionActionTypes.ClearSelection:
        return action.payload || [];
      default:
        return selection;
    }
  }
}
