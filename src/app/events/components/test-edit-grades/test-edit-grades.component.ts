import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Course, TestPointsResult } from 'src/app/shared/models/course.model';
import { GradeOrNoResult } from 'src/app/shared/models/student-grades';
import { Student } from 'src/app/shared/models/student.model';
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

  constructor(public state: TestEditGradesStateService) {}

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

  savePoints(requestBody: TestPointsResult) {
    this.state.savePoints(requestBody);
  }

  publish(test: Test) {
    this.state.publish(test);
  }

  trackStudentGrade(index: number) {
    return index;
  }

  trackGradeOf(student: Student) {
    return function (_: number, grade: GradeOrNoResult) {
      return `${student.Id}_${grade.test.Id}`;
    };
  }
}
