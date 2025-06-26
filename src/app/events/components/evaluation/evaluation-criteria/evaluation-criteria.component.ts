import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
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
  private translate = inject(TranslateService);
  entry = input.required<EvaluationEntry>();
  visible = model.required<boolean>();
  subscriptionDetailChange = output<EvaluationSubscriptionDetail>();

  @HostBinding("class.criteria-visible")
  get visibleClass() {
    return this.visible();
  }

  heading = computed(
    () =>
      this.headingDetail()?.VssDesignation ??
      this.translate.instant("evaluation.set-criteria"),
  );

  headingDetail = computed(
    () => this.entry().criteria.find((c) => c.detail.VssStyle === "HE")?.detail,
  );

  toggle() {
    this.visible.update((visible) => !visible);
  }
}
