import { Component, Input } from '@angular/core';
import { GradeOrNoResult } from '../../services/student-grades.service';

@Component({
  selector: 'erz-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss'],
})
export class GradeComponent {
  @Input() grade: GradeOrNoResult;

  constructor() {}
}
