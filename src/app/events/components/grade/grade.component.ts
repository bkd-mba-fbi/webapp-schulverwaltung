import { Component, Input } from '@angular/core';
import { GradeOrNoResult } from 'src/app/shared/models/student-grades';

@Component({
  selector: 'erz-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss'],
})
export class GradeComponent {
  @Input() grade: GradeOrNoResult;

  constructor() {}
}
