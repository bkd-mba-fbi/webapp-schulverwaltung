import { NgIf } from "@angular/common";
import { Component, Inject, Input, LOCALE_ID } from "@angular/core";
import { averageGrade, averagePoints } from "src/app/events/utils/tests";
import { Test } from "src/app/shared/models/test.model";
import {
  DASH,
  formatDecimalOrDash,
} from "src/app/shared/pipes/decimal-or-dash.pipe";

@Component({
  selector: "bkd-average-grades",
  template: `<div class="d-flex flex-row w-100">
    <span
      *ngIf="test.IsPointGrading"
      class="mr-2 mr-md-3 average-points"
      data-testid="average-points"
      >{{ calculatePointsAverage(test) }}</span
    >
    <span data-testid="average-grade">{{ calculateGradeAverage(test) }}</span>
  </div>`,
  styleUrls: ["./average-grades.component.scss"],
  standalone: true,
  imports: [NgIf],
})
export class AverageGradesComponent {
  @Input() test: Test;
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  calculatePointsAverage(test: Test) {
    return this.safeAverage(test, 2, averagePoints);
  }

  calculateGradeAverage(test: Test) {
    return this.safeAverage(test, 3, averageGrade);
  }

  private safeAverage(
    test: Test,
    fractionDigits: number | string,
    strategy: (test: Test) => number,
  ): string {
    try {
      return formatDecimalOrDash(strategy(test), this.locale, fractionDigits);
    } catch {
      return DASH;
    }
  }
}
