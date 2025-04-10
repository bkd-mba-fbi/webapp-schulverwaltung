import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { SubscriptionDetailLabelComponent } from "./subscription-detail-label.component";

@Component({
  selector: "bkd-subscription-detail-listbox",
  imports: [FormsModule, SubscriptionDetailLabelComponent],
  template: `
    <bkd-subscription-detail-label
      [detail]="detail()"
      [id]="id()"
      [hideLabel]="hideLabel()"
    ></bkd-subscription-detail-label>

    @if (asRadios()) {
      <div
        [id]="id()"
        class="radios d-flex"
        [class.flex-row]="layout() === 'horizontal'"
        [class.flex-column]="layout() === 'vertical'"
      >
        @for (item of items(); track item.Key) {
          <div class="form-check">
            @let itemId = id() + "-" + item.Key;
            <input
              class="form-check-input"
              type="radio"
              [name]="id()"
              [id]="itemId"
              [value]="item.Key"
              [disabled]="readonly()"
              [ngModel]="detail().Value"
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
        [ngModel]="detail().Value"
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
  detail = model.required<SubscriptionDetail>();
  id = input.required<string>();
  hideLabel = input.required<boolean>();
  layout = input.required<"vertical" | "horizontal">();
  commit = output<SubscriptionDetail>();

  readonly = computed(() => this.detail().VssInternet === "R");
  required = computed(() => this.detail().VssInternet === "M");
  asRadios = computed(() => this.detail().ShowAsRadioButtons);
  valueSignal = computed(() => signal(this.detail().Value));
  items = computed(() =>
    this.detail().DropdownItems?.filter((item) => item.IsActive),
  );

  onChange(value: SubscriptionDetail["Value"]): void {
    const item = this.items()?.find((item) => item.Key == value);
    const detail: SubscriptionDetail = {
      ...this.detail(),
      Value: item?.Key ?? null,
    };
    this.detail.set(detail);
    this.commit.emit(detail);
  }
}
