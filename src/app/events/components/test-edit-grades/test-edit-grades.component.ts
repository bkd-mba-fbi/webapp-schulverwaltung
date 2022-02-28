import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/shared/models/course.model';
import {
  StudentGrade,
  StudentGradesService,
} from '../../services/student-grades.service';
import { Test } from '../../../shared/models/test.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'erz-test-edit-grades',
  templateUrl: './test-edit-grades.component.html',
  styleUrls: ['./test-edit-grades.component.scss'],
})
export class TestEditGradesComponent implements OnInit {
  @Input() course: Course;

  studentGrades: StudentGrade[];
  displayTests: any;
  isFiltered: boolean;

  constructor(
    private studentGradesService: StudentGradesService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.resetFilter();
  }

  factor(test: Test): string {
    return `${this.translateService.instant('tests.add.factor')} ${
      test.Weight
    } (${test.WeightPercent}%)`;
  }

  gradeType(test: Test): string {
    const points = test.MaxPointsAdjusted
      ? `${test.MaxPointsAdjusted}, ${this.translateService.instant(
          'tests.add.adjusted'
        )}`
      : test.MaxPoints;

    return test.IsPointGrading
      ? `${this.translateService.instant('tests.add.points')} (${points})`
      : this.translateService.instant('tests.add.grades');
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
