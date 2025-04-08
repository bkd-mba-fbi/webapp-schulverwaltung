import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  input,
  model,
  output,
} from "@angular/core";
import {
  SubscriptionDetail,
  SubscriptionDetailType,
} from "src/app/shared/models/subscription.model";
import { SubscriptionDetailComboboxComponent } from "./subscription-detail-combobox.component";
import { SubscriptionDetailDatefieldComponent } from "./subscription-detail-datefield.component";
import { SubscriptionDetailDescriptionComponent } from "./subscription-detail-description.component";
import { SubscriptionDetailHeadingComponent } from "./subscription-detail-heading.component";
import { SubscriptionDetailLabelComponent } from "./subscription-detail-label.component";
import { SubscriptionDetailListboxComponent } from "./subscription-detail-listbox.component";
import { SubscriptionDetailTextareaComponent } from "./subscription-detail-textarea.component";
import { SubscriptionDetailTextfieldComponent } from "./subscription-detail-textfield.component";
import { SubscriptionDetailYesNoComponent } from "./subscription-detail-yesno.component";

@Component({
  selector: "bkd-subscription-detail-field",
  imports: [
    SubscriptionDetailHeadingComponent,
    SubscriptionDetailDescriptionComponent,
    SubscriptionDetailComboboxComponent,
    SubscriptionDetailListboxComponent,
    SubscriptionDetailTextfieldComponent,
    SubscriptionDetailTextareaComponent,
    SubscriptionDetailYesNoComponent,
    SubscriptionDetailDatefieldComponent,
    SubscriptionDetailLabelComponent,
  ],
  template: `
    @let id = detail().Id + "-" + detail().IdPerson;
    @if (detail().VssStyle !== "HE" && !hideLabel()) {
      <bkd-subscription-detail-label
        [detail]="detail()"
        [id]="id"
        [hideLabel]="hideLabel()"
        [style.min-width]="layout() === 'horizontal' ? labelWidth() : ''"
      ></bkd-subscription-detail-label>
    }

    @switch (detail().VssStyle) {
      @case ("HE") {
        <bkd-subscription-detail-heading
          [detail]="detail()"
        ></bkd-subscription-detail-heading>
      }
      @case ("BE") {
        <bkd-subscription-detail-description
          [detail]="detail()"
          [id]="id"
        ></bkd-subscription-detail-description>
      }
      @case ("CB") {
        <bkd-subscription-detail-combobox
          [(detail)]="detail"
          [id]="id"
          (commit)="commit.emit($event)"
        ></bkd-subscription-detail-combobox>
      }
      @case ("LB") {
        <bkd-subscription-detail-listbox
          [(detail)]="detail"
          [id]="id"
          [layout]="layout()"
          (commit)="commit.emit($event)"
        ></bkd-subscription-detail-listbox>
      }
      @case ("TX") {
        @if (isTextField()) {
          <bkd-subscription-detail-textfield
            [(detail)]="detail"
            [id]="id"
            (commit)="commit.emit($event)"
          ></bkd-subscription-detail-textfield>
        } @else if (isDate()) {
          <bkd-subscription-detail-datefield
            [(detail)]="detail"
            [id]="id"
            (commit)="commit.emit($event)"
          ></bkd-subscription-detail-datefield>
        } @else if (isTextarea()) {
          <bkd-subscription-detail-textarea
            [(detail)]="detail"
            [id]="id"
            (commit)="commit.emit($event)"
          ></bkd-subscription-detail-textarea>
        } @else if (isYesNo()) {
          <bkd-subscription-detail-yesno
            [(detail)]="detail"
            [id]="id"
            [layout]="layout()"
            (commit)="commit.emit($event)"
          ></bkd-subscription-detail-yesno>
        }
      }
    }
  `,
  styles: `
    :host {
      display: flex;
      column-gap: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailFieldComponent {
  detail = model.required<SubscriptionDetail>();
  hideLabel = input(false);
  layout = input<"vertical" | "horizontal">("vertical");
  labelWidth = input("33%");
  commit = output<SubscriptionDetail>();

  isTextField = computed(
    () =>
      this.detail()?.VssTypeId === SubscriptionDetailType.ShortText ||
      this.detail()?.VssTypeId === SubscriptionDetailType.Int ||
      this.detail()?.VssTypeId === SubscriptionDetailType.Currency,
  );
  isTextarea = computed(
    () => this.detail()?.VssTypeId === SubscriptionDetailType.Text,
  );
  isYesNo = computed(
    () =>
      this.detail()?.VssTypeId === SubscriptionDetailType.YesNo ||
      this.detail()?.VssTypeId === SubscriptionDetailType.Yes,
  );
  isDate = computed(
    () => this.detail()?.VssTypeId === SubscriptionDetailType.Date,
  );

  @HostBinding("class.flex-column")
  get flexColumn() {
    return this.layout() === "vertical";
  }

  @HostBinding("class.flex-row")
  get flexRow() {
    return this.layout() === "horizontal";
  }
}
