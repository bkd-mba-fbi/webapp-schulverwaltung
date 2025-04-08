import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from "@angular/core";
import {
  SubscriptionDetail,
  SubscriptionDetailType,
} from "src/app/shared/models/subscription.model";
import { SubscriptionDetailComboboxComponent } from "./subscription-detail-combobox.component";
import { SubscriptionDetailDescriptionComponent } from "./subscription-detail-description.component";
import { SubscriptionDetailHeadingComponent } from "./subscription-detail-heading.component";
import { SubscriptionDetailListboxComponent } from "./subscription-detail-listbox.component";
import { SubscriptionDetailTextareaComponent } from "./subscription-detail-textarea.component";
import { SubscriptionDetailTextfieldComponent } from "./subscription-detail-textfield.component";

@Component({
  selector: "bkd-subscription-detail-field",
  imports: [
    SubscriptionDetailHeadingComponent,
    SubscriptionDetailDescriptionComponent,
    SubscriptionDetailComboboxComponent,
    SubscriptionDetailListboxComponent,
    SubscriptionDetailTextfieldComponent,
    SubscriptionDetailTextareaComponent,
  ],
  template: `
    @let detailValue = detail();
    @if (detailValue) {
      @let id = detailValue.Id + "-" + detailValue.IdPerson;
      @switch (detailValue.VssStyle) {
        @case ("HE") {
          <bkd-subscription-detail-heading
            [detail]="detailValue"
          ></bkd-subscription-detail-heading>
        }
        @case ("BE") {
          <bkd-subscription-detail-description
            [detail]="detailValue"
            [id]="id"
            [hideLabel]="hideLabel()"
          ></bkd-subscription-detail-description>
        }
        @case ("CB") {
          <bkd-subscription-detail-combobox
            [detail]="detailValue"
            [id]="id"
            [hideLabel]="hideLabel()"
          ></bkd-subscription-detail-combobox>
        }
        @case ("LB") {
          <bkd-subscription-detail-listbox
            [detail]="detailValue"
            [id]="id"
            [hideLabel]="hideLabel()"
            [layout]="layout()"
          ></bkd-subscription-detail-listbox>
        }
        @case ("TX") {
          @if (isTextField()) {
            <bkd-subscription-detail-textfield
              [detail]="detailValue"
              [id]="id"
              [hideLabel]="hideLabel()"
            ></bkd-subscription-detail-textfield>
          } @else if (isTextarea()) {
            <bkd-subscription-detail-textarea
              [detail]="detailValue"
              [id]="id"
              [hideLabel]="hideLabel()"
            ></bkd-subscription-detail-textarea>
          }
        }
      }
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailFieldComponent {
  detail = model.required<Option<SubscriptionDetail>>();
  hideLabel = input(false);
  layout = input<"vertical" | "horizontal">("vertical");

  isTextField = computed(
    () =>
      this.detail()?.VssTypeId === SubscriptionDetailType.ShortText ||
      this.detail()?.VssTypeId === SubscriptionDetailType.Int,
  );
  isTextarea = computed(
    () => this.detail()?.VssTypeId === SubscriptionDetailType.Text,
  );
}
