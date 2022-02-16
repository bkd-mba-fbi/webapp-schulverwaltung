import { Component, Input } from '@angular/core';
import { Course } from '../../../shared/models/course.model';

@Component({
  selector: 'erz-tests-header',
  templateUrl: './tests-header.component.html',
  styleUrls: ['./tests-header.component.scss'],
})
export class TestsHeaderComponent {
  @Input() course: Course;
  constructor() {}
}
