import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { uniqueId } from "lodash-es";
import { BehaviorSubject, Observable } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  switchMap,
} from "rxjs/operators";
import { DropDownItem } from "../../models/drop-down-item.model";
import {
  HttpParams,
  TypeaheadService,
} from "../../services/typeahead-rest.service";
import { longerOrEqual } from "../../utils/filter";

const FETCH_DEBOUNCE_TIME = 300;
const MINIMAL_TERM_LENGTH = 3;

@Component({
  selector: "bkd-typeahead",
  templateUrl: "./typeahead.component.html",
  styleUrls: ["./typeahead.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbTypeahead, FormsModule, AsyncPipe, TranslatePipe],
})
export class TypeaheadComponent implements OnChanges {
  selectedItem$ = new BehaviorSubject<Option<DropDownItem>>(null);

  @Input() typeaheadService: TypeaheadService;
  @Input() placeholder = "shared.typeahead.default-placeholder";
  @Input() value: Option<DropDownItem["Key"]>;
  @Input() additionalHttpParams: HttpParams;

  @Output()
  valueChange = this.selectedItem$.pipe(
    map((item) => (item ? item.Key : null)),
    distinctUntilChanged(),
  );

  componentId = uniqueId("bkd-typeahead-");
  loading$ = new BehaviorSubject(false);

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["value"] &&
      changes["value"].currentValue &&
      changes["value"].currentValue !== this.selectedItemKey
    ) {
      this.fetchItem(changes["value"].currentValue).subscribe((item) => {
        this.modelChange(item);
      });
    }
  }

  search = (term$: Observable<string>) => {
    return term$.pipe(
      processTerm(MINIMAL_TERM_LENGTH, FETCH_DEBOUNCE_TIME),
      switchMap(this.fetchItems.bind(this)),
    );
  };

  format(item: DropDownItem): string {
    return item.Value;
  }

  modelChange(value: unknown): void {
    this.selectedItem$.next(
      value instanceof Object ? (value as DropDownItem) : null,
    );
  }

  private get selectedItemKey(): Option<DropDownItem["Key"]> {
    return this.selectedItem$.value ? this.selectedItem$.value.Key : null;
  }

  private fetchItems(term: string): Observable<ReadonlyArray<DropDownItem>> {
    this.loading$.next(true);
    return this.typeaheadService
      .getTypeaheadItems(term, this.additionalHttpParams)
      .pipe(finalize(() => this.loading$.next(false)));
  }

  private fetchItem(key: DropDownItem["Key"]): Observable<DropDownItem> {
    this.loading$.next(true);
    return this.typeaheadService
      .getTypeaheadItemByKey(key)
      .pipe(finalize(() => this.loading$.next(false)));
  }
}

function processTerm(
  minimalTermLength: number,
  fetchDebounceTime: number,
): (source$: Observable<string>) => Observable<string> {
  return (source$) =>
    source$.pipe(
      debounceTime(fetchDebounceTime),
      map(normalizeTerm),
      distinctUntilChanged(),
      filter(longerOrEqual(minimalTermLength)),
    );
}

function normalizeTerm(term: string): string {
  return term.trim().toLowerCase();
}
