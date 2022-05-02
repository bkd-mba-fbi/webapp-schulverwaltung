import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DossierStateService } from 'src/app/shared/services/dossier-state.service';
import {
  StudentDossierBacklink,
  STUDENT_DOSSIER_BACKLINK,
} from '../../../tokens/student-dossier-backlink';

@Component({
  selector: 'erz-dossier-overview',
  templateUrl: './dossier-overview.component.html',
  styleUrls: ['./dossier-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DossierOverviewComponent {
  constructor(
    @Inject(STUDENT_DOSSIER_BACKLINK)
    public backlink: StudentDossierBacklink,
    public state: DossierStateService
  ) {
    this.state.isOverview$.next(true);
  }
}
