import { Component } from '@angular/core';
import { DossierGradesService } from '../../../shared/services/dossier-grades.service';

@Component({
  selector: 'erz-my-grades-header',
  templateUrl: './my-grades-header.component.html',
  styleUrls: ['./my-grades-header.component.scss'],
  // providers: [DossierGradesService],
})
export class MyGradesHeaderComponent {
  constructor(public dossierGradesService: DossierGradesService) {}
}
