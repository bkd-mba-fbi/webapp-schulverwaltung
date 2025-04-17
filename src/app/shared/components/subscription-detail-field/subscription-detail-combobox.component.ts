import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
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
  takeUntil,
} from "rxjs";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";

@Component({
  selector: "bkd-subscription-detail-combobox",
  imports: [FormsModule, NgbTypeaheadModule],
  template: `
    <input
      #input
      class="form-control"
      type="text"
      [id]="id()"
      [disabled]="readonly()"
      [value]="value()"
      [ngbTypeahead]="search"
      (input)="onChange($event)"
      (blur)="onBlur()"
    />
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailComboboxComponent
  implements AfterViewInit, OnDestroy
{
  detail = input.required<SubscriptionDetail>();
  id = input.required<string>();
  value = model<SubscriptionDetail["Value"]>();
  commit = output<SubscriptionDetail["Value"]>();

  readonly = computed(() => this.detail().VssInternet === "R");
  items = computed(() =>
    this.detail().DropdownItems?.filter((item) => item.IsActive),
  );

  private typeahead = viewChild.required(NgbTypeahead);
  private destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    this.typeahead()
      .selectItem.pipe(takeUntil(this.destroy$))
      .subscribe(({ item }) => this.onSelect(item));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  search: OperatorFunction<string, readonly string[]> = (term$) =>
    term$.pipe(distinctUntilChanged(), map(this.findSuggestions.bind(this)));

  onChange(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value || null);
  }

  onBlur(): void {
    this.commit.emit(this.value() ?? null);
  }

  onSelect(value: string): void {
    this.value.set(value);
    this.commit.emit(value ?? null);
  }

  private findSuggestions(value: string): string[] {
    if (value.length < 2) return [];

    const term = value.toLowerCase();

    return (this.items() ?? [])
      .filter((item) => item.Value.toLowerCase().includes(term))
      .slice(0, 10)
      .map((item) => item.Value);
  }
}
