import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/shared/models/course.model';
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
export class TestEditGradesComponent implements OnInit {
  @Input() course: Course;
  @Input() tests: Test[];
  @Input() selectedTest: Test | undefined;

  constructor(public state: TestEditGradesStateService) {}

  ngOnInit(): void {
    this.state.course = this.course;
    this.state.tests = this.tests;
    this.state.setSorting({ key: 'FullName', ascending: true });
  }

  changeFilter(filter: Filter) {
    this.state.filter$.next(filter);
  }
}
