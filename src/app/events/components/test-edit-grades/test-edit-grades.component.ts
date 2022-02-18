import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/shared/models/course.model';
import { StudentGradesService } from '../../services/student-grades.service';

@Component({
  selector: 'erz-test-edit-grades',
  templateUrl: './test-edit-grades.component.html',
  styleUrls: ['./test-edit-grades.component.scss'],
})
export class TestEditGradesComponent implements OnInit {
  @Input() course: Course;

  studentGrades: any;
  constructor(private studentGradesService: StudentGradesService) {}
  ngOnInit(): void {
    this.studentGrades = this.studentGradesService.transform(this.course);
  }
}
