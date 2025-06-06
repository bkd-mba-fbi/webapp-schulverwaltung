import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { GradeBarChartComponent } from "src/app/shared/components/grade-bar-chart/grade-bar-chart.component";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { EvaluationStateService } from "../../../services/evaluation-state.service";
import { EvaluationHeaderComponent } from "../evaluation-header/evaluation-header.component";

@Component({
  selector: "bkd-evaluation-statistic",
  imports: [
    TranslatePipe,
    EvaluationHeaderComponent,
    GradeBarChartComponent,
    SpinnerComponent,
  ],
  templateUrl: "./evaluation-statistic.component.html",
  styleUrl: "./evaluation-statistic.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationStatisticComponent {
  state = inject(EvaluationStateService);
  private translate = inject(TranslateService);
}
