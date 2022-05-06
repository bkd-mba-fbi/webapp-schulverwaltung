import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { DossierGradesService } from 'src/app/shared/services/dossier-grades.service';
import { DossierStateService } from '../../../services/dossier-state.service';
import { ReportsService } from '../../../services/reports.service';

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
    public dossierGradesService: DossierGradesService,
    public reportsService: ReportsService
  ) {}
}
