import { Component } from '@angular/core';
import { DossierStateService } from '../../../shared/services/dossier-state.service';
import { DossierGradesService } from '../../../shared/services/dossier-grades.service';
import { MyGradesService } from '../../services/my-grades.service';

@Component({
  selector: 'erz-my-grades',
  templateUrl: './my-grades.component.html',
  styleUrls: ['./my-grades.component.scss'],
  providers: [DossierStateService, DossierGradesService, MyGradesService],
})
export class MyGradesComponent {
  constructor() {}
}
