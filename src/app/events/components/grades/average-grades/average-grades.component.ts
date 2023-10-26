import { Component, Input } from "@angular/core";
import { averageGrade, averagePoints } from "src/app/events/utils/tests";
import { Test } from "src/app/shared/models/test.model";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: "erz-average-grades",
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
  providers: [DecimalPipe],
})
export class AverageGradesComponent {
  @Input() test: Test;
  constructor(private decimalPipe: DecimalPipe) {}

  calculatePointsAverage(test: Test) {
    return this.safeAverage(test, 2, averagePoints);
  }

  calculateGradeAverage(test: Test) {
    return this.safeAverage(test, 3, averageGrade);
  }

  private safeAverage(
    test: Test,
    fractionDigits: number,
    strategy: (test: Test) => number,
  ): string {
    try {
      return (
        this.decimalPipe
          .transform(strategy(test), `1.${fractionDigits}`)
          ?.toString() ?? "-"
      );
    } catch {
      return "-";
    }
  }
}
