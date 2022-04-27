import { Component, Input } from '@angular/core';
import { Student } from 'src/app/shared/models/student.model';

@Component({
  selector: 'erz-dossier-header',
  templateUrl: './dossier-header.component.html',
  styleUrls: ['./dossier-header.component.scss'],
})
export class DossierHeaderComponent {
  @Input() student: Student;
  @Input() studentId: number;

  constructor() {}
}
