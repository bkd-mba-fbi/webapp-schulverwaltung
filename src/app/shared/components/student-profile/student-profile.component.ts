import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { DossierStateService } from '../../services/dossier-state.service';
import {
  StudentProfileBacklink,
  STUDENT_PROFILE_BACKLINK,
} from '../../tokens/student-profile-backlink';

@Component({
  selector: 'erz-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss'],
  providers: [DossierStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileComponent {
  link$ = this.state.isOverview$.pipe(
    map((isOverview) => (isOverview ? this.backlink : ['..'])) // TODO how to move one up, add return params
  );

  // TODO check if confirm absences still work

  queryParams$ = this.state.isOverview$.pipe(
    switchMap((isOverview) =>
      isOverview
        ? this.state.backlinkQueryParams$
        : this.state.returnParams$.pipe(
            map((returnparams) => {
              returnparams;
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
