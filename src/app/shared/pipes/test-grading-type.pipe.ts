import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Test } from 'src/app/shared/models/test.model';

@Pipe({
  name: 'erzTestGradingType',
})
export class TestsGradingTypePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(input: Test): string {
    const points = input.MaxPointsAdjusted
      ? `${input.MaxPointsAdjusted}, ${this.translate.instant(
          'tests.adjusted'
        )}`
      : input.MaxPoints;

    return input.IsPointGrading
      ? `${this.translate.instant('tests.type-points')} (${points})`
      : this.translate.instant('tests.type-grades');
  }
}
