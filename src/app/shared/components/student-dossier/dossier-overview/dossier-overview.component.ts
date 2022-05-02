import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DossierStateService } from 'src/app/shared/services/dossier-state.service';

@Component({
  selector: 'erz-dossier-overview',
  templateUrl: './dossier-overview.component.html',
  styleUrls: ['./dossier-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DossierOverviewComponent {
  constructor(public state: DossierStateService) {
    this.state.isOverview$.next(true);
  }
}
