import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { map, maxBy, meanBy, minBy, round, sumBy } from "lodash-es";
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
  protected readonly state = inject(EvaluationStateService);

  readonly entries = computed(() =>
    this.state
      .entries()
      .filter((entry) => entry.grade?.Value != null && entry.grade.Value > 0),
  );

  readonly average = computed(() => {
    if (this.entries().length === 0) {
      return 0;
    }
    return round(
      meanBy(this.entries(), (entry) => entry.grade?.Value ?? 0),
      2,
    );
  });

  readonly standardDeviation = computed(() => {
    if (this.entries().length <= 1) {
      return 0;
    }

    const sum = sumBy(
      map(this.entries(), (entry) =>
        Math.pow((entry.grade?.Value ?? 0) - this.average(), 2),
      ),
    );
    return Number(Math.sqrt(sum / this.entries().length).toFixed(2));
  });

  readonly highestGrade = computed(() => this.findGrade(true));

  readonly lowestGrade = computed(() => this.findGrade(false));

  readonly unsufficientCount = computed(
    () => this.entries().filter((entry) => !entry.grade?.Sufficient).length,
  );

  private findGrade(highest: boolean) {
    if (this.entries().length === 0) {
      return "-";
    }
    const rising = this.state.gradingScale()?.RisingGrades;
    const takeHighest = (rising && highest) || (!rising && !highest);

    if (takeHighest)
      return maxBy(map(this.entries(), (entry) => entry.grade?.Value ?? 0));
    else {
      return minBy(map(this.entries(), (entry) => entry.grade?.Value ?? 0));
    }
  }
}
