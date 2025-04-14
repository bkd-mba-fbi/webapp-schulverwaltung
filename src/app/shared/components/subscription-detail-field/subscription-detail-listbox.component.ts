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

@Component({
  selector: "bkd-subscription-detail-listbox",
  imports: [FormsModule],
  template: `
    @if (asRadios()) {
      <div
        [id]="id()"
        class="radios d-flex"
        [class.flex-row]="layout() === 'horizontal'"
        [class.flex-column]="layout() === 'vertical'"
      >
        @for (item of items(); track item.Key) {
          @let itemId = id() + "-" + item.Key;
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              [name]="id()"
              [id]="itemId"
              [value]="item.Key"
              [disabled]="readonly()"
              [ngModel]="value()"
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
        [ngModel]="value()"
        (ngModelChange)="onChange($event)"
      >
        @for (item of items(); track item.Key) {
          <option [value]="item.Key">
            {{ item.Value }}
          </option>
        }
        >
      </select>
    }
  `,
  styles: `
    .radios.flex-row {
      gap: 1rem;
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

  onChange(rawValue: SubscriptionDetail["Value"]): void {
    const item = this.items()?.find((item) => item.Key == rawValue);
    const value = item?.Key ?? null;

    this.value.set(value);
    this.commit.emit(value);
  }
}
