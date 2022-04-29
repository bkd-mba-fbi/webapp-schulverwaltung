import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { DossierStateService } from '../../../services/dossier-state.service';
import {
  StudentProfileBacklink,
  STUDENT_PROFILE_BACKLINK,
} from '../../../tokens/student-profile-backlink';

@Component({
  selector: 'erz-student-dossier',
  templateUrl: './student-dossier.component.html',
  styleUrls: ['./student-dossier.component.scss'],
  providers: [DossierStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierComponent {
  link$ = this.state.isOverview$.pipe(
    map((isOverview) => (isOverview ? this.backlink : ['.']))
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
    @Inject(STUDENT_PROFILE_BACKLINK)
    public backlink: StudentProfileBacklink,
    public state: DossierStateService
  ) {}
}
