import { Component } from '@angular/core';
import { DossierService } from '../../service/dossier.service';

@Component({
  selector: 'erz-dossier-overview',
  templateUrl: './dossier-overview.component.html',
  styleUrls: ['./dossier-overview.component.scss'],
})
export class DossierOverviewComponent {
  constructor(public service: DossierService) {}
}
