import { Component, Input } from '@angular/core';
import { Course } from 'src/app/shared/models/course.model';

@Component({
  selector: 'erz-dossier-grades-view',
  templateUrl: './dossier-grades-view.component.html',
  styleUrls: ['./dossier-grades-view.component.scss'],
})
export class DossierGradesViewComponent {
  @Input() courses: Course[];

  constructor() {}
}
