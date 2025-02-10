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
import { DossierGradesService } from "src/app/shared/services/dossier-grades.service";
import { weightedAverage } from "../../../utils/math";
import { DossierCourseTestsComponent } from "../dossier-course-tests/dossier-course-tests.component";
import { DossierGradesCourseHeaderComponent } from "../dossier-grades-course-header/dossier-grades-course-header.component";
import { StudentDossierEntryHeaderComponent } from "../student-dossier-entry-header/student-dossier-entry-header.component";

export interface CourseWithGrades {
  course: Course;
  finalGrade?: FinalGrading;
  grading?: Grading;
  gradingScale?: GradingScale;
  average: number;
}

@Component({
  selector: "bkd-dossier-grades-view",
  templateUrl: "./dossier-grades-view.component.html",
  styleUrls: ["./dossier-grades-view.component.scss"],
  imports: [
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    StudentDossierEntryHeaderComponent,
    DossierGradesCourseHeaderComponent,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    DossierCourseTestsComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class DossierGradesViewComponent implements OnChanges {
  dossierGradesService = inject(DossierGradesService);

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
