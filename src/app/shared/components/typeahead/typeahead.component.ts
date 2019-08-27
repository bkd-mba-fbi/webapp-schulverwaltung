import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  Input
} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
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
export class TypeaheadComponent implements OnInit {
  private selectItemSource$ = new BehaviorSubject<Option<DropDownItem>>(null);

  @Input() typeaheadService: TypeaheadService;
  @Input() placeholder = 'shared.typeahead.default-placeholder';

  @Output()
  selectItem = this.selectItemSource$.pipe(distinctUntilChanged());

  componentId = uniqueId('erz-typeahead-');
  loading$ = new BehaviorSubject(false);

  constructor() {}

  ngOnInit(): void {}

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
    this.selectItemSource$.next(
      value instanceof Object ? (value as DropDownItem) : null
    );
  }

  private fetchItems(term: string): Observable<ReadonlyArray<DropDownItem>> {
    this.loading$.next(true);
    return this.typeaheadService
      .getTypeaheadItems(term)
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
