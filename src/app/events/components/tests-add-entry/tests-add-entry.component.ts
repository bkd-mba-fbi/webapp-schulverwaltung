import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Test } from 'src/app/shared/models/test.model';

@Component({
  selector: 'erz-tests-add-entry',
  templateUrl: './tests-add-entry.component.html',
  styleUrls: ['./tests-add-entry.component.scss'],
})
export class TestsAddEntryComponent {
  @Input() test: Test;

  constructor(private translate: TranslateService) {}

  get gradingType(): string {
    const points = this.test.MaxPointsAdjusted
      ? `${this.test.MaxPointsAdjusted}, ${this.translate.instant(
          'tests.add.adjusted'
        )}`
      : this.test.MaxPoints;

    return this.test.IsPointGrading
      ? `${this.translate.instant('tests.add.type-points')} (${points})`
      : this.translate.instant('tests.add.type-grades');
  }

  get weight(): string {
    return `${this.translate.instant('tests.add.factor')} ${
      this.test.Weight
    } (${this.test.WeightPercent}%)`;
  }
}
