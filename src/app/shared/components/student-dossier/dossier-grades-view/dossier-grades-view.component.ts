import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/shared/models/course.model';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';

@Component({
  selector: 'erz-dossier-grades-view',
  templateUrl: './dossier-grades-view.component.html',
  styleUrls: ['./dossier-grades-view.component.scss'],
})
export class DossierGradesViewComponent {
  @Input() courses: Course[];
  @Input() studentId: number;
  @Input() gradingScales: GradingScale[];
}
