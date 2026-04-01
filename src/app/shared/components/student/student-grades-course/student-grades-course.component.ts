import { AsyncPipe } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import { Test } from "src/app/shared/models/test.model";
import { gradingScaleOfTest, sortByDate } from "../../../../events/utils/tests";
import { CourseWithGrades } from "../student-grades-accordion/student-grades-accordion.component";
import { StudentGradesFinalGradeComponent } from "../student-grades-final-grade/student-grades-final-grade.component";
import { StudentGradesTestComponent } from "../student-grades-test/student-grades-test.component";

@Component({
  selector: "bkd-student-grades-course",
  templateUrl: "./student-grades-course.component.html",
  styleUrls: ["./student-grades-course.component.scss"],
  imports: [
    StudentGradesFinalGradeComponent,
    StudentGradesTestComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class StudentGradesCourseComponent implements OnChanges {
  @Input() studentId: number;
  @Input() decoratedCourse: CourseWithGrades;
  @Input() gradingScales: ReadonlyArray<GradingScale>;
  @Input() isEditable: boolean;

  sortedTests$ = new BehaviorSubject<Test[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["decoratedCourse"]) {
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
