import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { EvaluationStateService } from "src/app/events/services/evaluation-state.service";
import { EvaluationSubscriptionDetailUpdateService } from "src/app/events/services/evaluation-subscription-detail-update.service";
import { EvaluationGradingItemUpdateService } from "../../../services/evaluation-grading-item-update.service";

@Component({
  selector: "bkd-evaluation",
  imports: [RouterOutlet],
  providers: [
    EvaluationStateService,
    EvaluationGradingItemUpdateService,
    EvaluationSubscriptionDetailUpdateService,
  ],
  template: ` <router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationComponent {}
