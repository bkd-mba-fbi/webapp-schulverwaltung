import { Component } from '@angular/core';
import { Student } from 'src/app/shared/models/student.model';
import { buildStudent } from 'src/spec-builders';
import { DossierService } from '../../service/dossier.service';

@Component({
  selector: 'erz-dossier-overview',
  templateUrl: './dossier-overview.component.html',
  styleUrls: ['./dossier-overview.component.scss'],
})
export class DossierOverviewComponent {
  studentId: number = 333; // TODO load from token
  student: Student = buildStudent(this.studentId); // TODO load by service (student or person?)

  constructor(public service: DossierService) {}
}
