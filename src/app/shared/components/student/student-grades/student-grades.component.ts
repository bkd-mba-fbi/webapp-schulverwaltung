import { AsyncPipe } from "@angular/common";
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { StudentGradesService } from "src/app/shared/services/student-grades.service";
import { StudentStateService } from "src/app/shared/services/student-state.service";
import { SpinnerComponent } from "../../spinner/spinner.component";
import { StudentGradesAccordionComponent } from "../student-grades-accordion/student-grades-accordion.component";

@Component({
  selector: "bkd-student-grades",
  templateUrl: "./student-grades.component.html",
  styleUrls: ["./student-grades.component.scss"],
  imports: [StudentGradesAccordionComponent, SpinnerComponent, AsyncPipe],
})
export class StudentGradesComponent implements OnInit, OnDestroy {
  state = inject(StudentStateService);
  gradesService = inject(StudentGradesService);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.state.studentId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => this.gradesService.setStudentId(id));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
