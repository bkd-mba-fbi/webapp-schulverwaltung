import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, switchMap } from 'rxjs';
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
  link$ = this.state.isOverview$.pipe(
    map((isOverview) => (isOverview ? ['../..'] : ['.']))
  );

  queryParams$ = this.state.isOverview$.pipe(
    switchMap((isOverview) =>
      isOverview
        ? this.state.backlinkQueryParams$
        : this.state.returnParams$.pipe(
            map((returnparams) => {
              return { returnparams };
            })
          )
    )
  );

  constructor(
    public state: DossierStateService,
    public dossierGradesService: DossierGradesService
  ) {
    this.state.isOverview$.next(true);
    this.state.currentDossier$.next('overview');
  }
}
