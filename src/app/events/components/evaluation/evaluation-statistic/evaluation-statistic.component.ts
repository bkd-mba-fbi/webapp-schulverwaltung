import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { EvaluationChartComponent } from "src/app/events/components/evaluation/evaluation-statistic/evaluation-chart/evaluation-chart.component";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { EvaluationStateService } from "../../../services/evaluation-state.service";
import { EvaluationHeaderComponent } from "../evaluation-header/evaluation-header.component";

@Component({
  selector: "bkd-evaluation-statistic",
  imports: [
    TranslatePipe,
    EvaluationHeaderComponent,
    EvaluationChartComponent,
    SpinnerComponent,
  ],
  templateUrl: "./evaluation-statistic.component.html",
  styleUrl: "./evaluation-statistic.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationStatisticComponent {
  state = inject(EvaluationStateService);

  entries = computed(() =>
    this.state.entries().filter((entry) => entry.grade?.Value != null),
  );

  average = computed(() => {
    if (this.entries().length === 0) {
      return 0;
    }
    const sum = this.entries().reduce(
      (acc, entry) => acc + (entry.grade?.Value ?? 0),
      0,
    );
    return sum / this.entries().length;
  });
}
