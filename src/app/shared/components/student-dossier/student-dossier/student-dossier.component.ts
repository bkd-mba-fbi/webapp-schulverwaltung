import { ChangeDetectionStrategy, Component } from '@angular/core';
import { of } from 'rxjs';
import { DossierGradesService } from 'src/app/shared/services/dossier-grades.service';
import { DossierStateService } from '../../../services/dossier-state.service';

@Component({
  selector: 'erz-student-dossier',
  templateUrl: './student-dossier.component.html',
  styleUrls: ['./student-dossier.component.scss'],
  providers: [DossierStateService, DossierGradesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// TODO: on Destroy
export class StudentDossierComponent {
  link$ = of('../..');

  queryParams$ = this.state.backlinkQueryParams$;

  constructor(
    public state: DossierStateService,
    public dossierGradesService: DossierGradesService
  ) {
    this.state.currentDossier$.next('addresses');
  }
}
