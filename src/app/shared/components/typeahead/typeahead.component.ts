import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  input,
  model,
  signal,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { Observable, Subject, of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  switchMap,
  takeUntil,
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
  imports: [NgbTypeahead, FormsModule, TranslatePipe],
})
export class TypeaheadComponent implements OnDestroy {
  readonly id = input<Option<string>>(null);
  readonly typeaheadService = input.required<TypeaheadService>();
  readonly placeholder = input("shared.typeahead.default-placeholder");
  readonly value = model<Option<DropDownItem["Key"]>>(null);
  readonly additionalHttpParams = input<HttpParams>();

  readonly loading = signal(false);
  readonly selectedItem = signal<Option<DropDownItem>>(null);

  private destroy$ = new Subject<void>();

  constructor() {
    toObservable(this.value)
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value) return of(null);

          const selected = this.selectedItem();
          if (selected && value === selected.Key) {
            return of(selected);
          }
          return this.fetchItem(value);
        }),
      )
      .subscribe((item) => {
        this.selectedItem.set(item);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  onChange(value: unknown): void {
    const item = value instanceof Object ? (value as DropDownItem) : null;
    this.selectedItem.set(item);
    this.value.set(item?.Key ?? null);
  }

  private fetchItems(term: string): Observable<ReadonlyArray<DropDownItem>> {
    this.loading.set(true);
    return this.typeaheadService()
      .getTypeaheadItems(term, this.additionalHttpParams())
      .pipe(finalize(() => this.loading.set(false)));
  }

  private fetchItem(key: DropDownItem["Key"]): Observable<DropDownItem> {
    this.loading.set(true);
    return this.typeaheadService()
      .getTypeaheadItemByKey(key)
      .pipe(finalize(() => this.loading.set(false)));
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
