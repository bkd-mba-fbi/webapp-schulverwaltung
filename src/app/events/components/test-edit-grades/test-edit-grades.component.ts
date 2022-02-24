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

  constructor(private studentGradesService: StudentGradesService) {}

  ngOnInit(): void {
    this.displayAllTests();
  }

  filterOwnedTests() {
    let ownedTests: Test[] = [];
    this.course.Tests?.map((test) => {
      if (test.IsOwner === true) {
        ownedTests.push(test);
      }
      this.displayTests = ownedTests;
      this.studentGrades = this.studentGradesService.transform(
        this.course.ParticipatingStudents ?? [],
        ownedTests
      );
    });
  }

  displayAllTests() {
    this.displayTests = this.course.Tests;

    this.studentGrades = this.studentGradesService.transform(
      this.course.ParticipatingStudents ?? [],
      this.course.Tests ?? []
    );
  }
}
