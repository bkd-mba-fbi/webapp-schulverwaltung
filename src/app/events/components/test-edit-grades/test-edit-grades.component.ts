import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/shared/models/course.model';
import { StudentGradesService } from '../../services/student-grades.service';
import { Test } from '../../../shared/models/test.model';

@Component({
  selector: 'erz-test-edit-grades',
  templateUrl: './test-edit-grades.component.html',
  styleUrls: ['./test-edit-grades.component.scss'],
})
export class TestEditGradesComponent implements OnInit {
  @Input() course: Course;

  studentGrades: any;
  displayTests: any;
  isFiltered: boolean;

  constructor(private studentGradesService: StudentGradesService) {}

  ngOnInit(): void {
    this.resetFilter();
  }

  filterOwnedTests() {
    let ownedTests: Test[] = [];
    this.course.Tests?.map((test: Test) => {
      if (test.IsOwner === true) {
        ownedTests.push(test);
      }
      this.displayTests = ownedTests;
      this.studentGrades = this.studentGradesService.transform(
        this.course.ParticipatingStudents ?? [],
        ownedTests
      );
      this.isFiltered = true;
    });
  }

  resetFilter() {
    this.displayTests = this.course.Tests;

    this.studentGrades = this.studentGradesService.transform(
      this.course.ParticipatingStudents ?? [],
      this.course.Tests ?? []
    );
    this.isFiltered = false;
  }
}
