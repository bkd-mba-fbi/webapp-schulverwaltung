import { AsyncPipe } from "@angular/common";
import { Component, Input, OnChanges, inject } from "@angular/core";
import {
  NgbAccordionBody,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbCollapse,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";
import {
  Course,
  FinalGrading,
  Grading,
} from "src/app/shared/models/course.model";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import { StudentGradesService } from "src/app/shared/services/student-grades.service";
import { weightedAverage } from "../../../utils/math";
import { StudentEntryHeaderComponent } from "../student-entry-header/student-entry-header.component";
import { StudentGradesCourseHeaderComponent } from "../student-grades-course-header/student-grades-course-header.component";
import { StudentGradesCourseComponent } from "../student-grades-course/student-grades-course.component";

export interface CourseWithGrades {
  course: Course;
  finalGrade?: FinalGrading;
  grading?: Grading;
  gradingScale?: GradingScale;
  average: number;
}

@Component({
  selector: "bkd-student-grades-accordion",
  templateUrl: "./student-grades-accordion.component.html",
  styleUrls: ["./student-grades-accordion.component.scss"],
  imports: [
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    StudentEntryHeaderComponent,
    StudentGradesCourseHeaderComponent,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    StudentGradesCourseComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class StudentGradesAccordionComponent implements OnChanges {
  dossierGradesService = inject(StudentGradesService);

  @Input() courses: ReadonlyArray<Course>;
  @Input() studentId: number;
  @Input() gradingScales: ReadonlyArray<GradingScale>;
  @Input() isEditable: boolean = true;

  decoratedCoursesSubject$ = new BehaviorSubject<CourseWithGrades[]>([]);

  ngOnChanges() {
    this.decoratedCoursesSubject$.next(this.decorateCourses());
  }

  private decorateCourses(): CourseWithGrades[] {
    return this.courses.map((course) => {
      const finalGrade = this.dossierGradesService.getFinalGradeForStudent(
        course,
        this.studentId,
      );
      const grades = this.dossierGradesService.getGradesForStudent(
        course,
        this.studentId,
        this.gradingScales,
      );

      return {
        course,
        finalGrade,
        grading: this.dossierGradesService.getGradingForStudent(
          course,
          this.studentId,
        ),
        gradingScale: this.dossierGradesService.getGradingScaleOfCourse(
          course,
          this.gradingScales,
        ),
        average: finalGrade?.AverageTestResult || weightedAverage(grades),
      };
    });
  }
}
