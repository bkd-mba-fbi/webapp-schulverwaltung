import {
  ChangeDetectionStrategy,
  Component,
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
import { SubscriptionDetailDescriptionComponent } from "./subscription-detail-description.component";
import { SubscriptionDetailHeadingComponent } from "./subscription-detail-heading.component";
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
  ],
  template: `
    @let id = detail().Id + "-" + detail().IdPerson;
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
          [hideLabel]="hideLabel()"
        ></bkd-subscription-detail-description>
      }
      @case ("CB") {
        <bkd-subscription-detail-combobox
          [(detail)]="detail"
          [id]="id"
          [hideLabel]="hideLabel()"
          (commit)="commit.emit($event)"
        ></bkd-subscription-detail-combobox>
      }
      @case ("LB") {
        <bkd-subscription-detail-listbox
          [(detail)]="detail"
          [id]="id"
          [hideLabel]="hideLabel()"
          [layout]="layout()"
          (commit)="commit.emit($event)"
        ></bkd-subscription-detail-listbox>
      }
      @case ("TX") {
        @if (isTextField()) {
          <bkd-subscription-detail-textfield
            [(detail)]="detail"
            [id]="id"
            [hideLabel]="hideLabel()"
            (commit)="commit.emit($event)"
          ></bkd-subscription-detail-textfield>
        } @else if (isTextarea()) {
          <bkd-subscription-detail-textarea
            [(detail)]="detail"
            [id]="id"
            [hideLabel]="hideLabel()"
            (commit)="commit.emit($event)"
          ></bkd-subscription-detail-textarea>
        } @else if (isYesNo()) {
          <bkd-subscription-detail-yesno
            [(detail)]="detail"
            [id]="id"
            [hideLabel]="hideLabel()"
            (commit)="commit.emit($event)"
          ></bkd-subscription-detail-yesno>
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
  detail = model.required<SubscriptionDetail>();
  hideLabel = input(false);
  layout = input<"vertical" | "horizontal">("vertical");
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
}
