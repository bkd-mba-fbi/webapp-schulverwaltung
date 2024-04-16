import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import { Test } from "src/app/shared/models/test.model";
import { gradingScaleOfTest, sortByDate } from "../../../../events/utils/tests";
import { LetDirective } from "../../../directives/let.directive";
import { DossierGradesFinalGradeComponent } from "../dossier-grades-final-grade/dossier-grades-final-grade.component";
import { CourseWithGrades } from "../dossier-grades-view/dossier-grades-view.component";
import { DossierSingleTestComponent } from "../dossier-single-test/dossier-single-test.component";

@Component({
  selector: "erz-dossier-course-tests",
  templateUrl: "./dossier-course-tests.component.html",
  styleUrls: ["./dossier-course-tests.component.scss"],
  standalone: true,
  imports: [
    LetDirective,
    NgIf,
    DossierGradesFinalGradeComponent,
    NgFor,
    DossierSingleTestComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class DossierCourseTestsComponent implements OnChanges {
  @Input() studentId: number;
  @Input() decoratedCourse: CourseWithGrades;
  @Input() gradingScales: GradingScale[];
  @Input() isEditable: boolean;

  sortedTests$ = new BehaviorSubject<Test[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.decoratedCourse) {
      this.sortedTests$.next(this.sortedTests());
    }
  }

  constructor() {}

  sortedTests() {
    if (!this.decoratedCourse.course.Tests) return [];
    return sortByDate(this.decoratedCourse.course.Tests);
  }

  getGradingScaleOfTest(test: Test) {
    return gradingScaleOfTest(test, this.gradingScales);
  }
}
