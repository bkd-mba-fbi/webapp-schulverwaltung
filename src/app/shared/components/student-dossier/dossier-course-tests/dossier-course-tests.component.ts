import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import { Test } from "src/app/shared/models/test.model";
import { gradingScaleOfTest, sortByDate } from "../../../../events/utils/tests";
import { CourseWithGrades } from "../dossier-grades-view/dossier-grades-view.component";

@Component({
  selector: "erz-dossier-course-tests",
  templateUrl: "./dossier-course-tests.component.html",
  styleUrls: ["./dossier-course-tests.component.scss"],
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
