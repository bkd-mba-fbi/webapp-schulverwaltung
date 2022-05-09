import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DossierStateService } from 'src/app/shared/services/dossier-state.service';

@Component({
  selector: 'erz-dossier-addresses',
  templateUrl: './dossier-addresses.component.html',
  styleUrls: ['./dossier-addresses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DossierAddressesComponent {
  constructor(public state: DossierStateService) {
    this.state.isOverview$.next(false);
    this.state.currentDossier$.next('addresses');
  }
}
