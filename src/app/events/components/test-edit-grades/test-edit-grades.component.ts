import {
  Component,
  Inject,
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
import { averageGrade, averagePoints } from '../../utils/tests';
import { CoursesRestService } from '../../../shared/services/courses-rest.service';
import { EventsStateService } from '../../services/events-state.service';
import { Settings, SETTINGS } from '../../../settings';

@Component({
  selector: 'erz-test-edit-grades',
  templateUrl: './test-edit-grades.component.html',
  styleUrls: ['./test-edit-grades.component.scss'],
  providers: [EventsStateService],
})
export class TestEditGradesComponent implements OnInit, OnChanges {
  @Input() course: Course;
  @Input() tests: Test[];
  @Input() selectedTest: Test | undefined;

  constructor(
    @Inject(SETTINGS) public settings: Settings,
    public state: TestEditGradesStateService,
    private modalService: NgbModal,
    private coursesRestService: CoursesRestService
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

  setAverageAsFinalGrade() {
    this.coursesRestService
      .setAverageAsFinalGrade({ CourseIds: [this.course.Id] })
      .subscribe(console.log);
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
