import { Component, Input } from '@angular/core';
import { Course } from 'src/app/shared/models/course.model';

@Component({
  selector: 'erz-dossier-course-entry',
  templateUrl: './dossier-course-entry.component.html',
  styleUrls: ['./dossier-course-entry.component.scss'],
})
export class DossierCourseEntryComponent {
  @Input() course: Course;

  constructor() {}
}
