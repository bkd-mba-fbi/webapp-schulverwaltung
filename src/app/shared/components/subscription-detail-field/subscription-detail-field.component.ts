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
        [layout]="layout()"
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
          [detail]="detail()"
          [id]="id"
          [(value)]="value"
          (commit)="commit.emit($event)"
        ></bkd-subscription-detail-combobox>
      }
      @case ("LB") {
        <bkd-subscription-detail-listbox
          [detail]="detail()"
          [id]="id"
          [layout]="layout()"
          [(value)]="value"
          (commit)="commit.emit($event)"
        ></bkd-subscription-detail-listbox>
      }
      @case ("TX") {
        @if (isTextField()) {
          <bkd-subscription-detail-textfield
            [detail]="detail()"
            [id]="id"
            [(value)]="value"
            (commit)="commit.emit($event)"
          ></bkd-subscription-detail-textfield>
        } @else if (isDate()) {
          <bkd-subscription-detail-datefield
            [detail]="detail()"
            [id]="id"
            [(value)]="value"
            (commit)="commit.emit($event)"
          ></bkd-subscription-detail-datefield>
        } @else if (isTextarea()) {
          <bkd-subscription-detail-textarea
            [detail]="detail()"
            [id]="id"
            [(value)]="value"
            (commit)="commit.emit($event)"
          ></bkd-subscription-detail-textarea>
        } @else if (isYesNo()) {
          <bkd-subscription-detail-yesno
            [detail]="detail()"
            [id]="id"
            [layout]="layout()"
            [(value)]="value"
            (commit)="commit.emit($event)"
          ></bkd-subscription-detail-yesno>
        }
      }
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      column-gap: 1rem;
    }

    bkd-subscription-detail-label {
      width: 100%;
    }

    @media (min-width: 811px) {
      :host.horizontal {
        flex-direction: row;
      }

      :host.horizontal > bkd-subscription-detail-label {
        flex: none;
        min-width: 33%;
        width: 33%;
      }

      :host.horizontal > :not(bkd-subscription-detail-label) {
        flex: auto;
        max-width: 100ch;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailFieldComponent {
  detail = input.required<SubscriptionDetail>();
  hideLabel = input(false);
  layout = input<"vertical" | "horizontal">("vertical");
  value = model<SubscriptionDetail["Value"]>();
  commit = output<SubscriptionDetail["Value"]>();

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

  @HostBinding("class.horizontal")
  get horizontalClass() {
    return this.layout() === "horizontal";
  }
}
