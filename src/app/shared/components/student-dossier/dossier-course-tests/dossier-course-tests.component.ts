import { Component, Input } from '@angular/core';
import { Course } from 'src/app/shared/models/course.model';

@Component({
  selector: 'erz-dossier-course-entry',
  templateUrl: './dossier-course-tests.component.html',
  styleUrls: ['./dossier-course-tests.component.scss'],
})
export class DossierCourseTestsComponent {
  @Input() course: Course;

  constructor() {}
}
