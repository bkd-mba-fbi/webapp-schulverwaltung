import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  input,
  model,
  output,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbTypeahead, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import {
  OperatorFunction,
  Subject,
  distinctUntilChanged,
  map,
  merge,
  takeUntil,
} from "rxjs";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";

@Component({
  selector: "bkd-subscription-detail-combobox",
  imports: [FormsModule, NgbTypeaheadModule],
  template: `
    <input
      class="form-control"
      type="text"
      #typeahead
      [id]="id()"
      [disabled]="readonly()"
      [value]="value()"
      [ngbTypeahead]="search"
      (input)="onChange($event)"
      (focus)="onFocus($event)"
      (blur)="onBlur()"
    />
    @if (value()) {
      <button
        type="button"
        class="btn btn-outline-secondary clear"
        (click)="onClear()"
      >
        <i class="material-icons">close</i>
      </button>
    }
    <button
      type="button"
      class="btn btn-outline-secondary toggle"
      [attr.aria-expanded]="isPopupOpen()"
      (click)="onToggle()"
    >
      <i class="material-icons">{{
        isPopupOpen() ? "keyboard_arrow_up" : "keyboard_arrow_down"
      }}</i>
    </button>
  `,
  styleUrl: "./subscription-detail-combobox.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailComboboxComponent
  implements AfterViewInit, OnDestroy
{
  readonly detail = input.required<SubscriptionDetail>();
  readonly id = input.required<string>();
  readonly value = model<SubscriptionDetail["Value"]>();
  readonly commit = output<SubscriptionDetail["Value"]>();

  protected readonly readonly = computed(
    () => this.detail().VssInternet === "R",
  );
  private readonly items = computed(() =>
    this.detail().DropdownItems?.filter((item) => item.IsActive),
  );

  private readonly typeahead = viewChild.required(NgbTypeahead);
  private readonly typeaheadInput =
    viewChild.required<ElementRef<HTMLInputElement>>("typeahead");
  private readonly focus$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    this.typeahead()
      .selectItem.pipe(takeUntil(this.destroy$))
      .subscribe(({ item }) => this.onSelect(item));

    this.typeaheadInput().nativeElement.addEventListener(
      "keydown",
      this.onKeyDown,
      true,
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.typeaheadInput().nativeElement.removeEventListener(
      "keydown",
      this.onKeyDown,
      true,
    );
  }

  protected search: OperatorFunction<string, readonly string[]> = (term$) =>
    merge(term$, this.focus$).pipe(
      distinctUntilChanged(),
      map(this.findSuggestions.bind(this)),
    );

  protected onChange(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value || null);
  }

  protected onFocus(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    this.focus$.next(value);
  }

  protected onBlur(): void {
    this.commit.emit(this.value() ?? null);
  }

  private onSelect(value: string): void {
    this.value.set(value);
    this.commit.emit(value ?? null);
  }

  private readonly onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      event.stopImmediatePropagation();
      if (this.typeahead().isPopupOpen()) {
        this.typeahead().dismissPopup();
      }
    }
  };

  protected onClear(): void {
    this.value.set(null);
    this.commit.emit(null);

    setTimeout(() => this.typeaheadInput().nativeElement.focus());
  }

  protected onToggle() {
    if (this.isPopupOpen()) {
      this.typeahead().dismissPopup();
    } else {
      this.focus$.next("");
    }
  }

  protected isPopupOpen(): boolean {
    return this.typeahead().isPopupOpen();
  }

  private findSuggestions(value: string): string[] {
    const items = (this.items() ?? []).map((item) => item.Value);
    if (value.length === 0) {
      return items;
    }

    const term = value.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(term));
  }
}
