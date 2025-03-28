import { AsyncPipe, NgClass } from "@angular/common";
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
  viewChild,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { Observable, Subject, combineLatest } from "rxjs";
import { map, take, takeUntil } from "rxjs/operators";
import { TestsPublishComponent } from "src/app/events/components/tests/tests-publish/tests-publish.component";
import {
  GradeOrNoResult,
  StudentGrade,
} from "src/app/shared/models/student-grades";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { Test } from "../../../../shared/models/test.model";
import { DecimalOrDashPipe } from "../../../../shared/pipes/decimal-or-dash.pipe";
import { EventsStateService } from "../../../services/events-state.service";
import { TestStateService } from "../../../services/test-state.service";
import { getEventState } from "../../../utils/events";
import { averageGrade, averagePoints } from "../../../utils/tests";
import { TableHeaderStickyDirective } from "../../common/table-header-sticky/table-header-sticky.directive";
import { AverageGradesComponent } from "../average-grades/average-grades.component";
import { GradeSelectComponent } from "../grade-select/grade-select.component";
import { GradeComponent } from "../grade/grade.component";
import { TestsTableHeaderComponent } from "../tests-table-header/tests-table-header.component";

@Component({
  selector: "bkd-tests-table",
  templateUrl: "./tests-table.component.html",
  styleUrls: ["./tests-table.component.scss"],
  providers: [EventsStateService],
  imports: [
    NgClass,
    RouterLink,
    GradeSelectComponent,
    GradeComponent,
    AverageGradesComponent,
    AsyncPipe,
    TranslatePipe,
    DecimalOrDashPipe,
    TableHeaderStickyDirective,
    TestsTableHeaderComponent,
  ],
})
export class TestsTableComponent implements OnInit, OnDestroy {
  state = inject(TestStateService);
  private modalService = inject(BkdModalService);
  private destroy$ = new Subject<void>();

  private sticky = viewChild(TableHeaderStickyDirective);

  @Input() selectedTest?: Test;

  ngOnInit(): void {
    this.state.sortCriteria.set({
      primarySortKey: "FullName",
      ascending: true,
    });

    // Refresh the columns widths of the sticky header, whenever column count or
    // size may change
    combineLatest([this.state.filteredTests$, this.state.expandedHeader$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.sticky()?.refresh());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setAverageAsFinalGrade() {
    this.state.course$
      .pipe(take(1))
      .subscribe((course) =>
        this.state.setAveragesAsFinalGrades({ CourseIds: [course.Id] }),
      );
  }

  isEditFinalGradesAllowed(studentGrade: StudentGrade): Observable<boolean> {
    return this.state.course$.pipe(
      map((course) =>
        Boolean(
          getEventState(course)?.value && studentGrade.finalGrade?.canGrade,
        ),
      ),
    );
  }

  getGrades(
    studentGrade: StudentGrade,
  ): ReadonlyArray<{ id: string; grade: GradeOrNoResult }> {
    return studentGrade.grades.flatMap((grade) => ({
      id: `${studentGrade.student.Id}-${grade.test.Id}`,
      grade,
    }));
  }

  publish(test: Test) {
    const modalRef = this.openModal(test);
    this.onCloseModal(modalRef, () => this.state.publish(test));
  }

  unpublish(test: Test) {
    const modalRef = this.openModal(test);
    this.onCloseModal(modalRef, () => this.state.unpublish(test));
  }

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
      return "–";
    }
  }

  private openModal(test: Test) {
    const modalRef = this.modalService.open(TestsPublishComponent);
    modalRef.componentInstance.test = test;
    return modalRef;
  }

  private onCloseModal(modalRef: NgbModalRef, action: () => void) {
    modalRef.result.then(
      (result) => {
        if (result) action();
      },
      () => {},
    );
  }
}
