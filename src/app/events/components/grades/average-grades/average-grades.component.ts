import { Component, Input } from '@angular/core';
import { averageGrade, averagePoints } from 'src/app/events/utils/tests';
import { Test } from 'src/app/shared/models/test.model';

@Component({
  selector: 'erz-average-grades',
  template: `<div class="d-flex flex-row w-100">
    <span
      *ngIf="test.IsPointGrading"
      class="mr-3 average-points"
      data-testid="average-points"
      >{{ calculatePointsAverage(test) }}</span
    >
    <span data-testid="average-grade">{{ calculateGradeAverage(test) }}</span>
  </div>`,
  styles: ['.average-points {min-width: 9ch;}'],
})
export class AverageGradesComponent {
  @Input() test: Test;
  constructor() {}

  calculatePointsAverage(test: Test) {
    return this.safeAverage(test, averagePoints);
  }

  calculateGradeAverage(test: Test) {
    return this.safeAverage(test, averageGrade);
  }

  private safeAverage(test: Test, calculator: (test: Test) => number): string {
    try {
      return calculator(test).toString();
    } catch {
      return '-';
    }
  }
}
