import { Pipe, PipeTransform, inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { resultOfStudent } from "src/app/events/utils/tests";
import { Test } from "src/app/shared/models/test.model";

@Pipe({
  name: "bkdTestPoints",
  standalone: true,
})
export class TestPointsPipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(
    input: Test,
    studentId: number,
    isEditable: boolean,
    label = "tests.points",
  ): string {
    // Render points if student and published, or if teacher that can edit
    if (input.IsPointGrading && (input.IsPublished || isEditable))
      return `${resultOfStudent(studentId, input)?.Points || "–"} / ${
        input.MaxPointsAdjusted || input.MaxPoints
      } ${this.translate.instant(label)}`;
    return "";
  }
}
