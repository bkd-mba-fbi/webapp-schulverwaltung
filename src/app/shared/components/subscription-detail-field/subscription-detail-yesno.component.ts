import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import {
  SubscriptionDetail,
  SubscriptionDetailType,
} from "src/app/shared/models/subscription.model";

@Component({
  selector: "bkd-subscription-detail-yesno",
  imports: [FormsModule, TranslatePipe],
  template: `
    @if (yesAndNo() && asRadios()) {
      <div
        [id]="id()"
        class="radios d-flex"
        [class.flex-row]="layout() === 'horizontal'"
        [class.flex-column]="layout() === 'vertical'"
      >
        @for (option of ["Ja", "Nein"]; track option) {
          @let itemId = id() + "-" + option;
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              [name]="id()"
              [id]="itemId"
              [value]="option"
              [disabled]="readonly()"
              [ngModel]="detail().Value"
              (ngModelChange)="onRadioChange(option)"
            />
            <label class="form-check-label" [attr.for]="itemId">
              @let labelKey =
                option === "Ja"
                  ? "evaluation.values.yes"
                  : "evaluation.values.no";
              {{ labelKey | translate }}
            </label>
          </div>
        }
      </div>
    } @else {
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          [name]="id()"
          [id]="id()"
          [disabled]="readonly()"
          [ngModel]="detail().Value === 'Ja'"
          (ngModelChange)="onCheckboxToggle($event)"
        />
      </div>
    }
  `,
  styles: `
    .radios.flex-row {
      gap: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailYesNoComponent {
  detail = model.required<SubscriptionDetail>();
  id = input.required<string>();
  layout = input.required<"vertical" | "horizontal">();
  commit = output<SubscriptionDetail>();

  readonly = computed(() => this.detail().VssInternet === "R");
  required = computed(() => this.detail().VssInternet === "M");
  yesAndNo = computed(
    () => this.detail().VssTypeId === SubscriptionDetailType.YesNo,
  );
  asRadios = computed(() => this.detail().ShowAsRadioButtons);

  onRadioChange(value: SubscriptionDetail["Value"]): void {
    const detail: SubscriptionDetail = {
      ...this.detail(),
      Value: value ?? null,
    };
    this.detail.set(detail);
    this.commit.emit(detail);
  }

  onCheckboxToggle(checked: boolean): void {
    const value = checked ? "Ja" : this.yesAndNo() ? "Nein" : null;
    const detail: SubscriptionDetail = {
      ...this.detail(),
      Value: value,
    };
    this.detail.set(detail);
    this.commit.emit(detail);
  }
}
