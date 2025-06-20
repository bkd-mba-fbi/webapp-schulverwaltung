import { NgClass } from "@angular/common";
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
  imports: [NgClass, SubscriptionDetailFieldComponent],
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

  heading = computed(() => {
    const defaultHeading = this.translate.instant("evaluation.set-criteria");
    if (this.entry().criteria.length === 0) {
      return defaultHeading;
    }
    const detail = this.entry().criteria.find(
      (c) => c.detail.VssStyle === "HE",
    )?.detail;
    if (!detail) {
      return defaultHeading;
    }
    return detail.VssDesignation;
  });

  toggle() {
    this.visible.update((visible) => !visible);
  }
}
