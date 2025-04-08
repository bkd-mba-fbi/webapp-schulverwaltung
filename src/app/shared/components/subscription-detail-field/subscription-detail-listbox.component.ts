import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from "@angular/core";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { SubscriptionDetailLabelComponent } from "./subscription-detail-label.component";

@Component({
  selector: "bkd-subscription-detail-listbox",
  imports: [SubscriptionDetailLabelComponent],
  template: `
    @let value = valueSignal();

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
        @for (item of detail().DropdownItems; track item.Key) {
          <div class="form-check">
            @let itemId = id() + "-" + item.Key;
            <input
              class="form-check-input"
              type="radio"
              [name]="id()"
              [id]="itemId"
              [value]="item.Key"
              [checked]="value() === item.Key"
              [disabled]="!item.IsActive || readonly()"
              (change)="value.set(item.Key)"
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
        [value]="value()"
        [disabled]="readonly()"
        (change)="onSelectChange($event)"
      >
        @for (item of detail().DropdownItems; track item.Key) {
          <option [value]="item.Key" [disabled]="!item.IsActive">
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

  readonly = computed(() => this.detail().VssInternet === "R");
  required = computed(() => this.detail().VssInternet === "M");
  asRadios = computed(() => this.detail().ShowAsRadioButtons);
  valueSignal = computed(() => signal(this.detail().Value));

  onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = this.valueSignal();
    value.set(target.value);
  }
}
