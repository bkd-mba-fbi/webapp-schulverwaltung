import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  model,
  output,
} from "@angular/core";
import {
  EvaluationEntry,
  EvaluationSubscriptionDetail,
} from "src/app/events/services/evaluation-state.service";
import { SubscriptionDetailFieldComponent } from "../../../../shared/components/subscription-detail-field/subscription-detail-field.component";

@Component({
  selector: "bkd-evaluation-criteria",
  imports: [SubscriptionDetailFieldComponent],
  templateUrl: "./evaluation-criteria.component.html",
  styleUrl: "./evaluation-criteria.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationCriteriaComponent {
  entry = input.required<EvaluationEntry>();
  visible = model.required<boolean>();
  subscriptionDetailChange = output<EvaluationSubscriptionDetail>();

  @HostBinding("class.criteria-visible")
  get visibleClass() {
    return this.visible();
  }

  toggle() {
    this.visible.update((visible) => !visible);
  }
}
