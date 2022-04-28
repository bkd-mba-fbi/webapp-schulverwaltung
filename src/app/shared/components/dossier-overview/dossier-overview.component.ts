import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DossierStateService } from '../../services/dossier-state.service';
import {
  StudentProfileBacklink,
  STUDENT_PROFILE_BACKLINK,
} from '../../tokens/student-profile-backlink';

@Component({
  selector: 'erz-dossier-overview',
  templateUrl: './dossier-overview.component.html',
  styleUrls: ['./dossier-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DossierOverviewComponent {
  constructor(
    @Inject(STUDENT_PROFILE_BACKLINK)
    public backlink: StudentProfileBacklink,
    public state: DossierStateService
  ) {
    this.state.isOverview$.next(true);
  }
}
