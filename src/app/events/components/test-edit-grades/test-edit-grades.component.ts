import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PublishTestComponent } from 'src/app/events/components/tests-publish/publish-test.component';
import {
  TestGradesResult,
  TestPointsResult,
} from 'src/app/shared/models/course.model';
import {
  GradeOrNoResult,
  StudentGrade,
} from 'src/app/shared/models/student-grades';
import { Student } from 'src/app/shared/models/student.model';
import { Test } from '../../../shared/models/test.model';
import { EventsStateService } from '../../services/events-state.service';
import { Filter, TestStateService } from '../../services/test-state.service';
import { getEventState } from '../../utils/events';
import { averageGrade, averagePoints } from '../../utils/tests';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'erz-test-edit-grades',
  templateUrl: './test-edit-grades.component.html',
  styleUrls: ['./test-edit-grades.component.scss'],
  providers: [EventsStateService],
})
export class TestEditGradesComponent implements OnInit {
  @Input() selectedTest: Test | undefined;

  constructor(public state: TestStateService, private modalService: NgbModal) {}

  ngOnInit(): void {
    // TODO move to sort implementation
    this.state.setSorting({ key: 'FullName', ascending: true });
  }

  changeFilter(filter: Filter) {
    this.state.filter$.next(filter);
  }

  saveGrade(requestBody: TestGradesResult | TestPointsResult) {
    this.state.saveGrade(requestBody);
  }

  setAverageAsFinalGrade() {
    this.state.course$
      .pipe(take(1))
      .subscribe((course) =>
        this.state.setAveragesAsFinalGrades({ CourseIds: [course.Id] })
      );
  }

  isEditFinalGradesAllowed(studentGrade: StudentGrade): Observable<boolean> {
    return this.state.course$.pipe(
      map((course) =>
        Boolean(
          getEventState(course)?.value && studentGrade.finalGrade.canGrade
        )
      )
    );
  }

  publish(test: Test) {
    const modalRef = this.openModal(test);
    this.onCloseModal(modalRef, () => this.state.publish(test));
  }

  unpublish(test: Test) {
    const modalRef = this.openModal(test);
    this.onCloseModal(modalRef, () => this.state.unpublish(test));
  }

  trackStudentGrade(index: number) {
    return index;
  }

  trackGradeOf(student: Student) {
    return function (_: number, grade: GradeOrNoResult) {
      return `${student.Id}_${grade.test.Id}`;
    };
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
      return '-';
    }
  }

  private openModal(test: Test) {
    const modalRef = this.modalService.open(PublishTestComponent);
    modalRef.componentInstance.test = test;
    return modalRef;
  }

  private onCloseModal(modalRef: NgbModalRef, action: () => void) {
    modalRef.result.then(
      (result) => {
        if (result) action();
      },
      () => {}
    );
  }
}
