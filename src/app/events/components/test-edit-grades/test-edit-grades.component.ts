import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  Course,
  TestGradesResult,
  TestPointsResult,
} from 'src/app/shared/models/course.model';
import { GradeOrNoResult } from 'src/app/shared/models/student-grades';
import { Student } from 'src/app/shared/models/student.model';
import { PublishTestComponent } from 'src/app/events/components/tests-publish/publish-test.component';
import { Test } from '../../../shared/models/test.model';
import {
  Filter,
  TestEditGradesStateService,
} from '../../services/test-edit-grades-state.service';

@Component({
  selector: 'erz-test-edit-grades',
  templateUrl: './test-edit-grades.component.html',
  styleUrls: ['./test-edit-grades.component.scss'],
})
export class TestEditGradesComponent implements OnInit, OnChanges {
  @Input() course: Course;
  @Input() tests: Test[];
  @Input() selectedTest: Test | undefined;

  constructor(
    public state: TestEditGradesStateService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // TODO move to sort implementation
    this.state.setSorting({ key: 'FullName', ascending: true });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // TODO do this in the state service, where data is loaded
    if (changes.course) {
      this.state.course = this.course;
    }
    if (changes.tests) {
      this.state.setTests(this.tests);
    }
  }

  changeFilter(filter: Filter) {
    this.state.filter$.next(filter);
  }

  saveGrade(requestBody: TestGradesResult | TestPointsResult) {
    this.state.saveGrade(requestBody);
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
