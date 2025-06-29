import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { DropDownItemWithActive } from "../../models/drop-down-item.model";

const MANY_ITEMS_COUNT = 3;

@Component({
  selector: "bkd-subscription-detail-listbox",
  imports: [FormsModule],
  template: `
    @if (asRadios()) {
      <div
        [id]="id()"
        class="radios d-flex"
        [class.horizontal]="layout() === 'horizontal'"
        [class.many]="hasManyItems()"
      >
        @for (item of items(); track item.Key) {
          @let itemId = id() + "-" + item.Key;
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              [attr.name]="id()"
              [name]="id()"
              [id]="itemId"
              [value]="normalizeItemKey(item.Key)"
              [disabled]="readonly()"
              [ngModel]="normalizedValue()"
              (ngModelChange)="onChange(item.Key)"
            />
            <label class="form-check-label" [attr.for]="itemId">
              {{ item.Value }}
            </label>
          </div>
        }
      </div>
    } @else {
      <select
        class="form-select"
        [id]="id()"
        [disabled]="readonly()"
        [ngModel]="normalizedValue()"
        (ngModelChange)="onChange($event)"
      >
        <option [value]="null"></option>
        @for (item of items(); track item.Key) {
          <option [value]="normalizeItemKey(item.Key)">
            {{ item.Value }}
          </option>
        }
        >
      </select>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .radios {
      flex-direction: column;
    }
    .radios.horizontal:not(.many) {
      flex-direction: row;
      gap: 1rem;
    }
    .radios.horizontal:not(.many) .form-check {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      margin-bottom: 0;
    }

    .form-select {
      width: 100%;
    }
    @media (min-width: 811px) {
      .form-select {
        width: auto;
        min-width: 15ch;
        max-width: 50ch;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailListboxComponent {
  detail = input.required<SubscriptionDetail>();
  id = input.required<string>();
  layout = input.required<"vertical" | "horizontal">();
  value = model<SubscriptionDetail["Value"]>();
  commit = output<SubscriptionDetail["Value"]>();

  readonly = computed(() => this.detail().VssInternet === "R");
  asRadios = computed(() => this.detail().ShowAsRadioButtons);
  items = computed(() =>
    this.detail().DropdownItems?.filter((item) => item.IsActive),
  );
  hasManyItems = computed(() => (this.items() ?? []).length > MANY_ITEMS_COUNT);
  normalizedValue = computed(() =>
    this.detail().Value ? String(this.detail().Value) : null,
  );

  onChange(rawValue: SubscriptionDetail["Value"]): void {
    const item = this.items()?.find((item) => item.Key == rawValue);
    const value = item?.Key ? this.normalizeItemKey(item?.Key) : null;

    this.value.set(value);
    this.commit.emit(value);
  }

  normalizeItemKey(key: DropDownItemWithActive["Key"]): string {
    return String(key);
  }
}
