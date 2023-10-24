import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Test } from 'src/app/shared/models/test.model';

@Pipe({
  name: 'testSummaryShort',
})
export class TestSummaryShortPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(test: Test): string {
    return `${test.Weight} (${test.WeightPercent}%)${this.getPoints(test)}`;
  }

  private getPoints(test: Test): string {
    return test.IsPointGrading
      ? `, ${test.MaxPointsAdjusted ?? test.MaxPoints} ${this.translate.instant(
          'tests.summary.points',
        )}`
      : '';
  }
}
