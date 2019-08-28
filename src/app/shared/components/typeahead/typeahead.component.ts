import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  filter,
  finalize
} from 'rxjs/operators';
import { uniqueId } from 'lodash-es';

import { longerOrEqual } from '../../utils/filter';
import { TypeaheadService } from '../../services/typeahead-rest.service';
import { DropDownItem } from '../../models/drop-down-item.model';

const FETCH_DEBOUNCE_TIME = 300;
const MINIMAL_TERM_LENGTH = 3;

@Component({
  selector: 'erz-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeaheadComponent implements OnInit, OnChanges {
  private selectIdSource$ = new BehaviorSubject<Option<number>>(null);

  @Input() typeaheadService: TypeaheadService;
  @Input() placeholder = 'shared.typeahead.default-placeholder';
  @Input() selectedId: number;

  @Output()
  selectId = this.selectIdSource$.pipe(distinctUntilChanged());

  selectedItem$ = new Subject<DropDownItem>();

  componentId = uniqueId('erz-typeahead-');
  loading$ = new BehaviorSubject(false);

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedId && changes.selectedId.currentValue) {
      this.fetchItem(changes.selectedId.currentValue).subscribe(item => {
        this.selectedItem$.next(item);
        this.modelChange(item);
      });
    }
  }

  search = (term$: Observable<string>) => {
    return term$.pipe(
      processTerm(MINIMAL_TERM_LENGTH, FETCH_DEBOUNCE_TIME),
      switchMap(this.fetchItems.bind(this))
    );
  };

  format(item: DropDownItem): string {
    return item.Value;
  }

  modelChange(value: unknown): void {
    this.selectIdSource$.next(
      value instanceof Object ? (value as DropDownItem).Key : null
    );
  }

  private fetchItems(term: string): Observable<ReadonlyArray<DropDownItem>> {
    this.loading$.next(true);
    return this.typeaheadService
      .getTypeaheadItems(term)
      .pipe(finalize(() => this.loading$.next(false)));
  }

  private fetchItem(id: number): Observable<DropDownItem> {
    this.loading$.next(true);
    return this.typeaheadService
      .getTypeaheadItemById(id)
      .pipe(finalize(() => this.loading$.next(false)));
  }
}

function processTerm(
  minimalTermLength: number,
  fetchDebounceTime: number
): (source$: Observable<string>) => Observable<string> {
  return source$ =>
    source$.pipe(
      debounceTime(fetchDebounceTime),
      map(normalizeTerm),
      distinctUntilChanged(),
      filter(longerOrEqual(minimalTermLength))
    );
}

function normalizeTerm(term: string): string {
  return term.trim().toLowerCase();
}
