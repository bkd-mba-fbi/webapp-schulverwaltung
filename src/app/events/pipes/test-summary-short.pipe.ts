import { Pipe, PipeTransform, inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Test } from "src/app/shared/models/test.model";

@Pipe({
  name: "testSummaryShort",
  standalone: true,
})
export class TestSummaryShortPipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(test: Test): string {
    return `${test.Weight} (${test.WeightPercent}%)${this.getPoints(test)}`;
  }

  private getPoints(test: Test): string {
    return test.IsPointGrading
      ? `, ${test.MaxPointsAdjusted ?? test.MaxPoints} ${this.translate.instant(
          "tests.summary.points",
        )}`
      : "";
  }
}
