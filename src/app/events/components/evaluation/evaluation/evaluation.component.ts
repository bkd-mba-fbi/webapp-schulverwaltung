import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { EvaluationStateService } from "src/app/events/services/evaluation-state.service";
import { EvaluationDefaultGradeUpdateService } from "../../../services/evaluation-default-grade-update.service";

@Component({
  selector: "bkd-evaluation",
  imports: [RouterOutlet],
  providers: [EvaluationStateService, EvaluationDefaultGradeUpdateService],
  template: ` <router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationComponent {}
